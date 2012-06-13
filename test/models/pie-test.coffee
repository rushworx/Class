
assert	=	require 'assert'
Pie 		= require '../../models/pie'

describe 'Pie', ->
	describe 'create', ->
		pie = null
		before ->
			pie = new Pie {name: 'Key Lime'}
		it "sets name", ->
			assert.equal pie.name, 'Key Lime'
		it "defaults to some state", ->
			assert.equal pie.state, 'inactive'
		it "generates Id", ->
			assert.equal pie.id, 'Key-Lime'