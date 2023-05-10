class AppError {
    public readonly message: string;
    public readonly statusCode: number;

    constructor(message: string, statusCode = 400) {
        this.message = message;
        this.statusCode = statusCode;
    }

    toJson() {
        return {
            statusCode: this.statusCode,
            message: this.message,
        };
    }
}

export default AppError;
