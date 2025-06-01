class PageTimer {
    constructor() {
        this.visitCount = this.getVisitCount();
        this.sessionSeconds = this.getSessionTime();
        
        // Sprawdź czy DOM jest już załadowany
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.initTimer();
            });
        } else {
            this.initTimer();
        }
    }

    initTimer() {
        this.createTimerHTML();
        this.initializeElements();
        this.startTimers();
        this.handleVisitCount();
        this.saveSessionTime();
    }

    createTimerHTML() {
        // Sprawdź czy timer już istnieje
        if (document.getElementById('pageTimer')) {
            return;
        }

        // Dodaj style CSS - timer pod czerwonym menu
        const style = document.createElement('style');
        style.id = 'timer-styles';
        style.textContent = `
            .timer-container {
                position: static;
                background: linear-gradient(135deg, #e10600, #b30500);
                border: 2px solid #fff;
                border-radius: 12px;
                padding: 12px 18px;
                box-shadow: 0 6px 15px rgba(0, 0, 0, 0.3);
                font-family: 'Courier New', monospace;
                z-index: 800;
                min-width: 200px;
                text-align: center;
                color: white;
                margin: 10px auto;
                width: fit-content;
                display: block;
            }

            .timer-container::before {
                content: '';
                position: absolute;
                top: 6px;
                left: 6px;
                width: 6px;
                height: 6px;
                background: #fff;
                border-radius: 50%;
                opacity: 0.8;
            }

            .timer-container::after {
                content: '';
                position: absolute;
                top: 6px;
                right: 6px;
                width: 6px;
                height: 6px;
                background: #fff;
                border-radius: 50%;
                opacity: 0.8;
            }

            .time-display {
                font-size: 1.4em;
                color: #fff;
                font-weight: bold;
                margin-bottom: 8px;
                text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
            }

            .timer-stats {
                display: flex;
                flex-direction: column;
                gap: 4px;
            }

            .timer-stat-line {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 2px 0;
            }

            .timer-stat-label {
                color: #fff;
                font-size: 0.7em;
                font-weight: bold;
                text-transform: uppercase;
                opacity: 0.9;
            }

            .timer-stat-value {
                color: #fff;
                font-size: 0.8em;
                font-weight: bold;
                background: rgba(255, 255, 255, 0.2);
                padding: 2px 6px;
                border-radius: 3px;
            }

            .timer-visits-label {
                color: #fff;
            }

            .timer-visits-value {
                color: #fff;
                background: rgba(255, 255, 255, 0.25);
            }

            .timer-separator {
                height: 1px;
                background: linear-gradient(to right, transparent, rgba(255, 255, 255, 0.5), transparent);
                margin: 6px 0;
            }

            /* Responsywność dla zegarka */
            @media (max-width: 768px) {
                .timer-container {
                    margin: 15px auto;
                    max-width: 250px;
                }
            }

            @media (max-width: 480px) {
                .timer-container {
                    min-width: 180px;
                    padding: 10px 14px;
                    margin: 10px auto;
                }
                
                .time-display {
                    font-size: 1.2em;
                }
            }

            @media (max-width: 320px) {
                .timer-container {
                    min-width: 160px;
                    padding: 8px 12px;
                }
                
                .time-display {
                    font-size: 1.1em;
                }
                
                .timer-stat-label {
                    font-size: 0.65em;
                }
                
                .timer-stat-value {
                    font-size: 0.75em;
                }
            }
        `;
        
        // Dodaj style tylko jeśli nie istnieją
        if (!document.getElementById('timer-styles')) {
            document.head.appendChild(style);
        }

        // Utwórz HTML elementu - wstaw po headerze
        const timerHTML = `
            <div class="timer-container" id="pageTimer">
                <div class="time-display" id="currentTime">00:00:00</div>
                
                <div class="timer-separator"></div>
                
                <div class="timer-stats">
                    <div class="timer-stat-line">
                        <span class="timer-stat-label timer-visits-label">Sesja:</span>
                        <span class="timer-stat-value timer-visits-value" id="sessionTime">0:00</span>
                    </div>
                    <div class="timer-stat-line">
                        <span class="timer-stat-label">Odwiedziny:</span>
                        <span class="timer-stat-value" id="visitCount">1</span>
                    </div>
                </div>
            </div>
        `;

        // Znajdź header i wstaw timer po nim
        const header = document.querySelector('header');
        if (header) {
            header.insertAdjacentHTML('afterend', timerHTML);
        } else {
            // Jeśli nie ma headera, wstaw na początku body
            document.body.insertAdjacentHTML('afterbegin', timerHTML);
        }
    }

    initializeElements() {
        this.timeElement = document.getElementById('currentTime');
        this.sessionElement = document.getElementById('sessionTime');
        this.visitElement = document.getElementById('visitCount');
        
        // Sprawdź czy elementy istnieją
        if (!this.timeElement || !this.sessionElement || !this.visitElement) {
            console.error('Timer elements not found');
            return false;
        }
        return true;
    }

    getVisitCount() {
        try {
            return parseInt(localStorage.getItem('pageVisits') || '0');
        } catch (e) {
            console.warn('localStorage not available:', e);
            return 0;
        }
    }

    getSessionTime() {
        try {
            return parseInt(sessionStorage.getItem('sessionTime') || '0');
        } catch (e) {
            console.warn('sessionStorage not available:', e);
            return 0;
        }
    }

    saveSessionTime() {
        // Zapisuj czas sesji co sekundę w sessionStorage
        this.saveInterval = setInterval(() => {
            try {
                sessionStorage.setItem('sessionTime', this.sessionSeconds.toString());
            } catch (e) {
                console.warn('Cannot save session time:', e);
            }
        }, 1000);
    }

    handleVisitCount() {
        try {
            // Sprawdź czy to nowa sesja przeglądarki
            const isNewSession = !sessionStorage.getItem('pageLoaded');
            
            if (isNewSession) {
                // To jest nowa sesja - zwiększ liczbę odwiedzin
                this.visitCount++;
                localStorage.setItem('pageVisits', this.visitCount.toString());
                // Oznacz że strona została załadowana w tej sesji
                sessionStorage.setItem('pageLoaded', 'true');
                // Wyzeruj czas sesji dla nowej sesji
                this.sessionSeconds = 0;
                sessionStorage.setItem('sessionTime', '0');
            }
        } catch (e) {
            console.warn('Cannot handle visit count:', e);
        }
        
        this.updateVisitDisplay();
    }

    updateVisitDisplay() {
        if (this.visitElement) {
            this.visitElement.textContent = this.visitCount;
        }
    }

    formatTime(date) {
        try {
            return date.toLocaleTimeString('pl-PL', {
                hour12: false,
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });
        } catch (e) {
            // Fallback dla starszych przeglądarek
            const hours = date.getHours().toString().padStart(2, '0');
            const minutes = date.getMinutes().toString().padStart(2, '0');
            const seconds = date.getSeconds().toString().padStart(2, '0');
            return `${hours}:${minutes}:${seconds}`;
        }
    }

    formatSessionTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    updateCurrentTime() {
        if (this.timeElement) {
            const now = new Date();
            this.timeElement.textContent = this.formatTime(now);
        }
    }

    updateSessionTime() {
        this.sessionSeconds++;
        if (this.sessionElement) {
            this.sessionElement.textContent = this.formatSessionTime(this.sessionSeconds);
        }
    }

    startTimers() {
        // Sprawdź czy elementy zostały zainicjowane
        if (!this.initializeElements()) {
            return;
        }

        // Aktualizuj aktualny czas co sekundę
        this.updateCurrentTime();
        this.updateSessionTime(); // Wyświetl aktualny czas sesji od razu
        
        this.timeInterval = setInterval(() => {
            this.updateCurrentTime();
        }, 1000);

        // Aktualizuj czas sesji co sekundę
        this.sessionInterval = setInterval(() => {
            this.updateSessionTime();
        }, 1000);
    }

    // Metoda do zatrzymania timerów
    stopTimers() {
        if (this.timeInterval) {
            clearInterval(this.timeInterval);
        }
        if (this.sessionInterval) {
            clearInterval(this.sessionInterval);
        }
        if (this.saveInterval) {
            clearInterval(this.saveInterval);
        }
    }

    // Metoda do usunięcia timera (opcjonalna)
    destroy() {
        this.stopTimers();
        
        const timerElement = document.getElementById('pageTimer');
        if (timerElement) {
            timerElement.remove();
        }
        
        const styleElement = document.getElementById('timer-styles');
        if (styleElement) {
            styleElement.remove();
        }
    }
}

// Inicjalizuj timer - kompatybilne z różnymi sposobami ładowania
(function() {
    'use strict';
    
    function initPageTimer() {
        // Sprawdź czy timer już istnieje
        if (window.pageTimer) {
            return;
        }
        
        try {
            window.pageTimer = new PageTimer();
        } catch (error) {
            console.error('Error initializing PageTimer:', error);
        }
    }
    
    // Różne sposoby inicjalizacji dla kompatybilności
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initPageTimer);
    } else {
        initPageTimer();
    }
    
    // Dodatkowo nasłuchuj na window.load dla pełnej kompatybilności
    window.addEventListener('load', function() {
        if (!window.pageTimer) {
            initPageTimer();
        }
    });
})();

// Reset czasu sesji przy zamknięciu karty (ale zachowaj liczbę odwiedzin)
window.addEventListener('beforeunload', function() {
    // Czas sesji się resetuje automatycznie przy odświeżeniu
    // Liczba odwiedzin pozostaje w localStorage
    // sessionStorage automatycznie się wyczyści po zamknięciu przeglądarki
    
    if (window.pageTimer) {
        try {
            sessionStorage.setItem('sessionTime', window.pageTimer.sessionSeconds.toString());
        } catch (e) {
            console.warn('Cannot save final session time:', e);
        }
    }
});

// Eksportuj klasę dla użycia w innych plikach (opcjonalne)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PageTimer;
}

// Globalna dostępność klasy
window.PageTimer = PageTimer;