import {Router} from "express";
import {fightersService} from "../services/fightService.js";
import {responseMiddleware} from "../middlewares/response.middleware.js";

const router = Router();

router.post(
    "/",
    (req, res, next) => {

        try {
            res.data = fightersService.save(req.body);
            res.status(201);
        } catch (err) {
            res.err = err;
            res.status(400);
        } finally {
            next();
        }
    },
    responseMiddleware
);

export {router};
