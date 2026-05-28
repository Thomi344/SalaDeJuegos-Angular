# 🎮 Sala de Juegos - Realizado con Angular

![Angular](https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)

**Materia:** Programación IV - 4° Cuatrimestre  
**Institución:** UTN Avellaneda - Tecnicatura Universitaria en Programación  
**Deploy / Demo en vivo:** [Jugar Ahora en Firebase Hosting](https://tp1-sala-de-juegos-e8746.web.app/home)

---

## 📖 Descripción del Proyecto
La "Sala de juegos" es una aplicación web Frontend diseñada para que los usuarios registrados puedan medir sus capacidades cognitivas y motrices a través de una serie de minijuegos interactivos. 

El proyecto fue desarrollado bajo una arquitectura moderna utilizando las últimas características de **Angular (Standalone Components, Signals, Control Flow)**, estilado completamente con Tailwind CSS para lograr una interfaz "Arcade Gigante" responsiva y fluida, y respaldado por una base de datos para la persistencia de usuarios, mensajes y estadísticas.

## ✨ Características Principales

* 🔐 **Autenticación:** Sistema de Login y Registro. Acceso restringido solo a usuarios logueados. Cuenta con botones de acceso rápido para facilitar las pruebas del sistema.
* 💬 **Chat Global en Tiempo Real:** Sala de chat interactiva donde los usuarios conectados pueden intercambiar mensajes al instante sin necesidad de recargar la página.
* 🏆 **Salón de la Fama (Resultados):** Un ranking dinámico que muestra el Top 10 de los mejores puntajes históricos para cada juego, consumiendo los datos de forma concurrente para maximizar el rendimiento.
* 👨‍💻 **Sección Quién Soy:** Perfil del desarrollador que consume datos dinámicos mediante la API pública de GitHub e incluye las reglas detalladas del juego de autoría propia.
* 🎨 **UX/UI Arcade:** Uso intensivo de CSS y animaciones para transiciones fluidas, feedback visual inmersivo (carteles de acierto/error), prohibición del uso de `alert()` reemplazándolos por modales personalizados.

## 🕹️ Los Juegos

La sala incluye 4 juegos con mecánicas y sistemas de puntuación únicos, guardando todos los datos estadísticos en la base de datos al finalizar cada partida:

1.  🔤 **Ahorcado:** El clásico juego de adivinar la palabra. Se premia la eficiencia otorgando un mayor puntaje a quienes resuelven el acertijo cometiendo la menor cantidad de errores posibles dentro de sus 6 intentos.
2.  🃏 **Mayor o Menor:** Un desafío de probabilidad y supervivencia (muerte súbita). El usuario debe adivinar si la siguiente carta será mayor o menor. El puntaje se basa en la "racha máxima" de aciertos consecutivos.
3.  🧠 **Trivia Gamer (Preguntados):** Un cuestionario de 10 rondas que consume una API externa de videojuegos. Sistema anti-repetición de preguntas y opciones múltiples dinámicas.
4.  🎯 **Logo Quiz (Juego Propio):** Un reto visual tipo *Real vs. Fake*. El jugador comienza con 5 vidas y debe identificar el logo corporativo/gamer real entre tres opciones falsificadas. Otorga +20 puntos por cada acierto consecutivo.

## 🛠️ Tecnologías y Arquitectura

* **Frontend:** Angular (TypeScript, HTML, CSS). Uso de Signals para manejo de estado sin lag.
* **Estilos:** Tailwind CSS (diseño responsivo, Grid, Flexbox, UI/UX).
* **Backend as a Service (BaaS):** Supabase / Firebase para Autenticación, Base de Datos PostgreSQL y Realtime.
* **Hosting:** Firebase Hosting.

## 🚀 Instalación y Despliegue Local

Para correr este proyecto en tu máquina local:

1. Clona este repositorio:
   ```bash
   git clone [https://github.com/tu-usuario/tu-repositorio.git](https://github.com/tu-usuario/tu-repositorio.git)