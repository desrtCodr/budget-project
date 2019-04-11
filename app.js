//enclose everything in an IIFE!
const budgetApp = (()=>{
//BUDGET CONTROLLER MODULE - private with public methods
var budgetController = (function() {
    //private function constructors for expense and income data 
     var Expense = function(id, description, value){
        this.id = id; 
        this.description = description; 
        this.value = value; 
        this.percentage = -1; 
    }; 
    Expense.prototype.calcPercentage = function(totalIncome) {
        if (totalIncome > 0) {
            this.percentage = Math.round(this.value / totalIncome * 100);
        } else {
            this.percentage = -1;
        }
    };
    Expense.prototype.getPercentage = function() {
        return this.percentage; 
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
    };

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
         deleteItem: function(type, id) {
            var ids, index; 
            //example: id = 6
            //map returns a new array (example: for inc, ids = [0, 2, 3, 6, 8]) 
            ids = data.allItems[type].map(function(current){
                return current.id; 
            }); 
            //in order to identify 6 from [0, 2, 3, 6, 8], we use index = 3
            index = ids.indexOf(id);
            //if id is not found, it returns -1; if found do the following
            if (index !== -1) {
                data.allItems[type].splice(index, 1); 
            }
         },
         calculateBudget: function() {
            //calculate sum of income and expense
            calculateTotal('inc'); 
            calculateTotal('exp'); 
            //calculate budget: income - expenses
            data.budget = data.totals.inc - data.totals.exp; 
            //calculate item percentage of total income
            if (data.totals.inc > 0)  {
                data.percentage = Math.round(data.totals.exp / data.budget * 100); 
            } else {
                data.percentage = -1;
            }
            
         },
         calculatePercentages: function() {

            data.allItems.exp.forEach(function(cur) {
                cur.calcPercentage(data.totals.inc); 
            });  
         },
         getPercentages: function() {
            var allPerc = data.allItems.exp.map(function(cur) {
                return cur.getPercentage(); 
            });
            return allPerc; 
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
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expensesPercLabel: '.item__percentage',
        dateLabel: '.budget__title--month'
    };
    var formatNumber = function(num, type) {
        var numSplit, int, dec, type; 
        num = Math.abs(num); //removes a negative sign if present
        num = num.toFixed(2); //num is rounded to 2 decimal points and converted to string
        numSplit = num.split('.'); 
        
        int = numSplit[0]; 
        if(int.length > 3) {
            int = int.substr(0, int.length - 3) + ',' + int.substr(length -3 , 3); 
        }
        dec = numSplit[1];

        return (type === 'exp' ? '-$' : '+$') + ' ' + int + '.' + dec;
    
    }; 
    
    var nodeListForEach = function(list, callback) {
        for (var i = 0; i < list.length; i++) {
            callback(list[i], i); 
        }
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
            var html,newHtml,element; 
            //Create HTML String with some placehoder text
            if (type === 'inc') {
                element = DOMStrings.incomeContainer; 
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            } else if (type === 'exp') {
                element = DOMStrings.expenseContainer; 
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }
            //Replace the placeholder text with some actual data one by one
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description); 
            newHtml = newHtml.replace('%value%', formatNumber(obj.value, type)); 
            //Insert new data into the correct container (either div class income__list or expense__list) 
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml); 
        },
        deleteListItem: function(selectorID){
            var el = document.getElementById(selectorID); 
            el.parentNode.removeChild(el);
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
            var type; 
            obj.budget >= 0 ? type = 'inc' : type = 'exp'; 
            document.querySelector(DOMStrings.budgetLabel).textContent = formatNumber(obj.budget, type);
            document.querySelector(DOMStrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
            document.querySelector(DOMStrings.expensesLabel).textContent = formatNumber(obj.totalExp, 'exp');
            if (obj.percentage > 0) {
                document.querySelector(DOMStrings.percentageLabel).textContent = obj.percentage + 
                '%';
            } else {
                document.querySelector(DOMStrings.percentageLabel).textContent = '--';
            }
        },
        displayPercentages: function(percentages) {
            var fields = document.querySelectorAll(DOMStrings.expensesPercLabel); 
            console.log(fields); 
            nodeListForEach(fields, function(current, index) {
                if (percentages[index] > 0) {
                    current.textContent = percentages[index] + '%'; 
                } else {
                    current.textContent = '---'; 
                }
            });
        },
        displayDate: function() {
            var now, year, month, monthNames; 
            monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            now = new Date(); 
            year = now.getFullYear(); 
            month = now.getMonth(); 

            document.querySelector(DOMStrings.dateLabel).textContent = monthNames[month] + ', ' + year; 
        },

        changeType: function() {
            var fields = document.querySelectorAll(
                DOMStrings.inputType + ',' +
                DOMStrings.inputDescription + ',' +
                DOMStrings.inputValue
            ); 
            nodeListForEach(fields, function(cur) {
                cur.classList.toggle('red-focus'); 
            })
            document.querySelector(DOMStrings.inputBtn).classList.toggle('red'); 
        },
        //allows other modules to use DOMString
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
        //add event handler to exp and inc items that are not on the page when first loaded
        //using event delegation (because of event bubbling)
        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
        document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changeType); 
    };
    var updateBudget = function() {
        //calculate budget
        budgetCrtl.calculateBudget(); 
        //return the budget
        var budget = budgetCrtl.getBudget(); 
        //display budget in the UI
        UICtrl.displayBudget(budget);
    };
    var updatePercentages = function() {
        //calculate percentages
        budgetCrtl.calculatePercentages(); 
        //read them from the budget controller
        var percentages = budgetCrtl.getPercentages(); 
        //update UI
        UICtrl.displayPercentages(percentages);
    }; 
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
            updatePercentages(); 
        }     
    };
    var ctrlDeleteItem = function(event) {
        var itemID, splitID, type, ID; 
        //get the container id (DOM traversing 4 levels up)
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
        if (itemID) {
            //split the id up 
            splitID = itemID.split('-'); 
            type = splitID[0];
            //convert ID string to a number because we need that to pass it to .deleteItem below
            ID = parseInt(splitID[1]);
            //delete item from data structure
            budgetCrtl.deleteItem(type, ID);
            //delete the item from the UI
            UICtrl.deleteListItem(itemID); 
            //update and show new budget
            updateBudget(); 
            updatePercentages(); 
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
            UIController.displayDate(); 
        }
    }

})(budgetController, UIController); 

controller.init(); 
})(); 