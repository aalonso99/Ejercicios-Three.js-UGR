class MyIcosahedron extends THREE.Object3D {
    constructor(gui,titleGui) {
      super();
      
      // Se crea la parte de la interfaz que corresponde a la caja
      // Se crea primero porque otros métodos usan las variables que se definen para la interfaz
      this.createGUI(gui,titleGui);
      
      // Un Mesh se compone de geometría y material
      this.icosahedronGeom = new THREE.IcosahedronGeometry (1,0);
      // Como material se crea uno a partir de un color
      this.icosahedronMat = new THREE.MeshNormalMaterial();
      
      // Ya podemos construir el Mesh
      this.icosahedron = new THREE.Mesh (this.icosahedronGeom, this.icosahedronMat);
      // Y añadirlo como hijo del Object3D (el this)
      this.add (this.icosahedron);
    }
    
    changeGeom(rad,det){
        this.icosahedronGeom.dispose();
        this.icosahedronGeom=new THREE.IcosahedronGeometry(rad,det);
        this.icosahedron.geometry = this.icosahedronGeom;
    }

    setFlatShading(fS){
      if(this.icosahedronMat.flatShading!=fS){
        this.icosahedronMat.flatShading=fS;
        this.icosahedronMat.needsUpdate=true;
      }
    }

    createGUI (gui,titleGui) {
      // Controles para el tamaño, la orientación y la posición de la caja
      this.guiControls = new function () {
        this.detail=0.0;
        this.radius = 1.0;
      } 
      
      // Se crea una sección para los controles de la caja
      var folder = gui.addFolder (titleGui);
      // Estas lineas son las que añaden los componentes de la interfaz
      // Las tres cifras indican un valor mínimo, un máximo y el incremento
      // El método   listen()   permite que si se cambia el valor de la variable en código, el deslizador de la interfaz se actualice
      var that=this;
      
      folder.add (this.guiControls, 'radius', 1.0, 5.0, 0.1).name ('Radio : ').listen().onChange(function ( value ) {
                        that.changeGeom(value,that.guiControls.detail);
                  });

      folder.add (this.guiControls, 'detail', 0, 3, 1).name ('Subdivisión : ').listen().onChange(function ( value ) {
                        that.changeGeom(that.guiControls.radius,value);
                  });
      
    }
    
    update () {
      this.icosahedron.rotation.x+=0.015;
      this.icosahedron.rotation.y+=0.015;
    }
  }