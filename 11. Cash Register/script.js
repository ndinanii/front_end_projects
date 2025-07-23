// Initial values - using let so they can be reassigned for testing
        let price = 19.5;
        let cid = [
            ["PENNY", 1.01],
            ["NICKEL", 2.05],
            ["DIME", 3.1],
            ["QUARTER", 4.25],
            ["ONE", 90],
            ["FIVE", 55],
            ["TEN", 20],
            ["TWENTY", 60],
            ["ONE HUNDRED", 100]
        ];

        // Currency values in cents to avoid floating point issues
        const currencyValues = {
            "PENNY": 1,
            "NICKEL": 5,
            "DIME": 10,
            "QUARTER": 25,
            "ONE": 100,
            "FIVE": 500,
            "TEN": 1000,
            "TWENTY": 2000,
            "ONE HUNDRED": 10000
        };

        // Currency order from highest to lowest
        const currencyOrder = [
            "ONE HUNDRED", "TWENTY", "TEN", "FIVE", "ONE", 
            "QUARTER", "DIME", "NICKEL", "PENNY"
        ];

        // DOM elements
        const cashInput = document.getElementById('cash');
        const purchaseBtn = document.getElementById('purchase-btn');
        const changeDueElement = document.getElementById('change-due');
        const priceDisplay = document.getElementById('price-display');
        const drawerDisplay = document.getElementById('drawer-display');

        // Initialize display
        updateDisplay();

        // Event listeners
        purchaseBtn.addEventListener('click', handlePurchase);
        cashInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handlePurchase();
        });

        function updateDisplay() {
            priceDisplay.textContent = price.toFixed(2);
            updateDrawerDisplay();
        }

        function updateDrawerDisplay() {
            drawerDisplay.innerHTML = '';
            cid.forEach(([currency, amount]) => {
                const div = document.createElement('div');
                div.className = 'drawer-item';
                div.innerHTML = `<strong>${currency}</strong><br>$${amount.toFixed(2)}`;
                drawerDisplay.appendChild(div);
            });
        }

        function handlePurchase() {
            const cash = parseFloat(cashInput.value);
            
            // Reset styling
            changeDueElement.className = '';
            
            // Validate input
            if (isNaN(cash) || cash < 0) {
                updateChangeDisplay('Please enter a valid amount', 'error');
                return;
            }

            // Check if customer has enough money
            if (cash < price) {
                alert('Customer does not have enough money to purchase the item');
                return;
            }

            // Check if exact change
            if (cash === price) {
                updateChangeDisplay('No change due - customer paid with exact cash', 'success');
                return;
            }

            // Calculate change
            const changeAmount = Math.round((cash - price) * 100) / 100;
            const result = calculateChange(changeAmount);
            
            if (result.status === 'INSUFFICIENT_FUNDS') {
                updateChangeDisplay('Status: INSUFFICIENT_FUNDS', 'error');
            } else if (result.status === 'CLOSED') {
                const changeStr = result.change.map(([currency, amount]) => 
                    `${currency}: $${amount.toFixed(2)}`).join(' ');
                updateChangeDisplay(`Status: CLOSED ${changeStr}`, 'warning');
            } else {
                const changeStr = result.change.map(([currency, amount]) => 
                    `${currency}: $${amount.toFixed(2)}`).join(' ');
                updateChangeDisplay(`Status: OPEN ${changeStr}`, 'success');
            }
        }

        function calculateChange(changeAmount) {
            let changeCents = Math.round(changeAmount * 100);
            let totalCashInDrawer = 0;
            let changeArray = [];
            
            // Calculate total cash in drawer
            cid.forEach(([currency, amount]) => {
                totalCashInDrawer += Math.round(amount * 100);
            });

            // Check if drawer has exact change amount
            if (totalCashInDrawer === changeCents) {
                // Return all money in drawer in proper order
                const nonZeroChange = cid.filter(([currency, amount]) => amount > 0)
                                       .sort((a, b) => currencyValues[b[0]] - currencyValues[a[0]]);
                return { status: 'CLOSED', change: nonZeroChange };
            }

            // Check if drawer has enough money
            if (totalCashInDrawer < changeCents) {
                return { status: 'INSUFFICIENT_FUNDS', change: [] };
            }

            // Create a copy of cid for manipulation (convert to cents)
            let drawerCopy = {};
            cid.forEach(([currency, amount]) => {
                drawerCopy[currency] = Math.round(amount * 100);
            });

            // Try to make change starting from highest denomination
            for (let currency of currencyOrder) {
                const coinValue = currencyValues[currency];
                const availableCoins = Math.floor(drawerCopy[currency] / coinValue);
                const coinsNeeded = Math.floor(changeCents / coinValue);
                const coinsToUse = Math.min(availableCoins, coinsNeeded);

                if (coinsToUse > 0) {
                    const amountUsed = coinsToUse * coinValue;
                    changeArray.push([currency, amountUsed / 100]);
                    changeCents -= amountUsed;
                    drawerCopy[currency] -= amountUsed;
                }
            }

            // Check if we could make exact change
            if (changeCents > 0) {
                return { status: 'INSUFFICIENT_FUNDS', change: [] };
            }

            return { status: 'OPEN', change: changeArray };
        }

        function updateChangeDisplay(message, type = '') {
            changeDueElement.textContent = message;
            if (type) {
                changeDueElement.classList.add(type);
            }
        }

        // Allow testing with different values
        window.setTestValues = function(newPrice, newCid) {
            price = newPrice;
            cid = newCid;
            updateDisplay();
        };