const fs = require('fs');
const xml2js = require('xml2js');

let plugins = new Object();

function PluginReader() {

}

module.exports = PluginReader;

PluginReader.prototype.load = (callback) => {
  let pluginBaseFolder = './Plugins';
  fs.readdir(pluginBaseFolder, (err, files) => {
    for (var i in files) {
      let pluginXMLPath = pluginBaseFolder + '/' + files[i] + '/plugin.xml';
      if (fs.existsSync(pluginXMLPath)) {
        fs.readFile(pluginXMLPath, (err, data) => {
          let parser = new xml2js.Parser();
          parser.parseString(data, (err, result) => {
            if (result === null
               || result.plugin === null
               || result.plugin['$'] === null
               || result.plugin['$'].name === null) {
                 return;
            } else {
              plugins[result.plugin['$'].name] = result.plugin;
              console.log(plugins);
            }
          });
        });
      }
    }
  });
};
