require '../_helper'
express    = require 'express'
assert     = require 'assert'
request    = require 'request'
app        = require "../../server"
PieFactory = require '../pie-factory'
Pie        = require '../../models/pie'

describe 'sidewalk', ->
  describe 'GET /', ->
    body = null
    before (done) ->
      minutesAgo = (num) -> (new Date).getTime() - (1000 * 60 * num)
      PieFactory.createSeveral ->
        Pie.getById 'Key-Lime', (err, pie) ->
          pie.state = 'making'
          pie.stateUpdatedAt = minutesAgo(2)
          pie.save ->
            Pie.getById 'Chicken', (err, pie) ->
              pie.making ->
                Pie.getById 'Apple', (err, pie) ->
                  pie.state = 'ready'
                  pie.stateUpdatedAt = minutesAgo(2)
                  pie.save ->
                    Pie.getById 'Cherry', (err, pie) ->
                      pie.ready ->
                        Pie.active (err, _pies) ->
                          pies = _pies
                          request {uri:"http://localhost:#{app.settings.port}/"}, (err, response, _body) ->
                            body = _body
                            done()
    it "has title", ->
      assert.hasTag body, '//title', "Hot Pie - What's Warm"
    it "Key Lime is 'almost-ready'", ->
      assert.hasTagMatch body, '//li[@class="almost-ready sweet"]', /Key Lime/
    it "Chicken is 'not-ready'", ->
      assert.hasTagMatch body, '//li[@class="not-ready savory"]', /Chicken/
    it "Apple is 'warm'", ->
      assert.hasTagMatch body, '//li[@class="warm sweet"]', /Apple/
    it "Cherry is 'pipin-hot'", ->
      assert.hasTagMatch body, '//li[@class="pipin-hot sweet"]', /Cherry/
