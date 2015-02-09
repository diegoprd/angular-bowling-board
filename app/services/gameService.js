'use strict';

angular.module('bowlingBoard').service('GameService', ['lodash', function (_) {
  
  var gameStatus = {
    newGame: 'NEW-GAME',
    starting: 'CREATING',
    inProgress: 'IN-PROGRESS',
    finishing: 'FINISHING',
    done: 'DONE'
  };

  var gameFlow = [
    {name: gameStatus.newGame, next: gameStatus.starting},
    {name: gameStatus.starting, next: gameStatus.inProgress},
    {name: gameStatus.inProgress, next: gameStatus.finishing},
    {name: gameStatus.finishing, next: gameStatus.done}
  ];

  var scores = {
    strike: 10,
    cero: 0,
    one: 1, 
    two: 2, 
    three: 3, 
    four: 4, 
    five: 5, 
    six: 6, 
    seven: 7, 
    eight: 8, 
    nine: 9,
    values: []
  };

  scores.values = [
    {title: '0', value: scores.cero}, 
    {title: '1', value: scores.one},
    {title: '2', value: scores.two},
    {title: '3', value: scores.three},
    {title: '4', value: scores.four},
    {title: '5', value: scores.five},
    {title: '6', value: scores.six},
    {title: '7', value: scores.seven},
    {title: '8', value: scores.eight},
    {title: '9', value: scores.nine},
    {title: 'Strike', value: scores.strike}
  ];

  function createPlayers(game) {
    _.times(game.playersAmount, function(n){
      game.players.push({id:n, frames:[], totalPoints: 0});
    });
  };

  function updateStatus(game) {
    var currentStep = _.find(gameFlow, function(step) {
      return step.name === game.status;
    });
    game.status = currentStep.next;
  };


  function calculateScore(game, player, frame) {
    if(game.finalFrame){
      calculateFinalFrameScores(game, player, frame);
    } else {
      calculateNormalFrameScores(game, player, frame);
    }
    player.frames.push(frame);
  };

  function calculateFinalFrameScores(game, player, frame) {
    //Should be improved, not covering all the needed validations
    doCalculateScore(game, player, frame);
    frame.totalPoints += frame.bowl3.value;
    player.totalPoints += frame.bowl3.value;
  };

  function calculateNormalFrameScores(game, player, frame) {
    var wasStrike = (frame.bowl1.value === scores.strike);
    var wasSpare = (!wasStrike && frame.bowl1.value+frame.bowl2.value === 10);

    if (wasStrike){
      player.strike = true;
      console.log('was a strike');
      //and dont do anything else
    } else if(wasSpare) {
      player.spare = true;
      console.log('was a spare');
      //and dont do anything else
    } else {
      doCalculateScore(game, player, frame);
    }
  };

  function doCalculateScore(game, player, frame) {
    frame.totalPoints = frame.bowl1.value + frame.bowl2.value;
    player.totalPoints += frame.totalPoints;

    //We need to update the previous frame if it was an strike
    if(player.strike){
      var previousFrame = findFrame(game, player.id,frame.id-1);
      previousFrame.totalPoints = frame.totalPoints + scores.strike;
      player.totalPoints += previousFrame.totalPoints;
      player.strike = false;
    }
    if(player.spare){
      var previousFrame = findFrame(game, player.id,frame.id-1);
      previousFrame.totalPoints = frame.bowl1.value + scores.strike;
      player.totalPoints += previousFrame.totalPoints;
      player.spare = false;
    }
  };

  function findFrame(game, playerId, frameId) {
    var player = _.find(game.players, function(player) { return player.id == playerId });

    return _.find(player.frames, function(frame) { return frame.id == frameId });
  };

  function findPlayer(game, targetId) {
    return _.find(game.players, function(player) { return player.id == targetId });
  };

  return {
    createPlayers : createPlayers,
    updateStatus: updateStatus,
    newGameStatus: gameStatus.newGame,
    calculateScore: calculateScore,
    findPlayer: findPlayer,
    scores: scores,
    gameAvailableStatus: gameStatus
  };
}])