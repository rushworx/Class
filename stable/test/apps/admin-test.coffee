require '../_helper'
express = require 'express'
assert  = require 'assert'
request = require 'request'
redis   = require('redis').createClient()
Pie     = require '../../models/pie'
PieFactory = require '../pie-factory'
app     = require "../../server"

AdminTestHelper =
  login: (done) ->
    options =
      uri:"http://localhost:#{app.settings.port}/sessions"
      form:
        user: 'piechef'
        password: '12345'
      followAllRedirects: true
    request.post options, (err, _response, _body) ->
      done()
  dropDB: (callback) ->
    redis.del Pie.key(), callback

describe 'admin', ->

  describe 'unauthenticated GET /admin/menu/stage', ->
    body = null
    before (done) ->
      options =
        uri: "http://localhost:#{app.settings.port}/admin/menu/today"
      request options, (err, response, _body) ->
        body = _body
        done()
    it "redirects to /login", ->
      assert.hasTag body, '//p[@class="flash error"]', "Please login."

  describe 'authenticated', ->
    # Login
    before (done) ->
      AdminTestHelper.login done

    describe 'GET /admin/', ->
      response = null
      before (done) ->
        options =
          uri: "http://localhost:#{app.settings.port}/admin"
          followRedirect: false
        request options, (err, _response, body) ->
          response = _response
          done()
      it "redirects to /admin/menu/stage", ->
        assert.match response.headers['location'], "/admin/menu/stage"

    describe 'GET /admin/pies', ->
      body = null
      before (done) ->
        options =
          uri:"http://localhost:#{app.settings.port}/admin/pies"
        request options, (err, response, _body) ->
          throw new Error(_body) if response.statusCode >= 400
          body = _body
          done()
      it "has title", ->
        assert.hasTag body, '//head/title', 'Hot Pie - View All Pies'

    describe 'POST /admin/pies', ->
      describe 'with valid attributes', ->
        body = null
        before (done) ->
          AdminTestHelper.dropDB ->
            options =
              uri:"http://localhost:#{app.settings.port}/admin/pies"
              form:
                name: 'Pecan'
                type: 'sweet'
              followAllRedirects: true
            request.post options, (err, response, _body) ->
              throw new Error(_body) if response.statusCode >= 400
              body = _body
              done()
        it "shows 'saved' flash message", ->
          assert.hasTag body, "//p[@class='flash info']", "Pie 'Pecan' was saved."
        it "stores record in DB", (done) ->
          Pie.getById 'Pecan', (err, pie) ->
            assert.equal pie.name, 'Pecan'
            assert.equal pie.type, 'sweet'
            done()
        it "shows record on page", ->
          assert.hasTagMatch body, "//li[@class='sweet']", /Pecan/

    describe 'GET /admin/menu/stage', ->
      body = null
      before (done) ->
        AdminTestHelper.dropDB ->
          PieFactory.createSeveral ->
            options =
              uri:"http://localhost:#{app.settings.port}/admin/menu/stage"
            request options, (err, response, _body) ->
              body = _body
              done()
      it "has title", ->
        assert.hasTag body, '//head/title', "Hot Pie - Pie Status"
      it "greets user by name", ->
        assert.hasTag body, '//div[@id="toolbar"]/ul/span', "Howdy, piechef!"
      it "displays a pie", ->
        assert.hasTagMatch body, "//li[@class='sweet']", /Key Lime/
      it "displays state of pie", ->
        xpath = "//li[@class='savory']/div[@class='status']/div[@class='making on']/p"
        assert.hasTag body, xpath, 'oven'

    describe "PUT /admin/pies/:id", ->
      describe "success", ->
        body = null
        before (done) ->
          PieFactory.createSeveral ->
            options =
              uri:"http://localhost:#{app.settings.port}/admin/pies/Key-Lime"
              form:
                state: 'making'
            request.put options, (err, response, _body) ->
              throw new Error(_body) if response.statusCode >= 400
              body = _body
              done()
        it "updates pie status", (done) ->
          Pie.getById 'Key-Lime', (err, pie) ->
            assert.equal pie.state, 'making'
            done()
      describe "error", ->
        [body, response] = [null, null]
        before (done) ->
          PieFactory.createSeveral ->
            options =
              uri:"http://localhost:#{app.settings.port}/admin/pies/Key-Lime"
              form:
                state: 'not-a-state'
            request.put options, (err, _response, _body) ->
              throw new Error(_body) if _response.statusCode isnt 403
              [body, response] = [_body, _response]
              done()
        it "does not update pie status with incorrect error code", (done) ->
          Pie.getById 'Key-Lime', (err, pie) ->
            assert.equal pie.state, 'inactive'
            done()
        it "renders error in body", ->
          assert.hasTag body, '//p', "Incorrect Pie state: not-a-state is not a recognized state."

  after ->
    AdminTestHelper.dropDB()
