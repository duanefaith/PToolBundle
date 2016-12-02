const fs = require('fs');
const xml2js = require('xml2js');
const path = require('path');
const child_process = require('child_process');

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
    let parser = new xml2js.Parser({explicitChildren: true, preserveChildrenOrder: true});
    parser.parseString(data, (err, result) => {
      if (result != null
         && result.plugin != null
         && result.plugin['$$'] != null
         && result.plugin['$$'].length > 0) {
           let formList = new Array();
           for (let i in result.plugin['$$']) {
             let form = result.plugin['$$'][i];
             if (form != null
                && form['#name'] == 'form') {
                  formList.push(form);
             }
           }
           pluginMap[name] = formList;
      }
      if (callback != null) {
        callback(pluginMap[name]);
      }
    });
  });
};

module.exports.exec = (name, exec, params, callback) => {
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

  let execPath = path.join(pluginFolder, exec);
  if (!fs.existsSync(pluginFolder)) {
    if (callback != null) {
      callback(null);
    }
    return;
  }

  let pyProcess = child_process.spawn('python', ['./Scripts/executor.py', execPath, JSON.stringify(params)], {});

  if (pyProcess.stdout != null) {
    pyProcess.stdout.on('data', (data) => {
      if (callback != null) {
        callback('stdout', data);
      }
    })
  }
  if (pyProcess.stderr != null) {
    pyProcess.stderr.on('data', (data) => {
      if (callback != null) {
        callback('stderr', data);
      }
    })
  }
  pyProcess.on('exit', (data) => {
    if (callback != null) {
      callback('exit', data);
    }
  });
};
