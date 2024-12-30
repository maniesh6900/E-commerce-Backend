const router = require("express").Router();
const Product = require("../models/Product")
const {verifyToken, verifyTokenandauthorization, verifyTokenandAdmin } = require("../MiddleWare/verifyToken")
const CryptoJS = require("crypto-js");

//Create
router.post("/", verifyTokenandAdmin, async (req, res)=>{
    const newProdut  = new Product(req.body);

try {
    const savedProduct = await newProdut.save();
    res.status(200).json(savedProduct);
} catch (error) {
    res.status(500).json(error)
}
})  

//change any property of product 
router.put("/:id", verifyTokenandAdmin, async (req, res)=>{
    try{
        const updatredproduct= await Product.findByIdAndUpdate(req.params.id, {
        $set: req.body
        },{new: true})
        res.status(201).json(updatredproduct);
    }catch(err){
        res.status(500).json(err);
    }   
})

//Delete
router.delete("/:id", verifyTokenandAdmin, async (req, res)=>{
    try{
        await Product.findByIdAndDelete(req.params.id)
        res.status(200).json("Product has been deleted")
    }catch(err){
        res.status(402).json(err);
    }
})

//get user
router.get("/find/:id", async (req, res)=>{
    try{
        const product =  await Product.findById(req.params.id);
        
        res.status(200).json(product);
    }catch(err){
        res.status(402).json(err);
    }
})

//get all user
router.get("/", async (req, res)=>{
    const qNew = req.query.new;
    const qCatogory = req.query.catogory;
    try{
        let products;
        if(qNew){
            products = await Product.find().sort({createdAt : -1}).limit(5);
            
        }else if(qCatogory){
            products = await Product.find({
                categories :{
                    $in : [qCatogory],
                },
            })
        }else{
            products = await Product.find();
        }

        res.status(200).json(products);
    }catch(err){
        res.status(402).json(err);
    }
})


module.exports = router