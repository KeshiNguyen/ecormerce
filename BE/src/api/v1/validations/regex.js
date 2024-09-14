
const regexPhoneNumber =  /(84|0[3|5|7|8|9]) + ([0-9]{8})\b/g;
const isValidPhoneNumber = (phone) => {
    return regexPhoneNumber.match(phone) ? true : false;
}

export {
    isValidPhoneNumber
};
