import React, { useEffect, useMemo, useRef, useState } from "react";
import { io } from "socket.io-client";
import { BsThreeDotsVertical } from "react-icons/bs";
import { baseUrl } from "../config";
import music from ".//music.mp3";

const Chat = () => {
  const socket = useMemo(() => io(`${baseUrl}`), []);

  const [userName, setUserName] = useState("");
  const [allUsers, setAllUsers] = useState([]);
  const [sendTo, setSendTo] = useState("");
  const [message, setMessage] = useState("");
  const [allMessage, setAllMessage] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [showMessages, setShowMessages] = useState(false);
  const chatRef = useRef()
  const sendHandler = (e) => {
    e.preventDefault();
    if (!sendTo || !message) return;
    allMessage.push({
      _id: Math.random(),
      sender: userName,
      receiver: sendTo,
      message,
    });
    setTimeout(()=>{
      chatRef.current.scrollTo(
        0,
        chatRef.current.scrollHeight || chatRef.current.documentElement.scrollHeight
      );
    },1000)
    

    setAllMessage([...allMessage]);
    socket.emit("sendmessage", message, sendTo, userName);
    setMessage("");
  };

  useEffect(() => {
    const username = sessionStorage.getItem("userName");
    setUserName(username);
    setRooms([username]);
    socket.on("connect", () => {
      socket.emit("joinroom", [username]);
    });

    socket.on("allusers", (arg) => {
      setAllUsers([...arg]);
    });
    socket.on("recover", (m) => {
      setAllMessage([...m]);
      setTimeout(() => {
        chatRef.current.scrollTo(
          0,
          chatRef.current.scrollHeight || chatRef.current.documentElement.scrollHeight
        );
      }, 3000);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    const callback = (m, sender, receiver) => {
      console.log(
        "sender",
        sender,
        "receiver",
        receiver,
        "sendTo",
        sendTo,
        "message",
        m
      );
      console.log(sender === sendTo);
      if (sender === sendTo) {
        setAllMessage((prev) => [
          ...prev,
          { sender, message: m, receiver, _id: Math.random() },
        ]);
        let audio = new Audio(music);
        audio.play();
        chatRef.current.scrollTo(
          0,
          chatRef.current.scrollHeight || chatRef.current.documentElement.scrollHeight
        );
      }
    };
    socket.on("sendmessage1", callback);

    return () => {
      socket.off("sendmessage1", callback);
    };
  }, [sendTo]);
  useEffect(() => {
    let callback = (status, u) => {
      console.log(status, u);
      allUsers.forEach((user) => {
        if (user.userName === u) {
          user.status = !!status;
        }
      });
      setAllUsers([...allUsers]);
    };
    if (allUsers.length > 0) {
      socket.on("status", callback);
    }

    return () => {
      socket.off("status", callback);
    };
  }, [allUsers]);

  const joinRoomHandler = (val) => {
    console.log(val);
    setSendTo(val);
    socket.emit("joinroom", [...rooms, val]);
    setRooms([...rooms, val]);
  };

  useEffect(() => {
    (() => {
      if (userName && sendTo) {
        socket.emit("recover", userName, sendTo);
      }
    })();
  }, [userName, sendTo]);



  return (
    <div className="bg-[#F0F2F5] ">
      <div className="flex flex-col sm:flex-row min-h-screen">
        <div className=" w-full  sm:w-[50vw] md:w-[400px] sm:max-w-[400px] border-r border-r-gray-300   ">
          <div className="px-4 py-3 flex justify-between items-center">
            {/* profile picture  */}
            <div className="flex gap-x-4 items-center">
              <img
                src="https://pps.whatsapp.net/v/t61.24694-24/415530524_3288091887993324_4256862368718844196_n.jpg?stp=dst-jpg_s96x96&ccb=11-4&oh=01_AdRCIRvDb5gyahd09Jv35UdLfOehDMqRTxMTwZV2WPdGDw&oe=65CD7B9E&_nc_sid=e6ed6c&_nc_cat=106"
                alt="profile picture"
                className="rounded-full w-10 h-10"
              />
              <p>{userName}</p>
            </div>

            {/* menu  */}
            <BsThreeDotsVertical />
          </div>
          <ul className="overflow-y-auto h-[calc(100vh-64px)]">
            {allUsers.map((user, index) => (
              <li key={user._id}>
                {user.userName === userName ? null : (
                  <p
                    onClick={() => joinRoomHandler(user.userName)}
                    style={
                      sendTo === user.userName ? { background: "#d1cece" } : {}
                    }
                    className="py-2 px-4 text-gray-800 cursor-pointer hover:bg-[#d1cece]"
                  >
                    {user?.status && (
                      <span className="w-2 h-2 inline-block rounded-full bg-green-600"></span>
                    )}

                    {user.userName}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </div>

        {sendTo ? (
          <div 
          ref={chatRef}
          className="   w-full bg-[#F4F1EB]  overflow-y-auto h-[calc(100vh-82px)] scroll-smooth pb-4">
            <p className="block text-center py-3 text-2xl font-semibold">
              To : {sendTo}
            </p>
            <ul className=" flex flex-col ">
              {allMessage.map((msg, index) => (
                <li
                  key={index}
                  className={`px-3 py-3 ${
                    msg?.sender === userName
                      ? "bg-green-200  ml-auto mr-4"
                      : " mr-auto ml-4 bg-gray-300"
                  } mt-4 w-auto inline-block rounded-md `}
                >
                  {msg?.message}
                </li>
              ))}
            </ul>
            <form
              className="fixed shadow-md rounded-md right-0 left-0 sm:left-[50vw] md:left-[400px]    bottom-0      bg-white  flex py-5 px-10  items-center justify-center"
              onSubmit={sendHandler}
            >
              <input
                type="text"
                placeholder="Enter your Message"
                className="border border-gray-400 w-full rounded-l-md p-2 outline-none "
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <button className="bg-green-600 text-white rounded-r-md px-4 py-2">
                Send
              </button>
            </form>
          </div>
        ) : (
          <div className=" w-full flex   items-center justify-center  bg-green-100 h-screen z-[1]">
            <h2 className="font-semibold text-2xl">Welcome to messaging App</h2>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
