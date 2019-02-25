'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.0/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route
	.group(() => {
		Route.post('login', 'AuthController.login').middleware(['guest'])
		Route.post('register', 'AuthController.register').middleware(['guest'])

		Route.get('user/:id', 'UserController.show').middleware('auth')
		Route.patch('user/:id', 'UserController.update').middleware('auth')
		Route.delete('user/:id', 'UserController.destroy').middleware('auth')

		Route.get('profile/:id', 'ProfileController.show')
		Route.patch('profile/:id', 'ProfileController.update').middleware('auth')

		Route.get('posts', 'PostController.index')
		Route.get('post/:id', 'PostController.show')
		Route.post('post', 'PostController.store').middleware('auth')
		Route.patch('post/:id', 'PostController.update').middleware('auth')
		Route.delete('post/:id', 'PostController.destroy').middleware('auth')

		Route.get('tags', 'TagController.index')
		Route.post('tag', 'TagController.store').middleware('auth')
		Route.get('tag/:id', 'TagController.show')
		Route.patch('tag/:id', 'TagController.update').middleware('auth')
		Route.delete('tag/:id', 'TagController.destroy').middleware('auth')

		Route.post('comment', 'CommentController.store').middleware('auth')
		Route.get('comment/:id', 'CommentController.show')
		Route.patch('comment/:id', 'CommentController.update').middleware('auth')
		Route.delete('comment/:id', 'CommentController.destroy').middleware('auth')
	})
	.prefix('api/v1')

