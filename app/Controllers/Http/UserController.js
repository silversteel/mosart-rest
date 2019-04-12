'use strict'

const User = use('App/Models/User')
const Follow = use('App/Models/Follow')
const Favorite = use('App/Models/Favorite')

class UserController {
	async show({ auth, response, params }) {
		const { id } = params
		try {
			const user = await auth.getUser()
			const profile = await user.profiles().fetch()
			const posts = await user.posts().fetch()
			const followers = []
			const following = []

			if (id != user.id) {
				throw { message: 'cannot access another user!' }
			}

			return {
				...user.toJSON(),
				profile,
				posts,
				followers,
				following
			}
		} catch(e) {
			console.log(e.message)
			return response.status(500).send({
				status: 'failed',
				message: 'Error'
			})
		}
	}

	async showOther({ response, params }) {
		const { id } = params
		try {
			const user = await User.findOrFail(id)
			const profile = await user.profiles().fetch()
			const posts = await user.posts().fetch()
			const followers = []
			const following = []

			return {
				...user.toJSON(),
				profile,
				posts,
				followers,
				following
			}
		} catch(e) {
			console.log(e.message)
			return response.status(500).send({
				status: 'failed',
				message: 'Error'
			})
		}
	}

	async update({ auth, request, response, params }) {
		const { id } = params
		const { email, username, password } = request.post()
		try {
			const user = await auth.getUser()
			if (id != user.id) {
				throw { message: 'cannot access another user!' }
			}
			user.email = email
			user.username = username
			user.password = password
			await user.save()
			return user
		} catch(e) {
			console.log(e.message)
			return response.status(500).send({
				status: 'failed',
				message: 'Error'
			})
		}
	}

	async destroy({ auth, response, params }) {
		const { id } = params
		try {
			const user = await auth.getUser()
			if (id != user.id) {
				throw { message: 'cannot access another user!' }
			}
			await user.profiles().delete()
			await user.delete()
			return user
		} catch(e) {
			console.log(e.message)
			return response.status(500).send({
				status: 'failed',
				message: 'Error'
			})
		}
	}

	async follow({ auth, response, params }) {
		const { user_id } = params
		try {
			const user = await auth.getUser()
			return await Follow.create({ user_lead_id: user_id, user_follow_id: user.id})
		} catch(e) {
			console.log(e.message)
			return response.status(e.status).send({
				status: 'failed',
				message: 'Error'
			})
		}
	}

	async unfollow({ auth, response, params }) {
		const { user_id } = params
		try {
			const user = await auth.getUser()
			const follow = await Follow.query().where('user_lead_id', user_id).where('user_follow_id', user.id).fetch()
			await follow.delete()
			return follow
		} catch(e) {
			console.log(e.message)
			return response.status(e.status).send({
				status: 'failed',
				message: 'Error'
			})
		}
	}

	async favorite({ auth, response, params }) {
		const { post_id } = params
		try {
			const user = await auth.getUser()
			return await Favorite.create({ post_id, user_id: user.id })
		} catch(e) {
			console.log(e.message)
			return response.status(e.status).send({
				status: 'failed',
				message: 'Error'
			})
		}
	}

	async unfavorite({ auth, response, params }) {
		const { post_id } = params
		try {
			const user = await auth.getUser()
			return await Favorite.query().where('post_id', post_id).where('user_id', user.id).delete()
		} catch(e) {
			console.log(e.message)
			return response.status(500).send({
				status: 'failed',
				message: 'Error'
			})
		}
	}

}

module.exports = UserController
