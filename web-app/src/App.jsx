import { useState, useEffect } from 'react'
import curriculumData from './data/curriculum.json'
import { SyllabusExplorer } from './components/SyllabusExplorer'
import { TestSimulator } from './components/TestSimulator'
import { SmartCoach } from './components/SmartCoach'
import { WeeklyPractice } from './components/WeeklyPractice'
import { HelpGuide } from './components/HelpGuide'
import { LayoutDashboard, BookOpen, Clock, Lock, Brain } from 'lucide-react'

function App() {
  const [activeTab, setActiveTab] = useState('dashboard') // 'dashboard' | 'syllabus' | 'test'
  const [activeMonth, setActiveMonth] = useState(curriculumData.months[0]);
  const [practiceSession, setPracticeSession] = useState(null) // { monthId, weekId } or null

  const [completedTasks, setCompletedTasks] = useState(() => {
    const saved = localStorage.getItem('opotrainer_progress');
    return saved ? JSON.parse(saved) : {};
  });

  // Calculate active week (first week with incomplete tasks in active month, or last week)
  const activeWeek = activeMonth.weeks.find(w => w.tasks.some(t => !completedTasks[t.id])) || activeMonth.weeks[activeMonth.weeks.length - 1];

  useEffect(() => {
    localStorage.setItem('opotrainer_progress', JSON.stringify(completedTasks));
  }, [completedTasks]);

  const toggleTask = (taskId) => {
    setCompletedTasks(prev => ({
      ...prev,
      [taskId]: !prev[taskId]
    }));
  };

  // Calculate global progress
  const totalTasks = curriculumData.months.flatMap(m => m.weeks.flatMap(w => w.tasks)).length;
  const completedCount = Object.values(completedTasks).filter(Boolean).length;
  const progressPercentage = totalTasks === 0 ? 0 : Math.round((completedCount / totalTasks) * 100);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={`${import.meta.env.BASE_URL}icon.png`} alt="OpoTrainer" className="w-8 h-8" />
            <h1 className="text-xl font-bold text-gray-900 tracking-tight hidden sm:block">OpoTrainer <span className="text-indigo-600">Inma</span></h1>
          </div>

          {/* Navigation Tabs */}
          <div className="flex bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === 'dashboard' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-900'
                }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('syllabus')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === 'syllabus' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-900'
                }`}
            >
              <BookOpen className="w-4 h-4" />
              Temario
            </button>
            <button
              onClick={() => setActiveTab('test')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === 'test' ? 'bg-white text-orange-600 shadow-sm ring-1 ring-orange-100' : 'text-gray-500 hover:text-gray-900'
                }`}
            >
              <Clock className="w-4 h-4" />
              Simulacro
            </button>
          </div>

          <div className="flex items-center gap-3 hidden sm:flex">
            <div className="text-right">
              <div className="text-xs font-medium text-gray-500 uppercase">Progreso Global</div>
              <div className="text-sm font-bold text-gray-900">{progressPercentage}%</div>
            </div>
            <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-600 transition-all duration-500 ease-out"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full relative">
        {practiceSession && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
            <div className="w-full max-w-2xl">
              <WeeklyPractice
                monthId={practiceSession.monthId}
                weekId={practiceSession.weekId}
                onClose={() => setPracticeSession(null)}
              />
            </div>
          </div>
        )}

        {activeTab === 'dashboard' ? (
          <>
            {/* Smart Coach Banner */}
            <SmartCoach activeMonth={activeMonth} activeWeek={activeWeek} />

            {/* Timeline Navigation */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {curriculumData.months.map((month, index) => {
                // Month Locking Logic
                // Unlocked if it's the first month OR previous month's final test is completed
                let isLocked = false;
                if (index > 0) {
                  const prevMonth = curriculumData.months[index - 1];
                  const prevMonthTests = prevMonth.weeks.flatMap(w => w.tasks).filter(t => t.type === 'test' || t.type === 'simulacrum');
                  // Check if ALL tests of previous month are done
                  const allTestsPassed = prevMonthTests.every(t => completedTasks[t.id]);
                  isLocked = !allTestsPassed;
                }

                // Calculate month progress
                const monthTasks = month.weeks.flatMap(w => w.tasks);
                const monthCompleted = monthTasks.filter(t => completedTasks[t.id]).length;
                const monthProgress = monthTasks.length === 0 ? 0 : (monthCompleted / monthTasks.length) * 100;

                return (
                  <button
                    key={month.id}
                    disabled={isLocked}
                    onClick={() => !isLocked && setActiveMonth(month)}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 text-left relative overflow-hidden group ${isLocked
                      ? 'bg-gray-100 border-gray-200 cursor-not-allowed opacity-70'
                      : activeMonth.id === month.id
                        ? 'border-indigo-600 bg-indigo-50 shadow-md ring-2 ring-indigo-100'
                        : 'border-gray-200 bg-white hover:border-indigo-300 hover:shadow-sm'
                      }`}
                  >
                    {!isLocked && (
                      <div className={`absolute top-0 right-0 p-1 opacity-10 font-black text-6xl -mr-4 -mt-2 group-hover:scale-110 transition-transform text-${month.color}-600`}>
                        {month.id}
                      </div>
                    )}

                    <div className="flex justify-between items-start mb-1">
                      <span className="uppercase text-xs font-bold text-gray-500 tracking-wider block">
                        Mes {month.id}
                      </span>
                      {isLocked && <Lock className="w-4 h-4 text-gray-400" />}
                    </div>

                    <h3 className={`font-semibold leading-tight mb-2 ${isLocked ? 'text-gray-400' : activeMonth.id === month.id ? 'text-indigo-900' : 'text-gray-900'
                      }`}>
                      {month.title}
                    </h3>
                    {/* Mini progress bar for month */}
                    <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${isLocked ? 'bg-gray-300' : `bg-${month.color}-500`} transition-all duration-300`}
                        style={{ width: `${monthProgress}%` }}
                      />
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Active Month View */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">{activeMonth.title}</h2>
                <div className="flex gap-2">
                  {activeMonth.resources.map((res, idx) => (
                    <a
                      key={idx}
                      href={`${import.meta.env.BASE_URL}pdfs/${res.file}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-sm transition-colors"
                    >
                      📄 {res.name}
                    </a>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {activeMonth.weeks.map((week) => {
                  const weekTasks = week.tasks;
                  const weekCompleted = weekTasks.filter(t => completedTasks[t.id]).length;
                  const isWeekComplete = weekCompleted === weekTasks.length && weekTasks.length > 0;

                  return (
                    <div key={week.id} className={`rounded-2xl p-6 border transition-all ${isWeekComplete ? 'bg-green-50 border-green-200' : 'bg-white border-gray-100 shadow-sm hover:shadow-md'}`}>
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold mb-2 ${isWeekComplete ? 'bg-green-200 text-green-800' : 'bg-indigo-100 text-indigo-700'}`}>
                            SEMANA {week.id} {isWeekComplete ? '✅' : ''}
                          </span>
                          <h3 className="text-lg font-bold text-gray-900">{week.title}</h3>
                        </div>
                        <button
                          onClick={() => setPracticeSession({ monthId: activeMonth.id, weekId: week.id })}
                          className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg flex items-center gap-1 hover:bg-indigo-100 transition-colors"
                        >
                          <Brain className="w-3 h-3" /> Practicar
                        </button>
                      </div>

                      {/* Tasks */}
                      <ul className="space-y-3 mb-6">
                        {week.tasks.map((task) => (
                          <li key={task.id} className="flex items-start gap-3 group cursor-pointer" onClick={() => toggleTask(task.id)}>
                            <div className="relative flex items-center mt-0.5">
                              <input
                                type="checkbox"
                                checked={!!completedTasks[task.id]}
                                onChange={() => { }} // Handled by li onClick
                                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600 cursor-pointer"
                              />
                            </div>
                            <span className={`text-sm transition-colors select-none ${completedTasks[task.id] ? 'text-gray-400 line-through' : 'text-gray-600 group-hover:text-gray-900'}`}>
                              {task.text}
                            </span>
                          </li>
                        ))}
                      </ul>

                      {/* Concepts / Flashcards Mini-view */}
                      {week.concepts.length > 0 && (
                        <div className="bg-white/50 rounded-xl p-3 border border-gray-100">
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Conceptos Clave</p>
                          <div className="flex flex-wrap gap-2">
                            {week.concepts.map((concept, i) => (
                              <div key={i} className="group relative">
                                <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-white border border-gray-200 text-gray-600 cursor-help">
                                  💡 {concept.term}
                                </span>
                                {/* Simple tooltip effect */}
                                <div className="absolute bottom-full left-0 mb-2 w-48 p-2 bg-gray-800 text-white text-xs rounded hidden group-hover:block z-20">
                                  {concept.def}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </>
        ) : activeTab === 'syllabus' ? (
          <SyllabusExplorer />
        ) : (
          <TestSimulator />
        )}
      </main>

      {/* Help Guide: Onboarding + Floating Button */}
      <HelpGuide />
    </div>
  )
}

export default App
