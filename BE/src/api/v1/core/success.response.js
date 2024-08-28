import { ReasonPhrases, StatusCode } from '../utils/http_status_code/httpStatusCode.js';

'use strict'

class SuccessResponse {
    constructor({message, statusCode = StatusCode.OK, reasonStatusCode = ReasonPhrases.OK, metadata = {}}) {
        this.message = !message ? reasonStatusCode : message;
        this.status = statusCode;
        this.metadata = metadata;
    }

    send (res, headers = {}) {
        return res.status(this.status).json(this)
    }
}

class OK extends SuccessResponse {
    constructor({message, metadata = {}}) {
        super({message, statusCode: StatusCode.OK, reasonStatusCode: ReasonPhrases.OK, metadata});
    }
}

class CREATED extends SuccessResponse {
    constructor({message, statusCode = StatusCode.CREATED, reasonStatusCode = ReasonPhrases.CREATED, metadata = {}}) {
        super({message, statusCode, reasonStatusCode, metadata});
    }
}

export { CREATED, OK, SuccessResponse };
