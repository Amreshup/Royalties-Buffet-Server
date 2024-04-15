const express = require('express');
const Payment = require('../models/Payments');
const router = express.Router();

const mongoose = require('mongoose');
const Cart = require('../models/Carts'); // Import your Cart model
const ObjectId = mongoose.Types.ObjectId;

// token
const verifyToken = require('../middlewares/verifyToken')

router.post('/', async (req, res) => {
    const payment = req.body;

    try {
        // Create a new payment using Mongoose model
        const paymentResult = await Payment.create(payment);

        // Delete items from the cart
        const cartIds = payment.cartItems.map(id => new ObjectId(id));
        
        const deleteResult = await Cart.deleteMany({ _id: { $in: cartIds } });

        res.status(200).json({ paymentResult, deleteResult });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/',verifyToken, async (req, res) => {
    const email = req.query.email;
    const query = { email: email };
    try {
        const decodedEmail = req.decoded.email;

        if(email !== decodedEmail){
           res.status(403).json({ message: "Forbidden access!"});
        }
   
       const result = await Payment.find(query).sort({ createdAt: -1 }).exec();
       res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// get all payment infomation
// get all menu items
router.get('/all', async (req, res) => {
    try {
      const menus = await Payment.find({}).sort({ createdAt: -1 });
      res.status(200).json(menus);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  })

// confirm payment status
router.patch('/:id', verifyToken, async (req, res) => {
    const payId = req.params.id;
 
    
    try {
        const updatedStatus = await Payment.findByIdAndUpdate(
            payId,
            {status: 'confirmed🔵'},
            { new: true, runValidators: true },
        );

        // console.log(updatedUser)

        if (!updatedStatus) {
            return res.status(404).json({ message: 'Pay Id not found' });
        }

    res.status(200).json(updatedStatus); 
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

// dispatch status 
router.patch('/dispatch/:id', verifyToken, async (req, res) => {
    const payId = req.params.id;
 
    try {
        const updatedStatus = await Payment.findByIdAndUpdate(
            payId,
            { status: 'dispatched🟡' }, // Update status2 to "dispatched"
            { new: true, runValidators: true },
        );

        if (!updatedStatus) {
            return res.status(404).json({ message: 'Pay Id not found' });
        }

        res.status(200).json(updatedStatus); 
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// Update status to "delivered" for a payment
router.patch('/deliver/:id', verifyToken, async (req, res) => {
    const payId = req.params.id;

    try {
        const updatedPayment = await Payment.findByIdAndUpdate(
            payId,
            { status: 'delivered🟢 ' },
            { new: true, runValidators: true }
        );

        if (!updatedPayment) {
            return res.status(404).json({ message: 'Payment ID not found' });
        }

        res.status(200).json(updatedPayment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


router.delete('/:id', verifyToken, async (req, res) => {
    const payId = req.params.id;
    try {
        // Attempt to delete the payment by its ID
        const deletedPayment = await Payment.findByIdAndDelete(payId);
        
        if (!deletedPayment) {
            return res.status(404).json({ message: 'Payment not found' });
        }
        
        res.status(200).json({ message: 'Payment deleted successfully', deletedPayment });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Handle Cash on Delivery payment
router.post('/cash-on-delivery', async (req, res) => {
    const { email, price, cart, address } = req.body;
  
    try {
      // Create a new payment record with transactionId set to "Cash on delivery"
      const payment = await Payment.create({
        email,
        transitionId: "Cash on delivery", // Set transactionId to "Cash on delivery"
        price,
        status: "Order Pending",
        quantity: cart.length,
        address,
        itemsName: cart.map(item => item.name),
        cartItems: cart.map(item => item._id),
        menuItems: cart.map(item => item.menuItemId)
      });
      console.log(payment)
      // Delete items from the cart
      const cartIds = payment.cartItems.map(id => new ObjectId(id));
      const deleteResult = await Cart.deleteMany({ _id: { $in: cartIds } });
  
      // Send response with payment information
      res.status(201).json({ success: true, payment, deleteResult });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });


module.exports = router;
