import { useState } from 'react'
import { useReviewSheet } from '../hooks/useReviewSheet'
import { Edit2, Eye, Save, Plus, Trash2, Brain, Check, Thermometer, Clock, AlertTriangle } from 'lucide-react'

export function ReviewSheet({ topic }) {
    const { sheetData, saveSheet } = useReviewSheet(topic.id)
    const [isEditing, setIsEditing] = useState(false)
    const [localData, setLocalData] = useState(sheetData)
    const [activeTab, setActiveTab] = useState('concepts') // 'concepts', 'kitchen', 'notes'

    // Sync hook data to local form state on open
    const handleEditToggle = () => {
        if (isEditing) {
            // Cancel changes
            setLocalData(sheetData)
        } else {
            // Start editing
            setLocalData(sheetData)
        }
        setIsEditing(!isEditing)
    }

    const handleSave = () => {
        saveSheet(localData)
        setIsEditing(false)
    }

    const addConcept = () => {
        setLocalData({ ...localData, concepts: [...localData.concepts, { term: '', def: '' }] })
    }

    const removeConcept = (index) => {
        const newConcepts = localData.concepts.filter((_, i) => i !== index)
        setLocalData({ ...localData, concepts: newConcepts })
    }

    const updateConcept = (index, field, value) => {
        const newConcepts = [...localData.concepts]
        newConcepts[index] = { ...newConcepts[index], [field]: value }
        setLocalData({ ...localData, concepts: newConcepts })
    }

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-50 to-white px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                    <Brain className="w-5 h-5 text-indigo-600" />
                    Ficha de Repaso Digital
                </h3>
                <button
                    onClick={isEditing ? handleSave : handleEditToggle}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${isEditing
                            ? 'bg-green-600 text-white hover:bg-green-700 shadow-md'
                            : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
                        }`}
                >
                    {isEditing ? <><Save className="w-4 h-4" /> Guardar</> : <><Edit2 className="w-4 h-4" /> Editar</>}
                </button>
            </div>

            <div className="p-6">
                {/* Navigation Tabs (Only in View Mode) */}
                {!isEditing && (
                    <div className="flex gap-2 mb-6 border-b border-gray-100 pb-1">
                        <button
                            onClick={() => setActiveTab('concepts')}
                            className={`pb-2 px-2 text-sm font-medium transition-colors border-b-2 ${activeTab === 'concepts' ? 'border-indigo-500 text-indigo-700' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                        >Conceptos Clave</button>
                        <button
                            onClick={() => setActiveTab('kitchen')}
                            className={`pb-2 px-2 text-sm font-medium transition-colors border-b-2 ${activeTab === 'kitchen' ? 'border-indigo-500 text-indigo-700' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                        >Zona Cocina</button>
                    </div>
                )}

                {/* --- EDIT MODE --- */}
                {isEditing ? (
                    <div className="space-y-8 animate-in fade-in duration-300">
                        {/* Concepts Editor */}
                        <div>
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Conceptos & Definiciones</h4>
                            <div className="space-y-3">
                                {localData.concepts.map((concept, i) => (
                                    <div key={i} className="flex gap-3 items-start p-3 rounded-xl bg-gray-50 border border-gray-100">
                                        <div className="flex-1 space-y-2">
                                            <input
                                                type="text"
                                                placeholder="Término (ej. Reacción de Maillard)"
                                                className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-md focus:ring-2 focus:ring-indigo-500"
                                                value={concept.term}
                                                onChange={(e) => updateConcept(i, 'term', e.target.value)}
                                            />
                                            <textarea
                                                placeholder="Definición o truco..."
                                                className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-md focus:ring-2 focus:ring-indigo-500 min-h-[60px]"
                                                value={concept.def}
                                                onChange={(e) => updateConcept(i, 'def', e.target.value)}
                                            />
                                        </div>
                                        <button onClick={() => removeConcept(i)} className="text-gray-400 hover:text-red-500 p-1">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                                <button onClick={addConcept} className="w-full py-2 border-2 border-dashed border-gray-200 rounded-xl text-gray-400 hover:text-indigo-600 hover:border-indigo-300 hover:bg-indigo-50 text-sm font-medium transition-all flex items-center justify-center gap-2">
                                    <Plus className="w-4 h-4" /> Añadir Concepto
                                </button>
                            </div>
                        </div>

                        {/* Kitchen Data Editor */}
                        <div>
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                                <Thermometer className="w-4 h-4" /> Datos Técnicos
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">Temperaturas / Plazos</label>
                                    <input
                                        type="text"
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                                        placeholder="Ej. 65ºC corazón producto"
                                        value={localData.kitchen.temp}
                                        onChange={(e) => setLocalData({ ...localData, kitchen: { ...localData.kitchen, temp: e.target.value } })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">Puntos Críticos (APPCC)</label>
                                    <input
                                        type="text"
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                                        placeholder="Ej. Control de recepción"
                                        value={localData.kitchen.appcc}
                                        onChange={(e) => setLocalData({ ...localData, kitchen: { ...localData.kitchen, appcc: e.target.value } })}
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-medium text-gray-600 mb-1">Alérgenos / Notas</label>
                                    <textarea
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                                        placeholder="Ej. Huevo, Gluten..."
                                        value={localData.kitchen.allergens}
                                        onChange={(e) => setLocalData({ ...localData, kitchen: { ...localData.kitchen, allergens: e.target.value } })}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    // --- VIEW / FLASHCARD MODE ---
                    <div className="min-h-[300px] animate-in slide-in-from-bottom-2 duration-500">

                        {activeTab === 'concepts' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {sheetData.concepts.filter(c => c.term).length === 0 ? (
                                    <div className="col-span-2 text-center py-12 text-gray-400 italic">
                                        No hay conceptos añadidos. Dale a "Editar" para empezar.
                                    </div>
                                ) : (
                                    sheetData.concepts.filter(c => c.term).map((concept, i) => (
                                        <Flashcard key={i} term={concept.term} def={concept.def} />
                                    ))
                                )}
                            </div>
                        )}

                        {activeTab === 'kitchen' && (
                            <div className="bg-orange-50 rounded-xl p-6 border border-orange-100 space-y-4">
                                <div className="flex items-start gap-4">
                                    <div className="p-2 bg-white rounded-lg shadow-sm text-orange-500"><Thermometer className="w-6 h-6" /></div>
                                    <div>
                                        <p className="text-xs font-bold text-orange-800 uppercase">Temperaturas / Plazos</p>
                                        <p className="font-medium text-gray-800 text-lg">{sheetData.kitchen.temp || '-'}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="p-2 bg-white rounded-lg shadow-sm text-red-500"><AlertTriangle className="w-6 h-6" /></div>
                                    <div>
                                        <p className="text-xs font-bold text-red-800 uppercase">Puntos Críticos (APPCC)</p>
                                        <p className="font-medium text-gray-800 text-lg">{sheetData.kitchen.appcc || '-'}</p>
                                    </div>
                                </div>
                                <div className="pt-4 border-t border-orange-200/50">
                                    <p className="text-xs font-bold text-gray-500 uppercase mb-1">Notas / Alérgenos</p>
                                    <p className="text-gray-700 italic">{sheetData.kitchen.allergens || 'Sin notas.'}</p>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

function Flashcard({ term, def }) {
    const [flipped, setFlipped] = useState(false)
    return (
        <div
            onClick={() => setFlipped(!flipped)}
            className={`group relative h-40 cursor-pointer perspective-1000`}
        >
            <div className={`relative w-full h-full text-center transition-all duration-500 transform-style-3d ${flipped ? 'rotate-y-180' : ''}`} style={{ transformStyle: 'preserve-3d', transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}>
                {/* Front */}
                <div className="absolute w-full h-full backface-hidden bg-white border-2 border-indigo-100 hover:border-indigo-400 rounded-xl flex items-center justify-center p-4 shadow-sm group-hover:shadow-md transition-all flex-col gap-2">
                    <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Concepto</span>
                    <h4 className="font-bold text-gray-800 text-lg">{term}</h4>
                    <p className="text-xs text-gray-400 mt-2">(Clic para ver respuesta)</p>
                </div>
                {/* Back */}
                <div className="absolute w-full h-full backface-hidden bg-indigo-600 text-white rounded-xl flex items-center justify-center p-4 shadow-lg rotate-y-180" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                    <p className="text-center font-medium leading-relaxed overflow-y-auto max-h-full scrollbar-hide text-sm">{def}</p>
                </div>
            </div>
        </div>
    )
}
