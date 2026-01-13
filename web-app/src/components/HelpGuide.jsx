import { useState, useEffect } from 'react'
import { HelpCircle, X, ChevronRight, ChevronLeft, BookOpen, Clock, LayoutDashboard, Brain, CheckCircle } from 'lucide-react'

// Onboarding Steps
const ONBOARDING_STEPS = [
    {
        title: "¡Bienvenida a OpoTrainer! 👋",
        content: "Esta es tu plataforma de estudio para las oposiciones de cocina. Te guiaremos por las funciones principales.",
        icon: "👩‍🍳"
    },
    {
        title: "Dashboard 📊",
        content: "Tu centro de mando. Aquí ves tu progreso por meses y semanas. Completa las tareas marcándolas con el checkbox.",
        icon: <LayoutDashboard className="w-8 h-8 text-indigo-600" />
    },
    {
        title: "Practicar 🧠",
        content: "Cada semana tiene flashcards y preguntas tipo test. Pulsa 'Practicar' en cualquier tarjeta de semana para estudiar.",
        icon: <Brain className="w-8 h-8 text-purple-600" />
    },
    {
        title: "Temario 📖",
        content: "Explora los 25 temas del temario. Filtra por Legislación o Cocina. Accede a los PDFs oficiales.",
        icon: <BookOpen className="w-8 h-8 text-green-600" />
    },
    {
        title: "Simulacro ⏱️",
        content: "Exámenes cronometrados. Elige entre el examen original (60 preguntas) o los 4 simulacros verificados (20 preguntas cada uno).",
        icon: <Clock className="w-8 h-8 text-orange-600" />
    },
    {
        title: "¡Listo para empezar! 🚀",
        content: "Tu progreso se guarda automáticamente. Pulsa el botón '?' en cualquier momento para ver esta guía de nuevo.",
        icon: <CheckCircle className="w-8 h-8 text-green-500" />
    }
]

// Help Content for Modal
const HELP_SECTIONS = [
    {
        title: "Dashboard",
        icon: <LayoutDashboard className="w-5 h-5" />,
        items: [
            "🗓️ El estudio está organizado en 4 meses",
            "🔒 Los meses se desbloquean al completar los tests del mes anterior",
            "✅ Marca las tareas completadas pulsando sobre ellas",
            "💾 Tu progreso se guarda automáticamente"
        ]
    },
    {
        title: "Práctica Semanal",
        icon: <Brain className="w-5 h-5" />,
        items: [
            "🧠 Cada semana tiene 5 preguntas y 10 flashcards",
            "📝 Modo Test: responde y recibe feedback instantáneo",
            "🔄 Flashcards: pulsa para voltear y ver la respuesta",
            "📚 Contenido específico de cada tema de la semana"
        ]
    },
    {
        title: "Temario",
        icon: <BookOpen className="w-5 h-5" />,
        items: [
            "📖 25 temas organizados por bloques",
            "🏛️ Legislativo: Constitución, LORAFNA, Admin Foral...",
            "🍳 Específico: Cocina, Higiene, Nutrición Infantil...",
            "📄 Acceso directo a los PDFs oficiales"
        ]
    },
    {
        title: "Simulacro",
        icon: <Clock className="w-5 h-5" />,
        items: [
            "⏱️ Examen cronometrado (90 minutos)",
            "📋 5 versiones disponibles:",
            "   • Original: 60 preguntas del PDF oficial",
            "   • Verificados #1-#4: 20 preguntas cada uno con respuestas confirmadas",
            "📊 Al finalizar, análisis de temas débiles"
        ]
    }
]

// Onboarding Component
function Onboarding({ onComplete }) {
    const [step, setStep] = useState(0)
    const currentStep = ONBOARDING_STEPS[step]

    const next = () => {
        if (step < ONBOARDING_STEPS.length - 1) {
            setStep(step + 1)
        } else {
            onComplete()
        }
    }

    const prev = () => {
        if (step > 0) setStep(step - 1)
    }

    const skip = () => {
        onComplete()
    }

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
                {/* Progress bar */}
                <div className="h-1 bg-gray-100">
                    <div
                        className="h-full bg-indigo-600 transition-all duration-300"
                        style={{ width: `${((step + 1) / ONBOARDING_STEPS.length) * 100}%` }}
                    />
                </div>

                <div className="p-8 text-center">
                    {/* Icon */}
                    <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        {typeof currentStep.icon === 'string' ? (
                            <span className="text-4xl">{currentStep.icon}</span>
                        ) : (
                            currentStep.icon
                        )}
                    </div>

                    <h2 className="text-xl font-bold text-gray-900 mb-3">{currentStep.title}</h2>
                    <p className="text-gray-600 mb-8">{currentStep.content}</p>

                    {/* Navigation */}
                    <div className="flex items-center justify-between">
                        <button
                            onClick={skip}
                            className="text-sm text-gray-400 hover:text-gray-600"
                        >
                            Saltar tour
                        </button>

                        <div className="flex gap-2">
                            {step > 0 && (
                                <button
                                    onClick={prev}
                                    className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                            )}
                            <button
                                onClick={next}
                                className="flex items-center gap-2 px-6 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700"
                            >
                                {step === ONBOARDING_STEPS.length - 1 ? '¡Empezar!' : 'Siguiente'}
                                {step < ONBOARDING_STEPS.length - 1 && <ChevronRight className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>

                    {/* Dots indicator */}
                    <div className="flex justify-center gap-1.5 mt-6">
                        {ONBOARDING_STEPS.map((_, i) => (
                            <div
                                key={i}
                                className={`w-2 h-2 rounded-full transition-colors ${i === step ? 'bg-indigo-600' : 'bg-gray-200'}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

// Help Modal Component
function HelpModal({ onClose }) {
    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[80vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                        <HelpCircle className="w-5 h-5 text-indigo-600" />
                        <h2 className="text-lg font-bold text-gray-900">Guía de Uso</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4 space-y-6">
                    {HELP_SECTIONS.map((section, idx) => (
                        <div key={idx}>
                            <h3 className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-3">
                                <span className="p-1 rounded bg-indigo-50 text-indigo-600">{section.icon}</span>
                                {section.title}
                            </h3>
                            <ul className="space-y-2">
                                {section.items.map((item, i) => (
                                    <li key={i} className="text-sm text-gray-600 pl-2">{item}</li>
                                ))}
                            </ul>
                        </div>
                    ))}

                    {/* Documentation Link */}
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                        <h4 className="text-sm font-bold text-gray-900 mb-2">📚 Documentación Completa</h4>
                        <p className="text-xs text-gray-500 mb-3">
                            Consulta el README del proyecto para información técnica detallada.
                        </p>
                        <a
                            href="https://github.com/Michel-Macias/OpoTrainerInma#readme"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-700"
                        >
                            Ver en GitHub <ChevronRight className="w-4 h-4" />
                        </a>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-100 bg-gray-50 text-center">
                    <button
                        onClick={() => {
                            localStorage.removeItem('opotrainer_onboarding_done')
                            window.location.reload()
                        }}
                        className="text-xs text-gray-400 hover:text-indigo-600"
                    >
                        🔄 Repetir tour de bienvenida
                    </button>
                </div>
            </div>
        </div>
    )
}

// Main Export: HelpGuide with Floating Button + Onboarding
export function HelpGuide() {
    const [showOnboarding, setShowOnboarding] = useState(false)
    const [showHelp, setShowHelp] = useState(false)

    useEffect(() => {
        const onboardingDone = localStorage.getItem('opotrainer_onboarding_done')
        if (!onboardingDone) {
            setShowOnboarding(true)
        }
    }, [])

    const completeOnboarding = () => {
        localStorage.setItem('opotrainer_onboarding_done', 'true')
        setShowOnboarding(false)
    }

    return (
        <>
            {/* Onboarding Modal */}
            {showOnboarding && <Onboarding onComplete={completeOnboarding} />}

            {/* Help Modal */}
            {showHelp && <HelpModal onClose={() => setShowHelp(false)} />}

            {/* Floating Help Button */}
            <button
                onClick={() => setShowHelp(true)}
                className="fixed bottom-6 right-6 z-50 w-12 h-12 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 hover:scale-110 transition-all flex items-center justify-center group"
                title="Ayuda"
            >
                <HelpCircle className="w-6 h-6" />
                <span className="absolute right-full mr-3 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    Guía de Uso
                </span>
            </button>
        </>
    )
}
