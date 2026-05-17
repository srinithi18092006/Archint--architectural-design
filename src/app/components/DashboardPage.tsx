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
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { richMockPlans, PlanData } from '../data/plans_rich';
import { Logo as BrandLogo } from './Logo';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMapEvents } from 'react-leaflet';
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

// --- UI Components ---

const Button = ({ children, onClick, variant = 'primary', className = '', active = false }: any) => {
  const variants = {
    primary: 'bg-[#4CAF50] hover:bg-[#43a047] text-white shadow-lg shadow-[#4CAF50]/30',
    secondary: 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700',
    outline: 'border-2 border-[#4CAF50] text-[#4CAF50] hover:bg-[#4CAF50] hover:text-white',
    ghost: 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400',
    filter: active 
      ? 'bg-[#4CAF50] text-white border-transparent' 
      : 'bg-gray-50 dark:bg-gray-900 text-gray-600 dark:text-gray-400 border-gray-100 dark:border-gray-800 hover:border-[#4CAF50]/50',
  };
  return (
    <button 
      onClick={onClick} 
      className={`px-4 py-2.5 rounded-2xl transition-all duration-300 font-bold flex items-center justify-center gap-2 border ${variants[variant as keyof typeof variants]} ${className}`}
    >
      {children}
    </button>
  );
};

const SkeletonCard = () => (
  <div className="bg-white dark:bg-[#1A1A1A] rounded-[2.5rem] overflow-hidden shadow-xl border border-gray-100 dark:border-gray-800 p-4 animate-pulse">
    <div className="w-full h-56 bg-gray-200 dark:bg-gray-800 rounded-[2rem] mb-6"></div>
    <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded-full w-3/4 mb-4"></div>
    <div className="h-4 bg-gray-100 dark:bg-gray-900 rounded-full w-1/2 mb-8"></div>
    <div className="grid grid-cols-2 gap-4 mb-6">
      <div className="h-10 bg-gray-50 dark:bg-gray-900 rounded-xl"></div>
      <div className="h-10 bg-gray-50 dark:bg-gray-900 rounded-xl"></div>
    </div>
    <div className="h-12 bg-gray-200 dark:bg-gray-800 rounded-xl w-full"></div>
  </div>
);

const DesignCard = ({ plan, onOpen, isFavorite, toggleFavorite }: { plan: PlanData, onOpen: (p: PlanData) => void, isFavorite: boolean, toggleFavorite: (id: string, e: any) => void }) => {
  return (
    <motion.div 
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -10 }}
      className="bg-white dark:bg-[#1A1A1A] rounded-[2.5rem] overflow-hidden shadow-2xl border border-gray-100 dark:border-gray-800 group relative"
    >
      <div className="relative h-64 overflow-hidden p-3">
        <div className="w-full h-full rounded-[2rem] overflow-hidden relative">
          <img 
            src={plan.image} 
            alt={plan.title} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </div>
        
        <div className="absolute top-6 right-6 z-10">
          <button 
            onClick={(e) => toggleFavorite(plan.id, e)}
            className={`p-3 rounded-2xl backdrop-blur-xl border border-white/20 transition-all ${
              isFavorite ? 'bg-[#ff4b4b] text-white' : 'bg-black/20 text-white hover:bg-black/40'
            }`}
          >
            <Heart size={20} fill={isFavorite ? 'currentColor' : 'none'} strokeWidth={2.5} />
          </button>
        </div>
        
        {plan.isRecommended && (
          <div className="absolute top-6 left-6 bg-[#4CAF50] text-white px-4 py-1.5 rounded-full text-xs font-black flex items-center gap-1.5 shadow-xl border border-[#4CAF50]/50 backdrop-blur-md">
            <Sparkles size={14} /> AI RECOMMENDED
          </div>
        )}

        <div className="absolute bottom-6 left-8 text-white opacity-0 group-hover:opacity-100 group-hover:translate-y-0 translate-y-2 transition-all duration-500">
           <span className="text-sm font-bold bg-[#4CAF50] px-3 py-1 rounded-lg">₹{(plan.cost / 100000).toFixed(0)} Lakhs+</span>
        </div>
      </div>
      
      <div className="p-8 pt-2">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-black text-gray-900 dark:text-white group-hover:text-[#4CAF50] transition-colors line-clamp-1">{plan.title}</h3>
        </div>
        
        <div className="flex items-center gap-2 text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-6">
           <MapPin size={12} className="text-[#4CAF50]" />
           {plan.category}
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="flex flex-col gap-1 p-3 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800">
            <span className="text-[10px] uppercase font-black text-gray-400">Floors</span>
            <div className="flex items-center gap-2 font-black text-gray-900 dark:text-white">
              <Layers size={14} className="text-[#4CAF50]" /> {plan.floors}F
            </div>
          </div>
          <div className="flex flex-col gap-1 p-3 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800">
            <span className="text-[10px] uppercase font-black text-gray-400">Area (sq ft)</span>
            <div className="flex items-center gap-2 font-black text-gray-900 dark:text-white">
              <Maximize2 size={14} className="text-[#4CAF50]" /> {plan.area}
            </div>
          </div>
          <div className="flex flex-col gap-1 p-3 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800">
            <span className="text-[10px] uppercase font-black text-gray-400">Config</span>
            <div className="flex items-center gap-2 font-black text-gray-900 dark:text-white whitespace-nowrap">
              <Bed size={14} className="text-[#4CAF50]" /> {plan.bedrooms}BHK
            </div>
          </div>
          <div className="flex flex-col gap-1 p-3 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800">
            <span className="text-[10px] uppercase font-black text-gray-400">Balcony</span>
            <div className="flex items-center gap-2 font-black text-gray-900 dark:text-white">
              <Umbrella size={14} className="text-[#4CAF50]" /> {plan.balcony === 'With Balcony' ? 'YES' : 'NO'}
            </div>
          </div>
        </div>
        
        <Button 
          variant="primary" 
          className="w-full py-4 group/btn" 
          onClick={() => onOpen(plan)}
        >
          {plan.type === 'house' ? 'Explore Plan' : 'View Building'}
          <ArrowRight size={18} className="group-hover/btn:translate-x-2 transition-transform" />
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
  
  const [filters, setFilters] = useState({
    floors: 'all',
    area: 'all',
    budget: 'all',
    balcony: 'all',
    bedrooms: 'all',
    kitchen: 'all',
    parking: 'all'
  });
  
  const [favorites, setFavorites] = useState<string[]>(() => {
    return JSON.parse(localStorage.getItem('favs-smartai') || '[]');
  });
  
  const [selectedPlan, setSelectedPlan] = useState<PlanData | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [page, setPage] = useState(1);
  const itemsPerPage = 12;

  // Map state
  const [userLocation, setUserLocation] = useState<[number, number]>([12.9716, 77.5946]); // Bangalore default

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
        const timer = setTimeout(() => setIsLoading(false), 800);
        return () => clearTimeout(timer);
    }
  }, [selection, filters, debouncedSearch]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');
  
  const toggleFavorite = (id: string, e: any) => {
    e.stopPropagation();
    setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
  };

  const filteredPlans = useMemo(() => {
    if (selection === 'none') return [];
    
    return richMockPlans.filter(plan => {
      if (plan.type !== selection) return false;
      
      // Search
      if (debouncedSearch && !plan.title.toLowerCase().includes(debouncedSearch.toLowerCase())) return false;
      
      // Floors
      if (filters.floors !== 'all' && plan.floors.toString() !== filters.floors) return false;
      
      // Bedrooms
      if (filters.bedrooms !== 'all' && plan.bedrooms.toString() !== filters.bedrooms.replace('BHK', '')) return false;

      // Area
      if (filters.area !== 'all') {
        if (filters.area === '<1000' && plan.area >= 1000) return false;
        if (filters.area === '1000-1500' && (plan.area < 1000 || plan.area > 1500)) return false;
        if (filters.area === '1500-2500' && (plan.area < 1500 || plan.area > 2500)) return false;
        if (filters.area === '>2500' && plan.area <= 2500) return false;
      }

      // Budget (Basic Lakh logic)
      if (filters.budget !== 'all') {
        const costLakhs = plan.cost / 100000;
        if (filters.budget === '50-75L' && (costLakhs < 50 || costLakhs > 75)) return false;
        if (filters.budget === '75L-1Cr' && (costLakhs < 75 || costLakhs > 100)) return false;
        if (filters.budget === '1Cr+' && costLakhs <= 100) return false;
      }

      if (filters.balcony !== 'all' && plan.balcony !== filters.balcony) return false;
      if (filters.parking !== 'all' && plan.parking !== filters.parking) return false;

      return true;
    });
  }, [selection, debouncedSearch, filters]);

  const currentPagePlans = filteredPlans.slice(0, page * itemsPerPage);

  const recommendations = useMemo(() => {
    return richMockPlans.filter(p => p.isRecommended && p.type === selection).slice(0, 5);
  }, [selection]);

  const MapEvents = () => {
    useMapEvents({
      click(e) {
        setUserLocation([e.latlng.lat, e.latlng.lng]);
      },
    });
    return null;
  };

  if (selection === 'none') {
    return (
      <div className={`min-h-screen transition-colors duration-500 bg-[#F8FAFC] dark:bg-[#080808] flex flex-col`}>
        <nav className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-12 py-6 border-b border-gray-100 dark:border-gray-900 bg-white/50 dark:bg-black/50 backdrop-blur-xl">
           <BrandLogo />
           <div className="flex items-center gap-4">
              <Button variant="secondary" onClick={toggleTheme} className="rounded-full w-12 h-12 p-0 flex items-center justify-center">
                {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
              </Button>
           </div>
        </nav>

        <main className="flex-1 flex items-center justify-center px-6 pt-24 pb-12">
           <div className="max-w-6xl w-full">
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-16 space-y-4"
              >
                <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-[#4CAF50]/10 border border-[#4CAF50]/20 text-[#4CAF50] font-black text-xs uppercase tracking-[0.2em]">
                  <Sparkles size={14} /> AI-Powered Architecture
                </div>
                <h1 className="text-6xl md:text-8xl font-black text-gray-900 dark:text-white leading-[0.9] tracking-tighter">
                   What would you <br />
                   <span className="text-[#4CAF50] relative">
                     like to build?
                     <svg className="absolute -bottom-4 left-0 w-full h-8 text-[#4CAF50]/20 -z-10" viewBox="0 0 100 20" preserveAspectRatio="none">
                       <path d="M0 10 Q 25 20 50 10 T 100 10" stroke="currentColor" strokeWidth="8" fill="none" />
                     </svg>
                   </span>
                </h1>
                <p className="text-gray-500 dark:text-gray-400 text-lg md:text-xl font-medium max-w-2xl mx-auto pt-6">
                   Select a category to begin your intelligent construction journey. Our AI analyzes thousands of patterns to provide the perfect blueprint.
                </p>
              </motion.div>

              <div className="grid md:grid-cols-2 gap-10">
                <motion.div 
                  whileHover={{ scale: 1.02, y: -10 }}
                  whileTap={{ scale: 0.98 }}
                  className="group relative bg-white dark:bg-[#111] p-2 rounded-[3.5rem] shadow-2xl cursor-pointer border-2 border-transparent hover:border-[#4CAF50] transition-all"
                  onClick={() => setSelection('house')}
                >
                  <div className="relative overflow-hidden rounded-[3rem] h-[350px]">
                    <img src="https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110" alt="House" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-12">
                       <span className="text-sm font-black text-[#4CAF50] uppercase tracking-widest mb-2 flex items-center gap-2">
                         <Home size={16} /> Residential
                       </span>
                       <h2 className="text-4xl font-black text-white mb-4">Build a House</h2>
                       <p className="text-gray-300 text-lg font-medium leading-relaxed max-w-sm">
                         Custom villas, cottages, and family homes. 75+ AI-curated designs for modern living.
                       </p>
                    </div>
                  </div>
                  <div className="absolute top-10 right-10 w-16 h-16 bg-[#4CAF50] rounded-3xl flex items-center justify-center text-white shadow-xl opacity-0 group-hover:opacity-100 group-hover:translate-x-0 translate-x-4 transition-all">
                     <ArrowRight size={32} />
                  </div>
                </motion.div>

                <motion.div 
                  whileHover={{ scale: 1.02, y: -10 }}
                  whileTap={{ scale: 0.98 }}
                  className="group relative bg-white dark:bg-[#111] p-2 rounded-[3.5rem] shadow-2xl cursor-pointer border-2 border-transparent hover:border-[#4CAF50] transition-all"
                  onClick={() => setSelection('apartment')}
                >
                  <div className="relative overflow-hidden rounded-[3rem] h-[350px]">
                    <img src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110" alt="Apartment" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-12">
                       <span className="text-sm font-black text-blue-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                         <Building2 size={16} /> Commercial
                       </span>
                       <h2 className="text-4xl font-black text-white mb-4">Build an Apartment</h2>
                       <p className="text-gray-300 text-lg font-medium leading-relaxed max-w-sm">
                         High-rise complexes and multi-unit towers. 30+ Scalable architectural solutions.
                       </p>
                    </div>
                  </div>
                  <div className="absolute top-10 right-10 w-16 h-16 bg-[#4CAF50] rounded-3xl flex items-center justify-center text-white shadow-xl opacity-0 group-hover:opacity-100 group-hover:translate-x-0 translate-x-4 transition-all">
                     <ArrowRight size={32} />
                  </div>
                </motion.div>
              </div>
           </div>
        </main>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-500 bg-[#F8FAFC] dark:bg-[#0D0D0D]`}>
      
      {/* Search Header */}
      <nav className={`fixed top-0 left-0 w-full z-[60] transition-all duration-500 flex items-center justify-between px-6 md:px-12 py-5 ${
        isScrolled ? 'bg-white/80 dark:bg-[#121212]/80 backdrop-blur-2xl shadow-xl' : 'bg-transparent'
      }`}>
        <div className="cursor-pointer" onClick={() => setSelection('none')}>
          <BrandLogo />
        </div>

        <div className="hidden lg:flex flex-1 max-w-2xl mx-12 relative group">
          <div className="absolute inset-0 bg-[#4CAF50]/5 rounded-3xl blur-xl group-hover:bg-[#4CAF50]/10 transition-all"></div>
          <div className="relative w-full flex items-center">
            <Search className="absolute left-6 text-gray-400 group-focus-within:text-[#4CAF50] transition-colors" size={20} />
            <input 
              type="text" 
              placeholder={`Search for ${selection === 'house' ? 'dream homes' : 'premium apartments'}...`}
              className="w-full bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 rounded-3xl py-4 pl-16 pr-6 focus:ring-4 focus:ring-[#4CAF50]/10 focus:border-[#4CAF50] outline-none transition-all dark:text-white font-bold text-lg shadow-sm"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
            {search && (
                <button onClick={() => setSearch('')} className="absolute right-6 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
                    <X size={16} className="text-gray-400" />
                </button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-6">
          <button 
            onClick={toggleTheme}
            className="w-14 h-14 rounded-3xl bg-white dark:bg-gray-800 shadow-xl border border-gray-100 dark:border-gray-700 flex items-center justify-center dark:text-white hover:scale-110 active:scale-95 transition-all"
          >
            {theme === 'light' ? <Moon size={22} /> : <Sun size={22} />}
          </button>
          <div className="relative group">
            <div className="w-14 h-14 rounded-3xl bg-gradient-to-tr from-[#4CAF50] to-[#81C784] p-1 shadow-2xl shadow-[#4CAF50]/20 cursor-pointer overflow-hidden transform group-hover:rotate-12 transition-transform">
                <div className="w-full h-full rounded-[1.2rem] bg-white overflow-hidden">
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Architecture" alt="Avatar" className="w-full h-full" />
                </div>
            </div>
            {favorites.length > 0 && (
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center border-4 border-white dark:border-[#121212]">
                   {favorites.length}
                </div>
            )}
          </div>
        </div>
      </nav>

      <div className="flex pt-32 min-h-screen">
        
        {/* Sidebar Filters */}
        <aside className="hidden xl:block w-80 px-8 sticky top-32 h-[calc(100vh-8rem)] overflow-y-auto pb-12">
            <div className="space-y-10">
                <div className="flex items-center justify-between">
                    <h4 className="text-xl font-black text-gray-900 dark:text-white">Smart Filters</h4>
                    <button 
                        onClick={() => setFilters({ floors: 'all', area: 'all', budget: 'all', balcony: 'all', bedrooms: 'all', kitchen: 'all', parking: 'all' })}
                        className="text-xs font-black text-[#4CAF50] uppercase tracking-widest hover:opacity-60"
                    >
                        Reset
                    </button>
                </div>

                {/* Floors Filter */}
                <div className="space-y-4">
                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                        <Layers size={14} className="text-[#4CAF50]" /> Number of Floors
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                        {['all', '1', '2', '3', '4'].map(num => (
                            <Button 
                                key={num} 
                                variant="filter" 
                                active={filters.floors === num}
                                onClick={() => setFilters(f => ({ ...f, floors: num }))}
                                className="text-sm font-black rounded-xl py-3"
                            >
                                {num === 'all' ? 'All Floors' : `${num} Floors`}
                            </Button>
                        ))}
                    </div>
                </div>

                {/* Area Filter */}
                <div className="space-y-4">
                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                        <Maximize2 size={14} className="text-[#4CAF50]" /> Area Multiplier
                    </label>
                    <div className="flex flex-col gap-2">
                        {[
                            { label: 'Any Area', value: 'all' },
                            { label: 'Below 1000 sq ft', value: '<1000' },
                            { label: '1000-1500 sq ft', value: '1000-1500' },
                            { label: '1500-2500 sq ft', value: '1500-2500' },
                            { label: 'Above 2500 sq ft', value: '>2500' }
                        ].map(opt => (
                            <button
                                key={opt.value}
                                onClick={() => setFilters(f => ({ ...f, area: opt.value }))}
                                className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all group ${
                                    filters.area === opt.value 
                                    ? 'border-[#4CAF50] bg-[#4CAF50]/5 text-[#4CAF50]' 
                                    : 'border-gray-50 dark:border-gray-800 text-gray-500 hover:border-gray-200 dark:hover:border-gray-700'
                                }`}
                            >
                                <span className={`text-sm font-bold ${filters.area === opt.value ? 'text-[#4CAF50]' : 'text-gray-600 dark:text-gray-400'}`}>
                                    {opt.label}
                                </span>
                                {filters.area === opt.value && <Check size={16} />}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Bedrooms Filter */}
                <div className="space-y-4">
                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                        <Bed size={14} className="text-[#4CAF50]" /> Bedrooms (BHK)
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                        {['all', '1BHK', '2BHK', '3BHK', '4BHK', '5BHK'].map(opt => (
                            <Button 
                                key={opt} 
                                variant="filter" 
                                active={filters.bedrooms === opt}
                                onClick={() => setFilters(f => ({ ...f, bedrooms: opt }))}
                                className="text-xs font-black rounded-lg py-3"
                            >
                                {opt === 'all' ? 'Any' : opt}
                            </Button>
                        ))}
                    </div>
                </div>

                {/* Budget */}
                <div className="space-y-4">
                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                        <CreditCard size={14} className="text-[#4CAF50]" /> Budget Bracket
                    </label>
                    <select 
                        value={filters.budget}
                        onChange={(e) => setFilters(f => ({ ...f, budget: e.target.value }))}
                        className="w-full bg-gray-50 dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 rounded-2xl p-4 font-bold text-gray-700 dark:text-gray-300 outline-none focus:border-[#4CAF50]"
                    >
                        <option value="all">Any Budget</option>
                        <option value="50-75L">₹50 Lakhs – ₹75 Lakhs</option>
                        <option value="75L-1Cr">₹75 Lakhs – ₹1 Crore</option>
                        <option value="1Cr+">₹1 Crore+</option>
                    </select>
                </div>
            </div>
        </aside>

        {/* Listings Content */}
        <main className="flex-1 px-6 md:px-12 pb-24">
            <div className="max-w-7xl mx-auto">
                
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-16">
                    <div>
                        <button 
                            onClick={() => setSelection('none')}
                            className="group flex items-center gap-2 text-gray-400 hover:text-[#4CAF50] transition-colors mb-4 font-black uppercase text-[10px] tracking-[0.2em]"
                        >
                            <ArrowRight size={14} className="rotate-180 group-hover:-translate-x-1 transition-transform" /> 
                            Back to Selection
                        </button>
                        <h2 className="text-5xl font-black text-gray-900 dark:text-white tracking-tighter leading-none mb-2">
                            {selection === 'house' ? 'Discovery: Modern Houses' : 'Architectural Peaks'}
                        </h2>
                        <p className="text-gray-500 font-medium">{filteredPlans.length} plans available for your requirements</p>
                    </div>
                    
                    <div className="flex gap-4">
                        <Button variant="secondary" className="rounded-2xl px-6">
                            <SlidersHorizontal size={18} /> Filters
                        </Button>
                        <div className="flex bg-white dark:bg-gray-800 p-1.5 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700">
                             <button className="p-3 bg-gray-50 dark:bg-gray-900 rounded-xl text-[#4CAF50]"><Layout size={20} /></button>
                             <button className="p-3 text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900 rounded-xl"><Maximize2 size={20} /></button>
                        </div>
                    </div>
                </div>

                {/* AI Recommendations */}
                <AnimatePresence>
                    {search === '' && page === 1 && recommendations.length > 0 && (
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-20"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-[#4CAF50]/10 rounded-xl flex items-center justify-center text-[#4CAF50]">
                                        <Sparkles size={24} />
                                    </div>
                                    <h3 className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter">Recommended for You</h3>
                                </div>
                                <div className="h-[2px] flex-1 bg-gradient-to-r from-[#4CAF50]/20 to-transparent mx-10"></div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-10">
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

                {/* Main Listings Grid */}
                <div className="flex items-center gap-3 mb-10">
                    <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Browse All Plans</h3>
                    <div className="text-[10px] font-black bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded text-gray-500 uppercase tracking-widest">{filteredPlans.length} FOUND</div>
                </div>

                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-10">
                        {Array.from({ length: 9 }).map((_, i) => <SkeletonCard key={i} />)}
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-10">
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
                            <div className="flex flex-col items-center justify-center py-40 border-4 border-dashed border-gray-100 dark:border-gray-900 rounded-[5rem]">
                                <div className="w-32 h-32 bg-gray-50 dark:bg-gray-800/50 rounded-full flex items-center justify-center text-gray-300 dark:text-gray-700 mb-8 border-2 border-gray-100 dark:border-gray-800">
                                    <Search size={56} />
                                </div>
                                <h3 className="text-3xl font-black dark:text-white mb-2 tracking-tight">No designs match your criteria</h3>
                                <p className="text-gray-500 font-medium mb-10">Try adjusting your filters or search keywords.</p>
                                <Button 
                                    variant="outline" 
                                    onClick={() => { setSearch(''); setFilters({ floors: 'all', area: 'all', budget: 'all', balcony: 'all', bedrooms: 'all', kitchen: 'all', parking: 'all' }); }}
                                    className="px-10 py-5 text-lg"
                                >
                                    Clear all filters
                                </Button>
                            </div>
                        )}

                        {filteredPlans.length > currentPagePlans.length && (
                            <div className="mt-20 flex justify-center">
                                <Button 
                                    variant="secondary" 
                                    onClick={() => setPage(p => p + 1)}
                                    className="px-12 py-5 text-xl rounded-[2rem] border-2 group"
                                >
                                    Load More Designs
                                    <Plus size={24} className="group-hover:rotate-180 transition-transform duration-500" />
                                </Button>
                            </div>
                        )}
                    </>
                )}

                {/* Map Section */}
                <div className="mt-32">
                    <div className="bg-gray-900 dark:bg-black p-12 rounded-[5rem] text-white relative overflow-hidden shadow-2xl">
                         <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-[#4CAF50]/10 to-transparent"></div>
                         <div className="relative z-10 grid lg:grid-cols-2 gap-16 items-center">
                            <div className="space-y-8">
                                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-white font-black text-[10px] uppercase tracking-widest">
                                    <MapPin size={14} className="text-[#4CAF50]" /> Interactive Site Planning
                                </div>
                                <h2 className="text-5xl font-black tracking-tighter leading-none">Select Your <br /> Construction Location</h2>
                                <p className="text-gray-400 text-lg font-medium leading-relaxed">
                                    Tell us where you're building. Our AI analyzes soil data, municipal codes, and nearby infrastructure to suggest the best orientation for your selected plan.
                                </p>
                                
                                <div className="flex flex-col gap-4">
                                    {[
                                        { icon: <Info size={16} />, text: 'Real-time plot boundary calculation' },
                                        { icon: <Check size={16} />, text: 'Nearby utility connection check' },
                                        { icon: <Droplet size={16} />, text: 'Water table & drainage analysis' }
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center gap-3 text-sm font-bold text-gray-300">
                                            <div className="w-8 h-8 rounded-full bg-[#4CAF50]/20 flex items-center justify-center text-[#4CAF50]">{item.icon}</div>
                                            {item.text}
                                        </div>
                                    ))}
                                </div>

                                <div className="bg-white/5 p-6 rounded-3xl border border-white/10">
                                    <span className="text-[10px] font-black uppercase text-gray-500 tracking-widest block mb-4">Selected Coordinates</span>
                                    <div className="flex gap-4">
                                        <div className="flex-1 bg-black/40 p-4 rounded-xl border border-white/10">
                                            <span className="text-[10px] uppercase text-gray-600 font-bold block mb-1">LATITUDE</span>
                                            <span className="text-lg font-mono font-black text-[#4CAF50]">{userLocation[0].toFixed(4)}</span>
                                        </div>
                                        <div className="flex-1 bg-black/40 p-4 rounded-xl border border-white/10">
                                            <span className="text-[10px] uppercase text-gray-600 font-bold block mb-1">LONGITUDE</span>
                                            <span className="text-lg font-mono font-black text-[#4CAF50]">{userLocation[1].toFixed(4)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="h-[500px] rounded-[3.5rem] overflow-hidden border-8 border-white/5 relative shadow-3xl">
                                <MapContainer center={userLocation} zoom={13} style={{ height: '100%', width: '100%' }}>
                                    <TileLayer
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    />
                                    <MapEvents />
                                    <Marker position={userLocation}>
                                        <Popup>Your Construction Site</Popup>
                                    </Marker>
                                    <Circle 
                                        center={userLocation} 
                                        radius={500}
                                        pathOptions={{ fillColor: '#4CAF50', color: '#4CAF50', opacity: 0.3, fillOpacity: 0.1 }}
                                    />
                                </MapContainer>
                                <div className="absolute top-6 left-6 z-[400] bg-white dark:bg-gray-900 p-4 rounded-2xl shadow-xl flex items-center gap-3">
                                    <Navigation className="text-[#4CAF50] animate-pulse" size={20} />
                                    <span className="text-xs font-black dark:text-white uppercase tracking-widest">Live Plot Analysis Active</span>
                                </div>
                            </div>
                         </div>
                    </div>
                </div>
            </div>
        </main>
      </div>

      {/* Rich Details Modal */}
      <AnimatePresence>
        {selectedPlan && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPlan(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-2xl"
            ></motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 50 }}
              className="bg-white dark:bg-[#121212] w-full max-w-7xl rounded-[4rem] overflow-hidden shadow-3xl relative z-10 flex flex-col lg:flex-row h-full max-h-[90vh] border border-white/10"
            >
              <button 
                onClick={() => setSelectedPlan(null)}
                className="absolute top-8 right-8 z-[50] w-14 h-14 bg-black/20 dark:bg-black/40 backdrop-blur-xl hover:bg-black/60 rounded-3xl transition-all text-white flex items-center justify-center"
              >
                <X size={28} />
              </button>

              {/* Left Side: Media & Gallery */}
              <div className="lg:w-3/5 h-[40vh] lg:h-auto border-r border-gray-100 dark:border-gray-800 flex flex-col">
                <div className="flex-1 relative group overflow-hidden">
                    <img src={selectedPlan.image} alt={selectedPlan.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-12">
                         <div className="inline-flex items-center gap-2 bg-[#4CAF50] text-white px-4 py-1.5 rounded-full text-xs font-black mb-4 w-fit">
                            <Sparkles size={14} /> AI 3D RENDER READY
                         </div>
                         <h2 className="text-5xl font-black text-white tracking-tighter mb-4">{selectedPlan.title}</h2>
                         <div className="flex flex-wrap gap-4">
                            {['Exterior View', '3D Walkthrough', 'Structure Analysis'].map(tag => (
                                <span key={tag} className="px-4 py-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 text-white text-[10px] font-black uppercase tracking-widest">{tag}</span>
                            ))}
                         </div>
                    </div>
                </div>
                {/* Secondary Gallery */}
                <div className="h-40 bg-gray-50 dark:bg-gray-900 flex p-4 gap-4 overflow-x-auto border-t border-gray-100 dark:border-gray-800">
                    {selectedPlan.gallery?.map((img, i) => (
                        <div key={i} className="flex-shrink-0 w-32 rounded-2xl overflow-hidden border-2 border-transparent hover:border-[#4CAF50] cursor-pointer transition-all">
                            <img src={img} className="w-full h-full object-cover" alt="Interior" />
                        </div>
                    ))}
                    <div className="flex-shrink-0 w-32 rounded-2xl bg-white dark:bg-gray-800 flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-200 dark:border-gray-700 text-gray-400 group cursor-pointer hover:border-[#4CAF50] hover:text-[#4CAF50] transition-all">
                        <Plus size={20} />
                        <span className="text-[10px] font-black uppercase tracking-tighter">View All (12)</span>
                    </div>
                </div>
              </div>

              {/* Right Side: Info & Tabs */}
              <div className="lg:w-2/5 p-10 overflow-y-auto bg-white dark:bg-[#0F0F0F] flex flex-col">
                <div className="flex-1">
                    <div className="flex items-center justify-between mb-8">
                        <div className="space-y-1">
                           <span className="text-[10px] font-black text-[#4CAF50] uppercase tracking-[0.3em]">Estimated Total Cost</span>
                           <h3 className="text-4xl font-black text-gray-900 dark:text-white">₹{(selectedPlan.cost / 100000).toFixed(0)} Lakhs</h3>
                        </div>
                        <div className="flex flex-col items-end">
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Plot Fit</span>
                            <span className="text-lg font-black dark:text-gray-200">{selectedPlan.plotFit || '30x40 Min'}</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-10">
                        <div className="p-6 rounded-[2rem] bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 space-y-2">
                           <Layers className="text-[#4CAF50]" size={24} />
                           <div>
                              <div className="text-2xl font-black dark:text-white">{selectedPlan.floors}F</div>
                              <div className="text-[10px] uppercase font-black text-gray-400">Total Floors</div>
                           </div>
                        </div>
                        <div className="p-6 rounded-[2rem] bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 space-y-2">
                           <Maximize2 className="text-[#4CAF50]" size={24} />
                           <div>
                              <div className="text-2xl font-black dark:text-white">{selectedPlan.area}</div>
                              <div className="text-[10px] uppercase font-black text-gray-400">Sq. Feet Area</div>
                           </div>
                        </div>
                    </div>

                    {/* Planning Tabs */}
                    <div className="space-y-8">
                        <div>
                            <h4 className="flex items-center gap-2 text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest mb-4">
                               <Monitor size={18} className="text-[#4CAF50]" /> Floor-wise Planning
                            </h4>
                            <div className="space-y-4">
                                {selectedPlan.floorPlan && Object.entries(selectedPlan.floorPlan).map(([floor, features]) => (
                                    <div key={floor} className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-3xl border border-gray-100 dark:border-gray-800">
                                        <div className="font-black text-gray-900 dark:text-white mb-3 flex justify-between items-center">
                                            {floor}
                                            <span className="text-[10px] font-black text-[#4CAF50] bg-[#4CAF50]/10 px-2 py-0.5 rounded uppercase">Standard Layout</span>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {features.map(f => (
                                                <span key={f} className="text-xs bg-white dark:bg-black px-3 py-1.5 rounded-xl border border-gray-200 dark:border-gray-700 dark:text-gray-400 font-bold">{f}</span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h4 className="flex items-center gap-2 text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest mb-4">
                               <Droplet size={18} className="text-blue-500" /> Utility & Water Facilities
                            </h4>
                            <div className="grid grid-cols-2 gap-3">
                                {selectedPlan.waterFacility.map(item => (
                                    <div key={item} className="p-4 rounded-2xl bg-blue-50/30 dark:bg-blue-900/10 border border-blue-100/50 dark:border-blue-900/20 flex items-center gap-3">
                                        <Check size={14} className="text-blue-500" />
                                        <span className="text-xs font-bold dark:text-gray-300">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* AI Suggestion Box */}
                        <div className="bg-gradient-to-br from-[#111] to-[#222] p-8 rounded-[2.5rem] text-white overflow-hidden relative border border-white/5">
                            <div className="absolute -top-4 -right-4 w-24 h-24 bg-[#4CAF50]/20 blur-3xl rounded-full"></div>
                            <div className="relative z-10">
                                <div className="flex items-center gap-2 mb-4">
                                   <Sparkles className="text-[#4CAF50]" size={20} />
                                   <span className="text-[10px] font-black uppercase tracking-[0.3em]">AI Architect Suggestion</span>
                                </div>
                                <h5 className="text-xl font-black mb-2 tracking-tight">Optimized for {selectedPlan.plotFit || 'Standard Plot'}</h5>
                                <p className="text-gray-400 text-sm font-medium leading-relaxed">
                                   This design features a high-ventilation central core. Best suited for {selectedPlan.familyType || 'Modern Families'}. We recommend placing the {selectedPlan.waterFacility[0] || 'Overhead Tank'} on the North-East side for optimal pressure.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer CTAs */}
                <div className="mt-12 flex gap-4 pt-8 border-t border-gray-100 dark:border-gray-800">
                   <Button variant="primary" className="flex-[2] py-5 text-lg rounded-[2rem]">
                      <Download size={20} /> Download PDF Brochure
                   </Button>
                   <button 
                    onClick={(e) => toggleFavorite(selectedPlan.id, e)}
                    className={`flex-1 rounded-[2rem] transition-all border-2 flex items-center justify-center ${
                      favorites.includes(selectedPlan.id) 
                      ? 'bg-[#ff4b4b] border-[#ff4b4b] text-white' 
                      : 'border-gray-200 dark:border-gray-800 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                   >
                    <Heart size={24} fill={favorites.includes(selectedPlan.id) ? 'currentColor' : 'none'} />
                   </button>
                   <Button variant="secondary" className="flex-1 rounded-[2rem]">
                      <PhoneCall size={20} />
                   </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <footer className="py-24 bg-white dark:bg-[#050505] border-t border-gray-100 dark:border-gray-900 mt-20">
        <div className="max-w-7xl mx-auto px-12">
            <div className="flex flex-col md:flex-row justify-between items-center gap-12">
                <div className="text-center md:text-left">
                    <BrandLogo />
                    <p className="text-gray-400 dark:text-gray-600 font-medium max-w-sm mt-6 leading-relaxed">
                        The world's leading AI-powered architectural planning platform for modern builders and selective homeowners.
                    </p>
                </div>
                <div className="flex gap-16">
                    <div className="space-y-4">
                        <span className="text-[10px] font-black text-[#4CAF50] uppercase tracking-widest">Platform</span>
                        <ul className="space-y-2 font-bold text-gray-500 text-sm">
                            <li className="hover:text-[#4CAF50] cursor-pointer">Architecture Hub</li>
                            <li className="hover:text-[#4CAF50] cursor-pointer">AI Generator</li>
                            <li className="hover:text-[#4CAF50] cursor-pointer">Cost Estimator</li>
                        </ul>
                    </div>
                    <div className="space-y-4">
                        <span className="text-[10px] font-black text-[#4CAF50] uppercase tracking-widest">Connect</span>
                        <ul className="space-y-2 font-bold text-gray-500 text-sm">
                            <li className="hover:text-[#4CAF50] cursor-pointer">Support</li>
                            <li className="hover:text-[#4CAF50] cursor-pointer">Partners</li>
                            <li className="hover:text-[#4CAF50] cursor-pointer">Documentation</li>
                        </ul>
                    </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-4">Subscribe to AI Updates</span>
                    <div className="flex gap-2">
                        <input className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-2 font-bold text-sm outline-none" placeholder="Email Address" />
                        <button className="bg-[#4CAF50] text-white p-3 rounded-xl hover:scale-105 transition-transform"><Plus size={18} /></button>
                    </div>
                </div>
            </div>
            <div className="mt-20 pt-10 border-t border-gray-100 dark:border-gray-900 text-center">
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest">© 2026 Archint. All rights reserved. Intellectual Property of Google DeepMind AI Team.</p>
            </div>
        </div>
      </footer>
    </div>
  );
};
