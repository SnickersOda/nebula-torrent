#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🌌 NebulaTorrent Setup Checker\n');

const checks = [
  {
    name: 'Node.js',
    check: () => {
      const version = process.version;
      const major = parseInt(version.slice(1).split('.')[0]);
      return { ok: major >= 16, message: version };
    }
  },
  {
    name: 'package.json',
    check: () => {
      const exists = fs.existsSync('package.json');
      return { ok: exists, message: exists ? '✓' : 'Missing' };
    }
  },
  {
    name: 'node_modules',
    check: () => {
      const exists = fs.existsSync('node_modules');
      return { ok: exists, message: exists ? '✓' : 'Run: npm install' };
    }
  },
  {
    name: 'src/main.js',
    check: () => {
      const exists = fs.existsSync('src/main.js');
      return { ok: exists, message: exists ? '✓' : 'Missing' };
    }
  },
  {
    name: 'src/app.js',
    check: () => {
      const exists = fs.existsSync('src/app.js');
      return { ok: exists, message: exists ? '✓' : 'Missing' };
    }
  },
  {
    name: 'src/index.html',
    check: () => {
      const exists = fs.existsSync('src/index.html');
      return { ok: exists, message: exists ? '✓' : 'Missing' };
    }
  },
  {
    name: 'src/styles.css',
    check: () => {
      const exists = fs.existsSync('src/styles.css');
      return { ok: exists, message: exists ? '✓' : 'Missing' };
    }
  }
];

let allOk = true;

checks.forEach(({ name, check }) => {
  const result = check();
  const icon = result.ok ? '✅' : '❌';
  console.log(`${icon} ${name.padEnd(20)} ${result.message}`);
  if (!result.ok) allOk = false;
});

console.log('\n' + '='.repeat(50));

if (allOk) {
  console.log('✅ All checks passed! Ready to run:');
  console.log('   npm start      - Normal mode');
  console.log('   npm run dev    - Debug mode with DevTools');
  console.log('   npm run build  - Build .exe');
} else {
  console.log('❌ Some checks failed. Please fix the issues above.');
  console.log('   Run: npm install');
}

console.log('='.repeat(50) + '\n');
