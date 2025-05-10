const { exec } = require('child_process');

exec('mongosh', (error, stdout, stderr) => {
  if (error) {
    console.error(`Error launching mongosh: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`mongosh stderr: ${stderr}`);
    return;
  }
  console.log(`mongosh stdout: ${stdout}`);
});
