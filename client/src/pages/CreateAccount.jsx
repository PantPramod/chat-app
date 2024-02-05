import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { baseUrl } from "../config";

const CreateAccount = () => {
  const [userName, setUserName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const createAccountHandle = async (e) => {
    e.preventDefault();
    if (userName) {
      try {
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
      }
    }
  };
  return (
    <form className="max-w-[500px] mx-auto" onSubmit={createAccountHandle}>
      <h2 className="text-center text-3xl py-4 h-[100px]">Create Account</h2>

      <div className="flex flex-col min-h-[calc(100vh-100px)]  justify-center">
        <p className="text-gray-400 mt-[-100px]">User Name</p>
        <input
          type="text"
          placeholder="Select a user name"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          className=" border border-gray-400 rounded-md p-2 w-full outline-none"
        />

        <button
          type="submit"
          className="border border-gray-500 rounded-md py-2 self-center px-8 mt-5 text-gray-500 "
        >
          Create
        </button>

        {errorMessage && <p className="text-red-600">{errorMessage}</p>}
      </div>
    </form>
  );
};

export default CreateAccount;
