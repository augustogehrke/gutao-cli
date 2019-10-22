'use strict'

const Instance = use("App/Models/Instance")

class InstanceController {
  async index () {
    return await Instance.all()
  }

  async show ({ params }) {
    const instance = await Instance.findOrFail(params.id)
    // await instance.load('')
    return instance
  }

  async store ({ request }) {
    const data = request.only([
      properties
    ])

    return await Instance.create(data)
  }

  async update ({ params, request }) {
    const instance = await Instance.findOrFail(params.id)
    const data = request.only([
      properties
    ])

    instance.merge(data)

    return await instance.save()
  }

  async destroy ({ params }) {
    const instance = await Instance.findOrFail(params.id)
    return await instance.delete()
  }
}

module.exports = InstanceController
