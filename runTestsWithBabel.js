const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const backupFilePath = path.join(__dirname, 'babel.config.js.backup');
const activeFilePath = path.join(__dirname, 'babel.config.js');

function renameFile(oldPath, newPath) {
  return new Promise((resolve, reject) => {
    fs.rename(oldPath, newPath, (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
}

async function runTests() {
  try {
    // Rename babel to babel.config.js
    console.log(`Renaming ${backupFilePath} to ${activeFilePath}`);
    await renameFile(backupFilePath, activeFilePath);

    // Run tests
    console.log('Running tests...');
    await new Promise((resolve, reject) => {
      const testProcess = exec('jest --color', (error, stdout, stderr) => {
        console.log(stdout);
        console.error(stderr);
        if (error) return reject(error);
        resolve();
      });

      // Handle process termination (Ctrl+C, etc.)
      process.on('SIGINT', () => {
        console.log('Process interrupted. Reverting file...');
        testProcess.kill('SIGINT');
      });
    });
  } catch (error) {
    console.error('Error:', error);
  } finally {
    // Revert babel.config.js to babel
    console.log(`Reverting ${activeFilePath} to ${backupFilePath}`);
    try {
      await renameFile(activeFilePath, backupFilePath);
      console.log('File reverted successfully.');
    } catch (err) {
      console.error('Error reverting file:', err);
    }
  }
}

// Run the script
runTests();
