class LevelTutorialA extends LevelBase {
    constructor() {
        super('levelTutorialA');
        console.log("constructor");
    }

    preload(){
        //Replace arguments w/ TutorialA's tilemap and tileset
        this.preloadDefault('level_tutorial_A.json',
         'PH_tiles.png', 'tilemapTutorialA'); //Gotta be something wrong with the way the tileset is set up...
    }

    create(){
        this.createDefault('PH_tiles');

        //this.cache.tilemap.exists('')

        /*Adjust player starting position */
        this.plrSpy.x = 128;
        this.plrSpy.y = 432;

        this.placeDoors(); //Makesure to load doors before any raycasting

        /*Creates 3 enemies, two of whom face left*/
        this.enemy1 = new Enemy(this, 608, 432, 'playerDisguise', 0, true, 200);
        //this.enemy1.standingTurn(this, 4000);
        //this.enemy1.straightPath(this, 432, 432, 4000);

        this.enemy2 = new Enemy(this, 400, 336, 'playerDisguise', 0, false, 200);
        this.enemy3 = new Enemy(this, 352, 336, 'playerDisguise', 0, true, 200);

        this.createButtons();
        this.doorCollision([this.plrSpy,this.enemy1, this.enemy2, this.enemy3]);
        this.placeExit('levelTutorialB', true, this.buttonTracker);
    }

    update(time, delta){
        this.updateDefault(time, delta);

        //Make sure all enemies are updated (possibly use a group)
        this.enemy1.update();
        this.enemy2.update();
        this.enemy3.update();
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