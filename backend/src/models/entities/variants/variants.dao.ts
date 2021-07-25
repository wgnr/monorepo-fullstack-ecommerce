import { Types } from "mongoose"
import CommonDAO from "@models/entities/CommonDAO"
import { IVariants } from "@models/entities/variants/variants.interfaces"
import { VariantsModel } from "@models/entities/variants/variants.model"

class VariantsDAO extends CommonDAO<IVariants> {
  constructor() {
    super(VariantsModel)
  }

  async getPopullatedById(id: string) {
    this.mongoDebug("getPopullatedById", { id })

    return await this.model.findById(id)
      .populate("product")
      .orFail(this.throwNotFoundError({ id }))
  }

  async getManyByOptionValueId(id: string) {
    this.mongoDebug("getManyByOptionValueId", { id })

    const query = { options: Types.ObjectId(id) }

    // @ts-ignore
    return await this.model.find(query)
      .orFail(this.throwNotFoundError({ id }))
  }

  async deleteById(variantId: string) {
    this.mongoDebug("deleteById", { variantId })

    const response = await this.model.deleteOne({ _id: variantId })
      .orFail(this.throwNotFoundError({ variantId }))

    return response.n

  }
}

export default new VariantsDAO
