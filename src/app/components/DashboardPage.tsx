import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Building2, 
  Home, 
  Search, 
  SlidersHorizontal, 
  Heart, 
  ChevronRight, 
  Sun, 
  Moon, 
  Maximize2, 
  MapPin, 
  CreditCard,
  Building,
  Layers,
  ArrowRight,
  Sparkles,
  X,
  Plus,
  Minus,
  Navigation,
  Droplet,
  Umbrella,
  Wind,
  Zap,
  Check,
  Download,
  PhoneCall,
  Bed,
  Bath,
  Utensils,
  Car,
  ChefHat,
  Monitor,
  Layout,
  Info,
  Compass,
  Map as MapIcon,
  ShieldCheck,
  Activity,
  HeartCrack,
  Trees
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { richMockPlans, PlanData, generateProceduralPlans, generateVariations } from '../data/plans_rich';
import { Logo as BrandLogo } from './Logo';
import { BlueprintVisualizer } from './BlueprintVisualizer';
import { CustomizationPanel } from './CustomizationPanel';
import { MapContainer, TileLayer, Marker, Popup, Circle, Polygon, Polyline, Tooltip, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon in Leaflet + React
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Simulated Backend APIs for MERN stack integration
const mockApi = {
  getPlans: async (type: 'house' | 'apartment'): Promise<PlanData[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(richMockPlans.filter(plan => plan.type === type));
      }, 700); // simulated network latency
    });
  },
  toggleFavorite: async (userId: string, planId: string): Promise<{ success: boolean; action: 'added' | 'removed' }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, action: 'added' });
      }, 300);
    });
  }
};

// --- Custom UI Components ---
const Button = ({ children, onClick, variant = 'primary', className = '', active = false }: any) => {
  const variants = {
    primary: 'bg-[#4CAF50] hover:bg-[#43a047] text-white shadow-md shadow-[#4CAF50]/20 hover:shadow-lg hover:shadow-[#4CAF50]/30',
    secondary: 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750',
    outline: 'border-2 border-[#4CAF50] text-[#4CAF50] hover:bg-[#4CAF50] hover:text-white',
    ghost: 'hover:bg-gray-100 dark:hover:bg-gray-800/80 text-gray-600 dark:text-gray-400',
    filter: active 
      ? 'bg-[#4CAF50] text-white border-transparent shadow-md shadow-[#4CAF50]/25' 
      : 'bg-white dark:bg-gray-800/50 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-850 hover:border-[#4CAF50]/40',
  };
  return (
    <button 
      onClick={onClick} 
      className={`px-4 py-2.5 rounded-2xl transition-all duration-300 font-bold flex items-center justify-center gap-2 border text-sm ${variants[variant as keyof typeof variants]} ${className}`}
    >
      {children}
    </button>
  );
};

const SkeletonCard = () => (
  <div className="bg-white dark:bg-[#1A1A1A] rounded-[2rem] overflow-hidden shadow-xl border border-gray-150 dark:border-gray-850 p-4 animate-pulse">
    <div className="w-full h-52 bg-gray-200 dark:bg-gray-800 rounded-[1.5rem] mb-5"></div>
    <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded-full w-3/4 mb-3"></div>
    <div className="h-4 bg-gray-100 dark:bg-gray-900 rounded-full w-1/2 mb-6"></div>
    <div className="grid grid-cols-2 gap-3 mb-5">
      <div className="h-8 bg-gray-50 dark:bg-gray-900 rounded-xl"></div>
      <div className="h-8 bg-gray-50 dark:bg-gray-900 rounded-xl"></div>
    </div>
    <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded-xl w-full"></div>
  </div>
);

const DesignCard = ({ plan, onOpen, isFavorite, toggleFavorite }: { plan: PlanData, onOpen: (p: PlanData) => void, isFavorite: boolean, toggleFavorite: (id: string, e: any) => void }) => {
  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6 }}
      className="bg-white dark:bg-[#161616] rounded-[2.2rem] overflow-hidden shadow-xl hover:shadow-2xl border border-gray-150 dark:border-gray-850 group relative flex flex-col justify-between"
    >
      <div className="relative h-56 overflow-hidden p-3">
        <div className="w-full h-full rounded-[1.6rem] overflow-hidden relative">
          <img 
            src={plan.image} 
            alt={plan.title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </div>
        
        <div className="absolute top-5 right-5 z-10">
          <button 
            onClick={(e) => toggleFavorite(plan.id, e)}
            className={`p-2.5 rounded-xl backdrop-blur-xl border border-white/20 transition-all ${
              isFavorite ? 'bg-[#ff4b4b] border-transparent text-white' : 'bg-black/30 text-white hover:bg-black/50'
            }`}
          >
            <Heart size={16} fill={isFavorite ? 'currentColor' : 'none'} strokeWidth={2.5} />
          </button>
        </div>
        
        {plan.isRecommended && (
          <div className="absolute top-5 left-5 bg-[#4CAF50] text-white px-3.5 py-1.5 rounded-full text-[10px] font-black flex items-center gap-1.5 shadow-lg border border-[#4CAF50]/30 backdrop-blur-md">
            <Sparkles size={11} /> AI RECOMMENDED
          </div>
        )}

        <div className="absolute bottom-5 left-7 text-white opacity-0 group-hover:opacity-100 group-hover:translate-y-0 translate-y-1.5 transition-all duration-300">
           <span className="text-xs font-black bg-[#4CAF50] px-3 py-1.5 rounded-lg shadow-lg">
             ₹{plan.cost >= 10000000 ? `${(plan.cost / 10000000).toFixed(2)} Crore+` : `${(plan.cost / 100000).toFixed(0)} Lakhs+`}
           </span>
        </div>
      </div>
      
      <div className="px-6 pb-6 pt-3 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-black text-gray-900 dark:text-white group-hover:text-[#4CAF50] transition-colors line-clamp-1">{plan.title}</h3>
          </div>
          
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-4">
             <MapPin size={11} className="text-[#4CAF50]" />
             {plan.category} • {plan.plotFit || 'Custom Design'}
          </div>
          
          <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-5 leading-relaxed font-medium">
            {plan.description}
          </p>

          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="flex flex-col gap-0.5 p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-850">
              <span className="text-[9px] uppercase font-black text-gray-400">Floors</span>
              <div className="flex items-center gap-1.5 font-bold text-xs text-gray-900 dark:text-white">
                <Layers size={12} className="text-[#4CAF50]" /> {plan.floors}F
              </div>
            </div>
            <div className="flex flex-col gap-0.5 p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-850">
              <span className="text-[9px] uppercase font-black text-gray-400">Built Area</span>
              <div className="flex items-center gap-1.5 font-bold text-xs text-gray-900 dark:text-white">
                <Maximize2 size={12} className="text-[#4CAF50]" /> {plan.area} sq ft
              </div>
            </div>
            {plan.type === 'house' ? (
              <>
                <div className="flex flex-col gap-0.5 p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-850">
                  <span className="text-[9px] uppercase font-black text-gray-400">Config</span>
                  <div className="flex items-center gap-1.5 font-bold text-xs text-gray-900 dark:text-white">
                    <Bed size={12} className="text-[#4CAF50]" /> {plan.bedrooms} BHK
                  </div>
                </div>
                <div className="flex flex-col gap-0.5 p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-850">
                  <span className="text-[9px] uppercase font-black text-gray-400">Balcony</span>
                  <div className="flex items-center gap-1.5 font-bold text-xs text-gray-900 dark:text-white">
                    <Umbrella size={12} className="text-[#4CAF50]" /> {plan.balcony === 'With Balcony' ? 'YES' : 'NO'}
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="flex flex-col gap-0.5 p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-850">
                  <span className="text-[9px] uppercase font-black text-gray-400">Total Units</span>
                  <div className="flex items-center gap-1.5 font-bold text-xs text-gray-900 dark:text-white">
                    <Building size={12} className="text-[#4CAF50]" /> {plan.units} Units
                  </div>
                </div>
                <div className="flex flex-col gap-0.5 p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-850">
                  <span className="text-[9px] uppercase font-black text-gray-400">Units/Floor</span>
                  <div className="flex items-center gap-1.5 font-bold text-xs text-gray-900 dark:text-white">
                    <Layers size={12} className="text-[#4CAF50]" /> {plan.unitsPerFloor} Units
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        <Button 
          variant="primary" 
          className="w-full py-3 group/btn" 
          onClick={() => onOpen(plan)}
        >
          {plan.type === 'house' ? 'View Plan' : 'View Details'}
          <ArrowRight size={15} className="group-hover/btn:translate-x-1.5 transition-transform" />
        </Button>
      </div>
    </motion.div>
  );
};

// --- Selection Hook ---
const useDebounce = (value: any, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
};

// --- Main Page ---
export const DashboardPage: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return localStorage.getItem('theme') as 'light' | 'dark' || 'light';
  });
  const [selection, setSelection] = useState<'none' | 'house' | 'apartment'>('none');
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'plans' | 'map'>('plans');
  
  // House filters state
  const [houseFilters, setHouseFilters] = useState({
    floors: 'all',
    area: 'all',
    budget: 'all',
    balcony: 'all',
    bedrooms: 'all',
    kitchen: 'all',
    dining: 'all',
    parking: 'all',
    waterFacility: 'all',
    plotDimensions: 'all',
    garden: 'all',
    vastu: 'all'
  });

  // Apartment filters state
  const [apartmentFilters, setApartmentFilters] = useState({
    floors: 'all',
    unitsCount: 'all',
    area: 'all',
    budget: 'all',
    unitsPerFloor: 'all',
    balcony: 'all'
  });
  
  const [favorites, setFavorites] = useState<string[]>(() => {
    return JSON.parse(localStorage.getItem('favs-smartai') || '[]');
  });
  
  const [selectedPlan, setSelectedPlan] = useState<PlanData | null>(null);
  const [customizedPlan, setCustomizedPlan] = useState<PlanData | null>(null);
  const [variations, setVariations] = useState<PlanData[]>([]);

  useEffect(() => {
    if (selectedPlan) {
      setCustomizedPlan(selectedPlan);
      setVariations(generateVariations(selectedPlan, 3));
    } else {
      setCustomizedPlan(null);
      setVariations([]);
    }
  }, [selectedPlan]);

  const handleCustomizedPlanUpdate = (updated: PlanData) => {
    setCustomizedPlan(updated);
    setVariations(generateVariations(updated, 3));
  };
  const [isScrolled, setIsScrolled] = useState(false);
  const [page, setPage] = useState(1);
  const itemsPerPage = 9;

  // Map state
  const [userLocation, setUserLocation] = useState<[number, number]>([12.9716, 77.5946]); // Bangalore default
  const [mapAddress, setMapAddress] = useState('Selected Zone, Central Bangalore, Karnataka');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('favs-smartai', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (selection !== 'none') {
        setIsLoading(true);
        const timer = setTimeout(() => setIsLoading(false), 700);
        return () => clearTimeout(timer);
    }
  }, [selection, houseFilters, apartmentFilters, debouncedSearch]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');
  
  const toggleFavorite = async (id: string, e?: any) => {
    if (e) e.stopPropagation();
    
    // Optimistic UI updates
    const isFav = favorites.includes(id);
    setFavorites(prev => isFav ? prev.filter(f => f !== id) : [...prev, id]);

    // Backend-integration ready trigger
    try {
      await mockApi.toggleFavorite('user123', id);
    } catch (err) {
      console.error('Failed to sync favorite with MERN backend:', err);
    }
  };

  // Generate customized blueprints on the fly based on active filters!
  const generatedPlans = useMemo(() => {
    if (selection === 'none') return [];
    const activeFilters = selection === 'house' ? houseFilters : apartmentFilters;
    return generateProceduralPlans({ type: selection, ...activeFilters }, 100);
  }, [selection, houseFilters, apartmentFilters]);

  // Filter the procedurally generated designs by search query
  const filteredPlans = useMemo(() => {
    if (selection === 'none') return [];
    if (debouncedSearch) {
      return generatedPlans.filter(plan => plan.title.toLowerCase().includes(debouncedSearch.toLowerCase()));
    }
    return generatedPlans;
  }, [generatedPlans, debouncedSearch, selection]);

  const currentPagePlans = filteredPlans.slice(0, page * itemsPerPage);

  // AI Recommended plans logic (Filter dynamically to select suitable suggestions)
  const recommendations = useMemo(() => {
    return generatedPlans.filter(p => p.isRecommended).slice(0, 3);
  }, [generatedPlans]);

  // Leaflet Click Event Handler
  const MapEvents = () => {
    useMapEvents({
      click(e) {
        setUserLocation([e.latlng.lat, e.latlng.lng]);
        setMapAddress(`Construct Zone Coordinate: ${e.latlng.lat.toFixed(5)}°N, ${e.latlng.lng.toFixed(5)}°E`);
      },
    });
    return null;
  };

  // Map zoning offsets (drawing mock boundary around coordinates)
  const plotBoundary = useMemo(() => {
    const lat = userLocation[0];
    const lng = userLocation[1];
    return [
      [lat - 0.0003, lng - 0.0004],
      [lat + 0.0003, lng - 0.0004],
      [lat + 0.0003, lng + 0.0004],
      [lat - 0.0003, lng + 0.0004],
    ] as [number, number][];
  }, [userLocation]);

  const roadCoordinates = useMemo(() => {
    const lat = userLocation[0];
    const lng = userLocation[1];
    return [
      [lat - 0.0012, lng - 0.0025],
      [lat - 0.0012, lng + 0.0025]
    ] as [number, number][];
  }, [userLocation]);

  const waterLineCoordinates = useMemo(() => {
    const lat = userLocation[0];
    const lng = userLocation[1];
    return [
      [lat - 0.0014, lng - 0.0025],
      [lat - 0.0014, lng + 0.0025]
    ] as [number, number][];
  }, [userLocation]);

  // Selection Screen (After Login)
  if (selection === 'none') {
    return (
      <div className={`min-h-screen transition-colors duration-500 bg-[#F9FBFC] dark:bg-[#090909] flex flex-col`}>
        {/* Navigation Bar */}
        <nav className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-6 md:px-12 py-5 border-b border-gray-100 dark:border-gray-900 bg-white/70 dark:bg-black/60 backdrop-blur-xl">
           <BrandLogo />
           <div className="flex items-center gap-4">
              <Button variant="secondary" onClick={toggleTheme} className="rounded-full w-11 h-11 p-0 flex items-center justify-center">
                {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
              </Button>
           </div>
        </nav>

        {/* Hero selection options */}
        <main className="flex-1 flex items-center justify-center px-6 pt-28 pb-16">
           <div className="max-w-5xl w-full">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center mb-16 space-y-4"
              >
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#4CAF50]/10 border border-[#4CAF50]/20 text-[#4CAF50] font-black text-[10px] uppercase tracking-[0.2em]">
                  <Sparkles size={12} /> AI-Powered Blueprint Studio
                </div>
                <h1 className="text-5xl md:text-7xl font-black text-gray-900 dark:text-white leading-[1] tracking-tight">
                   What would you <br />
                   <span className="text-[#4CAF50] relative inline-block mt-2">
                     like to build?
                     <svg className="absolute -bottom-3 left-0 w-full h-4 text-[#4CAF50]/30 -z-10" viewBox="0 0 100 20" preserveAspectRatio="none">
                       <path d="M0 10 Q 25 20 50 10 T 100 10" stroke="currentColor" strokeWidth="6" fill="none" />
                     </svg>
                   </span>
                 </h1>
                <p className="text-gray-500 dark:text-gray-400 text-base md:text-lg font-medium max-w-xl mx-auto pt-4">
                   Select a planning module below to generate architectural designs. Instantly filter by floor configurations, budget limits, utilities, and location parameters.
                </p>
              </motion.div>

              <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {/* House card */}
                <motion.div 
                  whileHover={{ scale: 1.015, y: -6 }}
                  whileTap={{ scale: 0.985 }}
                  className="group relative bg-white dark:bg-[#121212] p-3 rounded-[2.5rem] shadow-xl hover:shadow-2xl cursor-pointer border border-gray-100 dark:border-gray-850 hover:border-[#4CAF50]/40 transition-all flex flex-col justify-between"
                  onClick={() => setSelection('house')}
                >
                  <div className="relative overflow-hidden rounded-[2.2rem] h-[260px] mb-5">
                    <img src="https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="House Blueprint" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent flex flex-col justify-end p-8">
                       <span className="text-[10px] font-black text-[#4CAF50] uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                         <Home size={13} /> Residential Plot
                       </span>
                       <h2 className="text-3xl font-black text-white mb-2">Build a House</h2>
                       <p className="text-gray-300 text-xs font-medium leading-relaxed max-w-xs">
                         Villas, duplex layouts, and small homes. 80+ AI layouts starting from ₹50 Lakhs.
                       </p>
                    </div>
                  </div>
                  
                  {/* explicit CTA button */}
                  <div className="px-5 pb-5">
                    <div className="w-full flex items-center justify-center gap-2 bg-gray-50 dark:bg-gray-850 text-gray-800 dark:text-gray-200 group-hover:bg-[#4CAF50] group-hover:text-white px-6 py-4 rounded-2xl text-sm font-bold shadow-sm transition-all duration-300">
                      Explore House Plans
                      <ArrowRight size={16} className="group-hover:translate-x-1.5 transition-transform" />
                    </div>
                  </div>
                </motion.div>

                {/* Apartment card */}
                <motion.div 
                  whileHover={{ scale: 1.015, y: -6 }}
                  whileTap={{ scale: 0.985 }}
                  className="group relative bg-white dark:bg-[#121212] p-3 rounded-[2.5rem] shadow-xl hover:shadow-2xl cursor-pointer border border-gray-100 dark:border-gray-850 hover:border-[#4CAF50]/40 transition-all flex flex-col justify-between"
                  onClick={() => setSelection('apartment')}
                >
                  <div className="relative overflow-hidden rounded-[2.2rem] h-[260px] mb-5">
                    <img src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Apartment Building" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent flex flex-col justify-end p-8">
                       <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                         <Building2 size={13} /> Commercial Structure
                       </span>
                       <h2 className="text-3xl font-black text-white mb-2">Build an Apartment</h2>
                       <p className="text-gray-300 text-xs font-medium leading-relaxed max-w-xs">
                         Multi-floor towers and urban suites. 30+ architectural plans from 8-10 floors.
                       </p>
                    </div>
                  </div>

                  {/* explicit CTA button */}
                  <div className="px-5 pb-5">
                    <div className="w-full flex items-center justify-center gap-2 bg-gray-50 dark:bg-gray-850 text-gray-800 dark:text-gray-200 group-hover:bg-[#4CAF50] group-hover:text-white px-6 py-4 rounded-2xl text-sm font-bold shadow-sm transition-all duration-300">
                      Explore Apartment Plans
                      <ArrowRight size={16} className="group-hover:translate-x-1.5 transition-transform" />
                    </div>
                  </div>
                </motion.div>
              </div>
           </div>
        </main>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-500 bg-[#F9FBFC] dark:bg-[#0B0B0B]`}>
      
      {/* Sticky Main Navigation */}
      <nav className={`fixed top-0 left-0 w-full z-[60] transition-all duration-500 flex items-center justify-between px-6 md:px-12 py-4 ${
        isScrolled ? 'bg-white/85 dark:bg-[#111111]/85 backdrop-blur-2xl shadow-lg border-b border-gray-100 dark:border-gray-900' : 'bg-transparent'
      }`}>
        <div className="cursor-pointer flex items-center" onClick={() => { setSelection('none'); setPage(1); }}>
          <BrandLogo />
        </div>

        {/* Global Search box in navbar */}
        <div className="hidden lg:flex flex-1 max-w-xl mx-8 relative group">
          <div className="absolute inset-0 bg-[#4CAF50]/5 rounded-2xl blur-lg group-hover:bg-[#4CAF50]/8 transition-all"></div>
          <div className="relative w-full flex items-center">
            <Search className="absolute left-5 text-gray-400 group-focus-within:text-[#4CAF50] transition-colors" size={18} />
            <input 
              type="text" 
              placeholder={`Search for ${selection === 'house' ? 'dream house designs' : 'premium apartments'}...`}
              className="w-full bg-white dark:bg-gray-850 border border-gray-200 dark:border-gray-750 rounded-2xl py-3 pl-12 pr-10 focus:ring-2 focus:ring-[#4CAF50]/15 focus:border-[#4CAF50] outline-none transition-all dark:text-white font-semibold text-sm shadow-sm"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
            {search && (
                <button onClick={() => setSearch('')} className="absolute right-4 p-1 hover:bg-gray-100 dark:hover:bg-gray-750 rounded-full">
                    <X size={14} className="text-gray-400" />
                </button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Dashboard view toggle: List or Map */}
          <div className="flex bg-gray-100 dark:bg-gray-850 p-1 rounded-xl border border-gray-200/50 dark:border-gray-800/80">
            <button 
              onClick={() => setActiveTab('plans')} 
              className={`p-2 rounded-lg transition-all flex items-center gap-1.5 text-xs font-bold ${activeTab === 'plans' ? 'bg-[#4CAF50] text-white' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'}`}
            >
              <Layout size={14} /> Catalog
            </button>
            <button 
              onClick={() => setActiveTab('map')} 
              className={`p-2 rounded-lg transition-all flex items-center gap-1.5 text-xs font-bold ${activeTab === 'map' ? 'bg-[#4CAF50] text-white' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'}`}
            >
              <MapIcon size={14} /> Site Map
            </button>
          </div>

          <button 
            onClick={toggleTheme}
            className="w-10 h-10 rounded-xl bg-white dark:bg-gray-850 shadow-md border border-gray-200/60 dark:border-gray-800 flex items-center justify-center dark:text-white hover:scale-105 active:scale-95 transition-all"
          >
            {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
          </button>
          
          <div className="relative group flex items-center">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#4CAF50] to-[#81C784] p-0.5 shadow-md cursor-pointer overflow-hidden transform hover:scale-105 transition-all">
                <div className="w-full h-full rounded-[0.55rem] bg-white overflow-hidden">
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=ConstructionPlanner" alt="User Profile" className="w-full h-full" />
                </div>
            </div>
            {favorites.length > 0 && (
                <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center border-2 border-white dark:border-[#0B0B0B]">
                   {favorites.length}
                </div>
            )}
          </div>
        </div>
      </nav>

      {/* Main Dashboard Layout */}
      <div className="flex pt-24 min-h-screen">
        
        {/* Sidebar Filters - Conditionally Rendered by Selection */}
        <aside className="hidden xl:block w-76 px-6 sticky top-24 h-[calc(100vh-6rem)] overflow-y-auto pb-10 border-r border-gray-100 dark:border-gray-900 bg-white/40 dark:bg-black/10">
            <div className="space-y-8 pt-6">
                <div className="flex items-center justify-between">
                    <h4 className="text-base font-black text-gray-900 dark:text-white flex items-center gap-2">
                      <SlidersHorizontal size={16} className="text-[#4CAF50]" /> Plan Filters
                    </h4>
                    <button 
                        onClick={() => {
                          setHouseFilters({ floors: 'all', area: 'all', budget: 'all', balcony: 'all', bedrooms: 'all', kitchen: 'all', dining: 'all', parking: 'all', waterFacility: 'all', plotDimensions: 'all', garden: 'all', vastu: 'all' });
                          setApartmentFilters({ floors: 'all', unitsCount: 'all', area: 'all', budget: 'all', unitsPerFloor: 'all', balcony: 'all' });
                        }}
                        className="text-[10px] font-black text-[#4CAF50] uppercase tracking-widest hover:opacity-75"
                    >
                        Reset
                    </button>
                </div>

                {selection === 'house' ? (
                  // House Filters
                  <>
                    {/* Floors filter */}
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.15em] flex items-center gap-1.5">
                            <Layers size={13} className="text-[#4CAF50]" /> Number of Floors
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            {['all', '1', '2', '3', '4'].map(num => (
                                <Button 
                                    key={num} 
                                    variant="filter" 
                                    active={houseFilters.floors === num}
                                    onClick={() => setHouseFilters(f => ({ ...f, floors: num }))}
                                    className="py-2.5 rounded-xl font-bold text-xs"
                                >
                                    {num === 'all' ? 'All Floors' : `${num} Floor${num === '1' ? '' : 's'}`}
                                </Button>
                            ))}
                        </div>
                    </div>

                    {/* Area filters */}
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.15em] flex items-center gap-1.5">
                            <Maximize2 size={13} className="text-[#4CAF50]" /> Built-up Area
                        </label>
                        <select 
                            value={houseFilters.area}
                            onChange={(e) => setHouseFilters(f => ({ ...f, area: e.target.value }))}
                            className="w-full bg-white dark:bg-gray-850 border border-gray-200 dark:border-gray-750 rounded-xl p-3 font-semibold text-xs text-gray-700 dark:text-gray-300 outline-none focus:border-[#4CAF50] focus:ring-1 focus:ring-[#4CAF50]"
                        >
                            <option value="all">Any Built Area</option>
                            <option value="<1000">Below 1000 sq ft</option>
                            <option value="1000-1500">1000 – 1500 sq ft</option>
                            <option value="1500-2500">1500 – 2500 sq ft</option>
                            <option value="2500-4000">2500 – 4000 sq ft</option>
                            <option value=">4000">Above 4000 sq ft</option>
                        </select>
                    </div>

                    {/* BHK Configs */}
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.15em] flex items-center gap-1.5">
                            <Bed size={13} className="text-[#4CAF50]" /> Bedrooms (BHK)
                        </label>
                        <div className="grid grid-cols-3 gap-1.5">
                            {['all', '1BHK', '2BHK', '3BHK', '4BHK', '5BHK'].map(opt => (
                                <Button 
                                    key={opt} 
                                    variant="filter" 
                                    active={houseFilters.bedrooms === opt}
                                    onClick={() => setHouseFilters(f => ({ ...f, bedrooms: opt }))}
                                    className="py-2 rounded-lg font-bold text-[10px]"
                                >
                                    {opt === 'all' ? 'Any BHK' : opt}
                                </Button>
                            ))}
                        </div>
                    </div>

                    {/* Budget Bracket */}
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.15em] flex items-center gap-1.5">
                            <CreditCard size={13} className="text-[#4CAF50]" /> Budget Bracket
                        </label>
                        <select 
                            value={houseFilters.budget}
                            onChange={(e) => setHouseFilters(f => ({ ...f, budget: e.target.value }))}
                            className="w-full bg-white dark:bg-gray-850 border border-gray-200 dark:border-gray-750 rounded-xl p-3 font-semibold text-xs text-gray-700 dark:text-gray-300 outline-none focus:border-[#4CAF50] focus:ring-1 focus:ring-[#4CAF50]"
                        >
                            <option value="all">Any Budget Range</option>
                            <option value="50-75L">₹50 Lakhs – ₹75 Lakhs</option>
                            <option value="75L-1Cr">₹75 Lakhs – ₹1 Crore</option>
                            <option value="1Cr-2Cr">₹1 Crore – ₹2 Crores</option>
                            <option value="2Cr+">₹2 Crores+</option>
                        </select>
                    </div>

                    {/* Balcony option */}
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.15em] flex items-center gap-1.5">
                            <Umbrella size={13} className="text-[#4CAF50]" /> Balcony
                        </label>
                        <div className="flex gap-2">
                          {['all', 'With Balcony', 'Without Balcony'].map(opt => (
                              <Button 
                                  key={opt} 
                                  variant="filter" 
                                  active={houseFilters.balcony === opt}
                                  onClick={() => setHouseFilters(f => ({ ...f, balcony: opt }))}
                                  className="flex-1 py-2 rounded-lg font-bold text-[10px]"
                              >
                                  {opt === 'all' ? 'Any' : opt.replace(' Balcony', '')}
                              </Button>
                          ))}
                        </div>
                    </div>

                    {/* Kitchen design */}
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.15em] flex items-center gap-1.5">
                            <ChefHat size={13} className="text-[#4CAF50]" /> Kitchen Type
                        </label>
                        <select 
                            value={houseFilters.kitchen}
                            onChange={(e) => setHouseFilters(f => ({ ...f, kitchen: e.target.value }))}
                            className="w-full bg-white dark:bg-gray-850 border border-gray-200 dark:border-gray-750 rounded-xl p-3 font-semibold text-xs text-gray-700 dark:text-gray-300 outline-none focus:border-[#4CAF50]"
                        >
                            <option value="all">Any Kitchen Design</option>
                            <option value="Standard Kitchen">Standard Kitchen</option>
                            <option value="Open Kitchen">Open Kitchen</option>
                            <option value="Modular Kitchen">Modular Kitchen</option>
                        </select>
                    </div>

                    {/* Dining Space */}
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.15em] flex items-center gap-1.5">
                            <Utensils size={13} className="text-[#4CAF50]" /> Dining Space
                        </label>
                        <select 
                            value={houseFilters.dining}
                            onChange={(e) => setHouseFilters(f => ({ ...f, dining: e.target.value }))}
                            className="w-full bg-white dark:bg-gray-850 border border-gray-200 dark:border-gray-750 rounded-xl p-3 font-semibold text-xs text-gray-700 dark:text-gray-300 outline-none focus:border-[#4CAF50]"
                        >
                            <option value="all">Any Dining Setup</option>
                            <option value="Separate Dining">Separate Dining</option>
                            <option value="Combined Living + Dining">Combined Living + Dining</option>
                        </select>
                    </div>

                    {/* Parking */}
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.15em] flex items-center gap-1.5">
                            <Car size={13} className="text-[#4CAF50]" /> Car Parking
                        </label>
                        <div className="flex gap-2">
                          {['all', 'Yes', 'No'].map(opt => (
                              <Button 
                                  key={opt} 
                                  variant="filter" 
                                  active={houseFilters.parking === opt}
                                  onClick={() => setHouseFilters(f => ({ ...f, parking: opt }))}
                                  className="flex-1 py-2 rounded-lg font-bold text-[10px]"
                              >
                                  {opt === 'all' ? 'Any' : opt}
                              </Button>
                          ))}
                        </div>
                    </div>

                    {/* Water facilities */}
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.15em] flex items-center gap-1.5">
                            <Droplet size={13} className="text-[#4CAF50]" /> Water Utilities
                        </label>
                        <select 
                            value={houseFilters.waterFacility}
                            onChange={(e) => setHouseFilters(f => ({ ...f, waterFacility: e.target.value }))}
                            className="w-full bg-white dark:bg-gray-850 border border-gray-200 dark:border-gray-750 rounded-xl p-3 font-semibold text-xs text-gray-700 dark:text-gray-300 outline-none focus:border-[#4CAF50]"
                        >
                            <option value="all">Any Water Facility</option>
                            <option value="Borewell">Borewell</option>
                            <option value="Underground Sump">Underground Sump</option>
                            <option value="Overhead Tank">Overhead Tank</option>
                            <option value="Rainwater Harvesting">Rainwater Harvesting</option>
                        </select>
                    </div>

                    {/* Plot dimensions */}
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.15em] flex items-center gap-1.5">
                            <Compass size={13} className="text-[#4CAF50]" /> Plot Dimensions
                        </label>
                        <select 
                            value={houseFilters.plotDimensions || 'all'}
                            onChange={(e) => setHouseFilters(f => ({ ...f, plotDimensions: e.target.value }))}
                            className="w-full bg-white dark:bg-gray-850 border border-gray-200 dark:border-gray-750 rounded-xl p-3 font-semibold text-xs text-gray-700 dark:text-gray-300 outline-none focus:border-[#4CAF50]"
                        >
                            <option value="all">Any Dimensions</option>
                            <option value="30x40">30x40 ft (1200 sq ft)</option>
                            <option value="40x60">40x60 ft (2400 sq ft)</option>
                            <option value="50x80">50x80 ft (4000 sq ft)</option>
                        </select>
                    </div>

                    {/* Garden space */}
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.15em] flex items-center gap-1.5">
                            <Trees size={13} className="text-[#4CAF50]" /> Garden Space
                        </label>
                        <div className="flex gap-2">
                          {['all', 'Yes', 'No'].map(opt => (
                              <Button 
                                  key={opt} 
                                  variant="filter" 
                                  active={(houseFilters.garden || 'all') === opt}
                                  onClick={() => setHouseFilters(f => ({ ...f, garden: opt }))}
                                  className="flex-1 py-2 rounded-lg font-bold text-[10px]"
                              >
                                  {opt === 'all' ? 'Any' : opt}
                              </Button>
                          ))}
                        </div>
                    </div>

                    {/* Vastu Orientation */}
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.15em] flex items-center gap-1.5">
                            <Compass size={13} className="text-[#4CAF50]" /> Vastu Orientation
                        </label>
                        <select 
                            value={houseFilters.vastu || 'all'}
                            onChange={(e) => setHouseFilters(f => ({ ...f, vastu: e.target.value }))}
                            className="w-full bg-white dark:bg-gray-850 border border-gray-200 dark:border-gray-750 rounded-xl p-3 font-semibold text-xs text-gray-700 dark:text-gray-300 outline-none focus:border-[#4CAF50]"
                        >
                            <option value="all">Any Orientation</option>
                            <option value="East Facing">East Facing</option>
                            <option value="North Facing">North Facing</option>
                            <option value="West Facing">West Facing</option>
                            <option value="South Facing">South Facing</option>
                            <option value="Vastu Compliant">100% Vastu Compliant</option>
                        </select>
                    </div>
                  </>
                ) : (
                  // Apartment Filters
                  <>
                    {/* Floors filter */}
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.15em] flex items-center gap-1.5">
                            <Building size={13} className="text-[#4CAF50]" /> Building Floors
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                            {['all', '8', '9', '10'].map(num => (
                                <Button 
                                    key={num} 
                                    variant="filter" 
                                    active={apartmentFilters.floors === num}
                                    onClick={() => setApartmentFilters(f => ({ ...f, floors: num }))}
                                    className="py-2.5 rounded-xl font-bold text-xs"
                                >
                                    {num === 'all' ? 'All' : `${num} F`}
                                </Button>
                            ))}
                        </div>
                    </div>

                    {/* Units Count */}
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.15em] flex items-center gap-1.5">
                            <Layers size={13} className="text-[#4CAF50]" /> Total Units Count
                        </label>
                        <select 
                            value={apartmentFilters.unitsCount}
                            onChange={(e) => setApartmentFilters(f => ({ ...f, unitsCount: e.target.value }))}
                            className="w-full bg-white dark:bg-gray-850 border border-gray-200 dark:border-gray-750 rounded-xl p-3 font-semibold text-xs text-gray-700 dark:text-gray-300 outline-none focus:border-[#4CAF50]"
                        >
                            <option value="all">Any Units Size</option>
                            <option value="<50">Below 50 Units</option>
                            <option value="50-80">50 – 80 Units</option>
                            <option value=">80">Above 80 Units</option>
                        </select>
                    </div>

                    {/* Units per floor */}
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.15em] flex items-center gap-1.5">
                            <Layout size={13} className="text-[#4CAF50]" /> Units Per Floor
                        </label>
                        <div className="flex gap-2">
                          {['all', '4-5', '6+'].map(opt => (
                              <Button 
                                  key={opt} 
                                  variant="filter" 
                                  active={apartmentFilters.unitsPerFloor === opt}
                                  onClick={() => setApartmentFilters(f => ({ ...f, unitsPerFloor: opt }))}
                                  className="flex-1 py-2 rounded-lg font-bold text-[10px]"
                              >
                                  {opt === 'all' ? 'Any' : `${opt} Units`}
                              </Button>
                          ))}
                        </div>
                    </div>

                    {/* Built up area */}
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.15em] flex items-center gap-1.5">
                            <Maximize2 size={13} className="text-[#4CAF50]" /> Built-up Area Size
                        </label>
                        <select 
                            value={apartmentFilters.area}
                            onChange={(e) => setApartmentFilters(f => ({ ...f, area: e.target.value }))}
                            className="w-full bg-white dark:bg-gray-850 border border-gray-200 dark:border-gray-750 rounded-xl p-3 font-semibold text-xs text-gray-700 dark:text-gray-300 outline-none focus:border-[#4CAF50]"
                        >
                            <option value="all">Any Project Area</option>
                            <option value="<30k">Below 30,000 sq ft</option>
                            <option value="30k-50k">30,000 – 50,000 sq ft</option>
                            <option value=">50k">Above 50,000 sq ft</option>
                        </select>
                    </div>

                    {/* Apartment budget */}
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.15em] flex items-center gap-1.5">
                            <CreditCard size={13} className="text-[#4CAF50]" /> Construction Budget
                        </label>
                        <select 
                            value={apartmentFilters.budget}
                            onChange={(e) => setApartmentFilters(f => ({ ...f, budget: e.target.value }))}
                            className="w-full bg-white dark:bg-gray-850 border border-gray-200 dark:border-gray-750 rounded-xl p-3 font-semibold text-xs text-gray-700 dark:text-gray-300 outline-none focus:border-[#4CAF50]"
                        >
                            <option value="all">Any Budget</option>
                            <option value="<10Cr">Below ₹10 Crores</option>
                            <option value="10Cr-15Cr">₹10 Crores – ₹15 Crores</option>
                            <option value=">15Cr">Above ₹15 Crores</option>
                        </select>
                    </div>

                    {/* Balcony */}
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.15em] flex items-center gap-1.5">
                            <Umbrella size={13} className="text-[#4CAF50]" /> Balcony Option
                        </label>
                        <div className="flex gap-2">
                          {['all', 'With Balcony', 'Without Balcony'].map(opt => (
                              <Button 
                                  key={opt} 
                                  variant="filter" 
                                  active={apartmentFilters.balcony === opt}
                                  onClick={() => setApartmentFilters(f => ({ ...f, balcony: opt }))}
                                  className="flex-1 py-2.5 rounded-xl font-bold text-xs"
                              >
                                  {opt === 'all' ? 'Any' : opt.replace(' Balcony', '')}
                              </Button>
                          ))}
                        </div>
                    </div>
                  </>
                )}
            </div>
        </aside>

        {/* Catalog and Map Panels */}
        <main className="flex-1 px-4 md:px-12 pb-24">
            <div className="max-w-6xl mx-auto">
                
                {/* Header Information */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12 pt-4">
                    <div>
                        <button 
                            onClick={() => { setSelection('none'); setPage(1); }}
                            className="group flex items-center gap-1.5 text-gray-400 hover:text-[#4CAF50] transition-colors mb-3 font-black uppercase text-[10px] tracking-widest"
                        >
                            <ArrowRight size={13} className="rotate-180 group-hover:-translate-x-1 transition-transform" /> 
                            Back to Selection
                        </button>
                        <h2 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight leading-none mb-2.5">
                            {selection === 'house' ? 'House Blueprint Hub' : 'Apartment Structure Hub'}
                        </h2>
                        <p className="text-xs md:text-sm text-gray-500 font-medium">Explore {filteredPlans.length} AI-optimized construction configurations</p>
                    </div>
                    
                    <div className="flex gap-3">
                        <Button 
                          variant="secondary" 
                          className="rounded-xl px-5 py-2.5 text-xs xl:hidden"
                          onClick={() => {
                            // Mobile filters modal trigger mockup
                            alert("Advanced Filters drawer opens here on responsive views");
                          }}
                        >
                            <SlidersHorizontal size={14} /> Filters
                        </Button>
                    </div>
                </div>

                {activeTab === 'plans' ? (
                  // PLANS CATALOG TAB
                  <>
                    {/* Recommended for You section */}
                    <AnimatePresence>
                        {search === '' && page === 1 && recommendations.length > 0 && (
                            <motion.div 
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mb-16"
                            >
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 bg-[#4CAF50]/15 rounded-lg flex items-center justify-center text-[#4CAF50]">
                                            <Sparkles size={16} />
                                        </div>
                                        <h3 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white tracking-tight">Recommended for You</h3>
                                    </div>
                                    <div className="h-[1px] flex-1 bg-gradient-to-r from-[#4CAF50]/20 to-transparent mx-6"></div>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {recommendations.map(plan => (
                                        <DesignCard 
                                            key={plan.id} 
                                            plan={plan} 
                                            onOpen={setSelectedPlan}
                                            isFavorite={favorites.includes(plan.id)}
                                            toggleFavorite={toggleFavorite}
                                        />
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Catalog Listings grid */}
                    <div className="flex items-center gap-2 mb-8">
                        <h3 className="text-lg md:text-xl font-black text-gray-900 dark:text-white tracking-tight">Browse All Designs</h3>
                        <div className="text-[9px] font-black bg-gray-100 dark:bg-gray-850 px-2.5 py-1 rounded text-gray-500 uppercase tracking-widest">{filteredPlans.length} plans</div>
                    </div>

                    {isLoading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {currentPagePlans.map((plan) => (
                                    <DesignCard 
                                        key={plan.id} 
                                        plan={plan} 
                                        onOpen={setSelectedPlan} 
                                        isFavorite={favorites.includes(plan.id)}
                                        toggleFavorite={toggleFavorite}
                                    />
                                ))}
                            </div>

                            {filteredPlans.length === 0 && (
                                <div className="flex flex-col items-center justify-center py-28 border border-dashed border-gray-200 dark:border-gray-800 rounded-[2.5rem] bg-white dark:bg-transparent">
                                    <div className="w-20 h-20 bg-gray-50 dark:bg-gray-900/50 rounded-full flex items-center justify-center text-gray-300 dark:text-gray-700 mb-6">
                                        <Search size={36} />
                                    </div>
                                    <h3 className="text-xl font-black dark:text-white mb-2">No matching blueprints found</h3>
                                    <p className="text-xs text-gray-500 font-medium mb-6">Try clearing your filters or testing other criteria.</p>
                                    <Button 
                                        variant="outline" 
                                        onClick={() => { 
                                          setSearch(''); 
                                          setHouseFilters({ floors: 'all', area: 'all', budget: 'all', balcony: 'all', bedrooms: 'all', kitchen: 'all', dining: 'all', parking: 'all', waterFacility: 'all' });
                                          setApartmentFilters({ floors: 'all', unitsCount: 'all', area: 'all', budget: 'all', unitsPerFloor: 'all', balcony: 'all' });
                                        }}
                                        className="px-8 py-3.5"
                                    >
                                        Clear all filters
                                    </Button>
                                </div>
                            )}

                            {filteredPlans.length > currentPagePlans.length && (
                                <div className="mt-14 flex justify-center">
                                    <Button 
                                        variant="secondary" 
                                        onClick={() => setPage(p => p + 1)}
                                        className="px-10 py-3.5 rounded-2xl group border font-bold text-sm"
                                    >
                                        Load More Designs
                                        <Plus size={16} className="group-hover:rotate-90 transition-transform duration-300" />
                                    </Button>
                                </div>
                            )}
                        </>
                    )}
                  </>
                ) : (
                  // MAP LOCATION PLANNING TAB
                  <div className="bg-white dark:bg-[#131313] p-6 md:p-8 rounded-[2.5rem] border border-gray-150 dark:border-gray-850 shadow-xl space-y-8">
                      <div className="grid lg:grid-cols-12 gap-8 items-stretch">
                         <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
                             <div className="space-y-4">
                                 <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#4CAF50]/15 border border-[#4CAF50]/20 text-[#4CAF50] font-black text-[9px] uppercase tracking-widest w-fit">
                                     <MapPin size={11} className="text-[#4CAF50]" /> Interactive Site Planning
                                 </div>
                                 <h2 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white leading-tight">Select your construction location</h2>
                                 <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
                                     Click on the map to set your site location. The platform will analyze boundaries, orientations, and proximity of road, water, parks, and school infrastructures.
                                 </p>
                             </div>

                             <div className="space-y-3.5">
                                 {[
                                     { icon: <Info size={14} />, text: 'Plot boundary: 40ft x 60ft (Vastu Zone)', color: 'text-amber-500' },
                                     { icon: <Activity size={14} />, text: 'Soil Profile: Heavy Clayey (3-story safe load)', color: 'text-emerald-500' },
                                     { icon: <Droplet size={14} />, text: 'Water Grid: Municipal Pipeline and Sump Access ready', color: 'text-blue-500' }
                                 ].map((item, i) => (
                                     <div key={i} className="flex items-center gap-3 text-xs font-semibold text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-850 p-3 rounded-xl border border-gray-100/50 dark:border-gray-800">
                                         <span className={item.color}>{item.icon}</span>
                                         {item.text}
                                     </div>
                                 ))}
                             </div>

                             <div className="bg-gray-50 dark:bg-gray-850 p-4 rounded-xl border border-gray-150 dark:border-gray-800">
                                 <span className="text-[9px] font-black uppercase text-gray-400 tracking-wider block mb-2">Location Coordinate Details</span>
                                 <div className="flex gap-3 text-center">
                                     <div className="flex-1 bg-white dark:bg-[#1C1C1C] p-2.5 rounded-lg border border-gray-100 dark:border-gray-800">
                                         <span className="text-[8px] uppercase text-gray-400 font-bold block mb-0.5">LATITUDE</span>
                                         <span className="text-sm font-mono font-bold text-[#4CAF50]">{userLocation[0].toFixed(5)}</span>
                                     </div>
                                     <div className="flex-1 bg-white dark:bg-[#1C1C1C] p-2.5 rounded-lg border border-gray-100 dark:border-gray-800">
                                         <span className="text-[8px] uppercase text-gray-400 font-bold block mb-0.5">LONGITUDE</span>
                                         <span className="text-sm font-mono font-bold text-[#4CAF50]">{userLocation[1].toFixed(5)}</span>
                                     </div>
                                 </div>
                             </div>
                         </div>
                         
                         <div className="lg:col-span-7 h-[420px] rounded-[2rem] overflow-hidden border border-gray-150 dark:border-gray-800 relative shadow-inner">
                             <MapContainer center={userLocation} zoom={16} style={{ height: '100%', width: '100%' }}>
                                 <TileLayer
                                     url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                 />
                                 <MapEvents />
                                 
                                 {/* Current plot center */}
                                 <Marker position={userLocation}>
                                     <Popup>
                                       <div className="text-xs font-bold font-sans">
                                         <h4>Proposed Site</h4>
                                         <p>{mapAddress}</p>
                                       </div>
                                     </Popup>
                                 </Marker>
                                 
                                 {/* Selected area boundary */}
                                 <Polygon 
                                    positions={plotBoundary}
                                    pathOptions={{ color: '#4CAF50', fillColor: '#4CAF50', fillOpacity: 0.2, weight: 3 }}
                                 >
                                    <Tooltip sticky>Mock Plot Boundary (40x60)</Tooltip>
                                 </Polygon>

                                 {/* Infrastructure Lines */}
                                 <Polyline 
                                    positions={roadCoordinates}
                                    pathOptions={{ color: '#666', weight: 8, opacity: 0.8 }}
                                 >
                                    <Tooltip sticky>Main Access Road</Tooltip>
                                 </Polyline>

                                 <Polyline 
                                    positions={waterLineCoordinates}
                                    pathOptions={{ color: '#2196F3', weight: 4, dashArray: '5, 10', opacity: 0.7 }}
                                 >
                                    <Tooltip sticky>Municipal Water Mainline</Tooltip>
                                 </Polyline>

                                 {/* Nearby Park Marker */}
                                 <Circle 
                                    center={[userLocation[0] + 0.0006, userLocation[1] + 0.0008]}
                                    radius={40}
                                    pathOptions={{ color: '#81C784', fillColor: '#4CAF50', fillOpacity: 0.3 }}
                                 >
                                    <Popup><span className="text-xs font-bold font-sans">Zoning Park Area</span></Popup>
                                 </Circle>

                                 {/* Nearby School Marker */}
                                 <Marker position={[userLocation[0] - 0.0007, userLocation[1] - 0.0012]}>
                                    <Popup><span className="text-xs font-bold font-sans">Public High School Zone</span></Popup>
                                 </Marker>
                             </MapContainer>

                             <div className="absolute bottom-5 left-5 z-[400] bg-white/95 dark:bg-gray-900/95 p-3 rounded-xl shadow-lg flex items-center gap-2 border border-gray-100 dark:border-gray-800">
                                 <Compass className="text-[#4CAF50] animate-spin" style={{ animationDuration: '6s' }} size={16} />
                                 <span className="text-[10px] font-black dark:text-white uppercase tracking-wider">Zoning Overlay Active</span>
                             </div>
                         </div>
                      </div>
                  </div>
                )}
            </div>
        </main>
      </div>

      {/* Rich Details / 3D Walkthrough Modal */}
      {/* Rich Details / 3D Walkthrough Modal */}
      <AnimatePresence>
        {selectedPlan && customizedPlan && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 md:p-6 overflow-y-auto">
            {/* Dark Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPlan(null)}
              className="absolute inset-0 bg-black/85 backdrop-blur-md"
            ></motion.div>
            
            {/* Modal Body */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.96, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 15 }}
              className="bg-white dark:bg-[#0c0c0c] w-full max-w-7xl rounded-[2.5rem] overflow-hidden shadow-2xl relative z-10 flex flex-col h-full max-h-[95vh] border border-gray-150 dark:border-gray-850"
            >
              {/* Close Button */}
              <button 
                onClick={() => setSelectedPlan(null)}
                className="absolute top-6 right-6 z-[60] w-10 h-10 bg-black/40 hover:bg-black/60 rounded-xl transition-all text-white flex items-center justify-center border border-white/10"
              >
                <X size={20} />
              </button>

              {/* Scrollable Content Wrapper */}
              <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-10 scrollbar-thin">
                
                {/* Two Column Section: Layout/Visualizer (Left) vs Customizer (Right) */}
                <div className="grid lg:grid-cols-12 gap-8 items-start">
                  
                  {/* Left Column: Visualizers & Elevation Previews */}
                  <div className="lg:col-span-7 space-y-6">
                    {/* Header */}
                    <div className="space-y-2">
                      <div className="inline-flex items-center gap-1.5 bg-[#4CAF50]/10 border border-[#4CAF50]/20 text-[#4CAF50] px-3 py-1 rounded-lg text-[10px] font-black w-fit uppercase tracking-wider">
                         <Sparkles size={12} /> Dynamic Procedural Engine Active
                      </div>
                      <h2 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white tracking-tight leading-tight">
                        {customizedPlan.title}
                      </h2>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                        {customizedPlan.category} style elevation • {customizedPlan.plotFit}
                      </p>
                    </div>

                    {/* Image & Blueprints tabs */}
                    <div className="bg-gray-50 dark:bg-gray-950/40 border dark:border-gray-850 p-4 rounded-3xl space-y-4">
                      {/* Interactive Blueprint and Water utilities */}
                      <BlueprintVisualizer plan={customizedPlan} />
                    </div>

                    {/* Exterior & Interior Gallery */}
                    <div className="space-y-3">
                      <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Procedural Elevation & Previews</h4>
                      <div className="grid grid-cols-4 md:grid-cols-7 gap-2">
                        {customizedPlan.gallery?.map((img, i) => {
                          const labels = ["Elevation", "Living", "Bedroom", "Kitchen", "Dining", "Balcony", "Bathroom"];
                          return (
                            <div 
                              key={i} 
                              className="group relative h-16 rounded-xl overflow-hidden border border-gray-150 dark:border-gray-850 hover:border-[#4CAF50] transition-all cursor-pointer shadow-sm"
                              onClick={() => {
                                // Update main preview image
                                setCustomizedPlan(prev => prev ? { ...prev, image: img } : null);
                              }}
                            >
                              <img src={img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" alt={labels[i]} />
                              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="text-[8px] font-black text-white uppercase tracking-wider">{labels[i] || "View"}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Customizer Panel & Specs summary */}
                  <div className="lg:col-span-5 space-y-6">
                    <CustomizationPanel 
                      plan={customizedPlan} 
                      onUpdate={handleCustomizedPlanUpdate} 
                      onReset={() => {
                        setCustomizedPlan(selectedPlan);
                        setVariations(generateVariations(selectedPlan, 3));
                      }} 
                    />

                    {/* AI Recommendation & Details Box */}
                    <div className="bg-gradient-to-br from-[#121212] to-[#1d1d1d] p-6 rounded-3xl text-white border border-white/5 relative overflow-hidden shadow-xl">
                      <div className="absolute -top-6 -right-6 w-24 h-24 bg-[#4CAF50]/15 blur-2xl rounded-full"></div>
                      <div className="relative z-10 space-y-3">
                        <div className="flex items-center gap-1.5">
                          <Sparkles className="text-[#4CAF50] animate-pulse" size={16} />
                          <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#4CAF50]">Procedural Site Analysis</span>
                        </div>
                        
                        {customizedPlan.type === 'house' ? (
                          <div className="space-y-3">
                            <h5 className="text-sm font-black tracking-tight text-white">Vastu & Site Clearance</h5>
                            <ul className="text-[11px] text-gray-400 font-medium space-y-1.5 list-disc pl-4 leading-relaxed">
                              <li>Orientation aligned for {customizedPlan.vastuPreference}.</li>
                              <li>Plumbing layout places underground sump in pure zone.</li>
                              <li>Overhead tank correctly loads structural SW column nodes.</li>
                              <li>Fitted with {customizedPlan.balconyStyle?.toLowerCase() || 'standard balcony'}.</li>
                            </ul>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            <h5 className="text-sm font-black tracking-tight text-white">Apartment Feasibility</h5>
                            <ul className="text-[11px] text-gray-400 font-medium space-y-1.5 list-disc pl-4 leading-relaxed">
                              <li>Mix distributions suggest {customizedPlan.unitsMix || 'Standard units layout'}.</li>
                              <li>Lifts count satisfies building clearance metrics (Safety Factor 1.5).</li>
                              <li>Rainwater harvest capacity calculated at 45,000 Liters run-off.</li>
                              <li>STP filtration recycler layout handles graywater discharge.</li>
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Footer CTAs */}
                    <div className="flex gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                      <Button 
                        variant="primary" 
                        className="flex-[2] py-4 text-xs rounded-xl font-bold flex items-center justify-center gap-1.5 shadow-md shadow-[#4CAF50]/20"
                        onClick={() => {
                          alert(`Custom blueprint brochure generated for ${customizedPlan.title}! Download starting...`);
                        }}
                      >
                         <Download size={15} /> Download Blueprints
                      </Button>
                      <button 
                        onClick={() => toggleFavorite(customizedPlan.id)}
                        className={`flex-1 rounded-xl transition-all border flex items-center justify-center ${
                          favorites.includes(customizedPlan.id) 
                          ? 'bg-[#ff4b4b] border-transparent text-white shadow-md' 
                          : 'border-gray-200 dark:border-gray-850 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800'
                        }`}
                      >
                       <Heart size={18} fill={favorites.includes(customizedPlan.id) ? 'currentColor' : 'none'} />
                      </button>
                      <Button 
                        variant="secondary" 
                        className="flex-1 rounded-xl flex items-center justify-center"
                        onClick={() => {
                          alert(`Connecting you to construction partners for ${customizedPlan.title}...`);
                        }}
                      >
                         <PhoneCall size={15} />
                      </Button>
                    </div>

                  </div>
                </div>

                {/* Bottom Section: Dynamic Variations Grid */}
                {variations.length > 0 && (
                  <div className="space-y-4 pt-6 border-t border-gray-150 dark:border-gray-800">
                    <div>
                      <h3 className="text-base font-black text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                        <Sparkles size={16} className="text-[#4CAF50]" /> AI Regenerated Variations
                      </h3>
                      <p className="text-[10px] text-gray-400 font-bold">
                        Procedural modifications in roof, facade, and styling matching your active customization. Click to load variation as active.
                      </p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-4">
                      {variations.map((v) => (
                        <div 
                          key={v.id} 
                          onClick={() => {
                            setCustomizedPlan(v);
                            setVariations(generateVariations(v, 3));
                          }}
                          className="bg-gray-50 dark:bg-gray-900/40 border border-gray-150 dark:border-gray-850 p-4 rounded-3xl hover:border-[#4CAF50] transition-all cursor-pointer group shadow-sm flex flex-col justify-between"
                        >
                          <div className="space-y-3">
                            <div className="relative h-28 rounded-2xl overflow-hidden shadow-sm">
                              <img src={v.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" alt={v.title} />
                              <div className="absolute top-2 right-2 bg-black/60 border border-white/10 px-2 py-0.5 rounded text-[8px] font-black uppercase text-[#4CAF50]">
                                ₹{v.cost >= 10000000 ? `${(v.cost / 10000000).toFixed(2)} Cr` : `${(v.cost / 100000).toFixed(0)}L`}
                              </div>
                            </div>
                            <div>
                              <h4 className="font-extrabold text-xs text-gray-900 dark:text-white line-clamp-1">{v.title}</h4>
                              <p className="text-[9px] text-gray-400 font-semibold mt-0.5">{v.style} Style</p>
                            </div>
                          </div>
                          <div className="mt-3 pt-2 border-t border-gray-200 dark:border-gray-800 flex justify-between items-center text-[8px] font-bold text-gray-400 uppercase">
                            <span>{v.roofStyle.split(' ')[0]} Roof</span>
                            <span className="text-[#4CAF50] group-hover:underline flex items-center gap-0.5">Load Plan <ArrowRight size={10} /></span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Styled Footer */}
      <footer className="py-16 bg-white dark:bg-[#080808] border-t border-gray-100 dark:border-gray-900 mt-16">
        <div className="max-w-6xl mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
                <div>
                    <BrandLogo />
                    <p className="text-xs text-gray-500 max-w-sm mt-4 leading-relaxed font-semibold">
                        SaaS architecture and structural planning dashboard using simulated MERN data and custom Vastu integrations.
                    </p>
                </div>
                <div className="flex gap-12 text-xs font-bold text-gray-500">
                    <div className="space-y-3">
                        <span className="text-[9px] font-black text-[#4CAF50] uppercase tracking-wider block">Platform</span>
                        <ul className="space-y-1.5 font-semibold">
                            <li className="hover:text-[#4CAF50] cursor-pointer">Blueprints Catalog</li>
                            <li className="hover:text-[#4CAF50] cursor-pointer">Zoning Overlay</li>
                            <li className="hover:text-[#4CAF50] cursor-pointer">Estimator API</li>
                        </ul>
                    </div>
                    <div className="space-y-3">
                        <span className="text-[9px] font-black text-[#4CAF50] uppercase tracking-wider block">Connect</span>
                        <ul className="space-y-1.5 font-semibold">
                            <li className="hover:text-[#4CAF50] cursor-pointer">Local Architects</li>
                            <li className="hover:text-[#4CAF50] cursor-pointer">Help Center</li>
                            <li className="hover:text-[#4CAF50] cursor-pointer">Documentation</li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className="mt-12 pt-8 border-t border-gray-100 dark:border-gray-900 text-center">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">© 2026 Archint. Developed for Advanced Architectural SaaS.</p>
            </div>
        </div>
      </footer>
    </div>
  );
};
