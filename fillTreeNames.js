var mongoose = require('mongoose')
const mongoURL="mongodb://localhost:27017/smartflore"
mongoose.connect(mongoURL)
let Albiziapp=require('./model/albiziappTree')
const csv = require('csv-parser')
const fs = require('fs')

fs.createReadStream('treeList.csv')
  .pipe(csv({headers:['taxon','species','common_genus','genus','common'],escape:' '}))
  .on('data', (data) => {
    if(data.taxon){
        
        albiziappTree.telaBotanicaTaxon=data.taxon
        albiziappTree.species=data.species
        albiziappTree.genus=data.genus
        albiziappTree.common_genus=data.common_genus
        albiziappTree.common=data.common
        albiziappTree.save()
    }
})
