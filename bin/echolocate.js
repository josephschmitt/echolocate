#!/usr/bin/env node

const minimist = require('minimist');
const echolocate = require('../dist/bundle.js');

const args = minimist(process.argv.slice(2), {
  alias: {
    'device-id': 'd',
    'consent-token': 'c'
  }
});

echolocate(args['device-id'], {consentToken: args['consent-token']})
  .then((device) => {
    console.log(JSON.stringify(device));
  })
  .catch((e) => {
    console.error(e && e.message || e);
    process.exit(1);
  });
