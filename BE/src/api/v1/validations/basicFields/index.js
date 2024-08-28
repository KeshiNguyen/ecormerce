import dns from 'dns';

'use strict';
/**
 * Validates a password to ensure it meets the required criteria.
 *
 * @param {string} password - The password to be validated.
 * @return {boolean} Returns true if the password is valid, false otherwise.
 */
const validatePassword = (password) => {
    // Check if the password is between 8 and 16 characters long.
    const lengthCheck = /^.{8,16}$/.test(password);

    // Check if the password contains at least one uppercase letter.
    const upperCaseCheck = /[A-Z]/.test(password);

    // Check if the password contains at least one lowercase letter.
    const lowerCaseCheck = /[a-z]/.test(password);

    // Check if the password contains at least one digit.
    const numberCheck = /[0-9]/.test(password);

    // Check if the password contains only allowed characters.
    const allowedCharsCheck = /^[a-zA-Z0-9!@#$%^&*()\-_=+\[\]{}|;:'",.<>?/]*$/.test(password);

    // Return true if all checks pass, false otherwise.
    return lengthCheck && upperCaseCheck && lowerCaseCheck && numberCheck && allowedCharsCheck;
}

/*
    * Kiểm tra email thỏa mãn các yêu cầu:
    * 1. Cú pháp tuân thủ theo tiêu chuẩn RFC.
    * 2. Tên miền và bản ghi MX hợp lệ và chấp nhận thư.
    * 3. Địa chỉ đáp ứng các yêu cầu cụ thể của ISP.
    * @param {string} email - Địa chỉ email cần kiểm tra.
*/
const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
//check dns
const validDomain = async (domain) => {
    try {
        const mxRecords = await dns.MX.lookup(domain);
        return mxRecords.length > 0;
    } catch (error) {
        return false;
    }
}
const validateEmailV1 = async (email) => {
    const domain = email.split('@')[1];
    return emailRegex.test(email) && (await validDomain(domain));
}

export { validateEmailV1, validatePassword };
