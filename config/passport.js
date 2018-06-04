'use strict'

// import modules
const LocalStrategy = require('passport-local').Strategy
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

// load model
const Staff = mongoose.model('staff')

// export module
module.exports = function (passport) {
	passport.use(new LocalStrategy({
		usernameField: 'name'
	}, (name, password, done) => {

		// Match user
		Staff.findOne({
			name: name
		})
		.then(staff => {
			if (!staff) {
				return done(null, false, {message: 'Usuario no encontrado.'})
			}

			// Match password
			bcrypt.compare(password, staff.password, (err, isMatch) => {
				if (err) {
					throw err
				}

				if (isMatch) {
					return done(null, staff)
				} else {
					return done(null, false, {message: 'Contraseña incorrecta.'})
				}
			})

		})
	}))

	passport.serializeUser(function(staff, done) {
		done(null, staff.id)
	})

	passport.deserializeUser(function(id, done) {
		Staff.findById(id, (err, staff) => {
			done(err, staff)
		})
	})
}
