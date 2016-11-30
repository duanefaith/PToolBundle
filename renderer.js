const electron = require('electron');
const ipcRenderer = electron.ipcRenderer;

ipcRenderer.on('plugins_reload_success', (event, plugins) => {
  let pluginList = Object.keys(plugins);
  let $dropdownList = $("ul#ptool_tools_dropdown_list");
  let $firstDropdownLink = null;
  for (let i in pluginList) {
    let pluginName = pluginList[i];
    if (pluginName != null
       && pluginName.length > 0) {
         $dropdownList.append('<li><a href="#" data-plugin-name="' + pluginName + '">' + pluginName + '</a></li>');
         let $link = $dropdownList.find('a[data-plugin-name="' + pluginName + '"]');
         if (i == 0) {
           $firstDropdownLink = $link;
         }
         $link.click((event) => {
           let clickPluginName = event.target.getAttribute('data-plugin-name');
           $("span#ptool_tools_dropdown_title").attr('data-plugin-name', clickPluginName);
           $("span#ptool_tools_dropdown_title").text(clickPluginName);
           ipcRenderer.send('plugin_load_specific', clickPluginName);
         });
    }
  }
  if ($firstDropdownLink != null) {
    $firstDropdownLink.trigger('click');
  }
});

ipcRenderer.on('plugin_load_specific_success', (event, name, plugin) => {
  if ($("span#ptool_tools_dropdown_title").attr('data-plugin-name') == name) {
    
  }
});

ipcRenderer.send('plugins_reload');
