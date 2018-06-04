'use strict'

// import modules
const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()

// load idea model
require('../models/Checks')
const Check = mongoose.model('checks')

// checks index page
router.get('/admin/', clientIsNotAuth, (req, res) => {
	let title = 'Administrador'
	Check.find({})
		.sort({fecha: 'desc'})
		.then(checks => {
			res.render('admin/', {
				title: title,
				checks: checks
			})
		})
})

// add checks form
router.get('/new/add/', clientIsNotAuth, (req, res) => {
	let title = 'Actualizar chequeos'
	res.render('add/', {
		title: title
	})
})

// edit checks form
router.get('/edit/:id', clientIsNotAuth, (req, res) => {
	let title = 'Editar chequeos'
	Check.findOne({
		_id: req.params.id
	})
	.then(check => {
		res.render('edit/', {
			check: check,
			title: title
		})
	})
})

// process form
router.post('/admin/', clientIsNotAuth, (req, res) => {
	const new_check = req.body
	let main = {
		data: new_check
	}

	// append user
	main.data['captured_by'] = req.user.id

	new Check(main.data)
		.save()
		.then(check => {
			req.flash('success_msg', 'Chequeo añadido correctamente')
			res.redirect('/checks/admin/')
		})
})

// edit form process
router.put('/admin/:id', clientIsNotAuth, (req, res) => {
	Check.findOne({
		_id: req.params.id
	})
	.then(check => {
		// new values
		check.autor = req.body.autor
		check.fecha = req.body.fecha
		check.title = req.body.title
		check.valor_str = req.body.valor_str
		check.valor = req.body.valor
		check.personaje = req.body.personaje
		check.id_src = req.body.id_src
		check.gpo_politico = req.body.gpo_politico
		check.precandidato = req.body.precandidato
		check.src = req.body.src

		check.save()
			.then(check => {
				req.flash('success_msg', 'Chequeo actualizado correctamente')
				res.redirect('/checks/admin/')
			})
	})
})

// delete form process
router.delete('/admin/:id', clientIsNotAuth, (req, res) => {
	Check.remove({
		_id: req.params.id
	})
	.then(() => {
		req.flash('success_msg', 'Chequeo eliminado correctamente')
		res.redirect('/checks/admin/')
	})
})

// load functions
// Función asegurar autenticación del usuario: redirigir a inicio cuando no está autenticado
function clientIsNotAuth (req, res, next) {
  if (! req.isAuthenticated()) {
    return res.redirect('/')
  }
  return next()
}

module.exports = router
