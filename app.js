const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const date = require(__dirname + "/views/date.js");
const _ = require("lodash");

const app = express();

mongoose.connect("mongodb+srv://admin-sonila:Serxho12..@cluster0.ecnfk.mongodb.net/todolistDB", {useNewUrlParser: true});

const itemsSchema =  mongoose.Schema ({
  name: String
});

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item ({
  name: "Go to work"
});

const item2 = new Item ({
  name: "Go shopping"
});

const item3 = new Item ({
  name: "Cook"
});

const defaultItems = [item1, item2, item3];

const listSchema = {
  name:String,
  items: [itemsSchema]
};

const List = mongoose.model("List", listSchema);



app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", function(req, res){

  Item.find({}, function(err, foundItems){

     if (foundItems.length === 0) {

       Item.insertMany(defaultItems, function(err){
         if(err) {
           console.log("error");
         } else {
           console.log("Items successfully added.")
         }
       });
      res.redirect("/");
     } else {
       res.render("list", {listTitle: "Today", newListItems: foundItems});
     }
  });
});

app.post("/", function(req, res){

  const itemName = req.body.newItem;
  const listName = req.body.list;


  const item = new Item({
    name: itemName
  });

  if(listName === "Today"){
    item.save();
    res.redirect("/");
  } else {
    List.findOne({name: listName}, function(err,foundList){
      foundList.items.push(item);
      foundList.save();
      res.redirect("/"+ listName);
    });
  }
});

app.post("/delete", function(req, res){
  const checkedItemId = req.body.checkbox;
  const listName = req.body.listName;

  if(listName === "Today") {
    Item.findByIdAndRemove(checkedItemId, function(err){
      if(err) {
        console.log("error");
      } else {
        console.log("Item successfully deleted.");
        res.redirect("/");
      }
    });
  } else {
    List.findOneAndUpdate({name:listName}, {$pull: {items:{_id: checkedItemId}}}, function(err, foundList){
      if(!err){
        res.redirect("/"+listName);
      }
    });
  }

});


app.get("/:customListName", function(req, res){
   const customListName = _.capitalize(req.params.customListName);

   List.findOne({name: customListName}, function(err, foundList){
     if(!err) {
       if(!foundList){
    // Create a new list
    const list = new List({
      name: customListName,
      items: defaultItems
    });

    list.save();
    res.redirect("/" + customListName);
     } else {
      // Show an existing list
      res.render("list", {listTitle: foundList.name, newListItems: foundList.items});
   }
 }

 });

});

app.get("/about", function(req, res){
  res.render("about")
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port);

app.listen(port, function(){
console.log("Server is up and running");
});
