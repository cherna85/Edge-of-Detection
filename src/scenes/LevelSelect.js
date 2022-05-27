class LevelSelect extends Phaser.Scene {
    constructor() {
        super('levelselectScene');
    }


    create() {
        this.add.text(game.config.width/2, game.config.height/2, 'Level Select').setOrigin(0.5);
        keyJump = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
        keyDisguise = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X);
        keyUp = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        keyDown = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        console.log(furthestLevel);

        let LevelSelectConfig = {
            fontFamily:  'Ariel', 
            fontSize: '16px',
            backgroundColor: null,
            color: '#FF994F'
        }
        LevelSelectConfig.color = '#FFFFFF';
        this.tutA = this.add.text(game.config.width/4, game.config.height/4 , '• Tutorial A •', LevelSelectConfig);
        LevelSelectConfig.color = '#FF994F';
        this.add.text(game.config.width/4 + 30 , game.config.height/4+20, 'screenshot', LevelSelectConfig);
        LevelSelectConfig.color = '#FF994F';
        if(furthestLevel < 2){
            LevelSelectConfig.color =  '#808080';
        }
        this.tutB = this.add.text(game.config.width/4, (game.config.height*2.5)/4 , '• Tutorial B •', LevelSelectConfig);
        this.add.text(game.config.width/4 + 30 , (game.config.height*2.5)/4+20, 'screenshot', LevelSelectConfig);
       
        if(furthestLevel < 3){
            LevelSelectConfig.color =  '#808080';
        }
        this.climb = this.add.text((game.config.width*2.5)/4, game.config.height/4 , '• Climb •', LevelSelectConfig);
        this.add.text((game.config.width*2.5)/4 + 30 , game.config.height/4+20, 'screenshot', LevelSelectConfig);
        if(furthestLevel < 4){
            LevelSelectConfig.color =  '#808080';
        }
        this.shipyard = this.add.text((game.config.width*2.5)/4, (game.config.height*2.5)/4 , '• Shipyard •', LevelSelectConfig);
        this.add.text((game.config.width*2.5)/4 + 30 , (game.config.height*2.5)/4+20, 'screenshot', LevelSelectConfig);
        sceneSelect = 'levelTutorialA'; //reinitalize menu
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(keyDisguise)) {
            this.scene.start('menuScene');    
        }
        if (Phaser.Input.Keyboard.JustDown(keyDown)) {
            if(sceneSelect == 'levelTutorialA'){
                this.updateMenu(this.tutA,this.tutB, 'levelTutorialB');
            }else if(sceneSelect == 'levelTutorialB'){
                this.updateMenu(this.tutB,this.climb, 'levelClimb');
            }else if(sceneSelect == 'levelClimb'){
                this.updateMenu(this.climb,this.shipyard, 'levelShipyard');
            }else if (sceneSelect == 'levelShipyard'){
                this.updateMenu(this.shipyard, this.tutA, 'levelTutorialA');
            }
        }
        if (Phaser.Input.Keyboard.JustDown(keyUp)) {
            if(sceneSelect == 'levelTutorialA'){
                this.updateMenu(this.tutA,this.shipyard, 'levelShipyard');
            }else if(sceneSelect == 'levelTutorialB'){
                this.updateMenu(this.tutB,this.tutA, 'levelTutorialA');
            }else if(sceneSelect == 'levelClimb'){
                this.updateMenu(this.climb,this.tutB, 'levelTutorialB');
            }else if (sceneSelect == 'levelShipyard'){
                this.updateMenu(this.shipyard, this.climb, 'levelClimb');
            }
        }
        this.Select();
    }
    updateMenu(current, next, scene){
        next.setColor('#FFFFFF');
        if((sceneSelect == 'levelTutorialA' && furthestLevel <= 1 )|| (sceneSelect == 'levelTutorialB' && furthestLevel  < 2) 
            || (sceneSelect == 'levelClimb' && furthestLevel < 3) || (sceneSelect == 'levelShipyard' && furthestLevel < 4)){
                current.setColor('#808080');
        }else{
            current.setColor('#FF994F');
        }
        sceneSelect = scene;
    }
    Select(){
        //selects the scene 
        if (Phaser.Input.Keyboard.JustDown(keyJump)) { 
            if((sceneSelect == 'levelTutorialA' && furthestLevel <= 1 )|| (sceneSelect == 'levelTutorialB' && furthestLevel  < 2) 
            || (sceneSelect == 'levelClimb' && furthestLevel < 3) || (sceneSelect == 'levelShipyard' && furthestLevel < 4)){
                console.log('not allowed');
                //this.sound.play('sfx_select');
            }else{
                this.sound.play('sfx_select');
                this.scene.start(sceneSelect);    
            }   
        }
    }

}