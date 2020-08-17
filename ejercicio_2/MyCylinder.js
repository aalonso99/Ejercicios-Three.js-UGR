class MyCylinder extends THREE.Object3D {
    constructor(gui,titleGui) {
      super();
      
      // Se crea la parte de la interfaz que corresponde a la caja
      // Se crea primero porque otros métodos usan las variables que se definen para la interfaz
      this.createGUI(gui,titleGui);
      
      // Un Mesh se compone de geometría y material
      this.cylinderGeom = new THREE.CylinderGeometry (1,1,1,3);
      // Como material se crea uno a partir de un color
      this.cylinderMat = new THREE.MeshNormalMaterial();
      
      // Ya podemos construir el Mesh
      this.cylinder = new THREE.Mesh (this.cylinderGeom, this.cylinderMat);
      // Y añadirlo como hijo del Object3D (el this)
      this.add (this.cylinder);
    }

    setFlatShading(fS){
      if(this.cylinderMat.flatShading!=fS){
        this.cylinderMat.flatShading=fS;
        this.cylinderMat.needsUpdate=true;
      }
    }
    
    changeGeom(radT,radB,hei,res){
        this.cylinderGeom.dispose();
        this.cylinderGeom=new THREE.CylinderGeometry(radT,radB,hei,res);
        this.cylinder.geometry = this.cylinderGeom;
    }

    createGUI (gui,titleGui) {
      // Controles para el tamaño, la orientación y la posición de la caja
      this.guiControls = new function () {
        this.resol = 3.0;
        this.height = 1.0;
        this.radTop = 1.0;
        this.radBot = 1.0;
      } 
      
      // Se crea una sección para los controles de la caja
      var folder = gui.addFolder (titleGui);
      // Estas lineas son las que añaden los componentes de la interfaz
      // Las tres cifras indican un valor mínimo, un máximo y el incremento
      // El método   listen()   permite que si se cambia el valor de la variable en código, el deslizador de la interfaz se actualice
      var that=this;
      
      folder.add (this.guiControls, 'radTop', 1.0, 5.0, 0.1).name ('Radio Superior: ').listen().onChange(function ( value ) {
                        that.changeGeom(value,that.guiControls.radBot,that.guiControls.height,that.guiControls.resol);
                  });

      folder.add (this.guiControls, 'radBot', 1.0, 5.0, 0.1).name ('Radio Inferior: ').listen().onChange(function ( value ) {
                        that.changeGeom(that.guiControls.radTop,value,that.guiControls.height,that.guiControls.resol);
                  });

      folder.add (this.guiControls, 'height', 1.0, 5.0, 0.1).name ('Altura : ').listen().onChange(function ( value ) {
                        that.changeGeom(that.guiControls.radTop,that.guiControls.radBot,value,that.guiControls.resol);
                  });

      folder.add (this.guiControls, 'resol', 3, 20, 1).name ('Resolución : ').listen().onChange(function ( value ) {
                        that.changeGeom(that.guiControls.radTop,that.guiControls.radBot,that.guiControls.height,value);
                  });
      
    }
    
    update () {
      this.cylinder.rotation.x+=0.015;
      this.cylinder.rotation.y+=0.015;
    }
  }