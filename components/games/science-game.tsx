"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle2, XCircle, Trophy, Lightbulb, Atom, Play, Star, FlaskConical } from "lucide-react"
import type { Game } from "@/lib/game-data"

interface ScienceQuestion {
  question: string
  options: string[]
  correct: number
  fact: string
}

// Question pools by game type
const spaceQuestions: ScienceQuestion[] = [
  { question: "Which planet is closest to the Sun?", options: ["Venus", "Mercury", "Earth", "Mars"], correct: 1, fact: "Mercury orbits the Sun in just 88 Earth days!" },
  { question: "Which planet is known as the Red Planet?", options: ["Jupiter", "Mars", "Saturn", "Venus"], correct: 1, fact: "Mars appears red because of iron oxide (rust) on its surface." },
  { question: "What is the largest planet in our solar system?", options: ["Saturn", "Jupiter", "Neptune", "Uranus"], correct: 1, fact: "Jupiter is so big that 1,300 Earths could fit inside it!" },
  { question: "What does the Moon orbit?", options: ["The Sun", "Earth", "Mars", "Saturn"], correct: 1, fact: "The Moon takes about 27 days to orbit Earth once." },
  { question: "What is a shooting star?", options: ["A star falling", "A meteor", "A comet", "A planet"], correct: 1, fact: "Shooting stars are meteors burning up in Earth's atmosphere." },
  { question: "How many planets are in our solar system?", options: ["7", "8", "9", "10"], correct: 1, fact: "Pluto was reclassified as a dwarf planet in 2006." },
  { question: "What is the Sun made of?", options: ["Fire", "Rocks", "Hot gases", "Lava"], correct: 2, fact: "The Sun is made mostly of hydrogen and helium gases!" },
  { question: "Which planet has rings?", options: ["Earth", "Saturn", "Mars", "Venus"], correct: 1, fact: "Saturn has the most visible rings, made of ice and rock." },
]

const labQuestions: ScienceQuestion[] = [
  { question: "What is H2O?", options: ["Oxygen", "Carbon Dioxide", "Water", "Hydrogen"], correct: 2, fact: "Water is made of 2 hydrogen atoms and 1 oxygen atom." },
  { question: "Which of these is NOT a state of matter?", options: ["Solid", "Liquid", "Gas", "Energy"], correct: 3, fact: "The three main states of matter are solid, liquid, and gas." },
  { question: "What happens when ice melts?", options: ["It becomes gas", "It becomes water", "It disappears", "It gets colder"], correct: 1, fact: "Ice melts into liquid water at 0°C (32°F)." },
  { question: "What is the chemical symbol for gold?", options: ["Go", "Gd", "Au", "Ag"], correct: 2, fact: "Au comes from the Latin word 'aurum' meaning gold." },
  { question: "What color does litmus paper turn in acid?", options: ["Blue", "Red", "Green", "Yellow"], correct: 1, fact: "Acids turn blue litmus paper red, bases turn red litmus blue." },
  { question: "What is the pH of pure water?", options: ["5", "7", "9", "0"], correct: 1, fact: "pH 7 is neutral. Below 7 is acidic, above 7 is basic." },
  { question: "What does mixing baking soda and vinegar create?", options: ["Fire", "Bubbles", "Ice", "Nothing"], correct: 1, fact: "This reaction produces carbon dioxide gas - the bubbles!" },
  { question: "What happens when water boils?", options: ["It freezes", "It becomes steam", "It changes color", "Nothing"], correct: 1, fact: "Water boils at 100°C (212°F) and turns into steam." },
]

const bodyQuestions: ScienceQuestion[] = [
  { question: "What is the powerhouse of the cell?", options: ["Nucleus", "Mitochondria", "Ribosome", "Membrane"], correct: 1, fact: "Mitochondria produce energy (ATP) for cell functions." },
  { question: "What organ pumps blood through your body?", options: ["Brain", "Lungs", "Heart", "Liver"], correct: 2, fact: "Your heart beats about 100,000 times every day!" },
  { question: "How many bones are in the adult human body?", options: ["186", "206", "256", "306"], correct: 1, fact: "Babies are born with about 270 bones, some fuse as they grow." },
  { question: "What organ lets you breathe?", options: ["Heart", "Stomach", "Lungs", "Brain"], correct: 2, fact: "Your lungs can hold about 6 liters of air!" },
  { question: "What gas do humans breathe out?", options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Helium"], correct: 2, fact: "We breathe in O2 and breathe out CO2 as a waste product." },
  { question: "What is your largest organ?", options: ["Liver", "Brain", "Skin", "Heart"], correct: 2, fact: "Your skin weighs about 8 pounds and covers 20 square feet!" },
  { question: "Where is food digested?", options: ["Heart", "Lungs", "Stomach", "Brain"], correct: 2, fact: "Your stomach uses acid strong enough to dissolve metal!" },
  { question: "What connects muscles to bones?", options: ["Cartilage", "Tendons", "Veins", "Skin"], correct: 1, fact: "Tendons are very strong and can handle lots of force." },
]

const natureQuestions: ScienceQuestion[] = [
  { question: "What do plants need to grow?", options: ["Water, sunlight, and soil", "Only water", "Only sunlight", "Only air"], correct: 0, fact: "Plants use photosynthesis to convert sunlight into food!" },
  { question: "How many legs does a spider have?", options: ["6", "8", "10", "4"], correct: 1, fact: "Spiders are arachnids, not insects. Insects have 6 legs." },
  { question: "What is the biggest animal on Earth?", options: ["Elephant", "Giraffe", "Blue Whale", "Shark"], correct: 2, fact: "A blue whale's heart is as big as a small car!" },
  { question: "What gives leaves their green color?", options: ["Water", "Chlorophyll", "Oxygen", "Sunlight"], correct: 1, fact: "Chlorophyll absorbs sunlight to help plants make food." },
  { question: "What do bees collect from flowers?", options: ["Water", "Nectar", "Seeds", "Leaves"], correct: 1, fact: "Bees turn nectar into honey and pollinate 80% of flowering plants." },
  { question: "What animal is the King of the Jungle?", options: ["Tiger", "Elephant", "Lion", "Gorilla"], correct: 2, fact: "Lions live in groups called prides and can run 50 mph!" },
  { question: "What do butterflies start life as?", options: ["Eggs", "Butterflies", "Bees", "Flowers"], correct: 0, fact: "Butterflies go through metamorphosis: egg, caterpillar, pupa, butterfly!" },
  { question: "Where do polar bears live?", options: ["Antarctica", "Africa", "Arctic", "Australia"], correct: 2, fact: "Polar bears live in the Arctic and are excellent swimmers!" },
]

const chemistryQuestions: ScienceQuestion[] = [
  { question: "What is the speed of light approximately?", options: ["300,000 km/s", "150,000 km/s", "500,000 km/s", "100,000 km/s"], correct: 0, fact: "Light travels at 299,792,458 meters per second in a vacuum." },
  { question: "Which type of rock is formed from cooled magma?", options: ["Sedimentary", "Metamorphic", "Igneous", "Fossil"], correct: 2, fact: "Igneous comes from the Latin word 'ignis' meaning fire." },
  { question: "What element makes up most of Earth's atmosphere?", options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Hydrogen"], correct: 2, fact: "Nitrogen makes up about 78% of Earth's atmosphere." },
  { question: "What is the process by which liquid becomes gas?", options: ["Condensation", "Evaporation", "Sublimation", "Precipitation"], correct: 1, fact: "Evaporation occurs when molecules gain enough energy to escape." },
  { question: "What is the hardest natural substance?", options: ["Gold", "Iron", "Diamond", "Quartz"], correct: 2, fact: "Diamonds are made of carbon atoms arranged in a crystal structure." },
  { question: "What force keeps us on the ground?", options: ["Friction", "Magnetism", "Gravity", "Inertia"], correct: 2, fact: "Gravity pulls objects toward each other. Earth's gravity is 9.8 m/s²." },
  { question: "What is the chemical formula for table salt?", options: ["NaCl", "H2O", "CO2", "O2"], correct: 0, fact: "Salt is sodium chloride - one sodium atom bonded to one chlorine atom." },
  { question: "What is absolute zero temperature?", options: ["-273°C", "-100°C", "0°C", "-459°C"], correct: 0, fact: "At absolute zero, all molecular motion stops completely!" },
]

const iqQuestions: ScienceQuestion[] = [
  { question: "What comes next: 2, 4, 8, 16, ?", options: ["20", "24", "32", "64"], correct: 2, fact: "Each number doubles - this is exponential growth!" },
  { question: "If all Bloops are Razzies and all Razzies are Lazzies, are all Bloops definitely Lazzies?", options: ["Yes", "No", "Maybe", "Cannot tell"], correct: 0, fact: "This is transitive logic - if A=B and B=C, then A=C!" },
  { question: "Which shape has the most sides: Pentagon, Hexagon, or Octagon?", options: ["Pentagon", "Hexagon", "Octagon", "They're equal"], correct: 2, fact: "Octagon has 8 sides, hexagon has 6, pentagon has 5." },
  { question: "Complete: Circle is to sphere as square is to ?", options: ["Rectangle", "Cube", "Triangle", "Pyramid"], correct: 1, fact: "A cube is the 3D version of a square!" },
  { question: "What is 25% of 80?", options: ["15", "20", "25", "40"], correct: 1, fact: "25% means one quarter - divide by 4!" },
  { question: "Which number doesn't belong: 3, 5, 7, 9, 11?", options: ["3", "5", "9", "11"], correct: 2, fact: "9 is not prime - it can be divided by 3!" },
  { question: "If you rearrange CIFAIPC, you get the name of a...?", options: ["Country", "Ocean", "City", "Animal"], correct: 1, fact: "PACIFIC - the largest ocean on Earth!" },
  { question: "A clock shows 3:15. What is the angle between the hour and minute hands?", options: ["0°", "7.5°", "15°", "90°"], correct: 1, fact: "The hour hand moves 0.5° per minute!" },
]

const identificationQuestions: ScienceQuestion[] = [
  { question: "Which color do you get mixing red and blue?", options: ["Green", "Purple", "Orange", "Brown"], correct: 1, fact: "Red and blue are primary colors that make purple!" },
  { question: "How many sides does a hexagon have?", options: ["5", "6", "7", "8"], correct: 1, fact: "Hex means six - think of hexagons in a beehive!" },
  { question: "Which animal says 'moo'?", options: ["Dog", "Cat", "Cow", "Pig"], correct: 2, fact: "Cows moo to communicate with other cows and their calves!" },
  { question: "What shape is a stop sign?", options: ["Circle", "Square", "Triangle", "Octagon"], correct: 3, fact: "Stop signs have 8 sides - that's an octagon!" },
  { question: "Which is bigger: a mouse or an elephant?", options: ["Mouse", "Elephant", "Same size", "Cannot tell"], correct: 1, fact: "African elephants can weigh over 6 tons!" },
  { question: "What color is a banana when it's ripe?", options: ["Green", "Yellow", "Red", "Blue"], correct: 1, fact: "Bananas turn yellow as they ripen due to chlorophyll breaking down." },
  { question: "Which season has falling leaves?", options: ["Spring", "Summer", "Autumn", "Winter"], correct: 2, fact: "Trees lose leaves in autumn to conserve water for winter." },
  { question: "How many wheels does a bicycle have?", options: ["1", "2", "3", "4"], correct: 1, fact: "The word bicycle comes from 'bi' (two) and 'cycle' (wheel)!" },
]

function getQuestions(gameId: string, difficulty: Game["difficulty"]): ScienceQuestion[] {
  let pool: ScienceQuestion[]
  
  switch (gameId) {
    case "sci-space":
      pool = spaceQuestions
      break
    case "sci-lab":
      pool = labQuestions
      break
    case "sci-body":
      pool = bodyQuestions
      break
    case "sci-nature":
      pool = natureQuestions
      break
    case "sci-chemistry":
      pool = chemistryQuestions
      break
    case "iq-logic":
    case "iq-memory":
    case "iq-spatial":
      pool = iqQuestions
      break
    case "id-colors":
    case "id-animals":
    case "id-patterns":
    case "id-flags":
      pool = identificationQuestions
      break
    default:
      // Fallback to difficulty-based selection
      if (difficulty === "easy") pool = [...natureQuestions, ...spaceQuestions]
      else if (difficulty === "medium") pool = [...labQuestions, ...bodyQuestions]
      else pool = [...chemistryQuestions, ...iqQuestions]
  }
  
  return [...pool].sort(() => Math.random() - 0.5).slice(0, 8)
}

interface ScienceGameProps {
  game: Game
  onComplete: (score: number, maxScore: number) => void
}

export function ScienceGame({ game, onComplete }: ScienceGameProps) {
  const [questions] = useState(() => getQuestions(game.id, game.difficulty))
  const [currentQ, setCurrentQ] = useState(0)
  const [score, setScore] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [finished, setFinished] = useState(false)
  const [showFact, setShowFact] = useState(false)
  const hasCompletedRef = useRef(false)

  const handleAnswer = useCallback(
    (index: number) => {
      if (selected !== null) return
      setSelected(index)
      const correct = index === questions[currentQ].correct
      if (correct) setScore((prev) => prev + 12)
      setShowFact(true)

      setTimeout(() => {
        if (currentQ + 1 >= questions.length) {
          setFinished(true)
        } else {
          setCurrentQ((prev) => prev + 1)
          setSelected(null)
          setShowFact(false)
        }
      }, 3000)
    },
    [selected, currentQ, questions]
  )

  useEffect(() => {
    if (finished && !hasCompletedRef.current) {
      hasCompletedRef.current = true
      onComplete(score, questions.length * 12)
    }
  }, [finished, score, questions.length, onComplete])

  if (finished) {
    const percentage = Math.round((score / (questions.length * 12)) * 100)
    const stars = Math.ceil(percentage / 20)
    
    return (
      <Card className="max-w-xl mx-auto overflow-hidden border-0 shadow-2xl">
        <div className="relative bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 p-8 text-white text-center">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxjaXJjbGUgY3g9IjIwIiBjeT0iMjAiIHI9IjIiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4xKSIvPjwvZz48L3N2Zz4=')] opacity-50" />
          <div className="relative">
            <div className="w-24 h-24 mx-auto mb-4 rounded-3xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-xl">
              <Trophy className="w-12 h-12" />
            </div>
            <h2 className="text-3xl font-bold mb-2">
              {percentage >= 80 ? "Science Genius!" : percentage >= 50 ? "Great Explorer!" : "Keep Discovering!"}
            </h2>
            <p className="text-white/80">Science challenge completed!</p>
          </div>
        </div>
        
        <CardContent className="p-8 bg-card">
          <div className="flex justify-center gap-2 mb-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                  i < stars
                    ? "bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-amber-500/30"
                    : "bg-muted"
                }`}
              >
                <Star
                  className={`w-6 h-6 ${
                    i < stars ? "text-white fill-white" : "text-muted-foreground"
                  }`}
                />
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="rounded-2xl border border-border bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 p-4 text-center">
              <p className="text-3xl font-bold text-foreground">{percentage}%</p>
              <p className="text-sm text-muted-foreground">Accuracy</p>
            </div>
            <div className="rounded-2xl border border-border bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/20 p-4 text-center">
              <p className="text-3xl font-bold text-foreground">{score}</p>
              <p className="text-sm text-muted-foreground">Points</p>
            </div>
          </div>
          
          <Button 
            onClick={() => window.location.reload()} 
            size="lg"
            className="w-full h-14 text-lg bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
          >
            <Play className="w-5 h-5 mr-2" />
            Play Again
          </Button>
        </CardContent>
      </Card>
    )
  }

  const q = questions[currentQ]

  return (
    <div className="mx-auto max-w-xl space-y-6">
      {/* Stats Bar */}
      <div className="flex flex-wrap gap-3 items-center justify-between rounded-2xl border border-border bg-card p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-500/20">
            <Atom className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">Question {currentQ + 1} of {questions.length}</p>
            <p className="text-xs text-muted-foreground">Score: {score} pts</p>
          </div>
        </div>
        <Badge className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800">
          <FlaskConical className="h-3 w-3 mr-1" />
          Science
        </Badge>
      </div>

      {/* Progress */}
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-300"
          style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }}
        />
      </div>

      {/* Question Card */}
      <Card className="overflow-hidden border-0 shadow-xl">
        <div className="bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 p-8">
          <p className="text-center text-xl font-semibold leading-relaxed text-foreground">
            {q.question}
          </p>
        </div>
      </Card>

      {/* Answer Options */}
      <div className="grid gap-3">
        {q.options.map((option, i) => {
          const isSelected = selected === i
          const isCorrectAnswer = i === q.correct
          const showResult = selected !== null
          
          let buttonClass = "relative h-auto justify-start px-4 py-4 text-left rounded-xl transition-all duration-200 border-2 "
          
          if (showResult) {
            if (isCorrectAnswer) {
              buttonClass += "bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border-emerald-500 text-foreground"
            } else if (isSelected) {
              buttonClass += "bg-gradient-to-r from-rose-500/10 to-red-500/10 border-rose-500 text-foreground"
            } else {
              buttonClass += "bg-muted/30 border-transparent text-muted-foreground opacity-50"
            }
          } else {
            buttonClass += "bg-card hover:bg-muted/50 border-border hover:border-primary/50"
          }

          return (
            <button
              key={i}
              className={buttonClass}
              onClick={() => handleAnswer(i)}
              disabled={selected !== null}
            >
              <span className={`mr-3 flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold ${
                showResult && isCorrectAnswer
                  ? "bg-emerald-500 text-white"
                  : showResult && isSelected
                  ? "bg-rose-500 text-white"
                  : "bg-gradient-to-br from-blue-500/20 to-indigo-500/20 text-blue-700 dark:text-blue-400"
              }`}>
                {String.fromCharCode(65 + i)}
              </span>
              <span className="flex-1">{option}</span>
              {showResult && isCorrectAnswer && (
                <CheckCircle2 className="ml-auto h-5 w-5 text-emerald-500" />
              )}
              {showResult && isSelected && !isCorrectAnswer && (
                <XCircle className="ml-auto h-5 w-5 text-rose-500" />
              )}
            </button>
          )
        })}
      </div>

      {/* Fun Fact */}
      {showFact && (
        <div className="flex items-start gap-3 rounded-xl bg-gradient-to-r from-blue-500/10 to-indigo-500/10 p-4 border border-blue-500/20">
          <Lightbulb className="mt-0.5 h-5 w-5 shrink-0 text-blue-500" />
          <div>
            <p className="text-xs font-medium text-blue-600 dark:text-blue-400">Fun Fact</p>
            <p className="mt-0.5 text-sm text-foreground">{q.fact}</p>
          </div>
        </div>
      )}
    </div>
  )
}
