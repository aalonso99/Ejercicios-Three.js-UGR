class MySphere extends THREE.Object3D {
    constructor(gui,titleGui) {
      super();
      
      // Se crea la parte de la interfaz que corresponde a la caja
      // Se crea primero porque otros métodos usan las variables que se definen para la interfaz
      this.createGUI(gui,titleGui);
      
      // Un Mesh se compone de geometría y material
      this.sphereGeom = new THREE.SphereGeometry (1,3,2);
      // Como material se crea uno a partir de un color
      this.sphereMat = new THREE.MeshNormalMaterial();
      
      // Ya podemos construir el Mesh
      this.sphere = new THREE.Mesh (this.sphereGeom, this.sphereMat);
      // Y añadirlo como hijo del Object3D (el this)
      this.add (this.sphere);
    }

    setFlatShading(fS){
      if(this.sphereMat.flatShading!=fS){
        this.sphereMat.flatShading=fS;
        this.sphereMat.needsUpdate=true;
      }
    }
    
    changeGeom(rad,resE,resM){
        this.sphereGeom.dispose();
        this.sphereGeom=new THREE.SphereGeometry(rad,resE,resM);
        this.sphere.geometry = this.sphereGeom;
    }

    createGUI (gui,titleGui) {
      // Controles para el tamaño, la orientación y la posición de la caja
      this.guiControls = new function () {
        this.resMer = 2.0;
        this.resEc = 3.0;
        this.radius = 1.0;
      } 
      
      // Se crea una sección para los controles de la caja
      var folder = gui.addFolder (titleGui);
      // Estas lineas son las que añaden los componentes de la interfaz
      // Las tres cifras indican un valor mínimo, un máximo y el incremento
      // El método   listen()   permite que si se cambia el valor de la variable en código, el deslizador de la interfaz se actualice
      var that=this;
      
      folder.add (this.guiControls, 'radius', 1.0, 5.0, 0.1).name ('Radio : ').listen().onChange(function ( value ) {
                        that.changeGeom(value,that.guiControls.resEc,that.guiControls.resEc);
                  });

      folder.add (this.guiControls, 'resEc', 3, 15, 1).name ('Res. Ecuador : ').listen().onChange(function ( value ) {
                        that.changeGeom(that.guiControls.radius,value,that.guiControls.resMer);
                  });

      folder.add (this.guiControls, 'resMer', 2, 10, 1).name ('Res. Meridiano : ').listen().onChange(function ( value ) {
                        that.changeGeom(that.guiControls.radius,that.guiControls.resEc,value);
                  });
      
    }
    
    update () {
      this.sphere.rotation.x+=0.015;
      this.sphere.rotation.y+=0.015;
    }
  }