const cheerio = require('cheerio');
const chalk = require('chalk');
const rp = require('request-promise');
const fs = require('fs')
const path = require('path')
const _ = require('lodash')
const theUrl = require('url')

const Stopwatch = require('statman-stopwatch');
const stopwatch = new Stopwatch();


// basicUrls = ['https://www.mrksquincy.com/sitemap.xml', 'https://www.mrksquincy.com/about', 'https://www.mrksquincy.com/blog']

const scrapeHtml =  (urlArray) =>{

    stopwatch.start()
    let resourceCount = 0

     urlArray.forEach( url=>{


      const {
       protocol,
       slashes,
       host,
       query,
       href,
       pathname
     } = theUrl.parse(url);

     const htmlPath = path.join(__dirname, `/files/${pathname ? pathname : href}.html`)

    rp({
    uri: url
    })
    .then(html => {

            fs.writeFileSync(htmlPath, html)

            // console.log(chalk.bold.cyan(html))
            stopwatch.split()
            const theSplitTime = stopwatch.splitTime()/1000
            stopwatch.unsplit()
            console.log(chalk.bold.magenta(htmlPath))
            console.log(chalk.bgCyan(`Split time: ${theSplitTime} seconds`))
            resourceCount = resourceCount + 1


    })
    .catch(e=>{
     //console.log(chalk.bold.green(`It is Borken!`))
     console.log(chalk.bold.underline.red(`Problem: ${chalk.yellow(url)}`))
   })
    .finally(
      //console.log(`URL in review: ${url}`)

      console.log(`Another one done.`)

    )


})



process.on('exit', ()=>{
  console.log(chalk.bgBlue.bold.white('All Done!!'))
  const stopIt = stopwatch.stop()/1000
  console.log(chalk.bold.yellow(
    `
    **************************


    Total: ${resourceCount} pages in ${stopIt} seconds


    **************************`))

  });
}

// scrapeHtml(basicUrls)

module.exports = scrapeHtml
