'use strict'

// import modules
const mongoose = require('mongoose')
const Schema = mongoose.Schema

// create schema
const SlideSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  summary: {
    type: String,
    required: true
  },
  link_article: {
    type: String,
    required: true
  },
  link_img: {
    type: String,
    required: true
  },
  captured_at: {
		type: Date,
		default: Date.now
  }
})

mongoose.model('slides', SlideSchema)
