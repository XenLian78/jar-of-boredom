

/* --- 1. ΔΙΑΧΕΙΡΙΣΗ ΔΕΔΟΜΕΝΩΝ (LOCAL STORAGE) --- */

// Συνάρτηση που παίρνει τις ιδέες από την αποθήκη του browser
function getIdeas() {
    const savedIdeas = localStorage.getItem('boredomJarIdeas');
    return savedIdeas ? JSON.parse(savedIdeas) : [];
}

// Συνάρτηση που σώζει τις ιδέες στην αποθήκη του browser
function saveIdeas(ideas) {
    localStorage.setItem('boredomJarIdeas', JSON.stringify(ideas));
}

/* --- 2. ΛΕΙΤΟΥΡΓΙΕΣ ΣΕΛΙΔΑΣ (ADD IDEA) --- */
const addBtn = document.getElementById('addBtn');
const ideaInput = document.getElementById('ideaInput');

if (addBtn) {
    addBtn.addEventListener('click', () => {
        const text = ideaInput.value.trim();
        if (text) {
            const ideas = getIdeas();
            ideas.push({ text: text, completed: false });
            saveIdeas(ideas);
            ideaInput.value = '';
            alert('Η ιδέα μπήκε στο βάζο!');
        }
    });
}

/* --- 3. ΛΕΙΤΟΥΡΓΙΕΣ ΣΕΛΙΔΑΣ (JAR VIEW) --- */
const jarList = document.getElementById('jarList');

function renderJar() {
    if (!jarList) return;
    const ideas = getIdeas();
    jarList.innerHTML = '';

    ideas.forEach((idea, index) => {
        const div = document.createElement('div');
        div.className = 'idea-item';
        div.innerHTML = `
            <input type="checkbox" ${idea.completed ? 'checked' : ''} onchange="toggleIdea(${index})">
            <span class="idea-text" style="${idea.completed ? 'text-decoration: line-through; opacity: 0.6;' : ''}">${idea.text}</span>
            <span class="delete-btn" onclick="deleteIdea(${index})">×</span>
        `;
        jarList.appendChild(div);
    });
}

window.toggleIdea = function(index) {
    const ideas = getIdeas();
    ideas[index].completed = !ideas[index].completed;
    saveIdeas(ideas);
    renderJar();
};

window.deleteIdea = function(index) {
    const ideas = getIdeas();
    ideas.splice(index, 1);
    saveIdeas(ideas);
    renderJar();
};

// Αρχικό φόρτωμα αν είμαστε στη σελίδα του βάζου
if (jarList) {
    renderJar();
}

/* --- 4. ΛΕΙΤΟΥΡΓΙΕΣ ΣΕΛΙΔΑΣ (RANDOM DRAW) --- */
window.drawIdea = function() {
    const ideas = getIdeas().filter(i => !i.completed); // Μόνο όσες δεν έχουν γίνει
    if (ideas.length === 0) {
        alert('Το βάζο είναι άδειο ή όλες οι ιδέες έχουν ολοκληρωθεί!');
        return;
    }

    const jarElement = document.getElementById('fullJar');
    const cloud = document.getElementById('cloudContainer');
    const textElem = document.getElementById('selectedIdea');
    const actionButtons = document.getElementById('actionButtons');
    const resultButtons = document.getElementById('resultButtons');

    // Εφέ κουνήματος
    jarElement.classList.add('shaking');
    cloud.classList.remove('cloud-active');

    setTimeout(() => {
        jarElement.classList.remove('shaking');
        const randomIndex = Math.floor(Math.random() * ideas.length);
        const chosen = ideas[randomIndex];

        textElem.innerText = chosen.text;
        cloud.classList.add('cloud-active');
        
        // Αλλαγή κουμπιών
        actionButtons.style.display = 'none';
        resultButtons.style.display = 'flex';
        
        // Αποθηκεύουμε προσωρινά ποια ιδέα επιλέχθηκε για το "Done"
        window.currentIdeaText = chosen.text;
    }, 1200);
};

window.doneIdea = function() {
    const ideas = getIdeas();
    const index = ideas.findIndex(i => i.text === window.currentIdeaText);
    if (index !== -1) {
        ideas[index].completed = true;
        saveIdeas(ideas);
        alert('Μπράβο! Η ιδέα σημειώθηκε ως ολοκληρωμένη.');
        window.location.href = 'jar-view.html';
    }
};
