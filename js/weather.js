// Weather Data Fetching and Display
document.addEventListener('DOMContentLoaded', function() {
    const weatherSlider = document.getElementById('weatherSlider');
    const weatherDots = document.getElementById('weatherDots');
    const prevBtn = document.getElementById('prevWeather');
    const nextBtn = document.getElementById('nextWeather');
    
    if (!weatherSlider) return;
    
    let currentSlide = 0;
    let weatherData = [];
    let autoSlideInterval;
    
    // Sample weather data (in real implementation, this would come from BMKG API)
    // Since BMKG XML has CORS restrictions, we'll use simulated data based on actual BMKG structure
    const sampleWeatherData = [
        {
            location: "Bandung",
            date: new Date().toISOString().split('T')[0],
            condition: "Berawan",
            temp: "24",
            tempMin: "20",
            tempMax: "28",
            humidity: "78",
            windSpeed: "10",
            windDir: "Timur",
            icon: "fa-cloud"
        },
        {
            location: "Bogor",
            date: new Date().toISOString().split('T')[0],
            condition: "Hujan Ringan",
            temp: "23",
            tempMin: "21",
            tempMax: "26",
            humidity: "85",
            windSpeed: "12",
            windDir: "Barat Daya",
            icon: "fa-cloud-rain"
        },
        {
            location: "Cirebon",
            date: new Date().toISOString().split('T')[0],
            condition: "Cerah Berawan",
            temp: "30",
            tempMin: "26",
            tempMax: "32",
            humidity: "65",
            windSpeed: "15",
            windDir: "Tenggara",
            icon: "fa-cloud-sun"
        },
        {
            location: "Tasikmalaya",
            date: new Date().toISOString().split('T')[0],
            condition: "Berawan",
            temp: "25",
            tempMin: "22",
            tempMax: "28",
            humidity: "80",
            windSpeed: "8",
            windDir: "Selatan",
            icon: "fa-cloud"
        },
        {
            location: "Sukabumi",
            date: new Date().toISOString().split('T')[0],
            condition: "Hujan Sedang",
            temp: "22",
            tempMin: "20",
            tempMax: "25",
            humidity: "90",
            windSpeed: "10",
            windDir: "Barat",
            icon: "fa-cloud-showers-heavy"
        }
    ];
    
    // Function to fetch real weather data from BMKG
    async function fetchWeatherData() {
        try {
            // In a real implementation, we would fetch from:
            // https://data.bmkg.go.id/DataMKG/MEWS/DigitalForecast/DigitalForecast-JawaBarat.xml
            
            // However, due to CORS restrictions on BMKG's server,
            // we would need a proxy server in production.
            // For this static site, we'll use simulated data.
            
            // Uncomment the following code if using a CORS proxy:
            /*
            const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
            const targetUrl = 'https://data.bmkg.go.id/DataMKG/MEWS/DigitalForecast/DigitalForecast-JawaBarat.xml';
            
            const response = await fetch(proxyUrl + targetUrl);
            const xmlText = await response.text();
            
            // Parse XML and extract weather data
            weatherData = parseBMKGXML(xmlText);
            */
            
            // For now, use sample data
            weatherData = sampleWeatherData;
            
            // Initialize slider with weather data
            initWeatherSlider();
            initSliderControls();
            startAutoSlide();
            
        } catch (error) {
            console.error('Error fetching weather data:', error);
            // Fallback to sample data
            weatherData = sampleWeatherData;
            initWeatherSlider();
            initSliderControls();
            startAutoSlide();
        }
    }
    
    // Function to parse BMKG XML data (simplified)
    function parseBMKGXML(xmlText) {
        // This is a simplified parser for BMKG XML structure
        // In production, you would need a proper XML parser
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
        
        // Extract areas (kota) and their forecasts
        const areas = xmlDoc.getElementsByTagName('area');
        const parsedData = [];
        
        // Simplified extraction - adjust based on actual XML structure
        for (let i = 0; i < Math.min(areas.length, 5); i++) {
            const area = areas[i];
            const name = area.getAttribute('description') || `Wilayah ${i+1}`;
            
            // Extract weather parameters (simplified)
            const parameters = area.getElementsByTagName('parameter');
            let temp = "25";
            let humidity = "75";
            let condition = "Berawan";
            let icon = "fa-cloud";
            
            // In real implementation, parse actual parameter values
            // This is just a placeholder
            parsedData.push({
                location: name,
                date: new Date().toISOString().split('T')[0],
                condition: condition,
                temp: temp,
                tempMin: (parseInt(temp) - 3).toString(),
                tempMax: (parseInt(temp) + 3).toString(),
                humidity: humidity,
                windSpeed: "10",
                windDir: "Timur",
                icon: icon
            });
        }
        
        return parsedData;
    }
    
    // Initialize weather slider with data
    function initWeatherSlider() {
        if (weatherData.length === 0) {
            weatherSlider.innerHTML = `
                <div class="weather-slide">
                    <div class="weather-error">
                        <i class="fas fa-exclamation-triangle"></i>
                        <h3>Data cuaca tidak tersedia</h3>
                        <p>Gagal memuat data cuaca dari BMKG. Silakan coba lagi nanti.</p>
                    </div>
                </div>
            `;
            return;
        }
        
        // Clear existing content
        weatherSlider.innerHTML = '';
        weatherDots.innerHTML = '';
        
        // Create slides
        weatherData.forEach((data, index) => {
            const slide = document.createElement('div');
            slide.className = 'weather-slide';
            slide.innerHTML = `
                <div class="weather-card">
                    <div class="weather-icon">
                        <i class="fas ${data.icon}"></i>
                        <h3 class="weather-location">${data.location}</h3>
                        <p class="weather-date">${WebGISUtils.formatDate(data.date)}</p>
                    </div>
                    <div class="weather-details">
                        <div class="weather-detail">
                            <h4>Kondisi</h4>
                            <p class="weather-value">${data.condition}</p>
                        </div>
                        <div class="weather-detail">
                            <h4>Suhu</h4>
                            <p class="weather-value">${data.temp}°C</p>
                            <small>Min: ${data.tempMin}°C | Max: ${data.tempMax}°C</small>
                        </div>
                        <div class="weather-detail">
                            <h4>Kelembapan</h4>
                            <p class="weather-value">${data.humidity}%</p>
                        </div>
                        <div class="weather-detail">
                            <h4>Angin</h4>
                            <p class="weather-value">${data.windSpeed} km/jam</p>
                            <small>Arah: ${data.windDir}</small>
                        </div>
                    </div>
                </div>
            `;
            
            weatherSlider.appendChild(slide);
            
            // Create dot
            const dot = document.createElement('div');
            dot.className = `slider-dot ${index === 0 ? 'active' : ''}`;
            dot.dataset.index = index;
            dot.addEventListener('click', () => goToSlide(index));
            weatherDots.appendChild(dot);
        });
        
        // Update slider width based on number of slides
        weatherSlider.style.width = `${weatherData.length * 100}%`;
    }
    
    // Initialize slider controls
    function initSliderControls() {
        if (prevBtn) {
            prevBtn.addEventListener('click', () => changeSlide(-1));
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => changeSlide(1));
        }
        
        // Pause auto-slide on hover
        weatherSlider.addEventListener('mouseenter', pauseAutoSlide);
        weatherSlider.addEventListener('mouseleave', startAutoSlide);
    }
    
    // Change slide
    function changeSlide(direction) {
        const newSlide = currentSlide + direction;
        
        if (newSlide < 0) {
            goToSlide(weatherData.length - 1);
        } else if (newSlide >= weatherData.length) {
            goToSlide(0);
        } else {
            goToSlide(newSlide);
        }
    }
    
    // Go to specific slide
    function goToSlide(index) {
        if (index < 0 || index >= weatherData.length) return;
        
        currentSlide = index;
        const translateX = -index * 100;
        weatherSlider.style.transform = `translateX(${translateX}%)`;
        
        // Update active dot
        document.querySelectorAll('.slider-dot').forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
        
        // Restart auto-slide timer
        restartAutoSlide();
    }
    
    // Auto-slide functionality
    function startAutoSlide() {
        if (weatherData.length <= 1) return;
        
        autoSlideInterval = setInterval(() => {
            changeSlide(1);
        }, 5000); // Change slide every 5 seconds
    }
    
    function pauseAutoSlide() {
        if (autoSlideInterval) {
            clearInterval(autoSlideInterval);
            autoSlideInterval = null;
        }
    }
    
    function restartAutoSlide() {
        pauseAutoSlide();
        startAutoSlide();
    }
    
    // Initialize weather display
    fetchWeatherData();
    
    // Add CSS for error state
    const style = document.createElement('style');
    style.textContent = `
        .weather-error {
            text-align: center;
            padding: 60px 0;
        }
        .weather-error i {
            font-size: 48px;
            color: var(--warning);
            margin-bottom: 20px;
        }
        .weather-error h3 {
            color: var(--warning);
            margin-bottom: 15px;
        }
        .weather-error p {
            color: var(--text-secondary);
        }
    `;
    document.head.appendChild(style);
});
