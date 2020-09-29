const {
  override,
  overrideDevServer
} = require("customize-cra");

const multipleEntry = require('react-app-rewire-multiple-entry')([
  {
    entry: 'src/index.tsx',
    template: 'public/index.html',
    outPath: '/index.html'
  }
]);

const devServerConfig = () => config => {
  return {
    ...config,
    writeToDisk: true
  }
}

module.exports = {
  webpack: override(
    multipleEntry.addMultiEntry,
  ),
  devServer: overrideDevServer(
    devServerConfig()
  ),
};
