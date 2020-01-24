var mongoose = require('mongoose')
const mongoURL="mongodb://localhost:27017/smartflore"
mongoose.connect(mongoURL)
let Albiziapp=require('./model/albiziappTree')

const csv = require('csv-parser')
const fs = require('fs')
const cheerio = require('cheerio')

const results = [];
extract=function(data,l){
    console.log('d')
    let r=[]
    const $ = cheerio.load(data)
    $('.smartflore-contenu-section .panel-body').each(function(i,el){
      Albiziapp.findOne({telaBotanicaTaxon:l.Taxon})
      .exec(function(err,res){
          console.log(res)
        if(res)
        switch (i) {
            case 0:
              res.description=$(this).html().trim()
              break;
            case 1:
              
              res.usage=$(this).html().trim()
    
              break;
            case 2:
                res.habitat=$(this).html().trim()
            }
        res.save()
        }.bind(this) )
    
      }) 
    
}
parseScraped=function(){
   // fs.readFile('./'+'182'+'.html',{encoding:'utf8'},(err,data)=>extract(data))
    console.log(results)
    for(let l of results){
    fs.readFile('./'+l.Taxon+'.html',{encoding:'utf8'},(err,data)=>extract(data,l))
    }
}
fs.createReadStream('treeList.csv')
  .pipe(csv({headers:['Taxon'],escape:' '}))
  .on('data', (data) => {if(data.Taxon && data.Taxon.length && /^\d+$/.test(data.Taxon))
    results.push(data)})
  .on('end', parseScraped
    // [
    //   { NAME: 'Daffy Duck', AGE: '24' },
    //   { NAME: 'Bugs Bunny', AGE: '22' }
    // ]
  );
