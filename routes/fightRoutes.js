import {Router} from "express";
import {fightersService} from "../services/fightService.js";
import {responseMiddleware} from "../middlewares/response.middleware.js";

const router = Router();

router.get(
    "/",
    (req, res, next) => {
        try {
            res.data = fightersService.findAll();
            res.status(200);
        } catch (err) {
            res.err = err;
            res.status(400);
        } finally {
            next();
        }
    },
    responseMiddleware
);

router.get(
    "/:id",
    (req, res, next) => {
        const {id} = req.params;

        try {
            let data = fightersService.search({id});
            res.data = data;
            if (data) {
                res.status(200);
            } else {
                res.status(404);
            }
        } catch (err) {
            res.err = err;
            res.status(400);
        } finally {
            next();
        }
    },
    responseMiddleware
);

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
