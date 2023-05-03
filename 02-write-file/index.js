const fs = require ('fs');
const path = require('path');
const { stdout } = process;
const readline = require('readline');

const fileName = 'your-text.txt';
const filePath = path.join(__dirname, fileName);

const readLine = readline.createInterface({ input: process.stdin,
  output: process.stdout});

const greeting = 'Hi user!\n';
const bye = 'Goodbye user! Have a nice day!';

fs.writeFile(filePath, '', (error) => {
  if (error) return console.error(error.message);
});

stdout.write(greeting);
stdout.write('Write down your text and I will save it.\n');

readLine.on('line', (text) => {
  if (text.trim() === 'exit') {
    console.log(bye);
    process.exit(0);
  } else {
    fs.appendFile(filePath, text + '\n', (error) => {
      if (error) console.log(error.message);
    });
  }
});
readLine.on('SIGINT', () => {
  console.log(bye);
  process.exit(0);
});
