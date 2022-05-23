class LevelClimb extends LevelBase {
      constructor() {
          super('levelClimb');
      }
  
      preload(){
          //Replace arguments w/ TutorialA's tilemap and tileset
          this.preloadDefault('level_climb.json',
          'PH_tiles.png');
      }
  
      create(){
          this.createDefault('PH_tiles');
  
          /*Adjust player starting position */
          this.plrSpy.x = 160;
          this.plrSpy.y = 304;
  
          this.createButtons();
      }
  
      update(time, delta){
          this.updateDefault(time, delta);
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