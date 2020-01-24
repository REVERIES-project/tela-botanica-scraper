var mongoose = require('mongoose')
const mongoURL="mongodb://localhost:27017/smartflore"
mongoose.connect(mongoURL)
let Albiziapp=require('./model/albiziappTree')
Albiziapp.find({})
.exec((err,res)=>{
    for(let r of res){
        r.species=r.species.trim()
        r.save()
    }
})