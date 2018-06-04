'use strict'

// import modules
const mongoose = require('mongoose')
const Schema = mongoose.Schema

// create schema
const ProfilesSchema = new Schema({
  personaje: {
    type: String,
    required: true
  },
  genero: {
    type: String,
    required: true
  },
  link_to_tag: {
    type: String,
    required: true
  }
})

mongoose.model('profiles', ProfilesSchema)
