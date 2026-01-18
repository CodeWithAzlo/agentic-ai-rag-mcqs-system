import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function SplitText({ text }) {
    const textRef = useRef(null);

    useEffect(() => {
        const chars = textRef.current.querySelectorAll("span");

        gsap.fromTo(
            chars,
            { opacity: 0, y: 40 },
            {
                opacity: 1,
                y: 0,
                stagger: 0.05,
                duration: 0.8,
                ease: "power3.out",
            }
        );
    }, []);

    return (
        <h1 className="hero-title" ref={textRef}>
            {text.split("").map((char, i) => (
                <span key={i}>{char === " " ? "\u00A0" : char}</span>
            ))}
        </h1>
    );
}
