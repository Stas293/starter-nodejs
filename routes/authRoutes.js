import {Router} from "express";
import {authService} from "../services/authService.js";
import {responseMiddleware} from "../middlewares/response.middleware.js";

const router = Router();

router.post(
    "/login",
    (req, res, next) => {
        try {
            res.data = authService.login(req.body);
            res.status(200);
        } catch (err) {
            res.err = err;
            res.status(401);
        } finally {
            next();
        }
    },
    responseMiddleware
);

export {router};
