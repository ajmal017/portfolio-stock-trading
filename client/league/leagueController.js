app.controller('LeagueController', ['$scope', '$stateParams', 'DashboardFactory', function($scope, $stateParams, DashboardFactory){

  //Gets the league
  var leagueId = $stateParams.leagueId;

  // initialize a flag indicating that the league has not started yet
  $scope.hasStarted = false;
  $scope.hasEnded = false;

  // grab the current moment using moment.js
  var currentMoment = moment().utc();

  $scope.checkStart = function (league) {
    var start = moment(league.start).utc();
    if (currentMoment.isBefore(start)) {
      $scope.hasStarted = false;
    } else {
      $scope.hasStarted = true;
    }
  };

  $scope.checkEnd = function (league) {
    var end = moment(league.end).utc();
    if (currentMoment.isAfter(end)) {
      $scope.hasEnded = true;
    } else {
      $scope.hasEnded = false;
    }
  };

  //check if market is open
  $scope.checkTradingHours = function () {
    var tradingStart = moment().utc().hour(13).minute(30);
    var tradingEnd = moment().utc().hour(20);
    $scope.isBetweenTradingHours = currentMoment.isBetween(tradingStart, tradingEnd);
  };

  DashboardFactory.getLeagueById(leagueId)
    .then(function(league){
      $scope.league = league;
      // TODO: make this run conditionally
      // if (league.hasStarted === false ) {
      //   run the checkStart
      // }
      $scope.checkStart($scope.league);
      $scope.checkEnd($scope.league);
      if ($scope.hasStarted || !$scope.hasEnded) {
        $scope.checkTradingHours();
      }
    });

    $scope.getUserLeagues = function () {
    var userId = $window.localStorage.getItem('com.tp.userId');
    DashboardFactory.getUserLeagues(userId)
      .then(function(portfolios){
        $scope.portfolios = portfolios;

        for(var i = 0; i < $scope.portfolios.length; i++){

          (function(index){
            $scope.portfolios[index].endDate = '';
            DashboardFactory.getLeagueById($scope.portfolios[index].id)
              .then(function(league){
                $scope.portfolios[index].endDate = league.end;
              });
          })(i)
        }
        console.log('portfolios', $scope.portfolios);
        $(document).ready(function(){
        // the "href" attribute of .modal-trigger must specify the modal ID that wants to be triggered
        $('.modal-trigger').leanModal();
      });
      });
  };


}]);
