class Play extends Phaser.Scene {
    /*A class extension does not contain a copy of the base class right? It should simply contain all of the
    same methods and values.*/

    constructor() {
        super('playScene');
    }

    preload(){
        // load tileset and tilemap
        /* NOTE: We may want to move this to a master 'load' scene, so we don't have to load the tileset
        every time we want to create a level. - Santiago */
        this.load.path = 'assets/';
        this.load.image('tilesCityPH', 'PH_city_tiles_small.png');
        this.load.tilemapTiledJSON('lvlDigitalProto', 'levels/level_digital_prototype.json');
        
        this.load.image('objButton', 'PH_obj_button.png');
        this.load.image('playerDisguise', 'TempDisguise.png');
        this.load.image('playerMain', 'TempPlayer.png');
    }

    
    create() {
        this.defineKeys();
        //creates level
        this.level = new Level(this,'lvlDigitalProto', 'PH_city_tiles', 'tilesCityPH' );
        this.graphics = this.add.graphics({ lineStyle: { width: 1, color: 0x00ff00}, fillStyle: { color: 0xffffff, alpha: 0.3 } });
        //create LOS for this Level
        this.levelLOS = new LOS(this, this.level.getSolidLayer());

        //Create player + objects
        this.plrSpy = new PlayerSpy(this, game.config.width/2-250, game.config.height/2+110, 'playerMain',
         0, 'playerDisguise');
        this.createButtons();
        
        //Alternatively, maybe we'd want a 2nd camera that shows the entire level, as the 'zoomed out' camera?
        this.cameras.main.zoom = 2;
        this.cameras.main.setBounds(0, 0, this.level.tilemap.widthInPixels, this.level.tilemap.heightInPixels);
        this.cameras.main.startFollow(this.plrSpy);
    
        //moving text 
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

        this.addColliders();
    }
    
    update(time, delta ) {
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

    defineKeys(){
        keyJump = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
        keyLeft = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRight = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        keyJump = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
        keyDisguise = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X);
        keyDown = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        keyInteract = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
    }

    createButtons(){
        //Create buttons
        this.groupButtonObjs = this.add.group([new ObjInteract(this, 272, 32, 'objButton'),
        new ObjInteract(this, 16, 208, 'objButton'), new ObjInteract(this, 528, 208, 'objButton'),
        new ObjInteract(this, 272, 432, 'objButton')]);
        this.groupButtonObjs.runChildUpdate = true;
        //Create objective tracker
        this.buttonTracker = new Checklist(this, "buttonTracker", this.groupButtonObjs.countActive());

        //Add event for each button when they are pressed, listening for the signal 'objactivated'
        let buttons = this.groupButtonObjs.getChildren(); //More like a dict than an array...
        for(let i = 0; i < buttons.length; i++){
        let button = buttons[i];
        button.on('objactivated', () => {
            this.buttonTracker.addObjective();
        });
        }
        /*With ability to establish events and listeners, we could theoretically add a locked door 
        (which I'll add later) - Santiago*/
    }
    addColliders(){
        //colliders
        this.physics.add.collider(this.plrSpy, this.level.getSolidLayer());
        this.platformCollision = this.physics.add.collider(this.plrSpy, this.level.getPlatformLayer());
        //if player is caught in light 
        this.physics.add.overlap(this.levelLOS.ray2, this.plrSpy, function(rayFoVCircle, target){
            if(!target.disguiseActive){
                //console.log("detected by 2");
                target.detectedFunc();
            }
        }, this.levelLOS.ray2.processOverlap.bind(this.levelLOS.ray2));
        //if player is caught in light 
        this.physics.add.overlap(this.levelLOS.ray, this.plrSpy, function(rayFoVCircle, target){
            if(!target.disguiseActive){
                //console.log("detected by 2");
                target.detectedFunc();
            }
        }, this.levelLOS.ray.processOverlap.bind(this.levelLOS.ray));
    }

}