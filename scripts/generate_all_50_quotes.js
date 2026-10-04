// Generator script to produce 50 quotes per category in modular files
const fs = require('fs');
const path = require('path');

const quotesDir = path.join(__dirname, '../src/data/quotes');
if (!fs.existsSync(quotesDir)) {
  fs.mkdirSync(quotesDir, { recursive: true });
}

console.log("Quotes directory ready:", quotesDir);
