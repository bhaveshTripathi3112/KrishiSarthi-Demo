import { generateToken } from "../config/token.js"
import { User } from "../models/user.model.js"
import bcrypt from "bcryptjs"

export const signUp = async(req,res)=>{
    console.log(req.body);
    try {

        const{firstName , lastName ,phoneNumber , password} = req.body

        if(!firstName || !lastName || !phoneNumber || !password){
            return res.status(400).json({message:"incomplete details"})
        }

        let existingUser = await User.findOne({phoneNumber})
        if(existingUser){
            return res.status(400).json({message:"user already exists!"})
        }

        const hashedPassword = await bcrypt.hash(password,10)

        const user = await User.create({
            firstName,
            lastName,
            phoneNumber,
            password:hashedPassword

        })
        
        let token ;
        try {
            token = generateToken(user._id)
        } catch (error) {
            console.log("token error : ",error);
            return res.status(500).json({ message: "Token generation failed" });
        }
        res.cookie("token",token,{
            httpOnly:true,
            secure:process.env.NODE_ENVIRONMENT == "production",
            sameSite:"strict",
            maxAge:7*24*60*60*1000
        })

        return res.status(201).json({user:{
            firstName,
            lastName,
            phoneNumber
        }})

    } catch (error) {
        res.status(500).send({message:error})
    }
}

export const login = async(req,res) =>{
    try {
        const {phoneNumber , password} = req.body
        let existingUser = await User.findOne({phoneNumber})
        if(!existingUser){
            return res.status(400).json({message:"user doesn't exists!"})
        }
        
        let match = await bcrypt.compare(password,existingUser.password)
        if(!match){
            return res.status(400).json({message:"incorrect password"})
        }

       let token ;
        try {
            token = generateToken(existingUser._id)
        } catch (error) {
            console.log("token error : ",error);
        }
        res.cookie("token",token,{
            httpOnly:true,
            secure:process.env.NODE_ENVIRONMENT == "production",
            sameSite:"strict",
            maxAge:7*24*60*60*1000
        })

        return res.status(201).json({user:{
            firstName:existingUser.firstName,
            lastName:existingUser.lastName,
            phoneNumber:existingUser.phoneNumber
        }})


    } catch (error) {
        return res.status(500).json({message:message.error})
    }
}

export const logout = async(req,res)=>{
    try {
        res.clearCookie("token")
        return res.status(200).json({message:"logout successful"})
    } catch (error) {
        return res.status(500).json({message:error})
    }
}