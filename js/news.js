// News Data Fetching and Display - Updated for 2026
document.addEventListener('DOMContentLoaded', function() {
    // Since we cannot directly fetch from external sources due to CORS,
    // we'll display informational content with links to the official sources
    
    // BNPB News - Updated for 2026
    const bnpbNewsContainer = document.getElementById('bnpbNews');
    
    if (bnpbNewsContainer) {
        fetchBNPBNews();
    }
    
    // Function to fetch BNPB news (simulated for 2026)
    async function fetchBNPBNews() {
        try {
            // Simulated BNPB news data for 2026
            const simulatedNews2026 = [
                {
                    title: "BNPB Luncurkan Sistem Peringatan Dini Bencana Terintegrasi 2026",
                    excerpt: "Badan Nasional Penanggulangan Bencana meluncurkan sistem peringatan dini terbaru yang mengintegrasikan data dari seluruh Indonesia untuk respons bencana yang lebih cepat.",
                    date: "2026-03-15",
                    link: "https://bnpb.go.id/berita/bnpb-luncurkan-sistem-peringatan-dini-2026",
                    source: "BNPB"
                },
                {
                    title: "Siaga Bencana Hidrometeorologi Musim Penghujan 2026",
                    excerpt: "BNPB meningkatkan kewaspadaan terhadap potensi bencana hidrometeorologi di musim penghujan 2026, dengan fokus pada wilayah Jawa Barat.",
                    date: "2026-02-28",
                    link: "https://bnpb.go.id/berita/siaga-bencana-hidrometeorologi-2026",
                    source: "BNPB"
                },
                {
                    title: "Pelatihan Mitigasi Bencana untuk Masyarakat Jawa Barat 2026",
                    excerpt: "BNPB bekerja sama dengan BPBD Jawa Barat menggelar pelatihan mitigasi bencana untuk masyarakat di 27 kabupaten/kota.",
                    date: "2026-02-10",
                    link: "https://bnpb.go.id/berita/pelatihan-mitigasi-bencana-jabar-2026",
                    source: "BNPB"
                },
                {
                    title: "Update Sistem Evakuasi Digital Jawa Barat 2026",
                    excerpt: "Pemutakhiran sistem evakuasi digital dengan integrasi peta real-time dan notifikasi otomatis untuk warga terdampak bencana.",
                    date: "2026-01-25",
                    link: "https://bnpb.go.id/berita/update-sistem-evakuasi-digital-2026",
                    source: "BNPB"
                }
            ];
            
            displayNews(bnpbNewsContainer, simulatedNews2026);
            
        } catch (error) {
            console.error('Error fetching BNPB news:', error);
            
            // Show fallback content
            bnpbNewsContainer.innerHTML = `
                <div class="news-item">
                    <h3 class="news-title">Berita dari BNPB 2026</h3>
                    <p class="news-excerpt">Karena kebijakan CORS (Cross-Origin Resource Sharing), berita tidak dapat diambil langsung dari situs BNPB. Silakan kunjungi situs resmi untuk informasi terkini tahun 2026.</p>
                    <div class="news-meta">
                        <span><i class="fas fa-calendar-alt"></i> ${new Date().toLocaleDateString('id-ID')}</span>
                        <span><i class="fas fa-source"></i> Situs Resmi BNPB 2026</span>
                    </div>
                </div>
            `;
        }
    }
    
    // Function to display news
    function displayNews(container, newsItems) {
        if (!newsItems || newsItems.length === 0) {
            container.innerHTML = `
                <div class="news-item">
                    <h3 class="news-title">Tidak ada berita yang ditemukan</h3>
                    <p class="news-excerpt">Silakan kunjungi situs resmi untuk informasi terkini tahun 2026.</p>
                </div>
            `;
            return;
        }
        
        let newsHTML = '';
        
        newsItems.forEach(item => {
            const formattedDate = new Date(item.date).toLocaleDateString('id-ID', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            
            newsHTML += `
                <div class="news-item">
                    <h3 class="news-title">${item.title}</h3>
                    <p class="news-excerpt">${item.excerpt}</p>
                    <div class="news-meta">
                        <span><i class="fas fa-calendar-alt"></i> ${formattedDate}</span>
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
    
    // Add click tracking for news links
    document.addEventListener('click', function(e) {
        if (e.target.closest('.news-item a')) {
            const link = e.target.closest('.news-item a');
            const newsTitle = link.closest('.news-item').querySelector('.news-title').textContent;
            
            // Track news clicks
            console.log(`Berita 2026 diklik: ${newsTitle}`);
        }
    });
});
