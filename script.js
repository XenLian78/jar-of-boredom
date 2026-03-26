
let savedIdeas = JSON.parse(localStorage.getItem('myIdeas')) || [];

// --- ΕΜΦΑΝΙΣΗ ΙΔΕΩΝ (jar-view.html) ---
const jarList = document.getElementById('jarList');
function displayIdeas() {
    if (!jarList) return;
    jarList.innerHTML = ""; 

    if (savedIdeas.length === 0) {
        jarList.innerHTML = `
            <div class="empty-msg">
                <p><b>Το βάζο σου πεινάει για ιδέες!</b></p>
                <p style="font-size:14px; margin-top:10px;">Πάτα το κουμπί για να προσθέσεις την πρώτη.</p>
            </div>`;
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
    if(confirm("Διαγραφή ιδέας;")) {
        savedIdeas.splice(index, 1);
        localStorage.setItem('myIdeas', JSON.stringify(savedIdeas));
        displayIdeas();
    }
};

if (jarList) displayIdeas();

// --- ΠΡΟΣΘΗΚΗ ΙΔΕΑΣ (add-idea.html) ---
const addBtn = document.getElementById('addBtn');
const ideaInput = document.getElementById('ideaInput');
if (addBtn) {
    addBtn.addEventListener('click', () => {
        const text = ideaInput.value.trim();
        if (text) {
            savedIdeas.push(text);
            localStorage.setItem('myIdeas', JSON.stringify(savedIdeas));
            alert("Η ιδέα μπήκε στο βάζο!");
            ideaInput.value = "";
        }
    });
}

// --- ΚΛΗΡΩΣΗ (random-draw.html) ---
window.drawIdea = function() {
    if (savedIdeas.length === 0) {
        alert("Το βάζο είναι άδειο!");
        return;
    }

    const jar = document.querySelector('.jar-wrapper');
    const lid = document.getElementById('jarLid');
    const cloud = document.getElementById('cloudContainer');
    const ideaText = document.getElementById('selectedIdea');
    const actionBtn = document.getElementById('actionButtons');
    const resultBtns = document.getElementById('resultButtons');

    jar.classList.add('animate-jump');
    
    setTimeout(() => {
        jar.classList.remove('animate-jump');
        lid.classList.add('animate-lid');

        const randomIndex = Math.floor(Math.random() * savedIdeas.length);
        ideaText.innerText = savedIdeas[randomIndex];

        setTimeout(() => {
            cloud.classList.add('animate-pop');
            actionBtn.style.display = 'none';
            resultBtns.style.display = 'flex';
        }, 400);
    }, 1100);
};
