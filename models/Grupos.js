'use strict'

// import modules
const mongoose = require('mongoose')
const Schema = mongoose.Schema

// create schema
const GrupoSchema = new Schema({
  movimiento: {
    type: String,
    required: true
  }
})

mongoose.model('gpos_movimientos', GrupoSchema)
