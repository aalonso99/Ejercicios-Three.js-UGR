
class MyBolaSaltarina extends THREE.Object3D {
  constructor(gui,titleGui) {

    super();
    this.radius = 1.0, this.height = 6.0;
    this.clock = new THREE.Clock();
    var t_1 = {t:0.0};
    var t_f = {t:this.height};
    this.speed = 1.0;

    var materialCyl = new THREE.MeshNormalMaterial({flatShading:false});
    materialCyl.needsUpdate = true;
    materialCyl.transparent = true;
    materialCyl.opacity = 0.3;
    this.cylinderMesh = new THREE.Mesh( new THREE.CylinderBufferGeometry( 1, 1, this.height, 32 ), materialCyl);
    
    var materialSphere = new THREE.MeshNormalMaterial({flatShading:false});
    materialSphere.needsUpdate = true;
    this.sphereMesh = new THREE.Mesh( new THREE.SphereBufferGeometry( 0.5, 32, 32 ), materialSphere);

    this.cylinderMesh.position.set(0,this.height/2, 0);
    this.nodoSphere = new THREE.Object3D();
    this.nodoSphere.add(this.sphereMesh);
    this.sphereMesh.position.set(this.radius, 0, 0);
    this.add (this.cylinderMesh);
    this.add (this.nodoSphere);

    this.heightAnim = new TWEEN.Tween(t_1).to(t_f, 1000)
        .easing(TWEEN.Easing.Sinusoidal.InOut)
        .repeat(Infinity)
        .onUpdate( () => {
            this.sphereMesh.position.y = t_1.t;
        }).yoyo(true)
        .start();

    this.animationUpdate = () => {
      this.cylinderMesh.scale.set(this.radius, 1.0, this.radius);
      this.nodoSphere.rotateY(this.clock.getDelta()*2*Math.PI/4.0); 
      this.sphereMesh.position.set(this.radius, 0, 0);  
    }

    this.createGUI(gui,titleGui);    
    
  }

  createGUI (gui,titleGui) {
    var that = this;
    this.guiControls = new function () {

      this.radiusControl = 1.0;
      
      this.reset = function () {
        this.radiusControl = 1.0;
      }
    } 
    
    var folder = gui.addFolder (titleGui);
    folder.add (this.guiControls, 'radiusControl', 0.1, 5.0, 0.1).name ('Radio: ').listen();
    
    folder.add (this.guiControls, 'reset').name ('[ Reset ]');
  }
  
  update () {
    this.radius = this.guiControls.radiusControl;
    this.animationUpdate();
    TWEEN.update();
  }
}