#!/usr/bin/env node

const { createCommand } = require('commander');
const program = createCommand();
const cliProgress = require('cli-progress');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
require('dotenv').config();
const defaultport = process.env.PORT ; 
program
  .version('1.0.0')
  .description('\x1b[32mCLI for core\x1b[37m');

//FIRE UP THE SERVER
program
  .command('runn baby')
  .action(async () => {
    exec('node index.js');
    console.log('\x1b[32mhello Saurabh , server is running\x1b[32m');
});

//GET SIZE 
program
  .command('size')
  .action(async () => {
    try {
      const response = await fetch('http://localhost:'+defaultport+'/size');
      if (response.ok) {
        const data = await response.json();
        console.log('Total Size:', data.totalSize, 'MB'); // Assuming the response contains a 'totalSize' property
      } else {
        console.error('Failed to fetch data:', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error.message);
    }
  });


//DATABASE CONNECTION TESTING
program
  .command('test db')
  .action(async () => {
    const bar1 = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
    bar1.start(100, 0);
    exec('node graphql.js');
    for (let i = 0; i <= 100; i++) {
      bar1.update(i);
    }
    bar1.stop();
  });
  
program.parse(process.argv);