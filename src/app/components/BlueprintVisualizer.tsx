import React, { useState } from 'react';
import { 
  Compass, 
  Layers, 
  Droplet, 
  Sparkles, 
  Tv, 
  Bed, 
  Utensils, 
  Car, 
  ChefHat, 
  Bath, 
  Trees, 
  BookOpen, 
  ArrowRight,
  Info,
  Activity
} from 'lucide-react';
import { PlanData } from '../data/plans_rich';
import { SketchSheetVisualizer } from './archint/SketchSheetVisualizer';

interface VisualizerProps {
  plan: PlanData;
}

export const BlueprintVisualizer: React.FC<VisualizerProps> = ({ plan }) => {
  const [activeFloor, setActiveFloor] = useState<string>(
    plan.floorPlan ? Object.keys(plan.floorPlan)[0] : 'Ground Floor'
  );
  const [viewMode, setViewMode] = useState<'blueprint' | 'plumbing' | 'sketch'>('sketch');

  const floorKeys = plan.floorPlan ? Object.keys(plan.floorPlan).filter(k => plan.floorPlan![k].length > 0) : [];

  // Procedural Room Coordinates/Dimensions for the 2D SVG layout
  // Houses layout: Grid representation
  const renderHouseBlueprint = () => {
    // Generate static rooms based on the active plan parameters
    const rooms = [];
    
    if (activeFloor === 'Ground Floor') {
      rooms.push({ name: 'Foyer / Living Area', size: "16' x 18'", grid: 'col-span-8 row-span-6 bg-slate-800/40 border-slate-600', icon: <Tv className="text-[#4CAF50]" size={16} /> });
      
      // Kitchen Placement (Vastu dependent)
      const isAgni = plan.kitchenPlacement?.includes('Agni') || plan.kitchenPlacement?.includes('South-East');
      rooms.push({ 
        name: `Kitchen (${plan.kitchen})`, 
        size: "10' x 12'", 
        grid: isAgni ? 'col-span-4 row-span-4 col-start-9 row-start-1 bg-amber-950/20 border-amber-800/50' : 'col-span-4 row-span-4 col-start-1 row-start-7 bg-amber-950/20 border-amber-800/50', 
        icon: <ChefHat className="text-amber-500" size={16} /> 
      });

      // Dining Setup
      rooms.push({ 
        name: `Dining (${plan.dining})`, 
        size: "10' x 10'", 
        grid: isAgni ? 'col-span-4 row-span-2 col-start-9 row-start-5 bg-orange-950/10 border-orange-850' : 'col-span-4 row-span-2 col-start-5 row-start-7 bg-orange-950/10 border-orange-850', 
        icon: <Utensils className="text-orange-400" size={16} /> 
      });

      // Bedrooms
      rooms.push({ name: 'Bedroom 1', size: "12' x 12'", grid: 'col-span-4 row-span-4 col-start-1 row-start-7 bg-indigo-950/20 border-indigo-900/50', icon: <Bed className="text-indigo-400" size={16} /> });
      rooms.push({ name: 'Common Bath', size: "6' x 8'", grid: 'col-span-2 row-span-2 col-start-5 row-start-9 bg-teal-950/20 border-teal-900/50', icon: <Bath className="text-[#4CAF50]" size={14} /> });
      
      // Puja Room
      if (plan.pujaRoom) {
        rooms.push({ name: 'Puja Room', size: "6' x 6'", grid: 'col-span-2 row-span-2 col-start-7 row-start-9 bg-yellow-950/20 border-yellow-800/60', icon: <Sparkles className="text-yellow-400" size={14} /> });
      }
      
      // Parking & Garden
      if (plan.parking === 'Yes') {
        rooms.push({ name: `Car Parking (${plan.parkingLayout.split(' ')[0]} Driveway)`, size: "10' x 18'", grid: 'col-span-4 row-span-5 col-start-9 row-start-7 bg-emerald-950/10 border-emerald-900/30 border-dashed', icon: <Car className="text-emerald-500" size={16} /> });
      }
      if (plan.gardenSpace === 'Yes') {
        rooms.push({ name: `Garden (${plan.gardenLayout.split(' ')[0]} Lawn)`, size: "20' x 4'", grid: 'col-span-12 row-span-2 col-start-1 row-start-11 bg-green-950/20 border-green-800/30 border-dashed', icon: <Trees className="text-green-400" size={16} /> });
      }
    } else if (activeFloor === 'First Floor') {
      rooms.push({ name: 'Master Bedroom', size: "14' x 16'", grid: 'col-span-6 row-span-5 bg-indigo-950/35 border-indigo-700/50', icon: <Bed className="text-indigo-400" size={18} /> });
      rooms.push({ name: 'Attached Bath 1', size: "6' x 8'", grid: 'col-span-2 row-span-3 col-start-7 row-start-1 bg-teal-950/20 border-teal-900/50', icon: <Bath className="text-teal-400" size={14} /> });
      
      if (plan.bedrooms > 2) {
        rooms.push({ name: 'Kids Bedroom 2', size: "12' x 12'", grid: 'col-span-4 row-span-5 col-start-9 row-start-1 bg-purple-950/20 border-purple-900/50', icon: <Bed className="text-purple-400" size={16} /> });
      } else {
        rooms.push({ name: 'Guest Room', size: "10' x 12'", grid: 'col-span-4 row-span-5 col-start-9 row-start-1 bg-slate-900/30 border-slate-700/50', icon: <Bed className="text-slate-400" size={16} /> });
      }
      
      rooms.push({ name: 'Family Lounge', size: "14' x 10'", grid: 'col-span-8 row-span-3 col-start-1 row-start-6 bg-slate-800/40 border-slate-600', icon: <Tv className="text-[#4CAF50]" size={16} /> });
      
      if (plan.balcony === 'With Balcony' || plan.balcony === 'Multiple Balconies') {
        rooms.push({ name: `Balcony (${plan.balconyStyle.split(' ')[0]})`, size: "12' x 4'", grid: 'col-span-4 row-span-2 col-start-9 row-start-6 bg-cyan-950/20 border-cyan-800/40 border-dashed', icon: <Compass className="text-cyan-400" size={14} /> });
      }
      
      if (plan.studyRoom) {
        rooms.push({ name: 'Study Room', size: "8' x 8'", grid: 'col-span-4 row-span-3 col-start-9 row-start-8 bg-sky-950/20 border-sky-850', icon: <BookOpen className="text-sky-400" size={14} /> });
      }
    } else {
      // Second / Third Floor
      rooms.push({ name: 'Guest Room / Theatre', size: "16' x 14'", grid: 'col-span-8 row-span-6 bg-indigo-950/10 border-indigo-900/30', icon: <Tv className="text-indigo-400" size={18} /> });
      rooms.push({ name: 'Open Terrace Lounge', size: "20' x 16'", grid: 'col-span-4 row-span-8 col-start-9 row-start-1 bg-orange-950/5 border-orange-900/30 border-dashed', icon: <Compass className="text-orange-400" size={16} /> });
      rooms.push({ name: 'Gym / Utility Space', size: "12' x 8'", grid: 'col-span-8 row-span-4 col-start-1 row-start-7 bg-slate-900/30 border-slate-700/40', icon: <Activity className="text-rose-400" size={16} /> });
    }

    return (
      <div className="grid grid-cols-12 grid-rows-12 gap-2 w-full h-[400px] bg-slate-950/80 p-4 rounded-3xl border border-slate-800 relative font-mono text-[10px] text-slate-300">
        {/* Architectural Grid Line overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:24px_24px] opacity-15 pointer-events-none rounded-3xl"></div>
        
        {/* Directions indicator */}
        <div className="absolute top-4 right-4 z-10 bg-slate-900/80 border border-slate-700 px-2 py-1 rounded-lg flex items-center gap-1.5 font-sans font-bold text-[9px] uppercase tracking-wider text-slate-400 shadow-md">
          <Compass size={11} className="text-[#4CAF50] animate-pulse" />
          {plan.vastuPreference.split(' ')[0]} Entrance
        </div>

        {rooms.map((room, idx) => (
          <div 
            key={idx} 
            className={`border rounded-xl p-3 flex flex-col justify-between backdrop-blur-sm shadow-md transition-all hover:scale-[1.01] hover:shadow-lg ${room.grid}`}
          >
            <div className="flex items-start justify-between gap-1">
              <span className="font-sans font-extrabold text-white text-xs leading-none line-clamp-2">{room.name}</span>
              {room.icon}
            </div>
            <div className="flex justify-between items-end text-[9px] text-slate-400">
              <span className="font-mono bg-slate-900/60 px-1.5 py-0.5 rounded border border-slate-800">{room.size}</span>
              {idx === 0 && <span className="text-[8px] text-[#4CAF50] uppercase tracking-widest font-sans font-bold">Staircase: {plan.staircaseLocation.split(' ')[0]}</span>}
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Apartment Tower Layout: Grid representation
  const renderApartmentBlueprint = () => {
    const rooms = [];
    
    if (activeFloor.includes('Basement')) {
      rooms.push({ name: 'DG Generator Bay (100% Backup)', size: "18' x 24'", grid: 'col-span-4 row-span-5 bg-rose-950/20 border-rose-900/50', icon: <Activity className="text-rose-500" size={16} /> });
      rooms.push({ name: 'STP Control Plant (Recycling)', size: "20' x 24'", grid: 'col-span-4 row-span-5 col-start-5 bg-blue-950/25 border-blue-900/50', icon: <Droplet className="text-blue-400" size={16} /> });
      rooms.push({ name: 'Water Filtration Sump', size: "12' x 16'", grid: 'col-span-4 row-span-4 col-start-9 bg-cyan-950/20 border-cyan-900/40', icon: <Droplet className="text-cyan-400" size={16} /> });
      rooms.push({ name: 'Mechanical Stack Parking A', size: "40' x 20'", grid: 'col-span-6 row-span-7 col-start-1 row-start-6 bg-slate-900/40 border-slate-800 border-dashed', icon: <Car className="text-slate-400" size={16} /> });
      rooms.push({ name: 'Mechanical Stack Parking B', size: "40' x 20'", grid: 'col-span-6 row-span-7 col-start-7 row-start-6 bg-slate-900/40 border-slate-800 border-dashed', icon: <Car className="text-slate-400" size={16} /> });
    } else if (activeFloor.includes('Ground')) {
      rooms.push({ name: 'Double Height Grand Foyer Lobby', size: "24' x 24'", grid: 'col-span-6 row-span-6 bg-slate-800/40 border-slate-600', icon: <Sparkles className="text-yellow-400" size={16} /> });
      rooms.push({ name: 'Security CCTV HQ & Desk', size: "10' x 12'", grid: 'col-span-3 row-span-3 col-start-7 bg-slate-900/60 border-slate-700', icon: <Tv className="text-[#4CAF50]" size={16} /> });
      rooms.push({ name: 'Association Board Room', size: "12' x 12'", grid: 'col-span-3 row-span-3 col-start-10 bg-slate-900/30 border-slate-800', icon: <BookOpen className="text-slate-400" size={16} /> });
      rooms.push({ name: 'Kids Indoor Activity Playroom', size: "18' x 16'", grid: 'col-span-6 row-span-6 col-start-7 row-start-4 bg-emerald-950/20 border-emerald-900/50', icon: <Trees className="text-emerald-500" size={16} /> });
      rooms.push({ name: 'Passenger Lift A & B Foyer', size: "8' x 16'", grid: 'col-span-3 row-span-6 col-start-1 row-start-7 bg-indigo-950/20 border-indigo-900/50', icon: <Layers className="text-indigo-400" size={16} /> });
      rooms.push({ name: 'Fire Escape Staircase A', size: "8' x 16'", grid: 'col-span-3 row-span-6 col-start-4 row-start-7 bg-slate-900/50 border-slate-800', icon: <Compass className="text-slate-500" size={14} /> });
    } else {
      // Typical Floor Layout
      const uCount = plan.unitsPerFloor || 6;
      rooms.push({ name: `Lifts & Escalator Hub (Lifts: ${plan.liftCount || 2})`, size: "Core Area", grid: 'col-span-4 row-span-4 col-start-5 row-start-5 bg-indigo-950/30 border-indigo-800', icon: <Layers className="text-indigo-400" size={16} /> });
      rooms.push({ name: 'Central Distribution Corridor (8ft wide)', size: "Connecting Hall", grid: 'col-span-12 row-span-2 col-start-1 row-start-9 bg-slate-900/60 border-slate-800', icon: <Compass className="text-slate-500" size={14} /> });
      
      // Units spread
      rooms.push({ name: 'Unit A - 3BHK Suite', size: "1450 sqft", grid: 'col-span-4 row-span-4 col-start-1 row-start-1 bg-emerald-950/20 border-emerald-800/40', icon: <Bed className="text-emerald-400" size={16} /> });
      rooms.push({ name: 'Unit B - 2BHK Suite', size: "1100 sqft", grid: 'col-span-4 row-span-4 col-start-9 row-start-1 bg-cyan-950/20 border-cyan-800/40', icon: <Bed className="text-cyan-400" size={16} /> });
      rooms.push({ name: 'Unit C - 2BHK Suite', size: "1050 sqft", grid: 'col-span-4 row-span-4 col-start-1 row-start-5 bg-teal-950/20 border-teal-800/40', icon: <Bed className="text-teal-400" size={16} /> });
      rooms.push({ name: 'Unit D - 3BHK Suite', size: "1400 sqft", grid: 'col-span-4 row-span-4 col-start-9 row-start-5 bg-purple-950/20 border-purple-800/40', icon: <Bed className="text-purple-400" size={16} /> });
      rooms.push({ name: 'Unit E - 1BHK Studio', size: "650 sqft", grid: 'col-span-6 row-span-2 col-start-1 row-start-11 bg-orange-950/15 border-orange-900/30', icon: <Bed className="text-orange-400" size={14} /> });
      rooms.push({ name: 'Unit F - 2BHK Suite', size: "1150 sqft", grid: 'col-span-6 row-span-2 col-start-7 row-start-11 bg-slate-900/30 border-slate-700/40', icon: <Bed className="text-slate-400" size={14} /> });
    }

    return (
      <div className="grid grid-cols-12 grid-rows-12 gap-2 w-full h-[400px] bg-slate-950/80 p-4 rounded-3xl border border-slate-800 relative font-mono text-[10px] text-slate-300">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:24px_24px] opacity-15 pointer-events-none rounded-3xl"></div>
        
        {rooms.map((room, idx) => (
          <div 
            key={idx} 
            className={`border rounded-xl p-3 flex flex-col justify-between backdrop-blur-sm shadow-md transition-all hover:scale-[1.01] hover:shadow-lg ${room.grid}`}
          >
            <div className="flex items-start justify-between gap-1">
              <span className="font-sans font-extrabold text-white text-xs leading-none line-clamp-2">{room.name}</span>
              {room.icon}
            </div>
            <div className="flex justify-between items-end text-[9px] text-slate-400">
              <span className="font-mono bg-slate-900/60 px-1.5 py-0.5 rounded border border-slate-800">{room.size}</span>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Plumbing & Water Utilities Layout
  const renderPlumbingLayout = () => {
    return (
      <div className="relative w-full h-[400px] bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden p-6 font-mono text-xs text-white">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#111827_1px,transparent_1px),linear-gradient(to_bottom,#111827_1px,transparent_1px)] bg-[size:20px_20px] opacity-20 pointer-events-none"></div>

        {/* 2D isometric layout diagram of plumbing connections */}
        <div className="absolute inset-0 flex items-center justify-center">
          <svg className="w-full h-full max-h-[350px] drop-shadow-[0_0_15px_rgba(33,150,243,0.15)]" viewBox="0 0 500 300">
            {/* Draw Site boundary */}
            <rect x="50" y="30" width="400" height="240" rx="15" fill="none" stroke="#334155" strokeWidth="2.5" strokeDasharray="6,4" />
            <text x="60" y="50" fill="#64748b" className="text-[8px] font-sans font-black tracking-widest uppercase">Plot Boundary Limit</text>

            {/* Vastu Grid indicators */}
            <line x1="250" y1="30" x2="250" y2="270" stroke="#1e293b" strokeWidth="1" strokeDasharray="2,2" />
            <line x1="50" y1="150" x2="450" y2="150" stroke="#1e293b" strokeWidth="1" strokeDasharray="2,2" />
            <text x="255" y="45" fill="#334155" className="text-[8px] font-sans font-bold">NORTH</text>
            <text x="255" y="265" fill="#334155" className="text-[8px] font-sans font-bold">SOUTH</text>
            <text x="55" y="158" fill="#334155" className="text-[8px] font-sans font-bold">WEST</text>
            <text x="415" y="158" fill="#334155" className="text-[8px] font-sans font-bold">EAST</text>

            {/* Draw water utility components */}
            {/* 1. Borewell in NE corner */}
            <circle cx="410" cy="60" r="14" fill="#1e3a8a" stroke="#3b82f6" strokeWidth="2" className="animate-pulse" />
            <circle cx="410" cy="60" r="4" fill="#60a5fa" />
            <text x="350" y="82" fill="#93c5fd" className="text-[9px] font-bold">BOREWELL (North-East)</text>

            {/* 2. Underground Sump in East zone */}
            <rect x="360" y="120" width="30" height="24" rx="4" fill="#0f172a" stroke="#2563eb" strokeWidth="2" />
            <path d="M365 125h20v14H365z" fill="#1e40af" />
            <text x="315" y="154" fill="#93c5fd" className="text-[9px] font-bold">UG SUMP (East)</text>

            {/* 3. Overhead Tank in SW rooftop */}
            <circle cx="90" cy="230" r="18" fill="#172554" stroke="#1d4ed8" strokeWidth="2.5" />
            <circle cx="90" cy="230" r="10" fill="#1e40af" />
            <text x="115" y="234" fill="#93c5fd" className="text-[9px] font-bold">O.H. TANK (South-West)</text>

            {/* 4. Rainwater Harvesting pit in NE Front */}
            <circle cx="410" cy="230" r="12" fill="#064e3b" stroke="#10b981" strokeWidth="2" />
            <text x="310" y="246" fill="#6ee7b7" className="text-[9px] font-bold">RWH RECHARGE PIT</text>

            {/* 5. Septic Tank in NW corner */}
            <rect x="80" y="60" width="36" height="20" rx="3" fill="#450a0a" stroke="#ef4444" strokeWidth="2" />
            <text x="122" y="72" fill="#fca5a5" className="text-[9px] font-bold">SEPTIC TANK (North-West)</text>

            {/* Connection Pipes */}
            {/* Borewell -> UG Sump */}
            <path d="M410 74 v46" fill="none" stroke="#2563eb" strokeWidth="1.5" strokeDasharray="3,3" className="stroke-blue-500 animate-[dash_10s_linear_infinite]" style={{ strokeDashoffset: 100 }} />
            
            {/* UG Sump -> Overhead Tank (Main Lift Line) */}
            <path d="M360 132 H 210 V 230 H 108" fill="none" stroke="#2563eb" strokeWidth="2" strokeDasharray="4,4" />
            
            {/* RWH Inflow lines */}
            <path d="M410 218 v-10" fill="none" stroke="#10b981" strokeWidth="1" strokeDasharray="2,2" />
            
            {/* Sewage Line (House Outlet -> Septic Tank) */}
            <path d="M190 120 H 98 V 80" fill="none" stroke="#b91c1c" strokeWidth="1.5" strokeDasharray="3,3" />

            <style>{`
              @keyframes dash {
                to {
                  stroke-dashoffset: 0;
                }
              }
            `}</style>
          </svg>
        </div>

        {/* Legend overlays */}
        <div className="absolute bottom-4 left-4 right-4 bg-slate-900/90 border border-slate-800 p-3.5 rounded-2xl flex flex-wrap justify-between items-center gap-3 text-[10px] font-sans font-semibold text-slate-400 shadow-lg z-10">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-600 block shadow-md shadow-blue-500/30"></span> Potable Water</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-600 block shadow-md shadow-emerald-500/30"></span> Harvesting Inflow</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-600 block shadow-md shadow-red-500/30"></span> Waste Drainage</span>
          </div>
          <span className="text-[9px] font-black text-[#4CAF50] bg-[#4CAF50]/10 px-2 py-0.5 rounded uppercase tracking-wider">Vastu Plumb Configured</span>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-800 pb-3">
        <div className="flex gap-2">
          <button 
            onClick={() => setViewMode('sketch')} 
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${viewMode === 'sketch' ? 'bg-[#4CAF50] text-white' : 'bg-gray-100 dark:bg-gray-850 text-gray-600 dark:text-gray-400 hover:bg-gray-200'}`}
          >
            ✏️ Hand-Drawn Pencil Sketch Sheet
          </button>
          <button 
            onClick={() => setViewMode('blueprint')} 
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${viewMode === 'blueprint' ? 'bg-[#4CAF50] text-white' : 'bg-gray-100 dark:bg-gray-850 text-gray-600 dark:text-gray-400 hover:bg-gray-200'}`}
          >
            2D CAD Blueprint
          </button>
          <button 
            onClick={() => setViewMode('plumbing')} 
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${viewMode === 'plumbing' ? 'bg-[#4CAF50] text-white' : 'bg-gray-100 dark:bg-gray-850 text-gray-600 dark:text-gray-400 hover:bg-gray-200'}`}
          >
            Water & Utility Planner
          </button>
        </div>

        {viewMode === 'blueprint' && floorKeys.length > 0 && (
          <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-850 p-1 rounded-xl border dark:border-gray-800">
            {floorKeys.map(floor => (
              <button 
                key={floor} 
                onClick={() => setActiveFloor(floor)} 
                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${activeFloor === floor ? 'bg-[#4CAF50] text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                {floor.replace('Floor', 'F')}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="relative">
        {viewMode === 'sketch' ? (
          <SketchSheetVisualizer plan={plan} />
        ) : viewMode === 'blueprint' ? (
          plan.type === 'house' ? renderHouseBlueprint() : renderApartmentBlueprint()
        ) : (
          renderPlumbingLayout()
        )}
      </div>

      {/* Utilities Detailed Info Table */}
      {viewMode === 'plumbing' && (
        <div className="grid md:grid-cols-2 gap-4 text-xs font-sans text-gray-600 dark:text-gray-300">
          <div className="p-4 bg-gray-50 dark:bg-gray-900/40 border dark:border-gray-850 rounded-2xl space-y-3">
            <h5 className="font-black text-gray-900 dark:text-white flex items-center gap-1.5"><Droplet size={14} className="text-blue-500" /> Inlet Water Planning</h5>
            <ul className="space-y-2 font-medium">
              <li className="flex justify-between border-b dark:border-gray-850 pb-1.5">
                <span className="text-gray-400">Borewell Location:</span> <strong>{plan.borewellLocation || 'NE Corner'}</strong>
              </li>
              <li className="flex justify-between border-b dark:border-gray-850 pb-1.5">
                <span className="text-gray-400">Underground Sump:</span> <strong>{plan.undergroundSump || 'East/NE Zone'}</strong>
              </li>
              <li className="flex justify-between pb-1">
                <span className="text-gray-400">Overhead Storage:</span> <strong>{plan.overheadTank || 'SW Corner'}</strong>
              </li>
            </ul>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-900/40 border dark:border-gray-850 rounded-2xl space-y-3">
            <h5 className="font-black text-gray-900 dark:text-white flex items-center gap-1.5"><Compass size={14} className="text-[#4CAF50]" /> Outlet & Soil Utility Planning</h5>
            <ul className="space-y-2 font-medium">
              <li className="flex justify-between border-b dark:border-gray-850 pb-1.5">
                <span className="text-gray-400">Septic Tank placement:</span> <strong>{plan.septicTank || 'NW Boundary'}</strong>
              </li>
              <li className="flex justify-between border-b dark:border-gray-850 pb-1.5">
                <span className="text-gray-400">Drainage Runoff Slope:</span> <strong>{plan.drainageLayout || 'Towards NE Outlet'}</strong>
              </li>
              <li className="flex justify-between pb-1">
                <span className="text-gray-400">Washing Machine Utility:</span> <strong>{plan.washingArea || 'Rear Porch Area'}</strong>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
