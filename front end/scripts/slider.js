    // Slider de banderas para la página index.html

document.addEventListener('DOMContentLoaded', () => {
    // Elementos del título
    const titleSpan = document.getElementById('title-span');
    const btnJugar = document.getElementById('btnJugar');
    const btnComoJugar = document.getElementById('btnComoJugar');
    const body = document.body;
    
    // Tracks de los 2 sliders verticales
    const trackLeft = document.getElementById('track-left');
    const trackLeftDup = document.getElementById('track-left-dup');
    const trackRight = document.getElementById('track-right');
    const trackRightDup = document.getElementById('track-right-dup');
    
    // Lista de banderas disponibles
    const banderas = [
        'alemania', 'angola', 'arabiasaudita', 'australia', 'belgica',
        'bielorussia', 'bosniayherzegovina', 'brasil', 'coreadelsur', 'dinamarca',
        'ecuador', 'egipto', 'emiratosarabesunidos', 'eslovaquia', 'eslovenia',
        'españa', 'estadosunidos', 'etiopia', 'finlandia', 'francia',
        'ghana', 'grecia', 'hungria', 'indonesia', 'irlanda',
        'islandia', 'italia', 'kazajistan', 'laos', 'lituania',
        'macedoniadelnorte', 'marruecos', 'mexico', 'moldavia', 'nepal',
        'noruega', 'nuevaZelanda', 'paisesbajos', 'polonia', 'portugal',
        'reinounido', 'rumania', 'sanVicenteYLasGranadinas', 'sanmarino', 'serbia',
        'sudafrica', 'suecia', 'suiza', 'turquia', 'venezuela'
    ];
    
    // Función para mezclar array aleatoriamente
    function shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }
    
    // Crear diferentes ordenes de banderas para cada slider
    const banderasOrden1 = banderas; // Orden original
    const banderasOrden2 = shuffleArray(banderas); // Orden aleatorio
    
    // Textos multilingües para el título
    const titulosMultilingues = [
        'WORLD QUIZ',
        'ADIVINA LA BANDERA',
        'GUESS THE FLAG',
        'INDOVINA LA BANDIERA',
        'ADEVINHE A BANDEIRA',
        'RATE DIE FLAGGE',
        'DEVINE LE DRAPEAU',
        'РАССУДИ ФЛАГ',
        'FLAG QUIZ',
        'QUIZ DE BANDEIRAS'
    ];
    
    let tituloIndex = 0;
    let tituloInterval = null;
    let fastChangeTimeout = null;
    
    // Función para rotar los títulos multilingües con animación
    function rotateTitles() {
        titleSpan.style.opacity = '0';
        titleSpan.style.transform = 'scale(0.95)';
        
        setTimeout(() => {
            tituloIndex = (tituloIndex + 1) % titulosMultilingues.length;
            titleSpan.textContent = titulosMultilingues[tituloIndex];
            titleSpan.style.opacity = '1';
            titleSpan.style.transform = 'scale(1)';
        }, 200);
    }
    
    // Iniciar rotación de títulos cada 4 segundos
    function startTitleRotation() {
        if (tituloInterval) clearInterval(tituloInterval);
        tituloInterval = setInterval(rotateTitles, 4000);
    }
    
    // Detener rotación y activar animación rápida con desaceleración progresiva
    function startFastTitleChange() {
        if (tituloInterval) clearInterval(tituloInterval);
        
        let fastIndex = tituloIndex;
        let currentDelay = 100;
        const maxDelay = 600;
        const accelerationFactor = 1.3;
        
        function scheduleNextChange() {
            fastChangeTimeout = setTimeout(() => {
                fastIndex = (fastIndex + 1) % titulosMultilingues.length;
                
                // Animación de cambio
                titleSpan.style.opacity = '0';
                titleSpan.style.transform = 'scale(0.95)';
                
                setTimeout(() => {
                    titleSpan.textContent = titulosMultilingues[fastIndex];
                    titleSpan.style.opacity = '1';
                    titleSpan.style.transform = 'scale(1)';
                }, 100);
                
                currentDelay = Math.min(currentDelay * accelerationFactor, maxDelay);
                
                if (!titleSpan.dataset.stopped) {
                    scheduleNextChange();
                }
            }, currentDelay);
        }
        
        scheduleNextChange();
        
        return {
            stop: () => {
                titleSpan.dataset.stopped = 'true';
                if (fastChangeTimeout) clearTimeout(fastChangeTimeout);
            }
        };
    }
    
    // Detener animación rápida y volver a rotación normal
    function stopFastTitleChange(fastControl) {
        if (fastControl && fastControl.stop) {
            fastControl.stop();
        }
        delete titleSpan.dataset.stopped;
        startTitleRotation();
    }
    
    startTitleRotation();
    
    // Función para llenar los tracks con banderas (una bandera a la vez en pantalla completa)
    function populateTrack(track, banderasOrden) {
        // Mostrar solo una bandera por vez - duplicamos para loop infinito
        const flagsToDisplay = [...banderasOrden, ...banderasOrden];
        
        flagsToDisplay.forEach(bandera => {
            const img = document.createElement('img');
            img.src = `imagenes/${bandera}.png`;
            img.alt = bandera;
            track.appendChild(img);
        });
    }
    
    // Inicializar los 2 sliders con diferentes ordenes
    populateTrack(trackLeft, banderasOrden1);
    populateTrack(trackLeftDup, banderasOrden1);
    populateTrack(trackRight, banderasOrden2);
    populateTrack(trackRightDup, banderasOrden2);
    
    let isAnimating = false;
    
    // Función común para manejar clicks
    function handleButtonClick(e, redirectUrl) {
        e.preventDefault();
        
        if (isAnimating) return;
        isAnimating = true;
        
        // Agregar clase al body para animar sliders
        body.classList.add('animate-jugar');
        
        // Activar efecto de velocidad (flash blanco) en todos los tracks
        const allTracks = document.querySelectorAll('.slider-track-vertical');
        allTracks.forEach(track => {
            track.classList.add('speed-boost');
        });
        
        // Agregar efecto cinematográfico al body
        body.classList.add('cinematic-mode');
        
        // Iniciar cambio rápido de título
        const fastControl = startFastTitleChange();
        
        // Después de 0.6s, comenzar a desvanecer el flash
        setTimeout(() => {
            allTracks.forEach(track => {
                track.classList.add('flash-fade');
            });
        }, 600);
        
        // Delay antes de redirigir (3.5 segundos exactos)
        setTimeout(() => {
            allTracks.forEach(track => {
                track.classList.remove('speed-boost', 'flash-fade');
            });
            body.classList.remove('cinematic-mode', 'animate-jugar');
            stopFastTitleChange(fastControl);
            
            window.location.href = redirectUrl;
        }, 3500);
    }
    
    // Manejar click en botón Jugar
    btnJugar.addEventListener('click', (e) => {
        handleButtonClick(e, 'login.html');
    });
    
    // Manejar click en botón Como Jugar
    btnComoJugar.addEventListener('click', (e) => {
        // Usamos una versión más tranquila para Como Se Juega
        if (isAnimating) return;
        isAnimating = true;
        
        body.classList.add('animate-comojugar');
        
        const allTracks = document.querySelectorAll('.slider-track-vertical');
        allTracks.forEach(track => {
            track.classList.add('speed-boost');
        });
        
        body.classList.add('cinematic-mode');
        
        const fastControl = startFastTitleChange();
        
        setTimeout(() => {
            allTracks.forEach(track => {
                track.classList.add('flash-fade');
            });
        }, 600);
        
        setTimeout(() => {
            allTracks.forEach(track => {
                track.classList.remove('speed-boost', 'flash-fade');
            });
            body.classList.remove('cinematic-mode', 'animate-comojugar');
            stopFastTitleChange(fastControl);
            
            window.location.href = 'htp.html';
        }, 3500);
    });
});
