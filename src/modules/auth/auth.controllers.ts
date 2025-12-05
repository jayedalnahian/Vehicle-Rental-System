import { Request, Response } from "express"
import { authServices } from "./auth.services"
import config from "../../config"
import jwt from "jsonwebtoken"
import { MyJwtPayload } from '../../types/jwt';

const createLogin = async (req: Request, res: Response) => {

    const { email, password } = req.body

    try {
        const result = await authServices.login(email, password)

        const token = jwt.sign({
            id: result.id,
            name: result.name,
            email: result.email,
            role: result.role
        }, config.jwtSecret, { expiresIn: '7d' })


        if (!token) {
            return res.status(500).json({
                success: false,
                message: "Login failed. Token generation error!"
            })
        }
        const decoded = jwt.verify(token, config.jwtSecret);
        req.user = decoded as MyJwtPayload;



        res.status(200).json({
            success: true,
            message: "Login successful!",
            data: {
                token: token,
                user: result
            }
        })

    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: "Login failed. Server error!",
            error: error.message
        })
    }
}


export const authControllers = { createLogin }