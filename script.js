

// Αρχικοποίηση λίστας ιδεών & μετατροπή (migration) παλιών ιδεών σε Objects
let rawIdeas = JSON.parse(localStorage.getItem('myIdeas')) || [];
let savedIdeas = rawIdeas.map(idea => {
    // Αν είναι παλιά ιδέα (απλό κείμενο), τη μετατρέπουμε στη νέα μορφή με active: true
    if (typeof idea === 'string') {
        return { text: idea, active: true };
    }
    return idea;
});

function saveToStorage() {
    localStorage.setItem('myIdeas', JSON.stringify(savedIdeas));
}

// --- ΣΕΛΙΔΑ: add-idea.html ---
const addBtn = document.getElementById('addBtn');
const ideaInput = document.getElementById('ideaInput');

if (addBtn && ideaInput) {
    addBtn.addEventListener('click', () => {
        const newIdea = ideaInput.value.trim();
        if (newIdea !== "") {
            savedIdeas.push({ text: newIdea, active: true });
            saveToStorage();
            alert("Η ιδέα '" + newIdea + "' μπήκε στο βάζο!");
            ideaInput.value = "";
        } else {
            alert("Γράψε κάτι πρώτα!");
        }
    });
}

// --- ΣΕΛΙΔΑ: jar-view.html ---
const jarList = document.getElementById('jarList');

function displayIdeas() {
    if (!jarList) return;
    jarList.innerHTML = ""; 

    if (savedIdeas.length === 0) {
        jarList.innerHTML = "<p style='text-align:center; color:#999; margin-top:20px; font-size: 16px;'>Το βάζο είναι άδειο!</p>";
    } else {
        savedIdeas.forEach((idea, index) => {
            const item = document.createElement('div');
            item.className = 'idea-item';
            
            // Οπτική αλλαγή αν δεν είναι ενεργό
            const textStyle = !idea.active ? 'text-decoration: line-through; opacity: 0.5;' : '';

            item.innerHTML = `
                <input type="checkbox" ${idea.active ? 'checked' : ''} onchange="toggleIdea(${index})">
                <span class="idea-text" style="${textStyle}">${idea.text}</span>
                <span class="delete-btn" onclick="deleteIdea(${index})">×</span>
            `;
            jarList.appendChild(item);
        });
    }
}

window.toggleIdea = function(index) {
    savedIdeas[index].active = !savedIdeas[index].active;
    saveToStorage();
    displayIdeas();
};

window.deleteIdea = function(index) {
    if (confirm("Θέλεις σίγουρα να διαγράψεις αυτή την ιδέα;")) {
        savedIdeas.splice(index, 1);
        saveToStorage();
        displayIdeas();
    }
};

if (jarList) displayIdeas();

// --- ΣΕΛΙΔΑ: random-draw.html ---
let currentIdeaIndex = -1;

window.drawIdea = function() {
    // Παίρνουμε μόνο τις ιδέες που είναι τσεκαρισμένες (active: true)
    const availableIdeas = savedIdeas.filter(idea => idea.active);

    if (availableIdeas.length === 0) {
        alert("Δεν υπάρχουν ενεργές ιδέες στο βάζο! Πρόσθεσε ή ενεργοποίησε μερικές.");
        window.location.href = 'add-idea.html';
        return;
    }

    const jar = document.getElementById('fullJar');
    const cloud = document.getElementById('cloudContainer');
    const ideaText = document.getElementById('selectedIdea');
    const actionBtn = document.getElementById('actionButtons');
    const resultBtns = document.getElementById('resultButtons');

    // Reset του UI (για να δουλεύει σωστά το "ΔΙΑΛΕΞΕ ΞΑΝΑ")
    cloud.classList.remove('cloud-active');
    resultBtns.style.display = 'none';
    actionBtn.style.display = 'none';
    jar.classList.add('shaking');
    
    setTimeout(() => {
        // Stop shaking
        jar.classList.remove('shaking');

        // Επιλογή νέας ιδέας
        const randomIndex = Math.floor(Math.random() * availableIdeas.length);
        const choice = availableIdeas[randomIndex];
        
        // Βρίσκουμε το πραγματικό index (στο γενικό array) για να ξέρουμε ποια να διαγράψουμε αν πατήσει "ΤΟ ΕΚΑΝΑ"
        currentIdeaIndex = savedIdeas.findIndex(i => i.text === choice.text);
        
        ideaText.innerText = choice.text;

        setTimeout(() => {
            cloud.classList.add('cloud-active');
            resultBtns.style.display = 'flex';
            resultBtns.style.flexDirection = 'column';
        }, 300);

    }, 1200); // 1.2s shaking time
};

window.doneIdea = function() {
    if (currentIdeaIndex > -1) {
        savedIdeas.splice(currentIdeaIndex, 1);
        saveToStorage();
        alert("Μπράβο! Η ιδέα ολοκληρώθηκε και αφαιρέθηκε από το βάζο.");
        window.location.href = 'jar-view.html';
    }
};
