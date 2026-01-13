import { useState } from 'react'
import { Brain, CheckCircle, XCircle, RotateCw, ArrowRight } from 'lucide-react'
import quizzesData from '../data/weekly_quizzes.json'

export function WeeklyPractice({ monthId, weekId, onClose }) {
    const [mode, setMode] = useState('menu') // 'menu', 'quiz', 'flashcards'
    const dataKey = `${monthId}-${weekId}`
    const data = quizzesData[dataKey]

    if (!data) return (
        <div className="p-8 text-center bg-gray-50 rounded-2xl">
            <p className="text-gray-500">Aún no hay prácticas disponibles para esta semana.</p>
            <button onClick={onClose} className="mt-4 text-indigo-600 font-bold hover:underline">Volver</button>
        </div>
    )

    return (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 text-white flex justify-between items-center">
                <div>
                    <h3 className="font-bold text-xl flex items-center gap-2">
                        <Brain className="w-6 h-6" /> Práctica Semanal
                    </h3>
                    <p className="text-indigo-100 text-sm mt-1">Mes {monthId} • Semana {weekId}</p>
                </div>
                <button onClick={onClose} className="bg-white/20 hover:bg-white/30 rounded-full p-1 transition-colors">
                    <XCircle className="w-6 h-6" />
                </button>
            </div>

            {/* Content */}
            <div className="p-6 min-h-[400px]">
                {mode === 'menu' && (
                    <div className="grid gap-4 h-full content-center">
                        <button
                            onClick={() => setMode('quiz')}
                            className="group flex flex-col items-center justify-center p-8 border-2 border-indigo-100 rounded-2xl hover:border-indigo-500 hover:bg-indigo-50 transition-all"
                        >
                            <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <span className="text-2xl">📝</span>
                            </div>
                            <h4 className="font-bold text-lg text-gray-800">Test Rápido</h4>
                            <p className="text-gray-500 text-sm mt-2 text-center">3 preguntas clave para validar la lectura.</p>
                        </button>

                        <button
                            onClick={() => setMode('flashcards')}
                            className="group flex flex-col items-center justify-center p-8 border-2 border-purple-100 rounded-2xl hover:border-purple-500 hover:bg-purple-50 transition-all"
                        >
                            <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <RotateCw className="w-8 h-8" />
                            </div>
                            <h4 className="font-bold text-lg text-gray-800">Flashcards</h4>
                            <p className="text-gray-500 text-sm mt-2 text-center">Tarjetas de memoria para conceptos.</p>
                        </button>
                    </div>
                )}

                {mode === 'quiz' && <QuizView questions={data.quiz} onBack={() => setMode('menu')} />}
                {mode === 'flashcards' && <FlashcardsView cards={data.flashcards} onBack={() => setMode('menu')} />}
            </div>
        </div>
    )
}

function QuizView({ questions, onBack }) {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [selected, setSelected] = useState(null)
    const [showResult, setShowResult] = useState(false)

    const q = questions[currentIndex]
    const isCorrect = selected === q.correct

    const handleSelect = (idx) => {
        if (showResult) return
        setSelected(idx)
        setShowResult(true)
    }

    const next = () => {
        setSelected(null)
        setShowResult(false)
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(currentIndex + 1)
        } else {
            onBack() // Or show completion screen
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-bold text-gray-400 uppercase">Pregunta {currentIndex + 1} / {questions.length}</span>
                <button onClick={onBack} className="text-xs text-gray-400 hover:text-gray-600">Salir</button>
            </div>

            <h3 className="text-xl font-bold text-gray-800 leading-relaxed">{q.q}</h3>

            <div className="space-y-3">
                {q.options.map((opt, idx) => {
                    let className = "w-full text-left p-4 rounded-xl border-2 transition-all font-medium "
                    if (showResult) {
                        if (idx === q.correct) className += "border-green-500 bg-green-50 text-green-800"
                        else if (idx === selected) className += "border-red-500 bg-red-50 text-red-800"
                        else className += "border-gray-100 opacity-50"
                    } else {
                        className += "border-gray-100 hover:border-indigo-400 hover:bg-gray-50"
                    }

                    return (
                        <button key={idx} onClick={() => handleSelect(idx)} className={className}>
                            {opt}
                        </button>
                    )
                })}
            </div>

            {showResult && (
                <div className={`p-4 rounded-xl ${isCorrect ? 'bg-green-100' : 'bg-red-100'} animate-in fade-in`}>
                    <p className={`font-bold ${isCorrect ? 'text-green-800' : 'text-red-800'} mb-1`}>
                        {isCorrect ? '¡Correcto!' : 'Incorrecto'}
                    </p>
                    <p className="text-sm text-gray-700">{q.explanation}</p>
                    <div className="mt-4 flex justify-end">
                        <button onClick={next} className="bg-gray-900 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-black transition-colors">
                            {currentIndex === questions.length - 1 ? 'Finalizar' : 'Siguiente'} <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

function FlashcardsView({ cards, onBack }) {
    const [index, setIndex] = useState(0)
    const [flipped, setFlipped] = useState(false)

    const next = (e) => {
        e.stopPropagation()
        setFlipped(false)
        setTimeout(() => setIndex((index + 1) % cards.length), 200)
    }

    const prev = (e) => {
        e.stopPropagation()
        setFlipped(false)
        setTimeout(() => setIndex((index - 1 + cards.length) % cards.length), 200)
    }

    const current = cards[index]

    return (
        <div className="flex flex-col items-center justify-center h-full gap-8">
            <div className="flex justify-between w-full">
                <span className="text-xs font-bold text-gray-400">Tarjeta {index + 1} / {cards.length}</span>
                <button onClick={onBack} className="text-xs text-gray-400 hover:text-gray-600">Salir</button>
            </div>

            <div
                onClick={() => setFlipped(!flipped)}
                className="relative w-full max-w-sm h-64 cursor-pointer"
                style={{ perspective: '1000px' }}
            >
                <div
                    className={`relative w-full h-full duration-500 transition-transform ${flipped ? 'rotate-y-180' : ''}`}
                    style={{ transformStyle: 'preserve-3d', WebkitTransformStyle: 'preserve-3d' }}
                >
                    {/* Front */}
                    <div
                        className="absolute w-full h-full bg-white border-2 border-indigo-100 rounded-3xl flex flex-col items-center justify-center p-8 shadow-sm group-hover:shadow-md group-hover:border-indigo-300"
                        style={{
                            backfaceVisibility: 'hidden',
                            WebkitBackfaceVisibility: 'hidden',
                            zIndex: 2
                        }}
                    >
                        <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-4">Concepto</span>
                        <h3 className="text-2xl font-black text-center text-gray-800">{current.front}</h3>
                        <p className="absolute bottom-6 text-xs text-gray-400 flex items-center gap-1">
                            <RotateCw className="w-3 h-3" /> Toca para girar
                        </p>
                    </div>

                    {/* Back */}
                    <div
                        className="absolute w-full h-full bg-indigo-600 rounded-3xl flex flex-col items-center justify-center p-8 shadow-lg text-white"
                        style={{
                            backfaceVisibility: 'hidden',
                            WebkitBackfaceVisibility: 'hidden',
                            transform: 'rotateY(180deg)',
                            zIndex: 1
                        }}
                    >
                        <span className="text-xs font-bold text-indigo-200 uppercase tracking-wider mb-4">Definición</span>
                        <p className="text-lg font-medium text-center leading-relaxed">{current.back}</p>
                    </div>
                </div>
            </div>

            <div className="flex gap-4">
                <button onClick={prev} className="px-6 py-2 rounded-full border border-gray-200 hover:bg-gray-50 font-bold text-gray-500">
                    Anterior
                </button>
                <button onClick={next} className="px-6 py-2 rounded-full bg-indigo-600 text-white font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200">
                    Siguiente
                </button>
            </div>
        </div>
    )
}
