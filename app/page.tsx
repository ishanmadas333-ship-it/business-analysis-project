'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import './landing.css';
import { ArrowRight, Sparkles, Play } from 'lucide-react';

const QUICK_IDEAS = [
  'Packaged water in Hyderabad with ₹5L',
  'Specialty café near tech parks with ₹10L',
  'EV charging station with ₹15L',
  'Fitness gym with ₹8L',
  'Cloud kitchen with ₹4L'
];

export default function LandingPage() {
  const router = useRouter();
  const [promptInput, setPromptInput] = useState('');
  const [particles, setParticles] = useState<Array<{ id: number; left: string; duration: string; delay: string; opacity: number }>>([]);
  const mouseGlowRef = useRef<HTMLDivElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);

  // Generate background particles on mount
  useEffect(() => {
    const list = [];
    for (let i = 0; i < 70; i++) {
      list.push({
        id: i,
        left: Math.random() * 100 + '%',
        duration: 5 + Math.random() * 10 + 's',
        delay: Math.random() * 10 + 's',
        opacity: Math.random() * 0.7 + 0.3
      });
    }
    setParticles(list);
  }, []);

  // Mouse Glow Follower
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (mouseGlowRef.current) {
        mouseGlowRef.current.style.left = event.clientX + 'px';
        mouseGlowRef.current.style.top = event.clientY + 'px';
      }

      // 3D Hero Visual Tilt Effect
      if (visualRef.current) {
        const x = (window.innerWidth / 2 - event.clientX) / 40;
        const y = (window.innerHeight / 2 - event.clientY) / 40;
        visualRef.current.style.transform = `rotateY(${x}deg) rotateX(${y}deg)`;
      }
    };

    const handleMouseLeave = () => {
      if (visualRef.current) {
        visualRef.current.style.transform = 'rotateY(0deg) rotateX(0deg)';
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  // Animated Numbers via IntersectionObserver
  useEffect(() => {
    const counters = document.querySelectorAll<HTMLElement>('[data-target]');
    if (!counters.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const counter = entry.target as HTMLElement;
            const target = +(counter.dataset.target || 0);
            let current = 0;
            const duration = 1200;
            const increment = target / 60;

            const timer = setInterval(() => {
              current += increment;
              if (current >= target) {
                current = target;
                clearInterval(timer);
              }
              counter.textContent = Math.floor(current).toString();
            }, duration / 60);

            observer.unobserve(counter);
          }
        });
      },
      { threshold: 0.4 }
    );

    counters.forEach((counter) => observer.observe(counter));

    return () => {
      observer.disconnect();
    };
  }, []);

  // Submit Prompt to Analyze Page
  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const finalPrompt = promptInput.trim() || 'I want to start a packaged drinking-water business in Hyderabad with ₹5 lakh. I want to sell to shops, gyms, offices and events.';
    router.push(`/analyze?prompt=${encodeURIComponent(finalPrompt)}`);
  };

  // Button Ripple Effect
  const handleRipple = (e: React.MouseEvent<HTMLElement>) => {
    const btn = e.currentTarget;
    const ripple = document.createElement('span');
    ripple.style.position = 'absolute';
    ripple.style.width = '20px';
    ripple.style.height = '20px';
    ripple.style.borderRadius = '50%';
    ripple.style.background = 'rgba(255,255,255,0.4)';
    const rect = btn.getBoundingClientRect();
    ripple.style.left = e.clientX - rect.left - 10 + 'px';
    ripple.style.top = e.clientY - rect.top - 10 + 'px';
    ripple.style.pointerEvents = 'none';
    ripple.style.transform = 'scale(0)';
    ripple.style.transition = 'transform 0.5s ease-out, opacity 0.5s ease-out';
    btn.appendChild(ripple);

    requestAnimationFrame(() => {
      ripple.style.transform = 'scale(10)';
      ripple.style.opacity = '0';
    });

    setTimeout(() => {
      ripple.remove();
    }, 500);
  };

  return (
    <div className="landing-page-root">
      {/* Dynamic Mouse Glow Element */}
      <div className="mouse-glow" id="mouseGlow" ref={mouseGlowRef} />

      {/* Floating Cyan/Purple Background Particles */}
      <div className="particles" id="particles">
        {particles.map((p) => (
          <div
            key={p.id}
            className="particle"
            style={{
              left: p.left,
              animationDuration: p.duration,
              animationDelay: p.delay,
              opacity: p.opacity
            }}
          />
        ))}
      </div>

      {/* Top Navbar */}
      <nav className="landing-nav">
        <Link href="/" className="landing-logo">
          <div className="logo-icon">S</div>
          <div>
            Startup Shield
            <span>AI Business Intelligence</span>
          </div>
        </Link>

        <ul className="nav-links">
          <li>
            <a href="#home">Home</a>
          </li>
          <li>
            <a href="#features">Features</a>
          </li>
          <li>
            <a href="#about">How It Works</a>
          </li>
          <li>
            <Link href="/dashboard?id=demo-water-hyd-1" className="text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1">
              <Play className="w-3 h-3 fill-emerald-400" />
              <span>Live Demo</span>
            </Link>
          </li>
        </ul>

        <button
          onClick={() => handleSubmit()}
          className="nav-btn"
          title="Start Business Feasibility Analysis"
        >
          <span>Start Analysis →</span>
        </button>
      </nav>

      {/* Hero Section */}
      <section className="hero" id="home">
        <div className="hero-text">
          <div className="badge-tag">
            <i />
            HACKATHON 2026 · AI / ML
          </div>

          <h1>
            Know your
            <br />
            <span className="gradient-text">business.</span>
            <br />
            Know your risk.
          </h1>

          <p className="hero-description">
            Startup Shield is an AI-powered business feasibility platform that transforms a simple business idea into market, financial, risk and launch insights.
          </p>

          {/* Natural Language Prompt Box */}
          <div className="hero-prompt-box">
            <form onSubmit={handleSubmit}>
              <textarea
                rows={2}
                className="hero-prompt-input"
                value={promptInput}
                onChange={(e) => setPromptInput(e.target.value)}
                placeholder='e.g., "I want to start a café in Hyderabad with ₹10 lakh budget..."'
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit();
                  }
                }}
              />
              <div className="hero-prompt-actions">
                <div className="quick-chips">
                  {QUICK_IDEAS.map((idea, i) => (
                    <button
                      key={i}
                      type="button"
                      className="quick-chip"
                      onClick={() => setPromptInput(`I want to ${idea.toLowerCase()}`)}
                    >
                      {idea}
                    </button>
                  ))}
                </div>
              </div>
            </form>
          </div>

          <div className="buttons">
            <button
              onClick={(e) => {
                handleRipple(e);
                handleSubmit();
              }}
              className="primary-btn"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>✦ Start Business Analysis</span>
            </button>

            <a href="#features" className="secondary-btn">
              <span>Explore Platform ↓</span>
            </a>
          </div>
        </div>

        {/* 3D Visual with Interactive Tilt */}
        <div className="visual" ref={visualRef}>
          <div className="glow" />
          <div className="orbit one" />
          <div className="orbit two" />

          {/* Central Shield */}
          <div className="shield">
            <div className="shield-content">
              <div className="ai">AI</div>
              <p>STARTUP SHIELD</p>
            </div>
          </div>

          {/* Floating Glassmorphism Metric Cards */}
          <div className="float-card card-market">
            <span>MARKET OPPORTUNITY</span>
            <strong>78 / 100</strong>
          </div>

          <div className="float-card card-risk">
            <span>RISK LEVEL</span>
            <strong className="text-amber-400">MEDIUM</strong>
          </div>

          <div className="float-card card-finance">
            <span>EXPECTED PROFIT</span>
            <strong className="text-emerald-400">₹90K / month</strong>
          </div>

          <div className="float-card card-ai">
            <span>AI ENGINE</span>
            <strong className="text-cyan-400">● ANALYZING</strong>
          </div>
        </div>
      </section>

      {/* Stats Section with Intersection Counting */}
      <section className="stats">
        <div className="stat">
          <strong data-target="12">0</strong>
          <span>ANALYSIS MODULES</span>
        </div>

        <div className="stat">
          <strong data-target="4">0</strong>
          <span>DECISION AREAS</span>
        </div>

        <div className="stat">
          <strong data-target="100">0</strong>
          <span>WHAT-IF SCENARIOS</span>
        </div>

        <div className="stat">
          <strong className="text-cyan-400">AI</strong>
          <span>POWERED PLATFORM</span>
        </div>
      </section>

      {/* Features Grid */}
      <section className="features" id="features">
        <div className="section-title">
          <span>ONE PLATFORM · COMPLETE ANALYSIS</span>
          <h2>From idea to launch</h2>
          <p>
            Startup Shield brings market, financial, risk and launch analysis together in one intelligent workspace.
          </p>
        </div>

        <div className="feature-grid">
          <div className="feature">
            <div className="feature-icon">◈</div>
            <h3>Market Analysis</h3>
            <p>Understand demand, customers, market opportunities and competitors.</p>
          </div>

          <div className="feature">
            <div className="feature-icon">₹</div>
            <h3>Financial Modeling</h3>
            <p>Estimate startup costs, revenue, expenses, profit and break-even.</p>
          </div>

          <div className="feature">
            <div className="feature-icon">◉</div>
            <h3>What-If Simulator</h3>
            <p>Change price, sales and expenses to instantly see different outcomes.</p>
          </div>

          <div className="feature">
            <div className="feature-icon">△</div>
            <h3>Risk Analysis</h3>
            <p>Identify market, financial, operational and regulatory risks.</p>
          </div>

          <div className="feature">
            <div className="feature-icon">✓</div>
            <h3>Compliance</h3>
            <p>Highlight registrations, licences and requirements to verify.</p>
          </div>

          <div className="feature">
            <div className="feature-icon">➜</div>
            <h3>Launch Plan</h3>
            <p>Turn analysis into a practical step-by-step launch roadmap.</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta" id="start">
        <span className="badge-tag">✦ READY TO TEST YOUR IDEA?</span>
        <h2>
          Decide before <span className="gradient-text">you invest.</span>
        </h2>
        <p>
          Enter your business idea and discover the market opportunity, financial outlook, risks and launch strategy.
        </p>

        <button
          onClick={(e) => {
            handleRipple(e);
            handleSubmit();
          }}
          className="primary-btn"
        >
          <span>Start Your Analysis →</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        Startup Shield · Hackathon 2026 · AI / ML
      </footer>
    </div>
  );
}
