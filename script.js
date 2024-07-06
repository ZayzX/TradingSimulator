let balance = 1000;
let portfolio = 0;
const companies = [
    {name: "Entreprise 1", basePrice: 10},
    {name: "Entreprise 2", basePrice: 20},
    {name: "Entreprise 3", basePrice: 30},
    {name: "Entreprise 4", basePrice: 40},
    {name: "Entreprise 5", basePrice: 50},
    {name: "Entreprise 6", basePrice: 60},
    {name: "Entreprise 7", basePrice: 70},
    {name: "Entreprise 8", basePrice: 80},
    {name: "Entreprise 9", basePrice: 90},
    {name: "Entreprise 10", basePrice: 100},
    {name: "Entreprise 11", basePrice: 200},
    {name: "Entreprise 12", basePrice: 300},
    {name: "Entreprise 13", basePrice: 400},
    {name: "Entreprise 14", basePrice: 500},
    {name: "Entreprise 15", basePrice: 600},
    {name: "Entreprise 16", basePrice: 700},
    {name: "Entreprise 17", basePrice: 800},
    {name: "Entreprise 18", basePrice: 900},
    {name: "Entreprise 19", basePrice: 1000}
];
let selectedCompany = 0;
let stockPrice = companies[selectedCompany].basePrice;
let priceHistory = [stockPrice];

function selectCompany() {
    selectedCompany = parseInt(document.getElementById('company').value);
    stockPrice = companies[selectedCompany].basePrice;
    priceHistory = [stockPrice];
    updateDisplay();
}

function updateDisplay() {
    document.getElementById('balance').textContent = `Balance: $${balance.toFixed(2)}`;
    document.getElementById('stock-price').textContent = `Prix de l'action: $${stockPrice}`;
    document.getElementById('portfolio').textContent = `Portfolio: ${portfolio} actions`;
    updateChart();
}

function buyStock() {
    const quantity = parseInt(document.getElementById('quantity').value);
    if (isNaN(quantity) || quantity <= 0) {
        showMessage("Veuillez entrer une quantité valide.");
        return;
    }
    const cost = quantity * stockPrice;
    if (balance >= cost) {
        balance -= cost;
        portfolio += quantity;
        adjustStockPrice(quantity, "buy");
        showMessage(`Vous avez acheté ${quantity} actions.`);
        saveGame();
    } else {
        showMessage("Solde insuffisant pour acheter.");
    }
    updateDisplay();
}

function sellStock() {
    const quantity = parseInt(document.getElementById('quantity').value);
    if (isNaN(quantity) || quantity <= 0) {
        showMessage("Veuillez entrer une quantité valide.");
        return;
    }
    if (portfolio >= quantity) {
        const revenue = quantity * stockPrice;
        balance += revenue;
        portfolio -= quantity;
        adjustStockPrice(quantity, "sell");
        showMessage(`Vous avez vendu ${quantity} actions.`);
        saveGame();
    } else {
        showMessage("Portefeuille insuffisant pour vendre.");
    }
    updateDisplay();
}

function adjustStockPrice(quantity, action) {
    if (action === "buy") {
        stockPrice += quantity * (stockPrice * 0.01); // Augmenter le prix de 1% par action achetée
    } else if (action === "sell") {
        stockPrice -= quantity * (stockPrice * 0.01); // Diminuer le prix de 1% par action vendue
    }
    if (stockPrice < 1) {
        stockPrice = 1; // Empêcher le prix de tomber en dessous de 1
    }
    stockPrice = parseFloat(stockPrice.toFixed(2));
    priceHistory.push(stockPrice);
    if (priceHistory.length > 20) {
        priceHistory.shift();
    }
}

function showMessage(message) {
    document.getElementById('message').textContent = message;
}

// Initialiser le graphique
const ctx = document.getElementById('priceChart').getContext('2d');
const priceChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: Array(priceHistory.length).fill(''),
        datasets: [{
            label: 'Prix de l\'action',
            data: priceHistory,
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 2,
            fill: false
        }]
    },
    options: {
        scales: {
            x: {
                display: false
            },
            y: {
                beginAtZero: false
            }
        }
    }
});

function updateChart() {
    priceChart.data.labels.push('');
    priceChart.data.datasets[0].data.push(stockPrice);
    if (priceChart.data.datasets[0].data.length > 20) {
        priceChart.data.labels.shift();
        priceChart.data.datasets[0].data.shift();
    }
    priceChart.update();
}

function saveGame() {
    const gameData = {
        balance: balance,
        portfolio: portfolio,
        priceHistory: priceHistory,
        selectedCompany: selectedCompany,
        stockPrice: stockPrice
    };
    localStorage.setItem('tradingGame', JSON.stringify(gameData));
}

function loadGame() {
    const savedGame = localStorage.getItem('tradingGame');
    if (savedGame) {
        const gameData = JSON.parse(savedGame);
        balance = parseFloat(gameData.balance);
        portfolio = gameData.portfolio;
        priceHistory = gameData.priceHistory;
        selectedCompany = gameData.selectedCompany;
        stockPrice = parseFloat(gameData.stockPrice);
        document.getElementById('company').value = selectedCompany;
    } else {
        resetGame();
    }
}

function resetGame() {
    balance = 1000;
    portfolio = 0;
    selectedCompany = 0;
    stockPrice = companies[selectedCompany].basePrice;
    priceHistory = [stockPrice];
}

// Mise à jour du prix de l'action toutes les 5 secondes
setInterval(() => {
    const randomChange = (Math.random() - 0.5) * 2; // fluctuation aléatoire entre -1 et 1
    stockPrice = (parseFloat(stockPrice) + randomChange).toFixed(2);
    if (stockPrice < 1) stockPrice = 1;
    priceHistory.push(stockPrice);
    if (priceHistory.length > 20) {
        priceHistory.shift();
    }
    saveGame();
    updateDisplay();
}, 5000);

loadGame();
updateDisplay();

// Récupérer les éléments
var modal = document.getElementById("myModal");
var btn = document.getElementById("openModalBtn");
var span = document.getElementsByClassName("close")[0];
var clearStorageBtn = document.getElementById("clearStorageBtn");

// Ouvrir la fenêtre modale lorsque l'utilisateur clique sur le bouton
btn.onclick = function() {
    modal.style.display = "block";
}

// Fermer la fenêtre modale lorsque l'utilisateur clique sur <span> (x)
span.onclick = function() {
    modal.style.display = "none";
}

// Fermer la fenêtre modale lorsque l'utilisateur clique en dehors de la fenêtre modale
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

// Supprimer les fichiers locaux lorsque l'utilisateur clique sur le bouton "Supprimer les fichiers locaux"
clearStorageBtn.onclick = function() {
    // Supprimer localStorage
    localStorage.clear();

    // Supprimer sessionStorage
    sessionStorage.clear();

    // Supprimer les cookies
    var cookies = document.cookie.split(";");
    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        var eqPos = cookie.indexOf("=");
        var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }

    // Fermer la fenêtre modale
    modal.style.display = "none";

    // Optionnel: afficher un message de confirmation
    alert("Les fichiers locaux ont été supprimés.");
}
