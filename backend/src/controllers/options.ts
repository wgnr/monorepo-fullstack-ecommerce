import Ajv, { JTDSchemaType } from "ajv/dist/jtd"
import { Request, Response, NextFunction } from "express";
import OptionsService from "@services/options"
import { INewOption, IUpdateOption } from "@models/entities/options/options.interface"
import { SchemaValidationException, ValidationException } from "@exceptions/index";
import { isValidMongoId } from "@models/index"

class OptionsControllers {
  async getAllOrById(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params
    const { name } = req.query
    let response

    try {
      if (id) {
        response = await OptionsService.getById(id)
      } else if (typeof name === "string") {
        response = await OptionsService.getByName(name)
      } else {
        response = await OptionsService.getAll()
      }
      return res.json(response)
    } catch (error) {
      return next(error)
    }
  }

  validateMongoId(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params
    return next(id && isValidMongoId(id))
  }

  validateCreate(req: Request, res: Response, next: NextFunction) {
    const { body } = req

    if (body.values.length === 0) {
      return next(new ValidationException("values can't be empty"))
    }

    const schema: JTDSchemaType<INewOption> = {
      properties: {
        name: { type: "string" },
        values: {
          elements: { type: "string" },
        }
      }
    }

    const validate = new Ajv().compile<INewOption>(schema)
    if (!validate(body))
      return next(new SchemaValidationException("Option object", schema, validate.errors))

    return next()
  }

  async create(req: Request, res: Response, next: NextFunction) {
    const { body } = req
    try {
      return res.json(await OptionsService.create(body))
    } catch (error) {
      return next(error)
    }
  }

  validateUpdateAndRemove(req: Request, res: Response, next: NextFunction) {
    const { body } = req

    if (body.values?.length === 0) {
      return next(new ValidationException("values can't be empty"))
    }

    const schema: JTDSchemaType<IUpdateOption> = {
      properties: {
        values: {
          elements: { type: "string" },
        },
      }
    }

    const validate = new Ajv().compile<IUpdateOption>(schema)
    if (!validate(body))
      return next(new SchemaValidationException("Option object", schema, validate.errors))

    return next()
  }

  async update(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params
    const { values } = req.body

    try {
      return res.json(await OptionsService.addValues(id, values))
    } catch (error) {
      return next(error)
    }
  }

  async remove(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params
    const { values } = req.body

    try {
      await OptionsService.removeValues(id, values)
      return res.sendStatus(204)
    } catch (error) {
      return next(error)
    }
  }
}


export default new OptionsControllers
