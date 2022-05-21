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
  
          /*Adjust player starting position */
          this.plrSpy.x = 160;
          this.plrSpy.y = 304;
  
          this.enemy1 = new Enemy(this, 320, 304, 'playerDisguise', 0, false, 200);
          this.enemy1.straightPath(this, 592, 304, 4000);
      }
  
      update(time, delta){
          this.updateDefault(time, delta);
  
          //Make sure all enemies are updated (possibly use a group)
          this.enemy1.update();
      }
  }