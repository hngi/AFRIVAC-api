const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const destinationSchema = new Schema(
  {
    country: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    rating_number: {
        type: Number,
        default: 0
    },
    overView: [{
        description: this.description,
        photo: [String]
    }],
    review: [{
        date: Date.now(),
        message_description: String,
        message_title: String,
        name: String,
        profile_image: String,
        star_num: {
            type: Number,
            default: 0
        },
        userId: String
    }]
  },
  {
    timestamps: true,
  }
);

let destination = null;

try {
  user = mongoose.model('destination')
} catch (error) {
  user = mongoose.model('destination', destinationSchema)
}

module.exports = user
