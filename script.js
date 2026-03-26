

// Φόρτωση ιδεών
let savedIdeas = JSON.parse(localStorage.getItem('myIdeas')) || [];

// --- ΛΕΙΤΟΥΡΓΙΑ ΠΡΟΣΘΗΚΗΣ (add-idea.html) ---
const addBtn = document.getElementById('addBtn');
const ideaInput = document.getElementById('ideaInput');

if (addBtn) {
    addBtn.onclick = function() {
        const text = ideaInput.value.trim();
        if (text) {
            // Αποθηκεύουμε ως αντικείμενο για να δουλεύει το checkbox
            savedIdeas.push({ text: text, checked: true });
            localStorage.setItem('myIdeas', JSON.stringify(savedIdeas));
            ideaInput.value = "";
            alert("Η ιδέα προστέθηκε!");
        }
    };
}

// --- ΛΕΙΤΟΥΡΓΙΑ ΛΙΣΤΑΣ (jar-view.html) ---
const jarList = document.getElementById('jarList');
if (jarList) {
    renderList();
}

function renderList() {
    jarList.innerHTML = "";
    savedIdeas.forEach((idea, index) => {
        const div = document.createElement('div');
        div.className = "idea-item";
        // Αν η ιδέα είναι παλιό format (string), τη μετατρέπουμε
        const ideaText = typeof idea === 'string' ? idea : idea.text;
        const isChecked = typeof idea === 'string' ? true : idea.checked;

        div.innerHTML = `
            <input type="checkbox" ${isChecked ? 'checked' : ''} onchange="toggleCheck(${index})">
            <span class="idea-text">${ideaText}</span>
            <span class="delete-btn" onclick="deleteIdea(${index})">×</span>
        `;
        jarList.appendChild(div);
    });
}

window.toggleCheck = function(index) {
    if (typeof savedIdeas[index] === 'string') {
        savedIdeas[index] = { text: savedIdeas[index], checked: false };
    } else {
        savedIdeas[index].checked = !savedIdeas[index].checked;
    }
    localStorage.setItem('myIdeas', JSON.stringify(savedIdeas));
};

window.deleteIdea = function(index) {
    savedIdeas.splice(index, 1);
    localStorage.setItem('myIdeas', JSON.stringify(savedIdeas));
    renderList();
};

// --- ΛΕΙΤΟΥΡΓΙΑ ΚΛΗΡΩΣΗΣ (random-draw.html) ---
let currentDrawIndex = -1;

window.drawIdea = function() {
    const activeIdeas = savedIdeas.filter(i => (typeof i === 'string') || i.checked !== false);
    
    if (activeIdeas.length === 0) {
        alert("Δεν υπάρχουν επιλεγμένες ιδέες στο βάζο!");
        return;
    }

    const jar = document.getElementById('fullJar');
    const cloud = document.getElementById('cloudContainer');
    const ideaText = document.getElementById('selectedIdea');
    const actionBtn = document.getElementById('actionButtons');
    const resultBtns = document.getElementById('resultButtons');

    actionBtn.style.display = 'none';
    resultBtns.style.display = 'none';
    cloud.classList.remove('cloud-active');
    jar.classList.add('shaking');

    setTimeout(() => {
        jar.classList.remove('shaking');
        const randomObj = activeIdeas[Math.floor(Math.random() * activeIdeas.length)];
        currentDrawIndex = savedIdeas.indexOf(randomObj);
        
        ideaText.innerText = typeof randomObj === 'string' ? randomObj : randomObj.text;
        cloud.classList.add('cloud-active');
        resultBtns.style.display = 'flex';
    }, 1200);
};

window.drawAgain = function() {
    document.getElementById('cloudContainer').classList.remove('cloud-active');
    drawIdea(); // Άμεση νέα κλήρωση
};

window.doneIdea = function() {
    if (currentDrawIndex > -1) {
        savedIdeas.splice(currentDrawIndex, 1);
        localStorage.setItem('myIdeas', JSON.stringify(savedIdeas));
        window.location.href = 'jar-view.html';
    }
};
