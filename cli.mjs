#!/usr/bin/env node

import select from '@inquirer/select';
import { Separator } from '@inquirer/select';

const main = async () => {
  const answer = await select({
    message: 'this is basic example',
    choices: [
      {
        name: 'npm',
        value: 'npm',
        description: 'npm is the most popular package manager',
      },
      {
        name: 'yarn',
        value: 'yarn',
        description: 'yarn is an awesome package manager',
      },
      new Separator(),
      {
        name: 'jspm',
        value: 'jspm',
        disabled: true,
      },
    ],
  });

  console.log(answer);
};

// Call the main function directly
main();
