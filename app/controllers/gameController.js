'use strict';

angular.module('bowlingBoard').controller('GameController', ['lodash', '$scope', 'GameService', function(_ , $scope, GameService){

  $scope.assignmentTypes = {
    first : 'FIRST',
    next: 'NEXT'
  };

  $scope.game = {
    status: GameService.newGameStatus,
    amountOfFrames: 10,
    framesPlayed: 0,
    players: [],
    finalFrame: false
  };

  $scope.scoresSecondBowl = _.reject(GameService.scores.values, function(scope){ return scope.value === 10});

  $scope.entryPoint = {};

  $scope.createGame = function() {
    GameService.updateStatus($scope.game);
    GameService.createPlayers($scope.game);
  };

  $scope.startGame = function() {
    GameService.updateStatus($scope.game);
    nextTurn($scope.assignmentTypes.first);
  };

  $scope.submitScore = function() {

    var currentPlayer = GameService.findPlayer($scope.game, $scope.entryPoint.currentPlayer.id);
    var currentFrame = $scope.entryPoint.frame;

    GameService.calculateScore($scope.game, currentPlayer, currentFrame);

    nextTurn($scope.assignmentTypes.next);
  };

  $scope.gameAvailableStatus = function() {
    return GameService.gameAvailableStatus;
  };

  $scope.availableScores = function() {
    return GameService.scores;
  };
 
  $scope.updateBowl2 = function() {
    $scope.scoresSecondBowl = _.reject(GameService.scores.values, function(score){ 
      return (score.value === 10 || score.value + $scope.entryPoint.frame.bowl1.value > 10)
    });
    $scope.entryPoint.frame.bowl2 = GameService.scores.values[0];
  };

  // Private functions
  function nextTurn(assignmentType) {
    resetEntryPoint();
    assignTurn(assignmentType);
  };

  function assignTurn(value) {
    if(value == $scope.assignmentTypes.first) {
      $scope.entryPoint.currentPlayer = GameService.findPlayer($scope.game,0);
      $scope.entryPoint.frame.id = 1;
    } else {
      var previousPlayer = $scope.entryPoint.currentPlayer;
      var nextPlayer = GameService.findPlayer($scope.game, previousPlayer.id + 1);

      if (nextPlayer){
        $scope.entryPoint.currentPlayer = nextPlayer;
      } else {
        //Is the last player of the list, so we need to check if the game will continue
        if(!checkEndOfGame()){
          //nextFrame will play
          $scope.entryPoint.frame.id++;
          $scope.entryPoint.currentPlayer = GameService.findPlayer($scope.game,0);
          if ($scope.entryPoint.frame.id === 10){
            $scope.game.finalFrame = true;
          }
        }else{
          gameOver();
        };
      }
    }
  };

  function resetEntryPoint() {
    var ceroBowl = $scope.availableScores().values[0];

    $scope.entryPoint.frame = {
        id: $scope.entryPoint.frame? $scope.entryPoint.frame.id : null,
        bowl1: ceroBowl,
        bowl2: ceroBowl,
        bowl3: ceroBowl,
        totalPoints: GameService.scores.cero
    };
  };

  function checkEndOfGame() {
    var finished = false;
    console.log('chequing end of game');
    $scope.game.framesPlayed++;
    console.log('Frames already played:',$scope.game.framesPlayed);

    if ($scope.game.framesPlayed == $scope.game.amountOfFrames){
      $scope.entryPoint.currentPlayer = {};
      GameService.updateStatus($scope.game);
      finished = true;
    }

    return finished;
  };

  function gameOver() {
    $scope.orderedPlayers = _.sortBy($scope.game.players, 'totalPoints').reverse();
    $scope.winnerName = $scope.orderedPlayers[0].name;
  };

}]);
