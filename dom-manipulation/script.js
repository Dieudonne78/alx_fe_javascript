const quotes = JSON.parse(localStorage.getItem('quotes')) || [
  { text: "Change the world by being yourself.", category: "Inspiration" },
  { text: "He who conquers himself is the mightiest warrior.", category: "Motivation" },
  { text: "Keep calm and carry on.", category: "Life" }
];

const quoteDisplay = document.getElementById('quoteDisplay');
const categoryFilter = document.getElementById('categoryFilter');


function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

function displayQuotes(filteredQuotes) {
  quoteDisplay.innerHTML = '';
  filteredQuotes.forEach(function({ text, category }) {
    quoteDisplay.innerHTML += `<p>${text}</p><p><em>Category: ${category}</em></p>`;
  });
}

function showRandomQuote() {
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
  displayQuotes([randomQuote]);
  sessionStorage.setItem('lastViewedQuote', JSON.stringify(randomQuote));
}

async function addQuote() {
  const text = document.getElementById('newQuoteText').value;
  const category = document.getElementById('newQuoteCategory').value;
  if (text && category) {
    const newQuote = { text: text, category: category };
    quotes.push(newQuote);
    saveQuotes();
    populateCategoryDropdown();
    filterQuotes();
    document.getElementById('newQuoteText').value = '';
    document.getElementById('newQuoteCategory').value = '';
    alert('Quote added successfully!');
    
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newQuote)
      });
      const result = await response.json();
      console.log('Quote posted to server:', result);
    } catch (error) {
      console.error('Error posting to server:', error);
    }
  } else {
    alert('Please enter both quote text and category.');
  }
}

function populateCategoryDropdown() {
  const categories = ['all'].concat(Array.from(new Set(quotes.map(function(q) { return q.category; }))));
  categoryFilter.innerHTML = categories.map(function(cat) { return `<option value="${cat}">${cat}</option>`; }).join('');
}

function filterQuotes() {
  const selectedCategory = categoryFilter.value;
  const filteredQuotes = selectedCategory === 'all' ? quotes : quotes.filter(function(q) { return q.category === selectedCategory; });
  displayQuotes(filteredQuotes);
  localStorage.setItem('selectedCategory', selectedCategory);
}

function exportToJsonFile() {
  const dataBlob = new Blob([JSON.stringify(quotes)], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const downloadLink = document.createElement('a');
  downloadLink.href = url;
  downloadLink.download = 'quotes.json';
  downloadLink.click();
  URL.revokeObjectURL(url);
}

function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(event) {
    const importedQuotes = JSON.parse(event.target.result);
    quotes.push.apply(quotes, importedQuotes);
    saveQuotes();
    populateCategoryDropdown();
    filterQuotes();
    alert('Quotes imported successfully!');
  };
  fileReader.readAsText(event.target.files[0]);
}

function loadLastViewedQuote() {
  const lastViewedQuote = sessionStorage.getItem('lastViewedQuote');
  if (lastViewedQuote) displayQuotes([JSON.parse(lastViewedQuote)]);
}

async function fetchQuotesFromServer() {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts');
    const serverQuotes = await response.json();
    
    serverQuotes.forEach(function(serverQuote) {
      if (!quotes.find(function(localQuote) { return localQuote.text === serverQuote.title; })) {
        quotes.push({ text: serverQuote.title, category: 'Server' });
      }
    });
    
    saveQuotes();
    filterQuotes();
    alert('Quotes synced with server!');
  } catch (error) {
    console.error('Error syncing with server:', error);
  }
}

async function syncQuotes() {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts');
    const serverQuotes = await response.json();
    
    const newQuotes = serverQuotes.filter(function(serverQuote) {
      return !quotes.find(function(localQuote) { return localQuote.text === serverQuote.title; });
    });
    quotes.push.apply(quotes, newQuotes.map(function(quote) { return { text: quote.title, category: 'Server' }; }));
    
    saveQuotes();
    filterQuotes();
    alert('Quotes synced and conflicts resolved!');
  } catch (error) {
    console.error('Error syncing with server:', error);
  }
}

document.getElementById('newQuote').addEventListener('click', showRandomQuote);
document.getElementById('addQuoteButton').addEventListener('click', addQuote);
document.getElementById('exportQuotes').addEventListener('click', exportToJsonFile);
document.getElementById('importFile').addEventListener('change', importFromJsonFile);

populateCategoryDropdown();
loadLastViewedQuote() || filterQuotes();

setInterval(syncQuotes, 60000);
