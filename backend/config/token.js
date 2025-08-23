import jwt from "jsonwebtoken"

export const generateToken = (id) =>{
    let token = jwt.sign({id},process.env.JWT_SECRET,{expiresIn:"7d"})
    return token
}