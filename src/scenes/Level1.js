class Level1 extends LevelBase {
    constructor() {
        super('level1');
    }

    preload(){
        this.preloadDefault('level_digital_prototype.json',
         'PH_city_tiles_small.png');
    }

    create(){
        this.createDefault();
        
        this.plrSpy.x = 100;
        this.plrSpy.y = 332;
    }

    update(time, delta){
        this.updateDefault(time, delta);
    }
}