import React, { useState, useEffect } from "react";

function Chat({ currentUserId, targetUserId }) {
    const [messages, setMessages] = useState([]);
    const [socket, setSocket] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);


    useEffect(() => {
        const ws = new WebSocket(`ws://localhost:8000/ws/chat/${currentUserId}/${currentUserId}/`);
        setSocket(ws);

        ws.onopen = () => console.log("Connected to WebSocket");

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setMessages((prevMessages) => [...prevMessages, data.message]);
        };

        ws.onclose = () => console.log("Disconnected from WebSocket");

        return () => {
            ws.close();
        };
    }, [currentUserId, targetUserId]);

    const sendMessage = (message) => {
        if (socket && message) {
            socket.send(JSON.stringify({ message }));
        }
    };

    const fetchOnlineUsers = async () => {
        try {
            const response = await fetch('http://localhost:8000/online-users/');
            if (response.ok) {
                const data = await response.json();
                console.log(data);
                setOnlineUsers(data.online_users);
            } else {
                console.error("Failed to fetch online users");
            }
        } catch (error) {
            console.error("Error fetching online users:", error);
        }
    };

    return (
        <div style={{ padding: "20px" }}>
            <h1>Welcome, User {currentUserId}</h1>
            <p>Status: <span style={{ color: "green" }}>Active</span></p>

            <h2>Chat</h2>
            <ul>
                {messages.map((msg, index) => (
                    <li key={index}>{msg}</li>
                ))}
            </ul>
            <button onClick={() => sendMessage("Hello!")}>Send Message</button>

            <hr />

<button onClick={fetchOnlineUsers}>Get Online Users</button>
{onlineUsers.length > 0 ? (
    <ul>
        {onlineUsers.map((user, index) => (
            <li key={index}>
                {user} <span style={{ color: 'green' }}>●</span>
            </li>
        ))}
    </ul>
) : (
    <p>No users online or fetch not performed yet.</p>
)}
        </div>
    );
}

export default Chat;
