import React, { useState, useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";
import axios from "../config/axios";
import {initializeSocket, receiveMessage, sendMessage} from "../config/socket";
import {UserContext} from "../context/user.context";
const Project = () => {
  const location = useLocation();
  const { user } = useContext(UserContext);

  // ================= PROJECT =================

  const [project, setProject] = useState(location.state.project);

  // ================= UI STATES =================

  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);

  // ================= USERS =================

  const [users, setUsers] = useState([]);

  // Set is used because multiple users can be selected
  const [selectedUserId, setSelectedUserId] = useState(new Set());

  const[message, setMessage] = useState("");

  const messageBox = React.createRef();

  // ================= SELECT USER =================

  const handleUserClick = (id) => {
    setSelectedUserId((prevSelectedUserId) => {
      const newSelectedUserId = new Set(prevSelectedUserId);

      if (newSelectedUserId.has(id)) {
        newSelectedUserId.delete(id);
      } else {
        newSelectedUserId.add(id);
      }

      return newSelectedUserId;
    });
  };

  // ================= ADD COLLABORATORS =================

  function addCollaborators() {
    axios
      .put("/projects/add-user", {
        projectId: location.state.project._id,
        users: Array.from(selectedUserId),
      })
      .then((res) => {
        setIsModalOpen(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const send = () => {

    sendMessage('project-message',{
      message,
      sender: user
    })

    appendOutgoingMessage(message);

    setMessage("");

  }

  // ================= FETCH PROJECT + USERS =================

  useEffect(() => {

    initializeSocket(project._id);
    
    receiveMessage('project-message', (data) => {
      console.log(data);
      appendIncomingMessage(data);
    });

    axios
      .get(`/projects/get-project/${location.state.project._id}`)
      .then((res) => {  
        setProject(res.data.project);
      })
      .catch((err) => {
        console.log(err);
      });

    // Get all users
    axios
      .get("/users/all")
      .then((res) => {

        setUsers(res.data.users);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  function appendIncomingMessage(messageObject){
    const messageBox = document.querySelector('.message-box');

    const message = document.createElement('div');
    message.classList.add('message', 'flex', 'flex-col', 'p-2', 'bg-slate-50', 'rounded-md', 'w-fit', 'max-w-56');
    message.innerHTML = `
      <small className="text-xs opacity-65">${messageObject.sender.email}</small>
      <p className="text-sm">${messageObject.message}</p>
    `;
    messageBox.appendChild(message);
    scrollToBottom();
  }

  function appendOutgoingMessage(message){
    const messageBox = document.querySelector('.message-box');

    const newMessage = document.createElement('div');
    newMessage.classList.add('ml-auto', 'message', 'flex', 'flex-col', 'p-2', 'bg-slate-50', 'rounded-md', 'w-fit', 'max-w-56');
    newMessage.innerHTML = `
      <small className="text-xs opacity-65">${user.email}</small>
      <p className="text-sm">${message}</p>
    `;
    messageBox.appendChild(newMessage);
    scrollToBottom();
  }

  function scrollToBottom() {
      messageBox.current.scrollTop = messageBox.current.scrollHeight;
  }

  return (
    <main className="h-screen w-screen flex bg-slate-100">

      {/* LEFT SIDE - PROJECT + CHAT */}
      {/* ================================================= */}

      <section className="left relative flex flex-col h-screen min-w-96 bg-slate-300">

        {/* ================= HEADER ================= */}

        <header className="flex justify-between items-center p-2 px-4 w-full bg-slate-100 absolute z-10 top-0">

          {/* ADD COLLABORATOR */}

          <button className="flex gap-2 items-center" onClick={() => setIsModalOpen(true)}>
            <i className="ri-add-fill mr-1"></i>

            <p>Add collaborator</p>
          </button>

          {/* USERS */}

          <button onClick={() => setIsSidePanelOpen(!isSidePanelOpen)} className="p-2">
            <i className="ri-group-fill"></i>
          </button>

        </header>

        {/* ================================================= */}
        {/* CONVERSATION */}
        {/* ================================================= */}

        <div className="conversation-area pt-14 pb-10 grow flex flex-col h-full relative">

          {/* ================= MESSAGES ================= */}

          <div 
            ref={messageBox}
            className="message-box p-1 grow flex flex-col gap-1 overflow-auto max-h-full">
          
          </div>

          {/* ================= MESSAGE INPUT ================= */}

          <div className="inputField w-full flex absolute bottom-0">

            <input 
              value={message} 
              onChange={(e) => setMessage(e.target.value)}
              className='p-2 px-4 border-none outline-none grow' type="text" placeholder='Enter message'>
            </input>

            <button
              onClick={send}
            className='px-5 bg-slate-950 text-white'>
            <i className="ri-send-plane-fill"></i>
            </button>
          </div>

        </div>

        {/* ================================================= */}
        {/* COLLABORATORS SIDE PANEL */}
        {/* ================================================= */}

        <div className={`sidePanel w-full h-full flex flex-col gap-2 bg-slate-50 absolute transition-all ${isSidePanelOpen ? "translate-x-0" : "-translate-x-full"} top-0`}>

          {/* ================= PANEL HEADER ================= */}

          <header className="flex justify-between items-center px-4 p-2 bg-slate-200">

            <h1 className="font-semibold text-lg">Collaborators</h1>

            <button onClick={() => setIsSidePanelOpen(false)} className="p-2">
              <i className="ri-close-fill"></i>
            </button>

          </header>

          {/* ================= COLLABORATORS ================= */}

          <div className="users flex flex-col gap-2">

            {project?.users?.map((projectUser) => (
              <div key={projectUser._id} className="user cursor-pointer hover:bg-slate-200 p-2 flex gap-2 items-center">

                {/* USER ICON */}

                <div className="aspect-square rounded-full w-fit h-fit flex items-center justify-center p-5 text-white bg-slate-600">
                  <i className="ri-user-fill absolute"></i>
                </div>

                {/* EMAIL */}

                <h1 className="font-semibold text-lg">{projectUser.email}</h1>

              </div>
            ))}

          </div>

        </div>

      </section>

      {/* ================================================= */}
      {/* ADD USER MODAL */}
      {/* ================================================= */}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">

          <div className="bg-white p-4 rounded-md w-96 max-w-full relative">

            {/* ================= MODAL HEADER ================= */}

            <header className="flex justify-between items-center mb-4">

              <h2 className="text-xl font-semibold">Select User</h2>

              <button
                onClick={() => {
                  setIsModalOpen(false);

                  setSelectedUserId(new Set());
                }}
                className="p-2"
              >
                <i className="ri-close-fill"></i>
              </button>

            </header>

            {/* ================= USER LIST ================= */}

            <div className="users-list flex flex-col gap-2 mb-16 max-h-96 overflow-auto">

              {users.map((user) => (
                <div key={user._id} className={`user cursor-pointer hover:bg-slate-200 p-2 flex gap-2 items-center rounded-md ${selectedUserId.has(user._id) ? "bg-slate-200" : ""}`} onClick={() => handleUserClick(user._id)}>

                  {/* USER ICON */}

                  <div className="aspect-square relative rounded-full w-fit h-fit flex items-center justify-center p-5 text-white bg-slate-600">
                    <i className="ri-user-fill absolute"></i>
                  </div>

                  {/* EMAIL */}

                  <h1 className="font-semibold text-lg">{user.email}</h1>

                  {/* SELECTED CHECK */}

                  {selectedUserId.has(user._id) && (
                    <i className="ri-check-line ml-auto text-blue-600 text-xl"></i>
                  )}

                </div>
              ))}

            </div>

            {/* ================= ADD BUTTON ================= */}

            <button onClick={addCollaborators} disabled={selectedUserId.size === 0} className="absolute bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-blue-600 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed">
              Add Collaborators
            </button>

          </div>

        </div>
      )}

    </main>
  );
};

export default Project;