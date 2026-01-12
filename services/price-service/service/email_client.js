
const { SESClient, SendEmailCommand, Destination$ } = require("@aws-sdk/client-ses");
const client = new SESClient({ region: process.env.AWS_REGION || "ap-southeast-2" });


class EmailClient{
    constructor(){
        this.client = new SESClient({ region:  "ap-southeast-2" });
        this.senderEmail = process.env.SES_SENDER_EMAIL;
    }


    //sending email message 
    async send(to, subject, body){
        const params = {
            Destination: {ToAddresses: [to]},
            Message: {
                Body: {Text: {Charset: "UTF-8", Data:body}},
                Subject: {Charset: "UTF-8", Data: subject}
            },
            Source: this.senderEmail
        };

        try {
            const response = await this.client.send(new SendEmailCommand(params));
            console.log("Email sent, Message ID:", response.MessageId);
        } catch (err) {
            console.error("Error sending email via SES:", err);
            throw err;
        }
    }
}

module.exports = EmailClient;