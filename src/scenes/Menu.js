class Menu extends Phaser.Scene {
        constructor(){
            super("menuScene");
        }

        preload(){
                //load audio
            this.load.audio('sfx_select', './assets/sfx/Blip_Select.wav');
            this.load.audio('sfx_disguise', 'assets/sfx/Disguise_applied.wav');
            this.load.audio('sfx_finishedObjective', 'assets/sfx/Finished_objective.wav');
            this.load.audio('sfx_jump', 'assets/sfx/Jump2.wav');
            this.load.audio('sfx_discovered', 'assets/sfx/Player_discovered.wav');
            
        }

        create(){

            let MenuConfig = {
                  fontFamily:  'Ariel', 
                  fontSize: '16px',
                  backgroundColor: null,
                  color: '#FF994F'
            }

            this.add.text(game.config.width/2, game.config.height/2 -96, 'Main Menu', MenuConfig).setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2 -64, 'Press Z to Select', MenuConfig).setOrigin(0.5);

            //setting up keys
            keyUp = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
            keyDown = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
            keyJump = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
            //load data
            furthestLevel = localStorage.getItem(localStorageName+'_furthestLevel') == null ? 0 :
                localStorage.getItem(localStorageName+'_furthestLevel');
            smokeBombsHeld = localStorage.getItem(localStorageName+'_smokeBombsHeld') == null ? 0 :
                localStorage.getItem(localStorageName+'_smokeBombsHeld');
            plotUnlocked = localStorage.getItem(localStorageName+'_plotUnlocked') == null ? 0 :
                localStorage.getItem(localStorageName+'_plotUnlocked');

            if(furthestLevel == 'levelTutorialA'){
                furthestLevel = 0;
            }

            //setting up "buttons" for scene selecting 
            MenuConfig.color =  '#FFFFFF';
            this.playbutton = this.add.text(game.config.width/2, game.config.height/2 - 32 , 'New Game', MenuConfig).setOrigin(0.5);
            MenuConfig.color =  '#FF994F';
           
            if(furthestLevel == 0){
                MenuConfig.color =  '#808080';
           }
            this.loadgamebutton = this.add.text(game.config.width/2, game.config.height/2, 'Load Game', MenuConfig).setOrigin(0.5); //not set up, will do when we save data
            MenuConfig.color =  '#FF994F';

            this.lsbutton = this.add.text(game.config.width/2, game.config.height/2 +32 , 'Level Select', MenuConfig).setOrigin(0.5);
            this.optionsbutton = this.add.text(game.config.width/2, game.config.height/2 +64 , 'Options', MenuConfig).setOrigin(0.5);
            this.creditsbutton = this.add.text(game.config.width/2, game.config.height/2 +96 , 'Credits', MenuConfig).setOrigin(0.5);
            sceneSelect = 'levelTutorialA'; //reinitalize menu

            // just making sure its saving 
            // console.log(furthestLevel);
            // console.log(smokeBombsHeld);
            // console.log(plotUnlocked);
            // localStorage.removeItem(localStorageName+'_furthestLevel');
            // localStorage.removeItem(localStorageName+'_smokeBombsHeld');
            // localStorage.removeItem(localStorageName+'_plotUnlocked');

        }

        update(time, delta){
           if(furthestLevel ==0){
                this.menuWithoutSave();
           }else{
               this.menuWithSave();
           }
           console.log(sceneSelect)
           

            

        }

        updateMenu(current, next, scene){
            next.setColor('#FFFFFF');
            current.setColor('#FF994F');
            sceneSelect = scene;
        }
        menuWithSave(){
            if (Phaser.Input.Keyboard.JustDown(keyDown)) {
                if(sceneSelect == 'levelTutorialA'){
                    this.updateMenu(this.playbutton,this.loadgamebutton, furthestLevel);
                }
                else if(sceneSelect == furthestLevel){
                    this.updateMenu(this.loadgamebutton, this.lsbutton, 'levelselectScene');
                }  
                else if(sceneSelect == 'levelselectScene'){
                    this.updateMenu(this.lsbutton, this.optionsbutton, 'optionsScene');
                }  
                else if(sceneSelect == "optionsScene"){
                    this.updateMenu(this.optionsbutton, this.creditsbutton, 'creditScene');
                }
                else if (sceneSelect == "creditScene"){
                    this.updateMenu(this.creditsbutton, this.playbutton, "levelTutorialA");
                }
                }
            if (Phaser.Input.Keyboard.JustDown(keyUp)) {
                if(sceneSelect == 'levelTutorialA'){
                    this.updateMenu(this.playbutton,this.creditsbutton, 'creditScene');
                }
                else if(sceneSelect == furthestLevel){
                    this.updateMenu(this.loadgamebutton, this.playbutton, 'levelTutorialA' );
                }  
                else if(sceneSelect == 'levelselectScene'){
                    this.updateMenu(this.lsbutton, this.loadgamebutton, furthestLevel);
                }  
                else if(sceneSelect == "optionsScene"){
                    this.updateMenu(this.optionsbutton, this.lsbutton, "levelselectScene");
                }
                else if (sceneSelect == "creditScene"){
                    this.updateMenu(this.creditsbutton, this.optionsbutton, "optionsScene");
                }
            }
            this.Select();

        } 
        menuWithoutSave(){
            if (Phaser.Input.Keyboard.JustDown(keyDown)) {
                if(sceneSelect == 'levelTutorialA'){
                    this.updateMenu(this.playbutton,this.lsbutton, 'levelselectScene');
                }
                else if(sceneSelect == 'levelselectScene'){
                    this.updateMenu(this.lsbutton, this.optionsbutton, 'optionsScene');
                }  
                else if(sceneSelect == "optionsScene"){
                    this.updateMenu(this.optionsbutton, this.creditsbutton, 'creditScene');
                }
                else if (sceneSelect == "creditScene"){
                    this.updateMenu(this.creditsbutton, this.playbutton, "levelTutorialA");
                }
                }
            if (Phaser.Input.Keyboard.JustDown(keyUp)) {
                if(sceneSelect == 'levelTutorialA'){
                    this.updateMenu(this.playbutton,this.creditsbutton, 'creditScene');
                }
                else if(sceneSelect == 'levelselectScene'){
                    this.updateMenu(this.lsbutton, this.playbutton, 'levelTutorialA');
                }  
                else if(sceneSelect == "optionsScene"){
                    this.updateMenu(this.optionsbutton, this.lsbutton, "levelselectScene");
                }
                else if (sceneSelect == "creditScene"){
                    this.updateMenu(this.creditsbutton, this.optionsbutton, "optionsScene");
                }
            }
            this.Select();
        }
        Select(){
            //selects the scene 
            if (Phaser.Input.Keyboard.JustDown(keyJump)) { 
                this.sound.play('sfx_select');
                this.scene.start(sceneSelect);    
            }
        }
}