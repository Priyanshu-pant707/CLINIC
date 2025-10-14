import React from 'react'

const Navbar = () => {
    return (
        <div className="w-screen p-2 h-[10vh] flex shadow-md ">
            <nav className='w-full flex justify-between'>
                <div className="left flex  text-black justify-center items-center">
                    <img className='w-[100px]  rounded-full animate-rotate-y' src="./logos/nav_logo.png" alt="loading" />
                    <span className="font-bold text-5xl font-semibold bg-gradient-to-r from-blue-400 via-blue-500 to-blue-700 text-transparent bg-clip-text">
                        Gemis
                    </span>
                </div>
                <div className="right flex justify-between items-center px-8 py-3">
                    {/* Navigation Links */}
                    <ul className="flex gap-8 text-2xl font-medium">
                        <li><a href="#" className="no-underline text-black hover:text-blue-700">About</a></li>
                        <li><a href="#" className="no-underline text-black hover:text-blue-700">Find Clinics</a></li>
                        <li><a href="#" className="no-underline text-black hover:text-blue-700">Login</a></li>
                    </ul>

                    {/* Button Section */}
                    <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5  ml-10 py-2 rounded-xl shadow-md transition-all duration-300">
                        Get Started
                    </button>
                </div>

            </nav>
        </div>
    )
}

export default Navbar