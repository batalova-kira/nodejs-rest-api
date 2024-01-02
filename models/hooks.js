export const handleSaveError = (error, data, next) => {
    const { name, code } = error;

    error.status = name === "MongoServerError" && code === 11000 ? 409 : 400;

    if (error.status === 400) {
        error.message = "Помилка від Joi або іншої бібліотеки валідації";
    }

    next();
};

export const addUpdateById = function (next) {
    this.options.new = true;
    this.options.runValidators = true;
    next();
};
