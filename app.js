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
     //data structure
     var data = {
         allItems: {
             exp: [],
             inc: []
         },
         totals: {
             exp: 0, 
             inc: 0
         }
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

         testing: function() {
            console.log(data); 
         }
     };

})();

//UI CONTROLLER MODULE - private with public modules
var UIController = (function() {
    
    var DOMStrings = {
        inputType: '.add__type', 
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn'
    };

    return {
        getInput: function() {
            return {
                type: document.querySelector(DOMStrings.inputType).value, //values: either 'inc' or 'exp'
                description: document.querySelector(DOMStrings.inputDescription).value,
                value: document.querySelector(DOMStrings.inputValue).value
            };
        },
        
        addListItem: function(obj, type){
            //Create HTML String with some placehoder text
            if (type === 'inc') {

            }
            html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'

           html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'

            //Replace the placeholder text with some actual data

            //Insert 
        }

        getDOMStrings: function() {
            return DOMStrings; 
        }
    };
})(); 

//GLOBAL MODULE - public, calls UI and Budget Data
var controller = (function(budgetCrtl, UICtrl) {
    
    var setupEventListeners = function() {

        var DOM = UICtrl.getDOMStrings();
        
        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem); 
    
        document.addEventListener('keypress', function(event) {
            if(event.keyCode === 13 || event.which === 13) {
                ctrlAddItem(); 
            }
        }); 
    };
    
    var ctrlAddItem = function() {
        var input, newItem; 
        //get field data
        input = UICtrl.getInput(); 
        //add item to budget controller using data gathered in input
        newItem = budgetCrtl.addItem(input.type, input.description, input.value);
        //add item to UI 

    
        //calculate budget
    
        //display budget in the UI
    };

    return {
        init: function() {
            console.log('The application has started'); 
            setupEventListeners(); 
        }
    }

})(budgetController, UIController); 

controller.init(); 

