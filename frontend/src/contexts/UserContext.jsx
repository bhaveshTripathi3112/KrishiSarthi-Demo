import { createContext, useEffect, useState } from "react";
import axios from "axios"
import { useNavigate } from "react-router-dom";

export const dataContext = createContext();

function UserContext({children}){
    let navigate = useNavigate();

    let [userData , setUserData] = useState(null)
    const serverUrl = "http://localhost:8000"

    const getUserData = async()=>{
      try {
        let { data } = await axios.get(serverUrl + "/api/getuserdata", {
          withCredentials: true,
        });
        setUserData(data.user);
      } catch (error) {
        setUserData(null); // Clear user data on error
        navigate("/login");
        console.log(error);
      }
    }

    const value = {
        serverUrl,userData,setUserData,getUserData
    }

    useEffect(()=>{
        getUserData()
    },[])

    return(
        <dataContext.Provider value={value}>
            {children}
        </dataContext.Provider>
    )

}

export default UserContext