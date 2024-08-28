import dotenv from 'dotenv';

import { PublishCommand, SNSClient } from '@aws-sdk/client-sns';

dotenv.config();

// send sms using aws sns
const sendSMSOTP = async (params) => {
    const sns = new SNSClient({
        region: 'ap-southeast-1',
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
        }
    });

    try {
        const command = new PublishCommand(params);
        const data = await sns.send(command);
        return data;
    } catch (err) {
        console.error("Error sending SMS via AWS SNS:", err);
        throw err;
    }
};

(async () => {
    try {
        const params = {
            Message: `Your OTP code is ${Math.random().toString().substring(2, 8)}`,
            PhoneNumber: '+84347868408',
            MessageAttributes: {
                'AWS.SNS.SMS.SMSType': {
                    DataType: 'String',
                    StringValue: 'Transactional' // Loại tin nhắn, ví dụ như Transactional hoặc Promotional
                }
            }
        };
        const result = await sendSMSOTP(params);
        console.log("SMS sent successfully:", result);
    } catch (error) {
        console.error("Failed to send SMS OTP:", error);
    }
})();
