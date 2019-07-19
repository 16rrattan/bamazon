var mysql = require("mysql");
var inquirer = require("inquirer");
var col = require("columnify")


var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "root",
    database: "bamazon_db"
});
connection.connect(function(err) {
    if (err) throw err;
    display();
});

function display() {

    var query = "SELECT * FROM products";
    connection.query(query, function(err, res) {
        if (err) throw err;

        console.log(col(res));
        start_end();

    });
};

function start_end() {
    inquirer
        .prompt({
            name: "action",
            type: "list",
            message: "What would you like to do?",
            choices: [
                "Purchase a product",
                "See the product list",
                "exit"
            ]
        })
        .then(function(answer) {
            switch (answer.action) {
                case "Purchase a product":
                    purchase();
                    break;

                case "See the product list":
                    display();
                    break;

                case "exit":
                    connection.end();
                    break;
            }
        });
}

function purchase() {
    inquirer
        .prompt([{
                name: "item_id",
                type: "input",
                message: "What is the id of the product you want to buy?"
            },
            {
                name: "amount",
                type: "input",
                message: "How much would you like to purchase?"
            }
        ])
        .then(function(answer) {
            var query = "SELECT item_id, product_name, department_name, price, stock_quantity FROM products WHERE ?";
            connection.query(query, { item_id: answer.item_id }, function(err, res) {
                if (err) throw err;

                console.log(col(res));
                if (res[0].stock_quantity >= answer.amount) {
                    var newstock = res[0].stock_quantity - answer.amount;
                    connection.query("UPDATE products SET ? WHERE ?", [{ stock_quantity: newstock }, { item_id: answer.item_id }], function(err, res) {});
                    var cost = res[0].price * answer.amount;
                    console.log("You paid $" + cost + " for your product")
                } else {
                    console.log("we do not have enough of that product")
                }
                start_end();

            });
        });

}