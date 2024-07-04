const fs = require('fs');
const csv = require('csv-parser');

// Function to read CSV file and return an array of string arrays
function readCSV(filePath) {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => results.push(Object.values(data)))
        .on('end', () => resolve(results))
      .on('error', (error) => reject(error));
  });
}

// Function to compare CSV files
async function compareCSVFiles(filePath1, filePath2) {
  try {
    const data1 = await readCSV(filePath1);
    const data2 = await readCSV(filePath2);
    return compareArrays(data1, data2);
  } catch (error) {
    console.error('Error reading or comparing CSV files:', error);
  }
}

async function compareArrays(array1, array2) {
  try {
    const sorted1 = array1.flat();
    const sorted2 = array2.flat();
    const longest = sorted1.length > sorted2.length ? sorted1 : sorted2;
    const shortest = sorted1.length > sorted2.length ? sorted2 : sorted1;

    const results = [];

    for (let i = 0; i < longest.length; i++) {
      if (shortest.includes(longest[i])) {;
        results.push(longest[i]);
      }
    }
    console.log(results);
    return results;
  } catch (error) {
    console.error('Error comparing arrays:', error);
  }
}

// Example usage
const filePath1 = './a.csv';
const filePath2 = './b.csv';

compareCSVFiles(filePath1, filePath2);

module.exports = {
  readCSV,
  compareCSVFiles,
  compareArrays,
};
