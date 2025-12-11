import { Router } from "express";
import { userControllers } from "./user.controllers";
import auth from "../../middlewares/auth/auth";
import correctUserRequest from "../../middlewares/users/correctUserRequest";

const router = Router();



router.get('/', auth("admin"), userControllers.getAllUsers)
router.put('/:id', auth("admin", "customer"), correctUserRequest, userControllers.updateSingleUser)
router.delete('/:id', auth("admin"), userControllers.deleteSingleUser)
export const userRoutes = router;