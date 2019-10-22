#!/usr/bin/env node

const program = require('commander')
const package = require('./package.json')
const chalk = require('chalk')
const figlet = require('figlet')
const fs = require('fs')
const inquirer = require('inquirer')

/**
 * Define em qual projeto deseja rodar
 */
const pathProject = '/var/www/api-minicurso/app/Controllers/Http'

program.version(package.version)

console.log(chalk.cyan(figlet.textSync('Gutao CLI')))

program
    .command('controller <name>')
    .description('Cria uma controller')
    .action((name) => {
      inquirer.prompt([
        {
          type: 'input',
          name: 'properties',
          message: 'Propriedades da Controller'
        }
      ]).then(answers => {
        fs.readFile(`../gutao-cli/controller.js`, 'utf8', function(err, data) {
          properties = answers.properties.split(' ')
          propertiesHtml = ''
          for (let index = 1; index <= properties.length; index++) {
            if (index === properties.length) {
              propertiesHtml += `"${properties[index-1]}"`
              break;
            }
            propertiesHtml += `"${properties[index-1]}",\n      `
          }
          toWrite = data.replace(eval('/properties/g'), propertiesHtml)
          toWrite = toWrite.replace(eval('/Instance/g'), name.charAt(0).toUpperCase() + name.substring(1))
          toWrite = toWrite.replace(eval('/instance/g'), name)
          fs.writeFile(`${pathProject}/${name}Controller.js`, toWrite, function(err) {
            console.log(`${chalk.green(`${name}Controller.js criada com sucesso!`)}`)
          })
        })
      })
    })

program.parse(process.argv)