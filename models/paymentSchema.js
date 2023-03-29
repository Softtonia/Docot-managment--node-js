const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    payment_id : String,
    appointment_info: String,	
    email: String, 
    address: String,	
    amount: Number,	
    date: String,	
    notes: String
},{
    timestamps:true
});

const PaymentData = mongoose.model('paymentpage' , paymentSchema);
module.exports = PaymentData;

