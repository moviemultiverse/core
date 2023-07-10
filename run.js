const fs = require('fs');
const folders = [];
// Read the command from a file
fs.readFile('command.sh', 'utf8', (err, data) => {
  if (err) {
    console.error(`Error reading command.sh: ${err}`);
    return;
  }
  // Trim any whitespace and newlines from the command
  const command = data.trim();
  // Run the command
  const exec = require('child_process').exec;
  exec(command, (error, stdout) => {
    if (error) {
      console.error(`Error executing command: ${error}`);
      return;
    }
    // Split the output into an array of folder paths
    var folderPaths = stdout.trim().split('\n');

    // Add each folder path to the folders array
    folderPaths.forEach((folderPath) => {
      folderPath = folderPath.replace("./", "");
      folders.push(folderPath);
    });

    // Convert the folders array to a JavaScript code string
    const jsCode = `${folders}`;

    // Save the JavaScript code to a file
    fs.writeFile('output.js', jsCode, (err) => {
      if (err) {
        console.error(`Error writing output.js: ${err}`);
        return;
      }
      console.log('Output.js file saved successfully!');
    });
  });
});
