// Dashboard functionality
document.addEventListener('DOMContentLoaded', function() {
    // Sort table functionality
    const tableHeaders = document.querySelectorAll('.risk-table th');
    
    tableHeaders.forEach((header, index) => {
        // Make only certain columns sortable (Risiko Total)
        if (index === 4) { // Risiko Total column
            header.style.cursor = 'pointer';
            header.title = 'Klik untuk mengurutkan';
            
            header.addEventListener('click', function() {
                sortTableByRisk(index);
            });
        }
    });
    
    // Function to sort table by risk level
    function sortTableByRisk(columnIndex) {
        const table = document.querySelector('.risk-table');
        const tbody = table.querySelector('tbody');
        const rows = Array.from(tbody.querySelectorAll('tr'));
        
        // Check current sort order
        const isAscending = table.dataset.sortOrder !== 'desc';
        
        // Sort rows based on risk value
        rows.sort((rowA, rowB) => {
            const cellA = rowA.cells[columnIndex];
            const cellB = rowB.cells[columnIndex];
            
            // Extract risk percentage from progress bar
            const progressA = cellA.querySelector('.progress-fill');
            const progressB = cellB.querySelector('.progress-fill');
            
            const widthA = progressA ? parseInt(progressA.style.width) : 0;
            const widthB = progressB ? parseInt(progressB.style.width) : 0;
            
            return isAscending ? widthB - widthA : widthA - widthB;
        });
        
        // Clear and re-add rows in sorted order
        rows.forEach(row => tbody.appendChild(row));
        
        // Update sort order
        table.dataset.sortOrder = isAscending ? 'desc' : 'asc';
        
        // Update sort indicator
        updateSortIndicator(columnIndex, isAscending);
    }
    
    // Function to update sort indicator
    function updateSortIndicator(columnIndex, isAscending) {
        // Remove existing indicators
        document.querySelectorAll('.sort-indicator').forEach(indicator => {
            indicator.remove();
        });
        
        // Add new indicator
        const header = document.querySelectorAll('.risk-table th')[columnIndex];
        const indicator = document.createElement('span');
        indicator.className = 'sort-indicator';
        indicator.innerHTML = isAscending ? ' <i class="fas fa-sort-up"></i>' : ' <i class="fas fa-sort-down"></i>';
        header.appendChild(indicator);
    }
    
    // Risk level filtering
    const riskFilterButtons = document.createElement('div');
    riskFilterButtons.className = 'risk-filters';
    riskFilterButtons.innerHTML = `
        <button class="btn btn-outline small active" data-filter="all">Semua</button>
        <button class="btn btn-outline small" data-filter="high">Tinggi</button>
        <button class="btn btn-outline small" data-filter="medium">Sedang</button>
        <button class="btn btn-outline small" data-filter="low">Rendah</button>
    `;
    
    // Insert filters before the table
    const tableContainer = document.querySelector('.table-container');
    if (tableContainer) {
        tableContainer.parentNode.insertBefore(riskFilterButtons, tableContainer);
        
        // Add filter functionality
        const filterButtons = riskFilterButtons.querySelectorAll('button');
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Update active button
                filterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                // Filter table
                const filter = this.dataset.filter;
                filterTableRows(filter);
            });
        });
    }
    
    // Function to filter table rows by risk level
    function filterTableRows(filter) {
        const rows = document.querySelectorAll('.risk-table tbody tr');
        
        rows.forEach(row => {
            if (filter === 'all') {
                row.style.display = '';
                return;
            }
            
            const riskBadge = row.querySelector('.risk-badge');
            const riskLevel = riskBadge ? riskBadge.classList[1] : ''; // high, medium, low
            
            if (riskLevel === filter) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    }
    
    // Print/export functionality
    const exportButtons = document.createElement('div');
    exportButtons.className = 'export-buttons';
    exportButtons.innerHTML = `
        <button class="btn btn-outline small" id="printDashboard">
            <i class="fas fa-print"></i> Cetak Dashboard
        </button>
        <button class="btn btn-outline small" id="exportData">
            <i class="fas fa-download"></i> Ekspor Data
        </button>
    `;
    
    // Insert export buttons
    const dashboardSection = document.querySelector('.dashboard-section');
    if (dashboardSection) {
        const firstSection = dashboardSection.querySelector('.section-header');
        if (firstSection) {
            firstSection.parentNode.insertBefore(exportButtons, firstSection.nextSibling);
        }
        
        // Add print functionality
        const printBtn = document.getElementById('printDashboard');
        if (printBtn) {
            printBtn.addEventListener('click', function() {
                window.print();
            });
        }
        
        // Add export functionality
        const exportBtn = document.getElementById('exportData');
        if (exportBtn) {
            exportBtn.addEventListener('click', function() {
                exportTableData();
            });
        }
    }
    
    // Function to export table data as CSV
    function exportTableData() {
        const table = document.querySelector('.risk-table');
        const rows = table.querySelectorAll('tr');
        const csv = [];
        
        rows.forEach(row => {
            const rowData = [];
            const cells = row.querySelectorAll('th, td');
            
            cells.forEach(cell => {
                // Skip progress bars and buttons
                if (cell.querySelector('.progress-bar') || cell.querySelector('.risk-indicator')) {
                    const text = cell.textContent.trim();
                    rowData.push(`"${text}"`);
                } else {
                    rowData.push(`"${cell.textContent.trim()}"`);
                }
            });
            
            csv.push(rowData.join(','));
        });
        
        const csvContent = csv.join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        
        link.setAttribute('href', url);
        link.setAttribute('download', 'analisis-risiko-bencana-jabar.csv');
        link.style.visibility = 'hidden';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
    
    // Add CSS for dashboard enhancements
    const style = document.createElement('style');
    style.textContent = `
        .risk-filters {
            display: flex;
            gap: 10px;
            margin-bottom: 20px;
            flex-wrap: wrap;
        }
        
        .export-buttons {
            display: flex;
            gap: 15px;
            margin-bottom: 30px;
            flex-wrap: wrap;
        }
        
        .sort-indicator {
            margin-left: 5px;
            color: var(--accent-blue);
        }
        
        @media print {
            .navbar, .hero-buttons, .map-actions, .risk-filters, .export-buttons,
            .footer, .emergency-mini, .btn, .tab-buttons, .slider-controls {
                display: none !important;
            }
            
            body {
                background-color: white !important;
                color: black !important;
            }
            
            .section {
                padding: 20px 0 !important;
            }
            
            .card, .analysis-card, .methodology-card {
                border: 1px solid #ddd !important;
                box-shadow: none !important;
                page-break-inside: avoid;
            }
            
            .table-container {
                overflow: visible !important;
            }
            
            .risk-table {
                width: 100% !important;
                min-width: unset !important;
            }
            
            .progress-bar {
                border: 1px solid #ddd !important;
            }
            
            a {
                color: black !important;
                text-decoration: none !important;
            }
            
            a[href]:after {
                content: " (" attr(href) ")";
                font-size: 0.9em;
                color: #666;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Initialize any charts or advanced visualizations
    initRiskVisualizations();
});

// Function to initialize risk visualizations
function initRiskVisualizations() {
    // This function would initialize charts if we were using a charting library
    // For now, we'll just enhance the existing progress bars
    
    // Animate progress bars on scroll (if not already done in main.js)
    const progressBars = document.querySelectorAll('.progress-fill');
    
    if (progressBars.length > 0 && typeof IntersectionObserver !== 'undefined') {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const bar = entry.target;
                    const width = bar.style.width;
                    bar.style.width = '0%';
                    
                    setTimeout(() => {
                        bar.style.transition = 'width 1.5s ease-in-out';
                        bar.style.width = width;
                    }, 300);
                    
                    observer.unobserve(bar);
                }
            });
        }, { threshold: 0.3 });
        
        progressBars.forEach(bar => observer.observe(bar));
    }
}
