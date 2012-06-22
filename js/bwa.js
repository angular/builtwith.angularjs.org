var app = angular.module('bwaApp', []);

app.directive('bwaProject', function() {
  return {
    restrict: 'E',
    templateUrl: 'bwa-project.html',
    scope: {
      project: 'accessor',
      addTag: 'accessor'
    }
  }
});

app.controller('BWAController', function ($scope, $http, $filter) {

  $scope.sortables = [
    {
      label: 'Unsorted',
      val: 'none'
    },
    {
      label: 'Name',
      val: 'name'
    },
    {
      label: 'Description',
      val: 'desc'
    },
    {
      label: 'Submitter',
      val: 'submitter'
    }
  ];
  $scope.sortPrep = 'none';

  $http.get('projects/projects.json').
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

      $scope.projects.sort(function () {
        return Math.random() - 0.5;
      });

      $scope.tags = [];
      $scope.activeTags = [];

      // add tags
      angular.forEach(data.projects, function (project) {
        angular.forEach(project.tags, function (tag) {

          // ensure tags are unique
          if ($scope.tags.indexOf(tag) === -1) {
            $scope.tags.push(tag);
          }
        });
      });

      $scope.tags.sort();
      $scope.search();
    }).
    error(function (data, status, headers, config) {
      // TODO: display a nice error message?
      $scope.error = "Cannot get data from the server";
    });

  var num = 2;
  $scope.filteredProjects = [];
  $scope.groupedProjects = [];

  // search helpers
  var searchMatch = function (haystack, needle) {
    if (!needle) {
      return true;
    }
    return haystack.toLowerCase().indexOf(needle.toLowerCase()) !== -1;
  };

  var hasAllTags = function (haystack, needles) {
    var ret = true;
    angular.forEach(needles, function (needle) {
      if (haystack.indexOf(needle) === -1) {
        ret = false;
      }
    });
    return ret;
  };

  $scope.search = function () {
    $scope.filteredProjects = $filter('filter')($scope.projects, function (project) {
      return (searchMatch(project.desc, $scope.query) || searchMatch(project.name, $scope.query)) &&
        hasAllTags(project.tags, $scope.activeTags);
    });

    if ($scope.sortPrep !== 'none') {
      $scope.filteredProjects = $filter('orderBy')($scope.filteredProjects, $scope.sortPrep);
    }

    $scope.currentPage = 0;
    $scope.group();
  };

  // re-calculate groupedProjects in place
  $scope.group = function () {

    $scope.groupedProjects.length = Math.ceil($scope.filteredProjects.length / num);

    for (var i = 0; i < $scope.filteredProjects.length; i++) {
      if (i % num === 0) {
        $scope.groupedProjects[Math.floor(i / num)] = [ $scope.filteredProjects[i] ];
      } else {
        $scope.groupedProjects[Math.floor(i / num)].push($scope.filteredProjects[i]);
      }
    }

    if ($scope.filteredProjects.length % num !== 0) {
      $scope.groupedProjects[$scope.groupedProjects.length - 1].length = num - ($scope.filteredProjects.length % num);
    }

    $scope.groupToPages();
  };

  var itemsPerPage = 5;
  $scope.pagedProjects = [];
  $scope.currentPage = 0;

  // calc pages in place
  $scope.groupToPages = function () {
    $scope.pagedProjects = [];

    for (var i = 0; i < $scope.groupedProjects.length; i++) {
      if (i % itemsPerPage === 0) {
        $scope.pagedProjects[Math.floor(i / itemsPerPage)] = [ $scope.groupedProjects[i] ];
      } else {
        $scope.pagedProjects[Math.floor(i / itemsPerPage)].push($scope.groupedProjects[i]);
      }
    }
  };

  $scope.addTag = function (tagName) {
    tagName = tagName || this.tag;

    // only allow tags to be added uniquely
    if ($scope.activeTags.indexOf(tagName) !== -1) {
      return;
    }

    angular.forEach($scope.tags, function (tag, i) {
      if (i === 0 && tag === tagName) {
        $scope.activeTags.push($scope.tags.shift());
      } else if (tag === tagName) {
        $scope.tags.splice(i, 1);
        $scope.activeTags.push(tag);
      }
    });

    $scope.activeTags.sort();
    $scope.search();
  };

  // TODO: code duplicated here
  $scope.removeTag = function () {
    var tagName = this.tag;

    angular.forEach($scope.activeTags, function (tag, i) {
      if (i === 0 && tag === tagName) {
        $scope.tags.push($scope.activeTags.shift());
      } else if (tag === tagName) {
        $scope.activeTags.splice(i, 1);
        $scope.tags.push(tag);
      }
    });

    $scope.tags.sort();
    $scope.search();
  };

  // like python's range fn
  $scope.range = function (start, end) {
    var ret = [];
    if (!end) {
      end = start;
      start = 0;
    }
    for (var i = start; i < end; i++) {
      ret.push(i);
    }
    return ret;
  };

  $scope.prevPage = function () {
    if ($scope.currentPage > 0) {
      $scope.currentPage--;
    }
  };

  $scope.nextPage = function () {
    if ($scope.currentPage < $scope.pagedProjects.length - 1) {
      $scope.currentPage++;
    }
  };

  $scope.setPage = function () {
    $scope.currentPage = this.n;
  };
});
