import { Server as HttpServer } from "http";
import { LeanDocument } from "mongoose";
import { Server } from "socket.io";
import { verify } from "jsonwebtoken"
import { GlobalVars } from "@config/index";
import { ISingleMessage } from "@models/entities/chat/chat.interface";
import { IUserDocument, UserType } from "@models/entities/users/users.interface";
import CartsService from "@services/cart"
import ChatsDAO from "@models/entities/chat/chat.dao";
import ChatsService from "@services/chat"
import OrdersService from "@services/orders"
import UsersService from "@services/users"

const { auth: { jwt: { JWT_TOKEN_SECRET } } } = GlobalVars

interface SocketData {
  user: LeanDocument<IUserDocument>;
  isAdmin: boolean;
  toUser: string;
}

class ChatService {
  async getByUserId(userId: string) {
    const chat = await ChatsDAO.getByTo(userId)
    return chat?.messages || []
  }

  async fetchAllMessages(userId: string) {
    const chat = await ChatsDAO.getByTo(userId)
    if (!chat) {
      await ChatsDAO.create({ to: userId })
      return []
    }

    return chat.messages
  }

  async persistMessage(toUser: string, msg: ISingleMessage) {
    const chat = await ChatsDAO.insertMessage(toUser, msg)
  }

  initSocketIO(httpServer: HttpServer) {
    const io = new Server(httpServer);
    io.use(function (socket, next) {
      const { handshake: { query: { token, to: toUser } } } = socket
      console.log({ token, toUser })

      if (!token || typeof (token) !== "string") {
        return next(new Error('Authentication error'));
      }

      verify(token, JWT_TOKEN_SECRET, async function (err, decoded) {
        try {
          // @ts-ignore
          const { sub } = decoded
          if (err || !sub) return next(new Error('Authentication error'));

          const user = (await UsersService.getById(sub)).toJSON();

          const isAdmin = user.type === UserType.ADMIN
          if (isAdmin && !toUser) return next(new Error('Must include userId in To'));

          const data: SocketData = {
            user,
            isAdmin,
            toUser: isAdmin ? (toUser as string) : user.id
          };
          socket.data = data
          return next();
        } catch (err) {
          return next(err);
        }
      });
    })
      .on('connection', async function (socket) {
        // Connection now authenticated to receive further events
        const { user, isAdmin, toUser }: SocketData = socket.data

        const room = toUser
        socket.join(room)

        const messages = await ChatsService.fetchAllMessages(room)
        // socket.to(room).emit('message', messages)
        socket.emit('message', messages)

        socket.on('message', async function (message) {
          let msgResponse: ISingleMessage = {
            date: new Date(),
            msg: message.text.trim(),
            sender: isAdmin ? UserType.ADMIN : user.firstName
          }


          if (["/order", "/cart"].includes(msgResponse.msg.toLowerCase())) {
            try {
              if (msgResponse.msg.toLowerCase() === "/order")
                msgResponse.msg = JSON.stringify(await OrdersService.getOrdersByUserId(toUser), null, 2)
              else if (msgResponse.msg.toLowerCase() === "/cart")
                msgResponse.msg = JSON.stringify(await CartsService.getFullPopulatedById(user.currentCart), null, 2)
            } catch (err) {
              msgResponse.msg = "Empty"
            }
          } else {
            await ChatsService.persistMessage(toUser, msgResponse)
          }

          io.to(room).emit('message', msgResponse);
        });
      })
  }
}

export default new ChatService