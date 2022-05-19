class LevelShipyard extends LevelBase {
    constructor() {
        super('levelShipyard');
    }

    preload(){
        this.preloadDefault('level_digital_prototype.json',
         'PH_city_tiles_small.png');
    }

    create(){
        this.createDefault();

        /*Adjust player starting position */
        this.plrSpy.x = 50;
        this.plrSpy.y = 332;

        this.levelLOS = new LOS(this, this.solidLayer);
        this.createButtons();

        //Sets up collision with player and lights/cameras
        this.physics.add.overlap(this.levelLOS.ray2, this.plrSpy, function(rayFoVCircle, target){
            if(!target.disguiseActive){
                //console.log("detected by 2");
                target.detectedFunc();
            }
        }, this.levelLOS.ray2.processOverlap.bind(this.levelLOS.ray2));
        this.physics.add.overlap(this.levelLOS.ray, this.plrSpy, function(rayFoVCircle, target){
            if(!target.disguiseActive){
                //console.log("detected by 2");
                target.detectedFunc();
            }
        }, this.levelLOS.ray.processOverlap.bind(this.levelLOS.ray));

        //remove later
        this.enemy1 = new Enemy(this, 50, 355, 'playerDisguise');
        this.enemy1.straightPath(this,50, 355,100,355, 4000);
        
    }

    update(time, delta){
        this.updateDefault(time, delta);
        this.enemy1.update();
        this.enemy1.path.draw(this.graphics);
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
}