import { Model, FilterQuery, ObjectId, UpdateQuery } from "mongoose";
import { inspect } from "util"
import { GlobalVars } from "@config/globalVars";

const { debug: { SHOW_MONGO_ACTIONS } } = GlobalVars

export default abstract class CommonDAO<T> {
  constructor(protected readonly model: Model<T>) { }

  async create(entity: T | T[]): Promise<T | T[]> {
    this.mongoDebug("create", arguments)
    return await this.model.create(entity)
  }

  async getOneById(id: string | ObjectId): Promise<T | null> {
    this.mongoDebug("getOneById", arguments)
    return await this.model.findById(id)
  }


  async getMany(filter: FilterQuery<T> = {}): Promise<T[]> {
    this.mongoDebug("getMany", arguments)
    return await this.model.find(filter)
  }

  async updateOneById(id: string | ObjectId, payload: UpdateQuery<T>): Promise<T | null> {
    this.mongoDebug("updateOneById", arguments)
    return await this.model.findByIdAndUpdate(id, payload, { new: true })
  }

  async updateMany(filter: FilterQuery<T>, payload: T): Promise<T[] | null> {
    this.mongoDebug("updateMany", arguments)
    const result = await this.model.updateMany(filter, payload)
    return this.getMany(filter)
  }

  async delete(filter: FilterQuery<T> | string): Promise<number> {
    this.mongoDebug("delete", arguments)
    const deletedAt = { deletedAt: new Date() } as any
    let result = 0

    if (typeof filter === "string") {
      const x = await this.model.findByIdAndUpdate(filter, deletedAt)
      if (x !== null) result++
    } else {
      result = (await this.model.updateMany(filter, deletedAt)).n
    }
    return result
  }

  protected mongoDebug(fnName: string, ...data: any[]) {
    if (!SHOW_MONGO_ACTIONS) return
    console.log(inspect({ model: this.model.modelName, function: fnName, data }, false, 6, true))
  }
}