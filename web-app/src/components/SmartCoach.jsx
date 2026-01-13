import { useMemo } from 'react'
import { Lightbulb, BookOpen, Brain, Clock, Calendar } from 'lucide-react'

export function SmartCoach({ activeMonth, activeWeek }) {
    const dayInfo = useMemo(() => {
        const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
        const now = new Date(); // Use real date
        const dayIndex = now.getDay();
        return { name: days[dayIndex], index: dayIndex };
    }, []);

    const getDailyTip = () => {
        const { index } = dayInfo;

        // Lunes (1) -> Lectura Semanal
        if (index === 1) {
            return {
                icon: <BookOpen className="w-6 h-6 text-blue-500" />,
                title: "¡Feliz Lunes de Lectura!",
                msg: `Hoy toca centrarse en la teoría. Revisa los recursos de la semana: "${activeWeek.title}".`,
                color: "bg-blue-50 border-blue-100"
            };
        }

        // Martes (2) - Jueves (4) -> Fichas de Repaso
        if (index >= 2 && index <= 4) {
            return {
                icon: <Brain className="w-6 h-6 text-purple-500" />,
                title: "Ciclo de Estudio Profundo",
                msg: "Es el momento perfecto para completar tus Fichas Digitales. ¿Ya añadiste los conceptos clave de esta semana?",
                color: "bg-purple-50 border-purple-100"
            };
        }

        // Viernes (5) -> Test
        if (index === 5) {
            return {
                icon: <Clock className="w-6 h-6 text-orange-500" />,
                title: " Viernes de Simulacro",
                msg: "Pon a prueba lo aprendido. Intenta hacer las preguntas del test sin mirar los apuntes.",
                color: "bg-orange-50 border-orange-100"
            };
        }

        // Finde -> Descanso / Repaso Ligero
        return {
            icon: <Calendar className="w-6 h-6 text-green-500" />,
            title: "Fin de Semana de Consolidación",
            msg: "Aprovecha para repasar fallos o simplemente descansa. El cerebro necesita desconectar para asimilar.",
            color: "bg-green-50 border-green-100"
        };
    };

    const tip = getDailyTip();

    return (
        <div className={`rounded-xl p-4 border mb-6 flex items-start gap-4 shadow-sm ${tip.color}`}>
            <div className="p-3 bg-white rounded-lg shadow-sm">
                {tip.icon}
            </div>
            <div>
                <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wide mb-1">{tip.title}</h3>
                <p className="text-gray-700 text-sm leading-relaxed max-w-2xl">
                    {tip.msg}
                </p>
            </div>
        </div>
    )
}
