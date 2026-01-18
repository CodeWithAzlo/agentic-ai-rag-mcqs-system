import { useQuery } from "@tanstack/react-query";
import api from "../api/axios";
import { Link } from "react-router-dom";
import "./UserDashboard.css";

export default function UserDashboard() {
    const { data = [] } = useQuery({
        queryKey: ["quizzes"],
        queryFn: async () => (await api.get("/user/quizzes")).data,
    });

    return (
        <div className="user-wrapper">
            <h2 className="title">Available Quizzes</h2>

            <div className="quiz-grid">
                {data.map((q) => {
                    const attempted = localStorage.getItem(`quiz_${q.id}`);

                    return (
                        <div key={q.id} className="quiz-card">
                            <h3>{q.subject}</h3>

                            {attempted ? (
                                <span className="attempted">✔ Already Attempted</span>
                            ) : (
                                <Link className="start-btn" to={`/quiz/${q.id}`}>
                                    Start Quiz
                                </Link>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
