var Q = require('q');
var https = require('https');

deleteAllProjects().
  then(createSampleProjects).
  then(function(){
    console.log('DONE');
  });


///////////////////////////////////////////////////////////////


function deleteAllProjects() {
  var d = Q.defer();
  request('GET').then(function(projects) {
    var existingProjects = [];
    projects.forEach(function(project) {
      existingProjects.push(request('DELETE', project._id.$oid));
    });
    Q.all(existingProjects).then(d.resolve);
  });
  return d.promise;
}

function createSampleProjects() {
  return Q.all([
    createProject('AngularJS', 'http://angularjs.org', 'HTML enhanced for web apps!'),
    createProject('jQuery', 'http://jquery.com/', 'Write less, do more.'),
    createProject('Backbone', 'http://documentcloud.github.com/backbone/', 'Models for your apps.'),
    createProject('SproutCore', 'http://sproutcore.com/', 'Innovative web-apps.'),
    createProject('Sammy', 'http://sammyjs.org/', 'Small with class.'),
    createProject('Spine', 'http://spinejs.com/', 'Awesome MVC Apps.'),
    createProject('Cappucino', 'http://cappuccino.org/', 'Objective-J.'),
    createProject('Knockout', 'http://knockoutjs.com/', 'MVVM pattern.'),
    createProject('GWT', 'https://developers.google.com/web-toolkit/', 'JS in Java.'),
    createProject('Ember', 'http://emberjs.com/', 'Ambitious web apps.'),
    createProject('Batman', 'http://batmanjs.org/', 'Quick and beautiful.')
  ]);

  function createProject(name, site, description) {
    return request('POST', null, {
      name: name,
      site: site,
      description: description
    });
  }
}

function request(method, id, data) {
  var d = Q.defer();

  var options = {
    host: 'api.mongolab.com',
    port: 443,
    path: '/api/1/databases/angularjs/collections/projects/' + ( id || '' ) + '?apiKey=4f847ad3e4b08a2eed5f3b54',
    method: method || 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  };

  console.log(options.method, options.path);

  var req = https.request(options, function(res) {
    var body = [];
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
      body.push(chunk);
    });
    res.on('end', function() {
      if (res.statusCode == 200) {
        d.resolve(JSON.parse(body.join('')));
      } else {
        console.log(body.join(''));
      }
    });
  });

  data && req.write(JSON.stringify(data));
  req.end();

  return d.promise;
}
