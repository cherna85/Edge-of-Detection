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

        this.enemy1 = new Enemy(this, 608, 432, 'playerDisguise', 0, true, 200);
        //this.enemy1.standingTurn(this, 4000);
        //this.enemy1.straightPath(this, 432, 432, 4000);

        this.enemy2 = new Enemy(this, 400, 336, 'playerDisguise', 0, false, 200);
        this.enemy3 = new Enemy(this, 352, 336, 'playerDisguise', 0, true, 200);
    }

    update(time, delta){
        this.updateDefault(time, delta);
        this.enemy1.update();
        this.enemy2.update();
        this.enemy3.update();
    }
}