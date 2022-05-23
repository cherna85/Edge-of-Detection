class LevelTutorialB extends LevelBase {
    constructor() {
        super('levelTutorialB');
    }

    preload(){
        //Replace arguments w/ TutorialA's tilemap and tileset
        this.preloadDefault('level_tutorial_B.json',
        'PH_tiles.png'); //Gotta be something wrong with the way the tileset is set up...
    }

    create(){
        this.createDefault('PH_tiles');
        //this.platformCollision = this.physics.add.collider(this.plrSpy, this.platformLayer);

        /*Adjust player starting position */
        this.plrSpy.x = 160;
        this.plrSpy.y = 304;

        this.enemy1 = new Enemy(this, 320, 304, 'playerDisguise', 0, false, 200);
        this.enemy1.straightPath(this, 592, 304, 4000);
        this.createButtons();
        this.placeDoors([this.plrSpy,this.enemy1]);
    }

    update(time, delta){
        this.updateDefault(time, delta);

        //Make sure all enemies are updated (possibly use a group)
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