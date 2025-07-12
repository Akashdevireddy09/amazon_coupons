// Amazon Coupons Extension - Content Script
class AmazonCouponsExtension {
  constructor() {
    this.apiUrl = 'https://dsnetx.web.app/apps/coupons/datav1.json';
    this.coupons = [];
    this.isVisible = false;
    this.init();
  }

  async init() {
    // Wait for page to load
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setup());
    } else {
      this.setup();
    }
  }

  async setup() {
    // Create floating button
    this.createFloatingButton();
    
    // Fetch coupons data
    await this.fetchCoupons();
    
    // Create coupon modal
    this.createCouponModal();
  }

  createFloatingButton() {
  const button = document.createElement('div');
  button.id = 'amazon-coupons-btn';
  button.className = 'amazon-coupons-floating-btn';
  button.innerHTML = '🎟️ Coupons';
  button.title = 'View Available Coupons';

  // Default position
  button.style.position = 'absolute';
  button.style.top = '100px';
  button.style.left = '20px';
  button.style.cursor = 'grab';
  button.style.zIndex = '9999';

  // Drag functionality
  let isDragging = false;
  let offsetX, offsetY;

  button.addEventListener('mousedown', (e) => {
    isDragging = true;
    offsetX = e.clientX - button.getBoundingClientRect().left;
    offsetY = e.clientY - button.getBoundingClientRect().top;
    button.style.cursor = 'grabbing';
  });

  document.addEventListener('mousemove', (e) => {
    if (isDragging) {
      button.style.left = `${e.clientX - offsetX}px`;
      button.style.top = `${e.clientY - offsetY}px`;
    }
  });

  document.addEventListener('mouseup', () => {
    isDragging = false;
    button.style.cursor = 'grab';
  });

  // Toggle modal on click
  button.addEventListener('click', () => {
    if (!isDragging) {
      this.toggleCouponModal();
    }
  });

  document.body.appendChild(button);
}

  async fetchCoupons() {
    try {
      const response = await fetch(this.apiUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      this.coupons = Array.isArray(data) ? data : [];
      console.log('Fetched coupons:', this.coupons);
    } catch (error) {
      console.error('Error fetching coupons:', error);
      this.coupons = [];
    }
  }

  createCouponModal() {
    const modal = document.createElement('div');
    modal.id = 'amazon-coupons-modal';
    modal.className = 'amazon-coupons-modal';
    modal.style.display = 'none';
    
    modal.innerHTML = `
      <div class="amazon-coupons-modal-content">
        <div class="amazon-coupons-header">
          <h2>🎟️ Available Amazon Coupons</h2>
          <button class="amazon-coupons-close" id="closeCouponsModal">&times;</button>
        </div>
        <div class="amazon-coupons-refresh">
          <button id="refreshCoupons">🔄 Refresh Coupons</button>
          <span id="couponCount">${this.coupons.length} coupons available</span>
        </div>
        <div class="amazon-coupons-table-container">
          <table class="amazon-coupons-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Description</th>
                <th>Code</th>
                <th>Status</th>
                <th>Valid Until</th>
                <th>Used By</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody id="couponsTableBody">
              <!-- Coupon rows will be inserted here -->
            </tbody>
          </table>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Event listeners
    document.getElementById('closeCouponsModal').addEventListener('click', () => {
      this.toggleCouponModal();
    });
    
    document.getElementById('refreshCoupons').addEventListener('click', () => {
      this.refreshCoupons();
    });
    
    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        this.toggleCouponModal();
      }
    });
    
    // Populate table
    this.populateCouponsTable();
  }

  populateCouponsTable() {
    const tbody = document.getElementById('couponsTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    if (this.coupons.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="8" class="no-coupons">
            <div class="no-coupons-message">
              <p>No coupons available at the moment</p>
              <p>Please try refreshing or check back later</p>
            </div>
          </td>
        </tr>
      `;
      return;
    }
    
    this.coupons.forEach(coupon => {
      const row = document.createElement('tr');
      row.className = coupon.status === 'active' ? 'active-coupon' : 'inactive-coupon';
      
      const isExpired = new Date(coupon.endData) < new Date();
      const statusClass = coupon.status === 'active' && !isExpired ? 'status-active' : 'status-inactive';
      
      row.innerHTML = `
        <td>
          <img src="${coupon.photo}" alt="${coupon.name}" class="coupon-image" 
               onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjZjBmMGYwIi8+CjxwYXRoIGQ9Ik0xMiAxMmgxNnY0SDE2djEyaDEyVjE2aDRWMTJIMTJaIiBmaWxsPSIjY2NjIi8+Cjwvc3ZnPgo='">
        </td>
        <td class="coupon-name">${coupon.name}</td>
        <td class="coupon-desc">${coupon.desc}</td>
        <td class="coupon-code">
          <span class="code">${coupon.code}</span>
          <button class="copy-btn" onclick="navigator.clipboard.writeText('${coupon.code}').then(() => {
            this.textContent = 'Copied!';
            setTimeout(() => this.textContent = 'Copy', 1000);
          })">Copy</button>
        </td>
        <td><span class="status ${statusClass}">${coupon.status}</span></td>
        <td class="end-date">${this.formatDate(coupon.endData)}</td>
        <td class="used-count">${coupon.usedBy || 0}</td>
        <td>
          <button class="visit-btn" onclick="window.open('${coupon.link}', '_blank')">
            Visit
          </button>
        </td>
      `;
      
      tbody.appendChild(row);
    });
    
    // Update count
    const countElement = document.getElementById('couponCount');
    if (countElement) {
      countElement.textContent = `${this.coupons.length} coupons available`;
    }
  }

  formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  toggleCouponModal() {
    const modal = document.getElementById('amazon-coupons-modal');
    if (modal) {
      this.isVisible = !this.isVisible;
      modal.style.display = this.isVisible ? 'block' : 'none';
    }
  }

  async refreshCoupons() {
    const refreshBtn = document.getElementById('refreshCoupons');
    if (refreshBtn) {
      refreshBtn.textContent = '🔄 Refreshing...';
      refreshBtn.disabled = true;
    }
    
    await this.fetchCoupons();
    this.populateCouponsTable();
    
    if (refreshBtn) {
      refreshBtn.textContent = '🔄 Refresh Coupons';
      refreshBtn.disabled = false;
    }
  }
}

// Initialize the extension
const amazonCouponsExtension = new AmazonCouponsExtension();