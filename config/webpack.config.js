var path = require('path');
var webpack = require("webpack");
var glob = require("glob")

var root = path.normalize(path.join(__dirname, '..'));

var js_root = path.join(root, 'app/assets/javascripts');
var bower_components = path.join(root, 'vendor/assets/components');

// dirty but work
module.exports = glob.sync(path.join(js_root, './**/*.entry.js'))
  .map(function(entryPath) {
    entryPath = path.relative(js_root, entryPath)

    return {
      context: js_root,
      entry: entryPath,
      output: {
        path: js_root,
        filename: path.join('compiled', entryPath).replace('entry.js', 'js')
      },
      externals: {
        jquery: "jQuery"
      },
      resolve: {
        root: [js_root, bower_components],
        modulesDirectories: ["web_modules", "node_modules", "bower_components"]
      },
      plugins: [
        new webpack.ResolverPlugin(
          new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin("bower.json", ["main"])
        )
      ],
      module: {
        loaders: [
          { test: /\.png$/
          , loader: "url-loader?limit=100000&mimetype=image/png"
          }
        ]
      }
    }
  })
