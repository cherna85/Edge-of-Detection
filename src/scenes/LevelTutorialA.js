class LevelTutorialA extends LevelBase {
    constructor() {
        super('levelTutorialA');
    }

    preload(){
        //Replace arguments w/ TutorialA's tilemap and tileset
        this.preloadDefault('level_digital_prototype.json',
         'PH_city_tiles_small.png');
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