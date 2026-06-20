import React, { useMemo } from 'react';
import { PlanData } from '../data/plans_rich';

interface VisualizerProps {
  plan: PlanData;
}

// Seed-based random number generator to keep the sketch stable on re-renders
function createSeededRandom(seed: string) {
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

export const SketchSheetVisualizer: React.FC<VisualizerProps> = ({ plan }) => {
  // Generate a stable seed from all plan parameters
  const seed = useMemo(() => {
    return (
      plan.id +
      '_' +
      plan.bedrooms +
      '_' +
      plan.floors +
      '_' +
      plan.area +
      '_' +
      plan.parking +
      '_' +
      plan.gardenSpace +
      '_' +
      (plan.pujaRoom ? 'y' : 'n') +
      '_' +
      (plan.studyRoom ? 'y' : 'n') +
      '_' +
      (plan.utilityRoom ? 'y' : 'n') +
      '_' +
      plan.balcony +
      '_' +
      plan.kitchen +
      '_' +
      plan.dining +
      '_' +
      plan.vastuPreference
    );
  }, [plan]);

  const sheetWidth = 1200;
  const sheetHeight = 850;

  // Extract plot dimensions
  const { plotW, plotL } = useMemo(() => {
    let w = 30;
    let l = 40;
    if (plan.plotFit) {
      const match = plan.plotFit.match(/(\d+)x(\d+)/);
      if (match) {
        w = parseInt(match[1]);
        l = parseInt(match[2]);
      }
    } else {
      const groundCoverage = plan.area / plan.floors;
      if (groundCoverage < 1000) {
        w = 30;
        l = 40;
      } else if (groundCoverage < 2000) {
        w = 40;
        l = 60;
      } else {
        w = 50;
        l = 80;
      }
    }
    return { plotW: w, plotL: l };
  }, [plan.plotFit, plan.area, plan.floors]);

  // Seeded random generator
  const randSheet = useMemo(() => createSeededRandom(seed), [seed]);

  // Draw sketchy lines (multi-stroke, overshoot, slightly wavy)
  const drawSketchyLine = (
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    randFn: () => number,
    weight: number = 1.0,
    opacity: number = 0.75,
    overshoot: number = 4
  ) => {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const len = Math.sqrt(dx * dx + dy * dy);
    if (len === 0) return null;

    const ux = dx / len;
    const uy = dy / len;

    const getStrokePath = (wiggle: number) => {
      const ox1 = x1 - ux * overshoot + (randFn() - 0.5) * wiggle;
      const oy1 = y1 - uy * overshoot + (randFn() - 0.5) * wiggle;
      const ox2 = x2 + ux * overshoot + (randFn() - 0.5) * wiggle;
      const oy2 = y2 + uy * overshoot + (randFn() - 0.5) * wiggle;

      const mx = (ox1 + ox2) / 2 + (randFn() - 0.5) * (wiggle * 1.2) - uy * (randFn() - 0.5) * 1.5;
      const my = (oy1 + oy2) / 2 + (randFn() - 0.5) * (wiggle * 1.2) + ux * (randFn() - 0.5) * 1.5;

      return `M ${ox1.toFixed(1)},${oy1.toFixed(1)} Q ${mx.toFixed(1)},${my.toFixed(1)} ${ox2.toFixed(1)},${oy2.toFixed(1)}`;
    };

    return (
      <g stroke="#2c2c2c" fill="none" strokeLinecap="round" opacity={opacity} key={`line-${x1}-${y1}-${x2}-${y2}-${randFn()}`}>
        <path d={getStrokePath(0.7)} strokeWidth={weight} />
        <path d={getStrokePath(1.2)} strokeWidth={weight * 0.7} />
      </g>
    );
  };

  const drawSketchyRect = (
    x: number,
    y: number,
    w: number,
    h: number,
    randFn: () => number,
    weight: number = 1.0,
    opacity: number = 0.75,
    overshoot: number = 3
  ) => {
    return (
      <g key={`rect-${x}-${y}-${w}-${h}`}>
        {drawSketchyLine(x, y, x + w, y, randFn, weight, opacity, overshoot)}
        {drawSketchyLine(x + w, y, x + w, y + h, randFn, weight, opacity, overshoot)}
        {drawSketchyLine(x + w, y + h, x, y + h, randFn, weight, opacity, overshoot)}
        {drawSketchyLine(x, y + h, x, y, randFn, weight, opacity, overshoot)}
      </g>
    );
  };

  // Draw sketchy door
  const drawSketchyDoor = (
    x: number,
    y: number,
    size: number,
    orientation: 'NE' | 'NW' | 'SE' | 'SW',
    randFn: () => number
  ) => {
    let archPath = '';
    let panelPath = '';
    const w = size;

    if (orientation === 'SE') {
      panelPath = `M ${x},${y} L ${x},${y + w}`;
      archPath = `M ${x},${y + w} A ${w},${w} 0 0,0 ${x + w},${y}`;
    } else if (orientation === 'SW') {
      panelPath = `M ${x},${y} L ${x},${y + w}`;
      archPath = `M ${x},${y + w} A ${w},${w} 0 0,1 ${x - w},${y}`;
    } else if (orientation === 'NE') {
      panelPath = `M ${x},${y} L ${x},${y - w}`;
      archPath = `M ${x},${y - w} A ${w},${w} 0 0,1 ${x + w},${y}`;
    } else {
      // NW
      panelPath = `M ${x},${y} L ${x},${y - w}`;
      archPath = `M ${x},${y - w} A ${w},${w} 0 0,0 ${x - w},${y}`;
    }

    return (
      <g stroke="#3a3a3a" fill="none" opacity={0.8} strokeWidth={1} key={`door-${x}-${y}`}>
        <path d={panelPath} />
        <path d={archPath} strokeDasharray="3,3" />
      </g>
    );
  };

  // Draw sketchy window symbol
  const drawSketchyWindow = (
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    isVertical: boolean,
    randFn: () => number
  ) => {
    const offset = 3;
    return (
      <g key={`win-${x1}-${y1}`}>
        {drawSketchyLine(x1, y1, x2, y2, randFn, 1, 0.7, 2)}
        {isVertical ? (
          <>
            {drawSketchyLine(x1 + offset, y1, x2 + offset, y2, randFn, 0.7, 0.5, 1)}
            {drawSketchyLine(x1 - offset, y1, x2 - offset, y2, randFn, 0.7, 0.5, 1)}
          </>
        ) : (
          <>
            {drawSketchyLine(x1, y1 + offset, x2, y2 + offset, randFn, 0.7, 0.5, 1)}
            {drawSketchyLine(x1, y1 - offset, x2, y2 - offset, randFn, 0.7, 0.5, 1)}
          </>
        )}
      </g>
    );
  };

  // Draw Furniture Elements in sketchy style
  const drawBed = (bx: number, by: number, bw: number, bh: number, isRotate: boolean, randFn: () => number) => {
    return (
      <g stroke="#444" fill="none" strokeWidth={0.8} opacity={0.65} key={`bed-${bx}-${by}`}>
        {/* Main Bed Frame */}
        {drawSketchyRect(bx, by, bw, bh, randFn, 0.8, 0.6, 2)}
        {/* Pillows */}
        {isRotate ? (
          <>
            {drawSketchyRect(bx + 4, by + 4, 15, bh - 8, randFn, 0.6, 0.5, 1)}
            {drawSketchyLine(bx + 20, by, bx + 20, by + bh, randFn, 0.6, 0.5, 1)}
          </>
        ) : (
          <>
            {drawSketchyRect(bx + 4, by + 4, bw - 8, 15, randFn, 0.6, 0.5, 1)}
            {drawSketchyLine(bx, by + 20, bx + bw, by + 20, randFn, 0.6, 0.5, 1)}
          </>
        )}
      </g>
    );
  };

  const drawSofaSet = (lx: number, ly: number, randFn: () => number) => {
    return (
      <g stroke="#444" fill="none" strokeWidth={0.8} opacity={0.65} key={`sofa-${lx}-${ly}`}>
        {/* 3-Seater Sofa */}
        {drawSketchyRect(lx, ly, 65, 25, randFn, 0.8, 0.6, 2)}
        {/* Cushions */}
        {drawSketchyLine(lx + 21, ly, lx + 21, ly + 25, randFn, 0.5, 0.5, 0)}
        {/* Armrest */}
        {drawSketchyLine(lx + 43, ly, lx + 43, ly + 25, randFn, 0.5, 0.5, 0)}
        
        {/* 1-Seater Sofa */}
        {drawSketchyRect(lx - 35, ly + 10, 25, 25, randFn, 0.8, 0.6, 2)}
        
        {/* Coffee Table */}
        {drawSketchyRect(lx + 10, ly + 40, 45, 20, randFn, 0.6, 0.5, 1)}
      </g>
    );
  };

  const drawDiningTable = (dx: number, dy: number, randFn: () => number) => {
    return (
      <g stroke="#444" fill="none" strokeWidth={0.8} opacity={0.65} key={`dining-${dx}-${dy}`}>
        {/* Main Table */}
        {drawSketchyRect(dx, dy, 60, 40, randFn, 0.8, 0.6, 2)}
        {/* Chairs (6 Chairs) */}
        {/* Top 3 */}
        {drawSketchyRect(dx + 5, dy - 10, 12, 10, randFn, 0.6, 0.5, 1)}
        {drawSketchyRect(dx + 24, dy - 10, 12, 10, randFn, 0.6, 0.5, 1)}
        {drawSketchyRect(dx + 43, dy - 10, 12, 10, randFn, 0.6, 0.5, 1)}
        {/* Bottom 3 */}
        {drawSketchyRect(dx + 5, dy + 40, 12, 10, randFn, 0.6, 0.5, 1)}
        {drawSketchyRect(dx + 24, dy + 40, 12, 10, randFn, 0.6, 0.5, 1)}
        {drawSketchyRect(dx + 43, dy + 40, 12, 10, randFn, 0.6, 0.5, 1)}
      </g>
    );
  };

  const drawKitchenCounters = (kx: number, ky: number, kw: number, kh: number, randFn: () => number) => {
    return (
      <g stroke="#444" fill="none" strokeWidth={0.8} opacity={0.65} key={`kitchen-${kx}-${ky}`}>
        {/* L-shaped platform */}
        {drawSketchyLine(kx, ky + kh - 20, kx + kw - 20, ky + kh - 20, randFn, 0.8, 0.6, 2)}
        {drawSketchyLine(kx + kw - 20, ky, kx + kw - 20, ky + kh - 20, randFn, 0.8, 0.6, 2)}

        {/* Stove burner rings */}
        <circle cx={kx + 25} cy={ky + kh - 10} r={5} strokeWidth={0.8} />
        <circle cx={kx + 45} cy={ky + kh - 10} r={5} strokeWidth={0.8} />

        {/* Sink */}
        {drawSketchyRect(kx + kw - 15, ky + 15, 12, 20, randFn, 0.7, 0.5, 1)}
      </g>
    );
  };

  const drawToiletFixtures = (tx: number, ty: number, tw: number, th: number, randFn: () => number, isRotate: boolean) => {
    return (
      <g stroke="#444" fill="none" strokeWidth={0.8} opacity={0.6} key={`toilet-${tx}-${ty}`}>
        {/* Commode */}
        {isRotate ? (
          <>
            <rect x={tx + 5} y={ty + 10} width={8} height={14} rx={1} strokeWidth={0.8} />
            <ellipse cx={tx + 20} cy={ty + 17} rx={7} ry={5} strokeWidth={0.8} />
          </>
        ) : (
          <>
            <rect x={tx + 10} y={ty + 5} width={14} height={8} rx={1} strokeWidth={0.8} />
            <ellipse cx={tx + 17} cy={ty + 20} rx={5} ry={7} strokeWidth={0.8} />
          </>
        )}
        {/* Washbasin */}
        <ellipse cx={tx + tw - 15} cy={ty + th - 12} rx={8} ry={6} strokeWidth={0.8} />
      </g>
    );
  };

  const drawPots = (px: number, py: number, randFn: () => number) => {
    return (
      <g stroke="#3a3a3a" fill="none" strokeWidth={0.8} opacity={0.7} key={`pot-${px}-${py}`}>
        {/* Pot circle */}
        <circle cx={px} cy={py} r={6} />
        {/* Plant leaf strokes */}
        <path d={`M ${px},${py} Q ${px-8},${py-8} ${px-12},${py-4}`} />
        <path d={`M ${px},${py} Q ${px+8},${py-8} ${px+12},${py-4}`} />
        <path d={`M ${px},${py} Q ${px-2},${py-10} ${px},${py-15}`} />
      </g>
    );
  };

  // Math scale and coordinates (Fits exactly 30' x 40' ratio dynamically on the sheet)
  const layout = useMemo(() => {
    const randG = createSeededRandom(seed + '_G');
    const randT = createSeededRandom(seed + '_T');

    // Outer limits for drafting
    const fx = 65;
    const fy = 140;

    const tx = 480;
    const ty = 140;

    // Building footprint scaling: Map to exactly match the 30x40 structure layout
    // Fit building inside 330 width x 440 height (ratio matches 3:4 perfectly)
    const scale = 11; // 1 ft = 11 pixels
    const bw = 30 * scale; // 330
    const bh = 40 * scale; // 440

    // Coordinates of all rooms/compartments
    const rooms: any[] = [];
    const walls: any[] = [];
    const doors: any[] = [];
    const windows: any[] = [];

    // --- Vertical Divisions (3 Bays) ---
    const xSplit1 = fx + 10 * scale; // 110 px from left (fx + 110)
    const xSplit2 = fx + 14.5 * scale; // 160 px from left (fx + 160)
    const xSplit3 = fx + 17 * scale; // 187 px from left (fx + 187)

    // --- Horizontal Divisions ---
    const ySplit1 = fy + 11 * scale; // 121 px from top (fy + 121)
    const ySplit2 = fy + 22 * scale; // 242 px from top (fy + 242)
    const ySplit3 = fy + 26.5 * scale; // 292 px from top (fy + 292)
    const ySplit4 = fy + 30.5 * scale; // 336 px from top (fy + 336)

    // 1. Top Left: Bed Room (10'0" x 11'0")
    rooms.push({
      name: 'BED ROOM',
      size: '10\'0" x 11\'0"',
      x: fx,
      y: fy,
      w: xSplit1 - fx,
      h: ySplit1 - fy,
      fill: 'none',
      type: 'bed1',
    });

    // 2. Top Middle: Toilet (4'6" x 7'0")
    rooms.push({
      name: 'TOILET',
      size: '4\'6" x 7\'0"',
      x: xSplit1,
      y: fy,
      w: xSplit2 - xSplit1,
      h: fy + 7 * scale - fy,
      fill: 'none',
      type: 'toilet1',
    });

    // 3. Top Middle Corridor (Lobby/Passage)
    rooms.push({
      name: 'LOBBY',
      size: '',
      x: xSplit1,
      y: fy + 7 * scale,
      w: xSplit2 - xSplit1,
      h: ySplit1 - (fy + 7 * scale),
      fill: 'none',
    });

    // 4. Top Right: Bed Room (10'0" x 11'0")
    rooms.push({
      name: 'BED ROOM',
      size: '10\'0" x 11\'0"',
      x: xSplit2,
      y: fy,
      w: fx + bw - xSplit2,
      h: ySplit1 - fy,
      fill: 'none',
      type: 'bed2',
    });

    // 5. Center Left: Living (14'0" x 11'0")
    rooms.push({
      name: 'LIVING',
      size: '14\'0" x 11\'0"',
      x: fx,
      y: ySplit1,
      w: xSplit2 - fx,
      h: ySplit2 - ySplit1,
      fill: 'none',
      type: 'living',
    });

    // 6. Center Right: Dining (10'0" x 11'0")
    rooms.push({
      name: 'DINING',
      size: '10\'0" x 11\'0"',
      x: xSplit2,
      y: ySplit1,
      w: fx + bw - xSplit2,
      h: ySplit2 - ySplit1,
      fill: 'none',
      type: 'dining',
    });

    // 7. Middle: Staircase (UP)
    rooms.push({
      name: 'STAIRCASE',
      size: '',
      x: xSplit2 - 15,
      y: ySplit2,
      w: fx + bw - (xSplit2 - 15),
      h: ySplit3 - ySplit2,
      isStairs: true,
      type: 'stairs',
    });

    // 8. Lower Left: Toilet (7'0" x 4'6")
    rooms.push({
      name: 'TOILET',
      size: '7\'0" x 4\'6"',
      x: fx,
      y: ySplit3,
      w: xSplit1 - fx,
      h: ySplit4 - ySplit3,
      fill: 'none',
      type: 'toilet2',
    });

    // 9. Bottom Left: Kitchen (10'0" x 8'0")
    rooms.push({
      name: 'KITCHEN',
      size: '10\'0" x 8\'0"',
      x: fx,
      y: ySplit4,
      w: xSplit1 - fx,
      h: fy + bh - ySplit4,
      fill: 'none',
      type: 'kitchen',
    });

    // 10. Bottom Right: M.Bed Room (11'0" x 13'0")
    rooms.push({
      name: 'M.BED ROOM',
      size: '11\'0" x 13\'0"',
      x: xSplit3,
      y: ySplit3,
      w: fx + bw - xSplit3,
      h: fy + bh - ySplit3,
      fill: 'none',
      type: 'mbed',
    });

    // 11. Bottom Middle Corridor/Entrance path
    rooms.push({
      name: 'CORRIDOR',
      size: '',
      x: xSplit1,
      y: ySplit3,
      w: xSplit3 - xSplit1,
      h: fy + bh - ySplit3,
      fill: 'none',
    });

    // 12. Bottom Left Sitout projection (14'0" x 5'0")
    const sitoutY = fy + bh;
    const sitoutW = 15.5 * scale;
    const sitoutH = 5 * scale;
    rooms.push({
      name: 'SITOUT',
      size: '14\'0" x 5\'0"',
      x: fx,
      y: sitoutY,
      w: sitoutW,
      h: sitoutH,
      fill: 'none',
      type: 'sitout',
    });

    // Outer & inner wall lines drafting
    // Outer walls boundary
    walls.push({ x1: fx, y1: fy, x2: fx + bw, y2: fy }); // Top outer
    walls.push({ x1: fx + bw, y1: fy, x2: fx + bw, y2: fy + bh }); // Right outer
    walls.push({ x1: fx, y1: fy + bh, x2: fx + bw, y2: fy + bh }); // Bottom outer
    walls.push({ x1: fx, y1: fy, x2: fx, y2: fy + bh }); // Left outer

    // Inner partitions
    walls.push({ x1: xSplit1, y1: fy, x2: xSplit1, y2: ySplit1 }); // Top left bed wall
    walls.push({ x1: xSplit1, y1: fy, x2: xSplit2, y2: fy }); // Toilet top outer
    walls.push({ x1: xSplit2, y1: fy, x2: xSplit2, y2: ySplit3 }); // Main right vertical split
    walls.push({ x1: xSplit1, y1: fy + 7 * scale, x2: xSplit2, y2: fy + 7 * scale }); // Toilet bottom partition
    walls.push({ x1: fx, y1: ySplit1, x2: fx + bw, y2: ySplit1 }); // horizontal split 1 (Top rows/Middle rows)

    walls.push({ x1: fx, y1: ySplit2, x2: fx + bw, y2: ySplit2 }); // horizontal split 2 (Living/Dining bottom)
    walls.push({ x1: fx, y1: ySplit3, x2: fx + bw, y2: ySplit3 }); // horizontal split 3 (Stairs bottom)

    walls.push({ x1: xSplit1, y1: ySplit3, x2: xSplit1, y2: fy + bh }); // Bottom left split
    walls.push({ x1: xSplit3, y1: ySplit3, x2: xSplit3, y2: fy + bh }); // Bottom right split
    walls.push({ x1: fx, y1: ySplit4, x2: xSplit1, y2: ySplit4 }); // Toilet 2 bottom partition

    // Sitout boundary
    walls.push({ x1: fx, y1: sitoutY, x2: fx, y2: sitoutY + sitoutH });
    walls.push({ x1: fx, y1: sitoutY + sitoutH, x2: fx + sitoutW, y2: sitoutY + sitoutH });
    walls.push({ x1: fx + sitoutW, y1: sitoutY, x2: fx + sitoutW, y2: sitoutY + sitoutH });

    // Doors coordinates
    doors.push({ x: xSplit1, y: ySplit1 - 30, size: 18, orient: 'NW' }); // Bed 1 door
    doors.push({ x: xSplit2, y: ySplit1 - 30, size: 18, orient: 'NE' }); // Bed 2 door
    doors.push({ x: xSplit1, y: fy + 7 * scale - 12, size: 12, orient: 'NW' }); // Toilet 1 door
    doors.push({ x: fx + 15, y: ySplit3, size: 14, orient: 'SE' }); // Toilet 2 door
    doors.push({ x: xSplit1, y: fy + bh - 24, size: 18, orient: 'SW' }); // Kitchen door
    doors.push({ x: xSplit3, y: ySplit3 + 24, size: 18, orient: 'NE' }); // M. Bed door
    doors.push({ x: fx + sitoutW - 25, y: fy + bh, size: 22, orient: 'SE' }); // Main Entrance door from Sitout

    // Windows
    windows.push({ x1: fx + 25, y1: fy, x2: fx + 55, y2: fy, isVert: false }); // Bed 1 window
    windows.push({ x1: fx + bw - 55, y1: fy, x2: fx + bw - 25, y2: fy, isVert: false }); // Bed 2 window
    windows.push({ x1: xSplit1 + 10, y1: fy, x2: xSplit2 - 10, y2: fy, isVert: false }); // Toilet 1 window
    windows.push({ x1: fx, y1: ySplit1 + 30, x2: fx, y2: ySplit1 + 70, isVert: true }); // Living window
    windows.push({ x1: fx + bw, y1: ySplit1 + 35, x2: fx + bw, y2: ySplit1 + 65, isVert: true }); // Dining window
    windows.push({ x1: fx, y1: ySplit3 + 15, x2: fx, y2: ySplit3 + 30, isVert: true }); // Toilet 2 window
    windows.push({ x1: fx, y1: ySplit4 + 30, x2: fx, y2: ySplit4 + 60, isVert: true }); // Kitchen window
    windows.push({ x1: xSplit3 + 35, y1: fy + bh, x2: xSplit3 + 75, y2: fy + bh, isVert: false }); // M. Bed window

    // --- Terrace Plan Coordinates (Aligned to Floor Plan) ---
    const terraceWalls: any[] = [];
    const terraceRooms: any[] = [];
    const terraceDoors: any[] = [];

    // Outer boundaries
    terraceWalls.push({ x1: tx, y1: ty, x2: tx + bw, y2: ty }); // Top
    terraceWalls.push({ x1: tx + bw, y1: ty, x2: tx + bw, y2: ty + bh }); // Right
    terraceWalls.push({ x1: tx, y1: ty + bh, x2: tx + bw, y2: ty + bh }); // Bottom
    terraceWalls.push({ x1: tx, y1: ty, x2: tx, y2: ty + bh }); // Left

    // Stair Cabin (Matches layout middle right)
    const cabinX = tx + (xSplit2 - 15 - fx);
    const cabinY = ty + (ySplit2 - fy);
    const cabinW = bw - (xSplit2 - 15 - fx);
    const cabinH = ySplit3 - ySplit2;

    terraceRooms.push({
      name: 'STAIR CABIN',
      size: '',
      x: cabinX,
      y: cabinY,
      w: cabinW,
      h: cabinH,
      isStairs: true,
      type: 'cabin',
    });

    terraceRooms.push({
      name: 'OPEN TERRACE',
      size: '',
      x: tx,
      y: ty,
      w: bw,
      h: bh,
      isOpenTerrace: true,
    });

    // Stair cabin walls
    terraceWalls.push({ x1: cabinX, y1: cabinY, x2: cabinX + cabinW, y2: cabinY });
    terraceWalls.push({ x1: cabinX, y1: cabinY + cabinH, x2: cabinX + cabinW, y2: cabinY + cabinH });
    terraceWalls.push({ x1: cabinX, y1: cabinY, x2: cabinX, y2: cabinY + cabinH });

    // Stair cabin door to roof
    terraceDoors.push({ x: cabinX, y: cabinY + cabinH - 18, size: 14, orient: 'SW' });

    // Sitout projection outline at bottom
    terraceWalls.push({ x1: tx, y1: ty + bh, x2: tx, y2: ty + bh + sitoutH });
    terraceWalls.push({ x1: tx, y1: ty + bh + sitoutH, x2: tx + sitoutW, y2: ty + bh + sitoutH });
    terraceWalls.push({ x1: tx + sitoutW, y1: ty + bh, x2: tx + sitoutW, y2: ty + bh + sitoutH });

    return {
      fx, fy, tx, ty, bw, bh, scale,
      rooms, walls, doors, windows,
      terraceRooms, terraceWalls, terraceDoors,
      xSplit1, xSplit2, xSplit3,
      ySplit1, ySplit2, ySplit3, ySplit4,
      sitoutY, sitoutW, sitoutH
    };
  }, [seed]);

  // Dynamic Specs matching the exact wording and structure in the image
  const specs = useMemo(() => {
    // BHK is dynamic based on user selection, default is 2BHK
    const bhkLabel = plan.bedrooms + 'BHK';
    // Cost calculation (Lakhs)
    const costText = plan.cost >= 10000000 
      ? `${(plan.cost / 10000000).toFixed(1)} Cr` 
      : `${(plan.cost / 100000).toFixed(0)} LAKHS`;

    return [
      { label: 'PLOT SIZE', value: `:  30'0" x 40'0"` },
      { label: 'BUILT UP AREA', value: `:  ${plan.area} SQ.FT` },
      { label: 'FACING', value: `:  ${plan.vastuPreference.split(' ')[0].toUpperCase()}` },
      { label: 'BHK', value: `:  ${bhkLabel}` },
      { label: 'ESTIMATED COST', value: `:  ${costText}` },
      { divider: true },
      { label: 'FOUNDATION', value: ':  RCC Footing' },
      { label: 'STRUCTURE', value: ':  RCC FRAME STRUCTURE' },
      { label: 'WALL', value: ':  9" BRICK WALL' },
      { label: 'PLASTER', value: ':  INTERNAL - 12mm\n   EXTERNAL - 15mm' },
      { label: 'FLOORING', value: ':  VITRIFIED TILES' },
      { label: 'DOORS', value: ':  MAIN DOOR - TEAK WOOD\n   INTERNAL DOORS - FLUSH DOOR' },
      { label: 'WINDOWS', value: ':  UPVC / ALUMINIUM' },
      { label: 'KITCHEN', value: ':  GRANITE PLATFORM\n   WITH SS SINK' },
      { label: 'TOILET', value: ':  CERAMIC TILES UPTO 7\'0" HT' },
      { label: 'WATER SUPPLY', value: ':  BOREWELL' },
      { label: 'OVERHEAD TANK', value: ':  1000 LTR' },
    ];
  }, [plan]);

  return (
    <div className="w-full bg-white border border-gray-200 rounded-[2.5rem] p-6 shadow-xl relative overflow-hidden flex flex-col items-center">
      {/* Load hand-drawn font styling */}
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Architects+Daughter&display=swap');
        .sketch-txt {
          font-family: 'Architects Daughter', 'Caveat', 'Segoe Print', cursive, sans-serif;
          fill: #1a1a1a;
        }
        .sketch-title {
          font-family: 'Architects Daughter', 'Caveat', 'Segoe Print', cursive, sans-serif;
          fill: #111111;
          font-weight: 800;
        }
        .sketch-grid {
          stroke: #d0d0d0;
          stroke-width: 0.5;
          opacity: 0.15;
        }
      `}} />

      <svg
        id="architectural-sketch-sheet"
        viewBox={`0 0 ${sheetWidth} ${sheetHeight}`}
        width="100%"
        height="100%"
        className="w-full h-auto drop-shadow-md select-none"
        style={{ background: '#fcfbf9' }}
      >
        <defs>
          <filter id="pencil-distortion" x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence type="fractalNoise" opacity="0.9" baseFrequency="0.05" numOctaves="4" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="2.5" xChannelSelector="R" yChannelSelector="G" />
          </filter>

          <pattern id="pencil-hatch-light" width="8" height="8" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
            <line x1="0" y1="0" x2="0" y2="8" stroke="#444444" strokeWidth="0.6" opacity="0.3" filter="url(#pencil-distortion)" />
          </pattern>
          <pattern id="pencil-hatch-med" width="6" height="6" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
            <line x1="0" y1="0" x2="0" y2="6" stroke="#333333" strokeWidth="0.8" opacity="0.45" filter="url(#pencil-distortion)" />
          </pattern>
        </defs>

        {/* Textured paper outline */}
        <rect width={sheetWidth} height={sheetHeight} fill="#faf8f4" />
        <g className="sketch-grid">
          {Array.from({ length: 40 }).map((_, i) => (
            <line key={`x-${i}`} x1={i * 30} y1={0} x2={i * 30} y2={sheetHeight} />
          ))}
          {Array.from({ length: 30 }).map((_, i) => (
            <line key={`y-${i}`} x1={0} y1={i * 30} x2={sheetWidth} y2={i * 30} />
          ))}
        </g>

        {/* Double Border Frame */}
        <g filter="url(#pencil-distortion)">
          <rect x={15} y={15} width={sheetWidth - 30} height={sheetHeight - 30} fill="none" stroke="#2c2c2c" strokeWidth={1.5} opacity={0.8} />
          <rect x={20} y={20} width={sheetWidth - 40} height={sheetHeight - 40} fill="none" stroke="#3c3c3c" strokeWidth={0.8} opacity={0.6} />
        </g>

        {/* Header Block (Displays title and logo) */}
        <g transform="translate(45, 45)" filter="url(#pencil-distortion)">
          <g stroke="#111" strokeWidth={1.5} fill="none" opacity={0.9}>
            <path d="M 0,25 L 20,5 L 40,25 Z M 5,25 L 5,35 L 35,35 L 35,25" />
            <rect x={12} y={23} width={7} height={12} />
            <circle cx={27} cy={16} r={2.5} />
            <line x1="-5" y1="35" x2="45" y2="35" strokeWidth={0.6} opacity={0.5} strokeDasharray="3,3" />
            <line x1="20" y1="0" x2="20" y2="40" strokeWidth={0.6} opacity={0.5} strokeDasharray="3,3" />
          </g>
          <text x={55} y={22} className="sketch-title text-2xl font-black" style={{ letterSpacing: '0.5px' }}>
            ARCHINT – Architectural Design
          </text>
          <text x={55} y={35} className="sketch-txt text-xs" style={{ fill: '#555555' }}>
            AI-Powered Architectural Blueprint
          </text>

          {/* North Compass arrow */}
          <g transform="translate(1020, 0)" stroke="#222" strokeWidth={1} fill="none" opacity={0.85}>
            <circle cx={20} cy={15} r={18} />
            <path d="M 20,-2 L 23,15 L 20,12 L 17,15 Z" fill="#111" />
            <path d="M 20,28 L 23,15 L 20,12 L 17,15 Z" />
            <text x={17} y={-8} className="sketch-txt font-extrabold text-[10px] fill-[#111]">N</text>
          </g>
        </g>

        {/* Section Titles */}
        <g filter="url(#pencil-distortion)">
          <text x={layout.fx + layout.bw / 2} y={115} textAnchor="middle" className="sketch-title text-lg">FLOOR PLAN</text>
          <text x={layout.tx + layout.bw / 2} y={115} textAnchor="middle" className="sketch-title text-lg">TERRACE PLAN</text>
          <text x={950} y={115} textAnchor="middle" className="sketch-title text-lg">SPECIFICATIONS</text>
        </g>

        {/* Draft drawings for Floor and Terrace */}
        <g filter="url(#pencil-distortion)">
          {/* ========================================================
              A. FLOOR PLAN
             ======================================================== */}
          {/* Main outer walls double line */}
          {drawSketchyRect(layout.fx, layout.fy, layout.bw, layout.bh, randSheet, 1.4, 0.9, 4)}
          {drawSketchyRect(layout.fx + 4, layout.fy + 4, layout.bw - 8, layout.bh - 8, randSheet, 0.7, 0.5, 2)}

          {/* Render individual room boxes */}
          {layout.rooms.map((room, rIdx) => {
            const rx = room.x;
            const ry = room.y;
            const rw = room.w;
            const rh = room.h;

            return (
              <g key={`f-room-${rIdx}`}>
                {/* Wall outlines for the room box */}
                {drawSketchyRect(rx, ry, rw, rh, randSheet, 1.2, 0.85, 3)}
                {drawSketchyRect(rx + 3, ry + 3, rw - 6, rh - 6, randSheet, 0.6, 0.5, 1)}

                {/* Shading fill for wet rooms like toilets */}
                {room.type?.includes('toilet') && (
                  <rect x={rx + 4} y={ry + 4} width={rw - 8} height={rh - 8} fill="url(#pencil-hatch-light)" />
                )}

                {/* Labels and sizes */}
                {!room.isStairs && (
                  <g>
                    <text x={rx + rw / 2} y={ry + rh / 2 - 4} textAnchor="middle" className="sketch-txt text-[10px] font-extrabold" style={{ fill: '#111' }}>
                      {room.name}
                    </text>
                    {room.size && (
                      <text x={rx + rw / 2} y={ry + rh / 2 + 8} textAnchor="middle" className="sketch-txt text-[9px]" style={{ fill: '#555' }}>
                        {room.size}
                      </text>
                    )}
                  </g>
                )}

                {/* Draw staircase */}
                {room.isStairs && (
                  <g key="f-staircase">
                    {/* Horizontal steps inside staircase */}
                    {Array.from({ length: 9 }).map((_, stepIdx) => {
                      const stepX = rx + (rw / 9) * stepIdx;
                      return drawSketchyLine(stepX, ry, stepX, ry + rh, randSheet, 0.8, 0.65, 1);
                    })}
                    {/* Split line */}
                    {drawSketchyLine(rx, ry + rh / 2, rx + rw, ry + rh / 2, randSheet, 0.6, 0.5, 0)}
                    {/* Ascending arrow path */}
                    <path d={`M ${rx + 10},${ry + rh * 0.75} L ${rx + rw - 15},${ry + rh * 0.75} L ${rx + rw - 15},${ry + rh * 0.25} L ${rx + 15},${ry + rh * 0.25}`} stroke="#333" strokeWidth={1} fill="none" />
                    <polygon points={`${rx + 15},${ry + rh * 0.25 - 3} ${rx + 15},${ry + rh * 0.25 + 3} ${rx + 8},${ry + rh * 0.25}`} fill="#333" />
                    <text x={rx + 15} y={ry + rh * 0.88} className="sketch-txt text-[8px] font-bold">UP</text>
                  </g>
                )}

                {/* Render Furniture Outline dynamically based on Room Type */}
                {room.type === 'bed1' && drawBed(rx + 8, ry + 15, 60, 60, false, randSheet)}
                {room.type === 'bed2' && drawBed(rx + rw - 68, ry + 15, 60, 60, false, randSheet)}
                {room.type === 'mbed' && drawBed(rx + rw - 68, ry + rh - 75, 60, 60, false, randSheet)}
                {room.type === 'living' && drawSofaSet(rx + 35, ry + 15, randSheet)}
                {room.type === 'dining' && drawDiningTable(rx + 25, ry + 25, randSheet)}
                {room.type === 'kitchen' && drawKitchenCounters(rx, ry, rw, rh, randSheet)}
                {room.type === 'toilet1' && drawToiletFixtures(rx, ry, rw, rh, randSheet, false)}
                {room.type === 'toilet2' && drawToiletFixtures(rx, ry, rw, rh, randSheet, true)}
                {room.type === 'sitout' && (
                  <g key="sitout-pots">
                    {drawPots(rx + 15, ry + rh - 12, randSheet)}
                    {drawPots(rx + rw - 15, ry + rh - 12, randSheet)}
                    {drawPots(rx + rw / 2, ry + rh + 8, randSheet)}
                    {/* steps */}
                    {drawSketchyLine(rx + rw - 35, ry + rh, rx + rw - 5, ry + rh, randSheet, 1, 0.7, 1)}
                    {drawSketchyLine(rx + rw - 35, ry + rh + 4, rx + rw - 5, ry + rh + 4, randSheet, 1, 0.7, 1)}
                  </g>
                )}
              </g>
            );
          })}

          {/* Additional layout partitions */}
          {layout.walls.map((wall, wIdx) =>
            drawSketchyLine(wall.x1, wall.y1, wall.x2, wall.y2, randSheet, 1.3, 0.85, 3)
          )}

          {/* Doors */}
          {layout.doors.map((door, dIdx) =>
            drawSketchyDoor(door.x, door.y, door.size, door.orient, randSheet)
          )}

          {/* Windows */}
          {layout.windows.map((win, wIdx) =>
            drawSketchyWindow(win.x1, win.y1, win.x2, win.y2, win.isVert, randSheet)
          )}

          {/* Dimension guidelines around Floor Plan */}
          {/* Top dimension (30'-0") */}
          {drawSketchyLine(layout.fx, layout.fy - 25, layout.fx + layout.bw, layout.fy - 25, randSheet, 0.6, 0.6, 12)}
          {/* Dimension ticks */}
          {drawSketchyLine(layout.fx - 4, layout.fy - 29, layout.fx + 4, layout.fy - 21, randSheet, 0.8, 0.7, 0)}
          {drawSketchyLine(layout.fx + layout.bw - 4, layout.fy - 29, layout.fx + layout.bw + 4, layout.fy - 21, randSheet, 0.8, 0.7, 0)}
          <text x={layout.fx + layout.bw / 2} y={layout.fy - 32} textAnchor="middle" className="sketch-txt text-[10px] font-extrabold">30'-0"</text>

          {/* Left dimension (40'-0") */}
          {drawSketchyLine(layout.fx - 25, layout.fy, layout.fx - 25, layout.fy + layout.bh, randSheet, 0.6, 0.6, 12)}
          {drawSketchyLine(layout.fx - 29, layout.fy - 4, layout.fx - 21, layout.fy + 4, randSheet, 0.8, 0.7, 0)}
          {drawSketchyLine(layout.fx - 29, layout.fy + layout.bh - 4, layout.fx - 21, layout.fy + layout.bh + 4, randSheet, 0.8, 0.7, 0)}
          <text x={layout.fx - 42} y={layout.fy + layout.bh / 2} textAnchor="middle" className="sketch-txt text-[10px] font-extrabold" transform={`rotate(-90 ${layout.fx - 42} ${layout.fy + layout.bh / 2})`}>40'-0"</text>

          {/* ========================================================
              B. TERRACE PLAN
             ======================================================== */}
          {/* Outer building outline */}
          {drawSketchyRect(layout.tx, layout.ty, layout.bw, layout.bh, randSheet, 1.4, 0.9, 4)}
          {drawSketchyRect(layout.tx + 4, layout.ty + 4, layout.bw - 8, layout.bh - 8, randSheet, 0.7, 0.5, 2)}

          {/* Sitout projection outline */}
          {drawSketchyLine(layout.tx, layout.sitoutY, layout.tx, layout.sitoutY + layout.sitoutH, randSheet, 1, 0.7, 1)}
          {drawSketchyLine(layout.tx, layout.sitoutY + layout.sitoutH, layout.tx + layout.sitoutW, layout.sitoutY + layout.sitoutH, randSheet, 1, 0.7, 1)}
          {drawSketchyLine(layout.tx + layout.sitoutW, layout.sitoutY, layout.tx + layout.sitoutW, layout.sitoutY + layout.sitoutH, randSheet, 1, 0.7, 1)}

          {/* Stair Cabin box */}
          {layout.terraceRooms.map((room, rIdx) => {
            const rx = room.x;
            const ry = room.y;
            const rw = room.w;
            const rh = room.h;

            if (room.isStairs) {
              return (
                <g key={`t-cabin-${rIdx}`}>
                  {drawSketchyRect(rx, ry, rw, rh, randSheet, 1.2, 0.85, 3)}
                  {drawSketchyRect(rx + 3, ry + 3, rw - 6, rh - 6, randSheet, 0.6, 0.5, 1)}
                  
                  {/* Stair steps (DN arrow) */}
                  {Array.from({ length: 9 }).map((_, stepIdx) => {
                    const stepX = rx + (rw / 9) * stepIdx;
                    return drawSketchyLine(stepX, ry, stepX, ry + rh, randSheet, 0.8, 0.65, 1);
                  })}
                  {drawSketchyLine(rx, ry + rh / 2, rx + rw, ry + rh / 2, randSheet, 0.6, 0.5, 0)}
                  <path d={`M ${rx + rw - 15},${ry + rh * 0.25} L ${rx + 15},${ry + rh * 0.25} L ${rx + 15},${ry + rh * 0.75} L ${rx + rw - 10},${ry + rh * 0.75}`} stroke="#333" strokeWidth={1} fill="none" />
                  <polygon points={`${rx + rw - 15},${ry + rh * 0.75 - 3} ${rx + rw - 15},${ry + rh * 0.75 + 3} ${rx + rw - 8},${ry + rh * 0.75}`} fill="#333" />
                  <text x={rx + 8} y={ry + rh * 0.38} className="sketch-txt text-[8px] font-bold">DN</text>
                </g>
              );
            }

            if (room.isOpenTerrace) {
              return (
                <text key={`t-open-${rIdx}`} x={rx + rw / 2 - 30} y={ry + rh / 2} className="sketch-title text-[10px] font-extrabold" style={{ fill: '#333', letterSpacing: '0.5px' }}>
                  OPEN TERRACE
                </text>
              );
            }
            return null;
          })}

          {/* Terrace walls and doors */}
          {layout.terraceWalls.map((wall, wIdx) =>
            drawSketchyLine(wall.x1, wall.y1, wall.x2, wall.y2, randSheet, 1.3, 0.85, 3)
          )}
          {layout.terraceDoors.map((door, dIdx) =>
            drawSketchyDoor(door.x, door.y, door.size, door.orient, randSheet)
          )}

          {/* ========================================================
              C. SPECIFICATIONS PANEL
             ======================================================== */}
          {/* Outer Table container */}
          {drawSketchyRect(830, 140, 310, 640, randSheet, 1.3, 0.8, 4)}

          <g transform="translate(845, 175)">
            {specs.map((spec, sIdx) => {
              const y = sIdx * 34;

              // Separator line
              if (spec.divider) {
                return (
                  <g key={`spec-div-${sIdx}`}>
                    {drawSketchyLine(-5, y - 10, 285, y - 10, randSheet, 0.6, 0.4, 2)}
                  </g>
                );
              }

              // Multi-line values formatting
              const lines = spec.value.split('\n');

              return (
                <g key={`spec-row-${sIdx}`}>
                  {/* Spec key */}
                  <text x={0} y={y} className="sketch-title text-[10px] font-extrabold" style={{ fill: '#333333' }}>
                    {spec.label}
                  </text>
                  {/* Spec value */}
                  {lines.map((line, lIdx) => (
                    <text key={lIdx} x={115} y={y + (lIdx * 12)} className="sketch-txt text-[9px] font-bold" style={{ fill: '#111' }}>
                      {line}
                    </text>
                  ))}
                </g>
              );
            })}
          </g>
        </g>
      </svg>

      {/* Sheet Metadata / Action Panel */}
      <div className="w-full flex justify-between items-center mt-4 text-[10px] text-gray-500 font-sans px-2">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#4CAF50] inline-block animate-pulse"></span>
          Dynamic blueprint engine configured to custom specifications
        </span>
        <button
          onClick={() => {
            const svgElement = document.getElementById('architectural-sketch-sheet');
            if (svgElement) {
              const svgString = new XMLSerializer().serializeToString(svgElement);
              const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
              const svgUrl = URL.createObjectURL(svgBlob);
              const downloadLink = document.createElement('a');
              downloadLink.href = svgUrl;
              downloadLink.download = `${plan.title.replace(/\s+/g, '_')}_architect_sketch.svg`;
              document.body.appendChild(downloadLink);
              downloadLink.click();
              document.body.removeChild(downloadLink);
            }
          }}
          className="text-[#4CAF50] font-black uppercase hover:underline"
        >
          💾 Download Architect Sketch (SVG)
        </button>
      </div>
    </div>
  );
};
