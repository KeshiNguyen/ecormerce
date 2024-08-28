import omitEmpty from 'omit-empty';

const removeEmptyProperties = () => {
    return (req, res, next) => {
        req.body = omitEmpty(req.body);
        req.query = omitEmpty(req.query);
        req.params = omitEmpty(req.params);
        next();
    }
}

export { removeEmptyProperties };
