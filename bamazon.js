const mysql = require("mysql"),
      inquirer = require("inquirer");
require("console.table");
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "root",
  database: "bamazon_db"
});

connection.connect(function(err) {
  if (err) {
    console.error("error connecting: " + err.stack);
  }
  readItems();
});

function readItems() {
  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;
    console.table(res);
    userPick(res);
  });
}

function userPick(inv) {
  inquirer
    .prompt([{
        message: "What is the ID of the item you would you like to purchase?",
        type: "input",
        name: "userSelect",
        validate: function(val) {
          return !isNaN(val) 
        }
      }
    ]).then(function(response) {
      var userPickId = number(response.userSelect),
          item = checkDB(userPickId, inv);
      if (item) {
        howMany(item);
      }
      else {
        console.log("\nThat item does not exist.");
        readItems();
      }
    });
}

function checkDB(userPickId, inv) {
  for (var i = 0; i < inv.length; i++) {
    if (inv[i].id === userPickId) {
      return inv[i];
    }
  }
  return console.log("We don't sell that Item!")
}

function howMany(product) {
  inquirer
    .prompt([{
        message: "How many would you like?",
        type: "input",
        name: "quantity",
        validate: function(val) {
          return val > 0 
        }
      }
    ]).then(function(val) {
      var quantity = number(val.quantity);
      if (quantity > product.stock_quantity) {
        console.log("\nInsufficient quantity!");
        loadProducts();
      }else {
        purchase(product, quantity);
      }
    });
};
function purchase(product, quantity) {
  connection.query(
    "UPDATE products SET stock_quantity = stock_quantity - ? WHERE item_id = ?",
    [quantity, product.id],
    function() {
      console.log("\nSuccessfully purchased " + quantity + " " + product.product_name + "'s!");
      connection.end();
    }
  );
};


// function updateProduct() {
//   console.log("Updating all Rocky Road quantities...\n");

//   var query = connection.query(
//     "UPDATE products SET ? WHERE ?",
//     // note that if you're adding more than one object then you must use brackets and turn it into an array
//     [
//       {
//         quantity: 100
//       },
//       {
//         flavor: "Rocky Road"
//       }
//     ],
//     function(err, res) {
//       console.log(res.affectedRows + " products updated!\n");
//       // Call deleteProduct AFTER the UPDATE completes
//       deleteProduct();
//     }
//   );

// inquirer
// .prompt(

//     {
//     type: "list",
//     message: "Would you like to post an item or bid on an item",
//     choices: ["Post Item", "Bid on Item"],
//     name: "prompt"
//     },
// )
// .then(function(inquirerResponse) {
    
//     if (inquirerResponse.prompt == "Post Item") {

//     inquirer.prompt([
//     {
//     type: "input",
//     message: "What is your name?",
//     name: "name"
//     },
//     {
//     type: "input",
//     message: "What item would you like to post?",
//     name: "itemName"
//     },
//     {
//     type: "input",
//     message: "What is the starting bid on your item?",
//     name: "startingBid"
//     },
//  ])

//     }else {
//         readItems();
//         inquirer.prompt([
//         {
//         type: "input",
//         message: "What is your name?",
//         name: "name"
//         },
//         {
//         type: "input",
//         message: "What item would you like to bid on?",
//         name: "itemName"
//         },
//         {
//         type: "input",
//         message: "How much would you like to bid?",
//         name: "userBid"
//         },
//         ])
//         createItem();

//     }
// });

//     function readItems() {
//     console.log("Selecting all Items!\n");
//     connection.query("SELECT * FROM items", function(err, res) {
//         if (err) throw err;
//         // Log all results of the SELECT statement
//         console.log(res);
//         connection.end();
//     });
//     }