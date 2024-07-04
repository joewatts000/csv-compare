const express = require('express');
const cors = require('cors');
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
const upload = multer({ dest: 'uploads/' });

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
    return results;
  } catch (error) {
    console.error('Error comparing arrays:', error);
  }
}

// Endpoint to handle file uploads and comparison
app.post('/compare', upload.fields([{ name: 'file1' }, { name: 'file2' }]), async (req, res) => {
  try {
    const file1Path = req.files.file1[0].path;
    const file2Path = req.files.file2[0].path;

    const data1 = await readCSV(file1Path);
    const data2 = await readCSV(file2Path);

    fs.unlinkSync(file1Path); // Clean up the uploaded files
    fs.unlinkSync(file2Path);

    const results = await compareArrays(data1, data2);

    console.log(results);

    return res.json({ message: `sucess`, results });

  } catch (error) {
    res.status(500).json({ error: 'Error reading or comparing CSV files', details: error.message });
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});