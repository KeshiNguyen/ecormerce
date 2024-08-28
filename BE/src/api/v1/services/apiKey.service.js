import { APIKey } from "../models/index.model.js";

'use strict';

const findApiKey = async (key) => {
    const apiKey = await APIKey.findOne({apiKey: key, status: true}).lean();
    return apiKey
};

export { findApiKey };
