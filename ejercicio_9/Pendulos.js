const PI = Math.PI;

class Pendulos extends THREE.Object3D {
  constructor(gui,titleGui) {
    super();

    this.createGUI(gui,titleGui);

    this.defaultXZ = 2.0;
    this.extSizeY = 4.0;
    this.maxRotation = Math.PI/4.0;
    this.velocidadGr = this.guiControls.veloc1;
    this.velocidadPeq = this.guiControls.veloc2;
    this.directionGr = 1.0;
    this.directionPeq = 1.0;
    this.rotGr = 0.0;
    this.rotPeq = 0.0;
    this.timeGr;
    this.timePeq;
    this.tiempoRotDefault = PI*1000/2.0;  //Tiempo necesario para recorrer el camino a 1 rad/s
    
    var materialExtremos = new THREE.MeshPhongMaterial ({color: 0x00FF00});
    var materialCentro = new THREE.MeshPhongMaterial ({color: 0xFF0000});
    var materialPeq = new THREE.MeshPhongMaterial ({color: 0x0000CF});
    
    var upBox = new THREE.BoxGeometry (this.defaultXZ, this.extSizeY, this.defaultXZ);
    var downBox = new THREE.BoxGeometry (this.defaultXZ, this.extSizeY, this.defaultXZ);
    var centreBox = new THREE.BoxGeometry (this.defaultXZ, 1.0, this.defaultXZ);
    var peqBox = new THREE.BoxGeometry (this.defaultXZ, 1.0, this.defaultXZ);

    this.upMesh = new THREE.Mesh (upBox, materialExtremos);
    this.downMesh = new THREE.Mesh (downBox, materialExtremos);
    this.centreMesh = new THREE.Mesh (centreBox, materialCentro);
    this.centreMesh.scale.set(1.0, this.guiControls.centreSizeY, 1.0);
    this.peqMesh = new THREE.Mesh (peqBox, materialPeq);
    this.peqMesh.scale.set(1.0, this.guiControls.peqSizeY, 1.0);

    this.centreMesh.position.y = -this.extSizeY/2 - this.guiControls.centreSizeY/2;
    this.downMesh.position.y = this.centreMesh.position.y -
                               this.guiControls.centreSizeY/2 -
                               this.extSizeY/2;
    this.peqMesh.position.set( this.defaultXZ, 1-this.guiControls.peqSizeY/2.0, 0.0 );
    this.nodoGr = new THREE.Object3D();
    this.nodoPeq = new THREE.Object3D();
    this.nodoPeq.add(this.peqMesh);
    this.nodoPeq.position.y = 1 - this.extSizeY/2 -
                              this.guiControls.centreSizeY*this.guiControls.posPen2 - 1;

    this.nodoGr.add(this.upMesh);
    this.nodoGr.add(this.downMesh);
    this.nodoGr.add(this.centreMesh);
    this.nodoGr.add(this.nodoPeq);
    this.add(this.nodoGr);

    var that = this;
    this.timeGr = Date.now();
    this.timePeq = Date.now();
    this.animGrUpdate = () => {
      let dt = Date.now()-that.timeGr;
      that.timeGr = Date.now();
      if(that.guiControls.animGrOn){
        that.rotGr += dt*that.velocidadGr*that.directionGr/that.tiempoRotDefault;
        if( that.rotGr*that.directionGr>that.maxRotation ){
          that.rotGr = that.directionGr*that.maxRotation;
          that.directionGr = -that.directionGr;
        }
        that.nodoGr.rotation.x = that.rotGr;
      }
    }
    this.animPeqUpdate = () => {
      let dt = Date.now()-that.timePeq;
      that.timePeq = Date.now();
      if(that.guiControls.animPeqOn){
        that.rotPeq += dt*that.velocidadPeq*that.directionPeq/that.tiempoRotDefault;
        if( that.rotPeq*that.directionPeq>that.maxRotation ){
          that.rotPeq = that.directionPeq*that.maxRotation;
          that.directionPeq = -that.directionPeq;
        }
        that.nodoPeq.rotation.x = that.rotPeq;
      }
    }

  }
  
  createGUI (gui,titleGui) {
    var that = this;
    this.guiControls = new function () {
      this.centreSizeY = 5.0;
      this.peqSizeY = 3.0;
      this.posPen2 = 0.1;
      this.veloc1 = 0.0;
      this.veloc2 = 0.0;
      this.animGrOn = false;
      this.animPeqOn = false; 

      this.reset = function () {
        this.centreSizeY = 5.0;
        this.peqSizeY = 3.0;
        this.posPen2 = 0.1; 
        this.veloc1 = 0.0;
        this.veloc2 = 0.0;
        that.rotGr = 0.0;
        that.rotPeq = 0.0;
        that.nodoGr.rotation.x = 0.0;
        that.nodoPeq.rotation.x = 0.0; 
        this.animGrOn = false;
        this.animPeqOn = false; 
      }
    } 
    
    var folder = gui.addFolder (titleGui);
    folder.add (this.guiControls, 'centreSizeY', 5.0, 10.0, 0.2).name ('Escala parte central: ').listen();
    folder.add (this.guiControls, 'peqSizeY', 3.0, 6.0, 0.1).name ('Tam. péndulo p.: ').listen();
    folder.add (this.guiControls, 'posPen2', 0.1, 0.9, 0.1).name ('Pos. péndulo p.: ').listen();
    folder.add (this.guiControls, 'animGrOn').name('Anim. péndulo 1').listen();
    folder.add (this.guiControls, 'animPeqOn').name('Anim. péndulo 2').listen();
    folder.add (this.guiControls, 'veloc1', 0.0, 3.0, 0.2).name('Veloc. p. 1').listen();
    folder.add (this.guiControls, 'veloc2', 0.0, 3.0, 0.2).name('Veloc. p. 2').listen();
    folder.add (this.guiControls, 'reset').name ('[ Reset ]');
  }
  
  update () {
    this.centreMesh.scale.set(1.0, this.guiControls.centreSizeY, 1.0);
    this.centreMesh.position.y = -this.extSizeY/2-this.guiControls.centreSizeY/2;
    this.downMesh.position.y = this.centreMesh.position.y - this.guiControls.centreSizeY/2 - this.extSizeY/2;
    this.nodoPeq.position.y = 1 - this.extSizeY/2 - this.guiControls.centreSizeY*this.guiControls.posPen2 - 1;
    this.peqMesh.position.y = 1 - this.guiControls.peqSizeY/2;
    this.velocidadGr = this.guiControls.veloc1;
    this.velocidadPeq = this.guiControls.veloc2;
    this.peqMesh.scale.y = this.guiControls.peqSizeY;
    this.animGrUpdate();
    this.animPeqUpdate();
  }
}