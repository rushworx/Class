// Generated by CoffeeScript 1.3.1
(function() {
  var Pie, app, assert;

  require("./_helper");

  assert = require('assert');

  Pie = require("../models/pie.coffee");

  app = require("../server");

  describe("dynamic helpers", function() {});

  describe("helpers", function() {
    describe("urlFor", function() {
      it("generates a URL for an object with an ID", function() {
        var url;
        url = app._locals.urlFor({
          id: 123
        });
        return assert.equal(url, '/admin/pies/123');
      });
      return it("generates a URL for an object without an ID", function() {
        var url;
        url = app._locals.urlFor({});
        return assert.equal(url, '/admin/pies');
      });
    });
    return describe("pie oldness", function() {
      var minutes;
      minutes = function(num) {
        return 1000 * 60 * num;
      };
      it("not-ready", function() {
        var className, pie;
        pie = new Pie({
          name: 'Artichoke',
          state: 'making',
          stateUpdatedAt: (new Date()).getTime()
        });
        className = app._locals.cssClassForPieAge(pie);
        return assert.equal(className, 'not-ready');
      });
      it("almost-ready", function() {
        var className, pie;
        pie = new Pie({
          name: 'Artichoke',
          state: 'making',
          stateUpdatedAt: (new Date()).getTime() - minutes(2)
        });
        className = app._locals.cssClassForPieAge(pie);
        return assert.equal(className, 'almost-ready');
      });
      it("pipin-hot", function() {
        var className, pie;
        pie = new Pie({
          name: 'Artichoke',
          state: 'ready',
          stateUpdatedAt: (new Date()).getTime()
        });
        className = app._locals.cssClassForPieAge(pie);
        return assert.equal(className, 'pipin-hot');
      });
      it("hot", function() {
        var className, pie;
        pie = new Pie({
          name: 'Artichoke',
          state: 'ready',
          stateUpdatedAt: (new Date()).getTime() - minutes(1.5)
        });
        className = app._locals.cssClassForPieAge(pie);
        return assert.equal(className, 'hot');
      });
      return it("warm", function() {
        var className, pie;
        pie = new Pie({
          name: 'Artichoke',
          state: 'ready',
          stateUpdatedAt: (new Date()).getTime() - minutes(3)
        });
        className = app._locals.cssClassForPieAge(pie);
        return assert.equal(className, 'warm');
      });
    });
  });

}).call(this);
