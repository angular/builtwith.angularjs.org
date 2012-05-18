
function BWAController ($scope, $http, $filter) {
  $http({method: 'GET', url: 'projects.json'}).
    success(function (data, status, headers, config) {

      $scope.projects = data.projects;

      // find the featured project
      for (var i = $scope.projects.length - 1; i >= 0; i--) {
        if (data.projects[i].name === data.featured) {
          $scope.featured = data.projects[i];
          // TODO: remove featured project from search?
          // $scope.projects.slice ...
          break;
        }
      }
      $scope.search();
    }).
    error(function (data, status, headers, config) {
      // TODO: display a nice error message?
    });

  var num = 2;
  $scope.filteredProjects = [];
  $scope.groupedProjects = [];


  $scope.search = function () {
    $scope.filteredProjects = $filter('filter')($scope.projects, $scope.query);
    $scope.group();
  };

  // re-calculate groupedProjects in place 
  $scope.group = function () {

    // TODO: malicious edge cases (?)

    $scope.groupedProjects.length = Math.ceil($scope.filteredProjects.length / num);

    for (var i = 0; i < $scope.filteredProjects.length; i++) {
      if (i % num === 0) {
        $scope.groupedProjects[Math.floor(i / num)] = [ $scope.filteredProjects[i] ];
      } else {
        $scope.groupedProjects[Math.floor(i / num)].push($scope.filteredProjects[i]);
      }
    }

    if ($scope.filteredProjects.length % num !== 0) {
      $scope.groupedProjects[$scope.groupedProjects.length].length = num - ($scope.filteredProjects.length % num);
    }
  };

};
