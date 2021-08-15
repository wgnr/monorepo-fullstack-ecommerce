export const collectionName = "user";
import { hash, compare } from "bcryptjs";
import {
  model,
  Schema,
  Model,
  SchemaOptions,
  HookNextFunction,
  Date,
} from "mongoose";
import {
  IUser,
  IUserDocument,
  UserType,
} from "@models/entities/users/users.interface";

const UsersSchemaOptions: SchemaOptions = {
  versionKey: false,
  timestamps: true,
  toJSON: {
    virtuals: true,
    getters: true,
  },
  toObject: {
    virtuals: true,
    getters: true,
  },
};

const UsersSchema = new Schema<IUser>(
  {
    currentCart: {
      type: Schema.Types.ObjectId,
      ref: "cart",
    },
    email: {
      type: String,
      // require: true,
      unique: true,
      trim: true,
    },
    firstName: String,
    lastName: String,
    phone: String,
    deletedAt: Date,
    password: {
      type: String,
    },
    social: { type: Object },
    type: {
      type: String,
      enum: Object.values(UserType),
      default: UserType.USER,
    },
  },
  UsersSchemaOptions
);

UsersSchema.pre(
  "save",
  async function (this: IUserDocument, next: HookNextFunction) {
    if (!this.isModified("password")) return next();

    const passwordHashed = await hash(this.password!, 10);
    this.password = passwordHashed;

    return next();
  }
);

UsersSchema.methods.isValidPassword = async function (
  this: IUserDocument,
  password: string
) {
  return await compare(password, this.password!).catch(e => false);
};

export const UsersModel: Model<IUser> = model<IUser>(collectionName, UsersSchema);
