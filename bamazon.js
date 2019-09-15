var mysql = require('mysql');
var inquirer = require('inquirer');

var connection = mysql.createConnection({
  host:"localhost",
  port:3000,
  user:"root",
  password:"dane123",
  database:"bamazon"
});

connection.connect(function(err){
  if (err) throw err;
  console.log("connection sucessful!");
  makeTable();

});

var makeTable = function() {
  connection.query("SELECT * FROM product", function(err, res) {
    for(var i=0; i<res.length; i++) {
      console.log(res[i].itemid+" || "+res[i].productname+" || "+res[i].departmentname+" || "+res[i].price+" || "+res[i].stockquantity+"\n");
    }
  })
}

var promptCustomer = function(res){
  inquirer.prompt([{
    type:'input',
    name:'choice',
    message:"What would you liek to purchase?"
  }]).then(function(answer){
    var correct = false;
    for(var i=0;i<res.length;i++){
      if(res[i].productname==answer.choice){
        correct=true;
        var product=answer.choice;
        var id=i;
        inquirer.prompt({
          type:"input",
          name:"quant",
          message:"How many would you like to buy?",
          validate: function(value){
            if(isNaN(value)==false){
              return true;
            } else {
              return false;
            }
          } 
        }).then(function(answer){
          if((res[id].stockquantity-answer.quant)>0){
            connection.query("UPDATE products SET
            stockquantity='"+(res[id].stockquantity-answer.quant)+"' WHERE ,productname=' " + product + "'", function(err, res) {
              console.log("Product Bought!");
              makeTable();
            })
          } else {
            console.log("Not a valid selecion!");
            promptCustomer(res);
          }
        });
      }
    }
  });
};