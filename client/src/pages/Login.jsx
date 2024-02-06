import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { baseUrl } from "../config";

const Login = () => {
  const [userName, setUserName] = useState("");
  const [erroressage, setErrorMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState("")
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    if (userName) {
      try {
        setIsProcessing(true)
        const { data } = await axios.post(`${baseUrl}/login`, {
          userName,
        });
        setErrorMessage("");
        sessionStorage.setItem("userName", data?.userName);
        navigate("/chat");
      } catch (err) {
        console.log(err);

        err?.response?.data && setErrorMessage(err?.response?.data);
      }finally{
        setIsProcessing(false)
      }
    }
  };
  return (
    <>
      <h1 className="text-center uppercase py-4 text-2xl border-b-2 border-b-gray-300 text-gray-600">
        Login Form
      </h1>
      <form
        onSubmit={submitHandler}
        className="flex flex-col min-h-[calc(100vh-100px)]  justify-center max-w-[500px] mx-auto px-5"
      >
        <label className="block mb-2 text-sm font-bold uppercase">User Name</label>
        <input
          type="text"
          placeholder="Enter user name"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          className=" border border-gray-300 rounded-md p-2 w-full outline-none shadow-md"
        />
 
          <p className="text-red-600  mt-2 text-sm ml-2 h-[50px]">
            {erroressage}
          </p>
        
        <button
          disabled={isProcessing}
          type="submit"
          className="border border-gray-500 rounded-md py-2 self-center px-8 mt-5  hover:scale-105 transition-all ease-in-out duration-300 bg-purple-700 disabled:bg-purple-500 hover:bg-purple-800 text-white shadow-md uppercase font-semibold"
        >
          Login
        </button>
        <Link to="/createaccount">
            <p className="text-blue-500 text-sm mt-3 text-center underline cursor-pointer hover:text-blue-700">
              don't have any account! click here.
            </p>
          </Link>
      </form>
    </>
  );
};

export default Login;
