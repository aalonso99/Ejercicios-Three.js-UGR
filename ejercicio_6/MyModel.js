 
class MyModel extends THREE.Object3D {
  constructor(gui, titleGui, type) {
    super();
    
    // Se crea la parte de la interfaz que corresponde a la caja
    // Se crea primero porque otros métodos usan las variables que se definen para la interfaz
    this.createGUI(gui,titleGui);
    
    var mtl_path;
    var obj_path;
    switch(type){
      case 0:
        mtl_path = '../models/cerdo.mtl';
        obj_path = '../models/cerdo.obj';
        break; 
        
      case 1:
        mtl_path = '../models/robot.mtl';
        obj_path = '../models/robot.obj';
        break;
    }

    var that = this;
    var materialLoader = new THREE.MTLLoader();
    var objectLoader = new THREE.OBJLoader();
    materialLoader.load(mtl_path, 
      function(materials){
        objectLoader.setMaterials(materials);
        objectLoader.load(obj_path, 
          function(object){
            var modelo = object;
            //console.log(modelo);
            that.add(modelo);
          }, null, null);
      });

  }
  
  createGUI (gui,titleGui) {
    // Controles para el tamaño, la orientación y la posición de la caja
    this.guiControls = new function () {
      this.sizeX = 0.1;
      this.sizeY = 0.1;
      this.sizeZ = 0.1;
      
      this.rotX = 0.0;
      this.rotY = 0.0;
      this.rotZ = 0.0;
      
      this.posX = 0.0;
      this.posY = 0.0;
      this.posZ = 0.0;

      this.nSegments=12;
      this.angleLength=2*Math.PI;
      
      // Un botón para dejarlo todo en su posición inicial
      // Cuando se pulse se ejecutará esta función.
      this.reset = function () {
        this.sizeX = 0.1;
        this.sizeY = 0.1;
        this.sizeZ = 0.1;
        
        this.rotX = 0.0;
        this.rotY = 0.0;
        this.rotZ = 0.0;
        
        this.posX = 0.0;
        this.posY = 0.0;
        this.posZ = 0.0;
      }
    } 
    var that=this;
    // Se crea una sección para los controles de la caja
    var folder = gui.addFolder (titleGui);
    // Estas lineas son las que añaden los componentes de la interfaz
    // Las tres cifras indican un valor mínimo, un máximo y el incremento
    // El método   listen()   permite que si se cambia el valor de la variable en código, el deslizador de la interfaz se actualice
    folder.add (this.guiControls, 'sizeX', 0.1, 5.0, 0.1).name ('Tamaño X : ').listen();
    folder.add (this.guiControls, 'sizeY', 0.1, 5.0, 0.1).name ('Tamaño Y : ').listen();
    folder.add (this.guiControls, 'sizeZ', 0.1, 5.0, 0.1).name ('Tamaño Z : ').listen();
    
    folder.add (this.guiControls, 'rotX', -Math.PI/2, Math.PI/2, 0.1).name ('Rotación X : ').listen();
    folder.add (this.guiControls, 'rotY', -Math.PI/2, Math.PI/2, 0.1).name ('Rotación Y : ').listen();
    folder.add (this.guiControls, 'rotZ', -Math.PI/2, Math.PI/2, 0.1).name ('Rotación Z : ').listen();
    
    folder.add (this.guiControls, 'posX', -20.0, 20.0, 0.1).name ('Posición X : ').listen();
    folder.add (this.guiControls, 'posY', 0.0, 10.0, 0.1).name ('Posición Y : ').listen();
    folder.add (this.guiControls, 'posZ', -20.0, 20.0, 0.1).name ('Posición Z : ').listen();
    
    folder.add (this.guiControls, 'nSegments', 3, 40, 1).name('Número de segmentos: ').onChange(function(par){that.changeSegments(par)})
    folder.add (this.guiControls, 'angleLength', 0.1, 2*Math.PI, 0.1).name('Apertura: ').onChange(function(par){that.changeAngle(par)})

    folder.add (this.guiControls, 'reset').name ('[ Reset ]');
  }
  
  update () {
    this.position.set (this.guiControls.posX,this.guiControls.posY,this.guiControls.posZ);
    this.rotation.set (this.guiControls.rotX,this.guiControls.rotY,this.guiControls.rotZ);
    this.scale.set (this.guiControls.sizeX,this.guiControls.sizeY,this.guiControls.sizeZ);
  }
}