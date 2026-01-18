import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axios";
import toast from "react-hot-toast";
import "./Quiz.css";

export default function Quiz() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [quiz, setQuiz] = useState(null);
    const [answers, setAnswers] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [result, setResult] = useState(null);
    const [attempted, setAttempted] = useState(false);
    const [loading, setLoading] = useState(true);

    // ----------------------------
    // Load quiz + attempt status
    // ----------------------------
    useEffect(() => {
        async function loadData() {
            try {
                const quizRes = await api.get(`/user/quiz/${id}`);
                setQuiz(quizRes.data);

                const attemptRes = await api.get(`/user/attempted/${id}`);
                setAttempted(attemptRes.data.attempted);
            } catch {
                toast.error("Failed to load quiz");
                navigate("/user");
            } finally {
                setLoading(false);
            }
        }

        loadData();
    }, [id, navigate]);

    // ----------------------------
    // Select answer
    // ----------------------------
    function selectAnswer(question, option) {
        if (attempted) return;
        setAnswers((prev) => ({
            ...prev,
            [question]: option,
        }));
    }

    // ----------------------------
    // Submit quiz
    // ----------------------------
    async function submitQuiz() {
        if (attempted) {
            toast.error("You have already attempted this quiz");
            return;
        }

        try {
            const res = await api.post("/user/submit", {
                quiz_id: id,
                answers,
            });

            setResult(res.data);
            setSubmitted(true);
            setAttempted(true);
            toast.success("Quiz submitted successfully");
        } catch (err) {
            toast.error(err.response?.data?.detail || "Submission failed");
        }
    }

    if (loading) return <p className="loading">Loading...</p>;
    if (!quiz) return null;

    return (
        <div className="quiz-wrapper">
            <h2 className="quiz-title">Subject:{quiz.subject} Quiz</h2>

            {attempted && !submitted && (
                <div className="already-attempted">
                    You have already attempted this quiz
                </div>
            )}

            {!submitted &&
                quiz.mcqs.map((q, i) => (
                    <div key={i} className="question-card">
                        <p className="question-text">
                            {i + 1}. {q.question}
                        </p>

                        {q.options.map((opt, j) => (
                            <label
                                key={j}
                                className={`option ${answers[q.question] === opt ? "selected" : ""
                                    } ${attempted ? "disabled" : ""}`}
                            >
                                <input
                                    type="radio"
                                    name={q.question}
                                    disabled={attempted}
                                    checked={answers[q.question] === opt}
                                    onChange={() => selectAnswer(q.question, opt)}
                                />
                                {opt}
                            </label>
                        ))}
                    </div>
                ))}

            {!submitted && (
                <button
                    className="submit-btn"
                    disabled={attempted}
                    onClick={submitQuiz}
                >
                    {attempted ? "Already Attempted" : "Submit Quiz"}
                </button>
            )}

            {submitted && result && (
                <div className="result-card">
                    <h3>Quiz Result</h3>

                    <p>
                        Score: <b>{result.score}</b> / {result.total}
                    </p>
                    <p>Percentage: {result.percentage.toFixed(2)}%</p>

                    <p className="grade">
                        Grade: <span>{result.grade}</span>
                    </p>

                    <button className="back-btn" onClick={() => navigate("/user")}>
                        Back to Subjects
                    </button>
                </div>
            )}
        </div>
    );
}
