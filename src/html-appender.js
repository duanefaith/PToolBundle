const TYPE_LABEL = 'label';
const TYPE_INPUT = 'input';
const TYPE_SUBMIT = 'submit';

const MAX_COL_SPAN_PER_ROW = 12;
const COL_SPAN_WIDTH_TABLE = {
  label: 2,
  input: 2,
  submit: 2,
};

let $localForm;
let localSubmitCallback;
let formId;
let paramIdTypeMap;

function HtmlAppender($form, submitCallback) {
  $localForm = $form;
  localSubmitCallback = submitCallback;
  formId = $form.attr('id');
  paramIdTypeMap = new Object();
}

module.exports = HtmlAppender;

/* private functions */

function getFormIdByParamId(paramId) {
  if (paramId != null) {
    return formId + '_' + paramId;
  }
  return null;
}

function checkAndAddRow(type) {
  let $rowList = $localForm.find('div.row');
  if ($rowList == null || $rowList.length <= 0) {
    $localForm.append('<div class="row ptools-row-unit"></div>');
    return $localForm.find('div.row').last();
  }

  let colSpanSum = 0;
  let $colDivs = $rowList.last().find('div.ptools-col-unit');
  if ($colDivs != null && $colDivs.length > 0) {
    for (let i = 0; i < $colDivs.length; i++) {
      let $colDiv = $colDivs.eq(i);
      if ($colDiv != null) {
        let colType = $colDiv.attr('data-type');
        colSpanSum += COL_SPAN_WIDTH_TABLE[colType];
      }
    }
  }
  if (colSpanSum + COL_SPAN_WIDTH_TABLE[type] > MAX_COL_SPAN_PER_ROW) {
    $localForm.append('<div class="row ptools-row-unit"></div>');
  }
  return $localForm.find('div.row.ptools-row-unit').last();
}

function createWrapperDiv($div, type) {
  if ($div != null) {
    $div.append('<div class="ptools-col-unit col-xs-'
     + COL_SPAN_WIDTH_TABLE[type] + '" data-type="' + type + '"></div>');
    return $div.find('div.ptools-col-unit[data-type="' + type + '"]').last();
  }
  return null;
}

function collectParameters() {
  let keys = Object.keys(paramIdTypeMap);
  if (keys != null && keys.length > 0) {
    let paramsMap = new Object();
    for (let i in keys) {
      let id = keys[i];
      let type = paramIdTypeMap[id];
      let param;
      if (type == TYPE_LABEL) {
        let $labels = $localForm.find('.ptools-item-label#' + getFormIdByParamId(id));
        if ($labels != null && $labels.length > 0) {
          param = $labels.first().text();
        }
      } else if (type == TYPE_INPUT) {
        let $inputs = $localForm.find('.ptools-item-input#' + getFormIdByParamId(id));
        if ($inputs != null && $inputs.length > 0) {
          param = $inputs.first().val();
        }
      }
      if (param != null && param.length > 0) {
        paramsMap[id] = param;
      }
    }
    return paramsMap;
  }
  return null;
}

function jointLabel($div, ele) {
  if ($div != null
     && ele != null
     && ele['$'] != null
     && ele['$'].id != null) {
       let content = ele['_'];
       if (content == null) {
         content = '';
       }
       let nameSpan = '';
       let name = ele['$'].name;
       if (name != null && name.length > 0) {
         nameSpan = '<span>' + name + ': </span>';
       }
       $div.append('<div class="ptools-col-inner">' + nameSpan
        + '<span class="ptools-item-label" id="' + getFormIdByParamId(ele['$'].id) + '">' + content + '</span></div>');
       return ele['$'].id;

  }
  return null;
}

function jointInput($div, ele) {
  if ($div != null
     && ele != null
     && ele['$'] != null
     && ele['$'].id != null) {
      let nameSpan = '';
      let name = ele['$'].name;
      if (name != null && name.length > 0) {
        nameSpan = ' placeholder="' + name + '"';
      }
      $div.append('<div class="ptools-col-inner"><input type="text" class="form-control ptools-item-input" id="'
       + getFormIdByParamId(ele['$'].id) + '"' + nameSpan + '></div>');
      return ele['$'].id;
  }
  return null;
}

function joinSubmit($div, ele) {
  if ($div != null
     && ele != null
     && ele['$'] != null
     && ele['$'].id != null) {
       let nameSpan = '';
       let name = ele['$'].name;
       if (name != null && name.length > 0) {
         nameSpan = name;
       }
       let exec = ele['$'].exec;
       let btnId = getFormIdByParamId(ele['$'].id);
       $div.append('<div class="ptools-col-inner"><button type="button" class="btn btn-info ptools-item-submit" id="'
        + btnId + '">' + nameSpan + '</button></div>');
        $div.find('button.ptools-item-submit#' + btnId).click(function(event) {
          if (localSubmitCallback != null) {
            localSubmitCallback(exec, collectParameters());
          }
        });
       return ele['$'].id;
  }
  return null;
}

/* private functions */

HtmlAppender.prototype.appendData = (formData) => {
  if ($localForm == null) {
    return;
  }
  if (formData == null
     || formData['$$'] == null
     || formData['$$'].length <= 0) {
    return;
  }
  for (let i in formData['$$']) {
    let element = formData['$$'][i];
    if (element != null) {
      let eleType = element['#name'];
      let id = null;
      if (eleType == TYPE_LABEL) {
        id = jointLabel(createWrapperDiv(checkAndAddRow(eleType), eleType), element);
      } else if (eleType == TYPE_INPUT) {
        id = jointInput(createWrapperDiv(checkAndAddRow(eleType), eleType), element);
      } else if (eleType == TYPE_SUBMIT) {
        id = joinSubmit(createWrapperDiv(checkAndAddRow(eleType), eleType), element);
      }
      if (id != null) {
        paramIdTypeMap[id] = eleType;
      }
    }
  }
};
