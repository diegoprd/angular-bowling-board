'use strict';

describe('GameController', function() {

  beforeEach(module('bowlingBoard'));

  var $scope;
  var controller;
  var gameService;
  var originalScopeGame;
  var resetedEntryPoint;


  beforeEach(inject(function($controller, $injector){
    // The injector unwraps the underscores (_) from around the parameter names when matching
    $scope = {};
    gameService = $injector.get('GameService');
    controller = $controller('GameController', { $scope: $scope, GameService: gameService});
    spyOn(gameService, 'updateStatus');
    
    originalScopeGame = {
      status: 'NEW-GAME',
      amountOfFrames: 10,
      framesPlayed: 0,
      players: [],
      finalFrame : false
    };

    resetedEntryPoint = {
      frame: {
        id: 1,
        bowl1 : { title: '0', value: 0 }, 
        bowl2 : { title: '0', value: 0 },
        bowl3 : { title : '0', value : 0 },
        totalPoints: 0
      },
      currentPlayer: undefined
    };

  }));

  it('#createGame should call the gameService updateStatus and createPlayers methods', function() {
    spyOn(gameService, 'createPlayers');

    $scope.createGame();
    
    expect(gameService.updateStatus).toHaveBeenCalledWith(originalScopeGame);
    expect(gameService.createPlayers).toHaveBeenCalled();
  });

  it('#startGame should call the service for updating the status and prepear for the first turn', function() {
    expect($scope.entryPoint).toEqual({});    

    $scope.startGame();

    expect($scope.entryPoint).toEqual(resetedEntryPoint);
    expect(gameService.updateStatus).toHaveBeenCalledWith(originalScopeGame);
  });

  it('#submitSCore should calculate score and move to next player in the list', function() {

    var inprogressGameState = {
      status: 'IN-PROGRESS',
      amountOfFrames: 10,
      framesPlayed: 0,
      players: [{id:0, frames:[]},{id:1, frames:[]},{id:2, frames:[]}],
      finalFrame : false
    };

    var inprogressEntryPoint = {
      frame: {
        id: 1,
        bowl1 : { title: '2', value: 2 }, 
        bowl2 : { title: '3', value: 3 },
        bowl3 : { title : '0', value : 0 },
        totalPoints: 0  
      },
      currentPlayer: {id:0, frames:[]}
    };

    //Coping the inprogress state into the game
    $scope.game = JSON.parse(JSON.stringify(inprogressGameState));
    $scope.entryPoint = JSON.parse(JSON.stringify(inprogressEntryPoint));
    
    //Spies for the service
    spyOn(gameService, 'calculateScore').and.callFake(function() {
      return true;
    });
    spyOn(gameService, 'findPlayer').and.callFake(function() {
      return {id:0, frames:[]};
    });

    $scope.submitScore();

    expect(gameService.findPlayer).toHaveBeenCalledWith(inprogressGameState, inprogressEntryPoint.currentPlayer.id);
    expect(gameService.calculateScore).toHaveBeenCalledWith(inprogressGameState,inprogressEntryPoint.currentPlayer, inprogressEntryPoint.frame);
   
  });

});