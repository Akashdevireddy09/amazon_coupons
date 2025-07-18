 document.addEventListener('DOMContentLoaded', async function() {
            const API_URL = 'https://amazonspot.net/apps/PhpCRUDApi/apiCoupons.php/records/coupons?page=1,10&order=id,desc&filter=country,eq,US';

            // Load coupon count
            async function loadCouponCount() {
                try {
                    const response = await fetch(API_URL);
                    const data = await response.json();
                    const total = data.results || (data.records ? data.records.length : 0);
                     document.getElementById('couponCount').textContent = total;

                } catch (error) {
                    console.error('Error loading coupon count:', error);
                    document.getElementById('couponCount').textContent = 'Error';
                }
            }
            
            // Open coupons modal
            document.getElementById('openCoupons').addEventListener('click', async function() {
                try {
                    const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
                    if (tab.url.includes('amazon.')) {
                        chrome.tabs.sendMessage(tab.id, {action: 'openCoupons'});
                        window.close();
                    } else {
                        alert('Please navigate to Amazon website first!');
                    }
                } catch (error) {
                    console.error('Error opening coupons:', error);
                }
            });
            
            // Refresh data
            document.getElementById('refreshData').addEventListener('click', function() {
                this.textContent = 'Refreshing...';
                this.disabled = true;
                
                loadCouponCount().then(() => {
                    this.textContent = 'Refresh';
                    this.disabled = false;
                });
            });
            
            // Initial load
            loadCouponCount();
        });