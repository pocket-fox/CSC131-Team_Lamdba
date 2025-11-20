"use strict";

// screen reader
function announceToScreenReader(text) {
    const region = document.getElementById('screenreader-text');
    if (region) region.textContent = text;
}

function speak(text) {
    if ('speechSynthesis' in window) {
        const utter = new SpeechSynthesisUtterance(text);
        utter.lang = 'en-US';
        utter.rate = 1;
        utter.pitch = 1;
        window.speechSynthesis.cancel(); // stop overlapping
        window.speechSynthesis.speak(utter);
    }
}

var StartState = {
    preload: function () {},
        create: function () {
            // Background
            this.backgroundSprite = this.add.sprite(0, 0, "background_1");

            // Clouds
            this.cloudSprites = createCloudSprites(this);

            this.titlePreventsSprite = this.add.sprite( //calls image
                0.25 * WIDTH, // moves to the left
                0.05 * HEIGHT, // moves to the right
                "title_Control"
            );

            // Characters
            this.professorSprite = this.add.sprite(
                0.03 * WIDTH,
                0.37 * HEIGHT,
                "professor_1"
            );

            // Buttons
            this.playButton = this.add.button(
                0.2 * WIDTH,
                0.68 * HEIGHT,
                "button_play",
                this.playButtonActions.onClick,
                this,
                0,
                0,
                1
            );
            this.playButton.anchor.setTo(0.5, 0.5);
            this.add
                .tween(this.playButton.scale)
                .to({x: 1.1, y: 1.1}, 600, "Linear", true)
                .yoyo(true, 0)
                .loop(true);

            // captures enter key
            this.spaceKey = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
            this.input.keyboard.addKeyCapture([Phaser.Keyboard.SPACEBAR]);

            // debug message + button click (open in browser, press f12)
            this.spaceKey.onDown.add(function () {
                console.log("Enter pressed on Title screen!");
                this.playButtonActions.onClick.call(this);
            }, this);

            // captures m key
            this.mKey = this.input.keyboard.addKey(Phaser.Keyboard.M);
            this.input.keyboard.addKeyCapture([Phaser.Keyboard.M]);

            // mutes when m is pressed + debug (open in browser, press f12)
            this.mKey.onDown.add(function () {
                console.log("M key pressed — toggling mute");
                AudioManager.toggleMusic(this);
            }, this);

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

            // Audio
            AudioManager.playSong("title_music", this);

            this.slashKey = this.input.keyboard.addKey(191);
            this.switching = false;
            console.log("StartState loaded — press / to go back to TitleState");

            // screen reader
            const introMessage = "Controls: Click the start button or use the space bar!" +
                "Click the pause button or use the P key to pause!" +
                "Press the mute button or use the M key to mute!" +
                "Click to interact or use WASD and the space bar to select!";
            // announceToScreenReader(introMessage);
            // speak(introMessage);

            // DOM Element Setup
            this.game.canvas.setAttribute('role', 'img');
            this.game.canvas.setAttribute('tabindex', '1');

            var domOverlays = A11yKit.buildDomOverlaysFromWorld(this.game, { startTabIndex: 100 });
            this.domElements = domOverlays.domElements;
            self = this;

            this.a11y = A11yKit.init({
                parent: this.game.canvas.parentNode,
                elements: this.domElements,
                escapeKey: 'Escape',
                live: 'polite',
                onEnable: function(){ self.a11y.announce('Game focused.'); },
                onDisable: function(){ self.a11y.announce('Game focus released'); }
            });


            this.game.canvas.addEventListener('focus', function(){ self.a11y.trap.enable(); }, true);
            this.game.canvas.addEventListener('click', function(){ self.a11y.trap.enable(); }, true);
            self.a11y.trap.enable();

            this.a11y.announce(introMessage);
        },
        shutdown: function () {
            console.log("shutting down Title.js...");

            if (this.a11y) { this.a11y.destroy(); this.a11y = null; }
            if (this.domElements) { A11yKit.destroyDomOverlays(this.domElements); this.domElements = null };
        },
        update: function () {
            updateCloudSprites(this);
            if (this.slashKey && !this.switching && this.slashKey.justDown) {
                console.log("/ pressed in StartState");
                this.switching = true;

                if (window.speechSynthesis) window.speechSynthesis.cancel();
                if (AudioManager && AudioManager.stopAll) AudioManager.stopAll();

                if (lastState) {
                    this.state.start(lastState);
                } else {
                    this.state.start("TitleState"); // fallback
                }

                this.time.events.add(Phaser.Timer.SECOND * 0.25, function () {
                    this.switching = false;
                }, this);
            }
        },
        playButtonActions: {
            onClick: function () {
                AudioManager.playSound("bloop_sfx", this);
                this.state.start("TitleState");
            },
        },
};
