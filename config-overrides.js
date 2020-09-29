const {
  override,
  overrideDevServer,
  addWebpackPlugin,
  disableChunk
} = require("customize-cra");

const ExtensionReloader = require('webpack-extension-reloader');
const extensionReloader = new ExtensionReloader({
  entries: {
    contentScript: [],
    background: 'background',
    extensionPage: ['popup', 'options']
  }
});

const multipleEntry = require('react-app-rewire-multiple-entry')([
  {
    entry: 'src/index.tsx',
    template: 'public/index.html',
    outPath: '/index.html'
  }
]);

const CopyPlugin = require('copy-webpack-plugin');
const copyPlugin = new CopyPlugin({
  patterns: [
    { from: 'public', to: '' },
  ]
})

const devServerConfig = () => config => {
  return {
    ...config,
    writeToDisk: true
  }
}

module.exports = {
  webpack: override(
    process.env.NODE_ENV === 'development' ? addWebpackPlugin(
      extensionReloader
    ) : undefined,
    addWebpackPlugin(copyPlugin),
    disableChunk(),
    multipleEntry.addMultiEntry,
  ),
  devServer: overrideDevServer(
    devServerConfig()
  ),
};
