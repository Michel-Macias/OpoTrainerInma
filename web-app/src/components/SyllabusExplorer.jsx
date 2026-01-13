import { useState } from 'react'
import topicsData from '../data/topics.json'
import { ReviewSheet } from './ReviewSheet'
import { BookOpen, Search, FileText, ChevronRight } from 'lucide-react'

export function SyllabusExplorer() {
    const [filter, setFilter] = useState('all') // 'all', 'general', 'specific'
    const [search, setSearch] = useState('')
    const [selectedTopic, setSelectedTopic] = useState(null)

    const filteredTopics = topicsData.filter(topic => {
        const matchesFilter = filter === 'all' || topic.block === filter;
        const matchesSearch = topic.title.toLowerCase().includes(search.toLowerCase()) ||
            topic.description.toLowerCase().includes(search.toLowerCase()) ||
            topic.id.toString().includes(search);
        return matchesFilter && matchesSearch;
    });

    const handleTopicClick = (topic) => {
        setSelectedTopic(topic);
        // Smooth scroll to details if on mobile
        if (window.innerWidth < 768) {
            setTimeout(() => {
                document.getElementById('topic-detail')?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        }
    };

    return (
        <div className="grid md:grid-cols-12 gap-6 min-h-[calc(100vh-200px)]">
            {/* Sidebar / List */}
            <div className={`md:col-span-5 flex flex-col gap-4 ${selectedTopic ? 'hidden md:flex' : 'flex'}`}>

                {/* Filters & Search */}
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm sticky top-24 z-10">
                    <div className="relative mb-4">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Buscar tema (ej. 'Verduras', 'Tema 5')..."
                            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 hover:bg-gray-100 transition-colors"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="flex bg-gray-100 p-1 rounded-lg">
                        {['all', 'general', 'specific'].map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all capitalize ${filter === f
                                    ? 'bg-white text-indigo-600 shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                {{ all: 'Todos', general: 'General', specific: 'Cocina' }[f]}
                            </button>
                        ))}
                    </div>
                </div>

                {/* List */}
                <div className="flex-1 space-y-2">
                    {filteredTopics.map(topic => (
                        <button
                            key={topic.id}
                            onClick={() => handleTopicClick(topic)}
                            className={`w-full text-left p-4 rounded-xl border transition-all duration-200 group relative overflow-hidden ${selectedTopic?.id === topic.id
                                ? 'bg-indigo-600 border-indigo-600 text-white shadow-md'
                                : 'bg-white border-gray-200 hover:border-indigo-300 hover:shadow-sm'
                                }`}
                        >
                            <div className="flex items-start justify-between">
                                <div>
                                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full mb-2 inline-block ${selectedTopic?.id === topic.id
                                        ? 'bg-white/20 text-white'
                                        : topic.block === 'general' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'
                                        }`}>
                                        Tema {topic.id}
                                    </span>
                                    <h3 className={`font-semibold leading-tight ${selectedTopic?.id === topic.id ? 'text-white' : 'text-gray-900'}`}>{topic.title}</h3>
                                </div>
                                <ChevronRight className={`w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity ${selectedTopic?.id === topic.id ? 'text-white' : 'text-gray-400'}`} />
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Details View */}
            <div id="topic-detail" className={`md:col-span-7 ${!selectedTopic ? 'hidden md:flex md:items-center md:justify-center' : 'block'}`}>
                {!selectedTopic ? (
                    <div className="text-center text-gray-400 p-8 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50 w-full h-full flex flex-col items-center justify-center min-h-[400px]">
                        <BookOpen className="w-12 h-12 mb-4 opacity-50" />
                        <p className="font-medium">Selecciona un tema para ver los detalles</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden sticky top-24 min-h-[500px] flex flex-col">
                        {/* Detail Header */}
                        <div className={`p-6 ${selectedTopic.block === 'general' ? 'bg-blue-600' : 'bg-orange-500'} text-white`}>
                            <button
                                onClick={() => setSelectedTopic(null)}
                                className="md:hidden mb-4 text-xs font-bold bg-white/20 px-3 py-1 rounded-full hover:bg-white/30"
                            >
                                ← Volver al índice
                            </button>
                            <div className="flex items-center gap-3 opacity-90 text-sm font-medium mb-1">
                                <span className="uppercase tracking-wider">Bloque {selectedTopic.block === 'general' ? 'Legislativo' : 'Específico'}</span>
                                <span>•</span>
                                <span>Tema {selectedTopic.id}</span>
                            </div>
                            <h2 className="text-3xl font-bold mb-2">{selectedTopic.title}</h2>
                            <p className="text-white/90 leading-relaxed text-sm md:text-base opacity-90">
                                {selectedTopic.description}
                            </p>
                        </div>

                        {/* Resources Section */}
                        <div className="p-6 space-y-8 flex-1">

                            {/* PDF Resource */}
                            <div>
                                <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                                    <FileText className="w-4 h-4" /> Recurso Oficial
                                </h4>
                                {selectedTopic.pdf ? (
                                    <a
                                        href={`${import.meta.env.BASE_URL}pdfs/${selectedTopic.pdf}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block p-4 rounded-xl border border-gray-200 hover:border-indigo-500 hover:bg-indigo-50 transition-all group"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center text-red-600 font-bold group-hover:scale-110 transition-transform">
                                                PDF
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900 group-hover:text-indigo-700">Ver Documento Oficial</p>
                                                <p className="text-xs text-gray-500">{selectedTopic.pdf}</p>
                                            </div>
                                        </div>
                                    </a>
                                ) : (
                                    <div className="p-4 rounded-xl border border-dashed border-gray-300 bg-gray-50 text-gray-400 text-sm text-center">
                                        No hay PDF específico asociado a este tema aún.
                                    </div>
                                )}
                            </div>

                            {/* Study Cards / Review Sheet */}
                            <div>
                                <ReviewSheet topic={selectedTopic} />
                            </div>

                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
