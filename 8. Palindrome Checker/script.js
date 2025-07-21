document.addEventListener('DOMContentLoaded', () => {
            const textInput = document.getElementById('text-input');
            const checkBtn = document.getElementById('check-btn');
            const resultDiv = document.getElementById('result');
            
            // Function to clean the input string
            function cleanInputString(str) {
                return str.replace(/[^A-Za-z0-9]/g, '').toLowerCase();
            }
            
            // Function to check if the input is a palindrome
            function isPalindrome(str) {
                const cleanedStr = cleanInputString(str);
                if (cleanedStr === '') return false;
                
                const reversedStr = cleanedStr.split('').reverse().join('');
                return cleanedStr === reversedStr;
            }
            
            // Function to display result
            function displayResult(input) {
                if (input.trim() === '') {
                    alert('Please input a value');
                    return;
                }
                
                const isPal = isPalindrome(input);
                resultDiv.innerHTML = `
                    <span class="${isPal ? 'palindrome' : 'not-palindrome'}">
                        <strong>${input}</strong> is ${isPal ? '' : 'not '}a palindrome
                    </span>
                `;
                resultDiv.classList.add('show');
                
                // Scroll to result smoothly
                resultDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            
            // Event listeners
            checkBtn.addEventListener('click', () => {
                displayResult(textInput.value);
            });
            
            textInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    displayResult(textInput.value);
                }
            });
            
            // Example click handlers
            document.querySelectorAll('.example-item').forEach(item => {
                item.addEventListener('click', () => {
                    const text = item.textContent.trim();
                    textInput.value = text;
                    displayResult(text);
                });
            });
        });