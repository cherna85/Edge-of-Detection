class Level1 extends LevelBase {
    constructor() {
        super('level1');
    }

    create(){
        this.createDefault();
        this.plrSpy.x = 200;
        this.plrSpy.y = 300;
    }
}