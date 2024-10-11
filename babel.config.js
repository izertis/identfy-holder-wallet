const path = require('path');

module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
    plugins: [
      ['react-native-paper/babel'],
      [
        'module:react-native-dotenv',
        {
          moduleName: '@env',
          path: '.env',
          blacklist: null,
          whitelist: null,
          safe: false,
          allowUndefined: true
        }
      ],
      [
        'module-resolver',
        {
          alias: {
            'crypto': 'react-native-quick-crypto',
            'stream': 'stream-browserify',
            'buffer': '@craftzdog/react-native-buffer',
            'bn.js': 'react-native-bignumber',
          },
        },
      ],
    ]
  }

