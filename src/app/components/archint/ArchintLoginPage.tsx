import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../context/AuthContext';
import '../../../styles/archint.css';

type Mode = 'login' | 'register';

export function ArchintLoginPage() {
  const navigate = useNavigate();
  const { login, register } = useAuth();

  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    if (mode === 'register' && !name) {
      setError('Please enter your full name.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      let success: boolean;
      if (mode === 'login') {
        success = await login(email, password);
      } else {
        success = await register(email, password, name);
      }
      if (success) {
        navigate('/archint');
      } else {
        setError(mode === 'login' ? 'Invalid credentials. Please try again.' : 'Registration failed. User might already exist.');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="archint-app" style={{ minHeight: '100vh', display: 'flex', alignItems: 'stretch', overflow: 'hidden' }}>
      {/* Background effects */}
      <div className="arch-bg-grid" />
      <div className="arch-orb arch-orb-1" />
      <div className="arch-orb arch-orb-2" />

      {/* Left panel — decorative */}
      <div
        style={{
          flex: 1,
          display: 'none',
          position: 'relative',
          background: 'linear-gradient(145deg, #020815 0%, #0a0f2e 40%, #160a2e 100%)',
          overflow: 'hidden',
        }}
        className="login-left-panel"
      >
        {/* Panel grid */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'linear-gradient(rgba(0,212,255,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(0,212,255,0.04) 1px,transparent 1px)',
          backgroundSize: '40px 40px',
        }} />

        {/* Decorative architectural shapes */}
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <ArchitecturalIllustration />
        </div>

        {/* Text overlay */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          background: 'linear-gradient(transparent,rgba(2,5,16,0.9))',
          padding: '48px 40px',
        }}>
          <h2 style={{ fontFamily: 'Outfit,sans-serif', fontSize: '1.75rem', fontWeight: 700, marginBottom: '10px', color: '#f0f4ff' }}>
            Design Your Dream Space
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '15px', lineHeight: 1.6, fontFamily: 'Outfit,sans-serif' }}>
            Powered by AI — thousands of architectural patterns analyzed to build your perfect home.
          </p>
          <div style={{ display: 'flex', gap: '24px', marginTop: '24px' }}>
            {['45+ Styles', '30K+ Designs', 'AI-Driven'].map((stat) => (
              <div key={stat} style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '10px',
                padding: '10px 16px',
                textAlign: 'center',
              }}>
                <p style={{ color: '#00d4ff', fontWeight: 700, fontSize: '14px', fontFamily: 'Outfit,sans-serif' }}>{stat}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        position: 'relative',
        zIndex: 10,
        minHeight: '100vh',
      }}>
        <div
          className="arch-glass-strong arch-animate-fade-up"
          style={{
            width: '100%',
            maxWidth: '440px',
            padding: '48px 40px',
          }}
        >
          {/* Logo */}
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', marginBottom: '12px' }}>
              <span style={{
                fontFamily: 'Outfit,sans-serif',
                fontSize: '2.5rem',
                fontWeight: 900,
                background: 'linear-gradient(135deg,#00d4ff,#a855f7)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                letterSpacing: '-1px',
              }}>
                Arch<span style={{ WebkitTextFillColor: '#f0f4ff', color: '#f0f4ff' }}>int</span>
              </span>
            </div>
            <p style={{ color: '#94a3b8', fontSize: '14px', fontFamily: 'Outfit,sans-serif', lineHeight: 1.5 }}>
              {mode === 'login' ? 'Welcome back! Sign in to continue designing.' : 'Create your account and start building.'}
            </p>
          </div>

          {/* Toggle tabs */}
          <div style={{
            display: 'flex',
            background: 'rgba(255,255,255,0.04)',
            borderRadius: '12px',
            padding: '4px',
            marginBottom: '28px',
            border: '1px solid rgba(255,255,255,0.06)',
          }}>
            {(['login', 'register'] as Mode[]).map((m) => (
              <button
                key={m}
                id={`auth-tab-${m}`}
                onClick={() => { setMode(m); setError(''); }}
                style={{
                  flex: 1,
                  borderRadius: '9px',
                  border: 'none',
                  padding: '10px 0',
                  fontSize: '14px',
                  fontWeight: 600,
                  fontFamily: 'Outfit,sans-serif',
                  cursor: 'pointer',
                  transition: 'all 0.25s',
                  background: mode === m ? 'linear-gradient(135deg,rgba(0,212,255,0.15),rgba(168,85,247,0.15))' : 'transparent',
                  color: mode === m ? '#00d4ff' : '#94a3b8',
                  boxShadow: mode === m ? '0 0 20px rgba(0,212,255,0.1)' : 'none',
                }}
              >
                {m === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {mode === 'register' && (
              <FormField label="Full Name" id="auth-name">
                <input
                  id="auth-name"
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Enter your full name"
                  className="arch-input"
                  style={{ padding: '14px 16px', fontSize: '15px' }}
                  autoComplete="name"
                />
              </FormField>
            )}

            <FormField label="Email Address" id="auth-email">
              <input
                id="auth-email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="arch-input"
                style={{ padding: '14px 16px', fontSize: '15px' }}
                autoComplete="email"
              />
            </FormField>

            <FormField label="Password" id="auth-password">
              <div style={{ position: 'relative' }}>
                <input
                  id="auth-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder={mode === 'login' ? 'Enter your password' : 'Min. 6 characters'}
                  className="arch-input"
                  style={{ padding: '14px 48px 14px 16px', fontSize: '15px', width: '100%', boxSizing: 'border-box' }}
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '14px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '16px',
                    opacity: 0.6,
                    padding: 0,
                  }}
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </FormField>

            {/* Error */}
            {error && (
              <div style={{
                background: 'rgba(239,68,68,0.1)',
                border: '1px solid rgba(239,68,68,0.3)',
                borderRadius: '10px',
                padding: '12px 16px',
                color: '#fca5a5',
                fontSize: '13px',
                fontFamily: 'Outfit,sans-serif',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}>
                <span>⚠️</span> {error}
              </div>
            )}

            {/* Submit */}
            <button
              id={mode === 'login' ? 'auth-login-btn' : 'auth-register-btn'}
              type="submit"
              disabled={loading}
              className="arch-btn-primary"
              style={{
                padding: '15px',
                fontSize: '16px',
                marginTop: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? (
                <>
                  <span className="arch-spinner" style={{ width: 20, height: 20, borderWidth: 2 }} />
                  <span>{mode === 'login' ? 'Signing in...' : 'Creating account...'}</span>
                </>
              ) : (
                <>
                  <span>{mode === 'login' ? '🔑 Sign In' : '🚀 Create Account'}</span>
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div style={{ margin: '24px 0', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className="arch-divider" style={{ flex: 1 }} />
            <span style={{ color: '#475569', fontSize: '12px', fontFamily: 'Outfit,sans-serif', whiteSpace: 'nowrap' }}>
              {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}
            </span>
            <div className="arch-divider" style={{ flex: 1 }} />
          </div>

          <button
            id={mode === 'login' ? 'auth-switch-to-register' : 'auth-switch-to-login'}
            onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}
            className="arch-btn-ghost"
            style={{ width: '100%', padding: '13px', fontSize: '14px', fontWeight: 600 }}
          >
            {mode === 'login' ? 'Create a Free Account →' : '← Back to Sign In'}
          </button>

          <p style={{
            color: '#334155',
            fontSize: '12px',
            textAlign: 'center',
            fontFamily: 'Outfit,sans-serif',
            marginTop: '20px',
            lineHeight: 1.6,
          }}>
            By continuing, you agree to Archint's Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>

      {/* CSS for left panel responsive show */}
      <style>{`
        @media (min-width: 900px) {
          .login-left-panel { display: flex !important; flex-direction: column; }
        }
      `}</style>
    </div>
  );
}

function FormField({ label, id, children }: { label: string; id: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <label
        htmlFor={id}
        style={{
          color: '#94a3b8',
          fontSize: '13px',
          fontWeight: 600,
          fontFamily: 'Outfit,sans-serif',
          letterSpacing: '0.5px',
          textTransform: 'uppercase',
        }}
      >
        {label}
      </label>
      {children}
    </div>
  );
}

/* Architectural SVG illustration for left panel */
function ArchitecturalIllustration() {
  return (
    <svg viewBox="0 0 400 500" width="85%" style={{ maxWidth: '360px', opacity: 0.9 }}>
      {/* Sky gradient */}
      <defs>
        <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#020815" />
          <stop offset="100%" stopColor="#0a0f2e" />
        </linearGradient>
        <linearGradient id="bldg1Grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0d1a45" />
          <stop offset="100%" stopColor="#07102d" />
        </linearGradient>
        <linearGradient id="bldg2Grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#110d35" />
          <stop offset="100%" stopColor="#080620" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <radialGradient id="moonGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(0,212,255,0.3)" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>

      {/* Background */}
      <rect width="400" height="500" fill="url(#skyGrad)" />

      {/* Moon glow */}
      <circle cx="320" cy="60" r="50" fill="url(#moonGlow)" />
      <circle cx="320" cy="60" r="18" fill="#00d4ff" opacity="0.6" filter="url(#glow)" />

      {/* Stars */}
      {[
        [40, 30], [80, 80], [150, 20], [200, 50], [250, 30], [360, 100],
        [50, 120], [130, 90], [280, 70], [370, 40],
      ].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="1.5" fill="#94a3b8" opacity="0.6" />
      ))}

      {/* Background building 1 */}
      <rect x="20" y="150" width="80" height="300" fill="url(#bldg1Grad)" opacity="0.6" />
      {/* windows bg1 */}
      {[180, 220, 260, 300, 340, 380].map((y) =>
        [30, 55, 75].map((x) => (
          <rect key={`${x}-${y}`} x={x} y={y} width="12" height="15" rx="1" fill="#00d4ff" opacity="0.15" />
        ))
      )}

      {/* Background building 2 */}
      <rect x="300" y="200" width="100" height="250" fill="url(#bldg2Grad)" opacity="0.5" />
      {[230, 265, 300, 335, 370].map((y) =>
        [308, 330, 355, 378].map((x) => (
          <rect key={`${x}-${y}`} x={x} y={y} width="10" height="14" rx="1" fill="#a855f7" opacity="0.2" />
        ))
      )}

      {/* Main building */}
      <rect x="100" y="100" width="200" height="350" fill="url(#bldg1Grad)" />
      <rect x="100" y="100" width="200" height="350" fill="none" stroke="#00d4ff" strokeWidth="0.5" opacity="0.3" />

      {/* Main building windows (lit) */}
      {[130, 170, 210, 250, 290, 330, 370].map((y) =>
        [115, 145, 175, 205, 235, 265].map((x, xi) => (
          <rect key={`mw-${x}-${y}`} x={x} y={y} width="18" height="22" rx="2"
            fill={Math.random() > 0.4 ? '#00d4ff' : '#a855f7'}
            opacity={0.08 + Math.random() * 0.18}
          />
        ))
      )}

      {/* Highlight lit windows */}
      {[
        [145, 130], [205, 130], [175, 250], [235, 170], [145, 370], [265, 290],
      ].map(([x, y]) => (
        <rect key={`lit-${x}-${y}`} x={x} y={y} width="18" height="22" rx="2" fill="#00d4ff" opacity="0.7" filter="url(#glow)" />
      ))}

      {/* Roof detail */}
      <rect x="90" y="90" width="220" height="15" rx="3" fill="#0d1a45" stroke="#00d4ff" strokeWidth="0.5" opacity="0.5" />
      <rect x="100" y="80" width="60" height="15" rx="2" fill="#0a122e" stroke="#a855f7" strokeWidth="0.5" opacity="0.5" />
      <rect x="240" y="80" width="60" height="15" rx="2" fill="#0a122e" stroke="#a855f7" strokeWidth="0.5" opacity="0.5" />

      {/* Antenna */}
      <line x1="200" y1="80" x2="200" y2="40" stroke="#00d4ff" strokeWidth="1.5" opacity="0.5" />
      <circle cx="200" cy="38" r="4" fill="#00d4ff" opacity="0.8" filter="url(#glow)" />

      {/* Ground / Reflection */}
      <rect x="0" y="450" width="400" height="50" fill="#010610" opacity="0.9" />
      <rect x="100" y="450" width="200" height="30" fill="#00d4ff" opacity="0.03" />

      {/* Foreground elements */}
      <rect x="0" y="460" width="40" height="90" fill="#040c20" />
      <rect x="360" y="470" width="40" height="80" fill="#040c20" />

      {/* Neon ground line */}
      <line x1="0" y1="450" x2="400" y2="450" stroke="#00d4ff" strokeWidth="0.5" opacity="0.2" />

      {/* "Archint" text glow */}
      <text x="200" y="490" textAnchor="middle" fontFamily="Outfit,sans-serif" fontSize="18" fontWeight="800"
        fill="url(#skyGrad)" stroke="#00d4ff" strokeWidth="0.3" opacity="0.4"
        style={{ filter: 'url(#glow)' }}
      >
        ARCHINT
      </text>
    </svg>
  );
}
