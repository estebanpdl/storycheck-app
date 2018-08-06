'use strict'

// import modules
const express = require('express')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const passport = require('passport')
const router = express.Router()

// load staff model
require('../models/Staff')
const Staff = mongoose.model('staff');

// route login
router.get('/colcheck/', clientIsAuth, (req, res) => {
	let title = 'Staff colcheck'
	res.render('staff/login', {
		title: title
	})
})

// route register
router.get('/register/', (req, res) => {
	let title = 'Registro Staff'
	res.render('staff/register', {
		title: title
	})
})

// route logout
router.get('/logout/', clientIsNotAuth, (req, res) => {
	req.logout()
	res.redirect('/')
})

// route login post
router.post('/colcheck/', (req, res, next) => {
	passport.authenticate('local', {
		successRedirect: '/',
		failureRedirect: '/staff/colcheck/',
		failureFlash: true
	})(req, res, next);
})

// route register post
router.post('/register/', (req, res) => {
	let title = 'Error en registro'
	let errors = []
	if (req.body.password != req.body.password_confirm) {
		errors.push({
			text: 'Las contraseñas no coinciden.'
		})
	}

	if (req.body.password.length < 7) {
		errors.push({
			text: 'La contraseña debe tener al menos 7 caracteres.'
		})
	}

	if (! (/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{7,}$/.test(req.body.password))) {
		errors.push({
			text: 'La contraseña debe contener al menos una letra mayúscula, un número y una letra minúscula.'
		})
	}

	if (errors.length > 0) {
		res.render('staff/register', {
			title: title,
			errors: errors,
			name: req.body.name,
			email: req.body.email,
			password: req.body.password,
			password_confirm: req.body.password_confirm
		})
	} else {
		Staff.findOne({email: req.body.email})
			.then(user => {
				if (user) {
					req.flash('error_msg', 'El email ya está asociado a una cuenta.')
					res.redirect('/staff/register')
				} else {
					const newUser = new Staff({
						name: req.body.name,
						email: req.body.email,
						password: req.body.password
					})
					bcrypt.genSalt(10, (err, salt) => {
						bcrypt.hash(newUser.password, salt, (err, hash) => {
							if (err) {
								throw err
							}

							newUser.password = hash
							newUser.save()
								.then(user => {
									req.flash('success_msg', 'El registro se realizó correctamente.')
									res.redirect('/checks/admin/')
								})
								.catch(err => {
									console.log(err)
									return
								})
						})
					})
				}
			})
		}
})

// load functions
// Función asegurar autenticación del usuario: redirigir a inicio cuando no está autenticado
function clientIsNotAuth (req, res, next) {
  if (! req.isAuthenticated()) {
    return res.redirect('/')
  }
  return next()
}

// Función asegurar autenticación del usuario: redirigir a inicio cuando está autenticado
function clientIsAuth (req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/')
  }
  return next()
}

module.exports = router
