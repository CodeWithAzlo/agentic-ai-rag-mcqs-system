import { useEffect, useState } from "react";
import api from "../api/axios";
import toast from "react-hot-toast";
import "./OwnDashboard.css";

export default function OwnDashboard() {
    const [user, setUser] = useState(null);
    const [attempts, setAttempts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchDashboard() {
            try {
                const userRes = await api.get("/auth/me");
                setUser(userRes.data);

                const res = await api.get("/user/dashboard");
                setAttempts(res.data.attempts);
            } catch (err) {
                toast.error(err.response?.data?.detail || "Failed to load dashboard");
            } finally {
                setLoading(false);
            }
        }

        fetchDashboard();
    }, []);

    const avgPercentage =
        attempts.length > 0
            ? (
                attempts.reduce((acc, a) => acc + a.percentage, 0) /
                attempts.length
            ).toFixed(1)
            : 0;

    return (
        <div className="own-dashboard">
            {/* HERO */}
            {user && (
                <div className="own-hero">
                    <h2>Welcome back, {user.name.toUpperCase()} 👋</h2>
                    <p className="email">{user.email}</p>
                    <p className="quote">
                        “Learning never exhausts the mind — it empowers it.”
                    </p>
                </div>
            )}

            {/* STATS */}
            <div className="own-stats">
                <div className="own-stat">
                    <span>Total Attempts</span>
                    <strong>{attempts.length}</strong>
                </div>
                <div className="own-stat">
                    <span>Average Score</span>
                    <strong>{avgPercentage}%</strong>
                </div>
            </div>

            {/* CONTENT */}
            <h3 className="section-title">📘 Your Quiz Progress {user?.name?.toUpperCase() || ''}</h3>

            {loading ? (
                <p className="loading">Loading your progress…</p>
            ) : attempts.length === 0 ? (
                <p className="empty">
                    You haven’t attempted any quizzes yet. Start learning today 🚀
                </p>
            ) : (
                <div className="progress-card">
                    <div className="progress-header">
                        <span>#</span>
                        <span>Subject</span>
                        <span>Score</span>
                        <span>%</span>
                        <span>Grade</span>
                        <span>Date</span>
                    </div>

                    {attempts.map((a, i) => (
                        <div className="progress-row" key={i}>
                            <span>{i + 1}</span>
                            <span className="strong">{a.subject}</span>
                            <span>
                                {a.score}/{a.total}
                            </span>
                            <span className="success">{a.percentage}%</span>
                            <span className={`grade ${a.grade.toLowerCase()}`}>
                                {a.grade}
                            </span>
                            <span className="muted">
                                {a.attempted_on
                                    ? new Date(a.attempted_on).toLocaleDateString()
                                    : "-"}
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
