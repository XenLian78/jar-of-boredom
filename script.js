

let savedIdeas = JSON.parse(localStorage.getItem('myIdeas')) || [];

// --- HELPER: CUSTOM NOTIFICATION (Αντί για Alert) ---
function showNotify(text) {
    const msg = document.createElement('div');
    msg.style = `
        position: fixed; top: 20px; left: 50%; transform: translateX(-50%);
        background: var(--dark-text); color: white; padding: 12px 25px;
        border-radius: 30px; z-index: 1000; font-size: 14px; box-shadow: 0 10px 20px rgba(0,0,0,0.2);
        animation: popIn 0.3s forwards;
    `;
    msg.innerText = text;
    document.body.appendChild(msg);
    setTimeout(() => { msg.remove(); }, 2500);
}

// --- ΣΕΛΙΔΑ: add-idea.html ---
const addBtn = document.getElementById('addBtn');
const ideaInput = document.getElementById('ideaInput');

if (addBtn && ideaInput) {
    addBtn.addEventListener('click', () => {
        const newIdea = ideaInput.value.trim();
        if (newIdea !== "") {
            savedIdeas.push(newIdea);
            localStorage.setItem('myIdeas', JSON.stringify(savedIdeas));
            showNotify(`Η ιδέα "${newIdea}" προστέθηκε!`);
            ideaInput.value = "";
        } else {
            showNotify("Γράψε κάτι πρώτα!");
        }
    });
}

// --- ΣΕΛΙΔΑ: jar-view.html ---
const jarList = document.getElementById('jarList');
function displayIdeas() {
    if (!jarList) return;
    jarList.innerHTML = ""; 

    if (savedIdeas.length === 0) {
        jarList.innerHTML = `
            <div class="empty-msg">
                <p>Το βάζο σου είναι άδειο!</p>
                <p style="font-size:14px">Πρόσθεσε μερικές ιδέες για να ξεκινήσεις.</p>
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
    savedIdeas.splice(index, 1);
    localStorage.setItem('myIdeas', JSON.stringify(savedIdeas));
    displayIdeas();
    showNotify("Η ιδέα διαγράφηκε.");
};

if (jarList) displayIdeas();

// --- ΣΕΛΙΔΑ: random-draw.html ---
let currentIdeaIndex = -1;
window.drawIdea = function() {
    if (savedIdeas.length === 0) {
        showNotify("Πρόσθεσε πρώτα ιδέες!");
        setTimeout(() => { window.location.href = 'add-idea.html'; }, 1000);
        return;
    }

    const jar = document.querySelector('.jar-wrapper');
    const lid = document.getElementById('jarLid');
    const cloud = document.getElementById('cloudContainer');
    const ideaText = document.getElementById('selectedIdea');
    const actionBtn = document.getElementById('actionButtons');
    const resultBtns = document.getElementById('resultButtons');

    // Start Sequence
    jar.classList.add('animate-shake');
    actionBtn.style.opacity = '0';
    
    setTimeout(() => {
        jar.classList.remove('animate-shake');
        lid.classList.add('animate-lid');

        const randomIndex = Math.floor(Math.random() * savedIdeas.length);
        const choice = savedIdeas[randomIndex];
        currentIdeaIndex = randomIndex;
        ideaText.innerText = choice;

        setTimeout(() => {
            cloud.classList.add('animate-pop');
            actionBtn.style.display = 'none';
            resultBtns.style.display = 'flex';
        }, 400);
    }, 1000);
};

window.doneIdea = function() {
    if (currentIdeaIndex > -1) {
        savedIdeas.splice(currentIdeaIndex, 1);
        localStorage.setItem('myIdeas', JSON.stringify(savedIdeas));
        window.location.href = 'jar-view.html';
    }
};
