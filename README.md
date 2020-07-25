# GUTAO CLI

O presente projeto é um cli com objetivo de automatizar a criação de controllers com os 5 endpoints base e models com seus relacionamentos em um projeto utilizando framework adonis.js

## Instalação
`git clone https://github.com/augustogehrke/gutao-cli.git`
`npm install`
`npm link`

**Pronto!** O cli já está disponível para utilização. 

## Comandos disponíveis 
**OBS:** Esteja na raiz do projeto que deseja criar a controller.

`gutao --help` - Lista os comandos disponíveis

`gutao controller [nome da controller]` - Informe as propriedades e a controller será criada.

Ex: 
`gutao controller test` 
Propriedades informadas: name address contact


Será criado o arquivo {seu projeto}/app/Controllers/Http/TestController.js 
```
'use strict'

const Test = use('App/Models/Test')

class TestController {
  async index () {
    return await Test.all()
  }

  async show ({ params }) {
    const test = await Test.findOrFail(params.id)
    // await test.load('')
    return test
  }

  async store ({ request }) {
    const data = request.only([
      'name',
      'address',
      'contact'
    ])

    return await Test.create(data)
  }

  async update ({ params, request }) {
    const test = await Test.findOrFail(params.id)
    const data = request.only([
      'name',
      'address',
      'contact'
    ])

    test.merge(data)

    return await test.save()
  }

  async destroy ({ params }) {
    const test = await Test.findOrFail(params.id)
    return await test.delete()
  }
}

module.exports = TestController
```

`gutao model [nome da model]` - Informe o nome dos relacionamentos e o seu tipo (hm ou bt)

Ex: `gutao model test` 
Propriedades informadas: user-bt place-hm

Será criado o arquivo {seu projeto}/app/Models/Test.js 

```
'use strict'

const Model = use('Model')

class Test extends Model {
  user () {
    return this.belongsTo('App/Models/User')
  }

  places () {
    return this.hasMany('App/Models/Place')
  }
}

module.exports = Test

```

