import React, { useEffect, useState } from "react";
import io from "socket.io-client";

const Chat = () => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [room, setRoom] = useState(1);
  console.log(messages);
  useEffect(() => {
    // Conectar al servidor de Socket.IO
    //https://backend-playroom.vercel.app/
    //"http://localhost:3000"
    const newSocket = io("https://play-room.onrender.com", {
      query: {
        code: room,
      },
    });
    setSocket(newSocket);

    // Manejar mensajes entrantes
    newSocket.on("chat message", (message) => {
      console.log("hay algo?", message);
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    // Limpiar la conexión cuando el componente se desmonta
    return () => {
      newSocket.disconnect();
    };
  }, [room]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim() !== "") {
      // Enviar el mensaje al servidor
      socket.emit("chat message", inputValue);
      setInputValue("");
    }
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    console.log(e.target.value);
  };
console.log(room)
  const handleSubmitRoom = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const room = formData.get("room");
    setRoom(room);
  };
  return (
    <div>
      <ul>
        {messages.map((message, index) => (
          <li key={index}>{message}</li>
        ))}
      </ul>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          name="text"
        />
        <button type="submit">Enviar</button>
      </form>

      <form onSubmit={handleSubmitRoom} action="">
        <input type="text" name="room" />
        <button type="submit">Enviar sala</button>

      </form>
    </div>
  );
};

export default Chat;
