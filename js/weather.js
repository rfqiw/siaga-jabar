// Weather Data Fetching and Display - Updated for 2026
document.addEventListener('DOMContentLoaded', function() {
    const weatherSlider = document.getElementById('weatherSlider');
    const weatherDots = document.getElementById('weatherDots');
    const prevBtn = document.getElementById('prevWeather');
    const nextBtn = document.getElementById('nextWeather');
    
    if (!weatherSlider) return;
    
    let currentSlide = 0;
    let weatherData = [];
    let autoSlideInterval;
    
    // Sample weather data for 2026
    const sampleWeatherData2026 = [
        {
            location: "Bandung",
            date: "2026-03-21",
            condition: "Hujan Ringan",
            temp: "23",
            tempMin: "21",
            tempMax: "26",
            humidity: "85",
            windSpeed: "12",
            windDir: "Barat Daya",
            icon: "fa-cloud-rain",
            rainfall: "15 mm"
        },
        {
            location: "Bogor",
            date: "2026-03-21",
            condition: "Hujan Sedang",
            temp: "22",
            tempMin: "20",
            tempMax: "24",
            humidity: "90",
            windSpeed: "15",
            windDir: "Barat",
            icon: "fa-cloud-showers-heavy",
            rainfall: "25 mm"
        },
        {
            location: "Cirebon",
            date: "2026-03-21",
            condition: "Cerah Berawan",
            temp: "29",
            tempMin: "25",
            tempMax: "32",
            humidity: "65",
            windSpeed: "18",
            windDir: "Tenggara",
            icon: "fa-cloud-sun",
            rainfall: "5 mm"
        },
        {
            location: "Tasikmalaya",
            date: "2026-03-21",
            condition: "Berawan",
            temp: "24",
            tempMin: "21",
            tempMax: "27",
            humidity: "82",
            windSpeed: "10",
            windDir: "Selatan",
            icon: "fa-cloud",
            rainfall: "10 mm"
        },
        {
            location: "Sukabumi",
            date: "2026-03-21",
            condition: "Hujan Lebat",
            temp: "21",
            tempMin: "19",
            tempMax: "23",
            humidity: "92",
            windSpeed: "20",
            windDir: "Barat",
            icon: "fa-poo-storm",
            rainfall: "35 mm"
        },
        {
            location: "Garut",
            date: "2026-03-21",
            condition: "Kabut",
            temp: "20",
            tempMin: "18",
            tempMax: "23",
            humidity: "88",
            windSpeed: "8",
            windDir: "Timur",
            icon: "fa-smog",
            rainfall: "8 mm"
        }
    ];
    
    // Function to fetch weather data
    async function fetchWeatherData() {
        try {
            // Use sample data for 2026
            weatherData = sampleWeatherData2026;
            
            // Initialize slider with weather data
            initWeatherSlider();
            initSliderControls();
            startAutoSlide();
            
        } catch (error) {
            console.error('Error fetching weather data:', error);
            // Fallback to sample data
            weatherData = sampleWeatherData2026;
            initWeatherSlider();
            initSliderControls();
            startAutoSlide();
        }
    }
    
    // Initialize weather slider with data
    function initWeatherSlider() {
        if (weatherData.length === 0) {
            weatherSlider.innerHTML = `
                <div class="weather-slide">
                    <div class="weather-error">
                        <i class="fas fa-exclamation-triangle"></i>
                        <h3>Data cuaca tidak tersedia</h3>
                        <p>Gagal memuat data cuaca dari BMKG 2026. Silakan coba lagi nanti.</p>
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
            
            const formattedDate = new Date(data.date).toLocaleDateString('id-ID', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            
            slide.innerHTML = `
                <div class="weather-card">
                    <div class="weather-icon">
                        <i class="fas ${data.icon}"></i>
                        <h3 class="weather-location">${data.location}</h3>
                        <p class="weather-date">${formattedDate}</p>
                        <div class="weather-year-badge">2026</div>
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
                        <div class="weather-detail">
                            <h4>Curah Hujan</h4>
                            <p class="weather-value">${data.rainfall}</p>
                            <small>24 jam terakhir</small>
                        </div>
                        <div class="weather-detail">
                            <h4>Update Terakhir</h4>
                            <p class="weather-value">BMKG 2026</p>
                            <small>Sistem pemantauan terbaru</small>
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
        }, 5000);
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
    
    // Add CSS for weather year badge
    const style = document.createElement('style');
    style.textContent = `
        .weather-year-badge {
            display: inline-block;
            background: linear-gradient(135deg, var(--accent-blue), var(--accent-light-blue));
            color: var(--primary-dark);
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 0.8rem;
            font-weight: 600;
            margin-top: 10px;
            letter-spacing: 1px;
        }
        
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
