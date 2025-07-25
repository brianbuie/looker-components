import fs from 'fs';
import { execSync } from 'child_process';

/**
 * Basic Component Info
 * Differs for stage vs production
 */

const env = {
  name: '[Dev] Scorecard',
  description: 'A flexible scorecard component',
  bucket: 'gs://bbuie-looker-dev/scorecard-v2',
};

if (process.env.NODE_ENV === 'production') {
  env.name = 'Scorecard v2';
  env.bucket = 'gs://bbuie-looker/scorecard-v2';
}

console.log(`\nDeploying "${env.name}" to ${env.bucket}...\n`);

/**
 * manifest.json
 * Required for looker components
 */

const manifest = {
  name: env.name,
  description: env.description,
  organization: 'Brian Buie',
  devMode: true,
  components: [
    {
      name: env.name,
      description: env.description,
      resource: {
        js: `${env.bucket}/index.js`,
        config: `${env.bucket}/input.json`,
      },
    },
  ],
};

fs.writeFileSync('dist/manifest.json', JSON.stringify(manifest, null, 2));

/**
 * Component input definition
 * Outlines the interface in Looker Studio for configuring the component
 */

const input = {
  data: [
    {
      id: 'concepts',
      label: 'Scorecard Data',
      elements: [
        {
          id: 'breakdown',
          label: 'Breakdown',
          type: 'DIMENSION',
          options: {
            min: 1,
            max: 1,
          },
        },
        {
          id: 'metric',
          label: 'Metric',
          type: 'METRIC',
          options: {
            min: 1,
            max: 1,
          },
        },
      ],
    },
  ],
  style: [
    {
      id: 'developer',
      label: 'Development',
      elements: [
        {
          id: 'showDataModel',
          label: 'Show Underlying Data',
          type: 'CHECKBOX',
          defaultValue: false,
        },
      ],
    },
    {
      id: 'options',
      label: 'Options',
      elements: [
        {
          id: 'showComparison',
          label: 'Compare First & Last Values',
          type: 'CHECKBOX',
          defaultValue: true,
        },
      ],
    },
    {
      id: 'theme',
      label: 'Style',
      elements: [
        {
          id: 'fontFamily',
          label: 'Font',
          type: 'FONT_FAMILY',
        },
        {
          id: 'fontSize',
          label: 'Font Size',
          type: 'FONT_SIZE',
          defaultValue: 24,
        },
      ],
    },
  ],
};

fs.writeFileSync('dist/input.json', JSON.stringify(input, null, 2));

/**
 * Copy everything in the dist/ folder to the Google cloud storage bucket
 */
execSync(`gsutil -m cp dist/* ${env.bucket}`);
