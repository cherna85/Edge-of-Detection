class LevelTutorialA extends LevelBase {
    constructor() {
        super('levelTutorialA');
    }

    preload(){
        //Replace arguments w/ TutorialA's tilemap and tileset
        this.preloadDefault('level_tutorial_A.json',
         'PH_tiles.png');
    }

    create(){
        this.createDefault();

        /*Adjust player starting position */
        this.plrSpy.x = 300;
        this.plrSpy.y = 332;
    }

    update(time, delta){
        this.updateDefault(time, delta);
    }
}