'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class PostTagSchema extends Schema {
  up () {
    this.create('post_tags', (table) => {
      table.increments()
      table.integer('post_id', 10).unsigned().notNullable().references('id').inTable('posts').onDelete('cascade').onUpdate('cascade')
      table.integer('tag_id', 10).unsigned().notNullable().references('id').inTable('tags').onDelete('cascade').onUpdate('cascade')
    })
  }

  down () {
    this.drop('post_tags')
  }
}

module.exports = PostTagSchema
