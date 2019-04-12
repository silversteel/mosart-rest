'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Post = use('App/Models/Post')
const Tag = use('App/Models/Tag')
const Comment = use('App/Models/Comment')
const Favorite = use('App/Models/Favorite')
const Follow = use('App/Models/Follow')

/**
 * Resourceful controller for interacting with posts
 */
class PostController {
  /**
   * Show a list of all posts.
   * GET posts
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ request, response }) {
    const { title, tags } = request.get()
    try {
      let tagsParsed = JSON.parse(tags ? tags : '[]')
      let post = Post.query()
        .with('profiles', (builder) => {
          builder.setHidden(['id', 'user_id', 'bio', 'location', 'website'])
        })
        .withCount('favorites')
        .withCount('comments')
      
      if(tagsParsed && tagsParsed.length > 0) {
        post = post.whereHas('tags', (builder) => {
          builder.whereIn('tags.id', tagsParsed)
        })
      }

      return await post.whereRaw(`title LIKE '%${title ? title : ''}%'`).fetch()
    } catch(e) {
      console.log(e.message)
      return response.status(500).send({
        status: 'failed',
        message: 'Error'
      })
    }
  }

  /**
   * Create/save a new post.
   * POST posts
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ auth, request, response }) {
    const { image_url, title, description, views, tags } = request.post()
    try {
      const tagsNew = JSON.parse(tags ? tags : '[]').filter((item) => item.id == 0).map((item) => item.label)
      const tagsParsed = JSON.parse(tags ? tags : '[]').filter((item) => item.id != 0).map((item) => item.id)
      const user = await auth.getUser()
      const post = await user.posts().create({image_url, title, description, views})

      if(tagsNew && tagsNew.length > 0){
        for(let label of tagsNew){
          let tag = await Tag.create({label})
          tagsParsed.push(tag.id)
        }
        await post.tags().attach(tagsParsed)
      } else if (tagsParsed && tagsParsed.length > 0) {
        await post.tags().attach(tagsParsed)
      }

      return post
    } catch(e) {
      console.log(e.message)
      return response.status(500).send({
        status: 'failed',
        message: 'Error'
      })
    }
  }

  /**
   * Display a single post.
   * GET posts/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, request, response }) {
    const { id } =  params
    const { user_id } = request.all()
    try {
      let post = Post.query()
        .with('profiles', (builder) => {
          builder.setVisible(['name', 'image_url'])
        })
        .with('tags')
        .withCount('favorites')
        .withCount('comments')
        .with('comments.profiles', (builder) => {
          builder.setVisible(['name', 'image_url'])
        })

      if(user_id) {
        post = post.withCount('favorites as isFavorite', builder => {
            builder.where('user_id', user_id)
        })
      }

      post =  await post.where('id', id).fetch()

      return post.toJSON()[0]
    } catch(e) {
      console.log(e.message)
      return response.send({
        status: 'failed',
        message: 'error'
      })
    }
  }

  async getFollowingPosts({ auth, request, response }) {
    try {
      const user = await auth.getUser()
      return await Post.query().with('follows').with('profiles', (builder) => {
        builder.setVisible(['name', 'image_url'])
      })
      .withCount('favorites')
      .withCount('comments')
      .fetch()
    } catch(e){
      console.log(e.message)
      response.send({
        message: 'Error'
      })
    }
  }

  /**
   * Update post details.
   * PUT or PATCH posts/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ auth, params, request, response }) {
    const { id } =  params
    const { image_url, title, description, views, tags } = request.post()
    try {
      const tagsNew = JSON.parse(tags ? tags : '[]').filter((item) => item.id == 0).map((item) => item.label)
      const tagsParsed = JSON.parse(tags ? tags : '[]').filter((item) => item.id != 0).map((item) => item.id)
      const user = await auth.getUser()
      const post = await Post.findOrFail(id)

      if(post.user_id != user.id) {
        throw { message: 'anda tidak diperbolehkan mengakses user lain!' }
      }

      post.image_url = image_url
      post.title = title
      post.description = description
      post.views = views
      await post.save()

      if(tagsNew && tagsNew.length > 0){
        for(let label of tagsNew){
          let tag = await Tag.create({label})
          tagsParsed.push(tag.id)
        }
        await post.tags().sync(tagsParsed)
      } else if (tagsParsed && tagsParsed.length > 0) {
        await post.tags().sync(tagsParsed)
      }

      return post
    } catch(e) {
      console.log(e.message)
      switch(e.code){
        case 'E_MISSING_DATABASE_ROW':
          return response.status(e.status).send({
            status: 'failed',
            message: 'Post not found'
          })
        default:
          return response.status(500).send({
            status: 'failed',
            message: 'Error'
          })
          break
      }
    }
  }

  /**
   * Delete a post with id.
   * DELETE posts/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ auth, params, request, response }) {
    const { id } =  params

    try {
      const user = await auth.getUser()
      const post = await Post.findOrFail(id)

      if(post.user_id != user.id) {
        throw { message: 'anda tidak diperbolehkan mengakses user lain!' }
      }

      await post.tags().detach()
      await post.delete()
      
      return post
    } catch(e) {
      console.log(e.message)
      return response.status(e.status).send({
        status: 'failed',
        message: 'Error'
      })
    }
  }
}

module.exports = PostController
