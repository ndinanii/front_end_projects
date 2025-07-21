document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const teamNameInput = document.getElementById('teamNameInput');
    const addTeamBtn = document.getElementById('addTeamBtn');
    const teamListUL = document.getElementById('teamList');
    const generateFixturesBtn = document.getElementById('generateFixturesBtn');
    const resetAllBtn = document.getElementById('resetAllBtn');
    const fixturesContainer = document.getElementById('fixturesContainer');
    const messageArea = document.getElementById('messageArea');

    // Application State
    let teams = [];

    // --- Event Listeners ---
    addTeamBtn.addEventListener('click', handleAddTeam);
    teamNameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleAddTeam();
        }
    });
    generateFixturesBtn.addEventListener('click', handleGenerateFixtures);
    resetAllBtn.addEventListener('click', resetApplication);
    teamListUL.addEventListener('click', handleRemoveTeam); // Event delegation for remove buttons

    // --- Team Management Functions ---
    function handleAddTeam() {
        const teamName = teamNameInput.value.trim();
        if (teamName === '') {
            showMessage("Please enter a team name.", "error");
            return;
        }
        if (teams.includes(teamName)) {
            showMessage(`Team "${teamName}" has already been added.`, "error");
            teamNameInput.value = ''; // Clear input
            return;
        }
        teams.push(teamName);
        renderTeamList();
        teamNameInput.value = ''; // Clear input
        teamNameInput.focus();
        updateGenerateButtonState();
        showMessage(`Team "${teamName}" added.`, "success");
    }

    function handleRemoveTeam(event) {
        if (event.target.classList.contains('remove-team-btn')) {
            const teamNameToRemove = event.target.dataset.team;
            teams = teams.filter(team => team !== teamNameToRemove);
            renderTeamList();
            updateGenerateButtonState();
            showMessage(`Team "${teamNameToRemove}" removed.`, "info");
            if (teams.length < 2) {
                clearFixturesDisplay(); // Clear fixtures if not enough teams
            }
        }
    }

    function renderTeamList() {
        teamListUL.innerHTML = ''; // Clear existing list
        teams.forEach(team => {
            const li = document.createElement('li');
            li.textContent = team;
            const removeBtn = document.createElement('button');
            removeBtn.textContent = 'Remove';
            removeBtn.classList.add('remove-team-btn');
            removeBtn.dataset.team = team; // Store team name in data attribute
            li.appendChild(removeBtn);
            teamListUL.appendChild(li);
        });
    }

    function updateGenerateButtonState() {
        generateFixturesBtn.disabled = teams.length < 2;
    }

    // --- Fixture Generation & Display ---
    function handleGenerateFixtures() {
        if (teams.length < 2) {
            showMessage("Please add at least two teams to generate fixtures.", "error");
            return;
        }

        showMessage("Generating fixtures...", "loading");
        clearFixturesDisplay(false); // Clear previous fixtures but don't hide container immediately for loading text

        // Simulate a slight delay for loading message visibility if generation is very fast
        setTimeout(() => {
            const fixtures = generateFixturesAlgorithm(teams);
            displayFixtures(fixtures);
            if (fixtures.length > 0) {
                showMessage("Fixtures generated successfully!", "success");
            } else {
                 showMessage("Could not generate fixtures. Check team list.", "info"); // Should not happen if teams.length >= 2
            }
        }, 200); // Short delay
    }

// script.js
// ... (all other functions and event listeners from the previous update remain the same)

function generateFixturesAlgorithm(teamListInput) {
    let localTeams = [...teamListInput]; // Use a copy for manipulation
    const fixtures = [];
    let matchdayNr = 0;
    // const originalNumTeams = localTeams.length; // Kept for reference, not strictly needed for current logic

    let isOddNumberOfTeams = localTeams.length % 2 !== 0;
    if (isOddNumberOfTeams) {
        localTeams.push("BYE"); // Add a BYE team for the algorithm
    }

    const numAlgorithmTeams = localTeams.length;
    const numRounds = numAlgorithmTeams - 1; // Rounds for a single robin (defines matchdays per leg)

    // --- Generate fixtures for the first leg ---
    for (let round = 0; round < numRounds; round++) {
        matchdayNr++; // <<< MATCHDAY INCREMENTS ONCE PER ROUND
        for (let i = 0; i < numAlgorithmTeams / 2; i++) {
            const homeTeam = localTeams[i];
            const awayTeam = localTeams[numAlgorithmTeams - 1 - i];

            if (homeTeam === "BYE") {
                fixtures.push({
                    fixture: `${awayTeam} vs BYE`,
                    leg: 1,
                    matchday: matchdayNr
                });
            } else if (awayTeam === "BYE") {
                 fixtures.push({
                    fixture: `${homeTeam} vs BYE`,
                    leg: 1,
                    matchday: matchdayNr
                });
            } else {
                 fixtures.push({
                    fixture: `${homeTeam} vs ${awayTeam}`,
                    leg: 1,
                    matchday: matchdayNr
                });
            }
        }
        // Rotate teams for the next round, keeping the first team fixed
        const lastTeam = localTeams.pop();
        localTeams.splice(1, 0, lastTeam);
    }

    // --- Generate fixtures for the second leg (reverse home/away) ---
    // Reset localTeams to original state (plus BYE if needed) before leg 2 rotation
    // This ensures the pairings are consistent with a standard round-robin before flipping home/away
    localTeams = [...teamListInput];
    if (isOddNumberOfTeams) {
        localTeams.push("BYE");
    }
    // We need to re-apply the initial rotations to get the correct pairings for each round of the second leg,
    // then flip home/away. The `matchdayNr` continues.

    // To ensure the second leg has the same structural pairings per round as the first leg (just with home/away flipped),
    // we re-run the rotation.
    // The matchday numbers will continue sequentially.

    for (let round = 0; round < numRounds; round++) {
        matchdayNr++; // <<< MATCHDAY INCREMENTS ONCE PER ROUND FOR LEG 2
        for (let i = 0; i < numAlgorithmTeams / 2; i++) {
            // The teams are already in the correct pairing for this round due to the rotation
            const team1 = localTeams[i];
            const team2 = localTeams[numAlgorithmTeams - 1 - i];

            if (team1 === "BYE") {
                fixtures.push({
                    fixture: `${team2} vs BYE`,
                    leg: 2,
                    matchday: matchdayNr
                });
            } else if (team2 === "BYE") {
                 fixtures.push({
                    fixture: `${team1} vs BYE`,
                    leg: 2,
                    matchday: matchdayNr
                });
            } else {
                 fixtures.push({
                    fixture: `${team2} vs ${team1}`, // Swapped for leg 2
                    leg: 2,
                    matchday: matchdayNr
                });
            }
        }
        // Rotate teams for the next round of the second leg
        const lastTeam = localTeams.pop();
        localTeams.splice(1, 0, lastTeam);
    }
    return fixtures;
}

    function displayFixtures(fixtures) {
        if (fixtures.length === 0 && teams.length < 2) {
            fixturesContainer.innerHTML = ''; // Clear if no fixtures
            fixturesContainer.classList.remove('visible');
            return;
        }
        if (fixtures.length === 0 && teams.length >=2) {
            fixturesContainer.innerHTML = '<p>No fixtures to display currently.</p>'; // Should be handled by showMessage
            fixturesContainer.classList.add('visible');
            return;
        }


        let tableHTML = `
            <table>
                <thead>
                    <tr>
                        <th>Fixture</th>
                        <th>Leg</th>
                        <th>Matchday Nr</th>
                    </tr>
                </thead>
                <tbody>
        `;

        fixtures.forEach(fixture => {
            tableHTML += `
                <tr>
                    <td>${fixture.fixture}</td>
                    <td>${fixture.leg}</td>
                    <td>${fixture.matchday}</td>
                </tr>
            `;
        });

        tableHTML += `
                </tbody>
            </table>
        `;

        fixturesContainer.innerHTML = tableHTML;
        // Ensure animation class is applied
        requestAnimationFrame(() => {
            fixturesContainer.classList.add('visible');
        });
    }

    function clearFixturesDisplay(hideContainer = true) {
        fixturesContainer.innerHTML = '';
        if (hideContainer) {
            fixturesContainer.classList.remove('visible');
        }
    }

    // --- Utility Functions ---
    function showMessage(message, type = "info") { // type can be "info", "success", "error", "loading"
        messageArea.textContent = message;
        messageArea.className = 'message-area'; // Reset classes
        messageArea.classList.add(type); // Add type for potential specific styling

        // Clear message after some time for non-loading messages
        if (type !== "loading") {
            setTimeout(() => {
                if (messageArea.textContent === message) { // Only clear if it's still the same message
                    messageArea.textContent = '';
                    messageArea.className = 'message-area';
                }
            }, 4000);
        }
    }

    function resetApplication() {
        teams = [];
        renderTeamList();
        updateGenerateButtonState();
        clearFixturesDisplay();
        teamNameInput.value = '';
        showMessage("Application reset.", "info");
        teamNameInput.focus();
    }

    // Initial state setup
    updateGenerateButtonState();
});