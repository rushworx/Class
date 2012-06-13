
redis = require('redis').createClient()

class Pie
	@key: ->
		"Pie:#{process.env.NODE_ENV}"
	@states: ['inactive','making','ready']
	@all: (callback) ->
		redis.hgetall Pie.key(), (err, objects) ->
			pies = []
			for id, json of objects
				pie = new Pie JSON.parse(json)
				pies.push pie
			callback null, pies
	@active: (callback) ->
		Pie.all (err, pies) ->
			activePies = (pie for pie in pies when pie.state isnt 'inactive')
			callback  null, activePies
	@getById: (id, callback) ->
		redis.hget Pie.key(), id, (err, json) ->
			if json is null
				callback new Error("Pie '#[id]] could not be found.")
				return
			pie = new Pie JSON.parse(json)
			callback null, pie
	constructor: (attributes) ->
		@[key] = value for key, value of attributes
		@setDefaults()
		@
	setDefaults: ->
		unless @state
			@state = 'inactive'
		@generateId()
		@defineStateMachine()
	generateId: ->
		if not @id and @name
			@id = @name.replace /\s/g, '-'
	defineStateMachine: ->
		for state in Pie.states
			do (state) =>
				@[state] = (callback) ->
					@state = state
					@stateUpdatedAt = (new Date).getTime()
					@save ->
						callback()
	save: (callback) ->
		@generateId()
		redis.hset Pie.key(), @id, JSON.stringify(@), (err,code) =>
			callback null, @
module.exports = Pie