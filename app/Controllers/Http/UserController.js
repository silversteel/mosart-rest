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
			const followers = await Follow.getFollowers(user.id)
			const following = await Follow.getFollowing(user.id)

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
			return response.status(500).send({
				status: 'failed',
				message: e.message
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
			return response.status(500).send({
				status: 'failed',
				message: e.message
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
			return response.status(500).send({
				status: 'failed',
				message: e.message
			})
		}
	}

	async follow({ auth, response, params }) {
		const { user_id } = params
		try {
			const user = await auth.getUser()
			return await Follow.create({ user_lead_id: user_id, user_follow_id: user.id})
		} catch(e) {
			return response.status(e.status).send({
				status: 'failed',
				message: e.message
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
			return response.status(e.status).send({
				status: 'failed',
				message: e.message
			})
		}
	}

	async favorite({ auth, response, params }) {
		const { post_id } = params
		try {
			const user = await auth.getUser()
			return await Favorite.create({ post_id, user_id: user.id })
		} catch(e) {
			return response.status(e.status).send({
				status: 'failed',
				message: e.message
			})
		}
	}

	async unfavorite({ auth, response, params }) {
		const { post_id } = params
		try {
			const user = await auth.getUser()
			return await Favorite.query().where('post_id', post_id).where('user_id', user.id).delete()
		} catch(e) {
			return response.status(500).send({
				status: 'failed',
				message: e.message
			})
		}
	}

}

module.exports = UserController
