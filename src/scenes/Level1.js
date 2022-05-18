class Level1 extends LevelBase {
    constructor() {
        super('level1');
    }

    create(){
        this.createDefault();
        this.plrSpy.x = 600;
        this.plrSpy.y = 300;
    }

    update(time, delta){
        this.updateDefault(time, delta);
    }
}