// DOM element references
        const userInput = document.getElementById('user-input');
        const checkBtn = document.getElementById('check-btn');
        const clearBtn = document.getElementById('clear-btn');
        const resultsDiv = document.getElementById('results-div');
        const alertModal = document.getElementById('alert-modal');
        const alertMessage = document.getElementById('alert-message');
        const alertCloseBtn = document.getElementById('alert-close-btn');

        /**
         * Regular expression to validate various US phone number formats.
         * Breakdown:
         * ^               - Start of the string.
         * (1\s?)?         - Optional '1' followed by an optional space (for the country code).
         * (\(\d{3}\)|\d{3}) - Area code, either in parentheses like (555) or just 3 digits like 555.
         * [\s\-]?         - An optional separator, which can be a space or a hyphen.
         * \d{3}           - The next 3 digits of the phone number.
         * [\s\-]?         - Another optional separator (space or hyphen).
         * \d{4}           - The final 4 digits of the phone number.
         * $               - End of the string.
         */
        const phoneRegex = /^(1\s?)?(\(\d{3}\)|\d{3})[\s\-]?\d{3}[\s\-]?\d{4}$/;

        // Function to show the custom alert modal
        const showAlert = (message) => {
            alertMessage.textContent = message;
            alertModal.classList.remove('hidden');
        };

        // Function to hide the custom alert modal
        const hideAlert = () => {
            alertModal.classList.add('hidden');
        };

        // Event listener for the "Check" button
        checkBtn.addEventListener('click', () => {
            const phoneNumber = userInput.value.trim();

            // USER STORY: When the input is empty, show an alert.
            // This is handled here by showing a custom modal dialog instead of the native browser alert.
            if (phoneNumber === '') {
                alert('Please provide a phone number');
                return;
            }

            // Test the input against the regular expression
            const isValid = phoneRegex.test(phoneNumber);

            // Display the result
            if (isValid) {
                resultsDiv.textContent = `Valid US number: ${phoneNumber}`;
                resultsDiv.style.color = '#22d3ee'; // A bright cyan color for valid
                resultsDiv.style.backgroundColor = 'rgba(34, 211, 238, 0.1)';
            } else {
                resultsDiv.textContent = `Invalid US number: ${phoneNumber}`;
                resultsDiv.style.color = '#fb7185'; // A soft red color for invalid
                resultsDiv.style.backgroundColor = 'rgba(251, 113, 133, 0.1)';
            }
        });

        // Event listener for the "Clear" button
        clearBtn.addEventListener('click', () => {
            resultsDiv.textContent = '';
            resultsDiv.style.backgroundColor = 'transparent';
            userInput.value = '';
        });
        
        // Event listener for the Enter key in the input field
        userInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                checkBtn.click();
            }
        });

        // Event listener to close the modal
        alertCloseBtn.addEventListener('click', hideAlert);