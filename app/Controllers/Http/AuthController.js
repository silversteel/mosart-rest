'use strict'

const User = use('App/Models/User')

class AuthController {
	async login({ auth, request, response }) {
		const { username, password } = request.post()
		try {
			const access = await auth.attempt(username, password)
			const user = await User.findByOrFail('username', username)

			return {
				...user.toJSON(),
				access
			}
		} catch(e) {
			console.log(e.message)
			return response.status(500).send({
				status: 'failed',
				message: e.message
			})
		}
	}

	async register({ auth, request, response }) {
		const { name, email, username, password } = request.post()
		try {
			const user = await User.create({ email, username, password })
			await user.profiles().create({ name })

			return {
				status: 'success'
			}
		} catch(e) {
			console.log(e.message)
			return response.status(500).send({
				status: 'failed',
				message: e.message
			})
		}
	}
}

module.exports = AuthController
