import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { baseUrl } from "../config";

const CreateAccount = () => {
  const [userName, setUserName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState("")
  const navigate = useNavigate();
  const createAccountHandle = async (e) => {
    e.preventDefault();
    if (userName) {
      try {
        setIsProcessing(true)
        const { data } = await axios.post(`${baseUrl}/createaccount`, {
          userName: userName,
        });

        if (data?._id) {
          sessionStorage.setItem("userName", data?.userName);
          setErrorMessage("");
          navigate("/chat");
        }
      } catch (err) {
        setErrorMessage(err?.response?.data);
      }finally{
        setIsProcessing(false)
      }
    }
  };
  return (
    <>
      <h1 className="text-center uppercase py-4 text-2xl border-b-2 border-b-gray-300 text-gray-600">
        Create Account
      </h1>

      <form className="max-w-[500px] mx-auto px-5" onSubmit={createAccountHandle}>
        <div className="flex flex-col min-h-[calc(100vh-100px)]  justify-center">
          <p className="font-bold  text-sm mb-2 uppercase">User Name</p>
          <input
            type="text"
            placeholder="Select a user name"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className=" border border-gray-300 rounded-md p-2 w-full outline-none shadow-md"
          />

          <p className="text-red-600 text-sm mt-2 h-[50px] ml-2">
            {errorMessage}
          </p>

          <button
            disabled={isProcessing}
            type="submit"
            className=" font-semibold border border-gray-500 rounded-md py-2 self-center shado\ px-8 mt-5 text-white uppercase bg-[#27a327] disabled:bg-[#71ad71] transition-all ease-in-out duration-300 hover:scale-105 hover:bg-[#338033]"
          >
            Create
          </button>
          <Link to="/login">
            <p className="text-blue-500 text-sm mt-3 text-center underline cursor-pointer hover:text-blue-700">
              Already have an account! click here.
            </p>
          </Link>
        </div>
      </form>
    </>
  );
};

export default CreateAccount;
