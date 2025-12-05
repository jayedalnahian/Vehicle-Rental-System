import { Request, Response, NextFunction } from 'express'
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../../config';

const auth = (...roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                status: false,
                message: "Unauthorized access! No token provided."
            })
        }



        const decoded = jwt.verify(token, config.jwtSecret) as JwtPayload;
        req.user = decoded
        console.log("decoded", decoded);

        console.log("roles", roles);


        if (roles.length && !roles.includes(decoded.role)) {
            return res.status(500).json({
                success: false,
                message: "Unauthorized!!"
            })
        }

        next()
    }
}


export default auth;