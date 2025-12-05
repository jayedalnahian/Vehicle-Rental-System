import "express";
import { MyJwtPayload } from "../jwt";

declare module "express" {
  export interface Request {
    user?: MyJwtPayload;
  }
}
