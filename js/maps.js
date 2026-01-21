// Maps functionality for Peta page
document.addEventListener('DOMContentLoaded', function() {
    // Fullscreen functionality for map iframes
    const fullscreen2DBtn = document.getElementById('fullscreen2D');
    const fullscreen3DBtn = document.getElementById('fullscreen3D');
    
    if (fullscreen2DBtn) {
        fullscreen2DBtn.addEventListener('click', function() {
            toggleFullscreen('map2D');
        });
    }
    
    if (fullscreen3DBtn) {
        fullscreen3DBtn.addEventListener('click', function() {
            toggleFullscreen('map3D');
        });
    }
    
    // Function to toggle fullscreen for map iframes
    function toggleFullscreen(mapId) {
        // Since we can't control iframe fullscreen directly,
        // we'll open the map in a new tab/window
        let mapUrl;
        
        if (mapId === 'map2D') {
            mapUrl = 'https://www.arcgis.com/apps/instant/atlas/index.html?appid=af6cc543bcc2468ea0cee2506814abf7';
        } else if (mapId === 'map3D') {
            mapUrl = 'https://www.arcgis.com/apps/instant/3dviewer/index.html?appid=b522ca6443e64aaf8583e9a5f2af3eaf';
        } else {
            return;
        }
        
        // Open in new window with minimal browser UI
        const windowFeatures = 'fullscreen=yes,location=no,menubar=no,scrollbars=no,status=no,toolbar=no';
        window.open(mapUrl, '_blank', windowFeatures);
    }
    
    // Map layer information tooltips
    const layerBadges = document.querySelectorAll('.layer-badge');
    
    layerBadges.forEach(badge => {
        badge.addEventListener('mouseenter', function() {
            const layerType = this.classList[1]; // flood, landslide, etc.
            const tooltip = createLayerTooltip(layerType);
            
            const rect = this.getBoundingClientRect();
            tooltip.style.left = rect.left + rect.width / 2 - tooltip.offsetWidth / 2 + 'px';
            tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
            
            document.body.appendChild(tooltip);
            
            // Position tooltip if it goes off screen
            setTimeout(() => {
                const tooltipRect = tooltip.getBoundingClientRect();
                if (tooltipRect.left < 10) {
                    tooltip.style.left = '10px';
                }
                if (tooltipRect.right > window.innerWidth - 10) {
                    tooltip.style.left = window.innerWidth - tooltipRect.width - 10 + 'px';
                }
            }, 10);
        });
        
        badge.addEventListener('mouseleave', function() {
            const tooltip = document.querySelector('.layer-tooltip');
            if (tooltip) {
                tooltip.remove();
            }
        });
    });
    
    // Function to create layer tooltip
    function createLayerTooltip(layerType) {
        const tooltip = document.createElement('div');
        tooltip.className = 'layer-tooltip';
        
        const layerInfo = {
            flood: {
                title: "Kerawanan Banjir",
                description: "Wilayah dengan risiko banjir berdasarkan data historis, topografi, dan curah hujan."
            },
            landslide: {
                title: "Kerawanan Longsor",
                description: "Daerah dengan kemiringan lereng tinggi dan kondisi tanah rentan terhadap pergerakan tanah."
            },
            earthquake: {
                title: "Kerawanan Gempa",
                description: "Wilayah berdasarkan zona seismik dan sejarah aktivitas gempa bumi."
            },
            tsunami: {
                title: "Kerawanan Tsunami",
                description: "Wilayah pesisir dengan risiko tsunami berdasarkan elevasi dan jarak dari pantai."
            },
            drought: {
                title: "Kerawanan Kekeringan",
                description: "Daerah dengan curah hujan rendah dan ketahanan air terbatas selama musim kemarau."
            },
            fire: {
                title: "Kerawanan Kebakaran Hutan",
                description: "Kawasan hutan dengan risiko kebakaran berdasarkan vegetasi dan kondisi iklim."
            },
            volcano: {
                title: "Kerawanan Gunung Api",
                description: "Wilayah sekitar gunung api aktif dengan risiko erupsi dan lahar."
            }
        };
        
        const info = layerInfo[layerType] || {
            title: "Layer Informasi",
            description: "Informasi detail tentang layer ini."
        };
        
        tooltip.innerHTML = `
            <h4>${info.title}</h4>
            <p>${info.description}</p>
        `;
        
        return tooltip;
    }
    
    // Add CSS for tooltips
    const style = document.createElement('style');
    style.textContent = `
        .layer-tooltip {
            position: fixed;
            background-color: var(--card-bg);
            border: 1px solid var(--accent-blue);
            border-radius: var(--border-radius);
            padding: 15px;
            max-width: 300px;
            z-index: 10000;
            box-shadow: var(--shadow);
            pointer-events: none;
        }
        .layer-tooltip h4 {
            color: var(--accent-blue);
            margin-bottom: 8px;
            font-size: 1rem;
        }
        .layer-tooltip p {
            color: var(--text-secondary);
            font-size: 0.9rem;
            line-height: 1.4;
            margin: 0;
        }
    `;
    document.head.appendChild(style);
    
    // Track map interactions (analytics placeholder)
    const mapFrames = document.querySelectorAll('.map-frame');
    
    mapFrames.forEach(frame => {
        frame.addEventListener('load', function() {
            console.log('Map frame loaded:', this.title);
            
            // You could send analytics here
            // Example: trackMapLoad(this.title);
        });
    });
    
    // Function to track map loads (placeholder for analytics)
    function trackMapLoad(mapName) {
        // This is where you would integrate with analytics (Google Analytics, etc.)
        console.log(`Map loaded: ${mapName}`);
        
        // Example GA4 event:
        // gtag('event', 'map_view', {
        //     'map_name': mapName,
        //     'page_location': window.location.href
        // });
    }
    
    // Responsive iframe adjustments
    function adjustMapFrames() {
        const mapWrappers = document.querySelectorAll('.map-wrapper');
        
        mapWrappers.forEach(wrapper => {
            // Adjust aspect ratio for mobile
            if (window.innerWidth < 768) {
                wrapper.style.paddingBottom = '75%'; // 4:3 aspect ratio for mobile
            } else {
                wrapper.style.paddingBottom = '56.25%'; // 16:9 aspect ratio for desktop
            }
        });
    }
    
    // Initial adjustment and on resize
    adjustMapFrames();
    window.addEventListener('resize', adjustMapFrames);
});
