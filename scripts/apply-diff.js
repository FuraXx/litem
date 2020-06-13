const fs           = require('fs');
const path         = require('path');
const { execSync } = require('child_process');

const patch = () => {
  return execSync(`git apply --reject --whitespace=fix "${path.join(__dirname, '../patch.diff')}"`, {cwd: path.join(__dirname, '../litem-patch')}).toString();
}

console.log(patch());
console.log('done, if no error above patch has worked');
