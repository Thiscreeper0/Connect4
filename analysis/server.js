const express= require('express');
const { exec } = require('child_process');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors'); // Add CORS middleware

const app = express();
const PORT = 3000;

app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.json()); // Use bodyParser.json() for parsing application/json

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/solve', (req, res) => {
  const position = req.body.position;
  const width = req.body.width;
  const height = req.body.height;
  const command = `c4solver -a -w ${width} -h ${height}`;

  const solverProcess = exec(command, { cwd: 'C:\\Users\\kjive\\OneDrive\\Desktop\\Ny_Mappe\\Connect 4\\AI\\connect4' });
  solverProcess.stdin.write(`${position}\n`);
  solverProcess.stdin.end();

  let output = '';
  solverProcess.stdout.on('data', (data) => {
    output += data;
  });

  solverProcess.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });

  solverProcess.on('close', (code) => {
    if (code !== 0) {
      return res.status(500).send(`Solver process exited with code ${code}`);
    }
    res.send(output); // Send the plain text output as the response
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
