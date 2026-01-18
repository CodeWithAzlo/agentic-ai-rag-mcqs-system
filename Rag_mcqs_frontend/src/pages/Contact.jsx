import LightRays from "../components/reactbits/LightRays";
import "./Contact.css";

export default function Contact() {
    return (
        <div className="contact-container">
            <LightRays />
            {/* HEADER */}
            <section className="contact-header">
                <h1>Get in Touch</h1>
                <p>
                    Have questions, ideas, or feedback? We’d love to hear from you.
                </p>
            </section>

            {/* CONTENT */}
            <section className="contact-content">
                {/* FORM */}
                <form className="contact-form">
                    <LightRays />
                    <input type="text" placeholder="Your Name" required />
                    <input type="email" placeholder="Your Email" required />
                    <textarea placeholder="Your Message" rows="5" required />
                    <button type="submit">Send Message</button>
                </form>

                {/* QUOTE */}
                <div className="contact-quote">
                    <p>
                        “Education is not the learning of facts, but the training of the
                        mind to think.”
                    </p>
                    <span>— Albert Einstein</span>
                </div>
            </section>
        </div>
    );
}
