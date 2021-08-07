import { IProductNew } from "@models/entities/products/products.interfaces";

export const mockProduct = (categories: any, options: any) => {
  const prodcuts: IProductNew[] = [
    {
      categories: [categories[0]._id],
      name: "Product X1234",
      price: 250,
      variants: [
        {
          stock: 45,
          options: [options[0].values[2]._id, options[1].values[1]._id],
        },
        {
          stock: 99,
          options: [options[0].values[2]._id, options[1].values[2]._id],
        },
        {
          stock: 110,
          options: [options[0].values[2]._id, options[1].values[3]._id],
        },
        {
          stock: 150,
          options: [options[0].values[1]._id, options[1].values[1]._id],
        },
      ],
    },
    {
      categories: [categories[0]._id],
      name: "Product YABCD",
      price: 14.55,
      variants: [
        {
          stock: 78,
          options: [options[1].values[2]._id, options[0].values[1]._id],
        },
        {
          stock: 79,
          options: [options[1].values[2]._id, options[0].values[2]._id],
        },
        {
          stock: 80,
          options: [options[1].values[2]._id, options[0].values[3]._id],
        },
        {
          stock: 81,
          options: [options[1].values[1]._id, options[0].values[1]._id],
        },
      ],
    },
  ];

  return [prodcuts];
};
