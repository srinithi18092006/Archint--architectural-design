import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router';
import { ArchintNavbar } from './ArchintNavbar';
import { archDesigns, ArchDesign, DesignType } from '../../data/archintData';
import '../../../styles/archint.css';
import { SketchSheetVisualizer } from './SketchSheetVisualizer';
import { PlanData } from '../../data/plans_rich';

type SortMode = 'best' | 'sqft_asc' | 'sqft_desc' | 'budget_asc' | 'budget_desc';

function adaptDesignToPlan(design: ArchDesign): PlanData {
  const bedrooms = design.type === 'house'
    ? (design.sqft < 1500 ? 2 : design.sqft < 2500 ? 3 : design.sqft < 3500 ? 4 : 5)
    : (design.sqft < 800 ? 1 : design.sqft < 1400 ? 2 : 3);
  
  return {
    id: `apt-res-${design.id}`,
    type: design.type,
    title: design.name,
    category: `${design.floors} Floor ${design.style}`,
    floors: design.floors,
    area: design.sqft,
    cost: design.budget * 100000,
    bedrooms: bedrooms,
    bathrooms: bedrooms,
    balcony: design.balcony ? 'With Balcony' : 'Without Balcony',
    kitchen: 'Modular Kitchen',
    dining: 'Combined Living + Dining',
    parking: design.parking ? 'Yes' : 'No',
    waterFacility: ['Borewell Sump', 'Underground Sump', 'Overhead Tank', 'Rainwater Harvesting Recharge'],
    description: design.description,
    image: design.image,
    isRecommended: false,
    pujaRoom: design.type === 'house' && design.sqft > 1800,
    studyRoom: design.type === 'house' && design.sqft > 2500,
    utilityRoom: design.type === 'house' && design.sqft > 1500,
    style: design.style,
    roofStyle: 'Flat Roof with Sky-Deck & Solar Panels',
    windowPlacement: 'Floor-to-ceiling Glass Facades (North-East Facing)',
    balconyStyle: 'Cantilevered Frameless Glass Balcony',
    interiorLayout: 'Open-concept Living & Dining Great Room',
    staircaseLocation: 'Internal Floating Steel Foyer Stairs',
    roomArrangement: 'L-shaped Wing Distribution',
    kitchenPlacement: 'South-East (Agni corner) Vastu Zone',
    diningArrangement: 'Combined Open Living + Dining Area',
    parkingLayout: 'Front Portico Covered Garage',
    gardenSpace: design.garden ? 'Yes' : 'No',
    gardenLayout: 'Lush Front Turf Lawn with fountains',
    vastuPreference: 'East Facing (Vastu Compliant - Surya Entrance)',
    borewellLocation: 'North-East (Ishanya) corner',
    undergroundSump: 'East-North-East zone',
    overheadTank: 'South-West (Nairutya) corner',
    rainwaterHarvesting: 'Sand-and-carbon twin filtration pits',
    septicTank: 'North-West (Vayu) boundary wall zone',
    drainageLayout: 'Slope gradient towards North-East exit drain line',
    washingArea: 'Rear South-West utility porch',
  };
}

export function ArchintResultsPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const [saved, setSaved] = useState<Set<number>>(() => {
    try {
      const s = localStorage.getItem('archint_saved');
      return new Set(s ? JSON.parse(s) : []);
    } catch { return new Set(); }
  });
  const [sortMode, setSortMode] = useState<SortMode>('best');
  const [selectedDesign, setSelectedDesign] = useState<ArchDesign | null>(null);
  const [loading, setLoading] = useState(true);
  const [showSaved, setShowSaved] = useState(false);

  // Persist saved
  useEffect(() => {
    localStorage.setItem('archint_saved', JSON.stringify([...saved]));
  }, [saved]);

  // Simulate load
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 700);
    return () => clearTimeout(t);
  }, []);

  // Parse query params
  const type = (params.get('type') ?? 'house') as DesignType;
  const floors = params.get('floors') ? +params.get('floors')! : null;
  const sqftMin = params.get('sqftMin') ? +params.get('sqftMin')! : 500;
  const sqftMax = params.get('sqftMax') ? +params.get('sqftMax')! : 5000;
  const budgetMin = params.get('budgetMin') ? +params.get('budgetMin')! : 45;
  const budgetMax = params.get('budgetMax') ? +params.get('budgetMax')! : 200;
  const style = params.get('style') ?? '';
  const gardenParam = params.get('garden');
  const freeSpaceParam = params.get('freeSpace');
  const balconyParam = params.get('balcony');
  const parkingParam = params.get('parking');

  const parseBool = (v: string | null): boolean | null => {
    if (v === 'true') return true;
    if (v === 'false') return false;
    return null;
  };

  const garden = parseBool(gardenParam);
  const freeSpace = parseBool(freeSpaceParam);
  const balcony = parseBool(balconyParam);
  const parking = parseBool(parkingParam);

  const filtered = useMemo(() => {
    const result = archDesigns.filter((d) => {
      if (d.type !== type) return false;
      if (floors !== null && d.floors !== floors) return false;
      if (d.sqft < sqftMin || d.sqft > sqftMax) return false;
      if (d.budget < budgetMin || d.budget > budgetMax) return false;
      if (style && d.style !== style) return false;
      if (garden !== null && d.garden !== garden) return false;
      if (freeSpace !== null && d.freeSpace !== freeSpace) return false;
      if (balcony !== null && d.balcony !== balcony) return false;
      if (parking !== null && d.parking !== parking) return false;
      return true;
    });

    // "Best match" scoring
    const targetSqft = (sqftMin + sqftMax) / 2;
    const targetBudget = (budgetMin + budgetMax) / 2;

    const scored = result.map((d) => ({
      ...d,
      score:
        Math.abs(d.sqft - targetSqft) / 1000 +
        Math.abs(d.budget - targetBudget) / 50,
    }));

    switch (sortMode) {
      case 'best':
        return scored.sort((a, b) => a.score - b.score);
      case 'sqft_asc':
        return scored.sort((a, b) => a.sqft - b.sqft);
      case 'sqft_desc':
        return scored.sort((a, b) => b.sqft - a.sqft);
      case 'budget_asc':
        return scored.sort((a, b) => a.budget - b.budget);
      case 'budget_desc':
        return scored.sort((a, b) => b.budget - a.budget);
      default:
        return scored;
    }
  }, [type, floors, sqftMin, sqftMax, budgetMin, budgetMax, style, garden, freeSpace, balcony, parking, sortMode]);

  const displayList = showSaved
    ? filtered.filter((d) => saved.has(d.id))
    : filtered;

  const toggleSave = (id: number, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSaved((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="archint-app">
      <div className="arch-bg-grid" />
      <div className="arch-orb arch-orb-1" />
      <div className="arch-orb arch-orb-2" />

      <ArchintNavbar
        savedCount={saved.size}
        onSavedClick={() => setShowSaved(!showSaved)}
      />

      <main style={{ paddingTop: '80px', minHeight: '100vh', position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div style={{
          padding: '40px 24px 32px',
          maxWidth: '1300px',
          margin: '0 auto',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '8px' }}>
            <div>
              {/* Breadcrumb */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <button
                  onClick={() => navigate('/archint')}
                  style={{ background: 'none', border: 'none', color: '#475569', cursor: 'pointer', fontFamily: 'Outfit,sans-serif', fontSize: '13px' }}
                >
                  Home
                </button>
                <span style={{ color: '#334155', fontSize: '13px' }}>›</span>
                <button
                  onClick={() => navigate(`/archint/select/${type}`)}
                  style={{ background: 'none', border: 'none', color: '#475569', cursor: 'pointer', fontFamily: 'Outfit,sans-serif', fontSize: '13px' }}
                >
                  {type === 'house' ? 'Houses' : 'Apartments'}
                </button>
                <span style={{ color: '#334155', fontSize: '13px' }}>›</span>
                <span style={{ color: '#00d4ff', fontSize: '13px', fontFamily: 'Outfit,sans-serif' }}>Results</span>
              </div>

              <h1 style={{
                fontFamily: 'Outfit,sans-serif',
                fontSize: 'clamp(1.5rem,3vw,2.5rem)',
                fontWeight: 900,
                letterSpacing: '-0.5px',
                marginBottom: '6px',
              }}>
                <span className="arch-gradient-text">{filtered.length} Designs</span>
                <span style={{ color: '#f0f4ff' }}> Found</span>
              </h1>
              <p style={{ color: '#64748b', fontFamily: 'Outfit,sans-serif', fontSize: '14px' }}>
                {type === 'house' ? '🏡' : '🏢'} {type === 'house' ? 'House' : 'Apartment'} designs
                {style ? ` · ${style}` : ''}
                {floors ? ` · ${floors}+ floors` : ''}
                {' '}· ₹{budgetMin}L – ₹{budgetMax}L
              </p>
            </div>

            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
              {/* Saved toggle */}
              <button
                id="results-saved-toggle"
                onClick={() => setShowSaved(!showSaved)}
                style={{
                  padding: '8px 16px', borderRadius: '10px', cursor: 'pointer',
                  fontFamily: 'Outfit,sans-serif', fontSize: '13px', fontWeight: 600, border: 'none',
                  background: showSaved ? 'linear-gradient(135deg,rgba(236,72,153,0.2),rgba(236,72,153,0.1))' : 'rgba(255,255,255,0.05)',
                  color: showSaved ? '#ec4899' : '#94a3b8',
                  transition: 'all 0.2s',
                }}
              >
                ❤️ {showSaved ? 'All Designs' : `Saved (${saved.size})`}
              </button>

              {/* Sort */}
              <select
                id="results-sort"
                value={sortMode}
                onChange={e => setSortMode(e.target.value as SortMode)}
                className="arch-select"
                style={{ padding: '8px 36px 8px 14px', fontSize: '13px' }}
              >
                <option value="best">⭐ Best Match</option>
                <option value="sqft_asc">Area: Low → High</option>
                <option value="sqft_desc">Area: High → Low</option>
                <option value="budget_asc">Budget: Low → High</option>
                <option value="budget_desc">Budget: High → Low</option>
              </select>

              {/* Back to filters */}
              <button
                id="results-back-btn"
                onClick={() => navigate(`/archint/select/${type}`)}
                className="arch-btn-ghost"
                style={{ padding: '8px 16px', fontSize: '13px', fontWeight: 600 }}
              >
                ← Edit Filters
              </button>
            </div>
          </div>
        </div>

        {/* Grid */}
        <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '0 24px 80px' }}>
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px', gap: '16px' }}>
              <div className="arch-spinner" />
              <p style={{ color: '#475569', fontFamily: 'Outfit,sans-serif', fontSize: '14px' }}>
                Analyzing design patterns...
              </p>
            </div>
          ) : displayList.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 20px' }}>
              <div style={{ fontSize: '4rem', marginBottom: '16px' }}>{showSaved ? '🤍' : '🔍'}</div>
              <p style={{ color: '#64748b', fontFamily: 'Outfit,sans-serif', fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>
                {showSaved ? 'No saved designs yet' : 'No matching designs found'}
              </p>
              <p style={{ color: '#475569', fontFamily: 'Outfit,sans-serif', fontSize: '14px', marginBottom: '24px' }}>
                {showSaved ? 'Click ❤️ on any design to save it.' : 'Try adjusting your filters.'}
              </p>
              <button
                onClick={() => showSaved ? setShowSaved(false) : navigate(`/archint/select/${type}`)}
                className="arch-btn-primary"
                style={{ padding: '12px 28px', fontSize: '15px' }}
              >
                {showSaved ? 'Browse All Designs' : '← Adjust Filters'}
              </button>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))',
              gap: '24px',
            }}>
              {displayList.map((design, i) => (
                <DesignCard
                  key={design.id}
                  design={design}
                  index={i}
                  isSaved={saved.has(design.id)}
                  onSave={toggleSave}
                  onClick={() => setSelectedDesign(design)}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Detail Modal */}
      {selectedDesign && (
        <DesignModal
          design={selectedDesign}
          isSaved={saved.has(selectedDesign.id)}
          onSave={toggleSave}
          onClose={() => setSelectedDesign(null)}
        />
      )}
    </div>
  );
}

// ── Design Card ──

function DesignCard({
  design, index, isSaved, onSave, onClick,
}: {
  design: ArchDesign;
  index: number;
  isSaved: boolean;
  onSave: (id: number, e?: React.MouseEvent) => void;
  onClick: () => void;
}) {
  return (
    <div
      id={`design-card-${design.id}`}
      className="arch-design-card arch-animate-fade-up"
      style={{ animationDelay: `${Math.min(index * 50, 400)}ms`, opacity: 0 }}
      onClick={onClick}
    >
      {/* Image */}
      <div className="arch-card-image-wrap" style={{ height: '200px', position: 'relative' }}>
        <img src={design.image} alt={design.name} loading="lazy" />

        {/* Gradient overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(2,5,16,0.8) 0%, transparent 50%)',
        }} />

        {/* Save button */}
        <button
          id={`save-btn-${design.id}`}
          className={`arch-save-btn${isSaved ? ' saved' : ''}`}
          onClick={e => onSave(design.id, e)}
          title={isSaved ? 'Remove from saved' : 'Save design'}
        >
          {isSaved ? '❤️' : '🤍'}
        </button>

        {/* Tags */}
        <div style={{
          position: 'absolute', bottom: '10px', left: '10px',
          display: 'flex', gap: '6px', flexWrap: 'wrap',
        }}>
          {design.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className={
                tag === 'Best Match' ? 'arch-tag-best' :
                tag === 'Recommended' ? 'arch-tag-recommended' :
                'arch-tag-trending'
              }
            >
              {tag === 'Best Match' ? '⭐' : tag === 'Recommended' ? '✅' : '🔥'} {tag}
            </span>
          ))}
          {isSaved && <span className="arch-tag-saved">❤️ Saved</span>}
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: '18px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '10px' }}>
          <div>
            <h3 style={{
              fontFamily: 'Outfit,sans-serif', fontSize: '1rem', fontWeight: 800,
              color: '#f0f4ff', marginBottom: '2px', lineHeight: 1.3,
            }}>
              {design.name}
            </h3>
            <p style={{ color: '#475569', fontSize: '11px', fontFamily: 'Outfit,sans-serif', fontWeight: 600, letterSpacing: '0.5px' }}>
              by {design.architect}
            </p>
          </div>
          <span style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '8px', padding: '4px 10px',
            fontSize: '11px', color: '#94a3b8', fontFamily: 'Outfit,sans-serif', fontWeight: 600,
            whiteSpace: 'nowrap', flexShrink: 0,
          }}>
            {design.style}
          </span>
        </div>

        {/* Specs */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '14px', flexWrap: 'wrap' }}>
          {[
            { label: '🏗️ Floors', value: `${design.floors}` },
            { label: '📐 Area', value: `${design.sqft.toLocaleString()} sqft` },
          ].map(({ label, value }) => (
            <div key={label} style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '8px', padding: '6px 10px',
            }}>
              <p style={{ fontSize: '10px', color: '#475569', fontFamily: 'Outfit,sans-serif', marginBottom: '1px' }}>{label}</p>
              <p style={{ fontSize: '13px', color: '#f0f4ff', fontFamily: 'Outfit,sans-serif', fontWeight: 700 }}>{value}</p>
            </div>
          ))}
        </div>

        {/* Amenities */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
          {design.garden && <AmenityChip label="🌿 Garden" />}
          {design.balcony && <AmenityChip label="🌇 Balcony" />}
          {design.parking && <AmenityChip label="🚗 Parking" />}
          {design.freeSpace && <AmenityChip label="🟩 Open Space" />}
          <AmenityChip label="💧 Water" glow />
        </div>

        {/* Bottom */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          paddingTop: '14px', borderTop: '1px solid rgba(255,255,255,0.06)',
        }}>
          <div>
            <p style={{ fontSize: '10px', color: '#475569', fontFamily: 'Outfit,sans-serif', marginBottom: '2px' }}>Budget</p>
            <p style={{
              fontSize: '1.15rem', fontWeight: 900, fontFamily: 'Outfit,sans-serif',
              background: 'linear-gradient(135deg,#00d4ff,#a855f7)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>
              ₹{design.budget} Lakhs
            </p>
          </div>
          <button
            id={`view-details-${design.id}`}
            onClick={e => { e.stopPropagation(); }}
            className="arch-btn-primary"
            style={{ padding: '8px 16px', fontSize: '13px' }}
          >
            View Details →
          </button>
        </div>
      </div>
    </div>
  );
}

function AmenityChip({ label, glow }: { label: string; glow?: boolean }) {
  return (
    <span style={{
      fontSize: '11px', fontFamily: 'Outfit,sans-serif',
      background: glow ? 'rgba(34,197,94,0.08)' : 'rgba(255,255,255,0.04)',
      border: `1px solid ${glow ? 'rgba(34,197,94,0.2)' : 'rgba(255,255,255,0.06)'}`,
      borderRadius: '6px', padding: '3px 8px',
      color: glow ? '#4ade80' : '#64748b',
    }}>
      {label}
    </span>
  );
}

// ── Detail Modal ──

function DesignModal({
  design, isSaved, onSave, onClose,
}: {
  design: ArchDesign;
  isSaved: boolean;
  onSave: (id: number) => void;
  onClose: () => void;
}) {
  return (
    <div
      id="design-modal-overlay"
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 500,
        background: 'rgba(2,5,16,0.85)',
        backdropFilter: 'blur(12px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '24px',
        animation: 'archFadeIn 0.25s ease',
      }}
    >
      <div
        id="design-modal-content"
        className="arch-glass-strong"
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: '780px',
          maxHeight: '90vh', overflowY: 'auto',
          animation: 'archFadeInUp 0.3s ease',
          border: '1px solid rgba(0,212,255,0.15)',
        }}
      >
        {/* Image */}
        <div style={{ position: 'relative', height: '280px', overflow: 'hidden', borderRadius: '24px 24px 0 0' }}>
          <img
            src={design.image} alt={design.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to top,rgba(2,5,16,0.9) 0%,transparent 60%)',
          }} />

          {/* Close */}
          <button
            id="modal-close-btn"
            onClick={onClose}
            style={{
              position: 'absolute', top: 14, right: 14, width: 36, height: 36,
              borderRadius: '50%', background: 'rgba(2,5,16,0.8)', border: '1px solid rgba(255,255,255,0.1)',
              cursor: 'pointer', color: '#94a3b8', fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            ✕
          </button>

          {/* Tags top-left */}
          <div style={{ position: 'absolute', bottom: '14px', left: '16px', display: 'flex', gap: '8px' }}>
            {design.tags.map(tag => (
              <span key={tag} className={
                tag === 'Best Match' ? 'arch-tag-best' :
                tag === 'Recommended' ? 'arch-tag-recommended' : 'arch-tag-trending'
              }>
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: '28px 32px 32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h2 style={{ fontFamily: 'Outfit,sans-serif', fontSize: '1.6rem', fontWeight: 900, color: '#f0f4ff', marginBottom: '4px' }}>
                {design.name}
              </h2>
              <p style={{ color: '#475569', fontSize: '13px', fontFamily: 'Outfit,sans-serif' }}>
                by {design.architect} · {design.style}
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: '11px', color: '#475569', fontFamily: 'Outfit,sans-serif', marginBottom: '4px' }}>Estimated Budget</p>
              <p style={{
                fontSize: '1.6rem', fontWeight: 900, fontFamily: 'Outfit,sans-serif',
                background: 'linear-gradient(135deg,#00d4ff,#a855f7)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              }}>
                ₹{design.budget} Lakhs
              </p>
            </div>
          </div>

          <p style={{ color: '#94a3b8', fontSize: '15px', lineHeight: 1.8, fontFamily: 'Outfit,sans-serif', marginBottom: '24px' }}>
            {design.description}
          </p>

          {/* Dynamic Architectural Drawing Sheet Sketch */}
          <div style={{ margin: '32px 0 24px 0' }}>
            <h4 style={{ fontFamily: 'Outfit,sans-serif', fontSize: '13px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '14px' }}>
              📐 Dynamic Architectural Drawing Sketch Sheet
            </h4>
            <SketchSheetVisualizer plan={adaptDesignToPlan(design)} />
          </div>

          {/* Specs grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(120px,1fr))', gap: '12px', marginBottom: '24px' }}>
            {[
              { icon: '🏗️', label: 'Floors', value: `${design.floors}` },
              { icon: '📐', label: 'Area', value: `${design.sqft.toLocaleString()} sqft` },
              { icon: '🏠', label: 'Type', value: design.type === 'house' ? 'House' : 'Apartment' },
              { icon: '🎨', label: 'Style', value: design.style },
            ].map(({ icon, label, value }) => (
              <div key={label} style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '12px', padding: '14px',
                textAlign: 'center',
              }}>
                <p style={{ fontSize: '1.5rem', marginBottom: '4px' }}>{icon}</p>
                <p style={{ fontSize: '11px', color: '#475569', fontFamily: 'Outfit,sans-serif', marginBottom: '4px' }}>{label}</p>
                <p style={{ fontSize: '14px', color: '#f0f4ff', fontFamily: 'Outfit,sans-serif', fontWeight: 700 }}>{value}</p>
              </div>
            ))}
          </div>

          {/* Amenities */}
          <div style={{ marginBottom: '24px' }}>
            <h4 style={{ fontFamily: 'Outfit,sans-serif', fontSize: '13px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '14px' }}>
              Included Amenities
            </h4>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {[
                { label: '💧 Water Facility', active: true },
                { label: '🌿 Garden', active: design.garden },
                { label: '🟩 Free Space', active: design.freeSpace },
                { label: '🌇 Balcony', active: design.balcony },
                { label: '🚗 Parking', active: design.parking },
              ].map(({ label, active }) => (
                <span key={label} style={{
                  padding: '8px 14px', borderRadius: '10px', fontSize: '13px', fontFamily: 'Outfit,sans-serif', fontWeight: 500,
                  background: active ? 'rgba(0,212,255,0.08)' : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${active ? 'rgba(0,212,255,0.2)' : 'rgba(255,255,255,0.05)'}`,
                  color: active ? '#00d4ff' : '#334155',
                  textDecoration: !active ? 'line-through' : 'none',
                }}>
                  {label}
                </span>
              ))}
            </div>
          </div>

          {/* 3D View notice */}
          <div style={{
            background: 'rgba(168,85,247,0.06)',
            border: '1px solid rgba(168,85,247,0.15)',
            borderRadius: '12px', padding: '16px',
            display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px',
          }}>
            <span style={{ fontSize: '1.5rem' }}>🔮</span>
            <div>
              <p style={{ color: '#a855f7', fontFamily: 'Outfit,sans-serif', fontSize: '14px', fontWeight: 600, marginBottom: '2px' }}>
                3D Visualization Available
              </p>
              <p style={{ color: '#475569', fontFamily: 'Outfit,sans-serif', fontSize: '12px' }}>
                Three.js-powered 3D walkthrough integration ready. Coming soon.
              </p>
            </div>
            <button
              id={`modal-3d-btn-${design.id}`}
              style={{
                marginLeft: 'auto', padding: '8px 16px', borderRadius: '10px',
                background: 'rgba(168,85,247,0.15)', border: '1px solid rgba(168,85,247,0.3)',
                color: '#a855f7', cursor: 'pointer', fontFamily: 'Outfit,sans-serif',
                fontSize: '13px', fontWeight: 600, whiteSpace: 'nowrap', flexShrink: 0,
              }}
            >
              View in 3D →
            </button>
          </div>

          {/* CTA */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              id={`modal-save-btn-${design.id}`}
              onClick={() => onSave(design.id)}
              style={{
                padding: '13px 20px', borderRadius: '12px', cursor: 'pointer',
                fontFamily: 'Outfit,sans-serif', fontSize: '14px', fontWeight: 700, border: 'none',
                background: isSaved
                  ? 'linear-gradient(135deg,rgba(236,72,153,0.2),rgba(236,72,153,0.1))'
                  : 'rgba(255,255,255,0.05)',
                color: isSaved ? '#ec4899' : '#94a3b8',
                transition: 'all 0.2s',
              }}
            >
              {isSaved ? '❤️ Saved' : '🤍 Save'}
            </button>
            <button
              id={`modal-consult-btn-${design.id}`}
              className="arch-btn-primary"
              style={{ flex: 1, padding: '13px', fontSize: '15px', fontWeight: 700 }}
            >
              🏗️ Get a Consultation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
