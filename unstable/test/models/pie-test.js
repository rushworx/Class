// Generated by CoffeeScript 1.3.1
(function() {
  var Pie, PieFactory, PieTestHelper, assert, redis, _,
    __slice = [].slice;

  require('../_helper');

  assert = require('assert');

  redis = require('redis').createClient();

  Pie = require("../../models/pie.coffee");

  PieFactory = require('../pie-factory');

  _ = require('underscore');

  PieTestHelper = {
    emitsEvent: function(eventName) {
      return function() {
        var pie;
        pie = null;
        before(function(done) {
          pie = new Pie({
            name: 'Tarragon Chicken'
          });
          return done();
        });
        it("is function", function() {
          return assert.typeOf(pie[eventName], 'function');
        });
        return describe("update", function(done) {
          before(function(done) {
            return pie[eventName](function() {
              return done();
            });
          });
          it("sets new state", function() {
            return assert.equal(pie.state, eventName);
          });
          return it("sets stateUpdatedAt", function() {
            return assert.inDelta(pie.stateUpdatedAt, (new Date()).getTime(), 10);
          });
        });
      };
    }
  };

  describe('Pie', function() {
    describe("create", function() {
      var pie;
      pie = null;
      before(function(done) {
        pie = new Pie({
          name: 'Key Lime'
        });
        return done();
      });
      it("sets name", function() {
        return assert.equal(pie.name, 'Key Lime');
      });
      it("defaults to 'inactive'", function() {
        return assert.equal(pie.state, 'inactive');
      });
      return it("converts to URL-friendly ID", function() {
        return assert.equal(pie.id, 'Key-Lime');
      });
    });
    describe("inactive", PieTestHelper.emitsEvent('inactive'));
    describe("making", PieTestHelper.emitsEvent('making'));
    describe("ready", PieTestHelper.emitsEvent('ready'));
    describe("persistence", function() {
      it("builds a key", function() {
        return assert.equal(Pie.key(), 'Pie:test');
      });
      describe("save", function() {
        var pie;
        pie = null;
        before(function(done) {
          pie = new Pie({
            name: 'Tarragon Chicken'
          });
          return pie.save(function() {
            return done();
          });
        });
        return it("returns a Pie object", function() {
          return assert.instanceOf(pie, Pie);
        });
      });
      describe("get", function() {
        describe("existing record", function() {
          var pie;
          pie = null;
          before(function(done) {
            return PieFactory.createOne({
              name: 'Berry Awesome'
            }, function() {
              return Pie.getById('Berry-Awesome', function(err, _pie) {
                pie = _pie;
                return done();
              });
            });
          });
          it("returns a Pie object", function() {
            return assert.instanceOf(pie, Pie);
          });
          return it("fetches the correct object", function() {
            return assert.equal(pie.name, 'Berry Awesome');
          });
        });
        describe("by id", function() {
          var pie;
          pie = null;
          before(function(done) {
            return PieFactory.createOne({
              name: 'Banana Cream'
            }, function() {
              return Pie.getById('Banana-Cream', function(err, _pie) {
                pie = _pie;
                return done();
              });
            });
          });
          it("returns a Pie object", function() {
            return assert.instanceOf(pie, Pie);
          });
          return it("fetches the correct object", function() {
            return assert.equal(pie.name, 'Banana Cream');
          });
        });
        return describe("non-existing record", function() {
          return it("returns error", function(done) {
            return Pie.getById('Mud-Pie', function(err, json) {
              assert.equal(err.message, "Pie 'Mud-Pie' could not be found.");
              return done();
            });
          });
        });
      });
      describe("all", function() {
        var pies;
        pies = null;
        before(function(done) {
          return PieFactory.createSeveral(function() {
            return Pie.all(function(err, _pies) {
              pies = _pies;
              return done();
            });
          });
        });
        it("retrieves all pies", function() {
          return assert.equal(pies.length, 4);
        });
        return it("has correct name", function() {
          var other, pie;
          pie = pies[0], other = 2 <= pies.length ? __slice.call(pies, 1) : [];
          return assert.equal(pie.name, 'Key Lime');
        });
      });
      describe("what's warm", function(done) {
        var pies;
        pies = null;
        before(function(done) {
          return PieFactory.createSeveral(function() {
            return Pie.getById('Key-Lime', function(err, pie) {
              return pie.making(function() {
                return Pie.getById('Chicken', function(err, pie) {
                  return pie.ready(function() {
                    return Pie.active(function(err, _pies) {
                      pies = _pies;
                      return done();
                    });
                  });
                });
              });
            });
          });
        });
        it("retrives list of warm pies", function() {
          return assert.equal(pies.length, 3);
        });
        it("sorts pies by state", function() {
          var pieStates;
          pieStates = _.pluck(pies, 'state');
          return assert.deepEqual(pieStates, ['making', 'ready', 'ready']);
        });
        return it("sorts pies by stateUpdatedAt", function() {
          var pieNames;
          pieNames = _.pluck(pies, 'name');
          return assert.deepEqual(pieNames, ["Key Lime", "Cherry", "Chicken"]);
        });
      });
      describe("destroy", function() {
        before(function(done) {
          return PieFactory.createOne({
            name: 'Potato'
          }, done);
        });
        return it("is removed from the database", function(done) {
          return Pie.getById('Potato', function(err, pie) {
            return pie.destroy(function(err) {
              return Pie.getById('Potato', function(err) {
                assert.equal(err.message, "Pie 'Potato' could not be found.");
                return done();
              });
            });
          });
        });
      });
      return afterEach(function() {
        return redis.del(Pie.key());
      });
    });
    return describe("validation", function() {
      it("only allows 'sweet' and 'savory' for type");
      return it("requires a name");
    });
  });

}).call(this);
