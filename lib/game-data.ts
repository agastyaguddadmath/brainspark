import type { AgeGroup } from "./auth-context"
import {
  Calculator,
  FlaskConical,
  BookOpen,
  Code2,
  Eye,
  Brain,
  Palette,
  Music,
  Globe,
  type LucideIcon,
} from "lucide-react"

export interface GameCategory {
  id: string
  name: string
  description: string
  icon: LucideIcon
  color: string
  bgColor: string
  gameCount: number
  comingSoon?: boolean
}

export interface Game {
  id: string
  name: string
  description: string
  category: string
  ageGroups: AgeGroup[]
  difficulty: "easy" | "medium" | "hard"
  duration: string
  maxScore: number
  playCount: number
  rating: number
  thumbnail: string
  guestAllowed: boolean
}

export const categories: GameCategory[] = [
  {
    id: "math",
    name: "Math",
    description: "Numbers, arithmetic, geometry, and problem-solving adventures",
    icon: Calculator,
    color: "text-[oklch(0.55_0.2_250)]",
    bgColor: "bg-[oklch(0.55_0.2_250/0.1)]",
    gameCount: 6,
  },
  {
    id: "science",
    name: "Science",
    description: "Explore physics, chemistry, biology, and the natural world",
    icon: FlaskConical,
    color: "text-[oklch(0.7_0.18_150)]",
    bgColor: "bg-[oklch(0.7_0.18_150/0.1)]",
    gameCount: 5,
  },
  {
    id: "language",
    name: "Language Arts",
    description: "Reading, writing, vocabulary, and creative expression",
    icon: BookOpen,
    color: "text-[oklch(0.7_0.2_50)]",
    bgColor: "bg-[oklch(0.7_0.2_50/0.1)]",
    gameCount: 5,
  },
  {
    id: "coding",
    name: "Coding",
    description: "Learn programming concepts through block-based and visual coding",
    icon: Code2,
    color: "text-[oklch(0.65_0.2_330)]",
    bgColor: "bg-[oklch(0.65_0.2_330/0.1)]",
    gameCount: 4,
  },
  {
    id: "identification",
    name: "Identification",
    description: "Recognize colors, shapes, animals, objects, and patterns",
    icon: Eye,
    color: "text-[oklch(0.6_0.15_200)]",
    bgColor: "bg-[oklch(0.6_0.15_200/0.1)]",
    gameCount: 4,
  },
  {
    id: "iq",
    name: "IQ Assessment",
    description: "Cognitive ability tests including logic, memory, and spatial reasoning",
    icon: Brain,
    color: "text-[oklch(0.55_0.2_250)]",
    bgColor: "bg-[oklch(0.55_0.2_250/0.1)]",
    gameCount: 3,
  },
  {
    id: "art",
    name: "Art & Creativity",
    description: "Drawing, painting, music, and creative expression activities",
    icon: Palette,
    color: "text-[oklch(0.7_0.2_50)]",
    bgColor: "bg-[oklch(0.7_0.2_50/0.1)]",
    gameCount: 0,
    comingSoon: true,
  },
  {
    id: "music",
    name: "Music",
    description: "Learn instruments, rhythm, melody, and music theory",
    icon: Music,
    color: "text-[oklch(0.65_0.2_330)]",
    bgColor: "bg-[oklch(0.65_0.2_330/0.1)]",
    gameCount: 0,
    comingSoon: true,
  },
  {
    id: "geography",
    name: "Geography",
    description: "Explore countries, continents, cultures, and landmarks",
    icon: Globe,
    color: "text-[oklch(0.7_0.18_150)]",
    bgColor: "bg-[oklch(0.7_0.18_150/0.1)]",
    gameCount: 0,
    comingSoon: true,
  },
]

export const games: Game[] = [
  // Math Games
  {
    id: "math-addition",
    name: "Addition Adventure",
    description: "Master addition with fun animated number challenges",
    category: "math",
    ageGroups: ["kindergarten", "below8"],
    difficulty: "easy",
    duration: "5 min",
    maxScore: 100,
    playCount: 12450,
    rating: 4.8,
    thumbnail: "math-addition",
    guestAllowed: true,
  },
  {
    id: "math-multiplication",
    name: "Multiply Mania",
    description: "Race against time to solve multiplication problems",
    category: "math",
    ageGroups: ["below8", "below14"],
    difficulty: "medium",
    duration: "8 min",
    maxScore: 100,
    playCount: 8920,
    rating: 4.6,
    thumbnail: "math-multiply",
    guestAllowed: true,
  },
  {
    id: "math-geometry",
    name: "Shape Explorer",
    description: "Discover geometric shapes, angles, and spatial relationships",
    category: "math",
    ageGroups: ["below8", "below14"],
    difficulty: "medium",
    duration: "10 min",
    maxScore: 100,
    playCount: 7340,
    rating: 4.5,
    thumbnail: "math-geometry",
    guestAllowed: false,
  },
  {
    id: "math-fractions",
    name: "Fraction Frenzy",
    description: "Learn fractions through pizza slicing and pie charts",
    category: "math",
    ageGroups: ["below8", "below14"],
    difficulty: "hard",
    duration: "12 min",
    maxScore: 100,
    playCount: 5210,
    rating: 4.3,
    thumbnail: "math-fractions",
    guestAllowed: false,
  },
  {
    id: "math-counting",
    name: "Count with Me",
    description: "Learn to count with colorful animations and sounds",
    category: "math",
    ageGroups: ["kindergarten"],
    difficulty: "easy",
    duration: "5 min",
    maxScore: 100,
    playCount: 18200,
    rating: 4.9,
    thumbnail: "math-counting",
    guestAllowed: true,
  },
  {
    id: "math-algebra",
    name: "Algebra Quest",
    description: "Solve equations and uncover the mysteries of algebra",
    category: "math",
    ageGroups: ["below14"],
    difficulty: "hard",
    duration: "15 min",
    maxScore: 100,
    playCount: 3150,
    rating: 4.4,
    thumbnail: "math-algebra",
    guestAllowed: false,
  },
  // Science Games
  {
    id: "sci-lab",
    name: "Lab Explorer",
    description: "Conduct virtual experiments and discover science principles",
    category: "science",
    ageGroups: ["below8", "below14"],
    difficulty: "medium",
    duration: "10 min",
    maxScore: 100,
    playCount: 9870,
    rating: 4.7,
    thumbnail: "sci-lab",
    guestAllowed: true,
  },
  {
    id: "sci-space",
    name: "Space Odyssey",
    description: "Journey through the solar system and learn about planets",
    category: "science",
    ageGroups: ["kindergarten", "below8", "below14"],
    difficulty: "easy",
    duration: "8 min",
    maxScore: 100,
    playCount: 15340,
    rating: 4.9,
    thumbnail: "sci-space",
    guestAllowed: true,
  },
  {
    id: "sci-body",
    name: "Body Works",
    description: "Explore the human body and learn how organs function",
    category: "science",
    ageGroups: ["below8", "below14"],
    difficulty: "medium",
    duration: "12 min",
    maxScore: 100,
    playCount: 6780,
    rating: 4.5,
    thumbnail: "sci-body",
    guestAllowed: false,
  },
  {
    id: "sci-nature",
    name: "Nature Detective",
    description: "Identify plants, animals, and ecosystems in the wild",
    category: "science",
    ageGroups: ["kindergarten", "below8"],
    difficulty: "easy",
    duration: "6 min",
    maxScore: 100,
    playCount: 11200,
    rating: 4.8,
    thumbnail: "sci-nature",
    guestAllowed: true,
  },
  {
    id: "sci-chemistry",
    name: "Mix & React",
    description: "Combine elements and observe chemical reactions",
    category: "science",
    ageGroups: ["below14"],
    difficulty: "hard",
    duration: "15 min",
    maxScore: 100,
    playCount: 4560,
    rating: 4.6,
    thumbnail: "sci-chemistry",
    guestAllowed: false,
  },
  // Language Arts Games
  {
    id: "lang-words",
    name: "Word Builder",
    description: "Create words from letters and expand your vocabulary",
    category: "language",
    ageGroups: ["kindergarten", "below8"],
    difficulty: "easy",
    duration: "5 min",
    maxScore: 100,
    playCount: 13450,
    rating: 4.7,
    thumbnail: "lang-words",
    guestAllowed: true,
  },
  {
    id: "lang-story",
    name: "Story Crafter",
    description: "Write and illustrate your own interactive stories",
    category: "language",
    ageGroups: ["below8", "below14"],
    difficulty: "medium",
    duration: "15 min",
    maxScore: 100,
    playCount: 8900,
    rating: 4.8,
    thumbnail: "lang-story",
    guestAllowed: false,
  },
  {
    id: "lang-spelling",
    name: "Spell Bee",
    description: "Improve your spelling with progressive challenges",
    category: "language",
    ageGroups: ["below8", "below14"],
    difficulty: "medium",
    duration: "8 min",
    maxScore: 100,
    playCount: 7650,
    rating: 4.5,
    thumbnail: "lang-spelling",
    guestAllowed: true,
  },
  {
    id: "lang-reading",
    name: "Reading Rally",
    description: "Read passages and answer comprehension questions",
    category: "language",
    ageGroups: ["below8", "below14"],
    difficulty: "medium",
    duration: "10 min",
    maxScore: 100,
    playCount: 6340,
    rating: 4.4,
    thumbnail: "lang-reading",
    guestAllowed: false,
  },
  {
    id: "lang-phonics",
    name: "Phonics Fun",
    description: "Learn letter sounds and phonics patterns through play",
    category: "language",
    ageGroups: ["kindergarten"],
    difficulty: "easy",
    duration: "5 min",
    maxScore: 100,
    playCount: 16780,
    rating: 4.9,
    thumbnail: "lang-phonics",
    guestAllowed: true,
  },
  // Coding Games
  {
    id: "code-blocks",
    name: "Block Builder",
    description: "Learn programming by snapping code blocks together like Scratch",
    category: "coding",
    ageGroups: ["below8", "below14"],
    difficulty: "medium",
    duration: "15 min",
    maxScore: 100,
    playCount: 11200,
    rating: 4.9,
    thumbnail: "code-blocks",
    guestAllowed: false,
  },
  {
    id: "code-turtle",
    name: "Turtle Graphics",
    description: "Guide a turtle to draw shapes using simple commands",
    category: "coding",
    ageGroups: ["kindergarten", "below8"],
    difficulty: "easy",
    duration: "8 min",
    maxScore: 100,
    playCount: 9450,
    rating: 4.7,
    thumbnail: "code-turtle",
    guestAllowed: true,
  },
  {
    id: "code-robot",
    name: "Robot Maze",
    description: "Program a robot to navigate through challenging mazes",
    category: "coding",
    ageGroups: ["below8", "below14"],
    difficulty: "hard",
    duration: "12 min",
    maxScore: 100,
    playCount: 7890,
    rating: 4.6,
    thumbnail: "code-robot",
    guestAllowed: false,
  },
  {
    id: "code-web",
    name: "Web Creator",
    description: "Build simple web pages with HTML and CSS blocks",
    category: "coding",
    ageGroups: ["below14"],
    difficulty: "hard",
    duration: "20 min",
    maxScore: 100,
    playCount: 4560,
    rating: 4.5,
    thumbnail: "code-web",
    guestAllowed: false,
  },
  // Identification Games
  {
    id: "id-colors",
    name: "Color Match",
    description: "Identify and match colors in fun interactive challenges",
    category: "identification",
    ageGroups: ["kindergarten"],
    difficulty: "easy",
    duration: "4 min",
    maxScore: 100,
    playCount: 19800,
    rating: 4.9,
    thumbnail: "id-colors",
    guestAllowed: true,
  },
  {
    id: "id-animals",
    name: "Animal Safari",
    description: "Identify animals by their sounds, shapes, and habitats",
    category: "identification",
    ageGroups: ["kindergarten", "below8"],
    difficulty: "easy",
    duration: "6 min",
    maxScore: 100,
    playCount: 16450,
    rating: 4.8,
    thumbnail: "id-animals",
    guestAllowed: true,
  },
  {
    id: "id-patterns",
    name: "Pattern Finder",
    description: "Spot and continue patterns in sequences of shapes and colors",
    category: "identification",
    ageGroups: ["below8", "below14"],
    difficulty: "medium",
    duration: "8 min",
    maxScore: 100,
    playCount: 8900,
    rating: 4.6,
    thumbnail: "id-patterns",
    guestAllowed: true,
  },
  {
    id: "id-flags",
    name: "Flag Detective",
    description: "Learn to identify flags from countries around the world",
    category: "identification",
    ageGroups: ["below8", "below14"],
    difficulty: "medium",
    duration: "10 min",
    maxScore: 100,
    playCount: 7230,
    rating: 4.5,
    thumbnail: "id-flags",
    guestAllowed: false,
  },
  // IQ Assessment Games
  {
    id: "iq-logic",
    name: "Logic Puzzle",
    description: "Test your logical reasoning with progressive challenges",
    category: "iq",
    ageGroups: ["below8", "below14"],
    difficulty: "hard",
    duration: "20 min",
    maxScore: 150,
    playCount: 6780,
    rating: 4.7,
    thumbnail: "iq-logic",
    guestAllowed: false,
  },
  {
    id: "iq-memory",
    name: "Memory Master",
    description: "Test and improve your memory with pattern recall",
    category: "iq",
    ageGroups: ["kindergarten", "below8", "below14"],
    difficulty: "medium",
    duration: "10 min",
    maxScore: 150,
    playCount: 12340,
    rating: 4.8,
    thumbnail: "iq-memory",
    guestAllowed: true,
  },
  {
    id: "iq-spatial",
    name: "Spatial Thinker",
    description: "Solve spatial reasoning puzzles and 3D visualization tasks",
    category: "iq",
    ageGroups: ["below14"],
    difficulty: "hard",
    duration: "15 min",
    maxScore: 150,
    playCount: 4320,
    rating: 4.5,
    thumbnail: "iq-spatial",
    guestAllowed: false,
  },
]

export function getGamesByCategory(categoryId: string): Game[] {
  return games.filter((g) => g.category === categoryId)
}

export function getGamesByAgeGroup(ageGroup: AgeGroup): Game[] {
  return games.filter((g) => g.ageGroups.includes(ageGroup))
}

export function getGameById(id: string): Game | undefined {
  return games.find((g) => g.id === id)
}

export function getCategoryById(id: string): GameCategory | undefined {
  return categories.find((c) => c.id === id)
}

export function getAgeGroupLabel(ageGroup: AgeGroup): string {
  switch (ageGroup) {
    case "kindergarten":
      return "Kindergarten (4-6)"
    case "below8":
      return "Explorer (6-8)"
    case "below14":
      return "Advanced (8-14)"
  }
}

export function getDifficultyColor(difficulty: string): string {
  switch (difficulty) {
    case "easy":
      return "bg-[oklch(0.7_0.18_150)] text-[oklch(0.99_0_0)]"
    case "medium":
      return "bg-[oklch(0.78_0.18_70)] text-[oklch(0.25_0.04_60)]"
    case "hard":
      return "bg-[oklch(0.58_0.22_28)] text-[oklch(0.99_0_0)]"
    default:
      return "bg-muted text-muted-foreground"
  }
}
