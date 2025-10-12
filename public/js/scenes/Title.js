"use strict";

var TitleState = {

  _a11yRoot: null,
  _live: null,
  _label: null,
  
  preload: function () {},
  create: function () {

    this.game.canvas.setAttribute('role', 'img');
    // this.game.canvas.setAttribute('aria-label', 'Game canvas region')
    
    // Background
    this.backgroundSprite = this.add.sprite(0, 0, "background_1");

    // Clouds
    this.cloudSprites = createCloudSprites(this);

    // Titles
    this.titleProfessorSprite = this.add.sprite(
      0.03 * WIDTH,
      0.05 * HEIGHT,
      "title_professor"
    );
    this.titlePreventsSprite = this.add.sprite(
      0.34 * WIDTH,
      0.1 * HEIGHT,
      "title_prevents"
    );

    // Characters
    this.professorSprite = this.add.sprite(
      0.03 * WIDTH,
      0.37 * HEIGHT,
      "professor_1"
    );

    // Buttons
    this.playButton = this.add.button(
      0.3 * WIDTH,
      0.68 * HEIGHT,
      "button_play",
      this.playButtonActions.onClick,
      this,
      0,
      0,
      1
    );
    this.playButton.anchor.setTo(0.5, 0.5);
    this.playButton.name = 'Play';
    this.add
      .tween(this.playButton.scale)
      .to({ x: 1.1, y: 1.1 }, 600, "Linear", true)
      .yoyo(true, 0)
      .loop(true);

    // Mute button
    createMuteButton(this);

    // Audio
    AudioManager.playSong("title_music", this);

    // Dom Functionality
    var self = this;
    this.game.world.children.forEach(function(child, n) {
      if (child.inputEnabled) {
        console.log('Found interactable ', n, ': ', (child.name || child.key || 'button-${n}'), child.x, child.y, child.width, child.height);
        var domButton = document.createElement('button');
        domButton.setAttribute('aria-label', child.name || child.key || 'button-${n}');
        domButton.setAttribute('tabindex', String(n));
        domButton.setAttribute('type', 'button');

        domButton.style.position = 'absolute';
        domButton.style.left = (self.game.canvas.offsetLeft + child.x) + 'px';
        domButton.style.top = (self.game.canvas.offsetTop + child.y) + 'px';
        domButton.style.width = child.width + 'px';
        domButton.style.height = child.height + 'px';
        domButton.style.transform = 'translate(-50%, -50%)';
        domButton.style.zIndex = 1000;
        domButton.style.pointerEvents = 'auto';
        domButton.style.background = 'transparent';
        domButton.style.border = 'none';
        domButton.addEventListener('click', self.playButtonActions.onClick.bind(self))

        self.game.canvas.parentNode.appendChild(domButton);
        document.body.appendChild(domButton);
      }
    });

    

  },
  update: function () {
    updateCloudSprites(this);
  },
  playButtonActions: {
    onClick: function () {
      AudioManager.playSound("bloop_sfx", this);
      this.state.start("IntroState");
    },
  },
};
