const fs           = require('fs');
const path         = require('path');
const { execSync } = require('child_process');

const patch = () => {
  const out = execSync(`git apply "${path.join(__dirname, '../patch.diff')}"`, {cwd: path.join(__dirname, '../litem-patch')}).toString();
}


console.log(patch());
