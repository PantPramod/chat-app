import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { baseUrl } from "../config";

const Login = () => {
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    if (userName) {
      try {
        const { data } = await axios.post(`${baseUrl}/login`, {
          userName,
        });
        sessionStorage.setItem("userName", data?.userName);
        navigate("/chat");
      } catch (err) {}
    }
  };
  return (
    <form
      onSubmit={submitHandler}
      className="flex flex-col min-h-[calc(100vh-100px)]  justify-center max-w-[500px] mx-auto"
    >
      <input
        type="text"
        placeholder="Enter user name"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
        className=" border border-gray-400 rounded-md p-2 w-full outline-none"
      />

      <button
        type="submit"
        className="border border-gray-500 rounded-md py-2 self-center px-8 mt-5 text-gray-500 "
      >
        Login
      </button>
    </form>
  );
};

export default Login;
