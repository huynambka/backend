const mongoose = require('mongoose');

const FestivalSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, "Name is required"],
    },
    date: {
        type: Date,
        required: [true, "Date is required"],
    },
    keywords: [String],
    description: {
        type: String,
        required: [true, "Description is required"],
        minlength: [10, "Description must be at least 10 characters long"]
    }
})

module.exports = mongoose.model('Festival', FestivalSchema);