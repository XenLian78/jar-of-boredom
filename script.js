

let savedIdeas = JSON.parse(localStorage.getItem('myIdeas')) || [];
let currentIdeaIndex = -1;

window.drawIdea = function() {
    // Φιλτράρουμε για να παίρνουμε μόνο τις επιλεγμένες ιδέες (με τικ)
    let activeIdeas = savedIdeas.filter(idea => {
        return typeof idea === 'string' || idea.checked !== false;
    });

    if (activeIdeas.length === 0) {
        alert("Το βάζο είναι άδειο ή δεν έχεις επιλεγμένες ιδέες!");
        return;
    }

    const jar = document.getElementById('fullJar');
    const cloud = document.getElementById('cloudContainer');
    const ideaText = document.getElementById('selectedIdea');
    const actionBtn = document.getElementById('actionButtons');
    const resultBtns = document.getElementById('resultButtons');

    // Ξεκινάει το κούνημα
    jar.classList.add('shaking');
    actionBtn.style.display = 'none'; 
    resultBtns.style.display = 'none'; // Κρύβουμε τα κουμπιά αν είναι από "Διαλεξε Ξανά"
    
    setTimeout(() => {
        jar.classList.remove('shaking');

        const randomIndex = Math.floor(Math.random() * activeIdeas.length);
        const choice = activeIdeas[randomIndex];
        
        // Αποθήκευση του index για το "Το Έκανα"
        currentIdeaIndex = savedIdeas.indexOf(choice);
        
        ideaText.innerText = typeof choice === 'string' ? choice : choice.text;

        setTimeout(() => {
            cloud.classList.add('cloud-active');
            resultBtns.style.display = 'flex';
            resultBtns.style.flexDirection = 'column';
        }, 300);

    }, 1200);
};

// Νέα συνάρτηση για άμεση νέα ιδέα
window.drawAgain = function() {
    const cloud = document.getElementById('cloudContainer');
    const resultBtns = document.getElementById('resultButtons');
    
    // Κρύβουμε το σύννεφο και τα κουμπιά στιγμιαία για να ξαναρχίσει το animation
    cloud.classList.remove('cloud-active');
    resultBtns.style.display = 'none';
    
    // Καλούμε την drawIdea μετά από ένα ελάχιστο delay
    setTimeout(() => {
        drawIdea();
    }, 100);
};

window.doneIdea = function() {
    if (currentIdeaIndex > -1) {
        // Αφαιρούμε την ιδέα από τη γενική λίστα
        savedIdeas.splice(currentIdeaIndex, 1);
        localStorage.setItem('myIdeas', JSON.stringify(savedIdeas));
        alert("Μπράβο! Η ιδέα αφαιρέθηκε από το βάζο.");
        window.location.href = 'jar-view.html';
    }
};
