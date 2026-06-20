import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { useAuth } from '../../context/AuthContext';

interface NavbarProps {
  onSavedClick?: () => void;
  savedCount?: number;
}

export function ArchintNavbar({ onSavedClick, savedCount = 0 }: NavbarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/archint/login');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="arch-navbar">
      {/* Logo */}
      <button
        onClick={() => navigate('/archint')}
        className="arch-logo"
        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: '1.5rem', fontWeight: 900, fontFamily: 'Outfit, sans-serif' }}
      >
        <span style={{ background: 'linear-gradient(135deg, #00d4ff, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
          Arch
        </span>
        <span style={{ color: '#f0f4ff' }}>int</span>
      </button>

      {/* Desktop Nav Links */}
      <div className="hidden md:flex items-center gap-6" style={{ gap: '24px', display: 'flex', alignItems: 'center' }}>
        <NavLink active={isActive('/archint')} onClick={() => navigate('/archint')}>
          Home
        </NavLink>
        <NavLink active={isActive('/archint/select/house')} onClick={() => navigate('/archint/select/house')}>
          Houses
        </NavLink>
        <NavLink active={isActive('/archint/select/apartment')} onClick={() => navigate('/archint/select/apartment')}>
          Apartments
        </NavLink>
      </div>

      {/* Right Side */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Saved button */}
        {onSavedClick && (
          <button
            onClick={onSavedClick}
            id="navbar-saved-btn"
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '10px',
              padding: '8px 16px',
              color: '#f0f4ff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '14px',
              fontFamily: 'Outfit, sans-serif',
              transition: 'all 0.25s',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.borderColor = 'rgba(236,72,153,0.5)';
              (e.currentTarget as HTMLElement).style.color = '#ec4899';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.1)';
              (e.currentTarget as HTMLElement).style.color = '#f0f4ff';
            }}
          >
            <span>❤️</span>
            <span>Saved</span>
            {savedCount > 0 && (
              <span style={{
                background: 'linear-gradient(135deg,#00d4ff,#a855f7)',
                borderRadius: '10px',
                padding: '1px 7px',
                fontSize: '11px',
                fontWeight: 700,
                color: '#fff',
              }}>
                {savedCount}
              </span>
            )}
          </button>
        )}

        {/* User info & logout */}
        {user && (
          <div style={{ position: 'relative' }}>
            <button
              id="navbar-user-btn"
              onClick={() => setMenuOpen(!menuOpen)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '10px',
                padding: '7px 14px',
                cursor: 'pointer',
                transition: 'all 0.25s',
                fontFamily: 'Outfit, sans-serif',
              }}
            >
              <div style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg,#00d4ff,#a855f7)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                fontWeight: 700,
                color: '#fff',
                flexShrink: 0,
              }}>
                {user.name.charAt(0).toUpperCase()}
              </div>
              <span style={{ color: '#f0f4ff', fontSize: '14px', fontWeight: 500 }}>
                {user.name.split(' ')[0]}
              </span>
              <span style={{ color: '#94a3b8', fontSize: '10px' }}>▼</span>
            </button>

            {menuOpen && (
              <div style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                right: 0,
                background: 'rgba(5,10,25,0.95)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '12px',
                padding: '8px',
                minWidth: '180px',
                zIndex: 200,
                boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
                animation: 'archFadeInUp 0.2s ease',
              }}>
                <div style={{ padding: '10px 12px', borderBottom: '1px solid rgba(255,255,255,0.06)', marginBottom: '6px' }}>
                  <p style={{ color: '#f0f4ff', fontSize: '14px', fontWeight: 600 }}>{user.name}</p>
                  <p style={{ color: '#94a3b8', fontSize: '12px' }}>{user.email}</p>
                </div>
                <button
                  id="navbar-logout-btn"
                  onClick={handleLogout}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    background: 'transparent',
                    border: 'none',
                    color: '#ef4444',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontFamily: 'Outfit, sans-serif',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'background 0.2s',
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.1)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                >
                  <span>🚪</span> Sign Out
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

function NavLink({ children, active, onClick }: { children: React.ReactNode; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: 500,
        fontFamily: 'Outfit, sans-serif',
        color: active ? '#00d4ff' : '#94a3b8',
        position: 'relative',
        padding: '4px 0',
        transition: 'color 0.2s',
      }}
      onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.color = '#f0f4ff'; }}
      onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.color = '#94a3b8'; }}
    >
      {children}
      {active && (
        <span style={{
          position: 'absolute',
          bottom: -2,
          left: 0,
          right: 0,
          height: '2px',
          background: 'linear-gradient(90deg,#00d4ff,#a855f7)',
          borderRadius: '1px',
        }} />
      )}
    </button>
  );
}
