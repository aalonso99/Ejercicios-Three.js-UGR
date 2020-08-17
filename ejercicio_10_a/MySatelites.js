const PI = Math.PI;

class MySatelites extends THREE.Object3D {
  constructor(camara, gui,titleGui) {

    super();

    this.radius = 0.4, this.clock_radius = 6.0, this.cl_hands_length = this.clock_radius-2*this.radius;
    var geom = new THREE.SphereGeometry( this.radius, 100, 100 );
    var texture_satelites = new THREE.TextureLoader().load('../imgs/cara.jpg');
    var material_satelites = new THREE.MeshPhongMaterial({map:texture_satelites});
    var texture_tierra = new THREE.TextureLoader().load('../imgs/tierra.jpg');
    var material_tierra = new THREE.MeshPhongMaterial({map:texture_tierra});
    this.nodoS1 = new THREE.Object3D();
    this.nodoS2 = new THREE.Object3D();
    this.nodoS3 = new THREE.Object3D();
    this.nodoSistema = new THREE.Object3D();
    this.time;

    this.tierra = new THREE.Mesh( geom, material_tierra );
    this.satelite1 = new THREE.Mesh( geom, material_satelites );
    this.satelite1.rotation.y = -Math.PI/2.0;
    this.nodoS1.add(this.satelite1);
    this.nodoS1.position.x = 1.5;
    this.nodoS1.lookAt(this.tierra.position);

    this.satelite2 = new THREE.Mesh( geom, material_satelites );
    this.satelite2.rotation.y = -Math.PI/2.0;
    this.nodoS2.add(this.satelite2);
    this.nodoS2.position.x = 3.0;
    this.nodoS2.lookAt(camara.position);

    this.satelite3 = new THREE.Mesh( geom, material_satelites );
    this.satelite3.rotation.y = -Math.PI/2.0;
    this.nodoS3.add(this.satelite3);
    this.nodoS3.position.x = 4.5;

    this.nodoSistema.add (this.tierra);
    this.nodoSistema.add (this.nodoS1);
    this.nodoSistema.add (this.nodoS2);
    this.nodoSistema.add (this.nodoS3);
    this.add(this.nodoSistema);

    this.time = Date.now();
    this.animate = () => {
      let dt = Date.now()-this.time;
      this.time = Date.now();
      this.rotation.y += dt*PI/1000.0;
      this.nodoS2.lookAt(camara.position);
      this.nodoS3.rotation.y += dt*PI/1000.0;
    }

    this.createGUI(gui,titleGui);    
    
  }

  createGUI (gui,titleGui) {

    this.guiControls = new function () {

      this.sizeX = 1.0;
      this.sizeY = 1.0;
      this.sizeZ = 1.0; 
      
      this.rotX = 0.0;
      this.rotY = 0.0;
      this.rotZ = 0.0;
      
      this.posX = 0.0;
      this.posY = 0.0;
      this.posZ = 0.0;
      
      this.reset = function () {

        this.sizeX = 1.0;
        this.sizeY = 1.0;
        this.sizeZ = 1.0;
        
        this.rotX = 0.0;
        this.rotY = 0.0;
        this.rotZ = 0.0;
        
        this.posX = 0.0;
        this.posY = 0.0;
        this.posZ = 0.0;

      }
    } 
    
    var folder = gui.addFolder (titleGui);
    
    folder.add (this.guiControls, 'sizeX', 0.1, 5.0, 0.1).name ('Tamaño X : ').listen();
    folder.add (this.guiControls, 'sizeY', 0.1, 5.0, 0.1).name ('Tamaño Y : ').listen();
    folder.add (this.guiControls, 'sizeZ', 0.1, 5.0, 0.1).name ('Tamaño Z : ').listen();

    folder.add (this.guiControls, 'rotX', 0.0, Math.PI/2, 0.1).name ('Rotación X : ').listen();
    folder.add (this.guiControls, 'rotY', 0.0, Math.PI/2, 0.1).name ('Rotación Y : ').listen();
    folder.add (this.guiControls, 'rotZ', 0.0, Math.PI/2, 0.1).name ('Rotación Z : ').listen();
    
    folder.add (this.guiControls, 'posX', -20.0, 20.0, 0.1).name ('Posición X : ').listen();
    folder.add (this.guiControls, 'posY', 0.0, 10.0, 0.1).name ('Posición Y : ').listen();
    folder.add (this.guiControls, 'posZ', -20.0, 20.0, 0.1).name ('Posición Z : ').listen();
    
    folder.add (this.guiControls, 'reset').name ('[ Reset ]');
  }
  
  update () {
    this.scale.set (this.guiControls.sizeX,this.guiControls.sizeY,this.guiControls.sizeZ);
    this.position.set (this.guiControls.posX,this.guiControls.posY,this.guiControls.posZ);
    this.nodoSistema.rotation.set (this.guiControls.rotX,this.guiControls.rotY,this.guiControls.rotZ);
    this.animate();
  }
}