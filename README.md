BrainSpark - Educational Games for Kids
An engaging educational game platform for children ages 4-14 with interactive learning games across 9 skill categories.

Features

- 70+ Educational Games across - Math, Science, Language Arts, Coding, IQ & Logic, Art, Music, Geography, and Identification
- 3 Age Groups - Kindergarten (4-5), Early Primary (6-7), Upper Primary (8-14)
- Progress Tracking - Track scores, streaks, and improvement over time
- Parental Controls - Set time limits and control game access
- Guest Mode - 15 minutes of free play without an account
- Multiple Sign-in Options - BrainSpark account, Google, or Microsoft

Game Categories

 Category                      Description                               Games

 Mathematics            Numbers, arithmetic, problem-solving              10+
 Science                Nature, experiments, scientific concepts          8+
 Language Arts          Reading, writing, vocabulary, grammar             8+
 Coding                 Programming concepts with visual blocks           6+
 IQ & Logic             Puzzles, patterns, cognitive challenges           6+
 Art & Creativity       Drawing, painting, creative expression            12+
 Music                  Instruments, rhythm, music theory                 12+
 Geography              Countries, continents, landmarks                  12+
 Identification         Shapes, colors, objects                           6+
 
 Demo Accounts

- Parent Account**: [parent@demo.com](mailto:parent@demo.com) / demo123
- Child Account**: [child@demo.com](mailto:child@demo.com) / demo123

  Tech Stack

- Framework: Next.js 16 (App Router)
- Styling: Tailwind CSS v4
- UI Components: shadcn/ui
- State Management: React Context
- Storage: localStorage (demo mode)

  Getting Started
  
  # Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

Project Structure

app/
  page.tsx              # Landing page
  auth/login/           # Login page
  auth/signup/          # Signup page
  games/                # Games catalog
  games/[id]/           # Individual game page
  categories/           # Categories list
  categories/[id]/      # Category games
  progress/             # Progress tracking
  parent/               # Parent dashboard
  profile/              # User profile

components/
  site-header.tsx       # Navigation header
  site-footer.tsx       # Footer with GitHub link
  game-card.tsx         # Game card component
  games/                # Game components
    math-game.tsx
    quiz-game.tsx
    memory-game.tsx

lib/
  auth-context.tsx      # Authentication context
  game-data.ts          # Game and category data

GitHub

Repository: [github.com/agastyaguddadmath/brainspark](https://github.com/agastyaguddadmath/brainspark)

License
