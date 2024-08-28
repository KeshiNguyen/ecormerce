import _ from 'lodash';

const updateNestedObjectParserV2 = ({ target, updateFields }) => {
    return _.mergeWith({}, target, updateFields, (targetValue, srcValue) => {
        if (_.isPlainObject(targetValue) && _.isPlainObject(srcValue)) {
            return updateNestedObjectParserV2({target: targetValue, updateFields: srcValue})
        }
        return srcValue !== undefined ? srcValue : targetValue
    });
}

const data = {
   "_id": "66a52e464cbd8a693bfcf496",
        "product_name": " ao nam thuu dong chat luong hoàn ",
        "product_thumb": "New_Jeans_link",
        "product_description": "Quan ao nam thuu dong chat luong cao",
        "product_price": 40,
        "product_quantity": 5,
        "product_type": "clothing",
        "product_shop": "669e6c89149886e8efbb8295",
        "product_attributes": {
            "brand": "shopee",
            "size": "XLL",
            "material": "denim",
            "color": "red"
        },
        "product_ratingAverage": 4.5,
        "product_variations": [],
        "createdAt": "2024-07-27T17:28:38.335Z",
        "updatedAt": "2024-07-29T13:36:06.595Z",
        "product_slug": "quann-ao-phu-nu-thuu-dong-hat-luong-ccao",
        "__v": 0,
        "id": "66a52e464cbd8a693bfcf496"
}

const updateFields = {
    "product_name": "Quan ao nam thuu dong chat luong cao gia re nhat viet Nam ",
    "product_price": 50,
    "product_type": "clothing",
    "product_attributes": {
        "brand" : "aws",
        "size":"L"
    }
}

console.log(`newData::`, updateNestedObjectParserV2({target: data, updateFields: updateFields}))

export {
    updateNestedObjectParserV2
};
