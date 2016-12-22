const electron = require('electron');
const ipcRenderer = electron.ipcRenderer;

const HtmlAppender = require('./html-appender.js');

let $consoleUl;

$(window).on('beforeunload', () => {
  ipcRenderer.send('window_before_unload');
});

$('button#ptool_console_btn_trash').click(() => {
  if ($consoleUl == null) {
    $consoleUl = $('div#ptool_console_container ul#ptool_console_list').first();
  }
  $consoleUl.empty();
});

$('button#ptool_console_btn_stop').click(() => {
  ipcRenderer.send('plugins_exec_stop_all');
});

ipcRenderer.on('plugins_reload_success', (event, plugins) => {
  let pluginList = Object.keys(plugins);
  let $dropdownList = $("ul#ptool_tools_dropdown_list");
  let $firstDropdownLink = null;
  $dropdownList.empty()
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
  if ($("span#ptool_tools_dropdown_title").attr('data-plugin-name') == name
   && plugin != null && plugin.length > 0) {
     let $mainContainer = $('div#ptool_main_container');
     let heightPercent = 100 / plugin.length;
     $mainContainer.empty();
     for (let i in plugin) {
       let form = plugin[i];
       let formOuterId = 'ptool_form_' + i;
       let formInnerId = 'ptool_form_inner_' + i;
       $mainContainer.append('<div class="ptool-form" id="' + formOuterId + '"></div>');
       let $formOuterDiv = $mainContainer.find('div.ptool-form#' + formOuterId);
       $formOuterDiv.css('height', heightPercent + '%');
       $formOuterDiv.append('<div class="panel panel-default ptool-inner-sub-pannel" id="' + formInnerId + '"></div>');

       let htmlAppender = new HtmlAppender($formOuterDiv.find('div#' + formInnerId), (exec, params) => {
         ipcRenderer.send('plugin_exec', name, exec, params);
         $('button#ptool_console_btn_stop').removeAttr('disabled');
       });
       htmlAppender.appendData(form);
     }
  }
});

ipcRenderer.on('plugin_exec_stdout', (event, data, remainingCount) => {
  if ($consoleUl == null) {
    $consoleUl = $('div#ptool_console_container ul#ptool_console_list').first();
  }
  $consoleUl.append('<li class="list-group-item list-group-item-info ptool_console_item">' + data + '</li>');
});

ipcRenderer.on('plugin_exec_stderr', (event, data, remainingCount) => {
  if ($consoleUl == null) {
    $consoleUl = $('div#ptool_console_container ul#ptool_console_list').first();
  }
  $consoleUl.append('<li class="list-group-item list-group-item-danger ptool_console_item">' + data + '</li>');
});

ipcRenderer.on('plugin_exec_exit', (event, data, remainingCount) => {
  if ($consoleUl == null) {
    $consoleUl = $('div#ptool_console_container ul#ptool_console_list').first();
  }
  $consoleUl.append('<li class="list-group-item list-group-item-warning ptool_console_item">exit code ' + data + '</li>');
  if (remainingCount == 0) {
    $('button#ptool_console_btn_stop').attr('disabled', 'disabled');
  }
});

ipcRenderer.send('plugins_reload');
