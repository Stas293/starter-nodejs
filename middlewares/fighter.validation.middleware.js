import {fighterService} from "../services/fighterService.js";
import {FIGHTER} from "../models/fighter.js";
import errorService from "../services/errorService.js";

const createFields = Object.keys(FIGHTER)
    .filter((key) => key !== "id" && key !== "health");

const validatePower = (power) => {
    if (
        !power ||
        isNaN(Number(power)) ||
        Number(power) < 1 ||
        Number(power) > 100
    ) {
        throw new Error("Power must be in the range 1 - 100.");
    }
};

const validateDefense = (defense) => {
    if (
        !defense ||
        isNaN(Number(defense)) ||
        Number(defense) < 1 ||
        Number(defense) > 10
    ) {
        throw new Error("Defence must be in the range 1 - 10.");
    }
};

const validateHealth = (health) => {
    if (
        !health ||
        isNaN(Number(health)) ||
        Number(health) < 80 ||
        Number(health) > 120
    ) {
        throw new Error("Health must be in the range 80 - 120.");
    }
}

const checkFunctions = {
    power: validatePower,
    defense: validateDefense,
    health: validateHealth
};

const checkBodyRequest = (body, model) => {
    for (let key in model) {
        if (body[key] && checkFunctions[key]) {
            checkFunctions[key](body[key]);
        }
    }
};

const checkCreateFields = (body) => {
    for (let key in createFields) {
        if (!body.hasOwnProperty(createFields[key])) {
            throw new Error(`No field ${createFields[key]}.`);
        }
    }
}

const createFighterValid = (req, res, next) => {
    const {name} = req.body;

    try {
        const fighter = fighterService.search({name});
        if (name === fighter?.name) {
            throw new Error(`This fighter ${name} has already been created. `);
        }

        if (Object.keys(req.body).length < Object.keys(FIGHTER).length - 2) {
            throw new Error("Invalid number of fields.");
        }
        checkCreateFields(req.body);

        const requestedKeys = Object.keys(req.body);
        const initialKeys = Object.keys(FIGHTER);

        requestedKeys.forEach(item => {
            if (!initialKeys.includes(item)) {
                throw new Error(`Invalid field ${item}.`);
            }
            if (!req.body[item]) {
                throw new Error(`Empty field ${item}.`);
            }
        });

        checkBodyRequest(req.body, FIGHTER);
        res.data = {...req.body};
        next();
    } catch (err) {
        res.status(400)
            .send(errorService.formErrorJson(err.message));
    }
};

const updateFighterValid = (req, res, next) => {
    const {id} = req.params;

    try {
        const fighter = fighterService.search({id});
        if (id !== fighter?.id) {
            throw new Error(`This fighter id ${id} was not found.`);
        }

        if (!Object.keys(req.body).length) {
            throw new Error("No fields to update.");
        }

        const requestedKeys = Object.keys(req.body);
        const initialKeys = Object.keys(FIGHTER);

        requestedKeys.forEach(item => {
            if (!initialKeys.includes(item)) {
                throw new Error(`Invalid field ${item}.`);
            }
            if (!req.body[item]) {
                throw new Error(`Empty field ${item}.`);
            }
        });

        checkBodyRequest(req.body, FIGHTER);

        res.data = {...req.body};
        next();
    } catch (err) {
        res.status(400)
            .send(errorService.formErrorJson(err.message));
    }
};

export {createFighterValid, updateFighterValid};
