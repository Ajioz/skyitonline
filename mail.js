const nodemailer = require('nodemailer');
const mailGun = require('nodemailer-mailgun-transport');
const DOMAIN = "sandboxa97dedff5a5f415da636446785387ec5.mailgun.org";

const auth ={
    auth: {
        api_key: 'key-f2ce409b9572ca44c13212902934a6ac',
        domain: DOMAIN
    }
};

// Mailer transport
let transporter = nodemailer.createTransport(mailGun(auth));

//Send mail method
const sendMail = (first_name, last_name, email, message, cb) => {
    let mailOptions = { 
        from: email, 
        to: 'ajiozglobal@gmail.com', 
        subject: first_name + ' ' + last_name + ' contacted', 
        text: message
    }; 
    
    transporter.sendMail(mailOptions, function(err, data) { 
        if(err) { 
            cb(err, null); 
        } else { 
            cb(null, data); 
        } 
    });
}

module.exports = sendMail;