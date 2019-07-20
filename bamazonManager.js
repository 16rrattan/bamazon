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
    start_end();
});

function start_end() {
    inquirer
        .prompt({
            name: "action",
            type: "list",
            message: "What would you like to do?",
            choices: [
                "View Products for Sale",
                "View Low Inentory",
                "Add to Inventory",
                "Add New Product",
                "Exit"
            ]
        })
        .then(function(answer) {
            switch (answer.action) {
                case "View Products for Sale":
                    display();
                    break;

                case "View Low Inentory":
                    lowinventory();
                    break;

                case "Add to Inventory":
                    display();
                    break;

                case "Add New Product":
                    display();
                    break;

                case "Exit":
                    connection.end();
                    break;
            }
        });
}


function display() {
    console.log("display")
    var query = "SELECT * FROM products";
    connection.query(query, function(err, res) {
        if (err) throw err;

        console.log(col(res));
        start_end();

    });
};

function lowinventory() {
    var query = "SELECT product_name, stock_quantity FROM products"
    connection.query(query, function(err, res) {

        for (i = 0; i <= res.length; i++) {
            var stock = res[i].stock_quantity
            if (stock <= 5) {
                console.log("Product Name: " + res[i].product_name + "  ||  Quantity: " + res[i].stock_quantity)
            }
        }
        start_end()
    })


}