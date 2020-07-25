#!/usr/bin/env node

const program = require('commander')
const package = require('./package.json')
const chalk = require('chalk')
const figlet = require('figlet')
const fs = require('fs')
const inquirer = require('inquirer')
const shell = require('shelljs')
let pathProject = ''

shell.exec('pwd', { async:true, silent:true }, function(code, stdout, stderr) {
  pathProject = stdout.trim()
})

program.version(package.version)
console.log(chalk.cyan(figlet.textSync('Gutao CLI')))

program
  .command('controller <propriedades>')
  .description('Cria uma controller')
  .action((name) => {
    inquirer.prompt([
      {
        type: 'input',
        name: 'properties',
        message: 'Propriedades da Controller. EX: prop1 prop2'
      }
    ]).then(answers => {
      fs.readFile(`../gutao-cli/controller.js`, 'utf8', function(err, data) {
        properties = answers.properties.split(' ')
        propertiesHtml = ''
        for (let index = 1; index <= properties.length; index++) {
          if (index === properties.length) {
            propertiesHtml += `'${properties[index-1]}'`
            break;
          }
          propertiesHtml += `'${properties[index-1]}',\n      `
        }
        toWrite = data.replace(eval('/properties/g'), propertiesHtml)
        toWrite = toWrite.replace(eval('/Instance/g'), name.charAt(0).toUpperCase() + name.substring(1))
        toWrite = toWrite.replace(eval('/instance/g'), name)
        name = name.charAt(0).toUpperCase() + name.substring(1)
        fs.writeFile(`${pathProject}/app/Controllers/Http/${name}Controller.js`, toWrite, function(err) {
          console.log(`${chalk.green(`${name}Controller.js criada com sucesso!`)}`)
        })
      })
    })
  })

program
  .command('model <propriedades>')
  .description('Cria uma model')
  .action((name) => {
    inquirer.prompt([
      {
        type: 'input',
        name: 'rels',
        message: 'Relacionamentos da model. Ex: user-hm , user-bt'
      }
    ]).then(answers => {
      fs.readFile(`../gutao-cli/model.js`, 'utf8', function(err, data) {
        fileName = name.charAt(0).toUpperCase() + name.substring(1)
        rels = answers.rels.split(' ')
        relsHtml = ''
        last = false
        for (let index = 1; index <= rels.length; index++) {
          if (index === rels.length) {
            last = true
          }

          actions = rels[index-1].split('-')
          lastPal = actions[0].charAt(actions[0].length-1)
          if (actions[1] == 'hm') {
            sub = actions[0].charAt(0).toUpperCase() + actions[0].substring(1)
            if (lastPal == 'y') {
              relsHtml += `  ${actions[0].replace(/y([^y]*)$/, 'ies$1')}() {\n    return this.hasMany('App/Models/${sub}')\n  }`;
              relsHtml += last == false ? '\n\n': ''
            } else {
              relsHtml += `  ${actions[0]}s() {\n    return this.hasMany('App/Models/${sub}')\n  }`
              relsHtml += last == false ? '\n\n': ''
            }
          }
          if (actions[1] == 'bt') {
            sub = actions[0].charAt(0).toUpperCase() + actions[0].substring(1)
            relsHtml += `  ${actions[0].replace(/y([^y]*)$/, 'ies$1')}() {\n    return this.belongsTo('App/Models/${sub}')\n  }`;
            relsHtml += last == false ? '\n\n': ''
          }
          // TO DO: IMPLEMENTAR OUTROS RELACIONAMENTOS
        }
        
        toWrite = data.replace(eval('/Instance/g'), fileName)
        toWrite = toWrite.replace('rel', relsHtml)
        fs.writeFile(`${pathProject}/app/Models/${fileName}.js`, toWrite, function(err) {
          console.log(`${chalk.green(`${fileName}.js criada com sucesso!`)}`)
        })
      })
    })
  })

program.parse(process.argv)