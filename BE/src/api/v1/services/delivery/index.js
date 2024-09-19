'use strict'
import axios from 'axios'

import { BadRequestError } from '../../core/error.response.js'

const ghnApis = 'https://dev-online-gateway.ghn.vn/shiip/public-api'
const headers = {
    'shopId': `194444`,
    'Content-Type': 'application/json',
    'token': '94961764-6eb7-11ef-8e53-0a00184fe694'
}

async function getID({field1,field2 ,value, field2Id,fieldID}) {
    const response = await axios.get(`${ghnApis}/master-data/${field1}?${field2}=${field2Id}`, {headers})
    .then(
        response => {
            response = response.data?.data
            const foundItem = response.find(item => item.NameExtension.some(name => name.toLowerCase().normalize('NFC') === value.toLowerCase().normalize('NFC')))
            const id = foundItem ? foundItem[fieldID] : null;
            if(!id) {
                throw new BadRequestError(`Not found ${field1} ${value}`)
            }
            return id;
        }
    )
    .catch((error) => {
        console.log(error)
    })

    return response
}

class DeliveryService {
    /*
        getAddress

        payload: {
            province,
            district,
            ward
        }
    */
    static getAddress = async (payload) => {
        const {province, district, ward} = payload
        const province_id = await getID({field1:"province",field2:"",value:province, field2Id:"",fieldID:"ProvinceID"})
        const district_id = await getID({field1:"district",field2:"province_id",value:district, field2Id:province_id, fieldID:"DistrictID"})
        const ward_code = await getID({field1:"ward",field2:"district_id",value:ward, field2Id:district_id, fieldID:"WardCode"})
        return {
            district_id,
            ward_code
        }
    }
    static getFee = async (payload) => {
        // console.log(payload)
        const {
            from_district_id, from_ward_code, to_district_id, to_ward_code,
            service_id, weight, height, width
        } = payload
        if (!from_district_id || !from_ward_code || !to_district_id || !to_ward_code || !service_id ||!weight) {
            throw new BadRequestError('Missing required parameters')
        }

        return await axios.post(`${ghnApis}/v2/shipping-order/fee`, payload, {headers})
            .then(response => {
                return response.data?.data
            })
            .catch(error => {
                console.error(`Error when getting delivery fee: ${error.message}`)
                throw error
            })
    }

    /*
        {
            shop_id: 194444,
            from_district,
            to_district
        }
    */
    static getServices = async (payload) => {
        return await axios.post(`${ghnApis}/v2/shipping-order/available-services`,payload ,{headers})
        .then(response => response?.data?.data)
        .catch(error => {
            console.error(`Error when getting delivery service: ${error.message}`)
            throw error
        })
    }
}

export default DeliveryService