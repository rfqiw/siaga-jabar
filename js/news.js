// News Data Fetching and Display
document.addEventListener('DOMContentLoaded', function() {
    // Since we cannot directly fetch from external sources due to CORS,
    // we'll display informational content with links to the official sources
    
    // BNPB News - We'll try to fetch via a CORS proxy as an example
    // Note: In production, you would need your own proxy server
    const bnpbNewsContainer = document.getElementById('bnpbNews');
    
    if (bnpbNewsContainer) {
        fetchBNPBNews();
    }
    
    // Function to fetch BNPB news
    async function fetchBNPBNews() {
        try {
            // Note: BNPB website has CORS restrictions
            // In a real implementation, you would need a backend proxy
            // For this demo, we'll show a simulated response
            
            // Simulated BNPB news data
            const simulatedNews = [
                {
                    title: "BNPB Gelar Rakornas Penanggulangan Bencana 2023",
                    excerpt: "Badan Nasional Penanggulangan Bencana menggelar Rapat Koordinasi Nasional Penanggulangan Bencana Tahun 2023.",
                    date: "2023-10-15",
                    link: "https://bnpb.go.id/berita/bnpb-gelar-rakornas-penanggulangan-bencana-2023",
                    source: "BNPB"
                },
                {
                    title: "Siaga Bencana Hidrometeorologi di Musim Penghujan",
                    excerpt: "BNPB mengimbau masyarakat waspada terhadap potensi bencana hidrometeorologi seperti banjir dan longsor.",
                    date: "2023-10-10",
                    link: "https://bnpb.go.id/berita/siaga-bencana-hidrometeorologi-di-musim-penghujan",
                    source: "BNPB"
                },
                {
                    title: "Update Penanganan Bencana di Berbagai Daerah",
                    excerpt: "BNPB terus memantau dan menangani bencana yang terjadi di berbagai wilayah Indonesia.",
                    date: "2023-10-05",
                    link: "https://bnpb.go.id/berita/update-penanganan-bencana-di-berbagai-daerah",
                    source: "BNPB"
                }
            ];
            
            displayNews(bnpbNewsContainer, simulatedNews);
            
            // Uncomment this code if you have a CORS proxy set up:
            /*
            const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
            const targetUrl = 'https://bnpb.go.id/berita';
            
            const response = await fetch(proxyUrl + targetUrl);
            const html = await response.text();
            
            // Parse HTML and extract news (this is simplified)
            const news = parseBNPBHTML(html);
            displayNews(bnpbNewsContainer, news);
            */
            
        } catch (error) {
            console.error('Error fetching BNPB news:', error);
            
            // Show fallback content
            bnpbNewsContainer.innerHTML = `
                <div class="news-item">
                    <h3 class="news-title">Berita dari BNPB</h3>
                    <p class="news-excerpt">Karena kebijakan CORS (Cross-Origin Resource Sharing), berita tidak dapat diambil langsung dari situs BNPB. Silakan kunjungi situs resmi untuk informasi terkini.</p>
                    <div class="news-meta">
                        <span><i class="fas fa-calendar-alt"></i> ${new Date().toLocaleDateString('id-ID')}</span>
                        <span><i class="fas fa-source"></i> Situs Resmi BNPB</span>
                    </div>
                </div>
            `;
        }
    }
    
    // Function to parse BNPB HTML (simplified example)
    function parseBNPBHTML(html) {
        // This is a simplified parser - in reality, you would need to adjust
        // based on the actual HTML structure of BNPB's website
        
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        
        // Find news elements - this selector is an example
        const newsElements = doc.querySelectorAll('.news-item, article, .post');
        const news = [];
        
        newsElements.forEach((element, index) => {
            if (index >= 3) return; // Limit to 3 items
            
            const titleElement = element.querySelector('h2, h3, .title, .entry-title');
            const excerptElement = element.querySelector('p, .excerpt, .entry-content');
            const dateElement = element.querySelector('.date, .post-date, time');
            const linkElement = element.querySelector('a');
            
            if (titleElement) {
                news.push({
                    title: titleElement.textContent.trim(),
                    excerpt: excerptElement ? excerptElement.textContent.trim().substring(0, 150) + '...' : '',
                    date: dateElement ? dateElement.textContent.trim() : new Date().toISOString().split('T')[0],
                    link: linkElement ? linkElement.href : 'https://bnpb.go.id/berita',
                    source: 'BNPB'
                });
            }
        });
        
        return news.length > 0 ? news : null;
    }
    
    // Function to display news
    function displayNews(container, newsItems) {
        if (!newsItems || newsItems.length === 0) {
            container.innerHTML = `
                <div class="news-item">
                    <h3 class="news-title">Tidak ada berita yang ditemukan</h3>
                    <p class="news-excerpt">Silakan kunjungi situs resmi untuk informasi terkini.</p>
                </div>
            `;
            return;
        }
        
        let newsHTML = '';
        
        newsItems.forEach(item => {
            newsHTML += `
                <div class="news-item">
                    <h3 class="news-title">${item.title}</h3>
                    <p class="news-excerpt">${item.excerpt}</p>
                    <div class="news-meta">
                        <span><i class="fas fa-calendar-alt"></i> ${item.date}</span>
                        <span><i class="fas fa-source"></i> ${item.source}</span>
                    </div>
                    <a href="${item.link}" target="_blank" class="btn btn-outline small" style="margin-top: 15px;">
                        Baca Selengkapnya <i class="fas fa-external-link-alt"></i>
                    </a>
                </div>
            `;
        });
        
        container.innerHTML = newsHTML;
        
        // Remove loading indicator if present
        const loadingIndicator = container.querySelector('.news-loading');
        if (loadingIndicator) {
            loadingIndicator.style.display = 'none';
        }
    }
    
    // Add click tracking for news links (optional)
    document.addEventListener('click', function(e) {
        if (e.target.closest('.news-item a')) {
            const link = e.target.closest('.news-item a');
            const newsTitle = link.closest('.news-item').querySelector('.news-title').textContent;
            
            // You could send analytics here
            console.log(`News clicked: ${newsTitle}`);
        }
    });
    
    // Add keyboard navigation for news tabs
    const tabButtons = document.querySelectorAll('.tab-button');
    
    tabButtons.forEach((button, index) => {
        button.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                const nextIndex = (index + 1) % tabButtons.length;
                tabButtons[nextIndex].focus();
                tabButtons[nextIndex].click();
            } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                const prevIndex = (index - 1 + tabButtons.length) % tabButtons.length;
                tabButtons[prevIndex].focus();
                tabButtons[prevIndex].click();
            }
        });
    });
});
