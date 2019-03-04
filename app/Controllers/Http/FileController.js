'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Helpers = use('Helpers')
const File = use('App/Models/File')
const fs = Helpers.promisify(require('fs'))
const exists = Helpers.promisify(require('fs').exists)

/**
 * Resourceful controller for interacting with files
 */
class FileController {

  async show({ params, response }) {
    const { filename } = params

    try {
      const file = await File.findByOrFail('path', filename)

      return response.download(Helpers.tmpPath('uploads/'+file.path))
    } catch(e) {
      return response.status(e.status).send({
        status: 'failed',
        message: e.message
      })
    }
  }

  /**
   * Create/save a new file.
   * POST files
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ auth, request, response }) {
    const picture = request.file('picture')
    const filename = new Date().getTime()+'.'+picture.subtype
    
    try {
      await auth.check()

      await picture.move(Helpers.tmpPath('uploads'), {
        name: filename,
        overwrite: true
      })

      const uploaded_file = await File.create({ path: filename })

      if(!picture.moved()){
        throw { message: picture.error() }
      }

      return {
        image: 'http://192.168.43.106:3333/file/'+uploaded_file.path
      }
    } catch(e) {
      return response.status(200).send({
        status: 'failed',
        message: e.message
      })
    }
  }

  /**
   * Delete a file with id.
   * DELETE files/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response }) {
    const { filename } = params
    try {
      await auth.check()
      const uploaded_file = await File.findByOrFail('path', filename)
      //const isExist = await fs.access(Helpers.tmpPath('uploads/'+uploaded_file.path))

      await fs.unlink(Helpers.tmpPath('uploads/'+uploaded_file.path))
      await uploaded_file.delete()
      return uploaded_file
    } catch(e) {
      return response.status(500).send({
        status: 'failed',
        message: e.message
      })
    }
  }
}

module.exports = FileController
