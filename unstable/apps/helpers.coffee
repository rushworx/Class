
helpers = (app) ->
  app.dynamicHelpers
    flash: (req, res) ->
      req.flash()
    userGreeting: (req, res) ->
      "Howdy, #{req.session.currentUser}!"
    currentPath: (req, res) ->
      req.path

  app.helpers
    urlFor: (obj) ->
      if obj.id
        "/admin/pies/#{obj.id}"
      else
        "/admin/pies"
    # Returns the 'expected' state and 'on' if it matches 'actual'.
    #
    # expected: A state such as 'making' or 'inactive'
    # actual:   The state of the object being compared to.
    cssClassForState: (expected, actual) ->
      if actual is expected
        [expected, 'on']
      else
        expected
    cssClassForCurrentURL: (actual, expected) ->
      if actual is expected
        return 'current'
      null
    cssClassForPieAge: (pie) ->
      pieAge = (new Date).getTime() - pie.stateUpdatedAt
      minutes = (num) -> 1000 * 60 * num
      switch pie.state
        when 'making'
          if pieAge > minutes(1)
            'almost-ready'
          else
            'not-ready'
        when 'ready'
          if pieAge < minutes(1)
            'pipin-hot'
          else if pieAge < minutes(2)
            'hot'
          else
            'warm'
        else
          null
    wordsForPieAge: (pie) ->
      messages =
        'almost-ready': ["almost ready"]
        'not-ready': ["in the makin'", "cookin'", "in da oven"]
        'pipin-hot': ["pipin' hot", "fresh out of the oven"]
        'hot': ["hot", "mmmmm"]
        'warm': ["warm", "toasty"]
      cssClass          = @cssClassForPieAge(pie)
      messagesForPieAge = messages[cssClass]
      randomInt         = Math.floor(Math.random() * messagesForPieAge.length)
      message           = messagesForPieAge[randomInt]
      ' is ' + message

module.exports = helpers