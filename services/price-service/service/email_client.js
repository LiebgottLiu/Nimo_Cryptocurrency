const { SESClient, SendEmailCommand, Destination$ } = require("@aws-sdk/client-ses");

class EmailClient{
    constructor(){
        this.client = new SESClient({ region: process.env.AWS_REGION || "ap-southeast-4" });
        this.senderEmail = process.env.SES_SENDER_EMAIL;
    }


    //sending email message 
    async send(to, subject, body){
        const params = {
            Destination: {ToAddress: [to]},
            Message: {
                Body: {Text: {Data:body}},
                Subject: {Data: subject}
            },
            Source: this.senderEmail
        };

        await this.client.send(new SendEmailCommand(params));
    }
}

module.exports = EmailClient;