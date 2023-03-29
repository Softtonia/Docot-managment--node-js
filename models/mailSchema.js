const mongoose = require('mongoose');


const notifySchema = new mongoose.Schema({
    subject : String,
    body : String,
});

const NotifyMailTemplateData = mongoose.model('notifymailtemplatepage' , notifySchema);


const forgetpasswordmailSchema = new mongoose.Schema({
    subject : String,
    body : String,
    reset_link : String,
});

const ForgetPasswordMailTemplateData = mongoose.model('forgetpasswordmailtemplatepage' , forgetpasswordmailSchema);

const signupMailSchema = new mongoose.Schema({
    subject : String,
    body : String,
});

const SignupMailTemplateData = mongoose.model('signupmailtemplatepage' , signupMailSchema);

const otpMailSchema = new mongoose.Schema({
    subject : String,
    body : String,
});

const OtpMailTemplateData = mongoose.model('otpmailtemplatepage' , otpMailSchema);



const offerMailSchema = new mongoose.Schema({
    subject : String,
    body : String,
});

const OfferMailTemplateData = mongoose.model('offermailtemplatepage' , offerMailSchema);



const subscriptionMailSchema = new mongoose.Schema({
    subject : String,
    body : String,
});

const SubscriptionMailTemplateData = mongoose.model('subscriptionmailtemplatepage' , subscriptionMailSchema);


const letterpadMailSchema = new mongoose.Schema({
    subject : String,
    body : String,
});

const LetterpadMailTemplateData = mongoose.model('letterpadmailtemplatepage' , letterpadMailSchema);

const invoicepadMailSchema = new mongoose.Schema({
    subject : String,
    body : String,
});

const InvoicepadMailTemplateData = mongoose.model('invoicepadmailtemplatepage' , invoicepadMailSchema);









const MailSchema = new mongoose.Schema({
    type: String,
    subject : String,
    body : String,
    redirect_link : String,
});

const MailTemplateData = mongoose.model('mailtemplatepage' , MailSchema);






module.exports = {MailTemplateData,NotifyMailTemplateData,ForgetPasswordMailTemplateData,SignupMailTemplateData,OtpMailTemplateData,OfferMailTemplateData,LetterpadMailTemplateData,InvoicepadMailTemplateData,SubscriptionMailTemplateData};

