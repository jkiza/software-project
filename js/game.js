// initialize variables
var game;
var gameWidth = 600;
var gameHeight = 1024;
var s;
var ding;
var music;
var audio;
var score = 10000;
var scoreText;

// create a scene for loading assets
let load = new Phaser.Scene('Load');

// preload function of the 'Load' scene
load.preload = function () {

    // create a progress box and progress bar for loading
    var progressBar = this.add.graphics();
    var progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(138, 560, 320, 50);

    var width = this.cameras.main.width;
    var height = this.cameras.main.height;

    // create 'Loading' text above the progress bar
    var loadingText = this.make.text({
        x: width / 2,
        y: 530,
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
        y: 585,
        text: '0%',
        style: {
            font: '18px monospace',
            fill: '#ffffff'
        }
    });

    percentText.setOrigin(0.5, 0.5);

    // create a caption with the tilte of the game on top of the screen
    var title = this.make.text({
        x: width / 2,
        y: height / 2 - 270,
        text: 'WINTER ESCAPE',
        style: {
            font: '44px monospace',
            fill: '#ffffff'
        }
    });

    title.setOrigin(0.5, 0.5);

    // function listening for progress 'draws' the progress bar while the assets are loading
    this.load.on('progress', function (value) {
        console.log(value);
        percentText.setText(parseInt(value * 100) + '%');
        progressBar.clear();
        progressBar.fillStyle(0xffffff, 1);
        progressBar.fillRect(148, 570, 300 * value, 30);

    });

    // when assets loaded, destroy the progress bar and caption
    this.load.on('complete', function () {
        console.log('complete');
        progressBar.destroy();
        progressBox.destroy();
        loadingText.destroy();
        percentText.destroy();

    });

    this.load.on('fileprogress', function (file) {
        console.log(file.src);
    });

    // load assets
    this.load.image('menu', './assets/menu.gif');
    this.load.image('play', './assets/play.gif');
    this.load.image('options', './assets/options.gif');
    this.load.image('mute', './assets/mute.gif');
    this.load.image('help', './assets/help.gif');
    this.load.image('background', './assets/background.gif');
    this.load.spritesheet('player', './assets/sheet.png', {
        frameWidth: 77.8,
        frameHeight: 73
    });
    this.load.image('bell', './assets/bell.png');
    this.load.audio('win', './assets/zapsplat_multimedia_game_tone_retro_positive_complete_bright_007_25930.mp3');
    this.load.audio('winter', './assets/nicolai-heidlas-winter-sunshine.mp3');

}

// update function of the 'Load' scene
load.update = function () {

    // start the 'Menu' scene
    this.scene.start('Menu');

}

// create 'Menu' scene
class Menu extends Phaser.Scene {

    // construct the scene
    constructor() {

        super('Menu');

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
            y: height / 2 - 270,
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

        // add the music file
        music = this.sound.add('winter');

        // play music
        music.play();

        // create an interactive 'Play' button
        let button1 = this.add.sprite(170, 390, 'play');
        button1.setOrigin(0, 0);
        button1.setInteractive();
        // when clicked, stop the music and load the 'Game' scene
        button1.on('pointerdown', () => music.stop());
        button1.on('pointerdown', () => this.scene.start('Game'));

        // create an interactive 'Options' button
        let button2 = this.add.sprite(170, 530, 'options');
        button2.setOrigin(0, 0);
        button2.setInteractive();
        // when clicked, load the 'Options' scene
        button2.on('pointerdown', () => this.scene.start('Options'));

        // create an interactive 'Help' button
        let button3 = this.add.sprite(170, 670, 'help');
        button3.setOrigin(0, 0);
        button3.setInteractive();
        // when clicked, load the 'Help' scene
        button3.on('pointerdown', () => this.scene.start('Help'));

    }

}

// create a new game scene
let gameScene = new Phaser.Scene('Game');

// create function of the 'Game' scene
gameScene.create = function () {

    // create the background
    this.bg = this.add.tileSprite(300, 512, 600, 1024, 'background');

    // create and scale the player and make it collide with world bounds
    this.player = this.physics.add.sprite(290, 920, 'player');
    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);

    this.anims.create({
        key: 'lefts',
        frames: this.anims.generateFrameNumbers('player', {
            start: 3,
            end: 4
        }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'rights',
        frames: this.anims.generateFrameNumbers('player', {
            start: 11,
            end: 12
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

    // make player stay in destined position at the beginning of the game
    this.player.body.allowGravity = false;

    // create each bell2829
    let randomV = Phaser.Math.Between(-100, -300);
    this.bells.create(Phaser.Math.Between(275, 325), 250);
    this.bells.create(Phaser.Math.Between(75, 125), 50);
    this.bells.create(Phaser.Math.Between(475, 525), -150);
    this.bells.create(Phaser.Math.Between(75, 125), -350);
    this.bells.create(Phaser.Math.Between(275, 325), -540);
    this.bells.create(Phaser.Math.Between(475, 525), -730);
    this.bells.create(Phaser.Math.Between(75, 125), -950);
    this.bells.create(Phaser.Math.Between(275, 325), -1150);
    this.bells.create(Phaser.Math.Between(475, 525), -1370);
    this.bells.create(Phaser.Math.Between(275, 325), -1560);
    this.bells.create(Phaser.Math.Between(475, 525), -1750);
    this.bells.create(Phaser.Math.Between(275, 325), -1950);
    this.bells.create(Phaser.Math.Between(75, 125), -2200);
    this.bells.create(Phaser.Math.Between(475, 525), -2400);
    this.bells.create(Phaser.Math.Between(75, 125), -2600);

    this.bells.children.iterate(function (child) {
        // disable gravity on bells
        child.body.allowGravity = false;

    });

    // add score in the top left corner
    scoreText = this.add.text(25, 20, 'Score: 10000', {
        font: '32px monospace',
        fill: '#ffffff'
    });

    // add label for the 'Pause' button in the top right corner
    var pause = this.add.text(448, 20, 'Pause', {
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

    // when 'Pause' clicked, stop the music, pause the 'Game' scene and start 'Pause' scene
    pause.setInteractive();
    pause.on('pointerdown', () => music.stop());
    pause.on('pointerdown', () => this.scene.pause());
    pause.on('pointerdown', () => this.scene.start('Pause'));

    // add the music file
    music = this.sound.add('winter');

    // play music
    music.play();

    // add overlap with bells for the player
    this.physics.add.overlap(this.player, this.bells, this.jumpBell, null, this);

};

// update function of the 'Game' scene
gameScene.update = function () {

    // make background scroll endlessly
    this.bg.tilePositionY -= 3;

    // make the player follow our finger in certain speed
    if (this.input.activePointer.x > this.player.x) {

        this.player.anims.play('rights', true);
        this.player.x += 5.5;

    } else if (this.input.activePointer.x < this.player.x) {
        
        this.player.anims.play('lefts', true);
        this.player.x -= 5.5;
        
    }

    // returns an array of all the children
    let bells = this.bells.getChildren();

    // variable for the number of the bells
    let numBells = bells.length;

    // set the speed for bells
    let bellSpeed = 4;

    // make the bells repeat
    for (let i = 0; i < numBells; i++) {
        let bellY = bells[i].y;
        if (bellY > 3000) {
            bells[i].y = -30;
            bells[i].enableBody(false, 1, 1, true, true);
        }
        bells[i].y += bellSpeed;
    }

    // disable gravity on bells
    //this.bells.allowGravity = false;

    // if the player falls down, stop the music and load 'Game Over' scene
    if (this.player.y > 950) {
        music.stop();
        this.scene.start('Game Over');

    }

    // if the player makes it to the top, stop the music and load 'Win' scene
    if (this.player.y < 50) {
        music.stop();
        this.scene.start('Win');

    }

};

// function for jumping on the bells
gameScene.jumpBell = function (player, bell) {
    //player, bell

    // make the player follow our finger and jump
    gameScene.physics.moveTo(this.player, this.input.activePointer.downX, this.player.y - 1000, 400);

    // disable gravity on the player
    this.player.body.allowGravity = true;

    // decrease the score by 10 on every jump
    score -= 10;

    // display the score
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
    let button1 = this.add.sprite(170, 540, 'menu');
    button1.setOrigin(0, 0);
    button1.setInteractive();
    button1.on('pointerdown', () => music.stop());
    button1.on('pointerdown', () => this.scene.start('Menu'));

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
        y: height / 2 - 270,
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
        y: height / 2 - 70,
        text: 'Welcome to my game! In order to play, drag your finger across the screen and the bunny fill follow. To win, try to get to the top of the screen. The less time you spend on bells and the quicker you get there, the more points you will have. Be careful, if you fall down, you will lose!',
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
    let button2 = this.add.sprite(170, 640, 'menu');
    button2.setOrigin(0, 0);
    button2.setInteractive();
    //when clicked, stop playing the music and go back to main menu
    button2.on('pointerdown', () => music.stop());
    button2.on('pointerdown', () => this.scene.start('Menu'));

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
    //audio2 = this.sound.add('lose');

    // play
    //audio2.play();

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

    // screate a winning caption
    var winning = this.make.text({
        x: width / 2,
        y: height / 2 - 220,
        text: 'WELL DONE!',
        style: {
            font: '44px monospace',
            fill: '#ffffff'
        }
    });

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
    audio = this.sound.add('win');

    // play
    audio.play();

    // create an interactive button
    let button1 = this.add.sprite(170, 530, 'play');
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
                    y: 860
                },
                debug: false
            }
        },
        // determine all the scenes
        scene: [load, Menu, options, help, gameScene, win, gameOver, pause]
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
