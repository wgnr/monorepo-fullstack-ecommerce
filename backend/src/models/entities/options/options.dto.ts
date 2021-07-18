import { INewOption, IOptions } from "@models/entities/options/options.interface"

export class OptionsDTO {
  static new(optionData: INewOption) {
    const values = Array.from(new Set(optionData.values))
      .map(value => ({ value }));

    return {
      name: optionData.name,
      values
    }
  }

  static get({ name, values }: IOptions) {
    return { name, values }
  }
}
