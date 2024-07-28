
const quotes = [
  { text: "Self-doubt kills talent.", category: "Motivation" },
  { text: " Action eliminates doubt. ", category: "Action" },
  { text: "Well done is better than well said. ", category: "Wisdom" }
];

// Here is the function to display a random quote
function showRandomQuote() {
  const quoteDisplay = document.getElementById('quoteDisplay');
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];
  quoteDisplay.innerHTML = '';
  
  const quoteText = document.createElement('p');
  quoteText.textContent = randomQuote.text;
  
  const quoteCategory = document.createElement('p');
  quoteCategory.innerHTML = `<em>Category: ${randomQuote.category}</em>`;
  
  quoteDisplay.appendChild(quoteText);
  quoteDisplay.appendChild(quoteCategory);
}

// Below is the function to add a new quote
function addQuote() {
  const createAddQuoteForm = document.getElementById('createAddQuoteForm').value;
  const newQuoteCategory = document.getElementById('newQuoteCategory').value;

  if (createAddQuoteForm && newQuoteCategory) {
    const newQuote = { text: createAddQuoteForm, category: newQuoteCategory };
    quotes.push(newQuote);
    document.getElementById('createAddQuoteForm').value = '';
    document.getElementById('newQuoteCategory').value = '';
    alert('Quote added successfully!');
    
    // To update the DOM with the new quote
    const quoteDisplay = document.getElementById('quoteDisplay');
    quoteDisplay.innerHTML = '';  // To clear previous quote
    
    const quoteText = document.createElement('p');
    quoteText.textContent = newQuote.text;
    
    const quoteCategory = document.createElement('p');
    quoteCategory.innerHTML = `<em>Category: ${newQuote.category}</em>`;
    
    quoteDisplay.appendChild(quoteText);
    quoteDisplay.appendChild(quoteCategory);
  } else {
    alert('Please enter both quote text and category.');
  }
}

// Below are the event listeners
document.getElementById('newQuote').addEventListener('click', showRandomQuote);
document.getElementById('addQuoteButton').addEventListener('click', addQuote);

// Here is the initial display of a random quote
showRandomQuote();