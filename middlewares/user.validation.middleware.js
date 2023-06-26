import {USER} from "../models/user.js";
import {userService} from "../services/userService.js";
import errorService from "../services/errorService.js";

const emailPattern = /^[a-z0-9._%+-]+@gmail\.com$/i;
const phoneNumberPattern = /^\+380\d{9}$/;

const fields = Object.keys(USER)
    .filter(key => key !== 'id');

const validateEmail = (email) => {
    if (
        !email ||
        !emailPattern.test(email)
    ) {
        throw new Error(
            "Invalid email (only @gmail.com domain is allowed)"
        );
    }
};

const validatePhoneNumber = (phoneNumber) => {
    if (!phoneNumber || !phoneNumberPattern.test(phoneNumber)) {
        throw new Error(
            "Invalid phone number, enter the number in this format: +380xxxxxxxxx."
        );
    }
};

const validatePassword = (password) => {
    if (password.length < 3) {
        throw new Error("There must be at least 3 characters in the password.");
    }
};

const validateFunctions = {
    email: validateEmail,
    phoneNumber: validatePhoneNumber,
    password: validatePassword
}

const checkBodyRequest = (body, model) => {
    console.log("model", model);
    fields.forEach(field => {
        if (body[field] && validateFunctions[field]) {
            validateFunctions[field](body[field]);
        }
    });
};

function checkFieldsExistInModel(req) {
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
}

const createUserValid = (req, res, next) => {
    const {email, phoneNumber} = req.body;

    try {
        if (Object.keys(req.body).length < Object.keys(USER).length - 1) {
            throw new Error("Invalid number of fields.");
        }

        checkFieldsExistInModel(req);

        checkBodyRequest(req.body, USER);

        if (req.body.id) {
            throw new Error("Id field is not allowed.");
        }

        const userEmail = userService.search({email: email.toLowerCase()});
        const userPhoneNumber = userService.search({phoneNumber});
        if (userEmail) {
            throw new Error(`User with email ${email} already exists.`);
        }
        if (userPhoneNumber) {
            throw new Error(`User with phone number ${phoneNumber} already exists.`);
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

        checkFieldsExistInModel(req);

        if (req.body.id) {
            throw new Error("Id field is not allowed.");
        }

        let userByEmail = null;
        if (req.body.email) {
            userByEmail = userService.search({email: req.body.email.toLowerCase()});
        }
        const userByPhoneNumber = userService.search({phoneNumber: req.body.phoneNumber});

        if (userByEmail && userByEmail.id !== id) {
            throw new Error(`User with email ${req.body.email} already exists.`);
        }
        if (userByPhoneNumber && userByPhoneNumber.id !== id) {
            throw new Error(`User with phone number ${req.body.phoneNumber} already exists.`);
        }

        checkBodyRequest(req.body, USER);
        res.data = {...req.body};
        next();
    } catch (err) {
        res.status(400)
            .send(errorService.formErrorJson(err.message));
    }
};

export {createUserValid, updateUserValid};
