#!/usr/bin/env node

import select from '@inquirer/select';
import { Separator } from '@inquirer/select';
import fetch from 'node-fetch'; 
import inquirer from 'inquirer';
import { spawn } from 'child_process';
import dotenv from 'dotenv';
dotenv.config();
const defaultport = process.env.PORT ; 
let serverProcess;

const startServer = () => {
  console.log('Starting the server...');
  serverProcess = spawn('node', ['index.js']);

  serverProcess.stdout.on('data', (data) => {
    console.log(`Server output: ${data}`);
  });

  serverProcess.stderr.on('data', (data) => {
    console.error(`Server error: ${data}`);
  });
};

const stopServer = () => {
  console.log('Stopping the server...');
  serverProcess.kill('SIGINT'); // Send SIGINT signal to stop the server
};


const sizeAction = async () => { // Mark function as async
  console.log('Evaluating size...');
  try {
    const response = await fetch(`http://localhost:${defaultport}/size`);
    if (response.ok) {
      const data = await response.json();
      console.log('\x1b[32mTotal Size:', data.totalSize, 'MB\x1b[32m');
    } else {
      console.error('Failed to fetch data:', response.statusText);
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
};

const main = async () => {
  while (true) {
    const { action } = await inquirer.prompt({
      type: 'list',
      name: 'action',
      message: 'Heyy , what can i do :',
      choices: [
        {
          name: 'Toggle Server (ON/OFF)',
          value: 'toggleServer',
        },
        {
          name: 'Size of the movie heap',
          value: 'size',
        },
        {
          name: 'Exit',
          value: 'exit',
        },
      ],
    });

    switch (action) {
      case 'size':
        await sizeAction();
        break;
      case 'toggleServer':
        if (serverProcess) {
          stopServer();
          serverProcess = null;
        } else {
          startServer();
        }
        break;
      case 'exit':
        process.exit(0); // Exit the application
        break;
      default:
        console.log('Invalid selection');
    }
  }
};

// Call the main function directly
main();
