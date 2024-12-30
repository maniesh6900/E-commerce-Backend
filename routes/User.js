const router = require("express").Router();
const User = require("../models/User")
const {verifyToken, verifyTokenandauthorization, verifyTokenandAdmin } = require("../MiddleWare/verifyToken")
const CryptoJS = require("crypto-js");

//change any property of user 
router.put("/:id", verifyTokenandauthorization, async (req, res)=>{
    if(req.body.password){
       req.body.password= CryptoJS.AES.encrypt(req.body.password, process.env.PASS_SCT).toString();
    }
    try{
        const updatredUser = await User.findByIdAndUpdate(req.params.id, {
        $set: req.body
        },{new: true})
        res.status(201).json(updatredUser);
    }catch(err){
        res.status(500).json(err);
    }   
})

//Delete
router.delete("/:id", verifyTokenandauthorization, async (req, res)=>{
    try{
        await User.findByIdAndDelete(req.params.id)
        res.status(200).json("User has been deleted")
    }catch(err){
        res.status(402).json(err);
    }
})

//get user
router.get("/find/:id", verifyTokenandAdmin, async (req, res)=>{
    try{
        const user =  await User.findById(req.params.id);
        const {password, ...others } = user._doc;
        res.status(200).json(others);
    }catch(err){
        res.status(402).json(err);
    }
})

//get all user
router.get("/", verifyTokenandAdmin, async (req, res)=>{
    try{
        const user =  await User.find()
        res.status(200).json(user)
    }catch(err){
        res.status(402).json(err);
    }
})

router.get("/stats", verifyTokenandAdmin, async (req, res)=>{
    const date = new Date();
    const lastYear = new Date(date.getFullYear(date.getFullYear() - 1));

    try {
        
        const data = await User.aggregate([
            {$match: {createdAt : {$gte: lastYear}}},
            {
                $project:{
                  month: {$month: "$createdAt" },  
                },
            },
            {
                $group:{
                    _id: "$month",
                    total : {$sum: 1} 
                },
            },
        ]);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json(error)
    }
})

module.exports = router