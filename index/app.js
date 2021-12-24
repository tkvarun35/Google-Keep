var app = angular.module("app", ["ui.router"]);
window.baseUrl =
  "https://c8ab-2401-4900-46aa-2a71-c57a-e855-53bb-21bc.ngrok.io";

app.service("user", function () {
  var username;
  var loggedin = true;
  this.setName = function (name) {
    username = name;
  };
  this.getName = function () {
    return username;
  };
  this.isUserLoggedIn = function () {
    return loggedin;
  };
  this.userLoggedIn = function () {
    loggedin = true;
  };
  this.status = function () {
    return loggedin;
  };
});

app.config([
  "$stateProvider",
  function ($x) {
    $x.state("bin", {
      url: "/bin",
      templateUrl: "../bin/bin.html",
      controller: "binCtrl",
    })
      .state("login", {
        url: "/login",
        templateUrl: "../login/login.html",
        controller: "loginCtrl",
      })
      .state("logout", {
        url: "/login",
        templateUrl: "../login/login.html",
        controller: "Ctrl",
      })

      .state("dashboard", {
        url: "/home",
        templateUrl: "../dashboard/dashboard.html",

        controller: "dashboardCtrl",
      })
      .state("otherwise", {
        url: "*path",
        templateUrl: "<strong>no route available</strong>",
      });
  },
]);

// The following is the Login Controller

app.controller("loginCtrl", function ($scope, $http, $location, user) {
  $scope.$parent.status = true;

  $scope.login = function () {
    var students = {
      username: $scope.username,
      password: $scope.password,
    };

    $http({
      url: window.baseUrl + "/keepsapp/login",
      method: "POST",
      withCredentials: true,
      data: students,
    }).then(
      function (response) {
        if (response.status == "200") {
          user.userLoggedIn();
          user.setName(students.username);

          // $scope.state = user.status();
          $location.path("/home");
        } else {
          alert("Invalid Login");
        }
      },
      function (response) {
        if (response.status == "403") {
          $location.path("/login");
        }
      }
    );
  };
  $scope.logout = function () {
    $scope.$parent.status = true;

    $http({
      method: "GET",
      url: window.baseUrl + "/keepsapp/logout",
      withCredentials: true,
    }).then(function (response) {
      $location.path("/login");
    });
  };
});

app.controller("mainCtrl", function ($scope, $http, $location, user) {
  $scope.status = true;
});

// The following is the Dashboard Controller

app.controller("dashboardCtrl", function ($scope, $http, user) {
  $scope.$parent.status = false;

  // $scope.$parent.var = "ffd";

  // console.log($scope.$parent.var);
  $scope.use = user.getName();

  $scope.view = function () {
    $http({
      url: window.baseUrl + "/keepsapp/viewnotes",
      method: "GET",
      withCredentials: true,
    }).then(function (response) {
      $scope.data = response.data;
    });
  };
  $scope.view();
  $scope.dashboard = function () {
    var notes = {
      title: $scope.title,
      description: $scope.note,
    };

    $http({
      url: window.baseUrl + "/keepsapp/createnote",
      method: "POST",
      withCredentials: true,
      data: notes,
    }).then(function (response) {
      $scope.view();
    });
  };

  $scope.move = function (note) {
    $http({
      method: "GET",
      url: window.baseUrl + "/keepsapp/delnote",
      params: { id: note },
      withCredentials: true,
    }).then(function (response) {
      console.log("Moved To Bin");
      $scope.view();
    });
  };
});

// The following is the Trash Controller

app.controller("binCtrl", function ($scope, $http) {
  $scope.restore = function () {
    $http({
      url: window.baseUrl + "/keepsapp/trash",
      method: "GET",
      withCredentials: true,
    }).then(function (response) {
      $scope.data = response.data;
    });
  };
  $scope.restore();
  $scope.rest = function (note) {
    $http({
      method: "GET",
      url: window.baseUrl + "/keepsapp/restore",
      params: { id: note },
      withCredentials: true,
    }).then(function (response) {
      console.log("Restored");
      $scope.restore();
    });
  };
});
