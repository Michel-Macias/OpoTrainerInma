import { useState, useEffect } from 'react'
import curriculumData from './data/curriculum.json'

function App() {
  const [activeMonth, setActiveMonth] = useState(curriculumData.months[0]);
  const [completedTasks, setCompletedTasks] = useState(() => {
    const saved = localStorage.getItem('opotrainer_progress');
    return saved ? JSON.parse(saved) : {};
  });

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
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">👩‍🍳</span>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">OpoTrainer <span className="text-indigo-600">Inma</span></h1>
          </div>
          <div className="flex items-center gap-3">
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

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Timeline Navigation */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {curriculumData.months.map((month) => {
            // Calculate month progress
            const monthTasks = month.weeks.flatMap(w => w.tasks);
            const monthCompleted = monthTasks.filter(t => completedTasks[t.id]).length;
            const monthProgress = monthTasks.length === 0 ? 0 : (monthCompleted / monthTasks.length) * 100;

            return (
              <button
                key={month.id}
                onClick={() => setActiveMonth(month)}
                className={`p-4 rounded-xl border-2 transition-all duration-200 text-left relative overflow-hidden group ${activeMonth.id === month.id
                    ? 'border-indigo-600 bg-indigo-50 shadow-md ring-2 ring-indigo-100'
                    : 'border-gray-200 bg-white hover:border-indigo-300 hover:shadow-sm'
                  }`}
              >
                <div className={`absolute top-0 right-0 p-1 opacity-10 font-black text-6xl -mr-4 -mt-2 group-hover:scale-110 transition-transform text-${month.color}-600`}>
                  {month.id}
                </div>
                <span className="uppercase text-xs font-bold text-gray-500 tracking-wider mb-1 block">
                  Mes {month.id}
                </span>
                <h3 className={`font-semibold leading-tight mb-2 ${activeMonth.id === month.id ? 'text-indigo-900' : 'text-gray-900'
                  }`}>
                  {month.title}
                </h3>
                {/* Mini progress bar for month */}
                <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-${month.color}-500 transition-all duration-300`}
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
                  href={`/pdfs/${res.file}`}
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
      </main>
    </div>
  )
}

export default App
