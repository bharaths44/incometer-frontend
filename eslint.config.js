import next from 'eslint-config-next';
import reactRefresh from 'eslint-plugin-react-refresh';

const eslintConfig = [
  ...next,
  {
    plugins: {
      'react-refresh': reactRefresh,
    },
    rules: {
      'react-refresh/only-export-components': 'warn',
    },
  },
  {
    files: ['components/ui/**/*', 'app/**/*'],
    rules: {
      'react-refresh/only-export-components': 'off',
    },
  },
];

export default eslintConfig;