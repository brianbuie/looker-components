import fs from 'fs';
import { execSync } from 'child_process';
import config from './looker.config.js';

console.log(`\nDeploying "${config.env.name}" to ${config.env.bucket}...\n`);

fs.writeFileSync('dist/manifest.json', JSON.stringify(config.manifest, null, 2));
fs.writeFileSync('dist/input.json', JSON.stringify(config.input, null, 2));

execSync(`gsutil -m cp dist/* ${config.env.bucket}`);
