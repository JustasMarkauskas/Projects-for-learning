//BUDGET CONTROLLER
var budgetController = (function () {
  var Expense = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
    this.percentage = -1;
  };

  Expense.prototype.calculatePercentages = function (totalInc) {
    if (totalInc > 0) {
      this.percentage = Math.round((this.value / totalInc) * 100);
    } else {
      this.percentage = -1;
    }
  };

  Expense.prototype.getPercentage = function () {
    return this.percentage;
  };

  var Income = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  calculateTotal = function (type) {
    var sum = 0;
    data.allItems[type].forEach(function (cur) {
      sum += cur.value;
    });
    data.totals[type] = sum;
  };

  var data = {
    allItems: {
      exp: [],
      inc: [],
    },
    totals: {
      exp: 0,
      inc: 0,
    },
    budget: 0,
    percentage: -1,
  };

  return {
    addItem: function (type, des, val) {
      var newItem;

      //Create new ID
      if (data.allItems[type].length > 0) {
        ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
      } else {
        ID = 0;
      }

      //Create new item based on 'inc' or 'exp' type
      if (type === "exp") {
        newItem = new Expense(ID, des, val);
      } else if (type === "inc") {
        newItem = new Income(ID, des, val);
      }

      //Push it into data structure
      data.allItems[type].push(newItem);

      //Return the new element
      return newItem;
    },

    deleteItem: function (type, id) {
      var ids = data.allItems[type].map(function (current) {
        return current.id;
      });

      index = ids.indexOf(id);

      if (index != -1) {
        data.allItems[type].splice(index, 1);
      }
    },

    calculateBudget: function () {
      // calculate total income and expenses
      calculateTotal("exp");
      calculateTotal("inc");
      // calculate the budget: income-expenses
      data.budget = data.totals.inc - data.totals.exp;
      //calculate the percentage of income that we spend

      if (data.totals.inc > 0) {
        data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
      } else {
        data.percentage = -1;
      }
    },

    calculatePercentages: function () {
      data.allItems.exp.forEach(function (cur) {
        cur.calculatePercentages(data.totals.inc);
      });
    },
    getPercentage: function () {
      var allPerc = data.allItems.exp.map(function (cur) {
        return cur.getPercentage();
      });
      return allPerc;
    },

    getBudget: function () {
      return {
        budget: data.budget,
        totalInc: data.totals.inc,
        totalExp: data.totals.exp,
        percentage: data.percentage,
      };
    },

    testing: function () {
      console.log(data);
    },
  };
})();



//UI CONTROLLER
var UIController = (function () {
  var DOMStrings = {
    inputType: ".add__type",
    description: ".add__description",
    value: ".add__value",
    addButton: ".add__btn",
    incomeContainer: ".income__list",
    expensesContainer: ".expenses__list",
    budgetLabel: ".budget__value",
    incomeLabel: ".budget__income--value",
    expensesLabel: ".budget__expenses--value",
    percentageLabel: ".budget__expenses--percentage",
    container: ".container",
    expensesPercentageLabel: ".item__percentage",
    dateLabel: ".budget__title--month"
  };

  var nodeListForEach = function (list, callback) {
    for (var i = 0; i < list.length; i++) {
      callback(list[i], i);
    }
  };


  return {
    getInput: function () {
      return {
        type: document.querySelector(DOMStrings.inputType).value, // Will be either inc or exp
        description: document.querySelector(DOMStrings.description).value,
        value: parseFloat(document.querySelector(DOMStrings.value).value),
      };
    },

    addListItem: function (obj, type) {
      var html, newHtml;
      //Create HTML string with placeholder text
      if (type === "inc") {
        element = DOMStrings.incomeContainer;
        html =
          '<div class="item clearfix" id="inc-%id%"> <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      } else if (type === "exp") {
        element = DOMStrings.expensesContainer;
        html =
          '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      }
      //Replace the placeholder text with some actual data
      newHtml = html.replace("%id%", obj.id);
      newHtml = newHtml.replace("%description%", obj.description);
      newHtml = newHtml.replace("%value%", this.formatNumber(obj.value, type));

      //Insert HTM to the DOM

      document.querySelector(element).insertAdjacentHTML("beforeend", newHtml);
    },

    deleteListItem: function (selectorID) {
      var el = document.getElementById(selectorID);

      el.parentNode.removeChild(el);
    },

    clearFields: function () {
      var fields, fieldsArray;
      fields = document.querySelectorAll(
        DOMStrings.description + ", " + DOMStrings.value
      );

      fieldsArray = Array.prototype.slice.call(fields);
      console.log(fieldsArray);
      fieldsArray.forEach(function (current, index, array) {
        current.value = "";
      });
      fieldsArray[0].focus();
      //console.log(fieldsArray);
    },

    displayBudget: function (obj) {
      var type;
      obj.budget > 0 ? (type = "inc") : (type = "exp");
      
      document.querySelector(DOMStrings.budgetLabel).textContent = this.formatNumber(obj.budget, type);
      document.querySelector(DOMStrings.incomeLabel).textContent = this.formatNumber(obj.totalInc,'inc')
      document.querySelector(DOMStrings.expensesLabel).textContent =this.formatNumber(obj.totalExp,'exp')

      if (obj.percentage > 0) {document.querySelector(DOMStrings.percentageLabel).textContent =obj.percentage + "%";
      } else {
        document.querySelector(DOMStrings.percentageLabel).textContent = "---";
      }
    },

    displayPercentages: function (percentage) {
      var fields = document.querySelectorAll(DOMStrings.expensesPercentageLabel);

      

      nodeListForEach(fields, function (current, index) {
        if (percentage[index] > 0) {
          current.textContent = percentage[index] + "%";
        } else {
          current.textContent = "---";
        }
      });
    },

    formatNumber: function (num, type) {
      // +/- .00 and 1,000 12345.4452 ==> 12,345.45
      var numSplit, int, dec;
      num = Math.abs(num);
      num = num.toFixed(2);

      numSplit = num.split(".");
      int = numSplit[0];

      if (int.length > 3) {
        int =
          int.substr(0, int.length - 3) + "," + int.substr(int.length - 3, 3);
      }
      dec = numSplit[1];

      type === "exp" ? (sign = "-") : (sign = "+");

      return (type === "exp" ? "-" : "+") + int + "." + dec;
    },

    displayMonth: function(){
      var now, year, month, day, months;
      
      now = new Date();
      year = now.getFullYear();
      months=['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      month=now.getMonth();
      day = now.getDay();


      document.querySelector(DOMStrings.dateLabel).textContent = year+' '+months[month]+' '+day;
    },

    changedType: function() {
      var fields = document.querySelectorAll(DOMStrings.inputType +','+DOMStrings.description + ',' + DOMStrings.value);
      
      nodeListForEach(fields, function(cur){
        cur.classList.toggle('red-focus');
      });

      document.querySelector(DOMStrings.addButton).classList.toggle('red');
  },

    getDOMstrings: function () {
      return DOMStrings;
    },
  };
})();

//GLOBAL APP CONTROLLER
var controller = (function (budgetCtl, UICtrl) {
  var setupEventListeners = function () {
    var DOM = UICtrl.getDOMstrings();

    document.querySelector(DOM.addButton).addEventListener("click", ctrlAddItem);

    document.addEventListener("keypress", function (event) {
      if (event.keyCode === 13 || event.which === 13) {
        ctrlAddItem();
      }
    });

    document.querySelector(DOM.container).addEventListener("click", ctrlDeleteItem);

    document.querySelector(DOM.inputType).addEventListener('change', UIController.changedType);
  };

  var updateBudget = function () {
    //1. Calculate the budget
    budgetController.calculateBudget();
    //2. return the budget
    var budget = budgetController.getBudget();
    //3. Display the budget tu the UI
    //console.log(budget);
    UIController.displayBudget(budget);
  };

  updatePercentages = function () {
    //1. Calculate the Percentages
    budgetController.calculatePercentages();
    //2. Read percentages from budget controler
    var percentages = budgetController.getPercentage();
    //3. Update UI with the new percentages
    UIController.displayPercentages(percentages);
    console.log(percentages);
  };

  var ctrlAddItem = function () {
    var input, newItem;

    //1. Get the field input data
    input = UICtrl.getInput();

    if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
      //2. Add the item to the budget controller
      newItem = budgetCtl.addItem(input.type, input.description, input.value);
      //3. Add the item to the UI
      UICtrl.addListItem(newItem, input.type);
      //4. Clearing fields
      UICtrl.clearFields();
      //5. calculate and update budget
      updateBudget();
      //6. Calculate and update percentages
      updatePercentages();
    }

    //console.log("object");
  };

  var ctrlDeleteItem = function (event) {
    var itemID, splitID, type, ID;

    itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

    if (itemID) {
      //inc-1
      splitID = itemID.split("-");
      type = splitID[0];
      ID = parseInt(splitID[1]);

      //1. Delete the item from the data structure
      budgetController.deleteItem(type, ID);
      //2. Delete item from the UI
      UIController.deleteListItem(itemID);
      //3. Update and show the new budget
      updateBudget();
      //4. Calculate and update percentages
      updatePercentages();
    }
  };

  return {
    init: function () {
      console.log("Application has started.");
      UIController.displayMonth();
      UIController.displayBudget({
        budget: 0,
        totalInc: 0,
        totalExp: 0,
        percentage: -1,
      });
      setupEventListeners();
    },
  };
})(budgetController, UIController);

controller.init();
