const fs           = require('fs');
const path         = require('path');
const { execSync } = require('child_process');

const diff = () => {
  const diff = execSync('git diff --ignore-submodules remotes/upstream/master .', {cwd: path.join(__dirname, '../litem-patch')}).toString();
  return diff;
}

const data = diff();

fs.writeFileSync(path.join(__dirname, '../patch.diff'), data);

