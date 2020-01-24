var mongoose = require('mongoose')
const mongoURL="mongodb://localhost:27017/smartflore"
mongoose.connect(mongoURL)
let Albiziapp=require('./model/albiziappTree')
let toCC=function(text){
    var result = text.replace( /([A-Z])/g, " $1" );
    return result.charAt(0).toUpperCase() + result.slice(1); // capitalize the first letter - as an example.

}
Albiziapp.find({})
.exec((err,res)=>{
    for(let r of res){
        r.species=toCC(r.species)
        r.save()
    }
})