import {Router} from "express";
import {userService} from "../services/userService.js";
import {createUserValid, updateUserValid,} from "../middlewares/user.validation.middleware.js";
import {responseMiddleware} from "../middlewares/response.middleware.js";

const router = Router();

router.get(
    "/",
    (req, res, next) => {
        try {
            res.data = userService.findAll();
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
            let data = userService.search({id});
            if (data) {
                res.status(200);
            } else {
                res.status(404);
            }
            res.data = data;
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
    createUserValid,
    (req, res, next) => {
        const {firstName, lastName, email, phoneNumber, password} = req.body;

        try {
            res.data = userService.save({
                firstName,
                lastName,
                email,
                phoneNumber,
                password,
            });
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
    updateUserValid,
    (req, res, next) => {
        const {id} = req.params;

        try {
            res.data = userService.update(id, req.body);
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
            res.data = userService.delete(id);
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
