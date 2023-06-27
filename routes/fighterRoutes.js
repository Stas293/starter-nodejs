import {Router} from "express";
import {fighterService} from "../services/fighterService.js";
import {responseMiddleware} from "../middlewares/response.middleware.js";
import {createFighterValid, updateFighterValid,} from "../middlewares/fighter.validation.middleware.js";

const router = Router();

router.get(
    "/",
    (req, res, next) => {
        try {
            res.data = fighterService.findAll();
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
            let data = fighterService.search({id});
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
    createFighterValid,
    (req, res, next) => {
        try {
            res.data = fighterService.save(req.body);
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

router.put(
    "/:id",
    updateFighterValid,
    (req, res, next) => {
        const {id} = req.params;

        try {
            res.data = fighterService.update(id, req.body);
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

router.delete(
    "/:id",
    (req, res, next) => {
        const {id} = req.params;

        try {
            res.data = fighterService.delete(id);
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

export {router};
