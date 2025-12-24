import mongoose from 'mongoose';
const itemSchma = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String,
        enum: ['Snacks','Main Course', 'Beverages', 'Desserts'
            ,'Pizza','Burgers','Sanwiches','South Indian','North Indian','Chinese','Italian','Mexican','others'
        ], required: true },
    price: { type: Number,
        min:0, required: true },
    foodType: { type: String,
        enum: ['Veg', 'Non-Veg'], required: true },
    
    image: { type: String, required: true },

    shop: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop', required: true }
}, { timestamps: true });

const Item = mongoose.model('Item', itemSchma);

module.exports = Item;