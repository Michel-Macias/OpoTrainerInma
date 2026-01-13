# 👩‍🍳 OpoTrainer Inma

> **Plataforma interactiva de estudio para Oposiciones de Cocina (Escuelas Infantiles Pamplona).**  
> Transforma un temario estático en una experiencia de aprendizaje gamificada, visual y persistente.

[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![GitHub Pages](https://img.shields.io/badge/Deploy-GitHub_Pages-222222?style=for-the-badge&logo=github)](https://michel-macias.github.io/OpoTrainerInma/)

---

## 🚀 Demo en Vivo

👉 **[https://Michel-Macias.github.io/OpoTrainerInma/](https://Michel-Macias.github.io/OpoTrainerInma/)**

---

## 💡 Sobre el Proyecto

**OpoTrainer Inma** nace de la necesidad de modernizar el estudio de oposiciones. Lejos de los interminables PDFs, esta aplicación ofrece un **"Centro de Mando"** donde el opositor puede visualizar su progreso, acceder a los recursos legales al instante y gestionar su estudio semanal de forma eficiente.

---

## ✨ Características Principales

### 📊 Dashboard Inteligente (Smart Coach)
Tu entrenador personal automatizado que guía tu ciclo de estudio:
- **Lunes:** Recordatorios de lectura
- **Martes-Jueves:** Flashcards y fichas de repaso
- **Viernes:** Tests y simulacros
- **🔒 Month Guard:** Sistema de bloqueo progresivo por meses

### 🧠 Práctica Semanal Ampliada
Cada semana del plan incluye:
- **5 preguntas tipo test** con feedback inmediato
- **10 flashcards** para memorizar conceptos clave
- **Contenido verificado** contra documentos oficiales
- **Total: 80 preguntas + 160 flashcards** en el programa completo

### ⏱️ Simulacro de Examen
Módulo diseñado para recrear la presión del examen oficial:
- **Cronómetro** de 90 minutos
- **5 versiones disponibles:**
  - 📋 Original: 60 preguntas del PDF oficial
  - ✅ Verificados #1-#4: 20 preguntas cada uno con respuestas confirmadas
- **Análisis de fallos:** Identifica temas débiles a reforzar

### 📖 Explorador de Temario
Los 25 temas del temario organizados y accesibles:
- **Filtrado** por bloque: Legislativo vs Cocina/Específico
- **Acceso directo** a PDFs oficiales (Constitución, LORAFNA, Guía Higiene...)
- **Conceptos clave** en cada tema

### ❓ Guía de Uso Integrada
Sistema de ayuda dentro de la aplicación:
- **Onboarding:** Tour de bienvenida al primer uso (6 pasos)
- **Botón flotante (?):** Acceso rápido a la guía en cualquier momento
- **Ayuda por secciones:** Dashboard, Práctica, Temario, Simulacro

### 💾 Persistencia de Datos
- Tu progreso se **guarda automáticamente** en el navegador
- Marca tareas completadas y no las pierdas
- Funciona offline después de la primera carga

---

## 📚 Contenido del Temario

| Mes | Temas | Enfoque |
|-----|-------|---------|
| **1** | CE, LORAFNA, Organización Cocina, L+D, APPCC | Fundamentos |
| **2** | Admin Foral, Huevos/Carnes, Técnicas Cocción, Salsas | Técnica |
| **3** | Igualdad, Datos, Nutrición Infantil, Alérgenos | Social/Dietético |
| **4** | Repaso Global + Simulacros Finales | Consolidación |

---

## 🛠️ Stack Tecnológico

| Tecnología | Uso |
|------------|-----|
| [React](https://react.dev/) v19 | Core del frontend |
| [Vite](https://vitejs.dev/) | Build tool ultrarrápido |
| [TailwindCSS](https://tailwindcss.com/) | Estilos y diseño |
| [Lucide React](https://lucide.dev/) | Iconografía |
| [GitHub Pages](https://pages.github.com/) | Despliegue |

---

## 🔧 Instalación Local

```bash
# 1. Clonar el repositorio
git clone https://github.com/Michel-Macias/OpoTrainerInma.git
cd OpoTrainerInma

# 2. Instalar dependencias
cd web-app
npm install

# 3. Iniciar servidor de desarrollo
npm run dev
# Disponible en http://localhost:5173

# 4. Desplegar a GitHub Pages
npm run deploy
```

---

## 📂 Estructura del Proyecto

```
web-app/src/
├── data/
│   ├── curriculum.json      # Plan de estudios mensual
│   ├── topics.json          # 25 temas del temario
│   ├── questions.json       # Preguntas examen original
│   ├── weekly_quizzes.json  # Flashcards y tests semanales
│   └── exam_v1-v4.json      # 4 simulacros verificados
├── components/
│   ├── SmartCoach.jsx       # Asistente inteligente
│   ├── TestSimulator.jsx    # Motor de exámenes
│   ├── SyllabusExplorer.jsx # Visor de temario
│   ├── WeeklyPractice.jsx   # Flashcards y tests
│   └── HelpGuide.jsx        # Onboarding y ayuda
├── App.jsx                  # Componente principal
└── index.css                # Estilos globales
```

---

## 📄 Documentos de Referencia

Los siguientes documentos oficiales están incluidos para consulta:

| Documento | Descripción |
|-----------|-------------|
| `BOE-A-1978-31229` | Constitución Española |
| `BOE-A-2019-4299` | Ley Foral 11/2019 (Admin Navarra) |
| `BOE-A-2007-6115` | LO 3/2007 (Igualdad) |
| `BOE-A-2018-16673` | LO 3/2018 (Protección de Datos) |
| `guiarestaurantesok2digital` | Guía Higiene ISPLN |
| `EXAMEN COCINEROS CASTELLANO` | Examen oficial de referencia |

---

## 🤝 Contribución

Las sugerencias y Pull Requests son bienvenidas. Si tienes ideas para mejorar el temario o añadir nuevas funcionalidades, ¡colabora!

---

## 📱 Compatibilidad

- ✅ Desktop (Chrome, Firefox, Safari, Edge)
- ✅ Tablet (iPad, Android)
- ✅ Móvil (iOS, Android)
- ✅ Modo offline (después de primera carga)

---

Hecho con ❤️ para el éxito en la oposición.
