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
            //setting up keys
            keyUp = this.input.keyboard.addKey(PUp);
            keyDown = this.input.keyboard.addKey(PDown);
            keyJump = this.input.keyboard.addKey(PDisguise);
            keyInteract = this.input.keyboard.addKey(PInteract);
            
            this.add.text(game.config.width/2, game.config.height/2 -96, 'Main Menu', MenuConfig).setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2 -64, 'Press "' + PDisguiseT+ '" to Select, "'+ PInteractT + '" to go back', MenuConfig).setOrigin(0.5);
            
            //load data
            loadlevel = localStorage.getItem(localStorageName+'_loadlevel') == null ? 0 :
                localStorage.getItem(localStorageName+'_loadlevel');
            furthestLevel = localStorage.getItem(localStorageName+'_furthestLevel') == null ? 0 :
                localStorage.getItem(localStorageName+'_furthestLevel');
            smokeBombsHeld = localStorage.getItem(localStorageName+'_smokeBombsHeld') == null ? 0 :
                localStorage.getItem(localStorageName+'_smokeBombsHeld');
            plotUnlocked = localStorage.getItem(localStorageName+'_plotUnlocked') == null ? 0 :
                localStorage.getItem(localStorageName+'_plotUnlocked');

            if(loadlevel == 'levelTutorialA'){
                loadlevel = 0;
            }

            //setting up "buttons" for scene selecting 
            MenuConfig.color =  '#FFFFFF';
            this.playbutton = this.add.text(game.config.width/2, game.config.height/2 - 32 , 'New Game', MenuConfig).setOrigin(0.5);
            MenuConfig.color =  '#FF994F';
           
            if(loadlevel == 0){
                MenuConfig.color =  '#808080';
           }
            this.loadgamebutton = this.add.text(game.config.width/2, game.config.height/2, 'Load Game', MenuConfig).setOrigin(0.5); //not set up, will do when we save data
            MenuConfig.color =  '#FF994F';

            this.lsbutton = this.add.text(game.config.width/2, game.config.height/2 +32 , 'Level Select', MenuConfig).setOrigin(0.5);
            this.optionsbutton = this.add.text(game.config.width/2, game.config.height/2 +64 , 'Options', MenuConfig).setOrigin(0.5);
            this.creditsbutton = this.add.text(game.config.width/2, game.config.height/2 +96 , 'Credits', MenuConfig).setOrigin(0.5);
            sceneSelect = 'levelTutorialA'; //reinitalize menu

            // just making sure its saving 
            // console.log(loadlevel);
            // console.log(smokeBombsHeld);
            //console.log(plotUnlocked);
            //console.log(furthestLevel+'HI');
            //localStorage.removeItem(localStorageName+'_furthestLevel');
            // localStorage.removeItem(localStorageName+'_loadlevel');
            // localStorage.removeItem(localStorageName+'_smokeBombsHeld');
            // localStorage.removeItem(localStorageName+'_plotUnlocked');

        }

        update(time, delta){
           if(loadlevel ==0){
                this.menuWithoutSave();
           }else{
               this.menuWithSave();
           }                  
        }

        updateMenu(current, next, scene){
            next.setColor('#FFFFFF');
            current.setColor('#FF994F');
            sceneSelect = scene;
        }
        menuWithSave(){
            if (Phaser.Input.Keyboard.JustDown(keyDown)) {
                if(sceneSelect == 'levelTutorialA'){
                    this.updateMenu(this.playbutton,this.loadgamebutton, loadlevel);
                }
                else if(sceneSelect == loadlevel){
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
                else if(sceneSelect == loadlevel){
                    this.updateMenu(this.loadgamebutton, this.playbutton, 'levelTutorialA' );
                }  
                else if(sceneSelect == 'levelselectScene'){
                    this.updateMenu(this.lsbutton, this.loadgamebutton, loadlevel);
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