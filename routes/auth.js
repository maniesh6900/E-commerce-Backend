const router = require("express").Router();
const jwt = require("jsonwebtoken");
const User  = require("../models/User");
const CryptoJS = require("crypto-js");

//register
router.post("/register", async (req, res)=>{
    const newUser  = new User({
        username: req.body.username,
        email: req.body.email,
        password: CryptoJS.AES.encrypt(req.body.password, process.env.PASS_SCT).toString(),
        
    });

    try {
        const saveUser = await newUser.save();
        res.status(201).json(saveUser)
    }catch(err){
        res.status(501).json(err);   
    }
    
})

//Login
router.post("/login", async (req, res)=>{
    try{
        const user = await User.findOne({username: req.body.username});

        if(!user){
            res.status(401).json("wrong creds user");
        }

        const hashedPass = CryptoJS.AES.decrypt(user.password, process.env.PASS_SCT);
        const Userpassword = hashedPass.toString(CryptoJS.enc.Utf8);

        if( Userpassword !== req.body.password){
            res.status(401).json("wrong creds password")
        }

        const accessToken = jwt.sign({
            id:user._id, 
            isAdmin: user.isAdmin,
        },
        process.env.JWT_SCT,
        {expiresIn: "3d"}
        );

        const{password, ...other} = user._doc;

        res.status(201).json({...other, accessToken})
    }catch(err){
        res.status(501).json(err)
        
    }
})
 

module.exports = router