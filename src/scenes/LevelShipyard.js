class LevelShipyard extends LevelBase {
    constructor() {
        super('levelShipyard');
    }

    preload(){
        this.preloadDefault('level_shipyard.json',
         'PH_tiles.png', 'tilemapShipyard');
    }

    create(){
        this.createDefault('PH_tiles');

        /*Adjust player starting position */
        this.plrSpy.x = 50;
        this.plrSpy.y = 332;
        this.placeDoors(); //Makesure to load doors before any raycasting

        this.levelLOS = new LOS(this, 'spotlight',this.solidLayer);
        this.levelLOS2 = new LOS(this, 'spotlight',this.solidLayer);
        this.createButtons();
        this.createSpotlights(this.solidLayer);

        this.doorCollision([this.plrSpy])
        this.placeExit('levelTutorialA', true, this.buttonTracker);
        
    }

    update(time, delta){
        this.updateDefault(time, delta);
        //this.enemy.update(time,delta,this);
    }

    createButtons(){
        //Create buttons
        this.buttons = this.tilemap.createFromObjects("Objects", {
            name: "button",
            key: "objButton",
            frame: 0,
            classType: ObjInteract
        })
        this.groupButtonObjs = this.add.group(this.buttons);
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
        //We will have multiple rays per scene, so we may want to set this up so that it loops over all rays or something
    createSpotlights( mappedObjects){
        //https://github.com/wiserim/phaser-raycaster    
        // path to rotate along 
        this.path = new Phaser.Curves.Path();
        this.path.add(new Phaser.Curves.Ellipse(this.tilemap.widthInPixels/2, this.tilemap.heightInPixels/2 - 16, 25));
        this.follower = { t: 0, vec: new Phaser.Math.Vector2() };
        this.tweens.add({
            targets: this.follower,
            t: 1,
            duration: 35025,
            loop: -1
        });   
        let degree = 0; 
        let ray = this.levelLOS.createConeRay(this, this.follower.vec.x, this.follower.vec.y, degree, 180, 200);
        let ray2 = this.levelLOS2.createConeRay(this, this.follower.vec.x, this.follower.vec.y, degree+180, 180, 200);
        /*Could potentially limit the LOS range visually by surrounding it with a circle it colldies with,
        matching the radius of the ray's collision range.*/
        //this.rayContainer = this.add.circle(this.ray.origin.x, this.ray.origin.y, 200);
        //mappedObjects.push(this.rayContainer);
        //Draw ray LoS
        this.rotate = this.time.addEvent({ delay: 100, callback: () =>{
            ray.setAngleDeg(degree++);
            this.path.getPoint(this.follower.t, this.follower.vec);
            ray.setOrigin(this.follower.vec.x, this.follower.vec.y);
            this.levelLOS.setRangeXY(this.follower.vec.x, 0, this.follower.vec.y, 0);
            //second light 
            ray2.setAngleDeg(degree+180);
            // fixes bug where send ray jumps onto the 
            //same path as the first array
            if(this.path.getPoint(this.follower.t+0.5, this.follower.vec) == null){
                this.path.getPoint(this.follower.t - 0.5, this.follower.vec);
            }
            ray2.setOrigin(this.follower.vec.x, this.follower.vec.y);
            this.levelLOS2.setRangeXY(this.follower.vec.x,0,this.follower.vec.y,0 );
            this.levelLOS2.drawLOS(this,[ray2]); 
            this.levelLOS.drawLOS(this,[ray]);  
             
            }, loop: true });
    }
}