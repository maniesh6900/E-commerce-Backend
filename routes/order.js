const router = require("express").Router();
const Order = require("../models/Order")
const {verifyToken, verifyTokenandauthorization, verifyTokenandAdmin } = require("../MiddleWare/verifyToken")
const CryptoJS = require("crypto-js");

//Create
router.post("/", verifyToken, async (req, res)=>{
    const newOrder = new Order(req.body);

try {
    const savedOdrder = await newOrder.save();
    res.status(200).json(savedOdrder);
} catch (error) {
    res.status(500).json(error)
}
})  

//change any property of product 
router.put("/:id", verifyTokenandAdmin, async (req, res)=>{
    try{
        const updatredOrder = await Order.findByIdAndUpdate(req.params.id, {
        $set: req.body
        },{new: true})
        res.status(201).json(updatredOrder);
    }catch(err){
        res.status(500).json(err);
    }   
})

//Delete
router.delete("/:id", verifyTokenandAdmin, async (req, res)=>{
    try{
        await Order.findByIdAndDelete(req.params.id)
        res.status(200).json("Order has been deleted")
    }catch(err){
        res.status(402).json(err);
    }
})

//get users order
router.get("/find/:userId", verifyTokenandauthorization, async (req, res)=>{
    try{
        const orders =  await Order.find({userID: req.params.userId});
        res.status(200).json(orders);
    }catch(err){
        res.status(502).json(err);
    }
})

//get all 
router.get("/",verifyTokenandAdmin, async (req, res)=>{
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json(err);
  }
})

// get monthly income
router.get("/income", verifyTokenandAdmin, async (req, res)=>{
    const date = new Date();
    const lastMonth = new Date(date.setMonth(date.setMonth() -1));
    const prevMonth = new Date(new Date().setMonth(lastMonth.setMonth() -1));

    try {
        const income = await Order.aggregate([
            
            {$match: {createdAt: { $gte: prevMonth } } },
            
        { 
            $project:{
            month: {$month : "$createdAt"},
            sales: "$amount"
        } },
        {
        $group:{
            _id: "$month",
            total: {$sum : "$sales"},
        } },
        ])
        res.status(200).json(income)
    } catch (error) {
        res.status(500).json(err); 
    }
});





module.exports = router