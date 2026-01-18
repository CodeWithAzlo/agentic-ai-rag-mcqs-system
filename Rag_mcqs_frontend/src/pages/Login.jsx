import api from "../api/axios";
import useAuthStore from "../store/authStore";
import toast from "react-hot-toast";
import "./login.css";

export default function Login() {
    const login = useAuthStore((s) => s.login);

    async function handleSubmit(e) {
        e.preventDefault();
        const email = e.target.email.value;
        const password = e.target.password.value;

        try {
            const res = await api.post("/auth/login", { email, password });
            login(res.data.token, res.data.role);
            toast.success("Login successful");
            window.location.href = res.data.role === "admin" ? "/admin" : "/user";
        } catch {
            toast.error("Invalid credentials");
        }
    }

    return (
        <div className="login-wrapper">
            <form onSubmit={handleSubmit} className="login-card">
                <h2>Welcome Back 👋</h2>
                <p>Login to continue</p>

                <input name="email" type="email" placeholder="Email" required />
                <input name="password" type="password" placeholder="Password" required />

                <button type="submit">Login</button>

                <span className="signup-link">
                    Don’t have an account? <a href="/signup">Signup</a>
                </span>
            </form>
        </div>
    );
}
