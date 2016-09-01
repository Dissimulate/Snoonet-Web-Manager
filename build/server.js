/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _classCallCheck2 = __webpack_require__(1);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(2);

	var _createClass3 = _interopRequireDefault(_createClass2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var express = __webpack_require__(6);
	var socket = __webpack_require__(7);
	var net = __webpack_require__(8);
	var http = __webpack_require__(9);

	var app = express();
	var server = http.createServer(app);
	var io = socket.listen(server);

	/* ----- */

	var IRC = function () {
	  function IRC(client, host, port) {
	    (0, _classCallCheck3.default)(this, IRC);

	    this.client = client;
	    this.host = host;
	    this.port = port;

	    this.buffer = new Buffer('');

	    this.socket = null;

	    this.connect();
	  }

	  (0, _createClass3.default)(IRC, [{
	    key: 'connect',
	    value: function connect() {
	      var _this = this;

	      this.socket = net.createConnection({
	        host: this.host,
	        port: this.port
	      });

	      this.socket.addListener('data', function (data) {
	        if (typeof data === 'string') {
	          _this.buffer += data;
	        } else {
	          _this.buffer = Buffer.concat([_this.buffer, data]);
	        }

	        var lines = _this.buffer.toString().split(/\r\n|\r|\n/);

	        if (lines.pop()) return;

	        _this.buffer = new Buffer('');

	        for (var i in lines) {
	          _this.client.emit('data', lines[i]);
	        }
	      });
	    }
	  }, {
	    key: 'send',
	    value: function send(msg) {
	      if (msg.startsWith('WHO ')) {
	        this.socket.write('PRIVMSG Sherlock :@ezchan ' + msg + '\r\n');
	      } else {
	        this.socket.write(msg + '\r\n');
	      }
	    }
	  }]);
	  return IRC;
	}();

	/* ----- */

	var connections = [];

	/* ----- */

	io.on('connection', function (socket) {
	  var connection = socket.request.connection;

	  connections.push(socket);

	  console.log('CONNECT: ' + connection.remoteAddress + ':' + connection.remotePort);

	  socket.irc = new IRC(socket, 'irc.snoonet.org', 6667);

	  socket.on('disconnect', function () {
	    connections.splice(connections.indexOf(socket), 1);

	    console.log('DISCONNECT: ' + connection.remoteAddress + ':' + connection.remotePort);
	  });

	  socket.on('data', socket.irc.send.bind(socket.irc));
	});

	/* ----- */

	server.listen(8080, function () {
	  console.log('Ezchan server started.');
	});

/***/ },
/* 1 */
/***/ function(module, exports) {

	"use strict";

	exports.__esModule = true;

	exports.default = function (instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError("Cannot call a class as a function");
	  }
	};

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	exports.__esModule = true;

	var _defineProperty = __webpack_require__(3);

	var _defineProperty2 = _interopRequireDefault(_defineProperty);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = function () {
	  function defineProperties(target, props) {
	    for (var i = 0; i < props.length; i++) {
	      var descriptor = props[i];
	      descriptor.enumerable = descriptor.enumerable || false;
	      descriptor.configurable = true;
	      if ("value" in descriptor) descriptor.writable = true;
	      (0, _defineProperty2.default)(target, descriptor.key, descriptor);
	    }
	  }

	  return function (Constructor, protoProps, staticProps) {
	    if (protoProps) defineProperties(Constructor.prototype, protoProps);
	    if (staticProps) defineProperties(Constructor, staticProps);
	    return Constructor;
	  };
	}();

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(4), __esModule: true };

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var $ = __webpack_require__(5);
	module.exports = function defineProperty(it, key, desc){
	  return $.setDesc(it, key, desc);
	};

/***/ },
/* 5 */
/***/ function(module, exports) {

	var $Object = Object;
	module.exports = {
	  create:     $Object.create,
	  getProto:   $Object.getPrototypeOf,
	  isEnum:     {}.propertyIsEnumerable,
	  getDesc:    $Object.getOwnPropertyDescriptor,
	  setDesc:    $Object.defineProperty,
	  setDescs:   $Object.defineProperties,
	  getKeys:    $Object.keys,
	  getNames:   $Object.getOwnPropertyNames,
	  getSymbols: $Object.getOwnPropertySymbols,
	  each:       [].forEach
	};

/***/ },
/* 6 */
/***/ function(module, exports) {

	module.exports = require("express");

/***/ },
/* 7 */
/***/ function(module, exports) {

	module.exports = require("socket.io");

/***/ },
/* 8 */
/***/ function(module, exports) {

	module.exports = require("net");

/***/ },
/* 9 */
/***/ function(module, exports) {

	module.exports = require("http");

/***/ }
/******/ ]);