import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";

import Login from "./components/Login";
import Chat from "./components/Chat";
import Terms from "./components/TermsandConditions";

// function Chat({ currentUserId, targetUserId }) {
//     const [messages, setMessages] = useState([]);
//     const [socket, setSocket] = useState(null);

//     useEffect(() => {
//         const ws = new WebSocket(`ws://localhost:8000/ws/chat/${'dc09'}/${'ae45'}/`);
//         setSocket(ws);

//         ws.onopen = () => console.log("Connected to WebSocket");

//         ws.onmessage = (event) => {
//             const data = JSON.parse(event.data);
//             setMessages((prevMessages) => [...prevMessages, data.message]);
//         };

//         ws.onclose = () => console.log("Disconnected from WebSocket");

//         return () => {
//             ws.close();
//         };
//     }, [currentUserId, targetUserId]);

//     const sendMessage = (message) => {
//         if (socket && message) {
//             socket.send(JSON.stringify({ message }));
//         }
//     };

//     return (
//         <div>
//             <h2>Chat</h2>
//             <ul>
//                 {messages.map((msg, index) => (
//                     <li key={index}>{msg}</li>
//                 ))}
//             </ul>
//             <button onClick={() => sendMessage("Hello!")}>Send Message</button>
//         </div>
//     );
// }

// export default Chat;

function App() {
    const [user, setUser] = useState(null);

    return (
        <Router>
            <Routes>
                <Route
                    path="/"
                    element={
                        user ? <Navigate to="/chat" /> : <Login setUser={setUser} />
                    }
                />
                <Route
                    path="/chat"
                    element={
                        user ? (
                            <Chat currentUserId={user} />
                        ) : (
                            <Navigate to="/" />
                        )
                    }
                />
                <Route path="/terms" element={<Terms />} />
            </Routes>
        </Router>
    );
}

export default App;
