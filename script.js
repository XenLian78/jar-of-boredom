

// Αρχικοποίηση λίστας ιδεών από το LocalStorage
let savedIdeas = JSON.parse(localStorage.getItem('myIdeas')) || [];

// --- ΣΕΛΙΔΑ: add-idea.html ---
const addBtn = document.getElementById('addBtn');
const ideaInput = document.getElementById('ideaInput');

if (addBtn && ideaInput) {
    addBtn.addEventListener('click', () => {
        const newIdea = ideaInput.value.trim();
        if (newIdea !== "") {
            savedIdeas.push(newIdea);
            localStorage.setItem('myIdeas', JSON.stringify(savedIdeas));
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
            item.innerHTML = `
                <input type="checkbox" checked onchange="this.parentElement.classList.toggle('disabled-idea')">
                <span class="idea-text">${idea}</span>
                <span class="delete-btn" onclick="deleteIdea(${index})">×</span>
            `;
            jarList.appendChild(item);
        });
    }
}

window.deleteIdea = function(index) {
    if (confirm("Θέλεις σίγουρα να διαγράψεις αυτή την ιδέα;")) {
        savedIdeas.splice(index, 1);
        localStorage.setItem('myIdeas', JSON.stringify(savedIdeas));
        displayIdeas();
    }
};

if (jarList) displayIdeas();

// --- ΣΕΛΙΔΑ: random-draw.html ---
let currentIdeaIndex = -1;
let availableIdeas = [...savedIdeas]; 

window.drawIdea = function() {
    if (availableIdeas.length === 0) {
        alert("Το βάζο είναι άδειο! Πρόσθεσε πρώτα μερικές ιδέες.");
        window.location.href = 'add-idea.html';
        return;
    }

    const jar = document.getElementById('fullJar');
    const lid = document.getElementById('jarLid');
    const cloud = document.getElementById('cloudContainer');
    const ideaText = document.getElementById('selectedIdea');
    const actionBtn = document.getElementById('actionButtons');
    const resultBtns = document.getElementById('resultButtons');

    jar.classList.add('shaking');
    actionBtn.style.display = 'none'; 
    
    setTimeout(() => {
        jar.classList.remove('shaking');
        lid.classList.add('lid-off');

        const randomIndex = Math.floor(Math.random() * availableIdeas.length);
        const choice = availableIdeas[randomIndex];
        currentIdeaIndex = savedIdeas.indexOf(choice);
        
        ideaText.innerText = choice;

        setTimeout(() => {
            cloud.classList.add('cloud-active');
            resultBtns.style.display = 'flex';
            resultBtns.style.flexDirection = 'column'; // Εξασφάλιση κάθετης διάταξης
        }, 300);

    }, 1200);
};

window.doneIdea = function() {
    if (currentIdeaIndex > -1) {
        savedIdeas.splice(currentIdeaIndex, 1);
        localStorage.setItem('myIdeas', JSON.stringify(savedIdeas));
        alert("Μπράβο! Η ιδέα ολοκληρώθηκε και αφαιρέθηκε από το βάζο.");
        window.location.href = 'jar-view.html';
    }
};
