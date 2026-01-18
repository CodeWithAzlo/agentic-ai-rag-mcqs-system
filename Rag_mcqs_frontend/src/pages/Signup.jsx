import api from "../api/axios";
import toast from "react-hot-toast";
import "./Signup.css";

export default function Signup() {
    async function handleSubmit(e) {
        e.preventDefault();

        const name = e.target.name.value;
        const email = e.target.email.value;
        const password = e.target.password.value;

        try {
            await api.post("/auth/signup", { name, email, password });
            toast.success("Signup successful! You can now login");
            window.location.href = "/";
        } catch (err) {
            toast.error(err.response?.data?.detail || "Signup failed");
        }
    }

    return (
        <div className="signup-wrapper">
            <form onSubmit={handleSubmit} className="signup-card">
                <h2>Create Account ✨</h2>
                <p>Signup to start your journey</p>

                <input name="name" type="text" placeholder="Full Name" required />
                <input name="email" type="email" placeholder="Email" required />
                <input name="password" type="password" placeholder="Password" required />

                <button type="submit">Signup</button>

                <span className="login-link">
                    Already have an account? <a href="/login">Login</a>
                </span>
            </form>
        </div>
    );
}
