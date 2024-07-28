
const quotes = [
  { text: "Self-doubt kills talent.", category: "Motivation" },
  { text: " Action eliminates doubt. ", category: "Action" },
  { text: "Well done is better than well said. ", category: "Wisdom" }
];

function showRandomQuote() {
  const quoteDisplay = document.getElementById('quoteDisplay');
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];
  quoteDisplay.innerHTML = `<p>${randomQuote.text}</p><p><em>Category: ${randomQuote.category}</em></p>`;
}

function addQuote() {
  const createAddQuoteForm = document.getElementById('createAddQuoteForm').value;
  const newQuoteCategory = document.getElementById('newQuoteCategory').value;

  if (createAddQuoteForm && newQuoteCategory) {
    const newQuote = { text: createAddQuoteForm, category: newQuoteCategory };
    quotes.push(newQuote);
    document.getElementById('createAddQuoteForm').value = '';
    document.getElementById('newQuoteCategory').value = '';
    alert('Quote added successfully!');
  } else {
    alert('Please enter both quote text and category.');
  }
}

document.getElementById('newQuote').addEventListener('click', showRandomQuote);
document.getElementById('addQuoteButton').addEventListener('click', addQuote);

showRandomQuote();
