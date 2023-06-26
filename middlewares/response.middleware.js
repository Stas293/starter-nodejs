import errorService from "../services/errorService.js";

const responseMiddleware = (req, res, next) => {
    if (res.err) {
        const {message} = res.err;
        console.log("message", message);
        return res.json(errorService.formErrorJson(message));
    }
    console.log("responseMiddleware res.data", res.data);
    return res.json(res.data);
};

export {responseMiddleware};
