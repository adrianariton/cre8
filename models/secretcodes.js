var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
const { Double } = require('mongodb');
var crypto = require("crypto");
var nodemailer = require('nodemailer');
const { db } = require('./parfumes');

mongoose.connection.on('connected', ()=>{
    console.log('Connecred to mongo~~~~~~~~~~~~~~')
})
//User schema

const SecretCodeSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    code: {
        type: String,
        required: true,
    },
    dateCreated: {
        type: Date,
        default: Date.now(),
        expires: 600,
    },
});

var SecretCode = module.exports = mongoose.model('SecretCode', SecretCodeSchema);



module.exports.getEmailCode = function(email, callback){
    var query = {email: email};
    SecretCode.findOne(query, callback)
}
module.exports.sendSecretUrlToUser = function(uid, email,req, callback){
    var secretcode = crypto.randomBytes(20).toString('hex')
    console.log({user: process.env.EMAIL_NAME,
      pass: process.env.EMAIL_PASS})
    var transporter = nodemailer.createTransport({
        service: 'Yahoo',
        auth: {
          user: process.env.EMAIL_NAME,
          pass: process.env.EMAIL_PASS
        }
    });
    
    var mailOptions = {
      from: process.env.EMAIL_NAME,
      to: email,
      subject: `Ascent E-mail verification`,
      text: `Verify your email adress: ${req.protocol+"://"+req.headers.host}/verify/${uid}/${secretcode}`
    };
    var dbcodeobj = new SecretCode({
        email: email,
        code: secretcode
    })
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
        callback(error)
      } else {
        console.log('Email sent: ' + info.response);
        dbcodeobj.save(callback)
      }
    });
}