const axios = require('axios');


// Send SMS.
const sendSMS = async ( to, message ) => {

   await axios.get(` https://bulksmsbd.net/api/smsapi?api_key=U4Y6H3LXsOKMjpJ7vunU&type=text&number=${ to }&senderid=03590900025&message=${ message }`);

};


// Exports axios.
module.exports = sendSMS;



