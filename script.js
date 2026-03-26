

let savedIdeas = JSON.parse(localStorage.getItem('myIdeas')) || [];

window.drawIdea = function() {
    if (savedIdeas.length === 0) {
        alert("Το βάζο είναι άδειο!");
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

        const randomIndex = Math.floor(Math.random() * savedIdeas.length);
        ideaText.innerText = savedIdeas[randomIndex];

        setTimeout(() => {
            cloud.classList.add('cloud-active');
            resultBtns.style.display = 'flex'; // Το CSS (flex-direction: column) αναλαμβάνει τα υπόλοιπα
        }, 300);

    }, 1200);
};

window.doneIdea = function() {
    alert("Μπράβο!");
    window.location.href = 'jar-view.html';
};
