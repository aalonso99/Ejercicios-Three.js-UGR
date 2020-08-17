 
class Pendulos extends THREE.Object3D {
  constructor(gui,titleGui) {
    super();

    this.createGUI(gui,titleGui);

    this.defaultXZ = 2.0;
    this.extSizeY = 4.0;

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
    this.downMesh.position.y = this.centreMesh.position.y - this.guiControls.centreSizeY/2 - this.extSizeY/2;
    this.peqMesh.position.set( this.defaultXZ, 1-this.guiControls.peqSizeY/2.0, 0.0 );
    this.nodoPeq = new THREE.Object3D();
    this.nodoPeq.add(this.peqMesh);
    this.nodoPeq.position.y = 1 - this.extSizeY/2 - this.guiControls.centreSizeY*this.guiControls.posPen2 - 1;

    this.add(this.upMesh);
    this.add(this.downMesh);
    this.add(this.centreMesh);
    this.add(this.nodoPeq);

  }
  
  createGUI (gui,titleGui) {
    // Controles para el tamaño, la orientación y la posición de la caja
    this.guiControls = new function () {
      this.centreSizeY = 5.0;
      this.rotation = 0.0;
      this.peqSizeY = 3.0;
      this.posPen2 = 0.1;
      this.rotPen2 = 0.0;

      this.reset = function () {
        this.centreSizeY = 5.0;
        this.rotation = 0.0;
        this.peqSizeY = 3.0;
        this.posPen2 = 0.1; 
        this.rotPen2 = 0.0;
      }
    } 
    
    // Se crea una sección para los controles de la caja
    var folder = gui.addFolder (titleGui);
    // Estas lineas son las que añaden los componentes de la interfaz
    // Las tres cifras indican un valor mínimo, un máximo y el incremento
    // El método   listen()   permite que si se cambia el valor de la variable en código, el deslizador de la interfaz se actualice
    folder.add (this.guiControls, 'centreSizeY', 5.0, 10.0, 0.2).name ('Escala parte central: ').listen();
    folder.add (this.guiControls, 'rotation', -Math.PI/4.0, Math.PI/4.0, 0.1).name ('Rotación péndulo grande: ').listen();
    folder.add (this.guiControls, 'peqSizeY', 3.0, 6.0, 0.1).name ('Tam. péndulo p.: ').listen();
    folder.add (this.guiControls, 'posPen2', 0.1, 0.9, 0.1).name ('Pos. péndulo p.: ').listen();
    folder.add (this.guiControls, 'rotPen2', -Math.PI/4.0, Math.PI/4.0, 0.1).name ('Rot. péndulo p.: ').listen();
    folder.add (this.guiControls, 'reset').name ('[ Reset ]');
  }
  
  update () {
    this.centreMesh.scale.set(1.0, this.guiControls.centreSizeY, 1.0);
    this.centreMesh.position.y = -this.extSizeY/2-this.guiControls.centreSizeY/2;
    this.downMesh.position.y = this.centreMesh.position.y - this.guiControls.centreSizeY/2 - this.extSizeY/2;
    this.nodoPeq.position.y = 1 - this.extSizeY/2 - this.guiControls.centreSizeY*this.guiControls.posPen2 - 1;
    this.peqMesh.position.y = 1 - this.guiControls.peqSizeY/2;
    this.peqMesh.scale.y = this.guiControls.peqSizeY;
    this.rotation.x = this.guiControls.rotation;
    this.nodoPeq.rotation.x = this.guiControls.rotPen2;
  }
}