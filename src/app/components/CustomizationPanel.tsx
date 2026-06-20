import React from 'react';
import { 
  Plus, 
  Minus, 
  Sparkles, 
  RotateCcw,
  Sliders
} from 'lucide-react';
import { PlanData } from '../data/plans_rich';

interface CustomizationPanelProps {
  plan: PlanData;
  onUpdate: (updatedPlan: PlanData) => void;
  onReset: () => void;
}

export const CustomizationPanel: React.FC<CustomizationPanelProps> = ({ 
  plan, 
  onUpdate, 
  onReset 
}) => {
  
  // Recalculates cost and area based on modified parameters
  const recalculateSpecs = (updates: Partial<PlanData>) => {
    const updated = { ...plan, ...updates };
    
    if (updated.type === 'house') {
      // Base cost factors: area and floors
      const baseArea = 700 + (updated.floors * 500) + (updated.bedrooms * 200);
      updated.area = updates.area !== undefined ? updates.area : baseArea;
      
      let baseCost = 3500000 + (updated.floors * 1800000) + (updated.bedrooms * 600000) + (updated.bathrooms * 200000);
      
      // Feature modifiers
      if (updated.kitchen === 'Modular Kitchen') baseCost += 350000;
      if (updated.kitchen === 'Open Kitchen') baseCost += 150000;
      if (updated.dining === 'Separate Dining') baseCost += 200000;
      if (updated.balcony === 'With Balcony') baseCost += 250000;
      if (updated.balcony === 'Multiple Balconies') baseCost += 450000;
      if (updated.parking === 'Yes') baseCost += 400000;
      if (updated.gardenSpace === 'Yes') baseCost += 200000;
      if (updated.studyRoom) baseCost += 300000;
      if (updated.pujaRoom) baseCost += 120000;
      if (updated.utilityRoom) baseCost += 150000;
      
      updated.cost = baseCost;

      // Dynamically update the procedural description & floor plan text
      updated.description = `Customized ${updated.floors}-floor ${updated.bedrooms}BHK residence. Designed with a ${updated.kitchen} and a ${updated.dining} setup. Features ${updated.balcony.toLowerCase()} and Vastu entrance alignment.`;

      // Update floor plan structure dynamically
      const floorPlan: { [key: string]: string[] } = {};
      floorPlan['Ground Floor'] = [
        'Front Entrance Veranda', 
        'Spacious Foyer & Living Area', 
        '1 Bedroom (Vastu West)', 
        '1 Common Bathroom',
        updated.kitchenPlacement || 'South-East (Agni corner) Vastu Zone',
        updated.diningArrangement || 'Combined Open Living + Dining Area'
      ];
      if (updated.parking === 'Yes') floorPlan['Ground Floor'].push(updated.parkingLayout || 'Front Portico Covered Garage');
      if (updated.gardenSpace === 'Yes') floorPlan['Ground Floor'].push(updated.gardenLayout || 'Lush Front Turf Lawn');

      if (updated.floors > 1) {
        floorPlan['First Floor'] = [
          `${Math.max(updated.bedrooms - 1, 1)} Master Bedrooms with En-suite Baths`, 
          'Cozy Family Lounge'
        ];
        if (updated.balcony !== 'Without Balcony') floorPlan['First Floor'].push(updated.balconyStyle || 'Cantilevered Frameless Glass Balcony');
        if (updated.studyRoom) floorPlan['First Floor'].push('Dedicated Study / Library space');
        if (updated.pujaRoom) floorPlan['First Floor'].push('Separate Puja Room space');
      }
      if (updated.floors > 2) {
        floorPlan['Second Floor'] = [
          'Guest Bedroom with Attached Bath', 
          'Home Theatre Lounge', 
          'Open Sky Terrace Deck'
        ];
      }
      if (updated.floors > 3) {
        floorPlan['Third Floor'] = [
          'Rooftop Green Garden sit-out', 
          'Solar Canopy Grid Layout', 
          'Utility Water Storage Room'
        ];
      }
      updated.floorPlan = floorPlan;

    } else {
      // Apartments recalculation
      const unitsPerFloor = updated.unitsPerFloor || 6;
      const floors = updated.floors || 8;
      const totalUnits = floors * unitsPerFloor;
      updated.units = totalUnits;
      
      const baseArea = totalUnits * 900;
      updated.area = updates.area !== undefined ? updates.area : baseArea;
      
      let baseCost = 40000000 + (totalUnits * 3200000) + ((updated.liftCount || 2) * 2500000);
      if (updated.parking === 'Yes') baseCost += 15000000;
      if (updated.balcony === 'With Balcony') baseCost += 8000000;
      
      updated.cost = baseCost;
      updated.description = `Premium customized ${floors}-floor apartment tower consisting of ${totalUnits} total units (${unitsPerFloor} units/floor). Includes ${updated.liftCount} lift shafts and stilt stack parking facilities.`;

      // Update apartment floor plan
      const floorPlan: { [key: string]: string[] } = {};
      floorPlan[`Typical Floor (1-${floors})`] = [
        `${unitsPerFloor} Units per floor (${updated.bedrooms}BHK layout mix)`, 
        'Central Corridors (8ft wide)', 
        `${updated.liftCount} Passenger Lifts (15-person capacity)`, 
        `${updated.staircaseCount || 2} Fire escape staircases`
      ];
      floorPlan['Ground Floor'] = [
        'Double Height Visitor Grand Lobby', 
        'Security CCTV Desk & Intercom station', 
        'Association Board Room'
      ];
      if (updated.commonAmenities && updated.commonAmenities.length > 0) {
        floorPlan['Ground Floor'].push(`Amenities: ${updated.commonAmenities.slice(0, 3).join(', ')}`);
      }
      floorPlan['Basement Level'] = [
        updated.parkingLayout || 'Basement Underground Stack Parking', 
        'Water Treatment Plant (WTP)', 
        'Sewage Treatment Plant (STP)', 
        'DG Generator Room (100% power backup)'
      ];
      updated.floorPlan = floorPlan;
    }

    onUpdate(updated);
  };

  const adjustBedrooms = (val: number) => {
    const nextVal = plan.bedrooms + val;
    if (nextVal >= 1 && nextVal <= 5) {
      recalculateSpecs({ bedrooms: nextVal });
    }
  };

  const adjustFloors = (val: number) => {
    const minVal = plan.type === 'house' ? 1 : 8;
    const maxVal = plan.type === 'house' ? 4 : 12;
    const nextVal = plan.floors + val;
    if (nextVal >= minVal && nextVal <= maxVal) {
      recalculateSpecs({ floors: nextVal });
    }
  };

  const adjustLifts = (val: number) => {
    const nextVal = (plan.liftCount || 2) + val;
    if (nextVal >= 1 && nextVal <= 6) {
      recalculateSpecs({ liftCount: nextVal });
    }
  };

  const adjustStaircases = (val: number) => {
    const nextVal = (plan.staircaseCount || 2) + val;
    if (nextVal >= 1 && nextVal <= 4) {
      recalculateSpecs({ staircaseCount: nextVal });
    }
  };

  const adjustUnitsPerFloor = (val: number) => {
    const nextVal = (plan.unitsPerFloor || 4) + val;
    if (nextVal >= 2 && nextVal <= 12) {
      recalculateSpecs({ unitsPerFloor: nextVal });
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900/50 border border-gray-150 dark:border-gray-850 p-6 rounded-3xl space-y-6">
      <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-800 pb-3">
        <h4 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
          <Sliders size={16} className="text-[#4CAF50]" /> AI Customization Panel
        </h4>
        <button 
          onClick={onReset}
          className="text-gray-400 hover:text-[#4CAF50] transition-colors flex items-center gap-1 text-[10px] font-black uppercase tracking-widest"
        >
          <RotateCcw size={11} /> Reset
        </button>
      </div>

      <div className="space-y-5">
        
        {/* BHK Config Counter */}
        {plan.type === 'house' && (
          <div className="flex justify-between items-center bg-white dark:bg-gray-850 p-3.5 rounded-2xl border dark:border-gray-800">
            <div>
              <span className="text-xs font-black text-gray-900 dark:text-white block">Bedrooms (BHK)</span>
              <span className="text-[10px] text-gray-400">Configure BHK layout</span>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => adjustBedrooms(-1)} 
                className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-750 flex items-center justify-center font-bold hover:bg-[#4CAF50] hover:text-white dark:text-white transition-all text-xs"
              >
                <Minus size={12} />
              </button>
              <span className="font-extrabold text-sm text-[#4CAF50] min-w-10 text-center">{plan.bedrooms} BHK</span>
              <button 
                onClick={() => adjustBedrooms(1)} 
                className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-750 flex items-center justify-center font-bold hover:bg-[#4CAF50] hover:text-white dark:text-white transition-all text-xs"
              >
                <Plus size={12} />
              </button>
            </div>
          </div>
        )}

        {/* Floors Counter */}
        <div className="flex justify-between items-center bg-white dark:bg-gray-850 p-3.5 rounded-2xl border dark:border-gray-800">
          <div>
            <span className="text-xs font-black text-gray-900 dark:text-white block">Number of Floors</span>
            <span className="text-[10px] text-gray-400">
              {plan.type === 'house' ? '1 to 4 floors' : '8 to 12 floors'}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => adjustFloors(-1)} 
              className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-750 flex items-center justify-center font-bold hover:bg-[#4CAF50] hover:text-white dark:text-white transition-all text-xs"
            >
              <Minus size={12} />
            </button>
            <span className="font-extrabold text-sm text-[#4CAF50] min-w-10 text-center">{plan.floors} Floors</span>
            <button 
              onClick={() => adjustFloors(1)} 
              className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-750 flex items-center justify-center font-bold hover:bg-[#4CAF50] hover:text-white dark:text-white transition-all text-xs"
            >
              <Plus size={12} />
            </button>
          </div>
        </div>

        {/* --- House Only Options --- */}
        {plan.type === 'house' && (
          <>
            {/* Balcony selection */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Balcony Option</label>
              <select 
                value={plan.balcony}
                onChange={(e) => recalculateSpecs({ balcony: e.target.value as any })}
                className="w-full bg-white dark:bg-gray-850 border border-gray-200 dark:border-gray-750 rounded-xl p-3 font-semibold text-xs text-gray-700 dark:text-gray-300 outline-none focus:border-[#4CAF50]"
              >
                <option value="Without Balcony">Without Balcony</option>
                <option value="With Balcony">With Balcony</option>
                <option value="Multiple Balconies">Multiple Balconies</option>
              </select>
            </div>

            {/* Kitchen and Dining types */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Kitchen Type</label>
                <select 
                  value={plan.kitchen}
                  onChange={(e) => recalculateSpecs({ kitchen: e.target.value as any })}
                  className="w-full bg-white dark:bg-gray-850 border border-gray-200 dark:border-gray-750 rounded-xl p-3 font-semibold text-xs text-gray-700 dark:text-gray-300 outline-none focus:border-[#4CAF50]"
                >
                  <option value="Standard Kitchen">Standard</option>
                  <option value="Open Kitchen">Open Plan</option>
                  <option value="Modular Kitchen">Modular</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Dining Setup</label>
                <select 
                  value={plan.dining}
                  onChange={(e) => recalculateSpecs({ dining: e.target.value as any })}
                  className="w-full bg-white dark:bg-gray-850 border border-gray-200 dark:border-gray-750 rounded-xl p-3 font-semibold text-xs text-gray-700 dark:text-gray-300 outline-none focus:border-[#4CAF50]"
                >
                  <option value="Combined Living + Dining">Combined</option>
                  <option value="Separate Dining">Separate</option>
                </select>
              </div>
            </div>

            {/* Room Addition Toggles */}
            <div className="space-y-2.5">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Additional Spaces</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { key: 'studyRoom', label: 'Study Room' },
                  { key: 'pujaRoom', label: 'Puja Room' },
                  { key: 'utilityRoom', label: 'Utility' }
                ].map(room => (
                  <button 
                    key={room.key}
                    onClick={() => recalculateSpecs({ [room.key]: !plan[room.key as keyof PlanData] })}
                    className={`py-2 rounded-xl text-[10px] font-bold border transition-all ${
                      plan[room.key as keyof PlanData] 
                        ? 'bg-[#4CAF50]/10 border-[#4CAF50] text-[#4CAF50]' 
                        : 'bg-white dark:bg-gray-850 border-gray-200 dark:border-gray-750 text-gray-500 hover:border-[#4CAF50]/30'
                    }`}
                  >
                    {room.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Parking and Garden toggles */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Garden Space</label>
                <select 
                  value={plan.gardenSpace}
                  onChange={(e) => recalculateSpecs({ gardenSpace: e.target.value as any })}
                  className="w-full bg-white dark:bg-gray-850 border border-gray-200 dark:border-gray-750 rounded-xl p-3 font-semibold text-xs text-gray-700 dark:text-gray-300 outline-none focus:border-[#4CAF50]"
                >
                  <option value="Yes">With Garden</option>
                  <option value="No">No Garden</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Car Parking</label>
                <select 
                  value={plan.parking}
                  onChange={(e) => recalculateSpecs({ parking: e.target.value as any })}
                  className="w-full bg-white dark:bg-gray-850 border border-gray-200 dark:border-gray-750 rounded-xl p-3 font-semibold text-xs text-gray-700 dark:text-gray-300 outline-none focus:border-[#4CAF50]"
                >
                  <option value="Yes">With Parking</option>
                  <option value="No">No Parking</option>
                </select>
              </div>
            </div>
          </>
        )}

        {/* --- Apartment Only Options --- */}
        {plan.type === 'apartment' && (
          <>
            {/* Units Per Floor */}
            <div className="flex justify-between items-center bg-white dark:bg-gray-850 p-3.5 rounded-2xl border dark:border-gray-800">
              <div>
                <span className="text-xs font-black text-gray-900 dark:text-white block">Units Per Floor</span>
                <span className="text-[10px] text-gray-400">Total: {plan.units} Units</span>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => adjustUnitsPerFloor(-1)} 
                  className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-750 flex items-center justify-center font-bold hover:bg-[#4CAF50] hover:text-white dark:text-white transition-all text-xs"
                >
                  <Minus size={12} />
                </button>
                <span className="font-extrabold text-sm text-[#4CAF50] min-w-10 text-center">{plan.unitsPerFloor} U/F</span>
                <button 
                  onClick={() => adjustUnitsPerFloor(1)} 
                  className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-750 flex items-center justify-center font-bold hover:bg-[#4CAF50] hover:text-white dark:text-white transition-all text-xs"
                >
                  <Plus size={12} />
                </button>
              </div>
            </div>

            {/* Lifts Counter */}
            <div className="flex justify-between items-center bg-white dark:bg-gray-850 p-3.5 rounded-2xl border dark:border-gray-800">
              <div>
                <span className="text-xs font-black text-gray-900 dark:text-white block">Lift Count</span>
                <span className="text-[10px] text-gray-400">Passenger & Service</span>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => adjustLifts(-1)} 
                  className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-750 flex items-center justify-center font-bold hover:bg-[#4CAF50] hover:text-white dark:text-white transition-all text-xs"
                >
                  <Minus size={12} />
                </button>
                <span className="font-extrabold text-sm text-[#4CAF50] min-w-10 text-center">{plan.liftCount || 2} Lifts</span>
                <button 
                  onClick={() => adjustLifts(1)} 
                  className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-750 flex items-center justify-center font-bold hover:bg-[#4CAF50] hover:text-white dark:text-white transition-all text-xs"
                >
                  <Plus size={12} />
                </button>
              </div>
            </div>

            {/* Staircases Counter */}
            <div className="flex justify-between items-center bg-white dark:bg-gray-850 p-3.5 rounded-2xl border dark:border-gray-800">
              <div>
                <span className="text-xs font-black text-gray-900 dark:text-white block">Staircase Count</span>
                <span className="text-[10px] text-gray-400">Fire evacuation stairs</span>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => adjustStaircases(-1)} 
                  className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-750 flex items-center justify-center font-bold hover:bg-[#4CAF50] hover:text-white dark:text-white transition-all text-xs"
                >
                  <Minus size={12} />
                </button>
                <span className="font-extrabold text-sm text-[#4CAF50] min-w-10 text-center">{plan.staircaseCount || 2} Stairs</span>
                <button 
                  onClick={() => adjustStaircases(1)} 
                  className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-750 flex items-center justify-center font-bold hover:bg-[#4CAF50] hover:text-white dark:text-white transition-all text-xs"
                >
                  <Plus size={12} />
                </button>
              </div>
            </div>
          </>
        )}

        {/* Built up Area and Budget sliders */}
        <div className="space-y-4 pt-2">
          {/* Area Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-bold text-gray-700 dark:text-slate-300">
              <span>Built-up Area:</span>
              <span className="text-[#4CAF50]">{plan.area.toLocaleString()} sq ft</span>
            </div>
            <input 
              type="range"
              min={plan.type === 'house' ? 600 : 8000}
              max={plan.type === 'house' ? 6000 : 120000}
              step={plan.type === 'house' ? 100 : 1000}
              value={plan.area}
              onChange={(e) => recalculateSpecs({ area: parseInt(e.target.value) })}
              className="w-full accent-[#4CAF50] h-1.5 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Budget Display (recaclulated dynamically based on slider or controls) */}
          <div className="bg-[#4CAF50]/10 border border-[#4CAF50]/20 p-4 rounded-2xl flex justify-between items-center text-xs">
            <div>
              <span className="font-bold text-gray-400 uppercase tracking-widest block text-[9px] mb-0.5">ESTIMATED INVESTMENT</span>
              <span className="font-black text-base text-gray-900 dark:text-white">
                ₹{plan.cost >= 10000000 ? `${(plan.cost / 10000000).toFixed(2)} Crore` : `${(plan.cost / 100000).toFixed(0)} Lakhs`}
              </span>
            </div>
            <div className="text-right">
              <span className="font-bold text-gray-400 uppercase tracking-widest block text-[9px] mb-0.5">PER SQFT COST</span>
              <span className="font-extrabold text-[#4CAF50]">₹{Math.round(plan.cost / plan.area)} / sqft</span>
            </div>
          </div>
        </div>

        {/* Customization Note */}
        <div className="text-[10px] text-gray-500 font-medium leading-relaxed bg-white dark:bg-gray-850 p-3 rounded-xl border border-dashed dark:border-gray-800 flex items-start gap-2">
          <Sparkles size={14} className="text-[#4CAF50] flex-shrink-0 mt-0.5" />
          <span>Procedural AI computes mechanical load support, Vastu entrance guidelines, and structural piping setups dynamically for each parameter change.</span>
        </div>

      </div>
    </div>
  );
};
