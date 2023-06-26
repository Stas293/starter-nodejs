class ErrorService {
    formErrorJson(message) {
        return {
            error: true,
            message
        }
    }
}

const errorService = new ErrorService();

export default errorService;
