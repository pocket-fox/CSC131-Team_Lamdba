"use strict";

var WIDTH = 900;
var HEIGHT = 592;

var Game;
var lastState = null; // keeps track of previous scene name
window.onload = function () {
  Game = new Phaser.Game(WIDTH, HEIGHT, Phaser.AUTO, "gameDiv");

  Game.state.add("BootState", BootState);
  Game.state.add("LoadState", LoadState);
  Game.state.add("StartState", StartState); // added to launch start.js
  Game.state.add("TitleState", TitleState);
  Game.state.add("IntroState", IntroState);
  Game.state.add("PauseState", PauseState);

  Game.state.add("PPIntroState", PPIntroState);
  Game.state.add("PPQuestionState", PPQuestionState);
  Game.state.add("PPRainState", PPRainState);
  Game.state.add("PPResultState", PPResultState);
  Game.state.add("PPScoreState", PPScoreState);
  Game.state.add("PPLevelSelectState", PPLevelSelectState);

  Game.state.start("BootState");
};
