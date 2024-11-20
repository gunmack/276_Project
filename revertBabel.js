const fs = require('fs');
const path = require('path');

// Specify the old and new file paths
const oldFilePath = path.join(__dirname, 'babel.config.js'); // Replace with your old file path
const newFilePath = path.join(__dirname, 'babel.config.js.backup'); // Replace with your desired new file path

// Rename the file
fs.rename(oldFilePath, newFilePath, (err) => {
  if (err) {
    console.error('Error renaming file:', err);
    process.exit(1); // Exit with error code
  } else {
    console.log(`Renamed ${oldFilePath} to ${newFilePath}`);
  }
});
