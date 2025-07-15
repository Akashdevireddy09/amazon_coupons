// Amazon Coupons Extension - Content Script with Auto-Apply Feature
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
          <div class="coupon-actions">
            <button class="copy-btn" onclick="navigator.clipboard.writeText('${coupon.code}').then(() => {
              this.textContent = 'Copied!';
              setTimeout(() => this.textContent = 'Copy', 1000);
            })">Copy</button>
            <button class="apply-btn" data-coupon-code="${coupon.code}">Apply</button>
          </div>
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
    
    // Add event listeners for apply buttons
    this.attachApplyButtonListeners();
    
    // Update count
    const countElement = document.getElementById('couponCount');
    if (countElement) {
      countElement.textContent = `${this.coupons.length} coupons available`;
    }
  }

  attachApplyButtonListeners() {
    const applyButtons = document.querySelectorAll('.apply-btn');
    applyButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        const couponCode = e.target.getAttribute('data-coupon-code');
        this.applyCoupon(couponCode, e.target);
      });
    });
  }

  async applyCoupon(couponCode, buttonElement) {
    try {
      // Show loading state
      const originalText = buttonElement.textContent;
      buttonElement.textContent = 'Applying...';
      buttonElement.disabled = true;

      // Step 1: Copy coupon code to clipboard
      await navigator.clipboard.writeText(couponCode);
      console.log('Coupon code copied to clipboard:', couponCode);

      // Step 2: Find and fill the coupon input field
      const success = await this.fillCouponInput(couponCode);
      
      if (success) {
        buttonElement.textContent = 'Applied!';
        buttonElement.style.backgroundColor = '#28a745';
        
        // Reset button after 3 seconds
        setTimeout(() => {
          buttonElement.textContent = originalText;
          buttonElement.disabled = false;
          buttonElement.style.backgroundColor = '';
        }, 3000);
      } else {
        throw new Error('Could not find coupon input field');
      }

    } catch (error) {
      console.error('Error applying coupon:', error);
      buttonElement.textContent = 'Error';
      buttonElement.style.backgroundColor = '#dc3545';
      
      // Reset button after 2 seconds
      setTimeout(() => {
        buttonElement.textContent = 'Apply';
        buttonElement.disabled = false;
        buttonElement.style.backgroundColor = '';
      }, 2000);
    }
  }

  async fillCouponInput(couponCode) {
    // Multiple selectors to handle different Amazon page layouts
    const selectors = [
      'input[name="ppw-claimCode"]',
      'input[id*="claimCode"]',
      'input[placeholder*="Enter Code"]',
      'input[placeholder*="coupon"]',
      'input[placeholder*="promo"]',
      'input[class*="claim-code"]',
      'input[class*="coupon-code"]',
      'input[class*="promo-code"]',
      'input[data-testid*="claim-code"]',
      'input[aria-label*="coupon"]',
      'input[aria-label*="promo"]'
    ];

    let inputField = null;
    
    // Try to find the input field using different selectors
    for (const selector of selectors) {
      inputField = document.querySelector(selector);
      if (inputField) {
        console.log('Found coupon input field with selector:', selector);
        break;
      }
    }

    if (!inputField) {
      // Try to find by checking all input fields on the page
      const allInputs = document.querySelectorAll('input[type="text"]');
      for (const input of allInputs) {
        const placeholder = input.placeholder?.toLowerCase() || '';
        const ariaLabel = input.getAttribute('aria-label')?.toLowerCase() || '';
        const className = input.className?.toLowerCase() || '';
        const id = input.id?.toLowerCase() || '';
        
        if (placeholder.includes('code') || placeholder.includes('coupon') || 
            ariaLabel.includes('code') || ariaLabel.includes('coupon') ||
            className.includes('code') || className.includes('coupon') ||
            id.includes('code') || id.includes('coupon')) {
          inputField = input;
          console.log('Found potential coupon input field:', input);
          break;
        }
      }
    }

    if (!inputField) {
      console.error('Could not find coupon input field');
      return false;
    }

    // Clear the input field first
    inputField.value = '';
    inputField.focus();

    // Fill the input field with the coupon code
    inputField.value = couponCode;

    // Trigger input events to ensure the form recognizes the change
    const inputEvent = new Event('input', { bubbles: true });
    const changeEvent = new Event('change', { bubbles: true });
    
    inputField.dispatchEvent(inputEvent);
    inputField.dispatchEvent(changeEvent);

    // Wait a moment for the form to process the input
    await new Promise(resolve => setTimeout(resolve, 500));

    // Step 3: Find and click the apply button
    const applyButtonSuccess = await this.clickApplyButton();
    
    return applyButtonSuccess;
  }

  async clickApplyButton() {
    // Multiple selectors for the apply button
    const buttonSelectors = [
      'button[class*="pmts-button-input"]',
      'button[type="submit"]',
      'input[type="submit"]',
      'button[class*="apply"]',
      'button[class*="claim"]',
      'button[id*="apply"]',
      'button[id*="claim"]',
      'button[data-testid*="apply"]',
      'button[aria-label*="apply"]',
      'button[aria-label*="claim"]'
    ];

    let applyButton = null;

    // Try to find the apply button using different selectors
    for (const selector of buttonSelectors) {
      applyButton = document.querySelector(selector);
      if (applyButton) {
        console.log('Found apply button with selector:', selector);
        break;
      }
    }

    if (!applyButton) {
      // Try to find by checking all buttons on the page
      const allButtons = document.querySelectorAll('button, input[type="submit"]');
      for (const button of allButtons) {
        const buttonText = button.textContent?.toLowerCase() || '';
        const ariaLabel = button.getAttribute('aria-label')?.toLowerCase() || '';
        const className = button.className?.toLowerCase() || '';
        const id = button.id?.toLowerCase() || '';
        
        if (buttonText.includes('apply') || buttonText.includes('claim') ||
            ariaLabel.includes('apply') || ariaLabel.includes('claim') ||
            className.includes('apply') || className.includes('claim') ||
            id.includes('apply') || id.includes('claim')) {
          applyButton = button;
          console.log('Found potential apply button:', button);
          break;
        }
      }
    }

    if (!applyButton) {
      console.error('Could not find apply button');
      return false;
    }

    // Check if button is disabled
    if (applyButton.disabled) {
      console.log('Apply button is disabled, waiting...');
      // Wait a moment and try again
      await new Promise(resolve => setTimeout(resolve, 1000));
      if (applyButton.disabled) {
        console.error('Apply button remains disabled');
        return false;
      }
    }

    // Click the apply button
    applyButton.click();
    console.log('Apply button clicked');

    // Wait for the application to process
    await new Promise(resolve => setTimeout(resolve, 2000));

    return true;
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




