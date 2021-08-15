import Ajv, { JTDSchemaType } from "ajv/dist/jtd";
import { Request, Response, NextFunction } from "express";
import { JWTController } from "@auth/index";
import { ICartAddItem } from "@models/entities/carts/carts.interface";
import { isValidMongoId } from "@models/index";
import { IUser } from "@models/entities/users/users.interface";
import { SchemaValidationException, ValidationException } from "@exceptions/index";
import CartsService from "@services/cart";

class CartsControllers extends JWTController {
  selfResource(req: Request, res: Response, next: NextFunction): void {
    const user = req.user as IUser;
    const {
      params: { cartId },
    } = req;

    if (req.isUnauthenticated()) return next("Unauthenticated");

    if (JWTController.isAdmin(user)) {
      res.locals.isAdmin = { ...res.locals, isAdmin: true };
      return next();
    }

    if (String(user.currentCart) !== cartId) return next("That's not yours.");

    return next();
  }

  async getOneOrAll(req: Request, res: Response, next: NextFunction) {
    const {
      query: { status },
    } = req;
    const {
      params: { cartId },
    } = req;
    let response;

    try {
      if (cartId) {
        response = await CartsService.getById(cartId);
      } else if (typeof status === "string") {
        response = await CartsService.getByStatus(status);
      } else {
        response = await CartsService.getAll();
      }
      return res.json(response);
    } catch (error) {
      return next(error);
    }
  }

  async validateAddOrUpdateVariant(req: Request, res: Response, next: NextFunction) {
    const items: ICartAddItem[] = req.body;

    const schema: JTDSchemaType<ICartAddItem[]> = {
      elements: {
        properties: {
          variantId: { type: "string" },
          quantity: { type: "int32" },
        },
        optionalProperties: {
          comment: { type: "string" },
        },
      },
    };

    const validate = new Ajv().compile<ICartAddItem[]>(schema);
    if (!validate(items))
      return next(
        new SchemaValidationException("Category", schema, validate.errors)
      );

    for (const item of items) {
      const errorFound = isValidMongoId(item.variantId);
      if (errorFound) return next(errorFound);
      if (!(item.quantity > 0))
        return next(
          new ValidationException(
            `Item ${item.variantId} quantity must be possite. Current value ${item.quantity}`
          )
        );
    }

    return next();
  }

  async addOrUpdateVariant(req: Request, res: Response, next: NextFunction) {
    const { cartId } = req.params;
    const items: ICartAddItem[] = req.body;

    try {
      return res.json(await CartsService.upsertProducts(cartId, items));
    } catch (error) {
      return next(error);
    }
  }

  async removeVariant(req: Request, res: Response, next: NextFunction) {
    const { cartId, variantId } = req.params;
    try {
      return res.json(await CartsService.removeVariant(cartId, variantId));
    } catch (error) {
      return next(error);
    }
  }
  async clear(req: Request, res: Response, next: NextFunction) {
    const { cartId } = req.params;
    try {
      return res.json(await CartsService.clear(cartId));
    } catch (error) {
      return next(error);
    }
  }

  validateMongoId(req: Request, res: Response, next: NextFunction) {
    const { cartId, variantId } = req.params;
    let errorFlag = null;
    if (cartId) {
      errorFlag = isValidMongoId(cartId);
    }
    if (variantId) {
      errorFlag = isValidMongoId(variantId);
    }
    return next(errorFlag);
  }
}

export default new CartsControllers();
