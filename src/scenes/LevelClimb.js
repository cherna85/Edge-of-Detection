class LevelClimb extends LevelBase {
    constructor() {
        super('levelClimb');
    }
  
    preload(){
        //Replace arguments w/ TutorialA's tilemap and tileset
        this.preloadDefault('level_climb.json',
        'PH_tiles.png');
    }

    create(){
        this.createDefault('PH_tiles');

        /*Adjust player starting position */
        this.plrSpy.x = 4 * 16;
        this.plrSpy.y = 37 * 16;

        this.placeDoors(); //Makesure to load doors before any raycasting

        this.enemy1 = new Enemy(this, 13 * 16, 16 * 37, 'playerDisguise', 0, false, 1000, 90, 30);
        this.enemy1.enemyLOS.setAngleDegRay(this.enemy1.detection, -90);
        this.createButtons();

        this.doorCollision([this.plrSpy,this.enemy1]);
        this.placeExit('levelClimb', true, this.buttonTracker);

        this.rayTween = this.tweens.addCounter({
            from: -110,
            to: -70,
            duration: 4000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut',
            onUpdate: function (tween)
            {
                const value = tween.getValue();
                let scene = this.parent.scene;
                scene.enemy1.enemyLOS.setAngleDegRay(scene.enemy1.detection, value);
            }
        });
    }

    update(time, delta){
        this.updateDefault(time, delta);
        this.enemy1.update();
    }

    createButtons(){
        //Create buttons
        /*Works well, but now the text isn't positioned correctly*/
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
}