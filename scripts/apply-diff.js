const fs           = require('fs');
const path         = require('path');
const { execSync } = require('child_process');

const patch = () => {
  execSync(`git apply "${path.join(__dirname, '../patch.diff')}"`, {cwd: path.join(__dirname, '../litem-patch')});
}

console.log('done, if no error above patch as worked');
