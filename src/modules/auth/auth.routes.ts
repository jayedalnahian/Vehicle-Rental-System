import { Router } from "express";
import { authControllers } from "./auth.controllers";

const router = Router();


router.post('/signin', authControllers.createLogin)


export const authRoutes = router;