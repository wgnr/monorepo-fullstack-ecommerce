import Ajv, { JTDSchemaType } from "ajv/dist/jtd";
import { Request, Response, NextFunction } from "express";
import { JWTController } from "@auth/index";
import { isValidMongoId } from "@models/index";
import {
  IUpdateOption,
  IOptionNew,
  IDeleteOption,
} from "@models/entities/options/options.interface";
import { SchemaValidationException, ValidationException } from "@exceptions/index";
import OptionsService from "@services/options";

class OptionsControllers extends JWTController {
  selfResource(req: Request, res: Response, next: NextFunction): void {
    return next();
  }

  async getAllOrById(req: Request, res: Response, next: NextFunction) {
    const { optionId } = req.params;
    const { name } = req.query;
    let response;

    try {
      if (optionId) {
        response = await OptionsService.getById(optionId);
      } else if (typeof name === "string") {
        response = await OptionsService.getByName(name);
      } else {
        response = await OptionsService.getAll();
      }
      return res.json(response);
    } catch (error) {
      return next(error);
    }
  }

  validateMongoId(req: Request, res: Response, next: NextFunction) {
    const { optionId } = req.params;
    return next(optionId && isValidMongoId(optionId));
  }

  validateCreate(req: Request, res: Response, next: NextFunction) {
    const { body } = req;

    if (body.values?.length === 0) {
      return next(new ValidationException("values can't be empty"));
    }

    const schema: JTDSchemaType<IOptionNew> = {
      properties: {
        name: { type: "string" },
        values: {
          elements: { type: "string" },
        },
      },
    };

    const validate = new Ajv().compile<IOptionNew>(schema);
    if (!validate(body))
      return next(
        new SchemaValidationException("Option object", schema, validate.errors)
      );

    return next();
  }

  async create(req: Request, res: Response, next: NextFunction) {
    const { body } = req;
    try {
      return res.json(await OptionsService.create(body));
    } catch (error) {
      return next(error);
    }
  }

  validateUpdate(req: Request, res: Response, next: NextFunction) {
    const { body } = req;

    if (body.values?.length === 0) {
      return next(new ValidationException("values can't be empty"));
    }

    const schema: JTDSchemaType<IUpdateOption> = {
      properties: {
        values: {
          elements: { type: "string" },
        },
      },
    };

    const validate = new Ajv().compile<IUpdateOption>(schema);
    if (!validate(body))
      return next(
        new SchemaValidationException("Option object", schema, validate.errors)
      );

    return next();
  }

  async update(req: Request, res: Response, next: NextFunction) {
    const { optionId } = req.params;
    const { values } = req.body;

    try {
      return res.json(await OptionsService.addValues(optionId, values));
    } catch (error) {
      return next(error);
    }
  }

  validateRemove(req: Request, res: Response, next: NextFunction) {
    const { body } = req;

    const schema: JTDSchemaType<IDeleteOption> = {
      optionalProperties: {
        values: {
          elements: { type: "string" },
        },
      },
    };

    const validate = new Ajv().compile<IDeleteOption>(schema);
    if (!validate(body))
      return next(
        new SchemaValidationException("Option object", schema, validate.errors)
      );

    const { values } = req.body;
    if (values) {
      for (const valueId of values) {
        const errorFound = isValidMongoId(valueId);
        if (errorFound) return next(errorFound);
      }
    }

    return next();
  }

  async remove(req: Request, res: Response, next: NextFunction) {
    const { optionId } = req.params;
    const { values } = req.body;

    try {
      if (!values) {
        await OptionsService.remove(optionId);
      } else {
        await OptionsService.removeValues(optionId, values);
      }
      return res.sendStatus(204);
    } catch (error) {
      return next(error);
    }
  }
}

export default new OptionsControllers();
