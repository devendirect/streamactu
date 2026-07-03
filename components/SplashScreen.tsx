"use client";
import { useEffect, useRef, useState } from "react";

type Phase = "intro" | "exit" | "done";

export default function SplashScreen() {
  // Chargé via dynamic({ ssr: false }) : window est disponible dès l'init.
  const [phase, setPhase] = useState<Phase>(() =>
    sessionStorage.getItem("sa-splash") === "1" ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? "done"
      : "intro"
  );
  const logoRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (phase !== "intro") return;

    const t = setTimeout(() => {
      const logo = logoRef.current;
      const target = document.querySelector<Element>("[data-logo-header]");

      if (logo && target) {
        const from = logo.getBoundingClientRect();
        const to = target.getBoundingClientRect();
        const scale = to.height / from.height;
        const dx = to.left + to.width / 2 - (from.left + from.width / 2);
        const dy = to.top + to.height / 2 - (from.top + from.height / 2);
        logo.style.setProperty("--fly", `translate(${dx}px,${dy}px) scale(${scale})`);
      }

      setPhase("exit");

      setTimeout(() => {
        sessionStorage.setItem("sa-splash", "1");
        setPhase("done");
      }, 750);
    }, 1500);

    return () => clearTimeout(t);
  }, [phase]);

  if (phase === "done") return null;

  return (
    <div
      className="sa-splash fixed inset-0 z-[9999] flex flex-col items-center justify-center gap-5"
      style={{ background: "radial-gradient(120% 90% at 50% 44%, #1B1810 0%, #0B0A07 70%)" }}
      data-phase={phase}
      aria-hidden="true"
    >
      <svg
        ref={logoRef}
        className="sa-splash__logo"
        width="150"
        height="150"
        viewBox="0 0 120 120"
        fill="none"
      >
        <circle className="sa-halo" cx="68" cy="34" r="20" fill="#E3A53A" />
        <circle
          className="sa-ring"
          cx="68"
          cy="34"
          r="11"
          fill="none"
          stroke="#E3A53A"
          strokeWidth="2"
        />
        <g stroke="#ECE6D8" strokeWidth="6" strokeLinecap="round">
          <line className="sa-base" x1="18" y1="84" x2="102" y2="84" />
          <line className="sa-t1" x1="34" y1="84" x2="34" y2="74" />
          <line className="sa-t2" x1="50" y1="84" x2="50" y2="74" />
          <line className="sa-t3" x1="86" y1="84" x2="86" y2="74" />
        </g>
        <line
          className="sa-trait"
          x1="68"
          y1="84"
          x2="68"
          y2="42"
          stroke="#E3A53A"
          strokeWidth="6"
          strokeLinecap="round"
        />
        <circle className="sa-sphere" cx="68" cy="34" r="11" fill="#E3A53A" />
      </svg>

      <p
        className="sa-splash__wordmark"
        style={{
          fontFamily: "var(--font-bricolage), sans-serif",
          fontSize: "36px",
          fontWeight: 800,
          letterSpacing: "-0.025em",
          color: "#ECE6D8",
          lineHeight: 1,
        }}
      >
        Stream
        <span style={{ color: "#E3A53A" }}>Actu</span>
        <span style={{ color: "var(--ink-4)", fontWeight: 500 }}>.fr</span>
      </p>

      <p
        className="sa-splash__tagline"
        style={{
          fontFamily: "var(--font-spline-mono), monospace",
          fontSize: "11px",
          letterSpacing: "0.42em",
          textTransform: "uppercase",
          color: "var(--ink-3)",
        }}
      >
        Actualité streaming FR
      </p>
    </div>
  );
}
