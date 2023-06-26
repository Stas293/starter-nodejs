import {USER} from "../models/user.js";
import {userService} from "../services/userService.js";
import errorService from "../services/errorService.js";

const emailPattern = /^[a-z0-9._%+-]+@gmail\.com$/i;
const phoneNumberPattern = /^\+380\d{9}$/;

const fields = Object.keys(USER)
    .filter(key => key !== 'id');

const checkEmail = (email) => {
    if (
        !email ||
        !emailPattern.test(email)
    ) {
        throw new Error(
            "Invalid email and only @gmail.com domain is allowed."
        );
    }
};

const checkPhoneNumber = (phoneNumber) => {
    if (!phoneNumber || !phoneNumberPattern.test(phoneNumber)) {
        throw new Error(
            "Invalid phone number, enter the number in this format +380xxxxxxxxx."
        );
    }
};

const checkPassword = (password) => {
    if (password.length < 3) {
        throw new Error("There must be at least 3 characters in the password.");
    }
};

const checkFunctions = {
    email: checkEmail,
    phoneNumber: checkPhoneNumber,
    password: checkPassword
}

const checkBodyRequest = (body, model) => {
    console.log("model", model);
    fields.forEach(field => {
        if (body[field] && checkFunctions[field]) {
            checkFunctions[field](body[field]);
        }
    });
};

const createUserValid = (req, res, next) => {
    const {email, phoneNumber} = req.body;

    try {
        if (Object.keys(req.body).length < Object.keys(USER).length - 1) {
            throw new Error("Invalid number of fields.");
        }

        const requestedKeys = Object.keys(req.body);
        const initialKeys = Object.keys(USER);

        requestedKeys.forEach(item => {
            if (!initialKeys.includes(item)) {
                throw new Error(`Invalid field ${item}.`);
            }
            if (!req.body[item]) {
                throw new Error(`Empty field ${item}.`);
            }
        });

        checkBodyRequest(req.body, USER);

        const userEmail = userService.search({email});
        const userPhoneNumber = userService.search({phoneNumber});
        if (userEmail || userPhoneNumber) {
            throw new Error(`This user with an email or phone number already exist.`);
        }

        res.data = {...req.body};
        next();
    } catch (err) {
        res.status(400)
            .send(errorService.formErrorJson(err.message));
    }
};

const updateUserValid = (req, res, next) => {
    const {id} = req.params;

    try {
        const user = userService.search({id});
        if (id !== user?.id) {
            throw new Error(`User with id ${id} does not exist.`);
        }

        if (!Object.keys(req.body).length) {
            throw new Error("No fields to update.");
        }

        const requestedKeys = Object.keys(req.body);
        const initialKeys = Object.keys(USER);

        requestedKeys.forEach(item => {
            if (!initialKeys.includes(item)) {
                throw new Error(`Invalid field ${item}.`);
            }
            if (!req.body[item]) {
                throw new Error(`Empty field ${item}.`);
            }
        });

        checkBodyRequest(req.body, USER);
        res.data = {...req.body};
        next();
    } catch (err) {
        res.status(400)
            .send(errorService.formErrorJson(err.message));
    }
};

export {createUserValid, updateUserValid};
