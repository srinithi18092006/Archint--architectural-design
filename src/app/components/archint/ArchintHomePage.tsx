import { useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { ArchintNavbar } from './ArchintNavbar';
import '../../../styles/archint.css';

const features = [
  {
    icon: '🏠',
    title: 'Smart Design Matching',
    desc: 'AI analyzes thousands of patterns to find your perfect architectural match.',
  },
  {
    icon: '📐',
    title: 'Precision Planning',
    desc: 'Detailed floor plans, material estimates and structural specifications.',
  },
  {
    icon: '💡',
    title: 'Real-Time Visualization',
    desc: '3D previews and virtual walkthroughs powered by cutting-edge rendering.',
  },
];

const stats = [
  { value: '30K+', label: 'Designs' },
  { value: '98%', label: 'Satisfaction' },
  { value: '500+', label: 'Architects' },
  { value: '12K+', label: 'Homes Built' },
];

export function ArchintHomePage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="archint-app">
      {/* Ambient BG */}
      <div className="arch-bg-grid" />
      <div className="arch-orb arch-orb-1" />
      <div className="arch-orb arch-orb-2" />
      <div className="arch-orb arch-orb-3" />

      {/* Navbar */}
      <ArchintNavbar />

      <main style={{ position: 'relative', zIndex: 1 }}>
        {/* ══ Hero ══ */}
        <section
          style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '64px 24px 80px',
          }}
        >
          {/* Badge */}
          <div
            className="arch-animate-fade-up"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(0,212,255,0.08)',
              border: '1px solid rgba(0,212,255,0.25)',
              borderRadius: '30px',
              padding: '8px 20px',
              marginBottom: '32px',
              fontFamily: 'Outfit,sans-serif',
              fontSize: '13px',
              fontWeight: 600,
              color: '#00d4ff',
              letterSpacing: '0.5px',
            }}
          >
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#00d4ff', display: 'inline-block', boxShadow: '0 0 8px #00d4ff' }} />
            AI-Powered Architectural Platform
          </div>

          {/* Title */}
          <h1
            className="arch-animate-fade-up arch-delay-100"
            style={{
              fontFamily: 'Outfit,sans-serif',
              fontSize: 'clamp(3rem,8vw,6rem)',
              fontWeight: 900,
              lineHeight: 1.05,
              marginBottom: '24px',
              letterSpacing: '-2px',
            }}
          >
            <span className="arch-gradient-text">Arch</span>
            <span style={{ color: '#f0f4ff' }}>int</span>
          </h1>

          {/* Subtitle */}
          <h2
            className="arch-animate-fade-up arch-delay-200"
            style={{
              fontFamily: 'Outfit,sans-serif',
              fontSize: 'clamp(1.25rem,3vw,1.75rem)',
              fontWeight: 500,
              color: '#94a3b8',
              marginBottom: '20px',
              maxWidth: '600px',
            }}
          >
            Design Your Dream Space with Intelligence
          </h2>

          {/* Description */}
          <p
            className="arch-animate-fade-up arch-delay-300"
            style={{
              fontFamily: 'Outfit,sans-serif',
              fontSize: '16px',
              color: '#64748b',
              lineHeight: 1.8,
              maxWidth: '640px',
              marginBottom: '56px',
            }}
          >
            Select a category to begin your intelligent construction journey. Our system analyzes thousands of design patterns to provide the perfect blueprint tailored to your needs.
          </p>

          {/* Greeting */}
          {user && (
            <div
              className="arch-animate-fade-up arch-delay-200"
              style={{
                background: 'rgba(0,212,255,0.06)',
                border: '1px solid rgba(0,212,255,0.15)',
                borderRadius: '12px',
                padding: '10px 24px',
                marginBottom: '40px',
                fontFamily: 'Outfit,sans-serif',
                fontSize: '14px',
                color: '#94a3b8',
              }}
            >
              👋 Welcome back, <strong style={{ color: '#00d4ff' }}>{user.name}</strong>! Ready to design?
            </div>
          )}

          {/* ── Cards ── */}
          <div
            className="arch-animate-fade-up arch-delay-400"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))',
              gap: '24px',
              width: '100%',
              maxWidth: '700px',
            }}
          >
            <CategoryCard
              id="home-card-house"
              icon="🏡"
              title="Build a House"
              subtitle="Single & multi-floor houses"
              description="Custom residences — villas, duplexes, bungalows & more with intelligent floor plan generation."
              gradient="linear-gradient(135deg,rgba(0,212,255,0.12),rgba(0,212,255,0.03))"
              glowColor="rgba(0,212,255,0.3)"
              borderColor="rgba(0,212,255,0.2)"
              textColor="#00d4ff"
              count="18+ designs"
              onClick={() => navigate('/archint/select/house')}
            />
            <CategoryCard
              id="home-card-apartment"
              icon="🏢"
              title="Build an Apartment"
              subtitle="Studio, 2BHK, 3BHK & luxury"
              description="Premium urban apartments — from compact studios to sky-high penthouses with AI recommendations."
              gradient="linear-gradient(135deg,rgba(168,85,247,0.12),rgba(168,85,247,0.03))"
              glowColor="rgba(168,85,247,0.3)"
              borderColor="rgba(168,85,247,0.2)"
              textColor="#a855f7"
              count="27+ designs"
              onClick={() => navigate('/archint/select/apartment')}
            />
          </div>

          {/* CTA secondary */}
          <p
            style={{
              color: '#475569',
              fontSize: '13px',
              fontFamily: 'Outfit,sans-serif',
              marginTop: '32px',
            }}
          >
            🔥 Over 12,000 homes designed using Archint
          </p>
        </section>

        {/* ── Stats ── */}
        <section style={{ padding: '0 24px 80px' }}>
          <div style={{
            maxWidth: '900px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))',
            gap: '16px',
          }}>
            {stats.map((s) => (
              <div
                key={s.label}
                className="arch-glass"
                style={{ padding: '28px 20px', textAlign: 'center' }}
              >
                <p style={{
                  fontFamily: 'Outfit,sans-serif',
                  fontSize: '2rem',
                  fontWeight: 900,
                  background: 'linear-gradient(135deg,#00d4ff,#a855f7)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  marginBottom: '4px',
                }}>
                  {s.value}
                </p>
                <p style={{ color: '#64748b', fontSize: '13px', fontFamily: 'Outfit,sans-serif' }}>
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Features ── */}
        <section style={{ padding: '0 24px 100px' }}>
          <div style={{ maxWidth: '920px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '48px' }}>
              <h2 style={{
                fontFamily: 'Outfit,sans-serif',
                fontSize: 'clamp(1.5rem,3vw,2.5rem)',
                fontWeight: 800,
                color: '#f0f4ff',
                marginBottom: '12px',
              }}>
                Why Choose{' '}
                <span className="arch-gradient-text">Archint?</span>
              </h2>
              <p style={{ color: '#64748b', fontSize: '15px', fontFamily: 'Outfit,sans-serif' }}>
                Cutting-edge tools built for tomorrow's builders.
              </p>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))',
              gap: '20px',
            }}>
              {features.map((f) => (
                <div key={f.title} className="arch-glass" style={{ padding: '32px 24px' }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>{f.icon}</div>
                  <h3 style={{
                    fontFamily: 'Outfit,sans-serif',
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    color: '#f0f4ff',
                    marginBottom: '10px',
                  }}>
                    {f.title}
                  </h3>
                  <p style={{ color: '#64748b', fontSize: '14px', fontFamily: 'Outfit,sans-serif', lineHeight: 1.7 }}>
                    {f.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

interface CategoryCardProps {
  id: string;
  icon: string;
  title: string;
  subtitle: string;
  description: string;
  gradient: string;
  glowColor: string;
  borderColor: string;
  textColor: string;
  count: string;
  onClick: () => void;
}

function CategoryCard({
  id, icon, title, subtitle, description,
  gradient, glowColor, borderColor, textColor, count, onClick,
}: CategoryCardProps) {
  return (
    <button
      id={id}
      onClick={onClick}
      style={{
        background: gradient,
        border: `1px solid ${borderColor}`,
        borderRadius: '20px',
        padding: '36px 28px',
        cursor: 'pointer',
        textAlign: 'left',
        width: '100%',
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.35s ease',
        backdropFilter: 'blur(20px)',
        fontFamily: 'Outfit,sans-serif',
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLElement;
        el.style.transform = 'translateY(-8px)';
        el.style.boxShadow = `0 20px 60px rgba(0,0,0,0.4), 0 0 40px ${glowColor}`;
        el.style.borderColor = textColor;
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLElement;
        el.style.transform = 'translateY(0)';
        el.style.boxShadow = 'none';
        el.style.borderColor = borderColor;
      }}
    >
      {/* Corner glow */}
      <div style={{
        position: 'absolute', top: -30, right: -30,
        width: 100, height: 100,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${glowColor}, transparent 70%)`,
        pointerEvents: 'none',
      }} />

      {/* Count badge */}
      <div style={{
        position: 'absolute', top: 16, right: 16,
        background: `${textColor}18`,
        border: `1px solid ${textColor}40`,
        borderRadius: '20px',
        padding: '4px 12px',
        fontSize: '11px',
        fontWeight: 700,
        color: textColor,
      }}>
        {count}
      </div>

      {/* Icon */}
      <div style={{
        fontSize: '2.8rem',
        marginBottom: '18px',
        filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.3))',
      }}>
        {icon}
      </div>

      <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f0f4ff', marginBottom: '4px' }}>
        {title}
      </h3>
      <p style={{ fontSize: '12px', fontWeight: 600, color: textColor, marginBottom: '14px', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
        {subtitle}
      </p>
      <p style={{ fontSize: '14px', color: '#64748b', lineHeight: 1.7 }}>
        {description}
      </p>

      <div style={{
        marginTop: '24px',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        color: textColor,
        fontSize: '14px',
        fontWeight: 700,
      }}>
        Explore Designs <span>→</span>
      </div>
    </button>
  );
}
