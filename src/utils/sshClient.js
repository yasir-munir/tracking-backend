
const { Client: SSHClient } = require('ssh2');

const sshConfig = {
  host: 'usa-np-dev1-usea-vm.eastus.cloudapp.azure.com',
  port: 22,
  username: 'dev1',
  password: 'uQ49hPZiVJkFEHF3sQ5iR48eohgkURfGwbrhsJcxbwjGnDXTGFuPb4ofhtQUScCg'
};

function connectToSSH() {
  const sshClient = new SSHClient();

  sshClient.on('ready', () => {
    console.log('SSH connection established');
    // You can perform any necessary actions after the SSH connection is established here
  });

  sshClient.on('error', (err) => {
    console.error('SSH connection error:', err);
    sshClient.end();
  });

  sshClient.connect(sshConfig);
}

module.exports = {
  connectToSSH
};
