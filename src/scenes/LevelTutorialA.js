class LevelTutorialA extends LevelBase {
    constructor() {
        super('levelTutorialA');
    }

    preload(){
        //Replace arguments w/ TutorialA's tilemap and tileset
        this.preloadDefault('level_tutorial_A.json',
         'PH_tiles.png'); //Gotta be something wrong with the way the tileset is set up...
    }

    create(){
        this.createDefault('PH_tiles');

        /*Adjust player starting position */
        this.plrSpy.x = 256;
        this.plrSpy.y = 432;

        /*Creates 3 enemies, two of whom face left*/
        this.enemy1 = new Enemy(this, 608, 432, 'playerDisguise', 0, true, 200);
        //this.enemy1.standingTurn(this, 4000);
        //this.enemy1.straightPath(this, 432, 432, 4000);

        this.enemy2 = new Enemy(this, 400, 336, 'playerDisguise', 0, false, 200);
        this.enemy3 = new Enemy(this, 352, 336, 'playerDisguise', 0, true, 200);

        this.button = new ObjInteract(this, 136, 336, 'objButton', 0);
        //Add later: function that unlocks level exit when button is activated
        this.button.on('objactivated', () => {
            console.log("Button was activated");
        });
    }

    update(time, delta){
        this.updateDefault(time, delta);

        //Make sure all enemies are updated (possibly use a group)
        this.enemy1.update();
        this.enemy2.update();
        this.enemy3.update();
        this.button.update();
    }
}