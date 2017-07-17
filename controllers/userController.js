var data = [{item: "get milk"}];
var bodyParser = require('body-parser');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var urlencodedParser = bodyParser.urlencoded({extended: false});
var _baseUri = 'https://api.spotify.com/v1';
var _accessToken = 'BQBsHn0Y48scCHI4Ag87IraxzYbuItdVFi3HlcpkRb_8VWij560a-aTVTHY0qKGfgSIptPYjVIc2IpYyYffjY_xjpM7wYYLTKy1wBl1euq5Q0gzBhong1lbRWbRIlFaVsRoMiZQwuz7i2nccRA4oZ7p5YzMWY0adLoP1D03DO5vypVUbSGn3LpU';
var spotifyData = null;
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



  // options extend postData, if any. Otherwise they extend parameters sent in the url
  var type = requestData.type || 'GET';
  if (type !== 'GET' && requestData.postData && !optionsAlwaysExtendParams) {
    requestData.postData = _extend(requestData.postData, opt);
  } else {
    requestData.params = _extend(requestData.params, opt);
  }
  return _performRequest(requestData, cb);
};

var getArtistAlbums = function(artistId, options, callback) {
    var requestData = {
      url: _baseUri + '/artists/' + artistId + '/albums'
    };
    return _checkParamsAndPerformRequest(requestData, options, callback);
  };

var getMyCurrentPlayingTrack = function(options, callback) {
    var requestData = {
      url: _baseUri + '/me/player/currently-playing'
    };
    return _checkParamsAndPerformRequest(requestData, options, callback);
  };

var transferMyPlayback = function(deviceIds, options, callback) {
    var postData = options || {};
    postData.device_ids = deviceIds;
    var requestData = {
      type: 'PUT',
      url: _baseUri + '/me/player',
      postData: postData
    };
    return _checkParamsAndPerformRequest(requestData, options, callback);
  };

module.exports = function(app, my_uri, friend_uri){
  app.get('/', function(req, res){
    res.render('auth');
  });

  app.post('/submitted', function(req, res){
    console.log('Submit button clicked');
    res.status(200);
    res.end();
  });

  app.get('/submitted.html/:id', function(req, res){
    getArtistAlbums('43ZHCT0cAZBISjO8DG9PnE', function(err, data) {
  if (err) console.error(err);
  else {console.log('Artist albums', data);
        spotifyData = data.body;
      }
});
    res.render('submitted', {person: req.params.id});
  });

};
