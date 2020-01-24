let express = require('express')

var mongoose = require('mongoose')
const mongoURL="mongodb://localhost:27017/smartflore"
mongoose.connect(mongoURL)
let Albiziapp=require('./model/albiziappTree')

let app=express()
app.get('/:id',function(req,res){
    Albiziapp.findOne({telaBotanicaTaxon:req.params.id})
    .exec((err,result)=>{
        if(!result){
            res.send("no images")
            return
        }
        let image=result.images[0]
        var img = new Buffer(image.split(',')[1], 'base64');
        res.writeHead(200, {
          'Content-Type': 'image/png',
          'Content-Length': img.length 
        });
        res.end(img);
          })
})
app.listen(3000)

