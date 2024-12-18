import React, { useState } from "react";
import axios from "axios";

function Login({ setUser }) {
    const [agreed, setAgreed] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!agreed) {
            alert("You must agree to the terms and conditions.");
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post("http://localhost:8000/login/");
            const { user_id } = response.data;
            console.log(response.data);

            setUser(user_id);
        } catch (error) {
            console.error("Error during login:", error);
            alert("Login failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: "20px", textAlign: "center" }}>
            <h1>Login to Chat</h1>
            <div>
                <input
                    type="checkbox"
                    checked={agreed}
                    onChange={() => setAgreed(!agreed)}
                />
                <label style={{ marginLeft: "10px" }}>
                    I agree to the <a href="/terms" target="_blank">Terms and Conditions</a>
                </label>
            </div>
            <button
                onClick={handleLogin}
                disabled={!agreed || loading}
                style={{ marginTop: "20px" }}
            >
                {loading ? "Logging in..." : "Login"}
            </button>
        </div>
    );
}

export default Login;
