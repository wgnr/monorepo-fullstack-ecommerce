import { Request, Response } from "express";
import { GlobalVars } from "@config/index";

export const configController = (req: Request, res: Response) => {
  const vars = JSON.parse(JSON.stringify(GlobalVars));
  recursiveRemoveKey(vars, ["password", "token", "secret"]);
  res.json(vars);
};

const recursiveRemoveKey = (object: { [k: string]: any }, deleteKeys: string[]) => {
  Object.entries(object).forEach(([k, v]) => {
    if (deleteKeys.some(deleteKey => k.toLowerCase().includes(deleteKey.toLowerCase()))) {
      delete object[k];
      return;
    }

    if (typeof v === "object" && v !== null) recursiveRemoveKey(v, deleteKeys);
  });
};
