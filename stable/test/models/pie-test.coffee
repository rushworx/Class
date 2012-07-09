require '../_helper'
assert     = require 'assert'
redis      = require('redis').createClient()
Pie        = require "../../models/pie.coffee"
PieFactory = require '../pie-factory'
_          = require 'underscore'

PieTestHelper =
  emitsEvent: (eventName) ->
    ->
      pie = null
      before (done) ->
        pie = new Pie {name:'Tarragon Chicken'}
        done()
      it "is function", ->
        assert.typeOf pie[eventName], 'function'
      describe "update", (done) ->
        before (done) ->
          pie[eventName] ->
            done()
        it "sets new state", ->
          assert.equal pie.state, eventName
        it "sets stateUpdatedAt", ->
          assert.inDelta pie.stateUpdatedAt, (new Date()).getTime(), 10

describe 'Pie', ->
  describe "create", ->
    pie = null
    before (done) ->
      pie = new Pie {name:'Key Lime'}
      done()
    it "sets name", ->
      assert.equal pie.name, 'Key Lime'
    it "defaults to 'inactive'", ->
      assert.equal pie.state, 'inactive'
    it "converts to URL-friendly ID", ->
      assert.equal pie.id, 'Key-Lime'

  describe "inactive", PieTestHelper.emitsEvent('inactive')
  describe "making", PieTestHelper.emitsEvent('making')
  describe "ready", PieTestHelper.emitsEvent('ready')

  describe "persistence", ->
    it "builds a key", ->
      assert.equal Pie.key(), 'Pie:test'
    describe "save", ->
      pie = null
      before (done) ->
        pie = new Pie {name:'Tarragon Chicken'}
        pie.save ->
          done()
      it "returns a Pie object", ->
        assert.instanceOf pie, Pie
    describe "get", ->
      describe "existing record", ->
        pie = null
        before (done) ->
          # Save a pie and retrieve it again.
          PieFactory.createOne {name:'Berry Awesome'}, () ->
            Pie.getById 'Berry-Awesome', (err, _pie) ->
              pie = _pie
              done()
        it "returns a Pie object", ->
          assert.instanceOf pie, Pie
        it "fetches the correct object", ->
          assert.equal pie.name, 'Berry Awesome'

      describe "by id", ->
        pie = null
        before (done) ->
          PieFactory.createOne {name:'Banana Cream'}, () ->
            Pie.getById 'Banana-Cream', (err, _pie) ->
              pie = _pie
              done()
        it "returns a Pie object", ->
          assert.instanceOf pie, Pie
        it "fetches the correct object", ->
          assert.equal pie.name, 'Banana Cream'

      describe "non-existing record", ->
        it "returns error", (done) ->
          Pie.getById 'Mud-Pie', (err, json) ->
            assert.equal err.message, "Pie 'Mud-Pie' could not be found."
            done()

    describe "all", ->
      pies = null
      before (done) ->
        PieFactory.createSeveral ->
          Pie.all (err, _pies) ->
            pies = _pies
            done()
      it "retrieves all pies", ->
        assert.equal pies.length, 4
      it "has correct name", ->
        [pie, other...] = pies
        assert.equal pie.name, 'Key Lime'
    describe "what's warm", (done) ->
      pies = null
      before (done) ->
        PieFactory.createSeveral ->
          Pie.getById 'Key-Lime', (err, pie) ->
            pie.making ->
              Pie.getById 'Chicken', (err, pie) ->
                pie.ready ->
                  Pie.active (err, _pies) ->
                    pies = _pies
                    done()
      it "retrives list of warm pies", ->
        assert.equal pies.length, 3
      it "sorts pies by state", ->
        pieStates = _.pluck pies, 'state'
        assert.deepEqual pieStates, ['making', 'ready', 'ready']
      it "sorts pies by stateUpdatedAt", ->
        pieNames = _.pluck pies, 'name'
        assert.deepEqual pieNames, ["Key Lime","Cherry","Chicken"]


    describe "destroy", ->
      before (done) ->
        PieFactory.createOne {name:'Potato'}, done
      it "is removed from the database", (done) ->
        # Fetch and destroy. Expect an error on next fetch.
        Pie.getById 'Potato', (err, pie) ->
          pie.destroy (err) ->
            Pie.getById 'Potato', (err) ->
              assert.equal err.message, "Pie 'Potato' could not be found."
              done()

    afterEach ->
      redis.del Pie.key()

  describe "validation", ->
    it "only allows 'sweet' and 'savory' for type"
    it "requires a name"

