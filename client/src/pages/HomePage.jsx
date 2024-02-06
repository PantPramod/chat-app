import React from "react";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className=" rounded-full shadow-xl h-[80vh] w-[90vw] sm:w-[70vw] mx-auto  flex min-h-[90vh] flex-col sm:flex-row gap-10 items-center justify-center">
        <Link to="/createaccount">
          <button className="bg-green-600 text-white rounded-md px-6 py-2 w-[170px] font-semibold">
            Create Account
          </button>
        </Link>

        <Link to="/login">
          <button className=" bg-purple-700 text-white rounded-md px-6 py-2 w-[170px]  font-semibold">
            Login
          </button>
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
