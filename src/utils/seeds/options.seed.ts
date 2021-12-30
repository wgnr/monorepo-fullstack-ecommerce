import { IOptionNew } from "@models/entities/options/options.interface";

export const mockOptions: IOptionNew[] = [
  {
    name: "size",
    values: ["XS", "S", "M", "L", "XL", "XXL"],
  },
  {
    name: "color",
    values: ["brown", "red", "white", "yellow", "black", "blue"],
  },
];
