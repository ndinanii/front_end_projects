document.addEventListener('DOMContentLoaded', () => {
            const numberInput = document.getElementById('number');
            const convertBtn = document.getElementById('convert-btn');
            const outputDiv = document.getElementById('output');
            
            // Function to convert number to Roman numeral
            function convertToRoman(num) {
                if (isNaN(num) || num === '') {
                    return 'Please enter a valid number';
                }
                
                num = parseInt(num);
                
                if (num < 1) {
                    return 'Please enter a number greater than or equal to 1';
                }
                
                if (num >= 4000) {
                    return 'Please enter a number less than or equal to 3999';
                }
                
                // Roman numeral conversion logic
                const romanNumerals = [
                    { value: 1000, numeral: 'M' },
                    { value: 900, numeral: 'CM' },
                    { value: 500, numeral: 'D' },
                    { value: 400, numeral: 'CD' },
                    { value: 100, numeral: 'C' },
                    { value: 90, numeral: 'XC' },
                    { value: 50, numeral: 'L' },
                    { value: 40, numeral: 'XL' },
                    { value: 10, numeral: 'X' },
                    { value: 9, numeral: 'IX' },
                    { value: 5, numeral: 'V' },
                    { value: 4, numeral: 'IV' },
                    { value: 1, numeral: 'I' }
                ];
                
                let result = '';
                let remaining = num;
                
                for (const { value, numeral } of romanNumerals) {
                    while (remaining >= value) {
                        result += numeral;
                        remaining -= value;
                    }
                }
                
                return result;
            }
            
            // Function to display result
            function displayResult() {
                const inputValue = numberInput.value.trim();
                
                if (inputValue === '') {
                    outputDiv.textContent = 'Please enter a valid number';
                    outputDiv.classList.add('show');
                    return;
                }
                
                const num = parseInt(inputValue);
                let result = '';
                
                if (isNaN(num)) {
                    result = 'Please enter a valid number';
                } else if (num < 1) {
                    result = 'Please enter a number greater than or equal to 1';
                } else if (num >= 4000) {
                    result = 'Please enter a number less than or equal to 3999';
                } else {
                    result = convertToRoman(num);
                }
                
                outputDiv.textContent = result;
                outputDiv.classList.add('show');
                
                // Scroll to output smoothly
                outputDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            
            // Event listeners
            convertBtn.addEventListener('click', displayResult);
            
            numberInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    displayResult();
                }
            });
            
            // Example click handlers
            document.querySelectorAll('.example-item').forEach(item => {
                item.addEventListener('click', () => {
                    const value = item.getAttribute('data-value');
                    numberInput.value = value;
                    displayResult();
                });
            });
        });