import { Request, Response, NextFunction } from 'express'

const correctUserRequest = (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { role } = req.body;


    if (req.user?.role === "customer" && Number(req.user?.id) !== Number(id)) {
        return res.status(401).json({
            status: false,
            message: "Unauthorized access!"
        })
    }


    if (req.user?.role === "customer" && role && role !== "customer") {
        return res.status(401).json({
            status: false,
            message: "Customers cannot change role!"
        })
    }

    if (req.user?.role === "admin" && role && !["admin", "customer"].includes(role)) {
        return res.status(400).json({
            status: false,
            message: "Invalid role!"
        });
    }

    next()
}


export default correctUserRequest;