import React, { useState ,useContext}  from 'react'
import { Link, NavLink,useNavigate } from "react-router-dom"
// import axios from 'axios'
// import { dataContext } from '../contexts/UserContext'
export default function Header() {
    // let {serverUrl,userData , setUserData} = useContext(dataContext)
    
    // let navigate = useNavigate()
    // if(!userData){
    //     navigate('/login')
    // }
    // const handleLogOut  = async()=>{
    //     try {
    //         let data = await axios.post(serverUrl+"api/logout",{},{
    //             withCredentials:true
    //         })
    //         setUserData(null)
    //     } catch (error) {
    //         console.log(error);
    //     }
    // }
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <header className="shadow sticky z-50 top-0">
            <nav className="bg-white border-gray-200 px-4 lg:px-6 py-2.5">
                <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
                    <Link to="/home" className="flex items-center">
                        <h1 className='text-4xl text-green-600'>कृषिSarthi</h1>
                    </Link>

                    {/* Mobile menu button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="lg:hidden p-2 text-gray-600 hover:text-green-600"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {isMobileMenuOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>

                    <div className="flex items-center lg:order-2">
                        <Link
                        to="#"
                            className="text-gray-800 hover:bg-gray-50 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 focus:outline-none"
                        >
                            Chatbot
                        </Link>
                        <Link
                            to="/login"
                            className="text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 focus:outline-none"
                            // onClick={handleLogOut}
                        >
                            LogOut
                        </Link>
                            
                    </div>

                    <div
                        className={`${
                            isMobileMenuOpen ? 'block' : 'hidden'
                        } justify-between items-center w-full lg:flex lg:w-auto lg:order-1`}
                    >
                        <ul className="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0">
                            <li>
                                <NavLink
                                    to="/home"
                                    className={({isActive}) =>
                                        `block py-2 pr-4 pl-3 duration-200 ${isActive ? "text-green-600" : "text-gray-700"} hover:text-green-600 lg:p-0`
                                    }
                                >
                                    Home
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to="/scanner"
                                    className={({isActive}) =>
                                        `block py-2 pr-4 pl-3 duration-200 ${isActive ? "text-green-600" : "text-gray-700"} hover:text-green-600 lg:p-0`
                                    }
                                >
                                    Scanner
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to="/heatmap"
                                    className={({isActive}) =>
                                        `block py-2 pr-4 pl-3 duration-200 ${isActive ? "text-green-600" : "text-gray-700"} hover:text-green-600 lg:p-0`
                                    }
                                >
                                 Heatmap
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to="/about"
                                    className={({isActive}) =>
                                        `block py-2 pr-4 pl-3 duration-200 ${isActive ? "text-green-600" : "text-gray-700"} hover:text-green-600 lg:p-0`
                                    }
                                >
                                    About
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to="/contact"
                                    className={({isActive}) =>
                                        `block py-2 pr-4 pl-3 duration-200 ${isActive ? "text-green-600" : "text-gray-700"} hover:text-green-600 lg:p-0`
                                    }
                                >
                                    Contact
                                </NavLink>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </header>
    );
}


