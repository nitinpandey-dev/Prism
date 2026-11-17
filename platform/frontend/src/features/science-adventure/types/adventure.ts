export type SurfaceId = 'concrete' | 'ice' | 'grass' | 'wood';

export interface SurfaceProperties {
  id: SurfaceId;
  name: string;
  frictionCoeff: number; // Internal physics calculation only - never shown in game HUD!
  rollingResistance: number;
  skateSoundType: string;
  color: string;
  visualGrip: 'High Grip' | 'Normal Grip' | 'Low Grip' | 'Very Slippery';
}

export interface MissionDefinition {
  id: string;
  number: number;
  title: string;
  tagline: string;
  story: string;
  objective: string;
  hint: string;
  thumbnail: string;
  icon: string;
  targetSurface: SurfaceId;
  discoveryId: string;
  startPosition: [number, number, number];
  startRotation: number;
}

export interface DiscoveryDefinition {
  id: string;
  conceptName: string;
  headline: string;
  explanation: string;
  funFact: string;
  icon: string;
  color: string;
}

export interface AchievementDefinition {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  category: 'exploration' | 'persistence' | 'mastery';
}

export interface WorldDefinition {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  status: 'playable' | 'coming_soon';
  icon: string;
  accentColor: string;
  discoveriesCount: number;
  description: string;
  heroImage?: string;
}

export type AdventureScreen = 'hub' | 'skating-world' | 'discoveries' | 'achievements' | 'settings';
export type GameplayMode = 'free-play' | 'mission';
export type MissionState = 'idle' | 'briefing' | 'playing' | 'failed' | 'success';

export const SURFACES_INFO: Record<SurfaceId, SurfaceProperties> = {
  concrete: {
    id: 'concrete',
    name: 'Smooth Concrete',
    frictionCoeff: 0.40,
    rollingResistance: 0.12,
    skateSoundType: 'concrete',
    color: '#94a3b8',
    visualGrip: 'Normal Grip',
  },
  ice: {
    id: 'ice',
    name: 'Icy Surface',
    frictionCoeff: 0.12,
    rollingResistance: 0.02,
    skateSoundType: 'ice',
    color: '#38bdf8',
    visualGrip: 'Very Slippery',
  },
  grass: {
    id: 'grass',
    name: 'Park Grass',
    frictionCoeff: 0.85,
    rollingResistance: 0.55,
    skateSoundType: 'grass',
    color: '#22c55e',
    visualGrip: 'High Grip',
  },
  wood: {
    id: 'wood',
    name: 'Wooden Ramp',
    frictionCoeff: 0.35,
    rollingResistance: 0.15,
    skateSoundType: 'wood',
    color: '#d97706',
    visualGrip: 'Normal Grip',
  },
};

export const MISSIONS: MissionDefinition[] = [
  {
    id: 'mission-1',
    number: 1,
    title: 'The Slippery Surprise',
    tagline: 'Experience what happens when grip disappears!',
    story: 'Alex is cruising through the skate park when suddenly a sparkling icy patch appears ahead! Can you steer across the park safely without spinning out?',
    objective: 'Skate past the icy pond to the target flag without wiping out on the ice.',
    hint: 'If you go too fast on ice or turn sharply, you will slide out! Try coasting gently.',
    thumbnail: '⛸️',
    icon: '❄️',
    targetSurface: 'ice',
    discoveryId: 'disc-friction',
    startPosition: [0, 0, -22],
    startRotation: 0,
  },
  {
    id: 'mission-2',
    number: 2,
    title: 'Stop Before the Ball',
    tagline: 'Time your stop before disaster strikes!',
    story: 'A runaway football just rolled onto the path at the crosswalk! If you hit it, you will tumble. Build up speed, then use your brakes to stop safely in the green zone right before the ball!',
    objective: 'Skate towards the football and press BRAKE to stop completely inside the green safe zone.',
    hint: 'Higher speeds take a longer distance to stop! Hit Space (or the Brake button) early enough.',
    thumbnail: '⚽',
    icon: '🛑',
    targetSurface: 'concrete',
    discoveryId: 'disc-stopping-distance',
    startPosition: [0, 0, -20],
    startRotation: 0,
  },
  {
    id: 'mission-3',
    number: 3,
    title: 'The Changing Track',
    tagline: 'Different surfaces mean different grip!',
    story: 'The grand park circuit winds through concrete, over a wooden boardwalk, through a patch of grass, and across a frozen stretch. Each surface feels completely different!',
    objective: 'Skate along the multi-surface circuit and reach the finish arch.',
    hint: 'Notice how grass slows you down immediately, while ice lets you slide effortlessly.',
    thumbnail: '🏁',
    icon: '🔄',
    targetSurface: 'grass',
    discoveryId: 'disc-surfaces',
    startPosition: [-6, 0, -24],
    startRotation: 0,
  },
  {
    id: 'mission-4',
    number: 4,
    title: 'The Downhill Challenge',
    tagline: 'Gravity wants you to go fast! Can you control it?',
    story: 'A gentle slope leads down towards the park fountain. As Alex skates down the ramp, speed builds up quickly! Can you control your descent and stop right by the bench?',
    objective: 'Ride down the slope, control your speed with braking, and park safely at the bottom marker.',
    hint: 'Gravity pulls you down the slope! Light tap-braking will keep your speed safe.',
    thumbnail: '⛰️',
    icon: '⚡',
    targetSurface: 'wood',
    discoveryId: 'disc-slopes-gravity',
    startPosition: [6, 1.5, -15],
    startRotation: 0,
  },
  {
    id: 'mission-5',
    number: 5,
    title: 'Park Star Collector',
    tagline: 'Master all surfaces and collect the 3 Adventure Stars!',
    story: 'Three golden Adventure Stars are scattered across the park: one on the wooden ramp, one beside the icy pond, and one in the grass garden. Collect all three to prove your mastery of movement!',
    objective: 'Collect all 3 Adventure Stars scattered across different surfaces in the park.',
    hint: 'Adapt your steering and speed on each surface to reach all 3 stars safely!',
    thumbnail: '⭐',
    icon: '🏆',
    targetSurface: 'concrete',
    discoveryId: 'disc-motion-mastery',
    startPosition: [0, 0, 0],
    startRotation: 0,
  },
];

export const DISCOVERIES: Record<string, DiscoveryDefinition> = {
  'disc-friction': {
    id: 'disc-friction',
    conceptName: 'Friction & Grip',
    headline: 'Why Ice Makes You Slide!',
    explanation:
      'You noticed that your skates slipped easily on the ice! That is because smooth ice gives your wheels very little grip. Scientists call this grip between two touching surfaces FRICTION. More grip means more control, while less grip makes you slide!',
    funFact: 'Without friction, you could never walk, run, or skate — your feet would just slip forever in one place!',
    icon: '❄️',
    color: '#0284c7',
  },
  'disc-stopping-distance': {
    id: 'disc-stopping-distance',
    conceptName: 'Stopping Distance',
    headline: 'Why Faster Speed Needs More Room to Stop!',
    explanation:
      'When Alex skates faster, pushing the brake does not stop you instantly. Your body has momentum that wants to keep moving forward. The faster you go, the further you will travel before your brakes bring you to a complete halt!',
    funFact: 'If you double your speed, it actually takes four times as much distance to stop!',
    icon: '🛑',
    color: '#dc2626',
  },
  'disc-surfaces': {
    id: 'disc-surfaces',
    conceptName: 'Surface Resistance',
    headline: 'Different Materials, Different Forces!',
    explanation:
      'Grass grabbed Alex’s wheels and made stopping easy, while smooth concrete let you glide smoothly. Rough materials produce more friction against moving wheels than smooth, polished materials!',
    funFact: 'Bicycle and car tires have rubber treads carved into them specifically to increase grip on wet roads!',
    icon: '🌱',
    color: '#16a34a',
  },
  'disc-slopes-gravity': {
    id: 'disc-slopes-gravity',
    conceptName: 'Gravity & Slopes',
    headline: 'The Invisible Pull That Speeds You Up!',
    explanation:
      'When you skated down the ramp, you sped up even without pushing! Earth’s gravity pulls everything downward. On a slope, part of that downward pull pushes you forward down the hill!',
    funFact: 'Roller coasters use gravity to power almost their entire ride after that first big climb!',
    icon: '⛰️',
    color: '#d97706',
  },
  'disc-motion-mastery': {
    id: 'disc-motion-mastery',
    conceptName: 'Motion & Control',
    headline: 'You Are a Master of Movement!',
    explanation:
      'By balancing your speed, steering, and braking across concrete, ice, grass, and ramps, you proved that you understand how forces work in the real world!',
    funFact: 'Astronauts in space have to train for zero-friction movement because there is no ground grip in orbit!',
    icon: '⭐',
    color: '#8b5cf6',
  },
};

export const ACHIEVEMENTS: AchievementDefinition[] = [
  {
    id: 'ach-curious-explorer',
    title: 'Curious Explorer',
    description: 'Skated on all four different park surfaces (concrete, ice, grass, wood).',
    icon: '🧭',
    category: 'exploration',
  },
  {
    id: 'ach-never-give-up',
    title: 'Never Give Up',
    description: 'Retried a mission after slipping or stumbling and successfully solved it!',
    icon: '💪',
    category: 'persistence',
  },
  {
    id: 'ach-science-detective',
    title: 'Science Detective',
    description: 'Discovered the secret of friction and surface grip through experience.',
    icon: '🔍',
    category: 'mastery',
  },
  {
    id: 'ach-smart-skater',
    title: 'Smart Skater',
    description: 'Successfully timed your braking to stop safely right before the football.',
    icon: '⚽',
    category: 'mastery',
  },
  {
    id: 'ach-champion',
    title: 'Skate Park Champion',
    description: 'Completed all 5 missions and unlocked all Science Discoveries!',
    icon: '🏆',
    category: 'mastery',
  },
];

export const ACTIVITY_WORLDS: WorldDefinition[] = [
  {
    id: 'skating-world',
    title: 'Skating World',
    subtitle: 'The Great Park Adventure',
    category: 'Physics & Motion',
    status: 'playable',
    icon: '⛸️',
    accentColor: '#38bdf8',
    discoveriesCount: 5,
    description: 'Put on your roller skates and explore real-world grip, slipping, deceleration, and slopes in a sunny outdoor park!',
  },
  {
    id: 'cycling-world',
    title: 'Cycling World',
    subtitle: 'Mountain Bike Trail',
    category: 'Balance & Momentum',
    status: 'coming_soon',
    icon: '🚲',
    accentColor: '#4ade80',
    discoveriesCount: 4,
    description: 'Discover how speed creates balance, how gears trade force for distance, and how tires grip muddy paths.',
  },
  {
    id: 'football-world',
    title: 'Football World',
    subtitle: 'Stadium Kickoff',
    category: 'Force & Trajectory',
    status: 'coming_soon',
    icon: '⚽',
    accentColor: '#facc15',
    discoveriesCount: 4,
    description: 'Kick balls into targets, see how launch angles bend trajectories, and watch how ball spin curves shots in air!',
  },
  {
    id: 'kite-world',
    title: 'Kite Flying World',
    subtitle: 'Windy Coastline',
    category: 'Wind & Aerodynamics',
    status: 'coming_soon',
    icon: '🪁',
    accentColor: '#a855f7',
    discoveriesCount: 4,
    description: 'Feel the lift of the coastal breeze, adjust kite angles to catch the wind, and balance tension on the string.',
  },
  {
    id: 'cooking-world',
    title: 'Cooking World',
    subtitle: 'Kitchen Chemistry',
    category: 'Heat & States of Matter',
    status: 'coming_soon',
    icon: '🍳',
    accentColor: '#f97316',
    discoveriesCount: 4,
    description: 'Melt chocolate, boil water, observe steam and bubbles, and discover how heat energy transforms everyday food!',
  },
];
