const { execSync } = require('child_process');
let stdout = execSync(`git log -1 --pretty='%s'`).toString('utf-8');
let commitName = stdout.slice(1, -2);

if (commitName.match(/^--Patch /)) {
  commitName = commitName.replace('--Patch ', '');
  execSync(`npm version patch`).toString('utf-8');
} else if (commitName.match(/^--Minor /)) {
  commitName = commitName.replace('--Minor ', '');
  execSync(`npm version minor`).toString('utf-8');
} else if (commitName.match(/^--Major /)) {
  commitName = commitName.replace('--Major ', '');
  execSync(`npm version major`).toString('utf-8');
}
