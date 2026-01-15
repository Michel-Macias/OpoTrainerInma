import { useState, useEffect } from 'react'
import { Clock, AlertCircle, CheckCircle, XCircle, BarChart2, BookOpen, RefreshCw } from 'lucide-react'
import questionsDataOriginal from '../data/questions.json'
import examV1 from '../data/exam_v1.json'
import examV2 from '../data/exam_v2.json'
import examV3 from '../data/exam_v3.json'
import examV4 from '../data/exam_v4.json'
import examV5 from '../data/exam_v5.json'
import topicsData from '../data/topics.json'

// Map of available exams
const EXAM_OPTIONS = {
    original: { label: 'Examen PDF Original (60 preguntas)', data: questionsDataOriginal, verified: false },
    v1: { label: 'Simulacro Verificado #1 (20 preguntas)', data: examV1, verified: true },
    v2: { label: 'Simulacro Verificado #2 (20 preguntas)', data: examV2, verified: true },
    v3: { label: 'Simulacro Verificado #3 (20 preguntas)', data: examV3, verified: true },
    v4: { label: 'Simulacro Verificado #4 (20 preguntas)', data: examV4, verified: true },
    v5: { label: 'Simulacro Especial (Nuevos PDFs) #5 (20 preguntas)', data: examV5, verified: true },
}

// --- Correction Mode Helper ---
// Allows user to input correct answers if not present
function CorrectionSetup({ questions, onComplete }) {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [answers, setAnswers] = useState({})

    const currentQ = questions[currentIndex]

    const handleSelect = (optionIndex) => {
        const newAnswers = { ...answers, [currentQ.id]: optionIndex }
        setAnswers(newAnswers)

        // Auto advance
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(currentIndex + 1)
        }
    }

    const finish = () => {
        // Save to localstorage or just pass up
        localStorage.setItem('opotrainer_answer_key', JSON.stringify(answers))
        onComplete(answers)
    }

    return (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-orange-600 flex items-center gap-2">
                <AlertCircle /> Configuración Inicial: Solucionario
            </h2>
            <p className="text-gray-600 mb-6">
                No se ha detectado una plantilla de respuestas. Por favor, marca la respuesta correcta para las siguientes preguntas (solo tendrás que hacerlo una vez).
            </p>

            <div className="mb-6">
                <span className="text-sm font-bold text-gray-400">Pregunta {currentIndex + 1} de {questions.length}</span>
                <h3 className="text-lg font-bold mt-2">{currentQ.text}</h3>
            </div>

            <div className="space-y-3">
                {currentQ.options.map((opt, idx) => (
                    <button
                        key={idx}
                        onClick={() => handleSelect(idx)}
                        className={`w-full text-left p-4 rounded-xl border transition-all ${answers[currentQ.id] === idx
                            ? 'bg-green-100 border-green-500 text-green-800'
                            : 'bg-white border-gray-200 hover:border-indigo-300'
                            }`}
                    >
                        <span className="font-bold mr-2">{String.fromCharCode(97 + idx) + ')'}</span> {opt}
                    </button>
                ))}
            </div>

            <div className="mt-8 flex justify-between">
                <button
                    disabled={currentIndex === 0}
                    onClick={() => setCurrentIndex(currentIndex - 1)}
                    className="text-gray-500 disabled:opacity-50"
                >
                    Anterior
                </button>
                {currentIndex === questions.length - 1 ? (
                    <button onClick={finish} className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-indigo-700">
                        Guardar y Empezar
                    </button>
                ) : (
                    <button onClick={() => setCurrentIndex(currentIndex + 1)} className="text-indigo-600 font-bold">
                        Saltar / Siguiente
                    </button>
                )}
            </div>
        </div>
    )
}

export function TestSimulator({ onNavigate }) {
    const [mode, setMode] = useState('menu') // 'menu', 'setup', 'running', 'results'
    const [selectedExam, setSelectedExam] = useState('v1') // Default to verified exam
    const [timeLeft, setTimeLeft] = useState(90 * 60) // 90 mins in seconds
    const [userAnswers, setUserAnswers] = useState({})
    const [answerKey, setAnswerKey] = useState(() => JSON.parse(localStorage.getItem('opotrainer_answer_key') || 'null'))
    const [activeQuestionIndex, setActiveQuestionIndex] = useState(0)
    const [filterTopic, setFilterTopic] = useState('all')

    const currentExamConfig = EXAM_OPTIONS[selectedExam]
    const questionsData = currentExamConfig.data
    const isVerified = currentExamConfig.verified

    const activeQuestions = questionsData.filter(q => filterTopic === 'all' || q.topicId === parseInt(filterTopic))

    useEffect(() => {
        let timer;
        if (mode === 'running' && timeLeft > 0) {
            timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000)
        }
        return () => clearInterval(timer)
    }, [mode, timeLeft])

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins}:${secs.toString().padStart(2, '0')}`
    }

    const handleStart = () => {
        // Verified exams have correctIndex pre-loaded, no setup needed
        if (!isVerified && !answerKey) {
            setMode('setup')
        } else {
            setMode('running')
            setTimeLeft(90 * 60)
            setUserAnswers({})
            setActiveQuestionIndex(0)
        }
    }

    const handleAnswer = (qId, optionIdx) => {
        setUserAnswers({ ...userAnswers, [qId]: optionIdx })
    }

    const calculateResults = () => {
        let correct = 0
        let incorrect = 0
        let topicAnalysis = {} // { topicId: { total: 0, failed: 0 } }

        activeQuestions.forEach(q => {
            const userAns = userAnswers[q.id]
            // For verified exams, use correctIndex; for original, use answerKey or AI fallback
            const correctAns = isVerified
                ? q.correctIndex
                : (answerKey?.[q.id] ?? q.ai_analysis?.suggested_index)

            // Init topic stats
            if (!topicAnalysis[q.topicId]) topicAnalysis[q.topicId] = { total: 0, failed: 0 }
            topicAnalysis[q.topicId].total++

            if (userAns !== undefined) {
                if (userAns === correctAns) {
                    correct++
                } else {
                    incorrect++
                    topicAnalysis[q.topicId].failed++
                }
            }
        })

        return { correct, incorrect, unsuared: activeQuestions.length - correct - incorrect, topicAnalysis }
    }

    if (mode === 'setup') {
        return <CorrectionSetup questions={questionsData} onComplete={(key) => { setAnswerKey(key); setMode('running'); }} />
    }

    if (mode === 'results') {
        const { correct, incorrect, topicAnalysis } = calculateResults()
        const score = (correct - (incorrect * 0.33)).toFixed(2) // Penalización típica OPE

        // Find weak topics
        const weakTopics = Object.entries(topicAnalysis)
            .filter(([_, stats]) => stats.failed > 0)
            .map(([tId, stats]) => ({
                ...topicsData.find(t => t.id === parseInt(tId)),
                failRate: (stats.failed / stats.total) * 100
            }))
            .sort((a, b) => b.failRate - a.failRate)
            .slice(0, 3)

        return (
            <div className="space-y-8 animate-in fade-in">
                <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Resultados del Simulacro</h2>
                    <div className="text-5xl font-black text-indigo-600 mb-2">{score} <span className="text-lg text-gray-400 font-normal">/ {activeQuestions.length}</span></div>
                    <div className="flex justify-center gap-8 text-sm font-medium text-gray-500 mt-6">
                        <span className="flex items-center gap-1"><CheckCircle className="text-green-500 w-4 h-4" /> {correct} Aciertos</span>
                        <span className="flex items-center gap-1"><XCircle className="text-red-500 w-4 h-4" /> {incorrect} Fallos</span>
                    </div>
                </div>

                {/* Smart Feedback */}
                {weakTopics.length > 0 && (
                    <div className="bg-orange-50 border border-orange-100 p-6 rounded-2xl">
                        <h3 className="font-bold text-orange-800 flex items-center gap-2 mb-4">
                            <AlertCircle className="w-5 h-5" /> ¡Atención! Refuerza estos temas:
                        </h3>
                        <div className="grid gap-3">
                            {weakTopics.map(t => (
                                <div key={t.id} className="bg-white p-3 rounded-lg border border-orange-200 flex justify-between items-center">
                                    <span className="text-sm font-medium text-gray-700">Tema {t.id}: {t.title}</span>
                                    <button
                                        onClick={() => onNavigate('syllabus')}
                                        className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded hover:bg-orange-200"
                                    >
                                        Ir a Repasar
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="flex justify-center">
                    <button onClick={() => setMode('menu')} className="flex items-center gap-2 bg-gray-800 text-white px-6 py-3 rounded-xl font-bold hover:bg-gray-900 shadow-lg transition-transform hover:scale-105">
                        <RefreshCw className="w-5 h-5" /> Volver al Menú
                    </button>
                </div>
            </div>
        )
    }

    if (mode === 'running') {
        const currentQ = activeQuestions[activeQuestionIndex]

        return (
            <div className="grid md:grid-cols-12 gap-6 min-h-[500px]">
                {/* Question Area */}
                <div className="md:col-span-8 space-y-6">
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 min-h-[400px] flex flex-col">
                        <div className="flex justify-between items-start mb-6">
                            <span className="text-xs font-bold bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full uppercase tracking-wider">
                                Pregunta {activeQuestionIndex + 1} de {activeQuestions.length}
                            </span>
                        </div>

                        <h3 className="text-xl font-semibold text-gray-900 leading-relaxed mb-8 flex-1">
                            {currentQ.text}
                        </h3>

                        <div className="space-y-3">
                            {currentQ.options.map((opt, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleAnswer(currentQ.id, idx)}
                                    className={`w-full text-left p-5 rounded-xl border-2 transition-all group ${userAnswers[currentQ.id] === idx
                                        ? 'border-indigo-600 bg-indigo-50 text-indigo-900'
                                        : 'border-gray-100 hover:border-indigo-200 hover:bg-gray-50'
                                        }`}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5 ${userAnswers[currentQ.id] === idx
                                            ? 'border-indigo-600 bg-indigo-600 text-white'
                                            : 'border-gray-300 text-gray-400 group-hover:border-indigo-400'
                                            }`}>
                                            {String.fromCharCode(65 + idx)}
                                        </div>
                                        <span className="text-sm md:text-base font-medium">{opt}</span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Navigation */}
                    <div className="flex justify-between items-center">
                        <button
                            onClick={() => setActiveQuestionIndex(Math.max(0, activeQuestionIndex - 1))}
                            className="px-6 py-2 text-gray-500 font-medium hover:text-gray-900 disabled:opacity-50"
                            disabled={activeQuestionIndex === 0}
                        >
                            Anterior
                        </button>

                        {activeQuestionIndex === activeQuestions.length - 1 ? (
                            <button
                                onClick={() => setMode('results')}
                                className="px-8 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 shadow-lg shadow-green-200 transition-all hover:-translate-y-1"
                            >
                                Finalizar Examen
                            </button>
                        ) : (
                            <button
                                onClick={() => setActiveQuestionIndex(Math.min(activeQuestions.length - 1, activeQuestionIndex + 1))}
                                className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all hover:-translate-y-1"
                            >
                                Siguiente
                            </button>
                        )}
                    </div>
                </div>

                {/* Sidebar Info */}
                <div className="md:col-span-4 space-y-4">
                    <div className="bg-gray-900 text-white p-6 rounded-2xl shadow-lg sticky top-24">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-gray-400 text-sm font-medium uppercase tracking-wider">Tiempo Restante</span>
                            <Clock className="text-yellow-400 w-5 h-5 animate-pulse" />
                        </div>
                        <div className="text-4xl font-mono font-bold tracking-tight">
                            {formatTime(timeLeft)}
                        </div>

                        <div className="mt-8 pt-6 border-t border-gray-800">
                            <h4 className="text-xs font-bold text-gray-500 uppercase mb-3">Progreso del Examen</h4>
                            <div className="grid grid-cols-5 gap-1.5">
                                {activeQuestions.map((q, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setActiveQuestionIndex(i)}
                                        className={`h-2 rounded-sm transition-colors ${i === activeQuestionIndex ? 'bg-yellow-400' :
                                            userAnswers[q.id] !== undefined ? 'bg-indigo-500' : 'bg-gray-700'
                                            }`}
                                    />
                                ))}
                            </div>
                            <p className="text-right text-xs text-gray-500 mt-2">{Object.keys(userAnswers).length} / {activeQuestions.length} contestadas</p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    // --- MENU MODE ---
    return (
        <div className="min-h-[600px] flex items-center justify-center p-4">
            <div className="text-center space-y-8 max-w-lg w-full">
                <div className="w-20 h-20 bg-indigo-100 text-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6 transform rotate-3">
                    <Clock className="w-10 h-10" />
                </div>

                <div>
                    <h1 className="text-4xl font-black text-gray-900 mb-2">Simulacro Real</h1>
                    <p className="text-gray-500 text-lg">
                        {isVerified ? `${questionsData.length} preguntas • Respuestas Verificadas` : '90 minutos • 60 preguntas • Penalización por error'}
                    </p>
                </div>

                {/* Exam Version Selector */}
                <div className="bg-indigo-50 border-2 border-indigo-100 p-4 rounded-xl text-left">
                    <label className="text-xs font-bold text-indigo-700 uppercase tracking-wide block mb-2">Selecciona el Examen</label>
                    <select
                        className="w-full bg-white border border-indigo-200 text-gray-800 text-sm rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-indigo-400"
                        onChange={(e) => setSelectedExam(e.target.value)}
                        value={selectedExam}
                    >
                        {Object.entries(EXAM_OPTIONS).map(([key, { label }]) => (
                            <option key={key} value={key}>{label}</option>
                        ))}
                    </select>
                </div>

                {selectedExam === 'original' && (
                    <div className="bg-yellow-50 border-2 border-yellow-100 p-4 rounded-xl text-left">
                        <label className="text-xs font-bold text-yellow-700 uppercase tracking-wide block mb-2">Filtrar por Tema (Opcional)</label>
                        <select
                            className="w-full bg-white border border-yellow-200 text-gray-800 text-sm rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-yellow-400"
                            onChange={(e) => setFilterTopic(e.target.value)}
                            value={filterTopic}
                        >
                            <option value="all">📝 Examen Completo (Todos los temas)</option>
                            {topicsData.map(t => (
                                <option key={t.id} value={t.id}>Tema {t.id}: {t.title}</option>
                            ))}
                        </select>
                    </div>
                )}

                {isVerified && (
                    <div className="flex items-center justify-center gap-2 text-green-600 text-sm font-medium">
                        <CheckCircle className="w-4 h-4" /> Respuestas pre-cargadas. ¡Listo para empezar!
                    </div>
                )}

                <button
                    onClick={handleStart}
                    className="w-full group relative flex items-center justify-center gap-3 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all shadow-xl shadow-indigo-200 hover:-translate-y-1"
                >
                    <span>Comenzar Simulacro</span>
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors">
                        <Clock className="w-4 h-4" />
                    </div>
                </button>

                {!isVerified && !answerKey && (
                    <p className="text-xs text-center text-gray-400">
                        * Primer inicio: Se requerirá configuración rápida de respuestas.
                    </p>
                )}
            </div>
        </div>
    )
}
