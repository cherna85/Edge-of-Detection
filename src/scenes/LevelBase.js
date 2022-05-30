class LevelBase extends Phaser.Scene {
    constructor(levelName = 'levelBase') {
        super(levelName);
    }

    /*Loads all default assets
    Tilemap and tileset must be passed in*/
    preloadDefault(tilemapPath, tilesetPath, tilemapName, tilesetName = 'tilesCityPH', tilesSheetName = 'tilesSheet'){
        this.tilemapName = tilemapName;
        this.tilesetName = tilesetName;
        this.tilesSheetName = tilesSheetName;
        //If all level tilemaps use the same name, it can cause problems when trying to
        //load new tileset data if there is old data present. - Santiago

        this.load.path = 'assets/';
        this.load.tilemapTiledJSON(tilemapName, 'levels/' + tilemapPath);
        this.load.image(tilesetName, tilesetPath);
        this.load.spritesheet(tilesSheetName, tilesetPath, {
            frameWidth: 16,
            frameHeight: 16
        });

        this.load.image('objButton', 'PH_obj_button.png');
        this.load.image('playerDisguise', 'TempDisguise.png');
        this.load.image('playerMain', 'TempPlayer.png');
        
    }

    /*
    Default stuff created:
        PlayerSpy and the text that follows them (The UI)
        The tilemap, its layers, and their collision with the player
        The gameOver check
    */
    createDefault(tilesetImgName){

        this.defineKeys();
        loadlevel = this.scene.key;
        
        /*Creates tilemap and default layers*/
        this.tilemap = this.make.tilemap({key: this.tilemapName});
        this.tileset = this.tilemap.addTilesetImage(tilesetImgName, this.tilesetName);
        //THE TILESET NAME MUST MATCH ITS NAME IN THE JSON FILE!!!!!
        this.solidLayer = this.tilemap.createLayer('Solid', this.tileset);
        this.platformLayer = this.tilemap.createLayer('Platform', this.tileset);

        this.plrSpy = new PlayerSpy(this, game.config.width/2-250, game.config.height/2+110, 'playerMain',
         0, 'playerDisguise');

        this.plrSpy.setDepth(-1);

        /*Sets up collision between tilemap and player*/
        //Makes all tiles that have property "collides" have collision
        this.solidLayer.setCollisionByProperty( {collides: true} );
        this.platformLayer.setCollisionByProperty( {collides: true} );
        this.solidLayer.setDepth(10);
        this.platformLayer.setDepth(-3);
        //Makes all the platform tiles only have 1-way collision
        this.platformLayer.forEachTile(tile => {
            if(tile.index == 6){
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
        });
        this.physics.add.collider(this.plrSpy, this.solidLayer);
        this.platformCollision = this.physics.add.collider(this.plrSpy, this.platformLayer);

        //Alternatively, maybe we'd want a 2nd camera that shows the entire level, as the 'zoomed out' camera?
        this.cameras.main.zoom = 2;
        this.cameras.main.setBounds(0, 0, this.tilemap.widthInPixels, this.tilemap.heightInPixels);
        this.cameras.main.startFollow(this.plrSpy);


        //UI
        let dressedTextConfig = {
            fontSize: '9px',
            align: 'center',
            stroke: '#000000',
            strokeThickness: 4
        }
        this.warningText = this.add.text(game.config.width/2 + 600, game.config.height/2, 'WARNING SPOTTED', dressedTextConfig).setOrigin(0.5).setDepth(99);
        this.warningText.alpha = 0;
        this.dressedText = this.add.text(game.config.width/2 + 600, game.config.height/2, 'Getting dressed...', dressedTextConfig).setOrigin(0.5).setDepth(97);
        this.disguiseTimer = this.add.text(game.config.width/2 + 600, game.config.height/2, '0', dressedTextConfig).setOrigin(0.5);
        this.disguiseTimer.alpha = 0;
        this.disguiseTimer.setDepth(97);
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
        this.warningTween = this.tweens.addCounter({
            from: 255,
            to: 0,
            duration: this.plrSpy.graceDuration,
            onUpdate: function (tween)
            {
                const value = Math.floor(tween.getValue());
                this.parent.scene.warningText.setTint(Phaser.Display.Color.GetColor(255, value, value));
            }
        }); 
        
 
        dressedTextConfig.fontSize = '12px';
        this.uiMessage = this.add.text(game.config.width/2, game.config.height/4 + 50, "Tutorial", dressedTextConfig).setOrigin(0.5, 0.5).setScrollFactor(0);
        this.uiMessage.setDepth(98);
        //Initial text position is within the level, where it will then always follow the camera.
        //So if text is initially outside the camera's view, it will always stay out of view
        //We can't make it be inside the camera because it spawns at 0, 0, then is moved at some point and begins moving text...I think
        //Also keep in mind camera is zoomed in
        //this.createMessageBoxes();

        this.gameOver = false;
        this.endScene = this.scene.key ;
        this.graphics = this.add.graphics({ lineStyle: { width: 1, color: 0x00ff00}, fillStyle: { color: 0xffffff, alpha: 0.3 } });
        this.checkGameProgress();
    
        this.messageBoxGroup = this.physics.add.staticGroup();
        this.tutorialMessages = this.tilemap.filterObjects("Objects", object => {
            if(object.name == "message"){
                let newBody = this.messageBoxGroup.create(object.x, object.y, 'objButton', 0, false, true);
                //This is actually a sprite; not a static body
                newBody.setOrigin(0, 0); //Changes origin and position of the sprite, but not the body
                newBody.refreshBody(); //Syncs the body to the sprite object
                newBody.body.setSize(object.width, object.height, false); //Grows out the body from its top-left position
                
                console.log(object.properties[0]["value"]);
                return true;
            }
            console.log("Not a message object");
            return false;
        });
        //endscreen things
        this.gameOverText = this.add.text(0,1000, 'GAMEOVER' ).setOrigin(0.5);;
        this.restartbutton = this.add.text(0,1000 , 'Restart', {color: '#FF994F'}).setOrigin(0.5).setDepth(100);
        this.MainMenubutton = this.add.text(0,1000 , 'Main Menu' ,{color: '#FFFFFF'}).setOrigin(0.5).setDepth(100);
    }

    create(){
        //Create method gets overwritten when called in LevelShipyard
        console.log("Create method from levelBase");
    }

    update(time, delta){
        this.updateDefault(time, delta);
    }

    /*Calls update on PlayerSpy, the UI, and runs the gameOver function*/
    updateDefault(time, delta){
        //If the exit door has been switched to 'true', load the next scene
        //this.endScene is a global variable in main.js
        //Noteworthy that this probably comes a frame later when switch is made true,
        //but at the same time it doesn't matter because door.switch doesn't reset
        if(this.Exit[0].switch == true){
            //This happens at the next scene manager update, meaning the delay is actually 2 frames
            this.scene.start(sceneSelect);
        }
        if(!this.gameOver){
            this.plrSpy.update(time, delta); 
            this.Exit[0].update(time,delta);

            //Check if overlapping tutorial box; adjust tutorial message accordingly
            let messageBoxes = this.messageBoxGroup.getChildren();
            let overlappingMessage = false;
            for(let index = 0; index < messageBoxes.length; index++){
                let boxBody = messageBoxes[index].body
                if(this.plrSpy.x > boxBody.x && this.plrSpy.x < boxBody.x + boxBody.width){
                    if(this.plrSpy.y > boxBody.y && this.plrSpy.y < boxBody.y + boxBody.height){
                        this.uiMessage.visible = true;
                        this.uiMessage.text = this.tutorialMessages[index].properties[0]["value"];
                        overlappingMessage = true;
                    }
                }
            }

            if(!overlappingMessage){
                this.uiMessage.visible = false;
            }

            if(this.buttonTracker.completed){
                this.uiMessage.visible = true;
                this.uiMessage.text = "Objectives complete. Head for the exit!"
            }
        }
        if(this.gameOver){
            this.gameOverFunc();
        }
        //allows text to follow player while getting dressed 
        if(this.plrSpy.gettingDressed || this.plrSpy.tempUI){
            this.dressedText.x = this.plrSpy.x + 8;
            this.dressedText.y = this.plrSpy.y - 40;
            this.disguiseTimer.x = this.plrSpy.x + 8;
            this.disguiseTimer.y = this.plrSpy.y - 30;
        }
        if(this.plrSpy.detected){
            this.warningText.x = this.plrSpy.x + 8;
            this.warningText.y = this.plrSpy.y - 50;
        }
        //game over selection 
        if(this.gameOver){
            if (Phaser.Input.Keyboard.JustDown(keyDown)) {
                if(this.endScene == this.scene.key){
                    this.restartbutton.setColor('#FFFFFF');
                    this.MainMenubutton.setColor('#FF994F');
                    this.endScene = 'menuScene';
                }
                else if(this.endScene == 'menuScene'){
                    this.MainMenubutton.setColor('#FFFFFF');
                    this.restartbutton.setColor('#FF994F');
                    this.endScene = this.scene.key;
                }  
              }
            if (Phaser.Input.Keyboard.JustDown(keyJump)) {
                if(this.endScene == this.scene.key){
                    this.restartbutton.setColor('#FFFFFF');
                    this.MainMenubutton.setColor('#FF994F');
                    this.endScene = 'menuScene';
                }
                else if(this.endScene == 'menuScene'){
                    this.MainMenubutton.setColor('#FFFFFF');
                    this.restartbutton.setColor('#FF994F');
                    this.endScene = this.scene.key;
                }  
            }  
            //BUG: Despite calling JustDown, this can trigger if the button is held down
            if (Phaser.Input.Keyboard.JustDown(keyDisguise)) {
                //console.log('selecting');
                this.scene.start(this.endScene);    
            }  
        }
    }

    defineKeys(){
        keyLeft = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRight = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        keyDown = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        keyJump = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        keyDisguise = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
        keyInteract = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X);
    }
    gameOverFunc(){
        console.log("hey bestiee");
        //im setting up levels based off numbers,
        this.gameOverText.x = this.cameras.main.midPoint.x; 
        this.gameOverText.y = this.cameras.main.midPoint.y - 32; 
        this.restartbutton.x = this.cameras.main.midPoint.x ;
        this.restartbutton.y = this.cameras.main.midPoint.y; 
        this.MainMenubutton.x = this.cameras.main.midPoint.x;
        this.MainMenubutton.y = this.cameras.main.midPoint.y +32;
    }
    checkGameProgress(){
        //console.log(furthestLevel);
        if(furthestLevel == 0 && this.scene.key == 'levelTutorialA' ){
            furthestLevel = 1;
        }else if(furthestLevel == 1 && this.scene.key == 'levelTutorialB'){
            furthestLevel = 2;
        }else if(furthestLevel == 2 && this.scene.key == 'levelClimb'){
            furthestLevel = 3;
        }else if(furthestLevel == 3 && this.scene.key =='levelShipyard'){
            furthestLevel= 4;
        }
    }
    placeDoors(){
        this.doors = this.tilemap.createFromObjects("Objects", {
            name: "door",
            key: this.tilesSheetName,
            frame: 13,
            classType: Door
        })
        this.groupDoors = this.add.group(this.doors);
        this.groupDoors.runChildUpdate = true;  
        //locked doors 
        this.lockedDoors = this.tilemap.createFromObjects("Objects", {
            name: "lockedDoor",
            key: this.tilesSheetName,
            frame: 9,
            classType: Door
        })
        
        

        this.groupLockedDoors = this.add.group(this.lockedDoors);
        this.groupLockedDoors.runChildUpdate = true;  
        //locked doors 
    }
    doorCollision(interactables){
        //iterates through all the members and updates collision
        // so that enemies and players can move through doors
        let children = this.groupDoors.getChildren();
        for(let door in children ){
            children[door].setCollision(interactables, false,this.buttonTracker)
        }
        children = this.groupLockedDoors.getChildren();
        for(let door in children ){
            children[door].setCollision(interactables,true,this.buttonTracker );
        }
    }
    placeExit(nextLevel, locked, checklist){
        this.Exit = this.tilemap.createFromObjects("Objects",[
        {
            name: "exit",
            key: this.tilesSheetName,
            frame: 11,
            classType: Exit
        },{ // sets the bottom half but does put the sprite in the group
            name: "exitB",
            key: this.tilesSheetName,
            frame: 15,
        }]);
        this.Exit[0].setNextLevel(nextLevel, locked, checklist);
        this.Exit[1].setDepth(-4);
        //locked doors  
    }
    
    createMessageBoxes(){
        this.messages = this.tilemap.createFromObjects("Objects", {
            name: "message",
            key: "objMessageBox"
        });
    }
    

}