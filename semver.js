const { execSync } = require('child_process');
const fs = require('fs');
let stdout = execSync(`git log -1 --pretty='%s'`).toString('utf-8');
let commitName = stdout
  .slice(1, -2)
  .split('--')
  .map((x) => x.trim());

let isUpdated = false;

if (commitName[0] === 'Fix') {
  execSync(`npm version patch`).toString('utf-8');
  isUpdated = true;
} else if (commitName[0] === 'Add' || commitName[0] === 'Update') {
  execSync(`npm version minor`).toString('utf-8');
  isUpdated = true;
} else if (commitName[0] === 'Change' || commitName[0] === 'Release') {
  execSync(`npm version major`).toString('utf-8');
  isUpdated = true;
}

if (!isUpdated) {
  process.exit(1);
}

// Get current vesrion
const version = JSON.parse(fs.readFileSync('package.json', 'utf-8'))['version'];

// Update change log
if (commitName.length > 1) {
  // Changelog fill
  let content = '';
  try {
    content = fs.readFileSync('CHANGELOG.md', 'utf-8');
  } catch {
    content = '';
  }

  let changeLog = `## [${version}] - ${new Date().getFullYear()}-${(
    '00' + new Date().getMonth()
  ).slice(-2)}-${('00' + new Date().getDate()).slice(-2)}

`;

  if (commitName[0] === 'Fix') {
    changeLog += `### Fixed\n`;
  }

  if (commitName[0] === 'Add') {
    changeLog += `### Added\n`;
  }

  if (commitName[0] === 'Update') {
    changeLog += `### Updated\n`;
  }

  if (commitName[0] === 'Change') {
    changeLog += `### Changed\n`;
  }

  if (commitName[0] === 'Release') {
    changeLog += `### Release\n`;
  }

  changeLog += commitName
    .slice(1)
    .map((x) => `-    ${x}`)
    .join('\n');
  changeLog += '\n\n';

  fs.writeFileSync(`CHANGELOG.md`, changeLog + content);

  execSync(`git add CHANGELOG.md`).toString('utf-8');
  execSync(`git commit -m "Changelog update"`).toString('utf-8');
}
