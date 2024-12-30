const mongoose = require("mongoose");

const CartSchema  = new mongoose.Schema(
    {
        userId : { type:String, required :true, unique:true},
        prodcuts: [
            {
                productId:{
                    type:String
                },
                quantity:{
                    type:Number,
                    default: 1,
                },
            }
        ],
        amount: {type: Number, require: true},
        address: {type: Object, require: true},
        status: {type: String, default: "pending"},

    },
    {timestamps: true}

)

module.exports = mongoose.model("order", CartSchema);