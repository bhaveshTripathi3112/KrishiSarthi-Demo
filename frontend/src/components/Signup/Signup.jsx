import React, { useContext, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { dataContext } from '../../contexts/UserContext'
import axios from "axios";

export function Signup() {
    let navigate = useNavigate()
    let{serverUrl,userData,setUserData,getUserData} = useContext(dataContext)
    const [firstName,setFirstName] = useState(null)
    const [lastName , setLastName] = useState(null)
    const [phoneNumber , setPhoneNumber] = useState(null)
    const [password , setPassword] = useState(null)

    const handleSignUp = async(e)=>{
        e.preventDefault()
        try {
            

            let {data} = await axios.post(serverUrl+"/api/signup",{firstName,lastName,phoneNumber,password},{
                withCredentials:true,
            })
            await getUserData()
            setUserData(data.user)
            navigate("/home")
        } catch (error) {
            console.log(error.message);
        }
    }

    return (
        <div className='w-full h-screen bg-white flex justify-center items-center'>
            <div className='w-[90%] max-w-[500px] min-h-[600px] bg-green-900 rounded-xl flex flex-col justify-center items-center'>
                <h1 className='text-white text-4xl font-bold'>Welcome to KrishiSarthi</h1>
                <h1 className='text-white text-3xl font-semibold px-1.5 mt-6 py-3'>SignUp</h1>
                <form 
                    className='w-full flex flex-col items-center justify-center gap-7'
                    onSubmit={handleSignUp}
                >
                    <div className='w-3/4 flex justify-center items-center gap-2.5'>
                        <input
                            type="text"
                            placeholder='FirstName'
                            className='w-1/2 bg-white outline-none border-none rounded-lg px-2.5 py-3'
                            onChange={(e) => setFirstName(e.target.value)}
                            value={firstName}
                        />
                        <input
                            type="text"
                            placeholder='LastName'
                            className='w-1/2 bg-white outline-none border-none rounded-lg px-2.5 py-3'
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                        />
                    </div>
                    <input
                        type="number"
                        placeholder='Phone Number'
                        className='w-3/4 bg-white outline-none border-none rounded-lg px-2.5 py-3'
                        value={phoneNumber}
                         onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder='password'
                        className='w-3/4 bg-white outline-none border-none rounded-lg px-2.5 py-3'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button className='bg-[#00f9f9] text-black px-3 py-2.5 rounded-xl'>
                        Sign Up
                    </button>
                    <p className='text-white text-xl cursor-pointer'
                        onClick={()=>navigate("/login")}
                    >Already have an account? <span className='text-[#00f9f9] '>Login</span></p>
                </form>
            </div>
        </div>
    )
}


