class Level{
    constructor(scene, type, tilemap, tilesetName, loadedImage, playerX, playerY){
        ////Create player + objects
        // adjust player position every creation
        this.plrSpy = new PlayerSpy(scene,playerX,playerY, 'playerMain', 0, 'playerDisguise');
        
        this.defineKeys(scene);
        // Scene?
        this.graphics = scene.add.graphics({ lineStyle: { width: 1, color: 0x00ff00}, fillStyle: { color: 0xffffff, alpha: 0.3 } });



        //Adding tilemap
        const mapProto = scene.make.tilemap({key: tilemap});
        const tilesCity = mapProto.addTilesetImage(tilesetName, loadedImage);
        // 1st arg, the tileset name, needs to match the tileset name in the Tiled file (check the program)

        //Creates layers matching the layers we made in Tiled software
        this.solidLayer = mapProto.createLayer('Solid', tilesCity, -16, -16);
        this.platformLayer = mapProto.createLayer('Platform', tilesCity, -16, -16);
        //Caredful that all of the keys and stuff match what was defined in the Tiled file.
        
        //Makes all tiles that have property "collides" have collision
        this.solidLayer.setCollisionByProperty( {collides: true} );
        this.platformLayer.setCollisionByProperty( {collides: true} );
        //Makes all the platform tiles only have 1-way collision
        this.platformLayer.forEachTile(tile => {
            if(tile.index == 16){
                tile.collideLeft = false;
                tile.collideRight = false;
                tile.collideDown = false;
            }
            if(tile.index == 7){
                tile.collideRight = true;
                tile.collideLeft = false;
                tile.collideDown = true;
                tile.collideUp = true;
            }
        })
        // disguise stuff 
        //moving text 
        let dressedTextConfig = {
            fontSize: '9px',
            align: 'center',
            stroke: '#000000',
            strokeThickness: 4
        }
        
        this.dressedText = scene.add.text(game.config.width/2 + 600, game.config.height/2, 'Getting dressed...', dressedTextConfig).setOrigin(0.5);
        scene.disguiseTimer = scene.add.text(game.config.width/2 + 600, game.config.height/2, '0', dressedTextConfig).setOrigin(0.5);
        scene.disguiseTimer.alpha = 0;
        //Source ref: https://phaser.io/examples/v3/view/display/tint/tween-tint
        this.disguiseTween = scene.tweens.addCounter({
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
    update(scene, time, delta) {
        if(!this.gameOver){
            this.plrSpy.update(time, delta); 
        }
        if(this.gameOver &&this.check == 1){
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
    //returning vars
    getSolidLayer(){
        return this.solidLayer;
    }
    getPlatformLayer(){
        return this.platformLayer;
    }


    //functions
    defineKeys(scene){
        keyJump = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
        keyLeft = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRight = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        keyJump = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
        keyDisguise = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X);
        keyDown = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        keyInteract = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
    }
}