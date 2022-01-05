import { Model, FilterQuery, ObjectId, UpdateQuery } from "mongoose";
import { inspect } from "util";
import { GlobalVars } from "@config/globalVars";
import NotFoundException from "@exceptions/NotFoundException";

const {
  debug: { SHOW_MONGO_ACTIONS },
} = GlobalVars;

export default abstract class CommonDAO<T> {
  constructor(protected readonly model: Model<T>) {}

  async create(entity?: T | T[]) {
    this.mongoDebug("create", { entity });

    return await this.model.create(entity);
  }

  async getOneById(id: string | ObjectId, useLean: boolean = true) {
    this.mongoDebug("getOneById", { id, useLean });

    return await this.model
      .findById(id)
      .lean(useLean)
      .orFail(this.throwNotFoundError({ id }));
  }

  async getMany(filter: FilterQuery<T> = {}) {
    this.mongoDebug("getMany", { filter });

    return await this.model
      .find(filter)
      .lean()
      .orFail(this.throwNotFoundError({ filter }));
  }

  async updateOneById(id: string | ObjectId, payload: UpdateQuery<T>) {
    this.mongoDebug("updateOneById", { id, payload });

    return await this.model
      .findByIdAndUpdate(id, payload, { new: true })
      .lean()
      .orFail(this.throwNotFoundError({ id }));
  }

  async updateMany(filter: FilterQuery<T>, payload: T) {
    this.mongoDebug("updateMany", { filter, payload });

    await this.model.updateMany(filter, payload);
    return this.getMany(filter);
  }

  async delete(
    filter: FilterQuery<T> | string,
    payload: UpdateQuery<T>
  ): Promise<number> {
    this.mongoDebug("delete", { filter, payload });

    let result = 0;

    if (typeof filter === "string") {
      const x = await this.model.findByIdAndUpdate(filter, payload);
      if (x !== null) result++;
    } else {
      result = (await this.model.updateMany(filter, payload)).n;
    }
    return result;
  }

  protected mongoDebug(fnName: string, data: {}) {
    if (!SHOW_MONGO_ACTIONS) return;
    console.table({
      DB: this.model.db.name,
      Collection: this.model.collection.collectionName,
      Function: fnName,
    });
    console.log("Function parameters:", inspect(data, false, 5, true));
  }

  protected throwNotFoundError(filter: {}) {
    return new NotFoundException(this.model.collection.collectionName, filter);
  }
}
