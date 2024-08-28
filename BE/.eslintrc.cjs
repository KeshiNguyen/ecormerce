module.exports = {
    env: {es2020: true, node: true},
    extends: [
        'eslint:recommend'
    ],
    parser: '@babel/eslint-parser',
    parserOptionss: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        requireConfigFile: false,
        allowImportExportEverywhere: true
    },
    plugins: [],
    rules: {
        
    }
}