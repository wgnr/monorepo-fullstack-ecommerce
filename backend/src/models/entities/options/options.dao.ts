import { Types } from "mongoose"
import CommonDAO from "@models/entities/CommonDAO"
import { IOptions } from "@models/entities/options/options.interface"
import { OptionsModel } from "@models/entities/options/options.model"


class OptionsDAO extends CommonDAO<IOptions>{
  constructor() {
    super(OptionsModel)
  }

  async getOneByValueId(id: string) {
    this.mongoDebug("getOneByValueId", { id })

    return await this.model.findOne({
      "values._id": Types.ObjectId(id)
    }).orFail(this.throwNotFoundError({ id }))
  }

  async getManyByValuesId(ids: string[]) {
    this.mongoDebug("getManyByValuesId", { ids })

    return await this.getMany({
      "values._id": { $in: ids.map(id => Types.ObjectId(id)) }
    })
  }

  async getOneByName(name: string) {
    this.mongoDebug("getOneByName", { name })

    return await this.model.findOne({ name })
      .orFail(this.throwNotFoundError({ name }))
  }

  async addToSet(_id: string, values: string[]) {
    this.mongoDebug("addToSet", { _id, valuesArr: values })

    const parsedValues = values.map(value => ({ value }))

    return await this.updateOneById(_id,
      { $addToSet: { values: { $each: parsedValues } } })
  }

  async removeValues(_id: string, values: string | string[]) {
    this.mongoDebug("removeValues", { _id, values })

    return await this.updateOneById(_id, {
      $pull: {
        values: {
          value: Array.isArray(values) ? { $in: values } : values
        }
      }
    })
  }
}

export default new OptionsDAO
