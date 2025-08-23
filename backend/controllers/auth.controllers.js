import { User } from "../models/user.model.js"
export const signUp = async(req,res)=>{
    try {

        const{firstName , lastName , email,phoneNumber , password} = req.body

        // if(!firstName || !lastName || )
        
    } catch (error) {
        res.status(500).send({message:error})
    }
}