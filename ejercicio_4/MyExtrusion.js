 
class MyExtrusion extends THREE.Object3D {
  //type: 0 -> corazón  1 -> rombo  2 -> trébol
  constructor(gui,titleGui,type) {
    super();
    
    // Se crea la parte de la interfaz que corresponde a la caja
    // Se crea primero porque otros métodos usan las variables que se definen para la interfaz
    this.createGUI(gui,titleGui);
    this.clock = new THREE.Clock();
    
    var shape = new THREE.Shape();
    var extrudeSettings;

    switch(type){
      case 0:
        shape.moveTo( 0, -1 );
        shape.bezierCurveTo( 0, -1, 0.25, -0.65, 0.5, -0.5 );
        shape.bezierCurveTo( 0.5, -0.5, 1.2, 0, 0.5, 0.5 );
        shape.bezierCurveTo( 0.5, 0.5, -0.1, 0.7, 0, 0 );
        shape.bezierCurveTo(  0, 0, 0.1, 0.7, -0.5, 0.5 );
        shape.bezierCurveTo( -0.5, 0.5, -1.2, 0, -0.5, -0.5 );

        var helixPoints = [];

		for ( var i = 0; i < 100; i ++ ) {

			helixPoints.push( new THREE.Vector3( Math.cos(i/20.0), Math.sin(i/20.0), i/50.0 ) );

		}

		var helixSpline = new THREE.CatmullRomCurve3( helixPoints );

        extrudeSettings = { depth: 5, bevelEnabled: false, bevelSegments: 8, steps: 100, bevelSize: 1, bevelThickness: 1, extrudePath: helixSpline };
        break;

      case 1:
        var length = 1.0, width = 0.6;
        shape.moveTo( 0,0 );
        shape.lineTo( 0, width );
        shape.lineTo( length, width );
        shape.lineTo( length, 0 );
        shape.lineTo( 0, 0 );

        extrudeSettings = {
          steps: 100,
          depth: 2,
          bevelEnabled: true,
          bevelThickness: 0.1,
          bevelSize: 0.2,
          bevelOffset: 0,
          bevelSegments: 5
        };
        break;

      case 2:
        shape.moveTo( -0.2, -1 );
        shape.lineTo( 0.2, -1 );
        shape.lineTo( 0.2, -0.4 );
        shape.bezierCurveTo( 0.2, -0.4, 0.6, -0.9, 1.2, -0.4 );
        shape.bezierCurveTo( 1.2, -0.4, 1.6, 0, 1.2, 0.4 );
        shape.bezierCurveTo( 1.2, 0.4, 0.6, 0.9, 0.4, 0.4 );
        shape.bezierCurveTo( 0.4, 0.4, 1.05, 1, 0.4, 1.6 );
        shape.bezierCurveTo( 0.4, 1.6, 0, 1.85, -0.4, 1.6 );
        shape.bezierCurveTo( -0.4, 1.6, -1.05, 0.9, -0.4, 0.4 );
        shape.bezierCurveTo( -0.4, 0.4, -0.6, 0.9, -1.2, 0.4 );
        shape.bezierCurveTo( -1.2, 0.4, -1.6, 0, -1.2, -0.4 );
        shape.bezierCurveTo( -1.2, -0.4, -0.6, -0.9, -0.2, -0.4 );
        shape.lineTo( -0.2, -1 );

        extrudeSettings = { depth: 1, bevelEnabled: true, bevelSegments: 80, steps: 100, bevelSize: 0, bevelThickness: 0.7 };
        break;
    }

    var geometry = new THREE.ExtrudeGeometry( shape, extrudeSettings );
    var material = new THREE.MeshNormalMaterial({flatShading:false});
    material.needsUpdate = true;
    material.side=THREE.DoubleSide;
    this.mesh = new THREE.Mesh( geometry, material );
    this.add( this.mesh );
    
    /*this.changeSegments=function(nSe){
      this.lathe.geometry.dispose();
      this.lathe.geometry=new THREE.LatheGeometry( this.lathe.geometry.parameters.points, nSe, undefined, this.guiControls.angleLength );
    }

    this.changeAngle=function(angle){
      this.lathe.geometry.dispose();
      this.lathe.geometry=new THREE.LatheGeometry( this.lathe.geometry.parameters.points, this.guiControls.nSegments, undefined, angle );
    }*/

  }

  animate(){
      var delta = this.clock.getDelta();
      this.rotateY(delta*Math.PI/2);
  }
  
  createGUI (gui,titleGui) {
    // Controles para el tamaño, la orientación y la posición de la caja
    this.guiControls = new function () {
      this.sizeX = 1.0;
      this.sizeY = 1.0;
      this.sizeZ = 1.0;
      
      // Un botón para dejarlo todo en su posición inicial
      // Cuando se pulse se ejecutará esta función.
      this.reset = function () {
        this.sizeX = 1.0;
        this.sizeY = 1.0;
        this.sizeZ = 1.0;
      }
    } 
    // Se crea una sección para los controles de la caja
    var folder = gui.addFolder (titleGui);
    // Estas lineas son las que añaden los componentes de la interfaz
    // Las tres cifras indican un valor mínimo, un máximo y el incremento
    // El método   listen()   permite que si se cambia el valor de la variable en código, el deslizador de la interfaz se actualice
    folder.add (this.guiControls, 'sizeX', 0.1, 5.0, 0.1).name ('Tamaño X : ').listen();
    folder.add (this.guiControls, 'sizeY', 0.1, 5.0, 0.1).name ('Tamaño Y : ').listen();
    folder.add (this.guiControls, 'sizeZ', 0.1, 5.0, 0.1).name ('Tamaño Z : ').listen();
    
    folder.add (this.guiControls, 'reset').name ('[ Reset ]');
  }
  
  update () {
    this.scale.set (this.guiControls.sizeX,this.guiControls.sizeY,this.guiControls.sizeZ);
    this.animate()
  }
}