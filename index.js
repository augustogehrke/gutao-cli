#!/usr/bin/env node

const program = require('commander')
const package = require('./package.json')
const chalk = require('chalk')
const figlet = require('figlet')
const fs = require('fs')  

program.version(package.version)

//console.log(chalk.cyan(figlet.textSync('Gutao CLI')))

program
    .command('controller <name>')
    .description('Cria uma controller')
    .action((name) => {
      fs.readFile('./controller.js', 'utf8', function(err, data) {
        var busca = "opa"
        var strbusca = eval('/'+busca+'/g')
        var toWrite = data.replace(strbusca, 'teste')
        fs.writeFile(`./${name}Controller.js`, toWrite, function(err) {
          console.log(`${chalk.green(`${name}Controller.js criada com sucesso!`)}`)
        }); 
      });
    })

program.parse(process.argv)