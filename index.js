var mongoose = require('mongoose')
const mongoURL="mongodb://localhost:27017/smartflore"
mongoose.connect(mongoURL)

const csv = require('csv-parser')
const baseURL='https://www.tela-botanica.org/eflore/consultation/index_mobile.php?module=mobile&referentiel=bdtfx&num_nom='
const fs = require('fs')
var rp = require('request-promise');
const cheerio = require('cheerio')

const results = [];
let scrapeResult=async function(){
    for(let l of results){
        let toParse=baseURL+l.Taxon
        await rp(toParse).then((res)=>{fs.writeFile(l.Taxon+'.html',res)})
    }
    
}
extract=function(data,l){
    console.log()
    let r=[]
    const $ = cheerio.load(data,{ decodeEntities: false })
    /*
    $('.smartflore-contenu-section .panel-body').each(function(i,el){
      switch (i) {
        case 0:
          console.log('Description')
          console.log($(this).html().trim())
          break;
        case 1:
          console.log('Usage')
          console.log($(this).html().trim())

          break;
        case 2:
          console.log('Habitat')
          console.log($(this).html().trim())

        }} )*/
      $('.img-responsive').each(function(i,el){
        console.log($(this).attr('src'))

      }
      )
    
}
parseScraped=function(){
   // fs.readFile('./'+'182'+'.html',{encoding:'utf8'},(err,data)=>extract(data))
    for(let l of results){
    fs.readFile('./'+l.Taxon+'.html',{encoding:'utf8'},(err,data)=>extract(data,l))
    }
}
fs.createReadStream('treeList.csv')
  .pipe(csv({headers:['Taxon'],escape:' '}))
  .on('data', (data) => {if(data.Taxon && data.Taxon.length && /^\d+$/.test(data.Taxon)>0)
    results.push(data)})
  .on('end', parseScraped
    // [
    //   { NAME: 'Daffy Duck', AGE: '24' },
    //   { NAME: 'Bugs Bunny', AGE: '22' }
    // ]
  );
