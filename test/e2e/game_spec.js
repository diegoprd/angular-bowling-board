'use strict';

describe('GameE2E', function() {

  beforeEach(module('bowlingBoard'));

  var $scope;
  var controller;
  var gameService;

  beforeEach(inject(function($controller, $injector){
    // The injector unwraps the underscores (_) from around the parameter names when matching
    $scope = {};
    gameService = $injector.get('GameService');
    controller = $controller('GameController', { $scope: $scope, GameService: gameService});

    $scope.game.playersAmount = 3;

  }));

  it('Create game for 3 players and submit first player score properly', function() {
    $scope.createGame();
    $scope.startGame();

    $scope.entryPoint = {
      frame: {
        id: 1,
        bowl1 : { title : '3', value : 3 }, 
        bowl2 : { title : '4', value : 4 },
        bowl3 : { title : '0', value : 0 },
        totalPoints: 0
      
      },
      currentPlayer: {id:0, frames:[]}
    };

    $scope.submitScore();

    var entryPointReadyForSecondPlayer = {
      frame: {
        id: 1,
        bowl1 : { title : '0', value : 0 }, 
        bowl2 : { title : '0', value : 0  },
        bowl3 : { title : '0', value : 0 },
        totalPoints: 0
      },
      currentPlayer: {id:1, frames:[], totalPoints: 0}
    };

    var playerOneAfterFirstSubmition = {
      id: 0,
      frames: [
        {
          id: 1,
          bowl1 : { title : '3', value : 3 }, 
          bowl2 : { title : '4', value : 4 },
          bowl3 : { title : '0', value : 0 },
          totalPoints: 7
        }
      ],
      totalPoints: 7

    };

    expect($scope.entryPoint).toEqual(entryPointReadyForSecondPlayer);
    expect($scope.game.players[0]).toEqual(playerOneAfterFirstSubmition);
    
  });

  
});