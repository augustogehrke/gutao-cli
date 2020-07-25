#!/usr/bin/env node

const program = require('commander')
const package = require('./package.json')
const chalk = require('chalk')
const figlet = require('figlet')
const fs = require('fs')
const inquirer = require('inquirer')
const shell = require('shelljs')
let pathProject = ''

shell.exec('pwd', { async: true, silent: true }, (code, stdout, stderr) => {
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
      fs.readFile(`../gutao-cli/controller.js`, 'utf8', (err, data) => {
        properties = answers.properties.split(' ')
        propertiesTemplate = ''
        for (let index = 1; index <= properties.length; index++) {
          if (index === properties.length) {
            propertiesTemplate += `'${properties[index-1]}'`
            break;
          }
          propertiesTemplate += `'${properties[index-1]}',\n      `
        }
        toWrite = data.replace(eval('/properties/g'), propertiesTemplate)
        toWrite = toWrite.replace(eval('/Instance/g'), name.charAt(0).toUpperCase() + name.substring(1))
        toWrite = toWrite.replace(eval('/instance/g'), name)
        name = name.charAt(0).toUpperCase() + name.substring(1)
        fs.writeFile(`${pathProject}/app/Controllers/Http/${name}Controller.js`, toWrite, (err) => {
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
        name: 'relationshio',
        message: 'Relacionamentos da model. Ex: user-hm , user-bt'
      }
    ]).then(answers => {
      fs.readFile(`../gutao-cli/model.js`, 'utf8', (err, data) => {
        fileName = name.charAt(0).toUpperCase() + name.substring(1)
        relationshio = answers.relationshio.split(' ')
        relTemplate = ''
        last = false
        for (let index = 1; index <= relationshio.length; index++) {
          if (index === relationshio.length) {
            last = true
          }

          actions = relationshio[index-1].split('-')
          lastPal = actions[0].charAt(actions[0].length-1)
          if (actions[1] == 'hm') {
            sub = actions[0].charAt(0).toUpperCase() + actions[0].substring(1)
            if (lastPal == 'y') {
              relTemplate += `  ${actions[0].replace(/y([^y]*)$/, 'ies$1')} () {\n    return this.hasMany('App/Models/${sub}')\n  }`;
              relTemplate += last == false ? '\n\n': ''
            } else {
              relTemplate += `  ${actions[0]}s () {\n    return this.hasMany('App/Models/${sub}')\n  }`
              relTemplate += last == false ? '\n\n': ''
            }
          }
          if (actions[1] == 'bt') {
            sub = actions[0].charAt(0).toUpperCase() + actions[0].substring(1)
            relTemplate += `  ${actions[0].replace(/y([^y]*)$/, 'ies$1')} () {\n    return this.belongsTo('App/Models/${sub}')\n  }`;
            relTemplate += last == false ? '\n\n': ''
          }
        }
        
        toWrite = data.replace(eval('/Instance/g'), fileName)
        toWrite = toWrite.replace('rel', relTemplate)
        fs.writeFile(`${pathProject}/app/Models/${fileName}.js`, toWrite, (err) => {
          console.log(`${chalk.green(`${fileName}.js criada com sucesso!`)}`)
        })
      })
    })
  })

program.parse(process.argv)