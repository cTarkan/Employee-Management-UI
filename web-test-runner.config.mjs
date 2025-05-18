import { esbuildPlugin } from '@web/dev-server-esbuild';

export default {
  files: ['src/**/*.test.js'], 
  nodeResolve: true,           
  plugins: [
    esbuildPlugin({ jsx: false, ts: false, target: 'auto' }),
  ],
  coverage: true,              
  coverageConfig: {
    report: true,
    reportDir: 'coverage', 
    reporters: ['lcov', 'text-summary'], 
    threshold: {             
      statements: 85,
      branches: 85,
      functions: 85,
      lines: 85,
    },
    include: [               
      'src/components/**/*.js',
      'src/pages/**/*.js',
      'src/services/**/*.js',
      'src/localization/**/*.js',
    ],
    exclude: [               
      'src/main.js', 
      'src/styles/**/*.css',
      'src/**/*.test.js', 
    ],
  },
};