import { Router } from "express";
import { userControllers } from "./user.controllers";
import auth from "../../middlewares/auth/auth";

const router = Router();


router.post('/', userControllers.createUser)
router.get('/', auth(), userControllers.getAllUsers)

export const userRoutes = router;