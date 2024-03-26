const xmlrpc = require('xmlrpc');

const url = '20.164.146.60';
const db = 'bitnami_odoo';
const username = 'user@example.com';
const password = 'FKOF4pOJIV';

function authenticateOdoo() {
  return new Promise((resolve, reject) => {
    const client = xmlrpc.createClient({ host: url, port: 80, path: '/xmlrpc/2/common' });
    client.methodCall('authenticate', [db, username, password, {}], (error, value) => {
      if (error) {
        reject(error);
      } else {
        resolve(value);
      }
    });
  });
}

module.exports = { authenticateOdoo };

