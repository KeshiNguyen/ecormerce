'use strict';

//tracking number: 
const services = {
    'Vietnam Post': ['VN'],
    'USPS':['US',['RA','EA']],
}

const isoCountries = {
    'VN': 'Vietnam',
    'US': 'United States',
    'RA': 'Russia',
    'EA': 'Europe'
}

const getCountryCode = (country) => {
    return isoCountries.hasOwnProperty(country) ? isoCountries[country] : country;
}

const checkSum = (st) => {
    let s = 0;
    let weight_s = [2, 3, 4, 5, 6, 7, 8, 9];
    for (let i = 0; i<  weight_s.length ; i++) {
        s += parseInt(st[i]) * weight_s[i];
    }
    var result = 11-  s % 11;
    return result == 10 ? 0 : result== 11 ? 5 : result;
}
const generateSerial = () => {
    let s = '';
    for (let i = 0; i < 8; i++) {
        s += Math.floor(Math.random() * 10);
    }
    return s + checkSum(s);
}

const generateTrackingNumber = async (country) => {
    let s = '';
    return s + generateSerial()
}

export {
    generateTrackingNumber
};
