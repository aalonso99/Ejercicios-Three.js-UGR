class MyTorus extends THREE.Object3D {
    constructor(gui,titleGui) {
      super();
      
      // Se crea la parte de la interfaz que corresponde a la caja
      // Se crea primero porque otros métodos usan las variables que se definen para la interfaz
      this.createGUI(gui,titleGui);
      
      // Un Mesh se compone de geometría y material
      this.torusGeom = new THREE.TorusGeometry (1,0.2,3,3);
      // Como material se crea uno a partir de un color
      this.torusMat = new THREE.MeshNormalMaterial();
      
      // Ya podemos construir el Mesh
      this.torus = new THREE.Mesh (this.torusGeom, this.torusMat);
      // Y añadirlo como hijo del Object3D (el this)
      this.add (this.torus);
    }
    
    setFlatShading(fS){
      if(this.torusMat.flatShading!=fS){
        this.torusMat.flatShading=fS;
        this.torusMat.needsUpdate=true;
      }
    }

    changeGeom(radP,radT,resTo,resTu){
        this.torusGeom.dispose();
        this.torusGeom=new THREE.TorusGeometry(radP,radT,resTu,resTo);
        this.torus.geometry = this.torusGeom;
    }

    createGUI (gui,titleGui) {
      // Controles para el tamaño, la orientación y la posición de la caja
      this.guiControls = new function () {
        this.resolTorus = 3.0;
        this.resolTube = 3.0;
        this.radPrin = 1.0;
        this.radTube = 0.2;
      } 
      
      // Se crea una sección para los controles de la caja
      var folder = gui.addFolder (titleGui);
      // Estas lineas son las que añaden los componentes de la interfaz
      // Las tres cifras indican un valor mínimo, un máximo y el incremento
      // El método   listen()   permite que si se cambia el valor de la variable en código, el deslizador de la interfaz se actualice
      var that=this;
      
      folder.add (this.guiControls, 'radPrin', 1.0, 5.0, 0.1).name ('Radio Principal: ').listen().onChange(function ( value ) {
                        that.changeGeom(value,that.guiControls.radTube,that.guiControls.resolTorus,that.guiControls.resolTube);
                  });

      folder.add (this.guiControls, 'radTube', 0.2, 1.0, 0.1).name ('Radio Tubo: ').listen().onChange(function ( value ) {
                        that.changeGeom(that.guiControls.radPrin,value,that.guiControls.resolTorus,that.guiControls.resolTube);
                  });

      folder.add (this.guiControls, 'resolTorus', 3, 20, 1).name ('Resolución Toro : ').listen().onChange(function ( value ) {
                        that.changeGeom(that.guiControls.radPrin,that.guiControls.radTube,value,that.guiControls.resolTube);
                  });

      folder.add (this.guiControls, 'resolTube', 3, 20, 1).name ('Resolución Tubo : ').listen().onChange(function ( value ) {
                        that.changeGeom(that.guiControls.radPrin,that.guiControls.radTube,that.guiControls.resolTorus,value);
                  });
      
    }
    
    update () {
      this.torus.rotation.x+=0.015;
      this.torus.rotation.y+=0.015;
    }
  }