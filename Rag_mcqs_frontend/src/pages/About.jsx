import LightRays from "../components/reactbits/LightRays";
import "./About.css";

export default function About() {
    return (
        <div className="about-container">
            <LightRays />
            {/* HERO */}
            <section className="about-hero">
                <h1>
                    Transforming Assessments with <span>AI & RAG</span>
                </h1>
                <p>
                    A smart MCQ generation and evaluation platform designed for modern
                    education.
                </p>
            </section>

            {/* CONTENT */}
            <section className="about-content">
                <div className="about-card">
                    <h3>🚀 What is AI MCQs?</h3>
                    <p>
                        AI MCQs is a Retrieval-Augmented Generation (RAG) based assessment
                        system where teachers upload study material and AI automatically
                        generate intelligent multiple-choice questions.
                    </p>
                </div>

                <div className="about-card">
                    <h3>🧠 Why RAG?</h3>
                    <p>
                        RAG ensures that questions are generated directly from the uploaded
                        content itself, reducing hallucinations and improving accuracy,
                        relevance, and trust.
                    </p>
                </div>

                <div className="about-card">
                    <h3>🎯 Smart Evaluation</h3>
                    <p>
                        Students attempt quizzes once, receive instant scores, grades,
                        and results are securely stored for future analysis.
                    </p>
                </div>
            </section>

            {/* STUDENT FLOW */}
            <section className="about-flow">
                <LightRays />
                <h2>How Students Use the System</h2>

                <div className="flow-steps">
                    <div className="flow-step">
                        <span>1️⃣</span>
                        <p>Student signs up and logs into the system</p>
                    </div>

                    <div className="flow-step">
                        <span>2️⃣</span>
                        <p>Available subjects and quizzes are displayed</p>
                    </div>

                    <div className="flow-step">
                        <span>3️⃣</span>
                        <p>Student attempts AI-generated MCQs (one attempt only)</p>
                    </div>

                    <div className="flow-step">
                        <span>4️⃣</span>
                        <p>Live score, percentage, and grade are generated instantly</p>
                    </div>

                    <div className="flow-step">
                        <span>5️⃣</span>
                        <p>Results are saved securely for records and review</p>
                    </div>
                </div>
            </section>

            {/* QUOTE */}
            <section className="about-quote">
                <p>
                    “Technology will not replace great teachers, but technology is in the
                    hands of great teachers, and can be transformational.”
                </p>
                <span>— Azlo (Abasyn University Student)</span>
            </section>
        </div>
    );
}
