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

            // Audio
            AudioManager.playSong("title_music", this);

            // screen reader
            const introMessage = "Controls: Click the start button or use the space bar!" +
                "Click the pause button or use the P key to pause!" +
                "Press the mute button or use the M key to mute!" +
                "Click to interact or use WASD and the space bar to select!";
            announceToScreenReader(introMessage);
            speak(introMessage);
        },
        update: function () {
            updateCloudSprites(this);
        },
        playButtonActions: {
            onClick: function () {
                AudioManager.playSound("bloop_sfx", this);
                this.state.start("TitleState");
            },
        },
};