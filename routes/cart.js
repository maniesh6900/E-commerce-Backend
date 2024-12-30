const router = require("express").Router();
const Cart = require("../models/cart");
const {verifyToken, verifyTokenandauthorization, verifyTokenandAdmin } = require("../MiddleWare/verifyToken")


//Create
router.post("/", verifyToken, async (req, res)=>{
    const newCart  = new Cart(req.body);

try {
    const savedCart = await newCart.save();
    res.status(200).json(savedCart);
} catch (error) {
    res.status(500).json(error)
}
})  

//change any property of product 
router.put("/:id", verifyTokenandauthorization, async (req, res)=>{
    try{
        const updatredcart = await Cart.findByIdAndUpdate(
        req.params.id, {
            $set: req.body
            },{new: true})
            res.status(201).json(updatredcart);
    }catch(err){
        res.status(500).json(err);
    }   
})

//Delete
router.delete("/:id", verifyTokenandauthorization, async (req, res)=>{
    try{
        await Cart.findByIdAndDelete(req.params.id)
        res.status(200).json("Product has been deleted")
    }catch(err){
        res.status(502).json(err);
    }
})

//get user cart
router.get("/find/:id", verifyTokenandauthorization, async (req, res)=>{
    try{
        const cart =  await Cart.findOne({userID: req.params.userId});
        res.status(200).json(cart);
    }catch(err){
        res.status(502).json(err);
    }
})

//get all 
router.get("/",verifyTokenandAdmin, async (req, res)=>{
  try {
    const cart = await Cart.find();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json(err);
  }
})


module.exports = router