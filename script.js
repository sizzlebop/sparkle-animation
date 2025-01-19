document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.spark-container');
    const controlPanel = document.querySelector('.control-panel');
    const panelToggle = document.querySelector('.panel-toggle');
    let sparks = document.querySelectorAll('.spark');
    
    const colorThemes = {
        rainbow: [
            '#ff3333', '#33ff33', '#3333ff',
            '#ffff33', '#ff33ff', '#33ffff',
            '#ff9933', '#ff3399', '#99ff33',
            '#ff5555', '#55ff55', '#5555ff'
        ],
        cosmic: [
            '#9933ff', '#ff33cc', '#33ccff',
            '#ff99ff', '#99ffff', '#ffff99',
            '#ff66cc', '#66ccff', '#cc99ff',
            '#ff33ff', '#33ffff', '#ffff33'
        ],
        sunset: [
            '#ff6b35', '#ff9b42', '#ffbe0b',
            '#ff5470', '#ff8c42', '#ff4d6d',
            '#ff7e5f', '#ff5f40', '#ffac41',
            '#ff3864', '#ff8264', '#ffd460'
        ],
        ocean: [
            '#00ffff', '#0099ff', '#0066ff',
            '#33ccff', '#3399ff', '#00ccff',
            '#66ffff', '#6699ff', '#0080ff',
            '#40e0ff', '#00b3ff', '#0055ff'
        ],
        fire: [
            '#ff3300', '#ff6600', '#ff9900',
            '#ffcc00', '#ff0000', '#cc3300',
            '#ff4400', '#ff7700', '#ffaa00',
            '#ff2200', '#ff5500', '#ff8800'
        ],
        ice: [
            '#00ffff', '#99ffff', '#ffffff',
            '#66ccff', '#3399ff', '#0066ff',
            '#80ffff', '#b3ffff', '#e6ffff',
            '#4dffff', '#ccffff', '#f0ffff'
        ],
        neon: [
            '#ff00ff', '#00ffff', '#ff3399',
            '#33ff33', '#ff3300', '#ffff00',
            '#ff66ff', '#66ffff', '#ff99cc',
            '#66ff66', '#ff6600', '#ffff66'
        ],
        forest: [
            '#33ff33', '#00cc00', '#006600',
            '#66ff66', '#33cc33', '#009900',
            '#99ff99', '#66cc66', '#00ff00',
            '#4dff4d', '#00e600', '#008000'
        ],
        aurora: [
            '#00ff99', '#00ffcc', '#00ffff',
            '#00ccff', '#0099ff', '#ff00cc',
            '#33ffcc', '#33ccff', '#cc00ff',
            '#00ff80', '#0080ff', '#ff00ff'
        ]
    };

    let currentTheme = 'rainbow';
    
    panelToggle.addEventListener('click', () => {
        controlPanel.classList.toggle('collapsed');
    });

    document.querySelectorAll('.control-group input[type="range"]').forEach(input => {
        const display = input.parentElement.querySelector('.value-display');
        display.textContent = input.value + (input.id === 'sparkSize' ? 'px' : 
                                           input.id === 'animationSpeed' ? 's' : 
                                           input.id === 'glowIntensity' ? 'x' : '');
    });

    document.getElementById('sparkCount').addEventListener('input', (e) => {
        const count = parseInt(e.target.value);
        updateSparkCount(count);
        e.target.parentElement.querySelector('.value-display').textContent = count;
    });

    document.getElementById('sparkSize').addEventListener('input', (e) => {
        const size = e.target.value;
        sparks.forEach(spark => {
            spark.style.width = size + 'px';
            spark.style.height = size + 'px';
        });
        e.target.parentElement.querySelector('.value-display').textContent = size + 'px';
    });

    document.getElementById('glowIntensity').addEventListener('input', (e) => {
        const intensity = e.target.value;
        sparks.forEach(spark => {
            spark.style.filter = `blur(${intensity}px)`;
        });
        e.target.parentElement.querySelector('.value-display').textContent = intensity + 'x';
    });

    document.getElementById('animationSpeed').addEventListener('input', (e) => {
        const speed = e.target.value;
        sparks.forEach(spark => {
            spark.style.animationDuration = speed + 's';
        });
        e.target.parentElement.querySelector('.value-display').textContent = speed + 's';
    });

    document.getElementById('burstCount').addEventListener('input', (e) => {
        const count = parseInt(e.target.value);
        window.burstCount = count;
        e.target.parentElement.querySelector('.value-display').textContent = count;
    });

    document.getElementById('colorTheme').addEventListener('change', (e) => {
        currentTheme = e.target.value;
        sparks.forEach(spark => {
            const color = getRandomColor();
            spark.style.backgroundColor = color;
            spark.style.color = color;
        });
    });

    document.getElementById('blendMode').addEventListener('change', (e) => {
        const mode = e.target.value;
        sparks.forEach(spark => {
            spark.style.mixBlendMode = mode;
        });
    });

    window.burstCount = 8;

    function updateSparkCount(count) {
        container.innerHTML = '';
        for (let i = 0; i < count; i++) {
            const spark = document.createElement('div');
            spark.className = 'spark';
            
            // Add burst trigger on hover
            spark.addEventListener('mouseenter', (e) => {
                const rect = spark.getBoundingClientRect();
                const x = rect.left + rect.width / 2;
                const y = rect.top + rect.height / 2;
                createBurst(x, y, window.burstCount);
            });

            container.appendChild(spark);
            initializeSpark(spark, i / count * Math.PI * 2);
        }
        sparks = document.querySelectorAll('.spark');
    }

    function getRandomColor() {
        const colors = colorThemes[currentTheme];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    function createBurst(x, y, count) {
        const center = document.createElement('div');
        center.className = 'burst-center';
        center.style.left = `${x}px`;
        center.style.top = `${y}px`;
        container.appendChild(center);
        setTimeout(() => center.remove(), 1000);

        const layers = 3;
        for (let layer = 0; layer < layers; layer++) {
            const layerDelay = layer * 100;
            const layerCount = count * (layer + 1);
            const baseVelocity = 75 + (layer * 50);

            for (let i = 0; i < layerCount; i++) {
                const burst = document.createElement('div');
                burst.className = 'burst-spark';
                const color = getRandomColor();
                
                const angle = (Math.PI * 2 * i) / layerCount;
                const randomVelocity = baseVelocity + (Math.random() * 75);
                const moveX = Math.cos(angle) * randomVelocity;
                const moveY = Math.sin(angle) * randomVelocity;
                const rotation = Math.random() * 360 - 180;

                burst.style.left = `${x}px`;
                burst.style.top = `${y}px`;
                burst.style.setProperty('--moveX', `${moveX}px`);
                burst.style.setProperty('--moveY', `${moveY}px`);
                burst.style.setProperty('--rotation', `${rotation}deg`);
                burst.style.backgroundColor = color;
                burst.style.mixBlendMode = document.getElementById('blendMode').value;
                burst.style.filter = `blur(${document.getElementById('glowIntensity').value * 1.5}px)`;

                burst.style.animationDelay = `${layerDelay + (Math.random() * 100)}ms`;

                container.appendChild(burst);
                setTimeout(() => burst.remove(), 1500);
            }
        }
    }

    function initializeSpark(spark, offset) {
        const padding = 100;
        const startX = padding + Math.random() * (window.innerWidth - padding * 2);
        const startY = padding + Math.random() * (window.innerHeight - padding * 2);
        const moveDistance = Math.min(window.innerWidth, window.innerHeight) * 0.15;
        const angle = Math.random() * Math.PI * 2;
        const moveX = Math.cos(angle) * moveDistance;
        const moveY = Math.sin(angle) * moveDistance;
        
        const duration = parseFloat(document.getElementById('animationSpeed').value);
        const color = getRandomColor();

        spark.style.setProperty('--startX', `${startX}px`);
        spark.style.setProperty('--startY', `${startY}px`);
        spark.style.setProperty('--moveX', `${moveX}px`);
        spark.style.setProperty('--moveY', `${moveY}px`);
        spark.style.setProperty('--uniqueOffset', `${offset}rad`);
        spark.style.left = `${startX}px`;
        spark.style.top = `${startY}px`;
        spark.style.animationDuration = `${duration}s`;
        spark.style.backgroundColor = color;
        spark.style.color = color;
        spark.style.mixBlendMode = document.getElementById('blendMode').value;
        spark.style.filter = `blur(${document.getElementById('glowIntensity').value}px)`;
        spark.style.width = document.getElementById('sparkSize').value + 'px';
        spark.style.height = document.getElementById('sparkSize').value + 'px';
    }

    // Initialize sparks
    updateSparkCount(30);
});