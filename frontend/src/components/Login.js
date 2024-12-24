import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import TermsModal from "./TermsModal";

function Login({ setUser }) {
    const [agreed, setAgreed] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showTerms, setShowTerms] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async () => {
        if (!agreed) {
            alert("You must agree to the terms and conditions.");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const response = await axios.post("http://localhost:8000/login/", { agreement: true });

            if (response.data.status === "success") {
                const { user_id } = response.data;

                setUser(user_id);
                document.cookie = `user_id=${user_id}; path=/; SameSite=Strict;`;
                navigate("/chat", { replace: true });
            } else {
                setError(response.data.message || "Login failed. Please try again.");
            }
        } catch (err) {
            console.error("Error during login:", err);
            setError("An error occurred during login. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            <div className="w-full max-w-md bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md dark:shadow-lg transition-colors duration-300">
                <h1 className="text-2xl font-semibold text-center text-gray-800 dark:text-gray-200 mb-6">
                    Welcome to Anonymous Chat
                </h1>

                {error && (
                    <div className="mb-4 p-3 bg-red-100 dark:bg-red-200 text-red-700 dark:text-red-800 rounded">
                        {error}
                    </div>
                )}

                <div className="flex items-start mb-4 gap-3">
                    <input
                        type="checkbox"
                        id="agreement"
                        checked={agreed}
                        onChange={(e) => setAgreed(e.target.checked)}
                        className="mt-1 h-5 w-5 text-blue-600 rounded border-gray-300 dark:border-gray-600 focus:ring-blue-500"
                    />
                    <label
                        htmlFor="agreement"
                        className="text-sm text-gray-600 dark:text-gray-300 leading-tight"
                    >
                        I agree to the{" "}
                        <span
                            onClick={() => setShowTerms(true)}
                            className="text-blue-600 dark:text-blue-400 underline cursor-pointer"
                        >
                            Terms and Conditions
                        </span>{" "}
                        and understand that this is an anonymous chat service.
                    </label>
                </div>

                <button
                    onClick={handleLogin}
                    disabled={!agreed || loading}
                    className={`w-full py-3 rounded-md text-white font-medium transition 
                        ${agreed && !loading ? "bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600" : "bg-gray-400 dark:bg-gray-600 cursor-not-allowed"}`}
                >
                    {loading ? "Connecting..." : "Start Chatting"}
                </button>
            </div>

            {showTerms && (
                <TermsModal
                    onClose={() => setShowTerms(false)}
                    onAccept={() => {
                        setAgreed(true);
                        setShowTerms(false);
                    }}
                />
            )}
        </div>
    );
}

export default Login;
