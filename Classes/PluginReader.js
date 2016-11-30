const fs = require('fs');
const xml2js = require('xml2js');

let pluginFolders = new Object();
let pluginMap = new Object();

module.exports.reload = (callback) => {
  pluginFolders = new Object();
  pluginMap = new Object();

  let pluginBaseFolder = './Plugins';
  fs.readdir(pluginBaseFolder, (err, files) => {
    let count = 0;
    files.forEach((e, i) => {
      let pluginFolder = pluginBaseFolder + '/' + e;
      let pluginXMLPath = pluginFolder + '/plugin.xml';
      fs.readFile(pluginXMLPath, (err, data) => {
        let parser = new xml2js.Parser();
        parser.parseString(data, (err, result) => {
          if (result != null
             && result.plugin != null
             && result.plugin['$'] != null
             && result.plugin['$'].name != null) {
               pluginFolders[result.plugin['$'].name] = pluginFolder;
          }
          count ++;
          if (count == files.length && callback != null) {
            callback(pluginFolders);
          }
        });
      });
    });
  });
};

module.exports.loadPlugin = (name, callback) => {
  if (name == null) {
    if (callback != null) {
      callback(null);
    }
    return;
  }
  let pluginFolder = pluginFolders[name];
  if (pluginFolder == null || !fs.existsSync(pluginFolder)) {
    if (callback != null) {
      callback(null);
    }
    return;
  }
  if (pluginMap.hasOwnProperty(name)) {
    if (callback != null) {
      callback(pluginMap[name]);
    }
    return;
  }

  let pluginXMLPath = pluginFolder + '/plugin.xml';
  fs.readFile(pluginXMLPath, (err, data) => {
    let parser = new xml2js.Parser();
    parser.parseString(data, (err, result) => {
      if (result != null
         && result.plugin != null) {
           pluginMap[name] = result.plugin.form;
      }
      if (callback != null) {
        callback(pluginMap[name]);
      }
    });
  });
};
