var mongoose = require('mongoose')
const mongoURL="mongodb://localhost:27017/smartflore"
mongoose.connect(mongoURL)
var base64Img = require('base64-img');
const util =require('util')
const csv = require('csv-parser')
const fs = require('fs')
var rp = require('request-promise');
const cheerio = require('cheerio')
var bluebird=require('bluebird')
const results = [];
let imagesURL=[]
let Albiziapp=require('./model/albiziappTree')

let getB64=bluebird.promisify(base64Img.requestBase64,{multiArgs:true})
let scrapeResult=async function(){
    let j=0
    for(let l of imagesURL){
        let images=[]
        let i=0
        for(let src of l.src){
            j++
            console.log('processing image ' + j + ' over 800')
            var image= await getB64(src)
            images.push(image[1])
        }

        Albiziapp.findOne({telaBotanicaTaxon:l.taxon})
        .exec(function(err,res){
            console.log(err)
            console.log(res)
            if(res){
            res.images=images
           // console.log(images)
            res.save()
            }
        })
        //var image= await getB64(l)
        //console.log(image[1])
    }
    
}
//base64Img.requestBase64('https://api.tela-botanica.org/img:000177649S.jpg',(err,res,body)=>console.log(typeof body))
//rp.get({url:'https://api.tela-botanica.org/img:000177649S.jpg',encoding:null})
extract=function(data,l){
    let r=[]
    const $ = cheerio.load(data,{ decodeEntities: false })
    let taxonObject={taxon:l.Taxon,src:[]}
      $('.img-responsive').each(function(i,el){
        taxonObject.src.push($(this).attr('src'))
      }
      )
      imagesURL.push(taxonObject)
}

parseScraped=function(){
    // fs.readFile('./'+'182'+'.html',{encoding:'utf8'},(err,data)=>extract(data))
     for(let l of results){
     extract(fs.readFileSync('./'+l.Taxon+'.html',{encoding:'utf8'}),l)
     }
     console.log(imagesURL)
    scrapeResult()
}
 fs.createReadStream('treeList.csv')
   .pipe(csv({headers:['Taxon'],escape:' '}))
   .on('data', (data) => {if(data.Taxon && data.Taxon.length && /^\d+$/.test(data.Taxon)>0)
     results.push(data)})
   .on('end', parseScraped
   );
 
