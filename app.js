//CONTROLLER MODULE
    //add event handler for checktBtn

//UI MODULE
    //get input values
    //add new item to UI
    //update the UI after budget calculations

//DATA MODULE
    //add new item to data
    //calculate budget


//BUDGET CONTROLLER MODULE - private with public methods
var budgetController = (function() {
    //private function constructors for expense and income data 
     var Expense = function(id, description, value){
        this.id = id; 
        this.description = description; 
        this.value = value; 
    }; 

     var Income = function(id, description, value){
        this.id = id; 
        this.description = description; 
        this.value = value; 
     };
     //function to calculate either expenses or income (using type)
     var calculateTotal = function(type) {
        var sum = 0; 
        data.allItems[type].forEach(function(cur) {
            sum += cur.value; 
        });
        data.totals[type] = sum; 
     }

     //data structure
     var data = {
         allItems: {
             exp: [],
             inc: []
         },
         totals: {
             exp: 0, 
             inc: 0
         },
         budget: 0,
         percentage: -1
     };
     //public methods 
     return {
         addItem: function(type, des, val) {
            var newItem, ID;
            //Create ID when addItem is called by selecting last id either inc or exp array and adding one
            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1; 
            } else {
                ID = 0; 
            }
            //determine if exp or inc and create new item with new id
            if (type === 'exp') {
                newItem = new Expense(ID, des, val); 
            } else if (type === 'inc') {
                newItem = new Income(ID, des, val);
            }
            //add new item to the correct array (inc or exp)
            data.allItems[type].push(newItem); 
            //return this new items to public space so other functions have access to it
            return newItem; 
         },

         calculateBudget: function() {
            //calculate sum of income
            calculateTotal('inc'); 
            calculateTotal('exp'); 
            //calculate sum of expenses
            data.budget = data.totals.inc - data.totals.exp; 
            //calculate budget: income - expenses
            data.percentage = Math.round(data.totals.exp / data.totals.inc * 100); 
            //calculate item percentage of total income
         },
         getBudget: function() {
            return {
                budget: data.budget, 
                totalInc: data.totals.inc, 
                totalExp: data.totals.exp,
                percentage: data.percentage
            }
         },

         testing: function() {
            console.log(data); 
         }
     };

})();

//UI CONTROLLER MODULE - private with public modules
var UIController = (function() {
    //declaring all the classes we'll call as variables (private)
    var DOMStrings = {
        inputType: '.add__type', 
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expenseContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage'
    };
    //makign some methods public for other modules to use 
    return {
        //method gets the 3 pieces of information from the input form (inc/exp, desc., value)
        getInput: function() {
            return {
                type: document.querySelector(DOMStrings.inputType).value, //values: either 'inc' or 'exp'
                description: document.querySelector(DOMStrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMStrings.inputValue).value)
            };
        },
        //takes the obj (id, description, value) and adds html to either column webpage depending on type (inc or exp)        
        addListItem: function(obj, type){
            var html, newHtml,element; 
            //Create HTML String with some placehoder text
            if (type === 'inc') {
                element = DOMStrings.incomeContainer; 
                html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            } else if (type === 'exp') {
                element = DOMStrings.expenseContainer; 
                html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }
            //Replace the placeholder text with some actual data one by one
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description); 
            newHtml = newHtml.replace('%value%', obj.value); 
            //Insert new data into the correct container (either div class income__list or expense__list) 
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml); 
        },
        clearFields: function() {
            var fields, fieldsArr; 
            //grab a HTML collection of descriptions and values
            fields = document.querySelectorAll(DOMStrings.inputDescription + ', ' + DOMStrings.inputValue); 
            //convert the HTML collection to an array by passing fields to the 'this' variable for the array prototype slice method
            fieldsArr = Array.prototype.slice.call(fields); 
            //use the forEach method to clear the fields (not using the index or array at this time)
            fieldsArr.forEach(function(current, index, array) {
                current.value = "";    
            });
            //return the focus to the description field for ease of adding new features
            fieldsArr[0].focus(); 
        },
        displayBudget: function(obj){
            document.querySelector(DOMStrings.budgetLabel).textContent = obj.budget;
            document.querySelector(DOMStrings.incomeLabel).textContent = obj.totalInc;
            document.querySelector(DOMStrings.expensesLabel).textContent = obj.totalExp;
            if (obj.percentage > 0) {
                document.querySelector(DOMStrings.percentageLabel).textContent = obj.percentage;
            } else {
                document.querySelector(DOMStrings.percentageLabel).textContent = '--';
            }
        },
        //allows other modules to use DOMStrings
        getDOMStrings: function() {
            return DOMStrings; 
        }
    };
})(); 

//GLOBAL MODULE - public, calls UI and Budget Data
var controller = (function(budgetCrtl, UICtrl) {
    //creating a funciton for eventlisteners as this is the key to using the app. this function starts everything! 
    var setupEventListeners = function() {
        //getting DOMStrings from UIController
        var DOM = UICtrl.getDOMStrings();
        //event listener for checkmark button that uses callback function ctrlAddItem  
        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem); 
        //event listener for the return key (.which is for older browsers)
        document.addEventListener('keypress', function(event) {
            if(event.keyCode === 13 || event.which === 13) {
                ctrlAddItem(); 
            }
        }); 
    };
    var updateBudget = function() {
        //calculate budget
        budgetCrtl.calculateBudget(); 
        //return the budget
        var budget = budgetCrtl.getBudget(); 
        //display budget in the UI
        UICtrl.displayBudget(budget);
    }
    //invoked by the eventlisterners above and adds data to data object and displays information to webpage
    var ctrlAddItem = function() {
        var input, newItem; 
        //get field data from form (getInput is defined in the UIcontroller module)
        input = UICtrl.getInput(); 
        if(input.description !== "" && !isNaN(input.value) && input.value > 0) {
            //add newly acqured date using budget controller method (creates id and pushes data to array)
            newItem = budgetCrtl.addItem(input.type, input.description, input.value);
            //use the new item (obj) and type (inc or exp) to add data via inserting html to website 
            UICtrl.addListItem(newItem, input.type);
            //clear the fields using UIController clearFields method
            UICtrl.clearFields(); 
            //calculate and update budget
            updateBudget(); 
            //update UI fields
        }

    };

    return {
        init: function() {
            console.log('The application has started'); 
            UICtrl.displayBudget({
                budget: 0, 
                totalInc: 0, 
                totalExp: 0,
                percentage: -1
            });
            setupEventListeners(); 
        }
    }

})(budgetController, UIController); 

controller.init(); 

