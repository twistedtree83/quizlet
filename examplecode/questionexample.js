import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function Component() {
  const [selectedAnswer, setSelectedAnswer] = useState("")
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answeredQuestions, setAnsweredQuestions] = useState<number[]>([])

  const questions = [
    "Which city is known as the 'City of Light'?",
    "What is the capital of Japan?",
    "Which of these is not a continent?",
    "Where can you find the Eiffel Tower?",
    "What is the largest planet in our solar system?"
  ]

  const imageUrl = "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&h=400&fit=crop&crop=focalpoint"
  const choices = ["Paris", "London", "New York", "Tokyo"]

  // Kid-friendly color palette
  const colors = {
    background: 'bg-yellow-100',
    question: 'text-purple-700',
    answerDefault: 'bg-blue-200',
    answerHover: 'hover:bg-green-200',
    answerSelected: 'bg-pink-400',
    answerText: 'text-indigo-900',
    answerSelectedText: 'text-white',
    submitButton: 'bg-orange-400 hover:bg-orange-500 text-white',
    sidebar: 'bg-blue-100',
    sidebarText: 'text-indigo-900',
    sidebarTextInactive: 'text-gray-400',
  }

  const handleSubmit = () => {
    if (selectedAnswer && !answeredQuestions.includes(currentQuestionIndex)) {
      setAnsweredQuestions([...answeredQuestions, currentQuestionIndex])
    }
    // Here you would typically handle the answer submission
    setSelectedAnswer("")
  }

  return (
    <div className={`min-h-screen flex ${colors.background}`}>
      {/* Sidebar */}
      <div className={`w-64 ${colors.sidebar} p-4 hidden md:block`}>
        <h2 className={`text-xl font-bold mb-4 ${colors.sidebarText}`}>Questions</h2>
        <ScrollArea className="h-[calc(100vh-8rem)]">
          {questions.map((q, index) => (
            <button
              key={index}
              onClick={() => setCurrentQuestionIndex(index)}
              className={`block w-full text-left p-2 mb-2 rounded ${
                index === currentQuestionIndex ? colors.answerSelected : ''
              } ${
                answeredQuestions.includes(index) ? colors.sidebarText : colors.sidebarTextInactive
              }`}
            >
              {index + 1}. {q}
            </button>
          ))}
        </ScrollArea>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col justify-between p-8">
        <h1 className={`text-4xl font-bold text-center mb-8 ${colors.question}`}>
          {questions[currentQuestionIndex]}
        </h1>
        
        <div className="flex justify-center mb-8">
          <img 
            src={imageUrl} 
            alt="Eiffel Tower at night" 
            className="max-w-full h-auto rounded-lg shadow-lg"
            style={{ maxHeight: '400px' }}
          />
        </div>
        
        <div className="w-full">
          <RadioGroup
            value={selectedAnswer}
            onValueChange={setSelectedAnswer}
            className="flex flex-wrap justify-center gap-4 mb-6"
          >
            {choices.map((choice, index) => (
              <div 
                key={index} 
                className={`flex-1 min-w-[150px] max-w-[200px] ${
                  selectedAnswer === choice 
                    ? `${colors.answerSelected} ${colors.answerSelectedText}` 
                    : `${colors.answerDefault} ${colors.answerText} ${colors.answerHover}`
                } transition-colors rounded-lg shadow`}
              >
                <Label 
                  htmlFor={`choice-${index}`} 
                  className="flex items-center justify-center p-4 text-lg cursor-