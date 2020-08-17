const PI = Math.PI;

class MyBSP extends THREE.Object3D {
  //Type: 0->taza,  1->tuerca
  constructor(gui,titleGui, type) {
    super();
    
    // Se crea la parte de la interfaz que corresponde a la caja
    // Se crea primero porque otros métodos usan las variables que se definen para la interfaz
    this.createGUI(gui,titleGui);
    
    this.mesh;
    this.material = new THREE.MeshNormalMaterial({flatShading:false});
    this.material.needsUpdate = true;
    this.material.side=THREE.DoubleSide;

    switch(type){
      case 0:   //taza
        //Se crean las geometrías
        var cyl1 = new THREE.CylinderGeometry( 0.5, 0.5, 1.2, 70 );
        var cyl2 = new THREE.CylinderGeometry( 0.45, 0.45, 1.1, 70 );
        var asa;
        var puntosAsa = [];
        const d = PI/2;
        for( var i=0; i<11; i++ ){
          puntosAsa.push( new THREE.Vector3( 0.4*Math.cos(i*PI/10+d), 0.4*Math.sin(i*PI/10+d), 0) );
        }
        var splineAsa = new THREE.CatmullRomCurve3( puntosAsa );
        var extrudeSettings = { bevelEnabled: false, steps: 20, extrudePath: splineAsa };
        var circleShape = new THREE.Shape();
        circleShape.moveTo(0.05, 0);
        for( var i=1; i<21; i++ ){
          circleShape.lineTo( 0.05*Math.cos(i*2*PI/20), 0.05*Math.sin(i*2*PI/20) );
        }
        asa = new THREE.ExtrudeGeometry( circleShape, extrudeSettings );

        //Se posicionan y se orientan
        cyl1.translate( 0, 0, 0 );
        cyl2.translate( 0, 0.1, 0 );
        asa.translate( -0.5, 0, 0 );

        //Se construyen nodos ThreeBSP
        var cyl1bsp = new ThreeBSP( cyl1 );
        var cyl2bsp = new ThreeBSP( cyl2 );
        var asabsp = new ThreeBSP( asa );

        //Se construye el árbol binario con las operaciones
        var partialResult = cyl1bsp.subtract(cyl2bsp);
        var finalResult = partialResult.union(asabsp);

        //Se transforma el resultado en un Mesh 
        this.mesh = finalResult.toMesh(this.material);
        this.mesh.geometry.computeFaceNormals();
        this.mesh.geometry.computeVertexNormals();
        
        break;

      case 1:   //tuerca
        //Se crean las geometrías
        var prisma = new THREE.CylinderGeometry( 0.5, 0.5, 0.5, 6 );
        var cyl = new THREE.CylinderGeometry( 0.3, 0.3, 0.5, 70 );
        var sphere = new THREE.SphereGeometry( 0.52, 32, 32 );
        var circleShape = new THREE.Shape();
        circleShape.moveTo(0.005, 0);
        for( var i=1; i<21; i++ ){
          circleShape.lineTo( 0.005*Math.cos(i*2*PI/20), 0.005*Math.sin(i*2*PI/20) );
        }
        var helixPoints = [];
        for ( var i = 0; i < 700; i ++ ) {
          helixPoints.push( new THREE.Vector3( 0.3*Math.cos(i/15.0), i/1400.0, 0.3*Math.sin(i/15.0) ) );
        }
        var helixSpline = new THREE.CatmullRomCurve3( helixPoints );
        extrudeSettings = { depth: 5, bevelEnabled: false, bevelSegments: 8, steps: 200, bevelSize: 1, bevelThickness: 1, extrudePath: helixSpline };
        var helice = new THREE.ExtrudeGeometry( circleShape, extrudeSettings );

        //Se posicionan y se orientan
        prisma.translate( 0, 0, 0 );
        cyl.translate( 0, 0, 0 );
        helice.translate( 0, -0.25, 0 );
        sphere.translate( 0, 0, 0 );

        //Se construyen nodos ThreeBSP
        var prismabsp = new ThreeBSP( prisma );
        var cylbsp = new ThreeBSP( cyl );
        var helicebsp = new ThreeBSP( helice );
        var spherebsp = new ThreeBSP( sphere );

        //Se construye el árbol binario con las operaciones
        var partialResult1 = prismabsp.subtract(cylbsp);
        var partialResult2 = partialResult1.intersect(spherebsp);
        var finalResult = partialResult2.subtract(helicebsp);

        //Se transforma el resultado en un Mesh 
        this.mesh = finalResult.toMesh(this.material);
        //this.mesh2 = new THREE.Mesh(helice, this.material);
        //this.add(this.mesh2);
        this.mesh.geometry.computeFaceNormals();
        this.mesh.geometry.computeVertexNormals();

        break;
    }

    this.add( this.mesh );

  }
  
  createGUI (gui,titleGui) {
    // Controles para el tamaño, la orientación y la posición de la caja
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

      // Un botón para dejarlo todo en su posición inicial
      // Cuando se pulse se ejecutará esta función.
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
    var that=this;
    // Se crea una sección para los controles de la caja
    var folder = gui.addFolder (titleGui);
    // Estas lineas son las que añaden los componentes de la interfaz
    // Las tres cifras indican un valor mínimo, un máximo y el incremento
    // El método   listen()   permite que si se cambia el valor de la variable en código, el deslizador de la interfaz se actualice
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
    this.position.set (this.guiControls.posX,this.guiControls.posY,this.guiControls.posZ);
    this.rotation.set (this.guiControls.rotX,this.guiControls.rotY,this.guiControls.rotZ);
    this.scale.set (this.guiControls.sizeX,this.guiControls.sizeY,this.guiControls.sizeZ);
  }
}