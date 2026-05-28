# 🎮 Sala de Juegos - TP #1 Programación IV

![Angular](https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)

[cite_start]**Materia:** Programación IV - 4° Cuatrimestre [cite: 1]  
[cite_start]**Institución:** UTN Avellaneda - Tecnicatura Universitaria en Programación [cite: 2, 3]  
**Deploy / Demo en vivo:** [Jugar Ahora en Firebase Hosting](https://tp1-sala-de-juegos-e8746.web.app/home)

---

## 📖 Descripción del Proyecto
[cite_start]La "Sala de juegos" es una aplicación web Frontend [cite: 6, 19] [cite_start]diseñada para que los usuarios registrados puedan medir sus capacidades cognitivas y motrices a través de una serie de minijuegos interactivos[cite: 8, 10]. 

[cite_start]El proyecto fue desarrollado bajo una arquitectura moderna utilizando las últimas características de **Angular (Standalone Components, Signals, Control Flow)**, estilado completamente con Tailwind CSS para lograr una interfaz "Arcade Gigante" responsiva y fluida, y respaldado por una base de datos para la persistencia de usuarios, mensajes y estadísticas[cite: 20, 21].

## ✨ Características Principales

* 🔐 **Autenticación:** Sistema de Login y Registro. [cite_start]Acceso restringido solo a usuarios logueados[cite: 10, 21]. [cite_start]Cuenta con botones de acceso rápido para facilitar las pruebas del sistema[cite: 83].
* [cite_start]💬 **Chat Global en Tiempo Real:** Sala de chat interactiva donde los usuarios conectados pueden intercambiar mensajes al instante sin necesidad de recargar la página[cite: 35, 36].
* [cite_start]🏆 **Salón de la Fama (Resultados):** Un ranking dinámico que muestra el Top 10 de los mejores puntajes históricos para cada juego, consumiendo los datos de forma concurrente para maximizar el rendimiento[cite: 123, 125, 126].
* [cite_start]👨‍💻 **Sección Quién Soy:** Perfil del desarrollador que consume datos dinámicos mediante la API pública de GitHub e incluye las reglas detalladas del juego de autoría propia[cite: 47, 50, 61].
* [cite_start]🎨 **UX/UI Arcade:** Uso intensivo de CSS y animaciones para transiciones fluidas, feedback visual inmersivo (carteles de acierto/error), prohibición del uso de `alert()` reemplazándolos por modales personalizados[cite: 14, 15, 38, 44].

## 🕹️ Los Juegos

[cite_start]La sala incluye 4 juegos con mecánicas y sistemas de puntuación únicos, guardando todos los datos estadísticos en la base de datos al finalizar cada partida[cite: 9, 12, 22]:

1.  🔤 **Ahorcado:** El clásico juego de adivinar la palabra. [cite_start]Se premia la eficiencia otorgando un mayor puntaje a quienes resuelven el acertijo cometiendo la menor cantidad de errores posibles dentro de sus 6 intentos[cite: 23, 93, 94].
2.  🃏 **Mayor o Menor:** Un desafío de probabilidad y supervivencia (muerte súbita). [cite_start]El usuario debe adivinar si la siguiente carta será mayor o menor[cite: 24, 98, 99]. El puntaje se basa en la "racha máxima" de aciertos consecutivos.
3.  [cite_start]🧠 **Trivia Gamer (Preguntados):** Un cuestionario de 10 rondas que consume una API externa de videojuegos[cite: 25, 111, 114]. Sistema anti-repetición de preguntas y opciones múltiples dinámicas.
4.  🎯 **Logo Quiz (Juego Propio):** Un reto visual tipo *Real vs. Fake*. [cite_start]El jugador comienza con 5 vidas y debe identificar el logo corporativo/gamer real entre tres opciones falsificadas[cite: 26, 119]. Otorga +20 puntos por cada acierto consecutivo.

## 🛠️ Tecnologías y Arquitectura

* **Frontend:** Angular (TypeScript, HTML, CSS). [cite_start]Uso de Signals para manejo de estado sin lag[cite: 19].
* **Estilos:** Tailwind CSS (diseño responsivo, Grid, Flexbox, UI/UX).
* [cite_start]**Backend as a Service (BaaS):** Supabase / Firebase para Autenticación, Base de Datos PostgreSQL y Realtime[cite: 20].
* **Hosting:** Firebase Hosting.

## 🚀 Instalación y Despliegue Local

Para correr este proyecto en tu máquina local:

1. Clona este repositorio:
   ```bash
   git clone [https://github.com/tu-usuario/tu-repositorio.git](https://github.com/tu-usuario/tu-repositorio.git)