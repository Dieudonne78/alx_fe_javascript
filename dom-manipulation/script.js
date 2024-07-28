
const quotes = [
  { text: "Self-doubt kills talent.", category: "Motivation" },
  { text: " Action eliminates doubt. ", category: "Action" },
  { text: "Well done is better than well said. ", category: "Wisdom" }
];


function showRandomQuote() {
  const quoteDisplay = document.getElementById('quoteDisplay');
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  quoteDisplay.innerHTML = `"${quote.text}" - ${quote.category}`;
}


document.getElementById('newQuote').addEventListener('click', showRandomQuote);


function addQuote() {
  const newQuoteText = document.getElementById('createAddQuoteForm').value;
  const newQuoteCategory = document.getElementById('newQuoteCategory').value;

  if (createAddQuoteForm && newQuoteCategory) {
    quotes.push({ text: newQuoteText, category: newQuoteCategory });
    document.getElementById('createAddQuoteForm').value = '';
    document.getElementById('newQuoteCategory').value = '';
    alert('New quote added successfully!');
  } else {
    alert('Please enter both a quote and a category.');
  }
}

document.getElementById('addQuoteButton').addEventListener('click', addQuote);
