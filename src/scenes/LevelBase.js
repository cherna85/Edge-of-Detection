class LevelBase extends Phaser.Scene {
    constructor(levelName = 'levelBase') {
        super(levelName);
    }

    preloadDefault(tilemapPath, tilesetPath){
        this.load.path = 'assets/';
        this.load.tilemapTiledJSON('lvlDigitalProto', 'levels/' + tilemapPath);
        this.load.image('tilesCityPH', tilesetPath);

        this.load.image('objButton', 'PH_obj_button.png');
        this.load.image('playerDisguise', 'TempDisguise.png');
        this.load.image('playerMain', 'TempPlayer.png');
    }

    createDefault(){
        this.defineKeys();

        this.tilemap = this.make.tilemap({key: 'lvlDigitalProto'});
        this.tileset = this.tilemap.addTilesetImage('PH_city_tiles', 'tilesCityPH');
        this.solidLayer = this.tilemap.createLayer('Solid', this.tileset);
        this.platformLayer = this.tilemap.createLayer('Platform', this.tileset);

        this.plrSpy = new PlayerSpy(this, game.config.width/2-250, game.config.height/2+110, 'playerMain',
         0, 'playerDisguise');

        
        //UI
        let dressedTextConfig = {
            fontSize: '9px',
            align: 'center',
            stroke: '#000000',
            strokeThickness: 4
        }
        this.dressedText = this.add.text(game.config.width/2 + 600, game.config.height/2, 'Getting dressed...', dressedTextConfig).setOrigin(0.5);
        this.disguiseTimer = this.add.text(game.config.width/2 + 600, game.config.height/2, '0', dressedTextConfig).setOrigin(0.5);
        this.disguiseTimer.alpha = 0;
        //Source ref: https://phaser.io/examples/v3/view/display/tint/tween-tint
        this.disguiseTween = this.tweens.addCounter({
            from: 255,
            to: 0,
            duration: this.plrSpy.disguiseDuration,
            onUpdate: function (tween)
            {
                const value = Math.floor(tween.getValue());
                this.parent.scene.disguiseTimer.setTint(Phaser.Display.Color.GetColor(255, value, value));
            }
        });
        

        this.gameOver = false;
        this.check = 0; // makes sure end screen doesnt apply more than once;
    }

    create(){
        //Create method gets overwritten when called in Level1
        console.log("Create method from levelBase");
    }

    /*Calls update on PlayerSpy, the UI, and runs the gameOver function*/
    updateDefault(time, delta){
        if(!this.gameOver){
            this.plrSpy.update(time, delta); 
        }
        if(this.gameOver && this.check == 1){
            this.plrSpy.gameOverFunc();
            this.sound.play('sfx_discovered');
        }
        //allows text to follow player while getting dressed 
        if(this.plrSpy.gettingDressed || this.plrSpy.tempUI){
            this.dressedText.x = this.plrSpy.x + 8;
            this.dressedText.y = this.plrSpy.y - 50;
            this.disguiseTimer.x = this.plrSpy.x + 8;
            this.disguiseTimer.y = this.plrSpy.y - 30;
        }
        //game over selection 
        if(this.gameOver){
            if (Phaser.Input.Keyboard.JustDown(keyDown)) {
                if(sceneSelect == 'playScene'){
                    this.restartbutton.setColor('#FFFFFF');
                    this.MainMenubutton.setColor('#FF994F');
                    sceneSelect = 'menuScene';
                }
                else if(sceneSelect == 'menuScene'){
                    this.MainMenubutton.setColor('#FFFFFF');
                    this.restartbutton.setColor('#FF994F');
                    sceneSelect = 'playScene';
                }  
              }
            if (Phaser.Input.Keyboard.JustDown(keyInteract)) {
                if(sceneSelect == 'playScene'){
                    this.restartbutton.setColor('#FFFFFF');
                    this.MainMenubutton.setColor('#FF994F');
                    sceneSelect = 'menuScene';
                }
                else if(sceneSelect == 'menuScene'){
                    this.MainMenubutton.setColor('#FFFFFF');
                    this.restartbutton.setColor('#FF994F');
                    sceneSelect = 'playScene';
                }  
            }  
            //BUG: Despite calling JustDown, this can trigger if the button is held down
            if (Phaser.Input.Keyboard.JustDown(keyJump)) {
                //console.log('selecting');
                this.scene.start(sceneSelect);    
            }  
        }
    }

    defineKeys(){
        keyJump = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
        keyLeft = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRight = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        keyJump = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
        keyDisguise = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X);
        keyDown = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        keyInteract = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
    }
}