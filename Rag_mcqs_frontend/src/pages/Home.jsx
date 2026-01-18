import { Link } from "react-router-dom";
import SplitText from "../components/reactbits/SplitText";
import ScrollReveal from "../components/reactbits/ScrollReveal";
import LightRays from "../components/reactbits/LightRays";
import "./Home.css";

export default function Home() {
    return (
        <div className="home-container">
            <LightRays />

            {/* SECTION 1: HERO (Centered Heading & Buttons) */}
            <section className="section hero-section">
                <div className="content-limit">
                    <SplitText text="AI Powered RAG-Based MCQs System" />
                    <p className="hero-subtitle">
                        Upload documents, generate intelligent MCQs using AI, and evaluate
                        students with real-time scoring.
                    </p>
                    <div className="hero-buttons">
                        <Link to="/signup" className="btn primary">Get Started</Link>
                        <Link to="/login" className="btn secondary">Login</Link>
                    </div>
                </div>
            </section>

            {/* SECTION 2: HOW IT WORKS (Dark Theme) */}
            <section className="section steps-section">
                <ScrollReveal>
                    <div className="content-limit horizontal-steps">
                        <h2>How It Works</h2>
                        <div className="step-cards">
                            <div className="step">📄 Admin uploads material</div>
                            <div className="step">🤖 AI generates MCQs</div>
                            <div className="step">🎓 Students attempt</div>
                            <div className="step">📊 Instant score</div>
                        </div>
                    </div>
                </ScrollReveal>
            </section>

            {/* SECTION 3: ROLES */}
            <section className="section roles-section">
                <ScrollReveal>
                    <div className="content-limit">
                        <h2>User Roles</h2>
                        <div className="role-cards">
                            <div className="role">
                                <h3>Admin / Teacher</h3>
                                <p>Upload documents, generate MCQs, and analyze student performance.</p>
                            </div>
                            <div className="role">
                                <h3>Student</h3>
                                <p>Attempt quizzes once, receive instant evaluation, and track performance.</p>
                            </div>
                        </div>
                    </div>
                </ScrollReveal>
            </section>
        </div>
    );
}