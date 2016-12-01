const TYPE_LABEL = 'label';
const TYPE_INPUT = 'input';

const MAX_COL_SPAN_PER_ROW = 12;
const COL_SPAN_WIDTH_TABLE = {
  label: 2,
  input: 2,
};

let $localForm;
let formId;

function HtmlAppender($form) {
  $localForm = $form;
  formId = $form.attr('id');
}

module.exports = HtmlAppender;

/* private functions */

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

function jointLabel($div, ele) {
  if ($div != null
     && ele != null
     && ele['$'] != null
     && ele['$'].id != null) {
       let content = ele['_']
       if (content == null) {
         content = '';
       }
       let nameSpan = '';
       let name = ele['$'].name;
       if (name != null && name.length > 0) {
         nameSpan = '<p>' + name + ': </p>';
       }
       $div.append('<span class="ptools-col-inner">' + nameSpan
        + '<p class="ptools-item-label" id="' + formId + '_' + ele['$'].id + '">' + content + '</p></span>');
  }
}

function jointInput($div, ele) {
  if ($div != null
     && ele != null
     && ele['$'] != null
     && ele['$'].id != null) {
      let content = ele['_']
      if (content == null) {
        content = '';
      }
      let nameSpan = '';
      let name = ele['$'].name;
      if (name != null && name.length > 0) {
        nameSpan = ' placeholder="' + name + '"';
      }
      let inputId = formId + '_' + ele['$'].id;
      $div.append('<div class="form-group"><input type="text" class="form-control" id="' + inputId + '"' + nameSpan + '></div>');
  }
}

/* private functions */

HtmlAppender.prototype.appendData = (formData) => {
  console.log(formData);
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
      if (eleType == TYPE_LABEL) {
        jointLabel(createWrapperDiv(checkAndAddRow(eleType), eleType), element);
      } else if (eleType == TYPE_INPUT) {
        jointInput(createWrapperDiv(checkAndAddRow(eleType), eleType), element);
      }
    }
  }
};
