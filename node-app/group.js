const { exec } = require('child_process');

exec('node sender.js && node reciever1.js && node reciever2.js', (err, stdout, stderr) => {
  if (err) {
    console.error('Error running the application:', err);
    process.exit(1);
  }

  console.log(stdout);
  console.error(stderr);
});
