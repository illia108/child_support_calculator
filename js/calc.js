$(function() {
  var calcForm = $('#calcForm');
  var income = $('#userIncome');
  var children = $('#userChildren');
  
  $('#submitCalcForm').click(function(e) {
    e.preventDefault();
    
    if (income.val() === '') {
      alert('Please enter an Income.'); // change to message
      $('#monthly-award').html('');
      return;
    }

    if (children.val() === '-1') {
      alert('Please enter a Number of children.'); // change to message
      $('#monthly-award').html('');
      return;
    }
    
    var monthlyAward = calcChildSupport(income.val(), children.val());
    
    $('#monthly-award').html('$' + monthlyAward);
  });
});

function calcChildSupport(income, children) {
  income = Number(income);
  
  var ranges = buildRanges(11000, 149000, 1000, 999);
  var valuesPosition = getValuesPosition(income, ranges);
  var incomeOverFirstValue = calcIncomeOverFirstValue(income, ranges, valuesPosition);
  var valuesForNumberOfChildren = getValuesForNumberOfChildren(children);
  var values = valuesForNumberOfChildren[valuesPosition];
  
  return calcMonthlyAward(values, incomeOverFirstValue);
}

function buildRanges(from, to, step, size) {
  var ranges = [];
  var from_10820_to_10999 = [];
  
  for(var i = 10820; i <= 10999; i++) {
    from_10820_to_10999.push(i);
  }
  
  ranges.push(from_10820_to_10999);
  
  for (var i = from; i <= to; i += step) {
    var range = [];
    
    for (var j = i; j <= i + size; j++) {
      range.push(j);
    }
    
    ranges.push(range);
  }
  
  return ranges;
}

function getValuesPosition(income, ranges) {
  if (income < ranges[0][0]) {
    return 0;
  }
  
  if (income > ranges[ranges.length - 1][ranges[ranges.length - 1].length - 1]) {
    return ranges.length + 1;
  }
  
  for (var i = 0; i < ranges.length; i++) {
    if (!(ranges[i].indexOf(income) === -1)) {
      return i + 1;
    }
  }
}

function getValuesForNumberOfChildren(children) {
  var values;
  
  switch (children) {
    case '1':
      values = oneChildValues;
      break;
    case '2':
      values = twoChildrenValues;
      break;
    case '3':
      values = threeChildrenValues;
      break;
    case '4':
      values = fourChildrenValues;
      break;
    case '5':
      values = fiveChildrenValues;
      break;
    case '6+':
      values = sixPlusChildrenValues;
      break;
  }
  
  return values;
}

function calcIncomeOverFirstValue(income, ranges, valuesPosition) {
  if (valuesPosition === 0) { return 0; }
  
  if (valuesPosition > ranges.length) {
    var nextValueAfterLastInRanges = ranges[ranges.length - 1][ranges[ranges.length - 1].length - 1] + 1;
    return income - nextValueAfterLastInRanges;
  }
  
  return income - ranges[valuesPosition - 1][0];
}

function calcMonthlyAward(values, incomeOverFirstValue) {
  var monthlyAward = values['basicAmount'] + values['percent'] * (incomeOverFirstValue / 100);
  
  if (monthlyAward % 1 === 0) {
    return monthlyAward;
  } else {
    return monthlyAward.toFixed(2);
  }
}