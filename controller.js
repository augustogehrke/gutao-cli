'use strict'

const Category = use("App/Models/Category")

class CategoryController {
  async index () {
    return await Category.all()
  }

  async show ({ params }) {
    const category = await Category.findOrFail(params.id)
    // await category.load('companies')
    return category
  }

  async store ({ request }) {
    const data = request.only([
      "name",
      "description",
      "image_name",
    ])

    return await Category.create(data)
  }

  async update ({ params, request }) {
    const category = await Category.findOrFail(params.id)
    const data = request.only([
      "name",
      "description",
      "image_name",
    ])

    category.merge(data)

    return await category.save()
  }

  async destroy ({ params }) {
    const category = await Category.findOrFail(params.id)
    return await category.delete()
  }
}

module.exports = CategoryController
