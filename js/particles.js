// Particles background animation - Vanilla JavaScript
class ParticlesBackground {
    constructor(canvasId, options = {}) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: 0, y: 0, radius: 100 };
        
        // Default configuration
        this.config = {
            particleCount: 80,
            particleColor: 'rgba(100, 255, 218, 0.5)',
            lineColor: 'rgba(100, 255, 218, 0.2)',
            particleSize: 2,
            lineDistance: 100,
            speed: 0.5,
            ...options
        };
        
        this.init();
        this.animate();
        this.setupEventListeners();
    }
    
    init() {
        // Set canvas size
        this.resizeCanvas();
        
        // Create particles
        for (let i = 0; i < this.config.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * this.config.particleSize + 1,
                speedX: (Math.random() - 0.5) * this.config.speed,
                speedY: (Math.random() - 0.5) * this.config.speed,
                color: this.config.particleColor
            });
        }
    }
    
    resizeCanvas() {
        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;
    }
    
    createParticles(count) {
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * this.config.particleSize + 1,
                speedX: (Math.random() - 0.5) * this.config.speed,
                speedY: (Math.random() - 0.5) * this.config.speed,
                color: this.config.particleColor
            });
        }
    }
    
    drawParticles() {
        this.particles.forEach(particle => {
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = particle.color;
            this.ctx.fill();
        });
    }
    
    drawLines() {
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < this.config.lineDistance) {
                    const opacity = 1 - (distance / this.config.lineDistance);
                    this.ctx.beginPath();
                    this.ctx.strokeStyle = `rgba(100, 255, 218, ${opacity * 0.2})`;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.stroke();
                }
            }
        }
    }
    
    updateParticles() {
        this.particles.forEach(particle => {
            // Move particles
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            
            // Mouse interaction
            const dx = this.mouse.x - particle.x;
            const dy = this.mouse.y - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < this.mouse.radius) {
                const angle = Math.atan2(dy, dx);
                const force = (this.mouse.radius - distance) / this.mouse.radius;
                particle.x -= Math.cos(angle) * force * 2;
                particle.y -= Math.sin(angle) * force * 2;
            }
            
            // Bounce off walls
            if (particle.x <= 0 || particle.x >= this.canvas.width) {
                particle.speedX = -particle.speedX;
                particle.x = particle.x <= 0 ? 1 : this.canvas.width - 1;
            }
            
            if (particle.y <= 0 || particle.y >= this.canvas.height) {
                particle.speedY = -particle.speedY;
                particle.y = particle.y <= 0 ? 1 : this.canvas.height - 1;
            }
        });
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.updateParticles();
        this.drawLines();
        this.drawParticles();
        
        requestAnimationFrame(() => this.animate());
    }
    
    setupEventListeners() {
        // Mouse move interaction
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouse.x = e.clientX - rect.left;
            this.mouse.y = e.clientY - rect.top;
        });
        
        // Mouse leave
        this.canvas.addEventListener('mouseleave', () => {
            this.mouse.x = 0;
            this.mouse.y = 0;
        });
        
        // Window resize
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.resizeCanvas();
                // Recreate particles for new dimensions
                const currentCount = this.particles.length;
                this.particles = [];
                this.createParticles(currentCount);
            }, 250);
        });
        
        // Touch interaction for mobile
        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const rect = this.canvas.getBoundingClientRect();
            const touch = e.touches[0];
            this.mouse.x = touch.clientX - rect.left;
            this.mouse.y = touch.clientY - rect.top;
        });
        
        this.canvas.addEventListener('touchend', () => {
            this.mouse.x = 0;
            this.mouse.y = 0;
        });
    }
}

// Initialize particles on page load
document.addEventListener('DOMContentLoaded', function() {
    // Hero section particles
    const heroCanvas = document.getElementById('heroParticles');
    if (heroCanvas) {
        new ParticlesBackground('heroParticles', {
            particleCount: 120,
            particleColor: 'rgba(100, 255, 218, 0.4)',
            lineColor: 'rgba(100, 255, 218, 0.15)',
            particleSize: 2.5,
            lineDistance: 120,
            speed: 0.6
        });
    }
});
