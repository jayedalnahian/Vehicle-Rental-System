//vehicles.routes.ts


import { Router } from "express";
import { vehiclesControllers } from "./vehicles.controllers";
import auth from "../../middlewares/auth/auth";

const router = Router();


router.post("/", auth("admin"), vehiclesControllers.createVehicle);

router.get("/", auth("admin", "customer"), vehiclesControllers.getAllVehicles)

router.get("/:vehicleId",auth("admin", "customer"), vehiclesControllers.getSingleVehicle)

router.put("/:vehicleId", auth("admin"), vehiclesControllers.updateSingleVehicle)

router.delete("/:vehicleId", auth("admin"), vehiclesControllers.deleteSingleVehicle)
export const vehiclesRouter = router;   