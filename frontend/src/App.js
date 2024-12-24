import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Chat from "./components/Chat";
import Terms from "./components/TermsModal";

function App() {
    const [user, setUser] = useState(null);

    // Check for user persistence from cookies on app load
    useEffect(() => {
        const userIdFromCookie = document.cookie
            .split("; ")
            .find((row) => row.startsWith("user_id="))
            ?.split("=")[1];

        if (userIdFromCookie) {
            setUser(userIdFromCookie);
        }
    }, []);

    // Dark Mode State
    const [darkMode, setDarkMode] = useState(false);

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
        document.documentElement.classList.toggle("dark");
    };

    return (
        <Router>
            <div
                className={`min-h-screen flex flex-col ${
                    darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-800"
                }`}
            >
                {/* Header */}
                <header className="flex justify-between items-center p-4 bg-white dark:bg-gray-800 shadow">
                    <h1 className="text-xl font-bold">Anonymous Chat</h1>
                    <button
                        onClick={toggleDarkMode}
                        className="p-2 rounded bg-blue-500 text-white dark:bg-blue-700"
                    >
                        {darkMode ? "🌞 Light Mode" : "🌙 Dark Mode"}
                    </button>
                </header>

                {/* Main Content */}
                <main className="flex-1">
                    <Routes>
                        <Route
                            path="/"
                            element={user ? <Navigate to="/chat" /> : <Login setUser={setUser} />}
                        />
                        <Route
                            path="/login"
                            element={user ? <Navigate to="/chat" /> : <Login setUser={setUser} />}
                        />
                        <Route
                            path="/chat"
                            element={user ? <Chat currentUserId={user} /> : <Navigate to="/login" />}
                        />
                        <Route path="/terms" element={<Terms />} />
                        <Route path="*" element={<Navigate to={user ? "/chat" : "/login"} />} />
                    </Routes>
                </main>

                {/* Footer */}
                <footer className="p-4 text-center bg-gray-200 dark:bg-gray-700">
                    <p>© 2024 Anonymous Chat App | <a href="/terms" className="underline">Terms & Conditions</a></p>
                </footer>
            </div>
        </Router>
    );
}

export default App;
