
const quotes = JSON.parse(localStorage.getItem('quotes')) || [
  { text: "The greatest glory in living lies not in never falling, but in rising every time we fall.", category: "Inspiration" },
  { text: "The way to get started is to quit talking and begin doing.", category: "Motivation" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" }
];

const quoteDisplay = document.getElementById('quoteDisplay');
const categoryFilter = document.getElementById('categoryFilter');

// Save quotes to local storage
const saveQuotes = () => localStorage.setItem('quotes', JSON.stringify(quotes));

// Display quotes
const displayQuotes = (filteredQuotes) => {
  quoteDisplay.innerHTML = '';
  filteredQuotes.forEach(({ text, category }) => {
    quoteDisplay.innerHTML += `<p>${text}</p><p><em>Category: ${category}</em></p>`;
  });
};

// Show random quote
const showRandomQuote = () => {
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
  displayQuotes([randomQuote]);
  sessionStorage.setItem('lastViewedQuote', JSON.stringify(randomQuote));
};

// Add new quote
const addQuote = () => {
  const text = document.getElementById('newQuoteText').value;
  const category = document.getElementById('newQuoteCategory').value;
  if (text && category) {
    quotes.push({ text, category });
    saveQuotes();
    populateCategoryDropdown();
    filterQuotes();
    document.getElementById('newQuoteText').value = '';
    document.getElementById('newQuoteCategory').value = '';
    alert('Quote added successfully!');
  } else {
    alert('Please enter both quote text and category.');
  }
};

// Populate category dropdown
const populateCategoryDropdown = () => {
  const categories = ['all', ...new Set(quotes.map(q => q.category))];
  categoryFilter.innerHTML = categories.map(cat => `<option value="${cat}">${cat}</option>`).join('');
};

// Filter quotes based on selected category
const filterQuotes = () => {
  const selectedCategory = categoryFilter.value;
  const filteredQuotes = selectedCategory === 'all' ? quotes : quotes.filter(q => q.category === selectedCategory);
  displayQuotes(filteredQuotes);
  localStorage.setItem('selectedCategory', selectedCategory);
};

// Export quotes to JSON file
const exportToJsonFile = () => {
  const dataBlob = new Blob([JSON.stringify(quotes)], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const downloadLink = document.createElement('a');
  downloadLink.href = url;
  downloadLink.download = 'quotes.json';
  downloadLink.click();
  URL.revokeObjectURL(url);
};

// Import quotes from JSON file
const importFromJsonFile = (event) => {
  const fileReader = new FileReader();
  fileReader.onload = (event) => {
    const importedQuotes = JSON.parse(event.target.result);
    quotes.push(...importedQuotes);
    saveQuotes();
    populateCategoryDropdown();
    filterQuotes();
    alert('Quotes imported successfully!');
  };
  fileReader.readAsText(event.target.files[0]);
};

// Load last viewed quote from session storage
const loadLastViewedQuote = () => {
  const lastViewedQuote = sessionStorage.getItem('lastViewedQuote');
  if (lastViewedQuote) displayQuotes([JSON.parse(lastViewedQuote)]);
};

// Sync with server
const syncWithServer = async () => {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts');
    const serverQuotes = await response.json();
    
    // Assuming serverQuotes has a similar structure to local quotes
    serverQuotes.forEach(serverQuote => {
      if (!quotes.find(localQuote => localQuote.text === serverQuote.title)) {
        quotes.push({ text: serverQuote.title, category: 'Server' });
      }
    });
    
    saveQuotes();
    filterQuotes();
    alert('Quotes synced with server!');
  } catch (error) {
    console.error('Error syncing with server:', error);
  }
};

// Event listeners
document.getElementById('newQuote').addEventListener('click', showRandomQuote);
document.getElementById('addQuoteButton').addEventListener('click', addQuote);
document.getElementById('exportQuotes').addEventListener('click', exportToJsonFile);
document.getElementById('importFile').addEventListener('change', importFromJsonFile);

// Initialize dropdown and display quotes
populateCategoryDropdown();
loadLastViewedQuote() || filterQuotes();

// Periodic sync with server
setInterval(syncWithServer, 60000); // Sync every 60 seconds
