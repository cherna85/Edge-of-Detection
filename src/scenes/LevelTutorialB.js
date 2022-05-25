class LevelTutorialB extends LevelBase {
    constructor() {
        super('levelTutorialB');
        console.log("constructor LVL 2");
    }

    preload(){
        //Replace arguments w/ TutorialA's tilemap and tileset
        this.preloadDefault('level_tutorial_B.json',
        'PH_tiles.png');
        console.log("preload LVL 2");
        //Each of these methods are called
        /*Problem on my end is that unique objects are loaded by the tilemap stays the same
        which makes me think it is calling the same default methods gain
        (Desptite the fact that these default methods are supposed to be overwritten by 
        preloads of extended scenes
        */
    }

    create(){
        this.createDefault('PH_tiles');

        /*Adjust player starting position */
        this.plrSpy.x = 160;
        this.plrSpy.y = 304;

        this.placeDoors(); //Makesure to load doors before any raycasting

        this.enemy1 = new Enemy(this, 320, 304, 'playerDisguise', 0, false, 200);
        this.enemy1.straightPath(this, 592, 304, 4000);
        this.createButtons();

        this.graphics = this.add.graphics({ lineStyle: { width: 1, color: 0x00ff00}, fillStyle: { color: 0xffffff, alpha: 0.3 } });
        this.spotlightCaster = new LOS(this, 'spotlight' ,this.solidLayer);
        this.spotlight1 = this.spotlightCaster.createCircleRay(this, 11 * 16, 4 * 16, 128);
        this.spotlight2 = this.spotlightCaster.createCircleRay(this, 19 * 16, 4 * 16, 128);

        this.doorCollision([this.plrSpy, this.enemy1])
        this.placeExit('levelTutorialB', true, this.buttonTracker);
        //Affects both tweens
        let holdTime = 1000;
        let tweenDuration = 2500;

        this.tweens.addCounter({
            from: 11 * 16,
            to: 6 * 16,
            ease: 'Sine.easeInOut',
            duration: tweenDuration,
            repeat: -1,
            yoyo: true,
            hold: holdTime, //Hold only applys to yoyo
            repeatDelay: holdTime,
            onUpdate: function(tween)
            {
                const value = tween.getValue();
                let scene = this.parent.scene;
                scene.spotlight1.setOrigin(value, 4 * 16);
            }
        });
        this.tweens.addCounter({
            from: 19 * 16,
            to: 24 * 16,
            ease: 'Sine.easeInOut',
            duration: tweenDuration,
            repeat: -1,
            yoyo: true,
            hold: holdTime,
            repeatDelay: holdTime,
            onUpdate: function(tween)
            {
                const value = tween.getValue();
                let scene = this.parent.scene;
                scene.spotlight2.setOrigin(value, 4 * 16);
            }
        });
        console.log("created unique objects LVL 2");
    }

    update(time, delta){
        this.updateDefault(time, delta);

        //Make sure all enemies are updated (possibly use a group)
        this.enemy1.update();
        this.drawSpotlight(this.spotlight1)
        this.drawSpotlight(this.spotlight2)
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

    //Takes in a ray as parameter, which can cast a circle or cone
    drawSpotlight(spotlight){
        let intersections = spotlight.castCircle();
        //intersections.push(spotlight.origin);
        this.graphics.clear();
        this.graphics.fillStyle(0xffffff, 0.3);
        this.graphics.fillPoints(intersections);
    }
}