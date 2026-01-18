import api from "../api/axios";
import toast from "react-hot-toast";
import { useState } from "react";
import "./AdminDashboard.css";

export default function AdminDashboard() {
    const [mcqs, setMcqs] = useState([]);
    const [loading, setLoading] = useState(false);

    async function upload(e) {
        e.preventDefault();
        const form = new FormData(e.target);

        setLoading(true);
        setMcqs([]); // clear previous MCQs

        try {
            // 1️⃣ Upload PDF/DOCX/Image & generate MCQs
            const res = await api.post("/admin/upload", form);
            toast.success("Quiz created successfully");

            // 2️⃣ Small delay to ensure DB consistency
            await new Promise(resolve => setTimeout(resolve, 300));

            // 3️⃣ Fetch quiz for preview
            try {
                const quiz = await api.get(`/user/quiz/${res.data.quiz_id}`);
                setMcqs(quiz.data.mcqs);
            } catch (previewErr) {
                toast.error("Quiz created but preview failed");
                console.error("Preview error:", previewErr);
            }

        } catch (uploadErr) {
            // Show backend error or fallback message
            toast.error(uploadErr.response?.data?.detail || "Upload failed");
            console.error("Upload error:", uploadErr);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="admin-wrapper">
            <div className="admin-card">
                <h2>Admin Panel</h2>
                <p>Upload PDF / DOCX / Image to generate MCQs</p>

                <form onSubmit={upload} className="upload-form">
                    <input
                        name="subject"
                        placeholder="Enter Subject"
                        required
                    />
                    <input
                        type="file"
                        name="file"
                        accept=".pdf,.docx,.png,.jpg,.jpeg"
                        required
                    />

                    <button type="submit" disabled={loading}>
                        {loading ? "Uploading & Generating..." : "Upload & Generate MCQs"}
                    </button>
                </form>
            </div>

            {/* 🔍 MCQs Preview */}
            {mcqs.length > 0 && (
                <div className="preview-section">
                    <h3>MCQs Preview</h3>
                    {mcqs.map((m, i) => (
                        <div key={i} className="mcq-card">
                            <p className="question">
                                {i + 1}. {m.question}
                            </p>
                            <ul>
                                {m.options.map((o, j) => (
                                    <li key={j}>{o}</li>
                                ))}
                            </ul>
                            <p className="correct">
                                Correct Answer: <b>{m.correct_answer}</b>
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
