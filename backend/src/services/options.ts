import { OptionsModel } from "@models/entities/options/options.model"
import { OptionsDTO } from "@models/entities/options/options.dto"
import { INewOption, IOptions, valueType } from "@models/entities/options/options.interface"
import OptionsDAO from "@models/entities/options/options.dao"
import { ValidationException } from "@exceptions/index"

class OptionsService {

  async getAll() {
    return await OptionsDAO.getMany()
  }

  async getById(id: string) {
    return await OptionsDAO.getOneById(id)
  }

  async getByName(name: string) {
    return await OptionsDAO.getOneByName(name)
  }

  async getByValuesId(ids: string | string[]) {
    return Array.isArray(ids) ?
      await OptionsDAO.getManyByValuesId(ids) :
      await OptionsDAO.getOneByValueId(ids)
  }

  async create(option: INewOption) {
    const newOption = OptionsDTO.new(option)
    return await OptionsModel.create(newOption)
  }

  async addValues(optionId: string, values: string | string[]) {
    const option = await OptionsDAO.getOneById(optionId)
    const valuesArray = Array.isArray(values) ? values : [values]

    await this.validateDuplicatedValues(option, valuesArray)

    return await OptionsDAO.addToSet(optionId, valuesArray)
  }

  async validateDuplicatedValues(option: IOptions, values: valueType | valueType[]) {
    const valuesArray = Array.isArray(values) ? values : [values]

    for (const value of valuesArray) {
      for (const { value: optionValue } of option.values) {
        if (optionValue === value)
          throw new ValidationException(`Option value '${value}' already exists in '${option.name}'`)
      }
    }
  }

  async removeValues(optionId: string, valuesId: string | string[]) {
    await OptionsDAO.removeValues(optionId, valuesId)
  }

  async validateAllOptionsExists(optionName: string, incomeValues: string[]) {
    const option = await this.getByName(optionName);

    for (const incomeValue of incomeValues) {
      let valueWasFound = false;

      for (const { value: optionValue } of option.values) {
        if (optionValue === incomeValue) {
          valueWasFound = true
          break
        }
      }

      if (!valueWasFound)
        throw new ValidationException(`Option value '${incomeValue}' was not found in '${option.name}'`)
    }
  }
}

export default new OptionsService
