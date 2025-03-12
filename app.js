const express = require("express");
const path = require("path")
const fs = require("fs")
const app = express();
const port = process.env.PORT || 4000
app.use(express.json())

app.use(express.urlencoded({extended:true}))
app.set("view engine" , "ejs")
app.use(express.static(path.join(__dirname,"public")))

app.get("/",(req,res)=>{
    fs.readdir(`./files` , function(err, files){
        res.render("index", {files:files})
    })
})

app.get("/tasks",(req,res)=>{
    fs.readdir(`./files` , function(err, files){
        res.render("tasks", {files:files})
    })
})

app.get("/about",(req,res)=>{
   res.render("about")
})

app.post("/create",(req,res)=>{
  const {title , description} =  req.body;
  fs.writeFile(`./files/${title.split(" ").join('')}.txt`, description ,'utf8' , function(err){
    res.redirect("/")
  })
})


app.get("/file/:filename",(req,res)=>{
    fs.readFile(`./files/${req.params.filename}`,'utf8' , function(err , filedata){
      res.render("show" , {filename:req.params.filename, filedata:filedata})
     
    })
  })


 
  app.get("/edit/:filename",(req,res)=>{
   if(req.method === "GET"){
    fs.readFile(`./files/${req.params.filename}`,'utf8' , function(err , filedata){
        res.render("edit" , {filename:req.params.filename, filedata:filedata})
       
      })    
   }
   
  })

  app.post("/edit",(req,res)=>{
    fs.rename(`./files/${req.body.previous}` ,`./files/${req.body.new}.txt` ,(err)=>{
        if (err) {
            console.error('Error deleting file:', err);
          } else {
            res.redirect("/")
          }
 
 }) 
})





app.get("/delete/:filename" , (req,res)=>{
    fs.unlink(`./files/${req.params.filename}`, (err) => {
        if (err) {
          console.error('Error deleting file:', err);
        } else {
          res.redirect("/")
        }
      });
})






app.listen(port , (err)=>{
    if(!err){
        console.log(`app is running ${port}`)
    }else{
        console.log("app is not running")
    }
})