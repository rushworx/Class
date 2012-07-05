require "./_helper"
assert  = require 'assert'
Pie     = require "../models/pie.coffee"
app     = require "../server"

describe "dynamic helpers", ->

describe "helpers", ->
  describe "urlFor", ->
    it "generates a URL for an object with an ID", ->
      url = app._locals.urlFor({id:123})
      assert.equal url, '/admin/pies/123'
    it "generates a URL for an object without an ID", ->
      url = app._locals.urlFor({})
      assert.equal url, '/admin/pies'

  describe "pie oldness", ->
    minutes = (num) -> 1000 * 60 * num
    it "not-ready", ->
      pie = new Pie
        name:'Artichoke'
        state:'making'
        stateUpdatedAt: (new Date()).getTime()
      className = app._locals.cssClassForPieAge pie
      assert.equal className, 'not-ready'
    it "almost-ready", ->
      pie = new Pie
        name:'Artichoke'
        state:'making'
        stateUpdatedAt: (new Date()).getTime() - minutes(2)
      className = app._locals.cssClassForPieAge pie
      assert.equal className, 'almost-ready'

    it "pipin-hot", ->
      pie = new Pie
        name:'Artichoke'
        state:'ready'
        stateUpdatedAt: (new Date()).getTime()
      className = app._locals.cssClassForPieAge pie
      assert.equal className, 'pipin-hot'

    it "hot", ->
      pie = new Pie
        name:'Artichoke'
        state:'ready'
        stateUpdatedAt: (new Date()).getTime() - minutes(1.5)
      className = app._locals.cssClassForPieAge pie
      assert.equal className, 'hot'

    it "warm", ->
      pie = new Pie
        name:'Artichoke'
        state:'ready'
        stateUpdatedAt: (new Date()).getTime() - minutes(3)
      className = app._locals.cssClassForPieAge pie
      assert.equal className, 'warm'
