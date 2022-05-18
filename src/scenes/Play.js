class Play extends Phaser.Scene {
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
        //creates level
        this.level = new Level(this,'level1', 'lvlDigitalProto', 'PH_city_tiles', 'tilesCityPH', game.config.width/2-250, game.config.height/2+110);
        this.levelLOS = new LOS(this, this.level.getSolidLayer());
        //LEVEL SPECIFIC THIINGS WILL BE OUTSIDE
        this.createButtons();
        
        //let rect = this.add.rectangle( 150, 250, 50, 50).setStrokeStyle(1, 0xff0000); Used for debugging

        
        this.addColliders();
    }
    
    update(time, delta ) {
        this.level.update(this,time,delta);
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
        this.physics.add.collider(this.level.plrSpy, this.level.getSolidLayer());
        this.platformCollision = this.physics.add.collider(this.level.plrSpy, this.level.getPlatformLayer());
        //if player is caught in light 
        this.physics.add.overlap(this.levelLOS.ray2, this.level.plrSpy, function(rayFoVCircle, target){
            if(!target.disguiseActive){
                //console.log("detected by 2");
                target.detectedFunc();
            }
        }, this.levelLOS.ray2.processOverlap.bind(this.levelLOS.ray2));
        //if player is caught in light 
        this.physics.add.overlap(this.levelLOS.ray, this.level.plrSpy, function(rayFoVCircle, target){
            if(!target.disguiseActive){
                //console.log("detected by 2");
                target.detectedFunc();
            }
        }, this.levelLOS.ray.processOverlap.bind(this.levelLOS.ray));
    }

}