import next from 'eslint-config-next';
import reactRefresh from 'eslint-plugin-react-refresh';
import unusedImports from 'eslint-plugin-unused-imports';

const eslintConfig = [
	...next,
	{
		plugins: {
			'react-refresh': reactRefresh,
			'unused-imports': unusedImports,
		},
  "rules": {
    "unused-imports/no-unused-imports": "error",
    "unused-imports/no-unused-vars": [
      "warn",
      {
        "vars": "all",
        "varsIgnorePattern": "^_",
        "args": "after-used",
        "argsIgnorePattern": "^_"
      }
    ]
  }
	},
	{
		files: ['components/ui/**/*', 'app/**/*'],
		rules: {
			'react-refresh/only-export-components': 'off',
		},
	},
];

export default eslintConfig;
