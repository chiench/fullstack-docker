import React, { useState } from "react";
import api from "../services/api";
import "./login.css";

export default function Login({ setToken }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [hover, setHover] = useState(false);
    const [focus, setFocus] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        try {
            setLoading(true);
            const res = await api.post("/login", { email, password });
            console.log(res, 'res');

            setToken(res.data.token);
            localStorage.setItem("token", res.data.token);
        } catch (err) {
            console.log(err, 'err');
            alert("Sai tài khoản hoặc mật khẩu");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={styles.title}>✨ Fullstack Project ✨</h2>

                <div style={styles.inputWrapper}>
                    <span style={styles.icon}>📧</span>
                    <input
                        style={{
                            ...styles.input,
                            border:
                                focus === "email"
                                    ? "1px solid #764ba2"
                                    : "1px solid rgba(0,0,0,0.1)",
                            boxShadow:
                                focus === "email"
                                    ? "0 0 12px rgba(118,75,162,0.4)"
                                    : "none",
                        }}
                        placeholder="Email"
                        onFocus={() => setFocus("email")}
                        onBlur={() => setFocus(null)}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div style={styles.inputWrapper}>
                    <span style={styles.icon}>🔒</span>
                    <input
                        type="password"
                        style={{
                            ...styles.input,
                            border:
                                focus === "password"
                                    ? "1px solid #764ba2"
                                    : "1px solid rgba(0,0,0,0.1)",
                            boxShadow:
                                focus === "password"
                                    ? "0 0 12px rgba(118,75,162,0.4)"
                                    : "none",
                        }}
                        placeholder="Password"
                        onFocus={() => setFocus("password")}
                        onBlur={() => setFocus(null)}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <button
                    style={{
                        ...styles.button,
                        transform: hover ? "scale(1.06)" : "scale(1)",
                        boxShadow: hover
                            ? "0 10px 25px rgba(118,75,162,0.5)"
                            : "0 5px 15px rgba(0,0,0,0.2)",
                        opacity: loading ? 0.7 : 1,
                        cursor: loading ? "not-allowed" : "pointer",
                    }}
                    onMouseEnter={() => setHover(true)}
                    onMouseLeave={() => setHover(false)}
                    onClick={handleLogin}
                    disabled={loading}
                >
                    {loading ? "Đang đăng nhập..." : "🚀 Login"}
                </button>
            </div>
        </div>
    );
}

const styles = {
    container: {
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background:
            "linear-gradient(-45deg,#667eea,#764ba2,#ff6cab,#ffb347)",
        backgroundSize: "300% 300%",
        animation: "gradientMove 10s ease infinite",
        fontFamily: "'Segoe UI', sans-serif",
    },
    card: {
        background: "rgba(255,255,255,0.85)",
        padding: 45,
        borderRadius: 18,
        width: 340,
        textAlign: "center",
        backdropFilter: "blur(15px)",
        boxShadow: "0 25px 60px rgba(0,0,0,0.3)",
        border: "1px solid rgba(255,255,255,0.3)",
    },
    title: {
        marginBottom: 25,
        color: "#333",
        fontWeight: "700",
        fontSize: "22px",
    },

    inputWrapper: {
        display: "flex",
        alignItems: "center",
        background: "#fff",
        borderRadius: 14,
        padding: "0 14px",
        margin: "14px 0",
        boxShadow: "0 5px 15px rgba(0,0,0,0.08)",
        transition: "all 0.3s ease",
    },

    icon: {
        fontSize: 16,
        marginRight: 10,
        opacity: 0.7,
    },

    input: {
        flex: 1,
        padding: "14px 6px",
        border: "none",
        outline: "none",
        fontSize: "14px",
        background: "transparent",
        textAlign: "left",
    },
    width: 380,
    padding: "50px 45px",
    button: {
        marginTop: 25,
        width: "100%",
        padding: "13px",
        borderRadius: 10,
        border: "none",
        background:
            "linear-gradient(135deg,#667eea,#764ba2)",
        color: "#fff",
        fontWeight: "700",
        fontSize: "15px",
        transition: "all 0.3s ease",
    },
};