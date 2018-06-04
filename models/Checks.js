'use strict'

// import modules
const mongoose = require('mongoose')
const Schema = mongoose.Schema

// create schema
const ChecksSchema = new Schema({
	autor: {
		type: String,
		required: true
	},
	fecha: {
		type: String,
		required: true
	},
	title: {
		type: String,
		required: true
	},
	valor_str: {
		type: String,
		required: true
	},
	valor: {
		type: Number,
		required: true
	},
	personaje: {
		type: String,
		required: true
	},
	profile_id: {
		type: String,
		required: true
	},
	grupo_movimiento: {
		type: String,
		required: true
	},
	src: {
		type: String,
		required: true
	},
	captured_by: {
		type: String,
		required: true
	},
	updated_at: {
		type: Date,
		default: Date.now
	}
})

mongoose.model('checks', ChecksSchema)
