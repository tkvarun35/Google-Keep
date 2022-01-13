var app = angular.module("app", ["ui.router", "gridster"]);
// var grid = angular.module("grid", ["gridster"]);
window.baseUrl = "https://10.21.96.128:8000";

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
      //url: window.baseUrl + "/keepsapp/viewnotes",
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
  $scope.standardItems = [
    { sizeX: 2, sizeY: 1, row: 0, col: 0 },
    { sizeX: 2, sizeY: 2, row: 0, col: 2 },
    { sizeX: 1, sizeY: 1, row: 0, col: 4 },
    { sizeX: 1, sizeY: 1, row: 0, col: 5 },
    { sizeX: 2, sizeY: 1, row: 1, col: 0 },
    { sizeX: 1, sizeY: 1, row: 1, col: 4 },
    { sizeX: 1, sizeY: 2, row: 1, col: 5 },
    { sizeX: 1, sizeY: 1, row: 2, col: 0 },
    { sizeX: 2, sizeY: 1, row: 2, col: 1 },
    { sizeX: 1, sizeY: 1, row: 2, col: 3 },
    { sizeX: 1, sizeY: 1, row: 2, col: 4 },
  ];

  $scope.gridsterOpts = {
    columns: 6, // the width of the grid, in columns
    pushing: true, // whether to push other items out of the way on move or resize
    floating: true, // whether to automatically float items up so they stack (you can temporarily disable if you are adding unsorted items with ng-repeat)
    swapping: false, // whether or not to have items of the same size switch places instead of pushing down if they are the same size
    width: "auto", // can be an integer or 'auto'. 'auto' scales gridster to be the full width of its containing element
    colWidth: "auto", // can be an integer or 'auto'.  'auto' uses the pixel width of the element divided by 'columns'
    rowHeight: "match", // can be an integer or 'match'.  Match uses the colWidth, giving you square widgets.
    margins: [10, 50], // the pixel distance between each widget
    outerMargin: true, // whether margins apply to outer edges of the grid
    sparse: false, // "true" can increase performance of dragging and resizing for big grid (e.g. 20x50)
    isMobile: false, // stacks the grid items if true
    mobileBreakPoint: 600, // if the screen is not wider that this, remove the grid layout and stack the items
    mobileModeEnabled: true, // whether or not to toggle mobile mode when screen width is less than mobileBreakPoint
    minColumns: 1, // the minimum columns the grid must have
    minRows: 2, // the minimum height of the grid, in rows
    maxRows: 100,
    defaultSizeX: 2, // the default width of a gridster item, if not specifed
    defaultSizeY: 1, // the default height of a gridster item, if not specified
    minSizeX: 1, // minimum column width of an item
    maxSizeX: null, // maximum column width of an item
    minSizeY: 1, // minumum row height of an item
    maxSizeY: null, // maximum row height of an item
    resizable: {
      // enabled: true,
      handles: ["n", "e", "s", "w", "ne", "se", "sw", "nw"],
      start: function (event, $element, widget) {}, // optional callback fired when resize is started,
      resize: function (event, $element, widget) {}, // optional callback fired when item is resized,
      stop: function (event, $element, widget) {}, // optional callback fired when item is finished resizing
    },
    draggable: {
      enabled: false, // whether dragging items is supported
      handle: ".my-class", // optional selector for drag handle
      start: function (event, $element, widget) {
        console.log("dragable");
      }, // optional callback fired when drag is started,
      drag: function (event, $element, widget) {
        console.log("dragable");
      }, // optional callback fired when item is moved,
      stop: (event, $element, widget) => {
        console.log("dragable");
      },
    },
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
