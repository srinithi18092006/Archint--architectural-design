export interface PlanData {
  id: string;
  type: 'house' | 'apartment';
  title: string;
  category: string;
  floors: number;
  area: number;
  cost: number;
  bedrooms: number;
  bathrooms: number;
  balcony: 'With Balcony' | 'Without Balcony' | 'Multiple Balconies';
  kitchen: 'Standard Kitchen' | 'Open Kitchen' | 'Modular Kitchen';
  dining: 'Separate Dining' | 'Combined Living + Dining';
  parking: 'Yes' | 'No';
  waterFacility: string[];
  description: string;
  image: string;
  isRecommended?: boolean;
  units?: number;
  unitsPerFloor?: number;
  familyType?: string;
  plotFit?: string;
  pujaRoom?: boolean;
  studyRoom?: boolean;
  utilityRoom?: boolean;
  liftCount?: number;
  staircaseCount?: number;
  unitsMix?: string;
  commonAmenities?: string[];
  floorPlan?: {
    [key: string]: string[];
  };
  gallery?: string[];

  // --- Procedural Diversity Fields ---
  style?: string;
  roofStyle: string;
  windowPlacement: string;
  balconyStyle: string;
  interiorLayout: string;
  staircaseLocation: string;
  roomArrangement: string;
  kitchenPlacement: string;
  diningArrangement: string;
  parkingLayout: string;
  gardenSpace: 'Yes' | 'No';
  gardenLayout: string;
  vastuPreference: string;

  // --- Utility Coordinate Planning & Details ---
  borewellLocation: string;
  undergroundSump: string;
  overheadTank: string;
  rainwaterHarvesting: string;
  septicTank: string;
  drainageLayout: string;
  washingArea: string;
}

// Lists of architectural features for procedural diversity
const houseImages = [
  'https://images.unsplash.com/photo-1580587767376-0428ad360e52',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750',
  'https://images.unsplash.com/photo-1613490493576-7fde63acd811',
  'https://images.unsplash.com/photo-1592595825556-9800eec7a97d',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c',
  'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde',
  'https://images.unsplash.com/photo-1600566752355-3979013ecd7e',
  'https://images.unsplash.com/photo-1518732714860-b62714ce0c5e',
  'https://images.unsplash.com/photo-1480074568708-e7b720bb3f09',
  'https://images.unsplash.com/photo-1513584684374-8bdb74838a0f',
  'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83',
  'https://images.unsplash.com/photo-1510798831971-661eb04b3739',
  'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6',
  'https://images.unsplash.com/photo-1568605114967-8130f3a36994',
  'https://images.unsplash.com/photo-1564013799919-ab600027ffc6'
];

const apartmentImages = [
  'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00',
  'https://images.unsplash.com/photo-1536645232517-3a5a947d894b',
  'https://images.unsplash.com/photo-1515263487990-61b07816b324',
  'https://images.unsplash.com/photo-1493246318656-5bbd4cfb7ca3',
  'https://images.unsplash.com/photo-1460317442991-0ec2393ba0ad',
  'https://images.unsplash.com/photo-1560448204-603b3fc33ddc',
  'https://images.unsplash.com/photo-1567496898669-ee935f5f647a',
  'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267',
  'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688',
  'https://images.unsplash.com/photo-1551361415-69c87624334f'
];

const interiorImages = {
  living: [
    'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c',
    'https://images.unsplash.com/photo-1616486341351-70ad52b6fca4'
  ],
  bedroom: [
    'https://images.unsplash.com/photo-1616137422495-1e9e46e2aa77',
    'https://images.unsplash.com/photo-1586023492125-27b2c045efd7'
  ],
  kitchen: [
    'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b',
    'https://images.unsplash.com/photo-1556911220-e15b29be8c8f'
  ],
  dining: [
    'https://images.unsplash.com/photo-1617806118233-18e1db207fa6',
    'https://images.unsplash.com/photo-1577140917170-285929fb55b7'
  ],
  balcony: [
    'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85',
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267'
  ],
  bathroom: [
    'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14',
    'https://images.unsplash.com/photo-1584622650111-993a426fbf0a'
  ]
};

const prefixes = [
  'Elysian', 'Sovereign', 'Aura', 'Skyline', 'Verdant', 'Minimalist', 'Teakwood',
  'Neo-Classical', 'Zenith', 'Eco-Vista', 'Alpine', 'Coastal', 'Urban', 'Pinecrest',
  'Amber', 'Crystal', 'Ruby', 'Sapphire', 'Platinum', 'Vanguard', 'Serenity', 'Heritage',
  'Vista', 'Meridian', 'Summit', 'Oakridge', 'Celestia', 'Solitude', 'Haven', 'Monolith'
];

const suffixesHouse = [
  'Bungalow', 'Villa', 'Residence', 'Manor', 'Cottage', 'Pavilion', 'Retreat', 
  'Duplex', 'Chateau', 'Estate', 'Bower', 'Homestead'
];

const suffixesApartment = [
  'Heights', 'Towers', 'Suites', 'Loft', 'Residency', 'Plaza', 'Gardens', 'Arcades', 
  'Enclave', 'Terraces'
];

const styles = [
  'Contemporary Glasshouse', 'Scandinavian Minimalist', 'Traditional Chettinad Heritage',
  'Neo-Classical Arch Villa', 'Industrial Loft-style', 'Eco-Sustainable Timber Frame',
  'Modern Coastal Monolith', 'Zen Courtyard House'
];

const roofStyles = [
  'Flat Roof with Sky-Deck & Solar Panels', 
  'Traditional Sloped Gabled Roof', 
  'Modern Floating Mono-pitch Roof', 
  'Curved Metal Vault Canopy', 
  'Terraced Garden Green Roof'
];

const windowPlacements = [
  'Floor-to-ceiling Glass Facades (North-East Facing)', 
  'Clerestory High Ventilation Windows', 
  'Ribbon Windows & Corner Bay Glasses', 
  'Symmetrical Classic Grid Windows', 
  'Triple-glazed Asymmetric Ribbon Openings'
];

const balconyStyles = [
  'Cantilevered Frameless Glass Balcony', 
  'Rustic Teakwood Deck Balcony', 
  'Minimalist Wrought Iron Juliet Railing', 
  'Wrap-around Panoramic Corner Veranda', 
  'Open-air Sky-deck Balcony'
];

const interiorLayouts = [
  'Open-concept Living & Dining Great Room', 
  'Traditional Compartmentalized Chambers', 
  'Central Courtyard (Brahmasthan) Flow Layout', 
  'Split-level Multi-zone Design', 
  'Linear Space-optimizing Flow'
];

const staircaseLocations = [
  'Internal Floating Steel Foyer Stairs', 
  'External Covered Concrete Side-Stairs', 
  'Grand Curved Marble Central Staircase', 
  'Space-saving Spiral Corner Staircase', 
  'No Staircase (Single Floor Plan)'
];

const roomArrangements = [
  'L-shaped Wing Distribution', 
  'U-shaped Courtyard Wrap', 
  'Linear Dual-aspect Stack', 
  'Compact Quadrant Block'
];

const kitchenPlacements = [
  'South-East (Agni corner) Vastu Zone', 
  'North-West (Vayu corner) Vastu Zone', 
  'West Central Zone with utility access'
];

const diningArrangements = [
  'Separate Formal Dining Room', 
  'Combined Open Living + Dining Area', 
  'Breakfast Counter Bar Setup'
];

const parkingLayouts = [
  'Basement Underground Stack Parking', 
  'Front Portico Covered Garage', 
  'Side Open Gravel Driveway', 
  'Under-croft Column Parking (Stilt)'
];

const gardenLayouts = [
  'Lush Front Turf Lawn with fountains', 
  'Vertical Herb Wall Garden in Balcony', 
  'Japanese Zen Gravel Courtyard', 
  'Rooftop Terrace Planters & Bonsai collection',
  'No Garden Area'
];

const vastuDirections = [
  'East Facing (Vastu Compliant - Surya Entrance)',
  'North Facing (Vastu Compliant - Kubera Entrance)',
  'West Facing (Vastu Compliant - Varuna Entrance)',
  'South Facing (Vastu Compliant with remedial entrance layout)',
  '100% Vastu Compliant Multi-facing Layout'
];

// Helper to generate a deterministic pseudo-random number based on a seed string
function seedRandom(seed: string) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(31, h) + seed.charCodeAt(i) | 0;
  }
  return function() {
    h = Math.imul(h ^ h >>> 16, 2246822507);
    h = Math.imul(h ^ h >>> 13, 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
}

/**
 * Procedural Design Generator Engine.
 * Generates 100+ unique, customizable designs, or builds custom plans on the fly based on user filters.
 */
export function generateProceduralPlans(filters: any = {}, count: number = 100): PlanData[] {
  const plans: PlanData[] = [];
  const seedVal = JSON.stringify(filters) + '_v1';
  const rand = seedRandom(seedVal);

  const selectRandom = (arr: any[], customRand: () => number = rand) => {
    return arr[Math.floor(customRand() * arr.length)];
  };

  const getFilteredValue = (filterVal: string, options: any[], defaultVal: any) => {
    if (!filterVal || filterVal === 'all') return defaultVal;
    const matched = options.find(opt => opt.toString().toLowerCase().includes(filterVal.toString().toLowerCase()));
    return matched || filterVal;
  };

  for (let i = 0; i < count; i++) {
    const itemSeed = `${seedVal}_${i}`;
    const itemRand = seedRandom(itemSeed);

    const type = filters.type || selectRandom(['house', 'apartment'], itemRand);
    
    // Set Floors
    let floors = 1;
    if (type === 'house') {
      const floorsFilter = filters.floors;
      if (floorsFilter && floorsFilter !== 'all') {
        floors = parseInt(floorsFilter);
      } else {
        floors = selectRandom([1, 2, 3, 4], itemRand);
      }
    } else {
      const floorsFilter = filters.floors;
      if (floorsFilter && floorsFilter !== 'all') {
        floors = parseInt(floorsFilter);
      } else {
        floors = selectRandom([8, 9, 10], itemRand);
      }
    }

    // Set Bedrooms (BHK)
    let bedrooms = 3;
    if (type === 'house') {
      const bedroomsFilter = filters.bedrooms;
      if (bedroomsFilter && bedroomsFilter !== 'all') {
        bedrooms = parseInt(bedroomsFilter.replace('BHK', ''));
      } else {
        bedrooms = Math.min(floors + Math.floor(itemRand() * 2) + 1, 5);
      }
    } else {
      // Apartments can have a mix
      const bedroomsFilter = filters.bedrooms;
      if (bedroomsFilter && bedroomsFilter !== 'all') {
        bedrooms = parseInt(bedroomsFilter.replace('BHK', ''));
      } else {
        bedrooms = selectRandom([1, 2, 3, 4], itemRand);
      }
    }

    // Set Area (Square feet)
    let area = 1200;
    if (type === 'house') {
      const areaFilter = filters.area;
      if (areaFilter && areaFilter !== 'all') {
        if (areaFilter === '<1000') area = 700 + Math.floor(itemRand() * 250);
        else if (areaFilter === '1000-1500') area = 1000 + Math.floor(itemRand() * 450);
        else if (areaFilter === '1500-2500') area = 1500 + Math.floor(itemRand() * 950);
        else if (areaFilter === '2500-4000') area = 2500 + Math.floor(itemRand() * 1450);
        else if (areaFilter === '>4000') area = 4000 + Math.floor(itemRand() * 1500);
      } else {
        area = 700 + (floors * 500) + Math.floor(itemRand() * 800);
      }
    } else {
      // Apartment built-up area
      const areaFilter = filters.area;
      if (areaFilter && areaFilter !== 'all') {
        if (areaFilter === '<30k') area = 15000 + Math.floor(itemRand() * 12000);
        else if (areaFilter === '30k-50k') area = 30000 + Math.floor(itemRand() * 18000);
        else if (areaFilter === '>50k') area = 50000 + Math.floor(itemRand() * 30000);
      } else {
        const unitsPerFloor = selectRandom([4, 5, 6, 7, 8], itemRand);
        area = 12000 + (floors * unitsPerFloor * 800) + Math.floor(itemRand() * 10000);
      }
    }

    // Set Budget / Cost calculation
    let cost = 6500000;
    if (type === 'house') {
      const budgetFilter = filters.budget;
      if (budgetFilter && budgetFilter !== 'all') {
        if (budgetFilter === '50-75L') cost = 5000000 + Math.floor(itemRand() * 2300000);
        else if (budgetFilter === '75L-1Cr') cost = 7500000 + Math.floor(itemRand() * 2300000);
        else if (budgetFilter === '1Cr-2Cr') cost = 10000000 + Math.floor(itemRand() * 9000000);
        else if (budgetFilter === '2Cr+') cost = 20000000 + Math.floor(itemRand() * 20000000);
      } else {
        cost = 4500000 + (floors * 2000000) + (area * 2500) + Math.floor(itemRand() * 1000000);
      }
    } else {
      const budgetFilter = filters.budget;
      if (budgetFilter && budgetFilter !== 'all') {
        if (budgetFilter === '<10Cr') cost = 60000000 + Math.floor(itemRand() * 35000000);
        else if (budgetFilter === '10Cr-15Cr') cost = 100000000 + Math.floor(itemRand() * 45000000);
        else if (budgetFilter === '>15Cr') cost = 150000000 + Math.floor(itemRand() * 150000000);
      } else {
        const unitsPerFloor = Math.ceil(area / (floors * 900));
        const totalUnits = floors * unitsPerFloor;
        cost = 60000000 + (totalUnits * 3500000) + Math.floor(itemRand() * 15000000);
      }
    }

    // Balcony
    let balcony: 'With Balcony' | 'Without Balcony' | 'Multiple Balconies' = 'With Balcony';
    if (filters.balcony && filters.balcony !== 'all') {
      balcony = filters.balcony;
    } else {
      balcony = selectRandom(['With Balcony', 'Without Balcony', 'Multiple Balconies'], itemRand);
    }

    // Kitchen Type
    let kitchen: any = 'Modular Kitchen';
    if (filters.kitchen && filters.kitchen !== 'all') {
      kitchen = filters.kitchen;
    } else {
      kitchen = selectRandom(['Standard Kitchen', 'Open Kitchen', 'Modular Kitchen'], itemRand);
    }

    // Dining Space
    let dining: any = 'Combined Living + Dining';
    if (filters.dining && filters.dining !== 'all') {
      dining = filters.dining;
    } else {
      dining = selectRandom(['Separate Dining', 'Combined Living + Dining'], itemRand);
    }

    // Parking
    let parking: 'Yes' | 'No' = 'Yes';
    if (filters.parking && filters.parking !== 'all') {
      parking = filters.parking;
    } else {
      parking = selectRandom(['Yes', 'No'], itemRand);
    }

    // Garden
    let gardenSpace: 'Yes' | 'No' = 'Yes';
    if (filters.garden && filters.garden !== 'all') {
      gardenSpace = filters.garden;
    } else {
      gardenSpace = selectRandom(['Yes', 'No'], itemRand);
    }

    // Vastu Direction
    let vastuPreference = selectRandom(vastuDirections, itemRand);
    if (filters.vastu && filters.vastu !== 'all') {
      vastuPreference = getFilteredValue(filters.vastu, vastuDirections, vastuPreference);
    }

    // Water Utilities list
    const waterFacilityOptions = ['Borewell Sump', 'Underground Sump', 'Overhead Tank', 'Rainwater Harvesting Recharge', 'Septic Tank System', 'Gravity Drainage Layout', 'Washing Utility Porch'];
    let selectedWater = waterFacilityOptions.filter(() => itemRand() > 0.35);
    if (selectedWater.length < 3) {
      selectedWater = ['Overhead Tank', 'Borewell Sump', 'Underground Sump', 'Rainwater Harvesting Recharge'];
    }

    // If specific water facility preferred
    if (filters.waterFacility && filters.waterFacility !== 'all') {
      if (!selectedWater.includes(filters.waterFacility)) {
        selectedWater.push(filters.waterFacility);
      }
    }

    // Plot Dimensions
    let plotFit = floors === 1 ? '30x40 plots' : floors === 2 ? '30x40, 40x60 plots' : '40x60, 50x80 plots';
    if (filters.plotDimensions && filters.plotDimensions !== 'all') {
      plotFit = `${filters.plotDimensions} plots`;
    }

    // Procedural Title
    const pref = selectRandom(prefixes, itemRand);
    const suff = type === 'house' ? selectRandom(suffixesHouse, itemRand) : selectRandom(suffixesApartment, itemRand);
    const title = `${pref} ${suff} - Design #${1000 + i}`;

    // Procedural Elevation Style details (For uniqueness)
    const style = selectRandom(styles, itemRand);
    const roof = selectRandom(roofStyles, itemRand);
    const windows = selectRandom(windowPlacements, itemRand);
    const balconyStyle = balcony === 'Without Balcony' ? 'No Balcony Structure' : selectRandom(balconyStyles, itemRand);
    const interiorLayout = selectRandom(interiorLayouts, itemRand);
    const staircaseLocation = floors === 1 ? 'No Staircase (Single Floor)' : selectRandom(staircaseLocations, itemRand);
    const roomArrangement = selectRandom(roomArrangements, itemRand);
    const kitchenPlacement = selectRandom(kitchenPlacements, itemRand);
    const diningArrangement = selectRandom(diningArrangements, itemRand);
    const parkingLayout = parking === 'No' ? 'No Reserved Parking Bay' : selectRandom(parkingLayouts, itemRand);
    const gardenLayout = gardenSpace === 'No' ? 'No Garden Plan' : selectRandom(gardenLayouts, itemRand);

    // Vastu utility placements:
    const borewellLocation = 'North-East (Ishanya) corner (High yield, positive energy)';
    const undergroundSump = 'East-North-East zone (Vastu pure storage)';
    const overheadTank = 'South-West (Nairutya) corner (Heavy structural load capacity)';
    const rainwaterHarvesting = 'Sand-and-carbon twin filtration pits near front lawn';
    const septicTank = 'North-West (Vayu) boundary wall zone (No negative energy)';
    const drainageLayout = 'Slope gradient towards North-East exit drain line';
    const washingArea = 'Rear South-West utility porch (Washing machine plumbing tap)';

    const image = type === 'house' 
      ? `${houseImages[i % houseImages.length]}?auto=format&fit=crop&q=80&w=800`
      : `${apartmentImages[i % apartmentImages.length]}?auto=format&fit=crop&q=80&w=800`;

    // Floor-wise Layout list generator
    const floorPlan: { [key: string]: string[] } = {};
    if (type === 'house') {
      floorPlan['Ground Floor'] = [
        'Front Entrance Veranda', 
        'Spacious Foyer & Living Area', 
        `1 Bedroom (Vastu West)`, 
        `1 Common Bathroom`,
        kitchenPlacement,
        diningArrangement
      ];
      if (parking === 'Yes') floorPlan['Ground Floor'].push(parkingLayout);
      if (gardenSpace === 'Yes') floorPlan['Ground Floor'].push(gardenLayout);

      if (floors > 1) {
        floorPlan['First Floor'] = [
          `${bedrooms - 1} Master Bedrooms with En-suite Baths`, 
          'Cozy Family Lounge', 
          balconyStyle, 
          'Study / Library Space'
        ];
      }
      if (floors > 2) {
        floorPlan['Second Floor'] = [
          'Guest Bedroom with Attached Bath', 
          'Home Theatre Lounge', 
          'Open Sky Terrace Deck', 
          'Gymnasium Room'
        ];
      }
      if (floors > 3) {
        floorPlan['Third Floor'] = [
          'Rooftop Green Garden sit-out', 
          'Solar Canopy Grid Layout', 
          'Utility Laundry Room'
        ];
      }
    } else {
      // Apartment floor plan
      const unitsPerFloor = selectRandom([4, 6, 8], itemRand);
      floorPlan[`Typical Floor (1-${floors})`] = [
        `${unitsPerFloor} Units per floor (${bedrooms}BHK configs)`, 
        'Central Corridors (8ft wide)', 
        '2 Passenger Lifts (15-person capacity)', 
        '1 Service Lift (Stretcher compatible)', 
        'Dual Fire escape staircases'
      ];
      floorPlan['Ground Floor'] = [
        'Double Height Visitor Grand Lobby', 
        'Security CCTV Desk & Intercom station', 
        'Association Board Room', 
        'Kids Indoor Play Zone'
      ];
      floorPlan['Basement Level'] = [
        parkingLayout, 
        'Water Treatment Plant (WTP)', 
        'Sewage Treatment Plant (STP)', 
        'DG Generator Room (100% power backup)'
      ];
    }

    plans.push({
      id: `${type}-proc-${i}`,
      type: type,
      title: title,
      category: type === 'house' ? `${floors} Floor Duplex/Villa` : `${floors} Floor Tower Block`,
      floors: floors,
      area: area,
      cost: cost,
      bedrooms: bedrooms,
      bathrooms: Math.max(bedrooms, 1) + (itemRand() > 0.4 ? 1 : 0),
      balcony: balcony,
      kitchen: kitchen,
      dining: dining,
      parking: parking,
      waterFacility: selectedWater,
      description: `A state-of-the-art ${type === 'house' ? 'residence' : 'complex'} procedurally engineered with a ${style} facade. Optimized under ${vastuPreference} direction rules and planned for sustainable water, sewage, and power infrastructure.`,
      image: image,
      gallery: [
        image,
        `${selectRandom(interiorImages.living, itemRand)}?auto=format&fit=crop&q=80&w=800`,
        `${selectRandom(interiorImages.bedroom, itemRand)}?auto=format&fit=crop&q=80&w=800`,
        `${selectRandom(interiorImages.kitchen, itemRand)}?auto=format&fit=crop&q=80&w=800`,
        `${selectRandom(interiorImages.dining, itemRand)}?auto=format&fit=crop&q=80&w=800`,
        `${selectRandom(interiorImages.balcony, itemRand)}?auto=format&fit=crop&q=80&w=800`,
        `${selectRandom(interiorImages.bathroom, itemRand)}?auto=format&fit=crop&q=80&w=800`
      ],
      familyType: type === 'house' 
        ? (floors >= 3 ? 'Extended Joint Family' : floors === 2 ? 'Nuclear Family + Parents' : 'Young Couple Nuclear Family')
        : 'Urban Corporate Families',
      plotFit: plotFit,
      pujaRoom: type === 'house' ? itemRand() > 0.3 : false,
      studyRoom: type === 'house' ? itemRand() > 0.5 : false,
      utilityRoom: type === 'house' ? itemRand() > 0.4 : false,
      liftCount: type === 'apartment' ? (floors > 8 ? 3 : 2) : undefined,
      staircaseCount: type === 'apartment' ? 2 : undefined,
      units: type === 'apartment' ? floors * (filters.unitsPerFloor ? parseInt(filters.unitsPerFloor) : selectRandom([4, 6, 8], itemRand)) : undefined,
      unitsPerFloor: type === 'apartment' ? (filters.unitsPerFloor ? parseInt(filters.unitsPerFloor) : selectRandom([4, 6, 8], itemRand)) : undefined,
      unitsMix: type === 'apartment' ? `${selectRandom([40, 50], itemRand)}% 2BHK, ${selectRandom([30, 40], itemRand)}% 3BHK, 10% 1BHK` : undefined,
      commonAmenities: type === 'apartment' ? ['Infinity Swimming Pool', 'Rooftop Clubhouse', '24/7 Power Backup', 'Basement Stack Parking', 'Equipped Gymnasium', 'Rainwater Recharge Wells', 'STP Treatment Recycle'] : undefined,
      isRecommended: i < 3 || (type === 'house' && bedrooms === 3 && cost < 16000000),
      
      // procedural fields
      style: style,
      roofStyle: roof,
      windowPlacement: windows,
      balconyStyle: balconyStyle,
      interiorLayout: interiorLayout,
      staircaseLocation: staircaseLocation,
      roomArrangement: roomArrangement,
      kitchenPlacement: kitchenPlacement,
      diningArrangement: diningArrangement,
      parkingLayout: parkingLayout,
      gardenSpace: gardenSpace,
      gardenLayout: gardenLayout,
      vastuPreference: vastuPreference,
      
      // utility coords/details
      borewellLocation: borewellLocation,
      undergroundSump: undergroundSump,
      overheadTank: overheadTank,
      rainwaterHarvesting: rainwaterHarvesting,
      septicTank: septicTank,
      drainageLayout: drainageLayout,
      washingArea: washingArea
    });
  }

  return plans;
}

/**
 * Creates 3-4 slightly modified variations of a base plan to show as alternatives after customization.
 */
export function generateVariations(basePlan: PlanData, count: number = 3): PlanData[] {
  const variations: PlanData[] = [];
  
  for (let i = 0; i < count; i++) {
    const seed = `${basePlan.id}_var_${i}`;
    const rand = seedRandom(seed);
    const selectRandom = (arr: any[]) => arr[Math.floor(rand() * arr.length)];
    
    // vary cost slightly
    const costVary = basePlan.cost * (0.95 + rand() * 0.1); 
    // vary style and aesthetic parameters
    const styleOpt = selectRandom(styles);
    const roofOpt = selectRandom(roofStyles);
    const windowsOpt = selectRandom(windowPlacements);
    const balconyOpt = basePlan.balcony === 'Without Balcony' ? 'No Balcony Structure' : selectRandom(balconyStyles);
    
    variations.push({
      ...basePlan,
      id: `${basePlan.id}-var-${i}`,
      title: `${basePlan.title.split(' - ')[0]} (Variation ${String.fromCharCode(65 + i)})`,
      cost: Math.round(costVary),
      style: styleOpt,
      roofStyle: roofOpt,
      windowPlacement: windowsOpt,
      balconyStyle: balconyOpt,
      isRecommended: false,
      gallery: [
        basePlan.image,
        basePlan.gallery?.[1] || '',
        basePlan.gallery?.[2] || '',
        basePlan.gallery?.[3] || '',
        basePlan.gallery?.[4] || ''
      ]
    });
  }
  
  return variations;
}

// Fallback pool of 100 designs
export const richMockPlans: PlanData[] = generateProceduralPlans({}, 100);
