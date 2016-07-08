'use strict'

var assign = require('lodash.assign')
var eachLimit = require('async').eachLimit
var spawn = require('cross-spawn')

module.exports = function (packages, _options, cb) {
  if (typeof _options === 'function') {
    cb = _options
    _options = {}
  }

  cb = cb || function () {}

  var options = assign({
    stdio: 'inherit'
  }, _options)

  eachLimit(packages, 1, function (arg, next) {
    var pkg = arg.substr(0, arg.indexOf('@')) || arg
    try {
      // TODO: Either skip this part if a version has been provided or check the package json version
      require.resolve(pkg)
      return next()
    } catch (err) {
      var child = spawn('npm', ['install', arg], {stdio: options.stdio})
      child.once('close', function () {
        next()
      })
    }
  }, function (err) {
    return cb(err)
  })
}
