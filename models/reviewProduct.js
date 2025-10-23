const mongoose = require('mongoose');
const reviewProductSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
        },
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "product",
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },
        comment: {
            type: String,
            required: true,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

const ReviewProduct = mongoose.model("ReviewProduct", reviewProductSchema);

module.exports = ReviewProduct;
