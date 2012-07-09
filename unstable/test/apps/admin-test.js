// Generated by CoffeeScript 1.3.1
(function() {
  var AdminTestHelper, Pie, PieFactory, app, assert, express, redis, request;

  require('../_helper');

  express = require('express');

  assert = require('assert');

  request = require('request');

  redis = require('redis').createClient();

  Pie = require('../../models/pie');

  PieFactory = require('../pie-factory');

  app = require("../../server");

  AdminTestHelper = {
    login: function(done) {
      var options;
      options = {
        uri: "http://localhost:" + app.settings.port + "/sessions",
        form: {
          user: 'piechef',
          password: '12345'
        },
        followAllRedirects: true
      };
      return request.post(options, function(err, _response, _body) {
        return done();
      });
    },
    dropDB: function(callback) {
      return redis.del(Pie.key(), callback);
    }
  };

  describe('admin', function() {
    describe('unauthenticated GET /admin/menu/stage', function() {
      var body;
      body = null;
      before(function(done) {
        var options;
        options = {
          uri: "http://localhost:" + app.settings.port + "/admin/menu/today"
        };
        return request(options, function(err, response, _body) {
          body = _body;
          return done();
        });
      });
      return it("redirects to /login", function() {
        return assert.hasTag(body, '//p[@class="flash error"]', "Please login.");
      });
    });
    describe('authenticated', function() {
      before(function(done) {
        return AdminTestHelper.login(done);
      });
      describe('GET /admin/', function() {
        var response;
        response = null;
        before(function(done) {
          var options;
          options = {
            uri: "http://localhost:" + app.settings.port + "/admin",
            followRedirect: false
          };
          return request(options, function(err, _response, body) {
            response = _response;
            return done();
          });
        });
        return it("redirects to /admin/menu/stage", function() {
          return assert.match(response.headers['location'], "/admin/menu/stage");
        });
      });
      describe('GET /admin/pies', function() {
        var body;
        body = null;
        before(function(done) {
          var options;
          options = {
            uri: "http://localhost:" + app.settings.port + "/admin/pies"
          };
          return request(options, function(err, response, _body) {
            if (response.statusCode >= 400) {
              throw new Error(_body);
            }
            body = _body;
            return done();
          });
        });
        return it("has title", function() {
          return assert.hasTag(body, '//head/title', 'Hot Pie - View All Pies');
        });
      });
      describe('POST /admin/pies', function() {
        return describe('with valid attributes', function() {
          var body;
          body = null;
          before(function(done) {
            return AdminTestHelper.dropDB(function() {
              var options;
              options = {
                uri: "http://localhost:" + app.settings.port + "/admin/pies",
                form: {
                  name: 'Pecan',
                  type: 'sweet'
                },
                followAllRedirects: true
              };
              return request.post(options, function(err, response, _body) {
                if (response.statusCode >= 400) {
                  throw new Error(_body);
                }
                body = _body;
                return done();
              });
            });
          });
          it("shows 'saved' flash message", function() {
            return assert.hasTag(body, "//p[@class='flash info']", "Pie 'Pecan' was saved.");
          });
          it("stores record in DB", function(done) {
            return Pie.getById('Pecan', function(err, pie) {
              assert.equal(pie.name, 'Pecan');
              assert.equal(pie.type, 'sweet');
              return done();
            });
          });
          return it("shows record on page", function() {
            return assert.hasTagMatch(body, "//li[@class='sweet']", /Pecan/);
          });
        });
      });
      describe('GET /admin/menu/stage', function() {
        var body;
        body = null;
        before(function(done) {
          return AdminTestHelper.dropDB(function() {
            return PieFactory.createSeveral(function() {
              var options;
              options = {
                uri: "http://localhost:" + app.settings.port + "/admin/menu/stage"
              };
              return request(options, function(err, response, _body) {
                body = _body;
                return done();
              });
            });
          });
        });
        it("has title", function() {
          return assert.hasTag(body, '//head/title', "Hot Pie - Pie Status");
        });
        it("greets user by name", function() {
          return assert.hasTag(body, '//div[@id="toolbar"]/ul/span', "Howdy, piechef!");
        });
        it("displays a pie", function() {
          return assert.hasTagMatch(body, "//li[@class='sweet']", /Key Lime/);
        });
        return it("displays state of pie", function() {
          var xpath;
          xpath = "//li[@class='savory']/div[@class='status']/div[@class='making on']/p";
          return assert.hasTag(body, xpath, 'oven');
        });
      });
      return describe("PUT /admin/pies/:id", function() {
        describe("success", function() {
          var body;
          body = null;
          before(function(done) {
            return PieFactory.createSeveral(function() {
              var options;
              options = {
                uri: "http://localhost:" + app.settings.port + "/admin/pies/Key-Lime",
                form: {
                  state: 'making'
                }
              };
              return request.put(options, function(err, response, _body) {
                if (response.statusCode >= 400) {
                  throw new Error(_body);
                }
                body = _body;
                return done();
              });
            });
          });
          return it("updates pie status", function(done) {
            return Pie.getById('Key-Lime', function(err, pie) {
              assert.equal(pie.state, 'making');
              return done();
            });
          });
        });
        return describe("error", function() {
          var body, response, _ref;
          _ref = [null, null], body = _ref[0], response = _ref[1];
          before(function(done) {
            return PieFactory.createSeveral(function() {
              var options;
              options = {
                uri: "http://localhost:" + app.settings.port + "/admin/pies/Key-Lime",
                form: {
                  state: 'not-a-state'
                }
              };
              return request.put(options, function(err, _response, _body) {
                var _ref1;
                if (_response.statusCode !== 403) {
                  throw new Error(_body);
                }
                _ref1 = [_body, _response], body = _ref1[0], response = _ref1[1];
                return done();
              });
            });
          });
          it("does not update pie status with incorrect error code", function(done) {
            return Pie.getById('Key-Lime', function(err, pie) {
              assert.equal(pie.state, 'inactive');
              return done();
            });
          });
          return it("renders error in body", function() {
            return assert.hasTag(body, '//p', "Incorrect Pie state: not-a-state is not a recognized state.");
          });
        });
      });
    });
    return after(function() {
      return AdminTestHelper.dropDB();
    });
  });

}).call(this);