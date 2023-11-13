#!/usr/bin/env node
const { program } = require('commander');
const cliProgress = require('cli-progress');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

program
  .version('1.0.0')
  .description('My Awesome CLI');

program
  .command('runn baby')
  .action(async () => {
    console.log('hello, Running System');
    exec('npx nodemon index.js');

    // create a new progress bar instance and use shades_classic theme
    const bar1 = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);

    // start the progress bar with a total value of 200 and start value of 0
    bar1.start(100, 0);

    // simulate a task that takes 2 seconds using a for loop
    for (let i = 0; i <= 100; i++) {
      // update the current value in your application
      bar1.update(i);
      // delay for 10 milliseconds to simulate work being done
      await new Promise(resolve => setTimeout(resolve, 10));
    }

    // stop the progress bar
    bar1.stop();

  });

program.parse(process.argv);
