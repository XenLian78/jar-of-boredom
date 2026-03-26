

// Δεδομένα
let savedIdeas = JSON.parse(localStorage.getItem('myIdeas')) || [];

// ΠΡΟΣΘΗΚΗ ΙΔΕΑΣ
const addBtn = document.getElementById('addBtn');
const ideaInput = document.getElementById('ideaInput');
if (addBtn) {
    addBtn.onclick = function() {
        const text = ideaInput.value.trim();
        if (text) {
            savedIdeas.push({ text: text, checked: true });
            localStorage.setItem('myIdeas', JSON.stringify(savedIdeas));
            ideaInput.value = "";
            alert("Η ιδέα μπήκε στο βάζο!");
        } else {
            alert("Γράψε μια ιδέα!");
        }
    };
}

// ΛΙΣΤΑ ΙΔΕΩΝ (jar-view.html)
const jarList = document.getElementById('jarList');
if (jarList) {
    renderList();
}

function renderList() {
    jarList.innerHTML = "";
    savedIdeas.forEach((idea, index) => {
        const item = document.createElement('div');
        item.style = "display:flex; align-items:center; background:#f8f9fa; padding:10px; margin-bottom:8px; border-radius:12px; width:100%;";
        const ideaText = typeof idea === 'string' ? idea : idea.text;
        const isChecked = typeof idea === 'string' ? true : idea.checked;
        
        item.innerHTML = `
            <input type="checkbox" ${isChecked ? 'checked' : ''} onchange="toggleCheck(${index})" style="width:18px; height:18px;">
            <span style="flex-grow:1; margin-left:10px;">${ideaText}</span>
            <span onclick="deleteIdea(${index})" style="color:red; cursor:pointer; font-weight:bold; font-size:18px;">×</span>
        `;
        jarList.appendChild(item);
    });
}

window.toggleCheck = function(i) {
    if(typeof savedIdeas[i] === 'string') savedIdeas[i] = {text: savedIdeas[i], checked: false};
    else savedIdeas[i].checked = !savedIdeas[i].checked;
    localStorage.setItem('myIdeas', JSON.stringify(savedIdeas));
};

window.deleteIdea = function(i) {
    savedIdeas.splice(i, 1);
    localStorage.setItem('myIdeas', JSON.stringify(savedIdeas));
    renderList();
};

// ΚΛΗΡΩΣΗ (random-draw.html)
let currentIdx = -1;
window.drawIdea = function() {
    const active = savedIdeas.filter(i => (typeof i === 'string') || i.checked);
    if (active.length === 0) return alert("Το βάζο είναι άδειο!");

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
        const picked = active[Math.floor(Math.random() * active.length)];
        currentIdx = savedIdeas.indexOf(picked);
        ideaText.innerText = typeof picked === 'string' ? picked : picked.text;
        cloud.classList.add('cloud-active');
        resultBtns.style.display = 'flex';
    }, 1200);
};

window.drawAgain = function() {
    document.getElementById('cloudContainer').classList.remove('cloud-active');
    drawIdea();
};

window.doneIdea = function() {
    if(currentIdx > -1) {
        savedIdeas.splice(currentIdx, 1);
        localStorage.setItem('myIdeas', JSON.stringify(savedIdeas));
        window.location.href = 'jar-view.html';
    }
};
