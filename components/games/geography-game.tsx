"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Game } from "@/lib/game-data"
import { Globe, MapPin, Flag, Trophy, Star, ArrowRight, Check, X, Play, Landmark, Lightbulb } from "lucide-react"

interface GeographyGameProps {
  game: Game
  onComplete: (score: number, maxScore: number) => void
}

interface Question {
  type: "capital" | "flag" | "continent" | "landmark"
  question: string
  options: string[]
  correct: number
  fact: string
}

// Capital Cities questions
const capitalQuestions: Question[] = [
  { type: "capital", question: "What is the capital of France?", options: ["London", "Paris", "Berlin", "Madrid"], correct: 1, fact: "Paris is known as the 'City of Light'!" },
  { type: "capital", question: "What is the capital of Japan?", options: ["Seoul", "Beijing", "Tokyo", "Bangkok"], correct: 2, fact: "Tokyo has over 13 million people!" },
  { type: "capital", question: "What is the capital of Australia?", options: ["Sydney", "Melbourne", "Canberra", "Perth"], correct: 2, fact: "Many think Sydney is the capital, but it's Canberra!" },
  { type: "capital", question: "What is the capital of Germany?", options: ["Munich", "Frankfurt", "Berlin", "Hamburg"], correct: 2, fact: "Berlin is known for its rich history!" },
  { type: "capital", question: "What is the capital of Brazil?", options: ["Rio de Janeiro", "Sao Paulo", "Brasilia", "Salvador"], correct: 2, fact: "Brasilia was built from scratch in the 1960s!" },
  { type: "capital", question: "What is the capital of Canada?", options: ["Toronto", "Vancouver", "Ottawa", "Montreal"], correct: 2, fact: "Ottawa is on the border of Ontario and Quebec!" },
  { type: "capital", question: "What is the capital of India?", options: ["Mumbai", "New Delhi", "Kolkata", "Chennai"], correct: 1, fact: "New Delhi was designed by British architects in 1931!" },
  { type: "capital", question: "What is the capital of Egypt?", options: ["Alexandria", "Cairo", "Luxor", "Giza"], correct: 1, fact: "Cairo is the largest city in Africa!" },
]

// World Flags questions
const flagQuestions: Question[] = [
  { type: "flag", question: "Which country has a maple leaf on its flag?", options: ["Australia", "UK", "Canada", "New Zealand"], correct: 2, fact: "The maple leaf has been a Canadian symbol since the 1700s!" },
  { type: "flag", question: "Which country has a red circle on white background?", options: ["China", "Japan", "South Korea", "Vietnam"], correct: 1, fact: "Japan's flag represents the Land of the Rising Sun!" },
  { type: "flag", question: "Which country has vertical stripes of green, white, and red?", options: ["France", "Italy", "Ireland", "Mexico"], correct: 1, fact: "Italy's flag dates back to 1797!" },
  { type: "flag", question: "Which country has a dragon on its flag?", options: ["China", "Bhutan", "Japan", "Thailand"], correct: 1, fact: "Bhutan's dragon is called 'Druk' - the Thunder Dragon!" },
  { type: "flag", question: "Which flag has the Union Jack in the corner?", options: ["Canada", "India", "Australia", "South Africa"], correct: 2, fact: "Australia's flag includes the Southern Cross constellation!" },
  { type: "flag", question: "Which country has horizontal blue, white, and red stripes?", options: ["France", "Russia", "Netherlands", "Luxembourg"], correct: 2, fact: "Russia's tricolor was inspired by the Dutch flag!" },
  { type: "flag", question: "Which country has a star and crescent on its flag?", options: ["Pakistan", "Turkey", "Egypt", "Morocco"], correct: 1, fact: "Turkey's flag symbol dates back to the Ottoman Empire!" },
  { type: "flag", question: "Which country has a red and white flag with a cross?", options: ["Sweden", "Finland", "Switzerland", "Denmark"], correct: 2, fact: "Switzerland's flag is one of only two square national flags!" },
]

// Continent Explorer questions
const continentQuestions: Question[] = [
  { type: "continent", question: "Which continent is Brazil in?", options: ["Africa", "Europe", "South America", "Asia"], correct: 2, fact: "Brazil has the Amazon rainforest!" },
  { type: "continent", question: "Which continent has the most countries?", options: ["Asia", "Africa", "Europe", "South America"], correct: 1, fact: "Africa has 54 countries!" },
  { type: "continent", question: "On which continent is Egypt?", options: ["Asia", "Africa", "Europe", "Middle East"], correct: 1, fact: "Egypt is in northeastern Africa!" },
  { type: "continent", question: "Which continent has penguins in the wild?", options: ["North America", "Africa", "Antarctica", "Europe"], correct: 2, fact: "Antarctica is the coldest continent!" },
  { type: "continent", question: "Which continent has the Great Barrier Reef?", options: ["Asia", "Australia", "Africa", "Europe"], correct: 1, fact: "Australia is both a continent and a country!" },
  { type: "continent", question: "On which continent is the Sahara Desert?", options: ["Asia", "Africa", "Australia", "South America"], correct: 1, fact: "The Sahara is almost as big as the United States!" },
  { type: "continent", question: "Which continent has the most people?", options: ["Africa", "Europe", "Asia", "North America"], correct: 2, fact: "Asia has over 4.5 billion people!" },
  { type: "continent", question: "Which continent has the Amazon River?", options: ["Africa", "Asia", "South America", "North America"], correct: 2, fact: "The Amazon carries more water than any other river!" },
]

// Famous Landmarks questions
const landmarkQuestions: Question[] = [
  { type: "landmark", question: "Where is the Great Wall?", options: ["Japan", "India", "China", "Korea"], correct: 2, fact: "The Great Wall is over 13,000 miles long!" },
  { type: "landmark", question: "Where is the Statue of Liberty?", options: ["France", "United States", "UK", "Italy"], correct: 1, fact: "It was a gift from France!" },
  { type: "landmark", question: "Where is the Colosseum?", options: ["Athens", "Rome", "Cairo", "Paris"], correct: 1, fact: "The Colosseum could hold 80,000 spectators!" },
  { type: "landmark", question: "Where is the Eiffel Tower?", options: ["London", "Rome", "Paris", "Berlin"], correct: 2, fact: "The Eiffel Tower was built for the 1889 World's Fair!" },
  { type: "landmark", question: "Where is the Taj Mahal?", options: ["China", "India", "Thailand", "Japan"], correct: 1, fact: "It took 22 years to build the Taj Mahal!" },
  { type: "landmark", question: "Where are the Pyramids of Giza?", options: ["Morocco", "Egypt", "Sudan", "Libya"], correct: 1, fact: "The Great Pyramid is over 4,500 years old!" },
  { type: "landmark", question: "Where is Big Ben?", options: ["Paris", "New York", "London", "Sydney"], correct: 2, fact: "Big Ben is actually the name of the bell, not the tower!" },
  { type: "landmark", question: "Where is the Sydney Opera House?", options: ["New Zealand", "UK", "USA", "Australia"], correct: 3, fact: "Its roof is covered with over 1 million tiles!" },
]

// Ocean Adventure questions
const oceanQuestions: Question[] = [
  { type: "continent", question: "Which is the largest ocean?", options: ["Atlantic", "Indian", "Pacific", "Arctic"], correct: 2, fact: "The Pacific is larger than all land combined!" },
  { type: "continent", question: "Which ocean is the coldest?", options: ["Pacific", "Atlantic", "Indian", "Arctic"], correct: 3, fact: "The Arctic Ocean is covered in ice year-round!" },
  { type: "continent", question: "Which ocean borders California?", options: ["Atlantic", "Pacific", "Indian", "Arctic"], correct: 1, fact: "The Pacific Ocean touches 5 continents!" },
  { type: "continent", question: "In which ocean is Hawaii?", options: ["Atlantic", "Pacific", "Indian", "Arctic"], correct: 1, fact: "Hawaii is in the middle of the Pacific Ocean!" },
  { type: "continent", question: "Which ocean borders India?", options: ["Atlantic", "Pacific", "Indian", "Arctic"], correct: 2, fact: "The Indian Ocean is the warmest ocean!" },
  { type: "continent", question: "Which ocean has the Great Barrier Reef?", options: ["Atlantic", "Pacific", "Indian", "Arctic"], correct: 1, fact: "It's the world's largest coral reef system!" },
  { type: "continent", question: "Which is the smallest ocean?", options: ["Pacific", "Atlantic", "Indian", "Arctic"], correct: 3, fact: "The Arctic is also the shallowest ocean!" },
  { type: "continent", question: "Which ocean has the Bermuda Triangle?", options: ["Pacific", "Atlantic", "Indian", "Arctic"], correct: 1, fact: "The Bermuda Triangle is near Florida and Puerto Rico!" },
]

// Country Quest questions
const countryQuestions: Question[] = [
  { type: "capital", question: "Which country is shaped like a boot?", options: ["Greece", "Spain", "Italy", "France"], correct: 2, fact: "Italy is famous for pizza and pasta!" },
  { type: "capital", question: "Which is the largest country by area?", options: ["China", "USA", "Russia", "Canada"], correct: 2, fact: "Russia spans 11 time zones!" },
  { type: "capital", question: "Which country has the most people?", options: ["India", "USA", "China", "Indonesia"], correct: 2, fact: "China has over 1.4 billion people!" },
  { type: "capital", question: "In which country are the Great Pyramids?", options: ["Iraq", "Egypt", "Sudan", "Jordan"], correct: 1, fact: "Egypt's pyramids are over 4,500 years old!" },
  { type: "capital", question: "Which country invented sushi?", options: ["China", "Korea", "Japan", "Thailand"], correct: 2, fact: "Sushi originated in Japan centuries ago!" },
  { type: "capital", question: "Which country has kangaroos?", options: ["South Africa", "Brazil", "Australia", "India"], correct: 2, fact: "Australia has more kangaroos than people!" },
  { type: "capital", question: "Which country is known for tulips?", options: ["Germany", "Netherlands", "Belgium", "Denmark"], correct: 1, fact: "The Netherlands exports billions of flowers yearly!" },
  { type: "capital", question: "Which country is home to pandas?", options: ["Japan", "Korea", "India", "China"], correct: 3, fact: "Giant pandas only live wild in central China!" },
]

// Mountain Climber questions
const mountainQuestions: Question[] = [
  { type: "landmark", question: "Where is Mount Everest?", options: ["China", "India", "Nepal", "Tibet"], correct: 2, fact: "Everest is the world's tallest mountain at 29,032 feet!" },
  { type: "landmark", question: "What is the tallest mountain in Africa?", options: ["Mt. Kenya", "Mt. Kilimanjaro", "Atlas Mountains", "Drakensberg"], correct: 1, fact: "Kilimanjaro is 19,341 feet tall!" },
  { type: "landmark", question: "Which mountain range has the Matterhorn?", options: ["Rockies", "Himalayas", "Alps", "Andes"], correct: 2, fact: "The Alps are in Europe!" },
  { type: "landmark", question: "What is the longest mountain range?", options: ["Himalayas", "Rockies", "Andes", "Alps"], correct: 2, fact: "The Andes stretch 4,500 miles through South America!" },
  { type: "landmark", question: "Where is Mount Fuji?", options: ["China", "Japan", "Korea", "Taiwan"], correct: 1, fact: "Mount Fuji is Japan's highest mountain!" },
  { type: "landmark", question: "Which country has the Rocky Mountains?", options: ["Mexico", "Canada", "USA", "Both B and C"], correct: 3, fact: "The Rockies span from Canada to New Mexico!" },
  { type: "landmark", question: "What is the tallest mountain in North America?", options: ["Mt. Rainier", "Denali", "Mt. Whitney", "Pikes Peak"], correct: 1, fact: "Denali in Alaska is 20,310 feet tall!" },
  { type: "landmark", question: "Which mountains separate Europe and Asia?", options: ["Alps", "Urals", "Caucasus", "Pyrenees"], correct: 1, fact: "The Ural Mountains run through Russia!" },
]

function getQuestions(gameId: string): Question[] {
  let pool: Question[]
  
  switch (gameId) {
    case "geo-capitals":
      pool = capitalQuestions
      break
    case "geo-flags":
      pool = flagQuestions
      break
    case "geo-continents":
      pool = continentQuestions
      break
    case "geo-landmarks":
      pool = landmarkQuestions
      break
    case "geo-oceans":
      pool = oceanQuestions
      break
    case "geo-countries":
      pool = countryQuestions
      break
    case "geo-mountains":
      pool = mountainQuestions
      break
    default:
      // Mix all questions for general geography
      pool = [...capitalQuestions, ...flagQuestions, ...continentQuestions, ...landmarkQuestions]
  }
  
  return [...pool].sort(() => Math.random() - 0.5).slice(0, 8)
}

export function GeographyGame({ game, onComplete }: GeographyGameProps) {
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [gameState, setGameState] = useState<"playing" | "complete">("playing")
  const totalQuestions = 8
  const hasCompletedRef = useRef(false)

  useEffect(() => {
    // Get questions based on game type
    setQuestions(getQuestions(game.id))
  }, [game.id])

  const currentQuestion = questions[currentIndex]

  const handleAnswer = (answerIndex: number) => {
    if (showResult) return
    setSelectedAnswer(answerIndex)
    setShowResult(true)
    
    if (answerIndex === currentQuestion.correct) {
      setScore(prev => prev + Math.round(game.maxScore / totalQuestions))
    }
  }

  const nextQuestion = () => {
    if (currentIndex + 1 >= totalQuestions) {
      setGameState("complete")
      // Score is already updated, use it directly
      if (!hasCompletedRef.current) {
        hasCompletedRef.current = true
        const finalScore = Math.min(score, game.maxScore)
        onComplete(finalScore, game.maxScore)
      }
    } else {
      setCurrentIndex(prev => prev + 1)
      setSelectedAnswer(null)
      setShowResult(false)
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "capital":
        return <MapPin className="w-4 h-4" />
      case "flag":
        return <Flag className="w-4 h-4" />
      case "landmark":
        return <Star className="w-4 h-4" />
      default:
        return <Globe className="w-4 h-4" />
    }
  }

  if (!currentQuestion) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-8 text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto" />
          <p className="mt-4 text-muted-foreground">Loading questions...</p>
        </CardContent>
      </Card>
    )
  }

  if (gameState === "complete") {
    const percentage = (score / game.maxScore) * 100
    const stars = Math.ceil(percentage / 20)
    
    return (
      <Card className="max-w-xl mx-auto overflow-hidden border-0 shadow-2xl">
        <div className="relative bg-gradient-to-br from-sky-500 via-blue-500 to-indigo-500 p-8 text-white text-center">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxjaXJjbGUgY3g9IjIwIiBjeT0iMjAiIHI9IjIiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4xKSIvPjwvZz48L3N2Zz4=')] opacity-50" />
          <div className="relative">
            <div className="w-24 h-24 mx-auto mb-4 rounded-3xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-xl">
              <Trophy className="w-12 h-12" />
            </div>
            <h2 className="text-3xl font-bold mb-2">
              Geography Explorer!
            </h2>
            <p className="text-white/80">World tour completed!</p>
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
            <div className="rounded-2xl border border-border bg-gradient-to-br from-sky-50 to-blue-50 dark:from-sky-950/20 dark:to-blue-950/20 p-4 text-center">
              <Globe className="w-6 h-6 mx-auto mb-2 text-sky-600" />
              <p className="text-3xl font-bold text-foreground">{score}</p>
              <p className="text-sm text-muted-foreground">Points</p>
            </div>
            <div className="rounded-2xl border border-border bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 p-4 text-center">
              <Check className="w-6 h-6 mx-auto mb-2 text-blue-600" />
              <p className="text-3xl font-bold text-foreground">{Math.round(percentage)}%</p>
              <p className="text-sm text-muted-foreground">Accuracy</p>
            </div>
          </div>
          
          <Button 
            onClick={() => window.location.reload()}
            size="lg"
            className="w-full h-14 text-lg bg-gradient-to-r from-sky-500 to-blue-500 hover:from-sky-600 hover:to-blue-600"
          >
            <Play className="w-5 h-5 mr-2" />
            Play Again
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4 max-w-xl mx-auto">
      {/* Stats Bar */}
      <div className="flex flex-wrap gap-3 items-center justify-between rounded-2xl border border-border bg-card p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-blue-500 text-white shadow-lg shadow-sky-500/20">
            <Globe className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">Question {currentIndex + 1} of {totalQuestions}</p>
            <p className="text-xs text-muted-foreground">Score: {score} pts</p>
          </div>
        </div>
        <Badge className="bg-gradient-to-r from-sky-500/10 to-blue-500/10 text-sky-700 dark:text-sky-400 border-sky-200 dark:border-sky-800 rounded-lg capitalize">
          {getTypeIcon(currentQuestion.type)}
          <span className="ml-1">{currentQuestion.type}</span>
        </Badge>
      </div>

      {/* Progress */}
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-sky-500 to-blue-500 transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
        />
      </div>

      {/* Question Card */}
      <Card className="overflow-hidden border-0 shadow-xl">
        <div className="bg-gradient-to-r from-sky-500/10 via-blue-500/10 to-indigo-500/10 p-8">
          <p className="text-center text-xl font-semibold leading-relaxed text-foreground">
            {currentQuestion.question}
          </p>
        </div>
        
        <CardContent className="p-6 space-y-3">
          {currentQuestion.options.map((option, idx) => {
            const isSelected = selectedAnswer === idx
            const isCorrectAnswer = idx === currentQuestion.correct
            
            let buttonClass = "w-full justify-start text-left h-auto py-4 px-4 rounded-xl transition-all duration-200 border-2 flex items-center "
            
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
                key={idx}
                className={buttonClass}
                onClick={() => handleAnswer(idx)}
                disabled={showResult}
              >
                <span className={`w-10 h-10 rounded-xl flex items-center justify-center mr-4 text-sm font-bold ${
                  showResult && isCorrectAnswer
                    ? "bg-emerald-500 text-white"
                    : showResult && isSelected
                    ? "bg-rose-500 text-white"
                    : "bg-gradient-to-br from-sky-500/20 to-blue-500/20 text-sky-700 dark:text-sky-400"
                }`}>
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className="flex-1 font-medium">{option}</span>
                {showResult && isCorrectAnswer && (
                  <Check className="w-5 h-5 text-emerald-500 ml-2" />
                )}
                {showResult && isSelected && !isCorrectAnswer && (
                  <X className="w-5 h-5 text-rose-500 ml-2" />
                )}
              </button>
            )
          })}

          {/* Fun Fact */}
          {showResult && (
            <div className="mt-4 flex items-start gap-3 rounded-xl bg-gradient-to-r from-sky-500/10 to-blue-500/10 p-4 border border-sky-500/20">
              <Lightbulb className="h-5 w-5 text-sky-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-medium text-sky-600 dark:text-sky-400">Fun Fact</p>
                <p className="mt-0.5 text-sm text-foreground">{currentQuestion.fact}</p>
              </div>
            </div>
          )}

          {/* Next Button */}
          {showResult && (
            <Button 
              onClick={nextQuestion} 
              className="w-full mt-4 h-14 text-lg rounded-xl bg-gradient-to-r from-sky-500 to-blue-500 hover:from-sky-600 hover:to-blue-600"
            >
              {currentIndex + 1 >= totalQuestions ? "See Results" : "Next Question"}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
