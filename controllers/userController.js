



module.exports = function(app, me, friend){
  var bodyParser = require('body-parser');
  var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
  var urlencodedParser = bodyParser.urlencoded({extended: false});
  var _baseUri = 'https://api.spotify.com/v1';
  var _accessToken = null;
  var spotifyData = null;

  var _promiseImplementation = null;

  var WrapPromiseWithAbort = function(promise, onAbort) {
    promise.abort = onAbort;
    return promise;
  };

  var _promiseProvider = function(promiseFunction, onAbort) {
    var returnedPromise;
    if (_promiseImplementation !== null) {
      var deferred = _promiseImplementation.defer();
      promiseFunction(
        function(resolvedResult) {
          deferred.resolve(resolvedResult);
        },
        function(rejectedResult) {
          deferred.reject(rejectedResult);
        }
      );
      returnedPromise = deferred.promise;
    } else {

        returnedPromise = new Promise(promiseFunction);

    }

    if (returnedPromise) {
      return new WrapPromiseWithAbort(returnedPromise, onAbort);
    } else {
      return null;
    }
  };


  var _buildUrl = function(url, parameters) {
    var qs = '';
    for (var key in parameters) {
      if (parameters.hasOwnProperty(key)) {
        var value = parameters[key];
        qs += encodeURIComponent(key) + '=' + encodeURIComponent(value) + '&';
      }
    }
    if (qs.length > 0) {
      // chop off last '&'
      qs = qs.substring(0, qs.length - 1);
      url = url + '?' + qs;
    }
    return url;
  };

  var _extend = function() {
    var args = Array.prototype.slice.call(arguments);
    var target = args[0];
    var objects = args.slice(1);
    target = target || {};
    objects.forEach(function(object) {
      for (var j in object) {
        if (object.hasOwnProperty(j)) {
          target[j] = object[j];
        }
      }
    });
    return target;
  };

  var _performRequest = function(requestData, callback) {
    var req = new XMLHttpRequest();

    var promiseFunction = function(resolve, reject) {
      function success(data) {
        if (resolve) {
          resolve(data);
        }
        if (callback) {
          callback(null, data);
        }
      }

      function failure() {
        if (reject) {
          reject(req);
        }
        if (callback) {
          callback(req, null);
        }
      }

      var type = requestData.type || 'GET';
      req.open(type, _buildUrl(requestData.url, requestData.params));
      if (_accessToken) {
        req.setRequestHeader('Authorization', 'Bearer ' + _accessToken);
      }

      req.onreadystatechange = function() {
        if (req.readyState === 4) {
          var data = null;
          try {
            data = req.responseText ? JSON.parse(req.responseText) : '';
          } catch (e) {
            console.error(e);
          }

          if (req.status >= 200 && req.status < 300) {
            success(data);
          } else {
            failure();
          }
        }
      };

      if (type === 'GET') {
        req.send(null);
      } else {
        req.send(requestData.postData ? JSON.stringify(requestData.postData) : null);
      }
    };

    if (callback) {
      promiseFunction();
      return null;
    } else {
      return _promiseProvider(promiseFunction, function() {
        req.abort();
      });
    }
  };

  var _checkParamsAndPerformRequest = function(requestData, options, callback, optionsAlwaysExtendParams) {
    var opt = {};
    var cb = null;

    if (typeof options === 'object') {
      opt = options;
      cb = callback;
    } else if (typeof options === 'function') {
      cb = options;
    }


    var type = requestData.type || 'GET';
    if (type !== 'GET' && requestData.postData && !optionsAlwaysExtendParams) {
      requestData.postData = _extend(requestData.postData, opt);
    } else {
      requestData.params = _extend(requestData.params, opt);
    }
    return _performRequest(requestData, cb);
  };


  var getMyCurrentPlayingTrack = function(options, callback) {
      var requestData = {
        url: _baseUri + '/me/player/currently-playing'
      };
      return _checkParamsAndPerformRequest(requestData, options, callback);
    };


  var play = function(options, callback) {
      var params = 'device_id' in options ? {device_id: options.device_id} : null;
      var postData = {};
      ['context_uri', 'uris', 'offset'].forEach(function(field) {
        if (field in options) {
          postData[field] = options[field];
        }
      });
      var requestData = {
        type: 'PUT',
        url: _baseUri + '/me/player/play',
        params: params,
        postData: postData
      };

      // need to clear options so it doesn't add all of them to the query params
      var newOptions = typeof options === 'function' ? options : {};
      return _checkParamsAndPerformRequest(requestData, newOptions, callback);
    };

  var seek = function(position_ms, options, callback) {
      var params = {
        position_ms: position_ms
      };
      if ('device_id' in options) {
        params.device_id = options.device_id;
      }
      var requestData = {
        type: 'PUT',
        url: _baseUri + '/me/player/seek',
        params: params
      };
      return _checkParamsAndPerformRequest(requestData, options, callback);
    };

    var getArtistAlbums = function(artistId, options, callback) {
      var requestData = {
        url: _baseUri + '/artists/' + artistId + '/albums'
      };
      return _checkParamsAndPerformRequest(requestData, options, callback);
    };

    /**
     * Gets the access token in use.
     *
     * @return {string} accessToken The access token
     */
    var getAccessToken = function() {
      return _accessToken;
    };

    /**
     * Sets the access token to be used.
     * See [the Authorization Guide](https://developer.spotify.com/web-api/authorization-guide/) on
     * the Spotify Developer site for more information about obtaining an access token.
     *
     * @param {string} accessToken The access token
     * @return {void}
     */
    var setAccessToken = function(accessToken) {
      _accessToken = accessToken;
    };


//   app.get('/', function(req, res){
//     res.render('auth');
//   });
//
//   app.post('/submitted', function(req, res){
//     console.log('Submit button clicked');
//     res.status(200);
//     res.end();
//   });
//
//   app.get('/submitted.html/:id', function(req, res){
//     getArtistAlbums('43ZHCT0cAZBISjO8DG9PnE', function(err, data) {
//   if (err) console.error(err);
//   else {console.log('Artist albums', data);
//         spotifyData = data.body;
//       }
// });
//     res.render('submitted', {person: req.params.id});
//   });
var progress = null;
var trackuri = null;

setAccessToken(me.access_token);

getMyCurrentPlayingTrack(function(err, data){
  if(err) {
    console.log("what error are you" + JSON.stringify(err));
  }
  else {
    if(data.is_playing) {
      progress = data.progress_ms;
      trackuri = data.item.uri;
    }
    console.log(data);
  }
});

//setAccessToken(friend.access_token);

play({"uris":["spotify:track:3twQx3psUMJKj4wna5d1zU"]}, function(err, data){
  if (err) console.error(err);
});







//play(); //trackuri // change access token

//seek(); // progress
};
