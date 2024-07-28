const quotes = JSON.parse(localStorage.getItem('quotes')) || [
  { text: "The greatest glory in living lies not in never falling, but in rising every time we fall.", category: "Inspiration" },
  { text: "The way to get started is to quit talking and begin doing.", category: "Motivation" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" }
];

const quoteDisplay = document.getElementById('quoteDisplay');
const categoryFilter = document.getElementById('categoryFilter');

// Save quotes to local storage
function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Display quotes
function displayQuotes(filteredQuotes) {
  quoteDisplay.innerHTML = '';
  filteredQuotes.forEach(function({ text, category }) {
    quoteDisplay.innerHTML += `<p>${text}</p><p><em>Category: ${category}</em></p>`;
  });
}

// Show random quote
function showRandomQuote() {
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
  displayQuotes([randomQuote]);
  sessionStorage.setItem('lastViewedQuote', JSON.stringify(randomQuote));
}

// Add new quote
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
    
    // Post new quote to server
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

// Populate category dropdown
function populateCategoryDropdown() {
  const categories = ['all'].concat(Array.from(new Set(quotes.map(function(q) { return q.category; }))));
  categoryFilter.innerHTML = categories.map(function(cat) { return `<option value="${cat}">${cat}</option>`; }).join('');
}

// Filter quotes based on selected category
function filterQuotes() {
  const selectedCategory = categoryFilter.value;
  const filteredQuotes = selectedCategory === 'all' ? quotes : quotes.filter(function(q) { return q.category === selectedCategory; });
  displayQuotes(filteredQuotes);
  localStorage.setItem('selectedCategory', selectedCategory);
}

// Export quotes to JSON file
function exportToJsonFile() {
  const dataBlob = new Blob([JSON.stringify(quotes)], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const downloadLink = document.createElement('a');
  downloadLink.href = url;
  downloadLink.download = 'quotes.json';
  downloadLink.click();
  URL.revokeObjectURL(url);
}

// Import quotes from JSON file
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

// Load last viewed quote from session storage
function loadLastViewedQuote() {
  const lastViewedQuote = sessionStorage.getItem('lastViewedQuote');
  if (lastViewedQuote) displayQuotes([JSON.parse(lastViewedQuote)]);
}

// Fetch quotes from server
async function fetchQuotesFromServer() {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts');
    const serverQuotes = await response.json();
    
    // Assuming serverQuotes has a similar structure to local quotes
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

// Sync quotes with server and handle conflicts
async function syncQuotes() {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts');
    const serverQuotes = await response.json();
    
    // Simulate conflict resolution: server data takes precedence
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

// Event listeners
document.getElementById('newQuote').addEventListener('click', showRandomQuote);
document.getElementById('addQuoteButton').addEventListener('click', addQuote);
document.getElementById('exportQuotes').addEventListener('click', exportToJsonFile);
document.getElementById('importFile').addEventListener('change', importFromJsonFile);

// Initialize dropdown and display quotes
populateCategoryDropdown();
loadLastViewedQuote() || filterQuotes();

// Periodic sync with server
setInterval(syncQuotes, 60000); // Sync every 60 seconds
