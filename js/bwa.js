function BWAController ($scope, $http) {

  $http({method: 'GET', url: 'projects.json'}).
    success(function(data, status, headers, config) {

      $scope.numberOfProjects = data.projects.length;
      $scope.projects = [];

      for (var i = 0; i < data.projects.length; i++) {
        if (i % 2 === 0) {
          $scope.projects[Math.floor(i / 2)] = [ data.projects[i] ];
        } else {
          $scope.projects[Math.floor(i / 2)].push(data.projects[i]);
        }
      }

      // find the featured project
      for (var i = $scope.projects.length - 1; i >= 0; i--) {
        if (data.projects[i].name === data.featured) {
          $scope.featured = data.projects[i];
          break;
        }
      }

    }).
    error(function(data, status, headers, config) {
      // called asynchronously if an error occurs
      // or server returns response with status
      // code outside of the <200, 400) range
    });
}
