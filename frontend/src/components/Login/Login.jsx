import React, { useRef } from 'react'
import { useContext,useState } from 'react'
import { useNavigate } from 'react-router-dom'
 // Ensure you have an appropriate background image in the assets folder
 import bgImage from "../../assets/bpg.jpeg";
// Corrected the path to the image

import axios from 'axios';
import { dataContext } from '../../contexts/UserContext';

export function Login() {
    let {serverUrl,userData,setUserData,getUserData} = useContext(dataContext)
    let navigate = useNavigate()
    const [phoneNumber , setPhoneNumber] = useState(null)
    const [password , setPassword] = useState(null)
    const [errorMessage, setErrorMessage] = useState('');
      const handleSubmit = async(e) => {
        e.preventDefault();
        try {
            let {data} = await axios.post(serverUrl+"/api/login",{
                phoneNumber,password
            },{withCredentials:true})
            console.log(data);
            await getUserData()
            
            navigate('/home'); // Navigate to home page after login
            
        } catch (error) {
            setErrorMessage(error.response.data.message);
            
        }

       
       
    }

    return (
      <div
  className="min-h-screen flex items-center justify-end bg-cover bg-center bg-no-repeat px-10"
  style={{ backgroundImage: `url(${bgImage})` }}
>
  <div className="w-[90%] max-w-[500px] min-h-[600px] bg-green-900 rounded-xl flex flex-col justify-center items-center">
    <h1 className="text-white text-4xl font-bold">Welcome to कृषिSarthi</h1>
    <h1 className="text-white text-3xl font-semibold px-1.5 mt-6 py-3">Login</h1>

    <form
      className="w-full flex flex-col items-center justify-center gap-7"
      onSubmit={handleSubmit}
    >
      <input
        type="number"
        placeholder="Mobile Number"
        className="w-3/4 bg-white outline-none border-none rounded-lg px-2.5 py-3"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
      />
      <input
        type="password"
        placeholder="password"
        className="w-3/4 bg-white outline-none border-none rounded-lg px-2.5 py-3"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button className="bg-[#00f9f9] text-black px-3 py-2.5 rounded-xl">
        Login
      </button>
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
      <p
        className="text-white text-xl cursor-pointer"
        onClick={() => navigate("/signup")}
      >
        Create new account ?{" "}
        <span className="text-[#00f9f9] ">SignUp</span>
      </p>
    </form>
  </div>
</div>

       
        
    )



}
