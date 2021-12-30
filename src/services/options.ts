import {
  IOptions,
  valueType,
  IOptionNew,
  IOptionsDocument,
  IOptionSummary,
} from "@models/entities/options/options.interface";
import OptionsDAO from "@models/entities/options/options.dao";
import { ValidationException } from "@exceptions/index";
import VariantsService from "@services/variants";

class OptionsService {
  async getAll() {
    return await OptionsDAO.getMany();
  }

  async getById(id: string) {
    return await OptionsDAO.getOneById(id);
  }

  async getByName(name: string) {
    return await OptionsDAO.getOneByName(name);
  }

  async getManyByValuesId(ids: string[]) {
    return await OptionsDAO.getManyByValuesId(ids);
  }

  async getByValueId(id: string) {
    return await OptionsDAO.getOneByValueId(id);
  }

  async getOptionNameAndValueByValueId(id: string): Promise<IOptionSummary> {
    const option = (await this.getByValueId(id)) as IOptionsDocument;
    const value = option.values.find(value => String(value._id) === id)!;

    return {
      option: {
        id: option._id as string,
        name: option.name,
      },
      value: {
        id: value._id as string,
        name: value.value,
      },
    };
  }

  async create(option: IOptionNew) {
    const newOption = {
      ...option,
      values: [...new Set(option.values)].map(value => ({ value })),
    };
    return await OptionsDAO.create(newOption);
  }

  async addValues(optionId: string, values: string | string[]) {
    const option = await OptionsDAO.getOneById(optionId);
    const valuesArray = Array.isArray(values) ? values : [values];

    this.validateDuplicatedValues(option, valuesArray);

    return await OptionsDAO.addToSet(optionId, valuesArray);
  }

  validateDuplicatedValues(option: IOptions, values: valueType | valueType[]) {
    const valuesArray = Array.isArray(values) ? values : [values];

    for (const value of valuesArray) {
      for (const { value: optionValue } of option.values) {
        if (optionValue === value)
          throw new ValidationException(
            `Option value '${value}' already exists in '${option.name}'`
          );
      }
    }
  }

  async removeValues(optionId: string, valuesId: string[]) {
    await this.validateIfOptionsValuesAreUsed(valuesId);

    await OptionsDAO.removeValues(optionId, valuesId);
  }

  async validateIfOptionsValuesAreUsed(valuesId: string[]) {
    // Check if value id is used by any variant
    const result = await Promise.allSettled(
      valuesId.map(valueId => VariantsService.getManyByOptionValueId(valueId))
    );
    const valuesIdInVariants = result
      .map((r, index) => (r.status === "fulfilled" ? valuesId[index] : null))
      .filter(r => r);

    if (valuesIdInVariants.length > 0) {
      throw new ValidationException(
        `Options values are still being used in products. Can't delete until they are removed. Ids: ${valuesIdInVariants.join(
          ", "
        )}`
      );
    }
  }

  async remove(optionId: string) {
    const option = (await OptionsDAO.getOneById(
      optionId,
      false
    )) as IOptionsDocument;
    const valuesIds = option.values.map(v => v.id);
    await this.validateIfOptionsValuesAreUsed(valuesIds);
    await option.delete();
  }

  // Pending to check..

  // async validateAllOptionsExists(optionName: string, incomeValues: string[]) {
  //   const option = await this.getByName(optionName);

  //   for (const incomeValue of incomeValues) {
  //     let valueWasFound = false;

  //     for (const { value: optionValue } of option.values) {
  //       if (optionValue === incomeValue) {
  //         valueWasFound = true
  //         break
  //       }
  //     }

  //     if (!valueWasFound)
  //       throw new ValidationException(`Option value '${incomeValue}' was not found in '${option.name}'`)
  //   }
  // }

  /**
   * Check if:
   * - Options values exists
   * - Each option value is unique in its option
   * @param valueIds Options values ids
   */
  async validateOptionsUsedAreUnique(valueIds: string | string[] | undefined) {
    if (!valueIds || valueIds?.length === 0) return;
    const valueIdsArr = Array.isArray(valueIds) ? valueIds : [valueIds];

    // Check if all valuesIds exists
    const options = await Promise.all(
      valueIdsArr.map(id => OptionsDAO.getOneByValueId(id))
    );

    // optionsIds has to be unique per option
    const uniqueOptionsIds = [...new Set(options.map(o => o._id))];
    if (
      uniqueOptionsIds.some(
        uId => options.filter(option => option.id === uId).length > 1
      )
    ) {
      throw new ValidationException(
        "Two or more option values belongs to the same option"
      );
    }
  }
}

export default new OptionsService();
