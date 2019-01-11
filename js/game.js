// initialize variables
var game, music, score, scoreText, highScore;
var gameWidth = 600;
var gameHeight = 1024;

// create a scene for loading assets
let load = new Phaser.Scene('Load');

// preload function of the 'Load' scene
load.preload = function () {

    // create a progress box and progress bar for loading
    var progressBar = this.add.graphics();
    var progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(138, 530, 320, 50);

    var width = this.cameras.main.width;
    var height = this.cameras.main.height;

    // create 'Loading' text above the progress bar
    var loadingText = this.make.text({
        x: width / 2,
        y: 500,
        text: 'Loading',
        style: {
            font: '20px monospace',
            fill: '#ffffff'
        }
    });

    loadingText.setOrigin(0.5, 0.5);

    // create a text showing loading progress in percents
    var percentText = this.make.text({
        x: width / 2,
        y: 555,
        text: '0%',
        style: {
            font: '18px monospace',
            fill: '#ffffff'
        }
    });

    percentText.setOrigin(0.5, 0.5);

    // function listening for progress 'draws' the progress bar while the assets are loading
    this.load.on('progress', function (value) {
        console.log(value);
        percentText.setText(parseInt(value * 100) + '%');
        progressBar.clear();
        progressBar.fillStyle(0xffffff, 1);
        progressBar.fillRect(148, 540, 300 * value, 30);
    });

    // when assets are loaded, destroy the progress bar and caption
    this.load.on('complete', function () {
        console.log('complete');
        progressBar.destroy();
        progressBox.destroy();
        loadingText.destroy();
        percentText.destroy();
    });

    // check file progress in the console
    this.load.on('fileprogress', function (file) {
        console.log(file.src);
    });

    // load assets
    // buttons
    this.load.image('menu', './assets/menu.gif');
    this.load.image('play', './assets/play.gif');
    this.load.image('options', './assets/options.gif');
    this.load.image('mute', './assets/mute.gif');
    this.load.image('help', './assets/help.gif');
    this.load.image('high', './assets/high.gif');
    // background
    this.load.image('background', './assets/background.gif');
    // game character spritesheet
    this.load.spritesheet('player', './assets/sheet.png', {
        frameWidth: 77.8,
        frameHeight: 73
    });
    // bell
    this.load.image('bell', './assets/bell.png');
    // music and sounds
    this.load.audio('win', './assets/zapsplat_multimedia_game_tone_retro_positive_complete_bright_007_25930.mp3');
    this.load.audio('winter', './assets/nicolai-heidlas-winter-sunshine.mp3');
    this.load.audio('lose', './assets/350986__cabled-mess__lose-c-01.wav')
}

// update function of the 'Load' scene
load.update = function () {

    // start the 'Menu' scene
    this.scene.start('Menu');
}

// create the 'Menu' scene
class Menu extends Phaser.Scene {

    // constructor of the 'Menu' scene
    constructor() {

        super('Menu');

        // make this an active scene
        this.active;
        this.currentScene;
    }

    // preload function of the 'Menu' scene
    preload() {

        var width = this.cameras.main.width;
        var height = this.cameras.main.height;

        // create a caption with the tilte of the game on top of the screen
        var title = this.make.text({
            x: width / 2,
            y: height / 2 - 310,
            text: 'WINTER ESCAPE',
            style: {
                font: '44px monospace',
                fill: '#ffffff'
            }
        });

        title.setOrigin(0.5, 0.5);
    }

    // create function of the 'Menu' scene
    create() {

        // hold music file in a variable
        music = this.sound.add('winter');

        // play music
        music.play();

        // create an interactive 'Play' button
        let button1 = this.add.sprite(170, 340, 'play');
        button1.setOrigin(0, 0);
        button1.setInteractive();
        // when clicked, stop the music and load the 'Game' scene
        button1.on('pointerdown', () => music.stop());
        button1.on('pointerdown', () => this.scene.start('Game'));

        // create an interactive 'Highscore' button
        let button2 = this.add.sprite(170, 480, 'high');
        button2.setOrigin(0, 0);
        button2.setInteractive();
        // when clicked, load the 'Highscore' scene
        button2.on('pointerdown', () => this.scene.start('High'));

        // create an interactive 'Options' button
        let button3 = this.add.sprite(170, 620, 'options');
        button3.setOrigin(0, 0);
        button3.setInteractive();
        // when clicked, load the 'Options' scene
        button3.on('pointerdown', () => this.scene.start('Options'));

        // create an interactive 'Help' button
        let button4 = this.add.sprite(170, 760, 'help');
        button4.setOrigin(0, 0);
        button4.setInteractive();
        // when clicked, load the 'Help' scene
        button4.on('pointerdown', () => this.scene.start('Help'));
    }
}

// create scene for the gameplay
let gameScene = new Phaser.Scene('Game');

// create function of the 'Game' scene
gameScene.create = function () {

    // create background
    this.bg = this.add.tileSprite(300, 512, 600, 1024, 'background');

    // create the player and make it collide with world bounds
    this.player = this.physics.add.sprite(290, 920, 'player');
    this.player.setOrigin(0.5, 0.5);
    this.player.setCollideWorldBounds(true);
    
    // create an animation for the player (stand still)
    this.anims.create({
        key: 'stand',
        frames: this.anims.generateFrameNumbers('player', {
            start: 0,
            end: 0
        }),
        frameRate: 10,
        repeat: -1
    });

    // create an animation for the player (left turn)
    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('player', {
            start: 3,
            end: 5
        }),
        frameRate: 10,
        repeat: -1
    });

    // create an animation for the player (right turn)
    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('player', {
            start: 12,
            end: 14
        }),
        frameRate: 10,
        repeat: -1
    });

    // create bells falling from the sky, not colliding with the world bounds
    this.bells = this.physics.add.group({
        defaultKey: 'bell',
        bounceX: 0,
        bounceY: 0,
        collideWorldBounds: false,
    });

    // disable gravity on player at the beginning of the game
    this.player.body.allowGravity = false;

    // create each bell with somewhat random spawn locations
    // generate random numbers
    let random1 = Phaser.Math.Between(75, 125);
    let random2 = Phaser.Math.Between(275, 325);
    let random3 = Phaser.Math.Between(475, 525);
    this.bells.create(random2, 230);
    this.bells.create(random1, 50);
    this.bells.create(random3, -150);
    this.bells.create(random1, -350);
    this.bells.create(random2, -540);
    this.bells.create(random3, -730);
    this.bells.create(random1, -950);
    this.bells.create(random2, -1150);
    this.bells.create(random3, -1370);
    this.bells.create(random2, -1560);
    this.bells.create(random3, -1750);
    this.bells.create(random2, -1950);
    this.bells.create(random1, -2200);
    this.bells.create(random3, -2400);
    this.bells.create(random1, -2600);

    // disable gravity on bells
    this.bells.children.iterate(function (child) {

        child.body.allowGravity = false;
    });

    // add score in the top left corner
    scoreText = this.add.text(25, 20, 'Score: 10000', {
        font: '32px monospace',
        fill: '#ffffff'
    });

    // add label for the 'Pause' button in the top right corner
    var pause = this.add.text(449, 20, 'Pause', {
        font: '40px monospace',
        fill: '#ffffff'
    });

    // add label for the 'Mute' button in the top right corner
    var mute = this.add.text(475, 960, 'Mute', {
        font: '40px monospace',
        fill: '#ffffff'
    });

    // when 'Mute' clicked, stop the music
    mute.setInteractive();
    mute.on('pointerdown', () => music.stop());

    // when 'Pause' clicked, stop the music, pause the 'Game' scene and start the 'Pause' scene
    pause.setInteractive();
    pause.on('pointerdown', () => music.stop());
    pause.on('pointerdown', () => this.scene.pause());
    pause.on('pointerdown', () => this.scene.start('Pause'));

    // hold music file in a variable
    music = this.sound.add('winter');

    // play music
    music.play();

    // add overlap with bells for the player
    this.physics.add.overlap(this.player, this.bells, this.jumpBell, null, this);

    // initialize score to 10000 at the beginning of the game
    score = 10000;
};

// update function of the 'Game' scene
gameScene.update = function () {
    
    // animation for player when standing still
    this.player.anims.play('stand', true);

    // make background scroll endlessly
    this.bg.tilePositionY -= 3;

    // game character movement
    // check if screen is pressed
    if (this.input.activePointer.isDown) {

        // if it is, check if it was pressed on the right of the bunny
        if (this.input.activePointer.x > this.player.x) {

            // animate and move to the right at a certain speed
            this.player.anims.play('right', true);
            this.player.x += 5.5;

            // if it was pressed on the left of the bunny
        } else {

            // animate and move to the left at a certain speed
            this.player.anims.play('left', true);
            this.player.x -= 5.5;
        }
    }

    // return an array of all the children
    let bells = this.bells.getChildren();

    // variable for the number of the bells
    let numBells = bells.length;

    // set the speed for bells
    let bellSpeed = 4;

    // make the bells repeat ang move at a certain speed
    for (let i = 0; i < numBells; i++) {
        let bellY = bells[i].y;
        if (bellY > 3000) {
            bells[i].y = -30;
            bells[i].enableBody(false, 1, 1, true, true);
        }
        bells[i].y += bellSpeed;
    }

    // if the player falls down
    if (this.player.y > 950) {

        // reset the score
        score = 0;

        // stop the music
        music.stop();

        // start the 'Game Over' scene
        this.scene.start('Game Over');
    }

    // if the player makes it to the top
    if (this.player.y < 50) {

        // if it is the first run
        if (highScore === undefined) {

            // set highscore to the score value
            highScore = score;

            // if it is not the first run
        } else {

            // check if the score is higher than the current highscore
            if (score > highScore) {

                // if it is, initialize the highscore variable to the score value
                highScore = score;
            }
        }

        // stop the music
        music.stop();

        // start the 'Win' scene
        this.scene.start('Win');
    }
};

// function for jumping on the bells
gameScene.jumpBell = function (player, bell) {

    // make the player follow our finger and jump
    gameScene.physics.moveTo(this.player, this.input.activePointer.downX, this.player.y - 1000, 400);

    // disable gravity on the player
    this.player.body.allowGravity = true;

    // decrease the score by 100 on every jump
    score -= 100;

    // display the score live
    scoreText.setText('Score: ' + score);

    // make bell disappear
    bell.disableBody(true, true);
}

// create a scene for pausing the game
let pause = new Phaser.Scene('Pause');

// preload function of the 'Pause' scene
pause.preload = function () {

    var width = this.cameras.main.width;
    var height = this.cameras.main.height;

    // create a 'Pause' label
    var pauseText = this.make.text({
        x: width / 2,
        y: height / 2 - 90,
        text: 'PAUSE',
        style: {
            font: '44px monospace',
            fill: '#ffffff'
        }
    });

    pauseText.setOrigin(0.5, 0.5);
}

// create function of the 'Pause' scene
pause.create = function () {

    // create a button for going back to main menu
    let button = this.add.sprite(170, 540, 'menu');
    button.setOrigin(0, 0);
    button.setInteractive();
    button.on('pointerdown', () => music.stop());
    button.on('pointerdown', () => this.scene.start('Menu'));
}

// create a 'Highscore' scene
let high = new Phaser.Scene('High');

// preload function of the High scene
high.preload = function () {

    var width = this.cameras.main.width;
    var height = this.cameras.main.height;

    // create a 'Current highscore' label
    var highText = this.make.text({
        x: width / 2,
        y: height / 2 - 150,
        text: 'CURRENT HIGHSCORE',
        style: {
            font: '44px monospace',
            fill: '#ffffff'
        }
    });

    highText.setOrigin(0.5, 0.5);

    // show current highscore
    var highScoreText = this.make.text({
        x: width / 2,
        y: height / 2 - 20,
        text: highScore,
        style: {
            font: '44px monospace',
            fill: '#ffffff'
        }
    });

    highScoreText.setOrigin(0.5, 0.5);
}

// create function of the 'High' scene
high.create = function () {

    // create an interactive button
    let button = this.add.sprite(170, 620, 'menu');
    button.setOrigin(0, 0);
    button.setInteractive();
    // when clicked, stop playing the music and go back to main menu
    button.on('pointerdown', () => music.stop());
    button.on('pointerdown', () => this.scene.start('Menu'));
}

// create an 'Options' scene
let options = new Phaser.Scene('Options');

// preload function of the 'Options' scene
options.preload = function () {

    var width = this.cameras.main.width;
    var height = this.cameras.main.height;

    // create 'Options' label
    var optionsText = this.make.text({
        x: width / 2,
        y: height / 2 - 200,
        text: 'OPTIONS',
        style: {
            font: '44px monospace',
            fill: '#ffffff'
        }
    });

    optionsText.setOrigin(0.5, 0.5);
}

// create function of the 'Options' scene
options.create = function () {

    // create an interactive button
    let button = this.add.sprite(170, 480, 'mute');
    button.setOrigin(0, 0);
    button.setInteractive();
    // when clicked, stop playing the music
    button.on('pointerdown', () => music.destroy(true));

    // create an interactive button
    let button2 = this.add.sprite(170, 620, 'menu');
    button2.setOrigin(0, 0);
    button2.setInteractive();
    // when clicked, stop playing the music and go back to main menu
    button2.on('pointerdown', () => music.stop());
    button2.on('pointerdown', () => this.scene.start('Menu'));
}

// create a 'Help' scene
let help = new Phaser.Scene('Help');

// preload function of the 'Help' scene
help.preload = function () {

    var width = this.cameras.main.width;
    var height = this.cameras.main.height;

    // create a 'Help' label
    var helpText = this.make.text({
        x: width / 2,
        y: height / 2 - 240,
        text: 'HELP',
        style: {
            font: '44px monospace',
            fill: '#ffffff'
        }
    });

    helpText.setOrigin(0.5, 0.5);

    // create a help text
    var helpText = this.make.text({
        x: width / 2,
        y: height / 2 - 40,
        text: 'Welcome to my game! In order to play, tap and hold the screen on either side of the bunny and it will follow. Try to get to the top of the screen. The quicker you get there, the more points you will have. Be careful, if you fall down, you will lose!',
        style: {
            font: '24px monospace',
            fill: '#ffffff',
            align: 'center',
            wordWrap: {
                width: 450
            }
        }
    });

    helpText.setOrigin(0.5, 0.5);
}

// create function of the 'Help' scene
help.create = function () {

    // create an interactive button
    let button = this.add.sprite(170, 670, 'menu');
    button.setOrigin(0, 0);
    button.setInteractive();
    //when clicked, stop playing the music and go back to main menu
    button.on('pointerdown', () => music.stop());
    button.on('pointerdown', () => this.scene.start('Menu'));
}

// create a scene for when losing the game
let gameOver = new Phaser.Scene('Game Over');

// preload function of the 'Game Over' scene
gameOver.preload = function () {

    var width = this.cameras.main.width;
    var height = this.cameras.main.height;

    // create a losing caption
    var losing = this.make.text({
        x: width / 2,
        y: height / 2 - 200,
        text: 'YOU LOST',
        style: {
            font: '40px monospace',
            fill: '#ffffff'
        }
    });

    losing.setOrigin(0.5, 0.5);

    // create a second caption
    var losing2 = this.make.text({
        x: width / 2,
        y: height / 2 - 150,
        text: 'TRY AGAIN?',
        style: {
            font: '40px monospace',
            fill: '#ffffff'
        }
    });

    losing2.setOrigin(0.5, 0.5);
}

// create function of the 'Game Over' scene
gameOver.create = function () {

    // add a losing audio
    var audio2 = this.sound.add('lose');

    // play
    audio2.play();

    // create an interactive button
    let button1 = this.add.sprite(170, 500, 'play');
    button1.setOrigin(0, 0);
    button1.setInteractive();
    // when clicked, play the game again
    button1.on('pointerdown', () => this.scene.start('Game'));

    // create an interactive button
    let button2 = this.add.sprite(170, 640, 'menu');
    button2.setOrigin(0, 0);
    button2.setInteractive();
    // when clicked, go back to main menu
    button2.on('pointerdown', () => this.scene.start('Menu'));
}

// create a scene for winning
let win = new Phaser.Scene('Win');

// preload function of the 'Win' scene
win.preload = function () {

    var width = this.cameras.main.width;
    var height = this.cameras.main.height;

    // check if player beat the highscore
    if (score === highScore) {

        // if yes, create a caption informing about a new highscore
        var winning = this.make.text({
            x: width / 2,
            y: height / 2 - 220,
            text: 'NEW HIGHSCORE!',
            style: {
                font: '44px monospace',
                fill: '#ffffff'
            }
        });

        // if there is no new highscore
    } else {

        // create a 'Well done' caption
        var winning = this.make.text({
            x: width / 2,
            y: height / 2 - 220,
            text: 'WELL DONE',
            style: {
                font: '44px monospace',
                fill: '#ffffff'
            }
        });
    }

    winning.setOrigin(0.5, 0.5);

    // display score
    var winning1 = this.make.text({
        x: width / 2,
        y: height / 2 - 170,
        text: 'SCORE: ' + score,
        style: {
            font: '44px monospace',
            fill: '#ffffff'
        }
    });

    winning1.setOrigin(0.5, 0.5);

    // create a second caption
    var winning2 = this.make.text({
        x: width / 2,
        y: height / 2 - 120,
        text: 'PLAY AGAIN?',
        style: {
            font: '44px monospace',
            fill: '#ffffff'
        }
    });

    winning2.setOrigin(0.5, 0.5);
}

// create function of the 'Win' scene
win.create = function () {

    // add winning audio
    var audio = this.sound.add('win');

    // play
    audio.play();

    // create an interactive button
    let button1 = this.add.sprite(170, 530, 'play');
    button1.setOrigin(0, 0);
    button1.setInteractive();
    // when clicked, play the game again
    button1.on('pointerdown', () => this.scene.start('Game'));

    // create an interactive button
    let button2 = this.add.sprite(170, 670, 'menu');
    button2.setOrigin(0, 0);
    button2.setInteractive();
    // when clicked, go back to main menu
    button2.on('pointerdown', () => this.scene.start('Menu'));
}

// set the configuration of the game
window.onload = function () {
    let config = {
        type: Phaser.CANVAS,
        // width and height of the game screen
        width: gameWidth,
        height: gameHeight,
        scene: gameScene,
        // physics library
        physics: {
            default: 'arcade',
            arcade: {
                // set gravity
                gravity: {
                    y: 820
                },
                debug: false
            }
        },
        // determine all the scenes
        scene: [load, Menu, options, high, help, gameScene, win, gameOver, pause]
    };

    // create the game using the configuration
    game = new Phaser.Game(config);

    // go full screen
    resize();
    window.addEventListener("resize", resize, false);
};

// function for going full screen
function resize() {
    var canvas = document.querySelector("canvas");
    var windowWidth = window.innerWidth;
    var windowHeight = window.innerHeight;
    var windowRatio = windowWidth / windowHeight;
    var gameRatio = game.config.width / game.config.height;
    if (windowRatio < gameRatio) {
        canvas.style.width = windowWidth + "px";
        canvas.style.height = (windowWidth / gameRatio) + "px";
    } else {
        canvas.style.width = (windowHeight * gameRatio) + "px";
        canvas.style.height = windowHeight + "px";
    }
}
