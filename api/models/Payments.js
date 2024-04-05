const mongoose = require('mongoose');
const { Schema } = mongoose;
const paymentSchema = new Schema ({
    transitionId: String,
    email: String,
    price: Number, 
    address: String,
    quantity: Number,
    status: String,
    status2: String,
    status3: String,
    itemsName: Array,
    cartItems: Array,
    menuItems: Array,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Payment = mongoose.model('Payment', paymentSchema);
module.exports = Payment;