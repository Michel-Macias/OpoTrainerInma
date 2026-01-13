# 👩‍🍳 OpoTrainer Inma

![OpoTrainer Banner](assets/preview.png)

> **Plataforma interactiva de estudio para Oposiciones de Cocina (Escuelas Infantiles Pamplona).**  
> Transforma un temario estático en una experiencia de aprendizaje gamificada, visual y persistente.

[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![GitHub Pages](https://img.shields.io/badge/Deploy-GitHub_Pages-222222?style=for-the-badge&logo=github)](https://michel-macias.github.io/OpoTrainerInma/)

---

## 🚀 Live Demo
Accede a la aplicación en vivo aquí:  
👉 **[https://Michel-Macias.github.io/OpoTrainerInma/](https://Michel-Macias.github.io/OpoTrainerInma/)**

---

## 💡 Sobre el Proyecto

**OpoTrainer Inma** nace de la necesidad de modernizar el estudio de oposiciones. Lejos de los interminables PDFs y listas de papel, esta aplicación ofrece un entorno de **"Centro de Mando"** donde el opositor puede visualizar su progreso, acceder a los recursos legales al instante y gestionar su estudio semanal de forma eficiente.

### ✨ Características Principales

*   **📅 Dashboard Visual:** Línea de tiempo interactiva dividida en 4 bloques mensuales de estudio.
*   **💾 Persistencia de Datos:** ¡Tu progreso se guarda automáticamente! El sistema utiliza `LocalStorage` para recordar tus tareas completadas incluso si cierras el navegador.
*   **📚 Recursos Integrados:** Acceso directo a los documentos oficiales (BOE, Guías de Higiene) desde cada tarjeta de estudio.
*   **⚡ Conceptos Clave (Flashcards):** Tooltips interactivos con definiciones técnicas esenciales (ej. "Plonge", "Zona de Peligro").
*   **📱 Diseño Responsive:** Optimizado para estudiar desde móvil, tablet u ordenador.

---

## 🛠️ Stack Tecnológico

Este proyecto ha sido construido utilizando tecnologías web modernas para garantizar velocidad y escalabilidad:

*   **Core:** [React](https://react.dev/) (v19)
*   **Build Tool:** [Vite](https://vitejs.dev/)
*   **Estilos:** [TailwindCSS](https://tailwindcss.com/)
*   **Iconos:** Lucide React
*   **Despliegue:** GitHub Pages (CI/CD automatizado con `gh-pages`)

---

## 🔧 Instalación Local

Si deseas ejecutar este proyecto en tu propia máquina:

1.  **Clonar el repositorio**
    ```bash
    git clone https://github.com/Michel-Macias/OpoTrainerInma.git
    cd OpoTrainerInma
    ```

2.  **Instalar dependencias**
    Navega al directorio de la aplicación web:
    ```bash
    cd web-app
    npm install
    ```

3.  **Iniciar servidor de desarrollo**
    ```bash
    npm run dev
    ```
    La aplicación estará disponible en `http://localhost:5173`.

---

## 📂 Estructura del Proyecto

El corazón de la aplicación reside en `web-app/src`:

*   `data/curriculum.json`: **Capa de Datos.** Aquí se define todo el temario (Meses, Semanas, Tareas). Modificando este JSON se actualiza toda la app automáticamente.
*   `App.jsx`: **Lógica UI.** Contiene el componente principal, la navegación y la gestión de estado.
*   `public/pdfs`: **Repositorio Documental.** Almacenamiento de los documentos legales y técnicos.

---

## 🤝 Contribución

Las sugerencias y Pull Requests son bienvenidas. Si tienes ideas para mejorar el temario o añadir nuevas funcionalidades (como tests interactivos), ¡no dudes en colaborar!

---

Hecho con ❤️ para el éxito en la oposición.
