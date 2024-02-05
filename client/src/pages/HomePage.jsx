import React from "react";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Link to ="/createaccount">
      <button 
      
      className="bg-green-600 text-white rounded-md px-6 py-2 w-[170px] font-semibold">
        Create Account
      </button>
      </Link>

<Link to="/login">
      <button 
      className=" bg-purple-700 text-white rounded-md px-6 py-2 w-[170px] ml-4 font-semibold">
        Login
      </button>
      </Link>
    </div>
  );
};

export default HomePage;
