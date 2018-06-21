'use strict'

/*****************
	Import Modules
******************/
const express = require('express')
const hbars = require('express-handlebars')
const bodyParser = require('body-parser')
const passport = require('passport')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const flash = require('connect-flash')
const session = require('express-session')
const stats = require('simple-statistics')

/************
	APP INIT
*************/
const port = 9000

// express
const app = express()

// load routes
const checks = require('./routes/checks')
const staff = require('./routes/staff')

// passport config
require('./config/passport')(passport);

// map global promise - warning avoid
mongoose.Promise = global.Promise

// connect to mongoose
mongoose.connect('mongodb://localhost:27017/storycheck-dev', {
	useMongoClient: true
})
	.then(() => console.log('MongoDB connected'))
	.catch(err => console.log(err))

// load check model
require('./models/Checks')
const Check = mongoose.model('checks')

// load profiles model
require('./models/Profiles')
const Profiles = mongoose.model('profiles')

// load grupo model
require('./models/Grupos')
const Grupos = mongoose.model('gpos_movimientos')

// load slide model
require('./models/Slides')
const Slides = mongoose.model('slides')

// call directories
app.use(express.static('assets'))

// handlebars middleware
app.engine('handlebars', hbars({
	defaultLayout: 'main'
}))

// set engine
app.set('view engine', 'handlebars')

// body parser midleware
app.use(bodyParser.urlencoded({
	extended: false
}))
app.use(bodyParser.json())

// method override
app.use(methodOverride('_method'))

// express session midleware
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}))

// passport middleware
app.use(passport.initialize())
app.use(passport.session())

// call flash midleware
app.use(flash())

// global vars
app.use(function (req, res, next) {
	res.locals.success_msg = req.flash('success_msg')
	res.locals.error_msg = req.flash('error_msg')
	res.locals.error = req.flash('error')
	res.locals.staff = req.user || null
	next()
})

/***************
	CREATE VIEWS
****************/
// home
app.get('/', (req, res) => {
	let title = 'Colombia Check'
	// Slides collection
	Slides.find({})
		.sort({ captured_at: -1 })
		.limit(3)
		.then(slide => {
			// create new object based on slide data
			let i = 0
			let obj = []
			slide.map((s) => {
				i++
				let _class;
				if (i == 1) {
					_class = 'active'
				} else {
					_class = ''
				}
				let temp = {
					'class': _class,
					'slide': s
				}
				obj.push(temp)
			})

			// render view and send data
			res.render('index', {
				title: title,
				slide: obj
			})
		})
})

// metodología
app.get('/metodologia', (req, res) => {
	let title = 'Metodología'
	res.render('method/', {
		title: title
	})
})

// ranking
app.get('/ranking', (req, res) => {
	let title = 'Colombia Check - Ranking'
	res.render('rank/', {
		title: title
	})
})

// api status
app.get('/api/status/:id', (req, res) => {
	let _id = req.params.id
	Check.find({
		'profile_id': _id
	}).sort({ fecha: -1 })
		.then(profile => {

			// process profile
			let values = []
			let plot = []

			// array order
			let array_order = [
				'FALSA',
				'ENGAÑOSA',
				'INFLADA',
				'LIGERA',
				'APROXIMADA',
				'VERDADERA'
			]

			// mapping array order
			array_order.map((item) => {
				profile.map((d) => {
					values.push(d.valor)

					if (item == d.valor_str) {
						// plot data
						let p = {
							'label': d.valor_str,
							'value': profile.filter(o => o.valor_str == d.valor_str).length
						}
						plot.push(p)
					}
				})
			})

			// filter plot array by unique objects
			plot = plot.filter((val, idx, self) => self.findIndex((t) => {
				return t.label === val.label && t.value === val.value
			}) === idx)

			// create object data
			let obj = {
				profile_id: _id,
				personaje: profile[0].personaje,
				min: stats.min(values),
				max: stats.max(values),
				mean: stats.mean(values).toFixed(2).toString(),
				sum: stats.sum(values),
				checks: values.length,
				values: values,
				table: plot,
				bar_plot: plot,
				data: profile,
				falsa: profile.filter(o => o.valor_str == 'FALSA'),
				enganosa: profile.filter(o => o.valor_str == 'ENGAÑOSA'),
				inflada: profile.filter(o => o.valor_str == 'INFLADA'),
				ligera: profile.filter(o => o.valor_str == 'LIGERA'),
				aproximada: profile.filter(o => o.valor_str == 'APROXIMADA'),
				vardadera: profile.filter(o => o.valor_str == 'VERDADERA')
			}

			// send data
			res.send(obj)
		})
})

// view by user
app.get('/status/:id', (req, res) => {
	let _id = req.params.id
	Check.find({
		'profile_id': _id
	}).sort({ fecha: -1 })
		.then(profile => {

			// process profile
			let values = []
			let plot = []

			// array order
			let array_order = [
				'FALSA',
				'ENGAÑOSA',
				'INFLADA',
				'LIGERA',
				'APROXIMADA',
				'VERDADERA'
			]

			// mapping array order
			array_order.map((item) => {
				profile.map((d) => {
					values.push(d.valor)

					if (item == d.valor_str) {
						// plot data
						let p = {
							'label': d.valor_str,
							'value': profile.filter(o => o.valor_str == d.valor_str).length
						}
						plot.push(p)
					}
				})
			})

			// filter plot array by unique objects
			plot = plot.filter((val, idx, self) => self.findIndex((t) => {
				return t.label === val.label && t.value === val.value
			}) === idx)

			// create object data
			let obj = {
				profile_id: _id,
				personaje: profile[0].personaje,
				min: stats.min(values),
				max: stats.max(values),
				mean: stats.mean(values).toFixed(2).toString(),
				sum: stats.sum(values),
				checks: values.length,
				values: values,
				table: plot,
				bar_plot: plot,
				data: profile,
				falsa: profile.filter(o => o.valor_str == 'FALSA'),
				enganosa: profile.filter(o => o.valor_str == 'ENGAÑOSA'),
				inflada: profile.filter(o => o.valor_str == 'INFLADA'),
				ligera: profile.filter(o => o.valor_str == 'LIGERA'),
				aproximada: profile.filter(o => o.valor_str == 'APROXIMADA'),
				vardadera: profile.filter(o => o.valor_str == 'VERDADERA')
			}

			// render view
			res.render('status/', {
				title: `${obj.personaje}`,
				obj: obj
			})
		})
})

// profiles forms
app.get('/add/profile', clientIsNotAuth, (req, res) => {
	let title = 'Capturar personaje'
	res.render('add/profile', {
		title: title
	})
})

// profiles forms - post
app.post('/add/profile', clientIsNotAuth, (req, res) => {
	let newProfile = req.body
	new Profiles(newProfile)
		.save()
		.then(profile => {
			req.flash('success_msg', 'Personaje añadido correctamente')
			res.redirect('/checks/admin/')
		})
})

// grupo o movimiento form
app.get('/add/grupo-movimiento', clientIsNotAuth, (req, res) => {
	let title = 'Capturar grupo o movimiento'
	res.render('add/grupo-movimiento', {
		title: title
	})
})

// grupo o movimiento form - post
app.post('/add/grupo-movimiento', clientIsNotAuth, (req, res) => {
	let newGpo = req.body
	new Grupos(newGpo)
		.save()
		.then(grupo => {
			req.flash('success_msg', 'Grupo o movimiento registrado correctamente')
			res.redirect('/checks/admin/')
		})
})

// slides form
app.get('/add/slide', clientIsNotAuth, (req, res) => {
	let title = 'Añadir slide'
	res.render('add/slide', {
		title: title
	})
})

// slides form - post
app.post('/add/slide', clientIsNotAuth, (req, res) => {
	let newSlide = req.body
	new Slides(newSlide)
		.save()
		.then(slide => {
			req.flash('success_msg', 'Slide capturado correctamente')
			res.redirect('/checks/admin/')
		})
})

/*************
	LOAD DATA
**************/
// fetch profiles data
app.get('/profiles.json', (req, res) => {
	Profiles.find({}).then(profiles => {
		res.json(profiles)
	})
})

// fetch gpos_movimientos data
app.get('/gpos_movimientos.json', (req, res) => {
	Grupos.find({}).then(gpos => {
		res.json(gpos)
	})
})

// fetch all data
app.get('/checks.json', (req, res) => {
	Check.find({}).then(checks => {
		res.json(checks)
	})
})

// fetch ranking data
app.get('/ranking.json', (req, res) => {
	Check.aggregate({
		'$group': {
			_id: '$profile_id',
			count: {
				'$sum': 1
			}
		}
	}).sort({
		count: -1
	}).limit(10)
		.then(agg => {
			res.json(agg)
		})
})

// fetch all ranking
app.get('/api/ranking', (req, res) => {
	Check.aggregate({
		'$group': {
			_id: '$profile_id',
			count: {
				'$sum': 1
			}
		}
	}).sort({
		count: -1
	}).then(agg => {
		res.json(agg)
	})
})

// fetch data by staff user
app.get('/staff-checks.json', clientIsNotAuth, (req, res) => {
	Check.find({
		captured_by: req.user.id
	})
		.sort({ fecha: -1 })
		.then(checks => {
			res.json(checks)
		})
})

// use routes
app.use('/checks', checks)
app.use('/staff', staff)

/*****************
	LOAD FUNCTIONS
******************/
// Auth user
function clientIsNotAuth (req, res, next) {
  if (! req.isAuthenticated()) {
    return res.redirect('/')
  }
  return next()
}

/***************
	App Listener
****************/
app.listen(port, (err) => {
	if (err) {
		console.log(err)
	}

	console.log(`Storycheck is listening on ${port} port`)
})
