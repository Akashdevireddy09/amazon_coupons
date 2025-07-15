// // Amazon Coupons Extension - Content Script with Auto-Apply Feature
// class AmazonCouponsExtension {
//   constructor() {
//     this.apiUrl = 'https://dsnetx.web.app/apps/coupons/datav1.json';
//     this.coupons = [];
//     this.isVisible = false;
//     this.init();
//   }

//   async init() {
//     // Wait for page to load
//     if (document.readyState === 'loading') {
//       document.addEventListener('DOMContentLoaded', () => this.setup());
//     } else {
//       this.setup();
//     }
//   }

//   async setup() {
//     // Create floating button
//     this.createFloatingButton();
    
//     // Fetch coupons data
//     await this.fetchCoupons();
    
//     // Create coupon modal
//     this.createCouponModal();
//   }

//   createFloatingButton() {
//     const button = document.createElement('div');
//     button.id = 'amazon-coupons-btn';
//     button.className = 'amazon-coupons-floating-btn';
//     button.innerHTML = '🎟️ Coupons';
//     button.title = 'View Available Coupons';

//     // Default position
//     button.style.position = 'absolute';
//     button.style.top = '100px';
//     button.style.left = '20px';
//     button.style.cursor = 'grab';
//     button.style.zIndex = '9999';

//     // Drag functionality
//     let isDragging = false;
//     let offsetX, offsetY;

//     button.addEventListener('mousedown', (e) => {
//       isDragging = true;
//       offsetX = e.clientX - button.getBoundingClientRect().left;
//       offsetY = e.clientY - button.getBoundingClientRect().top;
//       button.style.cursor = 'grabbing';
//     });

//     document.addEventListener('mousemove', (e) => {
//       if (isDragging) {
//         button.style.left = `${e.clientX - offsetX}px`;
//         button.style.top = `${e.clientY - offsetY}px`;
//       }
//     });

//     document.addEventListener('mouseup', () => {
//       isDragging = false;
//       button.style.cursor = 'grab';
//     });

//     // Toggle modal on click
//     button.addEventListener('click', () => {
//       if (!isDragging) {
//         this.toggleCouponModal();
//       }
//     });

//     document.body.appendChild(button);
//   }

//   async fetchCoupons() {
//     try {
//       const response = await fetch(this.apiUrl);
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
//       const data = await response.json();
//       this.coupons = Array.isArray(data) ? data : [];
//       console.log('Fetched coupons:', this.coupons);
//     } catch (error) {
//       console.error('Error fetching coupons:', error);
//       this.coupons = [];
//     }
//   }

//   createCouponModal() {
//     const modal = document.createElement('div');
//     modal.id = 'amazon-coupons-modal';
//     modal.className = 'amazon-coupons-modal';
//     modal.style.display = 'none';
    
//     modal.innerHTML = `
//       <div class="amazon-coupons-modal-content">
//         <div class="amazon-coupons-header">
//           <h2>🎟️ Available Amazon Coupons</h2>
//           <button class="amazon-coupons-close" id="closeCouponsModal">&times;</button>
//         </div>
//         <div class="amazon-coupons-refresh">
//           <button id="refreshCoupons">🔄 Refresh Coupons</button>
//           <span id="couponCount">${this.coupons.length} coupons available</span>
//         </div>
//         <div class="amazon-coupons-table-container">
//           <table class="amazon-coupons-table">
//             <thead>
//               <tr>
//                 <th>Image</th>
//                 <th>Name</th>
//                 <th>Description</th>
//                 <th>Code</th>
//                 <th>Status</th>
//                 <th>Valid Until</th>
//                 <th>Used By</th>
//                 <th>Action</th>
//               </tr>
//             </thead>
//             <tbody id="couponsTableBody">
//               <!-- Coupon rows will be inserted here -->
//             </tbody>
//           </table>
//         </div>
//       </div>
//     `;
    
//     document.body.appendChild(modal);
    
//     // Event listeners
//     document.getElementById('closeCouponsModal').addEventListener('click', () => {
//       this.toggleCouponModal();
//     });
    
//     document.getElementById('refreshCoupons').addEventListener('click', () => {
//       this.refreshCoupons();
//     });
    
//     // Close modal when clicking outside
//     modal.addEventListener('click', (e) => {
//       if (e.target === modal) {
//         this.toggleCouponModal();
//       }
//     });
    
//     // Populate table
//     this.populateCouponsTable();
//   }

//   populateCouponsTable() {
//     const tbody = document.getElementById('couponsTableBody');
//     if (!tbody) return;
    
//     tbody.innerHTML = '';
    
//     if (this.coupons.length === 0) {
//       tbody.innerHTML = `
//         <tr>
//           <td colspan="8" class="no-coupons">
//             <div class="no-coupons-message">
//               <p>No coupons available at the moment</p>
//               <p>Please try refreshing or check back later</p>
//             </div>
//           </td>
//         </tr>
//       `;
//       return;
//     }
    
//     this.coupons.forEach(coupon => {
//       const row = document.createElement('tr');
//       row.className = coupon.status === 'active' ? 'active-coupon' : 'inactive-coupon';
      
//       const isExpired = new Date(coupon.endData) < new Date();
//       const statusClass = coupon.status === 'active' && !isExpired ? 'status-active' : 'status-inactive';
      
//       row.innerHTML = `
//         <td>
//           <img src="${coupon.photo}" alt="${coupon.name}" class="coupon-image" 
//                onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjZjBmMGYwIi8+CjxwYXRoIGQ9Ik0xMiAxMmgxNnY0SDE2djEyaDEyVjE2aDRWMTJIMTJaIiBmaWxsPSIjY2NjIi8+Cjwvc3ZnPgo='">
//         </td>
//         <td class="coupon-name">${coupon.name}</td>
//         <td class="coupon-desc">${coupon.desc}</td>
//         <td class="coupon-code">
//           <span class="code">${coupon.code}</span>
//           <div class="coupon-actions">
//             <button class="copy-btn" onclick="navigator.clipboard.writeText('${coupon.code}').then(() => {
//               this.textContent = 'Copied!';
//               setTimeout(() => this.textContent = 'Copy', 1000);
//             })">Copy</button>
//             <button class="apply-btn" data-coupon-code="${coupon.code}">Apply</button>
//           </div>
//         </td>
//         <td><span class="status ${statusClass}">${coupon.status}</span></td>
//         <td class="end-date">${this.formatDate(coupon.endData)}</td>
//         <td class="used-count">${coupon.usedBy || 0}</td>
//         <td>
//           <button class="visit-btn" onclick="window.open('${coupon.link}', '_blank')">
//             Visit
//           </button>
//         </td>
//       `;
      
//       tbody.appendChild(row);
//     });
    
//     // Add event listeners for apply buttons
//     this.attachApplyButtonListeners();
    
//     // Update count
//     const countElement = document.getElementById('couponCount');
//     if (countElement) {
//       countElement.textContent = `${this.coupons.length} coupons available`;
//     }
//   }

//   attachApplyButtonListeners() {
//     const applyButtons = document.querySelectorAll('.apply-btn');
//     applyButtons.forEach(button => {
//       button.addEventListener('click', (e) => {
//         const couponCode = e.target.getAttribute('data-coupon-code');
//         this.applyCoupon(couponCode, e.target);
//       });
//     });
//   }

//   async applyCoupon(couponCode, buttonElement) {
//     try {
//       // Show loading state
//       const originalText = buttonElement.textContent;
//       buttonElement.textContent = 'Applying...';
//       buttonElement.disabled = true;

//       // Step 1: Copy coupon code to clipboard
//       await navigator.clipboard.writeText(couponCode);
//       console.log('Coupon code copied to clipboard:', couponCode);

//       // Step 2: Find and fill the coupon input field
//       const success = await this.fillCouponInput(couponCode);
      
//       if (success) {
//         buttonElement.textContent = 'Applied!';
//         buttonElement.style.backgroundColor = '#28a745';
        
//         // Reset button after 3 seconds
//         setTimeout(() => {
//           buttonElement.textContent = originalText;
//           buttonElement.disabled = false;
//           buttonElement.style.backgroundColor = '';
//         }, 3000);
//       } else {
//         throw new Error('Could not find coupon input field');
//       }

//     } catch (error) {
//       console.error('Error applying coupon:', error);
//       buttonElement.textContent = 'Error';
//       buttonElement.style.backgroundColor = '#dc3545';
      
//       // Reset button after 2 seconds
//       setTimeout(() => {
//         buttonElement.textContent = 'Apply';
//         buttonElement.disabled = false;
//         buttonElement.style.backgroundColor = '';
//       }, 2000);
//     }
//   }

//   async fillCouponInput(couponCode) {
//     // Multiple selectors to handle different Amazon page layouts
//     const selectors = [
//       'input[name="ppw-claimCode"]',
//       'input[id*="claimCode"]',
//       'input[placeholder*="Enter Code"]',
//       'input[placeholder*="coupon"]',
//       'input[placeholder*="promo"]',
//       'input[class*="claim-code"]',
//       'input[class*="coupon-code"]',
//       'input[class*="promo-code"]',
//       'input[data-testid*="claim-code"]',
//       'input[aria-label*="coupon"]',
//       'input[aria-label*="promo"]'
//     ];

//     let inputField = null;
    
//     // Try to find the input field using different selectors
//     for (const selector of selectors) {
//       inputField = document.querySelector(selector);
//       if (inputField) {
//         console.log('Found coupon input field with selector:', selector);
//         break;
//       }
//     }

//     if (!inputField) {
//       // Try to find by checking all input fields on the page
//       const allInputs = document.querySelectorAll('input[type="text"]');
//       for (const input of allInputs) {
//         const placeholder = input.placeholder?.toLowerCase() || '';
//         const ariaLabel = input.getAttribute('aria-label')?.toLowerCase() || '';
//         const className = input.className?.toLowerCase() || '';
//         const id = input.id?.toLowerCase() || '';
        
//         if (placeholder.includes('code') || placeholder.includes('coupon') || 
//             ariaLabel.includes('code') || ariaLabel.includes('coupon') ||
//             className.includes('code') || className.includes('coupon') ||
//             id.includes('code') || id.includes('coupon')) {
//           inputField = input;
//           console.log('Found potential coupon input field:', input);
//           break;
//         }
//       }
//     }

//     if (!inputField) {
//       console.error('Could not find coupon input field');
//       return false;
//     }

//     // Clear the input field first
//     inputField.value = '';
//     inputField.focus();

//     // Fill the input field with the coupon code
//     inputField.value = couponCode;

//     // Trigger input events to ensure the form recognizes the change
//     const inputEvent = new Event('input', { bubbles: true });
//     const changeEvent = new Event('change', { bubbles: true });
    
//     inputField.dispatchEvent(inputEvent);
//     inputField.dispatchEvent(changeEvent);

//     // Wait a moment for the form to process the input
//     await new Promise(resolve => setTimeout(resolve, 500));

//     // Step 3: Find and click the apply button
//     const applyButtonSuccess = await this.clickApplyButton();
    
//     return applyButtonSuccess;
//   }

//   async clickApplyButton() {
//     // Multiple selectors for the apply button
//     const buttonSelectors = [
//       'button[class*="pmts-button-input"]',
//       'button[type="submit"]',
//       'input[type="submit"]',
//       'button[class*="apply"]',
//       'button[class*="claim"]',
//       'button[id*="apply"]',
//       'button[id*="claim"]',
//       'button[data-testid*="apply"]',
//       'button[aria-label*="apply"]',
//       'button[aria-label*="claim"]'
//     ];

//     let applyButton = null;

//     // Try to find the apply button using different selectors
//     for (const selector of buttonSelectors) {
//       applyButton = document.querySelector(selector);
//       if (applyButton) {
//         console.log('Found apply button with selector:', selector);
//         break;
//       }
//     }

//     if (!applyButton) {
//       // Try to find by checking all buttons on the page
//       const allButtons = document.querySelectorAll('button, input[type="submit"]');
//       for (const button of allButtons) {
//         const buttonText = button.textContent?.toLowerCase() || '';
//         const ariaLabel = button.getAttribute('aria-label')?.toLowerCase() || '';
//         const className = button.className?.toLowerCase() || '';
//         const id = button.id?.toLowerCase() || '';
        
//         if (buttonText.includes('apply') || buttonText.includes('claim') ||
//             ariaLabel.includes('apply') || ariaLabel.includes('claim') ||
//             className.includes('apply') || className.includes('claim') ||
//             id.includes('apply') || id.includes('claim')) {
//           applyButton = button;
//           console.log('Found potential apply button:', button);
//           break;
//         }
//       }
//     }

//     if (!applyButton) {
//       console.error('Could not find apply button');
//       return false;
//     }

//     // Check if button is disabled
//     if (applyButton.disabled) {
//       console.log('Apply button is disabled, waiting...');
//       // Wait a moment and try again
//       await new Promise(resolve => setTimeout(resolve, 1000));
//       if (applyButton.disabled) {
//         console.error('Apply button remains disabled');
//         return false;
//       }
//     }

//     // Click the apply button
//     applyButton.click();
//     console.log('Apply button clicked');

//     // Wait for the application to process
//     await new Promise(resolve => setTimeout(resolve, 2000));

//     return true;
//   }

//   formatDate(dateString) {
//     const date = new Date(dateString);
//     return date.toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric'
//     });
//   }

//   toggleCouponModal() {
//     const modal = document.getElementById('amazon-coupons-modal');
//     if (modal) {
//       this.isVisible = !this.isVisible;
//       modal.style.display = this.isVisible ? 'block' : 'none';
//     }
//   }

//   async refreshCoupons() {
//     const refreshBtn = document.getElementById('refreshCoupons');
//     if (refreshBtn) {
//       refreshBtn.textContent = '🔄 Refreshing...';
//       refreshBtn.disabled = true;
//     }
    
//     await this.fetchCoupons();
//     this.populateCouponsTable();
    
//     if (refreshBtn) {
//       refreshBtn.textContent = '🔄 Refresh Coupons';
//       refreshBtn.disabled = false;
//     }
//   }
// }

// // Initialize the extension
// const amazonCouponsExtension = new AmazonCouponsExtension();



// Amazon Coupons Extension - Content Script with Real-time API Integration
class AmazonCouponsExtension {
  constructor() {
    this.baseApiUrl = 'https://amazonspot.net/apps/PhpCRUDApi/apiCoupons.php/records';
    this.coupons = [];
    this.categories = [];
    this.companies = [];
    this.isVisible = false;
    this.currentPage = 1;
    this.couponsPerPage = 20;
    this.totalCoupons = 0;
    this.totalPages = 0;
    this.selectedCategories = [];
    this.selectedCompanies = [];
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
    
    // Fetch initial data
    await this.fetchCategories();
    await this.fetchCompanies();
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
    button.style.position = 'fixed';
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
        button.style.right = 'auto';
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

  async fetchCategories() {
    try {
      const response = await fetch(`${this.baseApiUrl}/categories?order=name,asc`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      this.categories = data.records || [];
      console.log('Fetched categories:', this.categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
      this.categories = [];
    }
  }

  async fetchCompanies() {
    try {
      const response = await fetch(`${this.baseApiUrl}/companies?order=name,asc`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      this.companies = data.records || [];
      console.log('Fetched companies:', this.companies);
    } catch (error) {
      console.error('Error fetching companies:', error);
      this.companies = [];
    }
  }

  async fetchCoupons() {
    try {
      const startRecord = (this.currentPage - 1) * this.couponsPerPage + 1;
      const endRecord = this.currentPage * this.couponsPerPage;
      
      let url = `${this.baseApiUrl}/coupons?page=${this.currentPage},${this.couponsPerPage}&order=id,desc&filter=country,eq,US`;
      
      // Add category filters
      if (this.selectedCategories.length > 0) {
        this.selectedCategories.forEach(category => {
          url += `&filter[]=category,eq,${encodeURIComponent(category)}`;
        });
      }
      
      // Add company filters
      if (this.selectedCompanies.length > 0) {
        this.selectedCompanies.forEach(company => {
          url += `&filter[]=company,eq,${encodeURIComponent(company)}`;
        });
      }
      
      console.log('Fetching coupons from:', url);
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      
      this.coupons = data.records || [];
      this.totalCoupons = data.results || 0;
      this.totalPages = Math.ceil(this.totalCoupons / this.couponsPerPage);
      
      console.log('Fetched coupons:', this.coupons);
      console.log('Total coupons:', this.totalCoupons);
      console.log('Total pages:', this.totalPages);
    } catch (error) {
      console.error('Error fetching coupons:', error);
      this.coupons = [];
      this.totalCoupons = 0;
      this.totalPages = 0;
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
          <h2>🎟️ Amazon Coupons</h2>
          <button class="amazon-coupons-close" id="closeCouponsModal">&times;</button>
        </div>
        
        <div class="amazon-coupons-controls">
          <div class="amazon-coupons-filters">
            <div class="filter-group">
              <label for="categoryFilter">Categories:</label>
              <div class="filter-dropdown">
                <input type="text" id="categoryFilterInput" placeholder="Select categories..." readonly>
                <div class="filter-dropdown-arrow">▼</div>
                <div class="filter-dropdown-options" id="categoryFilterOptions">
                  <!-- Options will be populated here -->
                </div>
              </div>
            </div>
            <div class="filter-group">
              <label for="companyFilter">Companies:</label>
              <div class="filter-dropdown">
                <input type="text" id="companyFilterInput" placeholder="Select companies..." readonly>
                <div class="filter-dropdown-arrow">▼</div>
                <div class="filter-dropdown-options" id="companyFilterOptions">
                  <!-- Options will be populated here -->
                </div>
              </div>
            </div>
          </div>
          
          <div class="amazon-coupons-stats">
            <span class="coupon-count" id="couponCount">Loading...</span>
            <button class="refresh-btn" id="refreshCoupons">🔄 Refresh</button>
          </div>
        </div>
        
        <div class="amazon-coupons-content">
          <div id="couponsContainer" class="coupons-grid">
            <div class="loading">Loading coupons...</div>
          </div>
        </div>
        
        <div class="pagination" id="paginationContainer">
          <!-- Pagination will be inserted here -->
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
    
    // Initialize filters
    this.initializeFilters();
    
    // Populate filters and coupons
    this.populateFilters();
    this.populateCoupons();
  }

  initializeFilters() {
    // Category filter initialization
    const categoryInput = document.getElementById('categoryFilterInput');
    const categoryOptions = document.getElementById('categoryFilterOptions');
    
    categoryInput.addEventListener('click', () => {
      categoryOptions.style.display = categoryOptions.style.display === 'block' ? 'none' : 'block';
    });
    
    // Company filter initialization
    const companyInput = document.getElementById('companyFilterInput');
    const companyOptions = document.getElementById('companyFilterOptions');
    
    companyInput.addEventListener('click', () => {
      companyOptions.style.display = companyOptions.style.display === 'block' ? 'none' : 'block';
    });
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.filter-dropdown')) {
        categoryOptions.style.display = 'none';
        companyOptions.style.display = 'none';
      }
    });
  }

  populateFilters() {
    const categoryOptions = document.getElementById('categoryFilterOptions');
    const companyOptions = document.getElementById('companyFilterOptions');
    
    // Populate category filter
    if (categoryOptions) {
      categoryOptions.innerHTML = '';
      
      this.categories.forEach(category => {
        const option = document.createElement('div');
        option.className = 'filter-option';
        option.innerHTML = `
          <input type="checkbox" id="cat-${category.id}" value="${category.name}">
          <label for="cat-${category.id}">${category.name} (${category.count || 0})</label>
        `;
        
        const checkbox = option.querySelector('input');
        checkbox.addEventListener('change', () => {
          this.updateCategoryFilter();
        });
        
        categoryOptions.appendChild(option);
      });
    }
    
    // Populate company filter
    if (companyOptions) {
      companyOptions.innerHTML = '';
      
      this.companies.forEach(company => {
        const option = document.createElement('div');
        option.className = 'filter-option';
        option.innerHTML = `
          <input type="checkbox" id="comp-${company.id}" value="${company.name}">
          <label for="comp-${company.id}">${company.name}</label>
        `;
        
        const checkbox = option.querySelector('input');
        checkbox.addEventListener('change', () => {
          this.updateCompanyFilter();
        });
        
        companyOptions.appendChild(option);
      });
    }
  }

  updateCategoryFilter() {
    const checkboxes = document.querySelectorAll('#categoryFilterOptions input[type="checkbox"]:checked');
    this.selectedCategories = Array.from(checkboxes).map(cb => cb.value);
    
    const categoryInput = document.getElementById('categoryFilterInput');
    if (this.selectedCategories.length > 0) {
      categoryInput.value = `${this.selectedCategories.length} selected`;
    } else {
      categoryInput.value = '';
      categoryInput.placeholder = 'Select categories...';
    }
    
    this.currentPage = 1;
    this.refreshCoupons();
  }

  updateCompanyFilter() {
    const checkboxes = document.querySelectorAll('#companyFilterOptions input[type="checkbox"]:checked');
    this.selectedCompanies = Array.from(checkboxes).map(cb => cb.value);
    
    const companyInput = document.getElementById('companyFilterInput');
    if (this.selectedCompanies.length > 0) {
      companyInput.value = `${this.selectedCompanies.length} selected`;
    } else {
      companyInput.value = '';
      companyInput.placeholder = 'Select companies...';
    }
    
    this.currentPage = 1;
    this.refreshCoupons();
  }

  populateCoupons() {
    const container = document.getElementById('couponsContainer');
    const countElement = document.getElementById('couponCount');
    
    if (!container) return;
    
    // Update count
    if (countElement) {
      countElement.textContent = `${this.totalCoupons} coupons found`;
    }
    
    if (this.coupons.length === 0) {
      container.innerHTML = `
        <div class="no-coupons">
          <div class="no-coupons-message">
            <h3>No coupons found</h3>
            <p>Try adjusting your filters or check back later</p>
          </div>
        </div>
      `;
      this.updatePagination();
      return;
    }
    
    container.innerHTML = '';
    
    this.coupons.forEach(coupon => {
      const card = document.createElement('div');
      card.className = 'coupon-card';
      
      const isExpired = new Date(coupon.endDate) < new Date();
      const statusClass = coupon.status === 'Active' && !isExpired ? 'status-active' : 'status-inactive';
      
      card.innerHTML = `
        <div class="coupon-header">
          <h3 class="coupon-title">${coupon.name}</h3>
          <span class="coupon-status ${statusClass}">${coupon.status}</span>
        </div>
        
        <div class="coupon-company">
          <strong>Company:</strong> ${coupon.company} | <strong>Category:</strong> ${coupon.category}
        </div>
        
        <div class="coupon-desc">${coupon.desc}</div>
        
        <div class="coupon-details">
          <div class="coupon-detail">
            <strong>Discount:</strong> ${coupon.percentageSave}% off
          </div>
          <div class="coupon-detail">
            <strong>Used by:</strong> ${coupon.usedBy || 0} people
          </div>
          <div class="coupon-detail">
            <strong>Valid until:</strong> ${this.formatDate(coupon.endDate)}
          </div>
          <div class="coupon-detail">
            <strong>Started:</strong> ${this.formatDate(coupon.startDate)}
          </div>
        </div>
        
        <div class="coupon-code-section">
          <div class="coupon-code">
            <span class="code">${coupon.code}</span>
            <button class="copy-btn" onclick="amazonCouponsExtension.copyToClipboard('${coupon.code}', this)">Copy</button>
          </div>
        </div>
        
        <div class="coupon-actions">
          <button class="btn btn-apply" data-coupon-code="${coupon.code}">Apply</button>
          <button class="btn btn-visit" onclick="window.open('${coupon.link}', '_blank')">Visit Store</button>
        </div>
      `;
      
      container.appendChild(card);
    });
    
    // Add event listeners for apply buttons
    this.attachApplyButtonListeners();
    
    // Update pagination
    this.updatePagination();
  }

  attachApplyButtonListeners() {
    const applyButtons = document.querySelectorAll('.btn-apply');
    applyButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        const couponCode = e.target.getAttribute('data-coupon-code');
        this.applyCoupon(couponCode, e.target);
      });
    });
  }

  async copyToClipboard(code, buttonElement) {
    try {
      // Use the newer Clipboard API
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(code);
      } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = code;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      
      const originalText = buttonElement.textContent;
      buttonElement.textContent = 'Copied!';
      buttonElement.style.background = '#28a745';
      
      setTimeout(() => {
        buttonElement.textContent = originalText;
        buttonElement.style.background = '';
      }, 2000);
      
    } catch (error) {
      console.error('Failed to copy code:', error);
      
      // Show error feedback
      const originalText = buttonElement.textContent;
      buttonElement.textContent = 'Error';
      buttonElement.style.background = '#dc3545';
      
      setTimeout(() => {
        buttonElement.textContent = originalText;
        buttonElement.style.background = '';
      }, 2000);
    }
  }

  updatePagination() {
    const paginationContainer = document.getElementById('paginationContainer');
    if (!paginationContainer) return;
    
    if (this.totalPages <= 1) {
      paginationContainer.style.display = 'none';
      return;
    }
    
    paginationContainer.style.display = 'flex';
    
    let paginationHTML = '';
    
    // Previous button
    paginationHTML += `
      <button class="pagination-btn" ${this.currentPage === 1 ? 'disabled' : ''} onclick="amazonCouponsExtension.goToPage(${this.currentPage - 1})">
        Previous
      </button>
    `;
    
    // Page numbers
    const startPage = Math.max(1, this.currentPage - 2);
    const endPage = Math.min(this.totalPages, this.currentPage + 2);
    
    if (startPage > 1) {
      paginationHTML += `<button class="pagination-btn" onclick="amazonCouponsExtension.goToPage(1)">1</button>`;
      if (startPage > 2) {
        paginationHTML += `<span class="pagination-dots">...</span>`;
      }
    }
    
    for (let i = startPage; i <= endPage; i++) {
      paginationHTML += `
        <button class="pagination-btn ${i === this.currentPage ? 'active' : ''}" onclick="amazonCouponsExtension.goToPage(${i})">
          ${i}
        </button>
      `;
    }
    
    if (endPage < this.totalPages) {
      if (endPage < this.totalPages - 1) {
        paginationHTML += `<span class="pagination-dots">...</span>`;
      }
      paginationHTML += `<button class="pagination-btn" onclick="amazonCouponsExtension.goToPage(${this.totalPages})">${this.totalPages}</button>`;
    }
    
    // Next button
    paginationHTML += `
      <button class="pagination-btn" ${this.currentPage === this.totalPages ? 'disabled' : ''} onclick="amazonCouponsExtension.goToPage(${this.currentPage + 1})">
        Next
      </button>
    `;
    
    // Page info
    paginationHTML += `
      <div class="pagination-info">
        Page ${this.currentPage} of ${this.totalPages} (${this.totalCoupons} total coupons)
      </div>
    `;
    
    paginationContainer.innerHTML = paginationHTML;
  }

  async goToPage(page) {
    if (page < 1 || page > this.totalPages) return;
    
    this.currentPage = page;
    await this.fetchCoupons();
    this.populateCoupons();
  }

  async applyCoupon(couponCode, buttonElement) {
    try {
      // Show loading state
      const originalText = buttonElement.textContent;
      buttonElement.textContent = 'Applying...';
      buttonElement.disabled = true;

      // Step 1: Copy coupon code to clipboard
      await this.copyToClipboard(couponCode, buttonElement);
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
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  toggleCouponModal() {
    const modal = document.getElementById('amazon-coupons-modal');
    if (modal) {
      this.isVisible = !this.isVisible;
      modal.style.display = this.isVisible ? 'block' : 'none';
      
      if (this.isVisible) {
        // Refresh data when modal is opened
        this.refreshCoupons();
      }
    }
  }

  async refreshCoupons() {
    const refreshBtn = document.getElementById('refreshCoupons');
    const container = document.getElementById('couponsContainer');
    
    if (refreshBtn) {
      refreshBtn.textContent = '🔄 Refreshing...';
      refreshBtn.disabled = true;
    }
    
    if (container) {
      container.innerHTML = '<div class="loading">Loading coupons...</div>';
    }
    
    try {
      // Fetch fresh data
      await this.fetchCategories();
      await this.fetchCompanies();
      await this.fetchCoupons();
      
      // Update UI
      this.populateFilters();
      this.populateCoupons();
      
    } catch (error) {
      console.error('Error refreshing coupons:', error);
      if (container) {
        container.innerHTML = '<div class="error">Failed to load coupons. Please try again.</div>';
      }
    } finally {
      if (refreshBtn) {
        refreshBtn.textContent = '🔄 Refresh';
        refreshBtn.disabled = false;
      }
    }
  }

  // Utility method to clear all filters
  clearFilters() {
    this.selectedCategories = [];
    this.selectedCompanies = [];
    this.currentPage = 1;
    
    // Clear checkboxes
    const categoryCheckboxes = document.querySelectorAll('#categoryFilterOptions input[type="checkbox"]');
    categoryCheckboxes.forEach(cb => cb.checked = false);
    
    const companyCheckboxes = document.querySelectorAll('#companyFilterOptions input[type="checkbox"]');
    companyCheckboxes.forEach(cb => cb.checked = false);
    
    // Clear input values
    const categoryInput = document.getElementById('categoryFilterInput');
    const companyInput = document.getElementById('companyFilterInput');
    
    if (categoryInput) {
      categoryInput.value = '';
      categoryInput.placeholder = 'Select categories...';
    }
    
    if (companyInput) {
      companyInput.value = '';
      companyInput.placeholder = 'Select companies...';
    }
    
    this.refreshCoupons();
  }

  // Method to search coupons by keyword
  async searchCoupons(keyword) {
    this.currentPage = 1;
    
    let url = `${this.baseApiUrl}/coupons?page=${this.currentPage},${this.couponsPerPage}&order=id,desc&filter=country,eq,US`;
    
    if (keyword) {
      url += `&filter[]=name,cs,${encodeURIComponent(keyword)}`;
      url += `&filter[]=desc,cs,${encodeURIComponent(keyword)}`;
    }
    
    // Add existing filters
    if (this.selectedCategories.length > 0) {
      this.selectedCategories.forEach(category => {
        url += `&filter[]=category,eq,${encodeURIComponent(category)}`;
      });
    }
    
    if (this.selectedCompanies.length > 0) {
      this.selectedCompanies.forEach(company => {
        url += `&filter[]=company,eq,${encodeURIComponent(company)}`;
      });
    }
    
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      
      this.coupons = data.records || [];
      this.totalCoupons = data.results || 0;
      this.totalPages = Math.ceil(this.totalCoupons / this.couponsPerPage);
      
      this.populateCoupons();
      
    } catch (error) {
      console.error('Error searching coupons:', error);
      this.coupons = [];
      this.totalCoupons = 0;
      this.totalPages = 0;
      this.populateCoupons();
    }
  }
}

// Initialize the extension
const amazonCouponsExtension = new AmazonCouponsExtension();

// Make the extension globally accessible for pagination
window.amazonCouponsExtension = amazonCouponsExtension;

