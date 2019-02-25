'use strict'

const User = use('App/Models/User')

class UserController {
	async show({ auth, response, params }) {
		const { id } = params
		try {
			const user = await auth.getUser()
			if (id != user.id) {
				throw { message: 'cannot access another user!' }
			}
			return user
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
}

module.exports = UserController
