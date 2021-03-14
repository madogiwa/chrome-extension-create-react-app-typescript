const {
  override,
  overrideDevServer,
  addWebpackPlugin,
  disableChunk
} = require("customize-cra");

const multipleEntry = require('react-app-rewire-multiple-entry')([
  {
    entry: 'src/index.tsx',
    template: 'public/index.html',
    outPath: '/index.html'
  }
]);

const ExtensionReloader = require('webpack-extension-reloader');
const extensionReloader = new ExtensionReloader({
  reloadPage: true,
  entries: {
    contentScript: ['content_script'],
    background: 'background',
    extensionPage: ['popup', 'options']
  }
});

const CopyPlugin = require('copy-webpack-plugin');
const copyPlugin = new CopyPlugin({
  patterns: [
    {from: 'public', to: ''},
  ]
})

const devServerConfig = () => config => {
  return {
    ...config,
    writeToDisk: true
  }
}

const path = require("path");
const addEntryPlugin = (config, env) => {
  config.entry = {
    ...config.entry,
    content_script: [path.resolve('src/content.ts')],
    background: [path.resolve('src/background.ts')]
  }

  // Remove hash
  config.output.filename = "static/js/[name].js";
  return config
}

module.exports = {
  webpack: override(
    process.env.NODE_ENV === 'development' ? addWebpackPlugin(
      extensionReloader
    ) : undefined,
    addWebpackPlugin(copyPlugin),
    multipleEntry.addMultiEntry,
    addEntryPlugin,
    disableChunk(),
  ),
  devServer: overrideDevServer(
    devServerConfig()
  ),
};
