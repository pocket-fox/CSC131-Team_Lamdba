"use strict";

var PPQuestionState = {
  preload: function () {},
  create: function () {
    var level = PPGameData.levels[PPGame.levelId];
    var question = level[PPGame.questionId];
    var options = question.options;

    // Randomize options
    if (PPGame.optionOrder.length == 0) {
      var randomOptions = [];
      for (var i = 0; i < options.length; ++i) {
        randomOptions.push({
          id: i,
          obj: options[i],
        });
      }

      while (randomOptions.length > 0) {
        var id = Math.floor(Math.random() * randomOptions.length);
        var obj = randomOptions[id];
        PPGame.optionOrder.push(obj);
        randomOptions.splice(id, 1);
      }
    }

    // Background
    this.backgroundSprite = this.add.sprite(0, 0, "background_2");

    // Question Text Sprite
    this.questionTextSprite = this.add.sprite(
      0.45 * WIDTH,
      0.1 * HEIGHT,
      "pp_question_text"
    );

    // Question Image Sprite
    this.questionImageSprite = this.add.sprite(0, 0, question.name);

    // Mute button
    createMuteButton(this);

    // Pause Button
    var onPause = function () {
      AudioManager.playSound("bloop_sfx", this);
      LastState = "PPQuestionState";
      this.state.start("PauseState");
    };
    this.pauseButton = this.add.button(
      0.892 * WIDTH,
      0.185 * HEIGHT,
      "button_pause",
      onPause,
      this,
      0,
      0,
      1
    );
    this.pauseButton.scale.setTo(0.75);

    // Choice Buttons
    var buttonWidth = WIDTH * (options.length == 3 ? 0.33 : 0.42);
    for (var i = 0; i < PPGame.optionOrder.length; ++i) {
      var onClick = function (ref) {
        PPGame.chosenOptionId = ref.optionIndex;
        PPGame.scoreLock = false;
        PPGame.optionOrder = [];
        AudioManager.playSound("bloop_sfx", this);
        this.state.start("PPRainState");
      };
      var xOffset =
        0.5 * WIDTH -
        buttonWidth * (PPGame.optionOrder.length - 1) * 0.5 +
        buttonWidth * i;
      var optionButton = this.add.button(
        xOffset,
        0.68 * HEIGHT,
        PPGame.optionOrder[i].obj.name,
        onClick,
        this,
        0,
        0,
        0
      );
      optionButton.anchor.setTo(0.5, 0.5);
      optionButton.optionIndex = PPGame.optionOrder[i].id;
      this.add
        .tween(optionButton.scale)
        .to({ x: 0.95, y: 0.95 }, 600, "Linear", true)
        .yoyo(true, 0)
        .loop(true);
    }

    // Keyboard 1, 2, and 3 to select answer options
    this.selectOptionByIndex = function (idx) {
      var opt = PPGame.optionOrder && PPGame.optionOrder[idx];
      if (!opt) return;
      PPGame.chosenOptionId = opt.id;
      PPGame.scoreLock = false;
      PPGame.optionOrder = [];
      AudioManager.playSound("bloop_sfx", this);
      this.state.start("PPRainState");
    };

    // Top row
    this.input.keyboard.addKey(Phaser.Keyboard.ONE)
      .onDown.add(function(){ this.selectOptionByIndex(0); }, this);
    this.input.keyboard.addKey(Phaser.Keyboard.TWO)
      .onDown.add(function(){ this.selectOptionByIndex(1); }, this);
    this.input.keyboard.addKey(Phaser.Keyboard.THREE)
      .onDown.add(function(){ this.selectOptionByIndex(2); }, this);

    // Numpad
    this.input.keyboard.addKey(Phaser.Keyboard.NUMPAD_1)
      .onDown.add(function(){ this.selectOptionByIndex(0); }, this);
    this.input.keyboard.addKey(Phaser.Keyboard.NUMPAD_2)
      .onDown.add(function(){ this.selectOptionByIndex(1); }, this);
    this.input.keyboard.addKey(Phaser.Keyboard.NUMPAD_3)
      .onDown.add(function(){ this.selectOptionByIndex(2); }, this);

    // Play music
    AudioManager.playSong("pp_music", this);

    this.game.canvas.setAttribute('role', 'img');
    this.game.canvas.setAttribute('tabindex', '1');

    var domOverlays = A11yKit.buildDomOverlaysFromWorld(this.game, { startTabIndex: 100 });
    this.domElements = domOverlays.domElements;
    self = this;

    // 3. Initialize A11yKit with focus management
    this.a11y = A11yKit.init({
        parent: this.game.canvas.parentNode,
        elements: this.domElements,
        escapeKey: 'Escape',
        live: 'polite',
        onEnable: function(){ self.a11y.announce('Game focused.'); },
        onDisable: function(){ self.a11y.announce('Game focus released'); }
    });

    // 4. Enable focus trap on canvas interaction
    this.game.canvas.addEventListener('focus', function(){ self.a11y.trap.enable(); }, true);
    this.game.canvas.addEventListener('click', function(){ self.a11y.trap.enable(); }, true);
    self.a11y.trap.enable();


    
  },
  shutdown: function () {
      console.log("shutting down Title.js...");

      if (this.a11y) { this.a11y.destroy(); this.a11y = null; }
      if (this.domElements) { A11yKit.destroyDomOverlays(this.domElements); this.domElements = null };
  },

  update: function () {},
};
