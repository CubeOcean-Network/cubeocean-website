"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { getTimeLeft, LAUNCH_DATE, type TimeLeft } from "@/lib/countdown";
import BubblePlayer from "./BubbleMusic";

gsap.registerPlugin(useGSAP);

type UnitKey = keyof Omit<TimeLeft, "total">;

const UNITS: Array<{ key: UnitKey; label: string }> = [
  { key: "hours", label: "JAM" },
  { key: "minutes", label: "MENIT" },
  { key: "seconds", label: "DETIK" },
];

const launchDateLabel = new Intl.DateTimeFormat("id-ID", {
  dateStyle: "full",
  timeStyle: "short",
  timeZone: "Asia/Jakarta",
}).format(LAUNCH_DATE);

export default function CountdownHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroMarkRef = useRef<HTMLDivElement>(null);
  const [showPlayer, setShowPlayer] = useState(false);
  const digitRefs = useRef<Partial<Record<UnitKey, HTMLSpanElement | null>>>(
    {}
  );
  const prevValues = useRef<Partial<Record<UnitKey, number>>>({});

  const [time, setTime] = useState<TimeLeft | null>(null);

  // Detak hitung mundur — nilai awal sengaja dibiarkan null (sama di
  // server & client) agar tidak terjadi hydration mismatch; nilai asli
  // diisi lewat callback di bawah, yang berjalan hanya di client.
  useEffect(() => {
    const tick = () => setTime(getTimeLeft());
    const immediate = window.setTimeout(tick, 0);
    const id = window.setInterval(tick, 1000);
    return () => {
      window.clearTimeout(immediate);
      window.clearInterval(id);
    };
  }, []);

  // Urutan animasi kemunculan halaman + gerak idle pada hero mark.
  useGSAP(
    () => {
      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (reduceMotion) {
        gsap.set("[data-reveal]", { opacity: 1, y: 0, scale: 1 });
        return;
      }

      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .from("[data-eyebrow]", { opacity: 0, y: 14, duration: 0.6 })
        .from(
          heroMarkRef.current,
          { opacity: 0, scale: 0.82, duration: 0.8 },
          "-=0.25"
        )
        .from(
          "[data-word]",
          { opacity: 0, y: 22, duration: 0.7, stagger: 0.12 },
          "-=0.45"
        )
        .from("[data-tagline]", { opacity: 0, y: 14, duration: 0.6 }, "-=0.35")
        .from(
          "[data-count-block]",
          { opacity: 0, y: 18, scale: 0.94, duration: 0.55, stagger: 0.08 },
          "-=0.3"
        )
        .from("[data-cta]", { opacity: 0, y: 10, duration: 0.5 }, "-=0.25");

      gsap.to(heroMarkRef.current, {
        y: -10,
        duration: 2.6,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });

      gsap.fromTo(
        heroMarkRef.current,
        { filter: "drop-shadow(0 0 6px rgba(255,217,138,0.25))" },
        {
          filter: "drop-shadow(0 0 40px rgba(255,217,138,0.65))",
          duration: 3.1,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
          delay: 0.3,
        }
      );
    },
    { scope: containerRef }
  );

  // Sentuhan kecil setiap angka berganti.
  useEffect(() => {
    if (!time) return;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduceMotion) return;

    UNITS.forEach(({ key }) => {
      const el = digitRefs.current[key];
      const value = time[key];
      if (el && prevValues.current[key] !== value) {
        gsap.fromTo(
          el,
          { y: -6, opacity: 0.35 },
          { y: 0, opacity: 1, duration: 0.35, ease: "power2.out" }
        );
      }
      prevValues.current[key] = value;
    });
  }, [time]);

  return (
    <div
      ref={containerRef}
      className="relative isolate flex min-h-dvh flex-col overflow-hidden bg-abyss"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/background.png"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 h-full w-full object-cover"
      />

      <main className="flex flex-1 flex-col items-center justify-center px-6 py-20 text-center sm:px-10">

        <div
          ref={heroMarkRef}
          data-reveal
          className="mb-6 h-24 w-24 will-change-transform sm:h-32 sm:w-32"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/hero.png"
            alt="CubeOcean"
            className="h-full w-full"
            width={128}
            height={128}
          />
        </div>

        <h1 className="font-display text-5xl font-black leading-[0.95] tracking-tight sm:text-7xl md:text-8xl">
          <span data-word data-reveal className="inline-block text-foam">
            CUBE
          </span>
          <span
            data-word
            data-reveal
            className="inline-block text-prismarine"
          >
            OCEAN
          </span>
        </h1>

        <p
          data-tagline
          data-reveal
          className="mt-5 max-w-md text-balance font-body text-base text-foam/70 sm:text-lg"
        >
          Coming Soon
        </p>

        <div className="mt-10 flex gap-3 sm:gap-4">
          {UNITS.map(({ key, label }) => (
            <div
              key={key}
              data-count-block
              data-reveal
              className="flex min-w-[68px] flex-col items-center gap-2 rounded-2xl border border-kelp/70 bg-gradient-to-b from-current to-abyss px-4 py-3 shadow-[inset_0_1px_0_rgba(234,246,243,0.14),0_20px_40px_-24px_rgba(0,0,0,0.8)] sm:min-w-[92px] sm:px-6 sm:py-4"
            >
              <span
                ref={(el) => {
                  digitRefs.current[key] = el;
                }}
                className="font-display text-3xl font-bold tabular-nums text-foam sm:text-5xl"
              >
                {String(time ? time[key] : 0).padStart(2, "0")}
              </span>
              <span className="font-mono text-[10px] tracking-[0.2em] text-foam/55 sm:text-xs">
                {label}
              </span>
            </div>
          ))}
        </div>

        <p className="mt-4 font-mono text-[11px] text-foam/40">
          Time according to GMT+7 (Asia/Indonesia/Jakarta zone) 
        </p>

  <>
    <div className="mt-10 flex flex-col items-center gap-4">
      <a
        data-cta
        data-reveal
        href="https://discord.gg/NnKd4DdCbM"
        target="_blank"
        rel="noreferrer noopener"
        className="group inline-flex items-center gap-2 font-body text-sm text-foam/70 transition-colors hover:text-prismarine"
      >
        Stay up to date with the community.
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="transition-transform group-hover:translate-x-0.5"
        >
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </a>

      <h1 className="font-body text-sm text-foam/50">Or</h1>

      <button
        data-cta
        data-reveal
        onClick={() => setShowPlayer(true)}
        className="group inline-flex items-center gap-2 font-body text-sm text-foam/70 transition-colors hover:text-prismarine"
      >
        Listen music by CubeOcean
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="transition-transform group-hover:translate-x-0.5"
        >
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </button>
    </div>

    {showPlayer && <BubblePlayer />}
  </>

      </main>

      <footer className="relative flex flex-col items-center gap-1.5 border-t border-kelp/50 bg-abyss/80 px-6 py-4 text-center font-mono text-[10px] tracking-wide text-foam/40 sm:flex-row sm:items-center sm:justify-between sm:gap-0 sm:px-10 sm:text-left sm:text-xs">
        <span>X 0 · Y 64 · Z 0</span>
        <span>© 2026 CubeOcean. All rights reserved.</span>
      </footer>
    </div>
  );
}