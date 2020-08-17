
class MyBolaEliptica extends THREE.Object3D {
  constructor(gui,titleGui) {

    super();
    this.original_radius = 3.0;
    this.radius = this.original_radius, this.height = 6.0;
    this.clock = new THREE.Clock();
    var t_1 = {t:0.0};
    var t_f = {t:2*Math.PI};
    this.speed = 1.0;

    var materialCyl = new THREE.MeshNormalMaterial({flatShading:false});
    materialCyl.needsUpdate = true;
    materialCyl.transparent = true;
    materialCyl.opacity = 0.3;
    this.cylinderMesh = new THREE.Mesh( 
        new THREE.CylinderBufferGeometry( 1.0, 1.0, this.height, 32 ), 
        materialCyl);
    
    var materialSphere = new THREE.MeshNormalMaterial({flatShading:false});
    materialSphere.needsUpdate = true;
    this.sphereMesh = new THREE.Mesh( new THREE.SphereBufferGeometry( 0.5, 32, 32 ), materialSphere);
    this.helper = new THREE.Mesh( new THREE.BoxBufferGeometry( 0.5, 0.5, 0.5, 32 ), materialSphere);

    this.nodoSphere = new THREE.Object3D();
    this.sphereMesh.position.set(this.original_radius, 0, 0);
    this.nodoSphere.add(this.sphereMesh);
    this.nodoSphere.add(this.helper);
    this.add (this.cylinderMesh);
    this.add (this.nodoSphere);

    this.rotAnim = new TWEEN.Tween(t_1).to(t_f, 4000)
        .repeat(Infinity)
        .onUpdate( () => {
            this.nodoSphere.position.set(0,0,0);
            this.nodoSphere.rotateY(this.clock.getDelta()*2.0*Math.PI/4.0);
            this.nodoSphere.updateMatrixWorld();
            let ratio = this.radius/this.original_radius;
            this.nodoSphere.position.set(
                this.sphereMesh.getWorldPosition(new THREE.Vector3()).x*(ratio-1),
                0,
                0);
        }).yoyo(true)
        .start();

    this.animationUpdate = () => {
      this.cylinderMesh.scale.set(this.radius, 1.0, this.original_radius);
    }

    this.createGUI(gui,titleGui);    
    
  }

  createGUI (gui,titleGui) {
    var that = this;
    this.guiControls = new function () {

      this.radiusControl = that.original_radius;
      
      this.reset = function () {
        this.radiusControl = that.original_radius;
      }
    } 
    
    var folder = gui.addFolder (titleGui);
    folder.add (this.guiControls, 'radiusControl', 0.1, 7.0, 0.1).name ('Radio: ').listen();
    
    folder.add (this.guiControls, 'reset').name ('[ Reset ]');
  }
  
  update () {
    this.radius = this.guiControls.radiusControl;
    this.animationUpdate();
    TWEEN.update();
  }
}