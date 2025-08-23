import React, { useRef } from 'react'
import { useContext,useState } from 'react'
import { useNavigate } from 'react-router-dom'

export function Login() {
    let navigate = useNavigate()
    const [phoneNumber , setPhoneNumber] = useState(null)
    const [password , setPassword] = useState(null)
      const handleSubmit = (e) => {
        e.preventDefault();
        // Add your login logic here
        navigate('/home'); // Navigate to home page after login
    }
    

    return (
        <div className='w-full h-screen bg-white flex justify-center items-center'>
            <div className='w-[90%] max-w-[500px] min-h-[600px] bg-green-900 rounded-xl flex flex-col justify-center items-center'>
                <h1 className='text-white text-3xl font-semibold px-1.5 mt-6 py-3'>Login</h1>
                <form 
                    className='w-full flex flex-col items-center justify-center gap-7'
                    onSubmit={handleSubmit} 
                >
                    <input
                        type="number"
                        placeholder='Mobile Number'
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
                        Login
                    </button>
                     <p className='text-white text-xl cursor-pointer'
                        onClick={()=>navigate("/signup")}
                    >Create new account ? <span className='text-[#00f9f9] '>SignUp</span></p>
                </form>
            </div>
        </div>
    )

}


