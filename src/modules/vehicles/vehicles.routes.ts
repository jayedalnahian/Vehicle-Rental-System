import { Router } from "express";
import { vehiclesControllers } from "./vehicles.controllers";
import auth from "../../middlewares/auth/auth";

const router = Router();


router.post("/", auth("admin"), vehiclesControllers.createVehicle);


export const vehiclesRouter = router;