'use strict'
import _ from 'lodash'

const getInfoData = ({fields = [], object = {} }) => {
    return _.pick(object, fields)
}

const getSelectData = (select = []) => {
    return Object.fromEntries(select.map(el => [el, 1]))
}

const unGetSelectData = (select = []) => {
    return Object.fromEntries(select.map(el => [el, 0]))
}

const removeUndefined = obj => {
    Object.keys(obj).forEach(key => obj[key] == null && delete obj[key]);
    return obj
}

/**
 * Recursively updates nested objects with the values from the `updateFields` object.
 *
 * @param {Object} options - An object containing the target object and the update fields.
 * @param {Object} options.target - The target object to update.
 * @param {Object} options.updateFields - The object containing the updated fields.
 * @returns {Object} - The updated target object.
 */
const updateNestedObjectParser = ({ target, updateFields }) => {
    // Iterate over each key in the target object.
    for (let key in target) {
        // If the value is a plain object, recursively update it.
        if (_.isPlainObject(target[key])) {
            target[key] = updateNestedObjectParser({
                target: target[key],
                updateFields: updateFields[key]
            });
        }
        // If the key exists in the update fields, update the value.
        else if (key in updateFields) {
            target[key] = updateFields[key];
        }
    }
    // Return the updated target object.
    return target;
}

/**
 * Recursively updates nested objects with the values from the `updateFields` object.
 * 
 * @param {Object} options - An object containing the target object and the update fields.
 * @param {Object} options.target - The target object to update.
 * @param {Object} options.updateFields - The object containing the updated fields.
 * @returns {Object} - The updated target object.
 */
const updateNestedObjectParserV2 = ({ target, updateFields }) => {
    // Recursively merge the target and update fields objects, merging nested objects as well.
    // If the target value is a plain object and the source value is also a plain object,
    // recursively update the nested object. Otherwise, return the source value or the target value if the source value is undefined.
    return _.mergeWith({}, target, updateFields, (targetValue, srcValue) => {
        if (_.isPlainObject(targetValue) && _.isPlainObject(srcValue)) {
            return updateNestedObjectParserV2({target: targetValue, updateFields: srcValue})
        }
        return srcValue !== undefined ? srcValue : targetValue
    });
}

const findOneInArray = (arr, target) => {
    return arr.some(item => target.includes(item));
}
export {
    findOneInArray, getInfoData,
    getSelectData, removeUndefined, unGetSelectData,
    updateNestedObjectParser,
    updateNestedObjectParserV2
}

