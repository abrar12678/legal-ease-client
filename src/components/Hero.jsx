"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Scale,
  Shield,
  Gavel,
  BookOpen,
  FileText,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
} from "lucide-react";

const SLIDES = [
  {
    id: 1,
    title: "Find & Hire Expert Legal Counsel",
    subtitle:
      "Connect with top-rated lawyers specializing in criminal, corporate, family law and more. Get the legal help you need — fast, secure, and affordable.",
    cta: "Browse Lawyers",
    ctaLink: "/browse-lawyers",
    icon: Scale,
    bg: "from-[#1B2A4A] to-[#2D4A7A]",
    accent: "#D4A843",
  },
  {
    id: 2,
    title: "Trusted Legal Experts at Your Fingertips",
    subtitle:
      "Browse verified professionals, read reviews, and hire the perfect lawyer for your case — all from the comfort of your home.",
    cta: "Get Started",
    ctaLink: "/auth/signUp",
    icon: Shield,
    bg: "from-[#1a1a2e] to-[#16213e]",
    accent: "#E94560",
  },
  {
    id: 3,
    title: "Secure & Transparent Legal Services",
    subtitle:
      "Pay securely through Stripe, track your hiring status, and communicate directly with your chosen legal expert.",
    cta: "Explore Now",
    ctaLink: "/browse-lawyers",
    icon: Gavel,
    bg: "from-[#0f3460] to-[#1B2A4A]",
    accent: "#D4A843",
  },
];

const FLOATING_ICONS = [
  { Icon: BookOpen, top: "15%", left: "8%", size: 28, delay: 0 },
  { Icon: FileText, top: "20%", right: "10%", size: 24, delay: 0.5 },
  { Icon: Scale, bottom: "25%", left: "12%", size: 22, delay: 1 },
  { Icon: Gavel, bottom: "20%", right: "15%", size: 26, delay: 1.5 },
  { Icon: Shield, top: "45%", left: "5%", size: 20, delay: 0.8 },
  { Icon: BookOpen, top: "50%", right: "6%", size: 24, delay: 1.2 },
];

export default function Hero() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  const slide = SLIDES[current];
  const SlideIcon = slide.icon;

  const goTo = useCallback(
    (index) => {
      setDirection(index > current ? 1 : -1);
      setCurrent(index);
    },
    [current]
  );

  
  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setCurrent((prev) => (prev + 1) % SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const slideVariants = {
    enter: (dir) => ({
      x: dir > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: { x: 0, opacity: 1 },
    exit: (dir) => ({
      x: dir > 0 ? -300 : 300,
      opacity: 0,
    }),
  };

  return (
    <section className="relative w-full min-h-[600px] h-[85vh] max-h-[800px] overflow-hidden">
      {}
      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div
          key={slide.id}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className={`absolute inset-0 bg-gradient-to-br ${slide.bg}`}
        />
      </AnimatePresence>

      {}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {FLOATING_ICONS.map(({ Icon, top, left, right, bottom, size, delay }, i) => (
          <motion.div
            key={i}
            className="absolute text-white/10"
            style={{ top, left, right, bottom }}
            animate={{ y: [0, -15, 0], rotate: [0, 5, -5, 0] }}
            transition={{
              duration: 6,
              repeat: Infinity,
              delay,
              ease: "easeInOut",
            }}
          >
            <Icon size={size} />
          </motion.div>
        ))}
      </div>

      {}
      <div className="relative z-10 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
        <div className="max-w-2xl">
          {}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6"
          >
            <SlideIcon size={18} style={{ color: slide.accent }} />
            <span className="text-white/80 text-sm font-medium">
              LegalEase Platform
            </span>
          </motion.div>

          {}
          <AnimatePresence mode="wait">
            <motion.h1
              key={slide.id + "-title"}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6"
            >
              {slide.title}
            </motion.h1>
          </AnimatePresence>

          {}
          <AnimatePresence mode="wait">
            <motion.p
              key={slide.id + "-sub"}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="text-lg sm:text-xl text-white/70 mb-8 leading-relaxed max-w-xl"
            >
              {slide.subtitle}
            </motion.p>
          </AnimatePresence>

          {}
          <AnimatePresence mode="wait">
            <motion.div
              key={slide.id + "-cta"}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <Link
                href={slide.ctaLink}
                className="inline-flex items-center gap-2 bg-[#D4A843] hover:bg-[#c49a38] text-[#1B2A4A] font-semibold px-7 py-3.5 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-[#D4A843]/25 text-base"
              >
                {slide.cta}
                <ArrowRight size={18} />
              </Link>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-4">
        <button
          onClick={() => goTo((current - 1 + SLIDES.length) % SLIDES.length)}
          className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-colors"
        >
          <ChevronLeft size={18} />
        </button>

        <div className="flex items-center gap-2">
          {SLIDES.map((s, i) => (
            <button
              key={s.id}
              onClick={() => goTo(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === current
                  ? "w-8 bg-[#D4A843]"
                  : "w-2 bg-white/30 hover:bg-white/50"
              }`}
            />
          ))}
        </div>

        <button
          onClick={() => goTo((current + 1) % SLIDES.length)}
          className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-colors"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </section>
  );
}