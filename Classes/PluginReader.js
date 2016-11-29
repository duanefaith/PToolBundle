const fs = require('fs');

let plugin;

function PluginReader() {

}

module.exports = PluginReader;

PluginReader.prototype.load = function(callback) {
  let pluginBaseFolder = './Plugins';
  fs.readdir(pluginBaseFolder, function(err, files) {
    for (var i in files) {
      let pluginXMLPath = pluginBaseFolder + '/' + files[i] + '/plugin.xml';
      if (fs.existsSync(pluginXMLPath)) {
        // console.log(fs.readFileSync(pluginXMLPath, 'utf8'));
      }
    }
  });
};
