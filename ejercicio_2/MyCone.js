class MyCone extends THREE.Object3D {
    constructor(gui,titleGui) {
      super();
      
      // Se crea la parte de la interfaz que corresponde a la caja
      // Se crea primero porque otros métodos usan las variables que se definen para la interfaz
      this.createGUI(gui,titleGui);
      
      // Un Mesh se compone de geometría y material
      this.coneGeom = new THREE.ConeGeometry (1,1,3);
      // Como material se crea uno a partir de un color
      this.coneMat = new THREE.MeshNormalMaterial();
      
      // Ya podemos construir el Mesh
      this.cone = new THREE.Mesh (this.coneGeom, this.coneMat);
      // Y añadirlo como hijo del Object3D (el this)
      this.add (this.cone);
    }

    setFlatShading(fS){
      if(this.coneMat.flatShading!=fS){
        this.coneMat.flatShading=fS;
        this.coneMat.needsUpdate=true;
      }
    }
    
    changeGeom(rad,hei,res){
        this.coneGeom.dispose();
        this.coneGeom=new THREE.ConeGeometry(rad,hei,res);
        this.cone.geometry = this.coneGeom;
    }

    createGUI (gui,titleGui) {
      // Controles para el tamaño, la orientación y la posición de la caja
      this.guiControls = new function () {
        this.resol = 3.0;
        this.height = 1.0;
        this.radius = 1.0;
      } 
      
      // Se crea una sección para los controles de la caja
      var folder = gui.addFolder (titleGui);
      // Estas lineas son las que añaden los componentes de la interfaz
      // Las tres cifras indican un valor mínimo, un máximo y el incremento
      // El método   listen()   permite que si se cambia el valor de la variable en código, el deslizador de la interfaz se actualice
      var that=this;
      
      folder.add (this.guiControls, 'radius', 1.0, 5.0, 0.1).name ('Radio : ').listen().onChange(function ( value ) {
                        that.changeGeom(value,that.guiControls.height,that.guiControls.resol);
                  });

      folder.add (this.guiControls, 'height', 1.0, 5.0, 0.1).name ('Altura : ').listen().onChange(function ( value ) {
                        that.changeGeom(that.guiControls.radius,value,that.guiControls.resol);
                  });

      folder.add (this.guiControls, 'resol', 3, 20, 1).name ('Resolución : ').listen().onChange(function ( value ) {
                        that.changeGeom(that.guiControls.radius,that.guiControls.height,value);
                  });
      
    }
    
    update () {
      this.cone.rotation.x+=0.015;
      this.cone.rotation.y+=0.015;
    }
  }