const PI = Math.PI;

class MyReloj extends THREE.Object3D {
  constructor(gui,titleGui) {

    super();

    this.radius = 0.4, this.clock_radius = 6.0, this.cl_hands_length = this.clock_radius-2*this.radius;
    var geometries = [], spheres = []; 
    var material = new THREE.MeshNormalMaterial({flatShading:false});
    material.needsUpdate = true;
    var that=this;
    var points = [], resol_path = 100, path;
    var time = Date.now();
    var path_pos = 0.0;
    this.speed = 1.0;
    var looptime = 5000;

    for( let i=0; i<12; i++){
      geometries.push( new THREE.SphereGeometry( this.radius, 100, 100 ) );
      spheres.push( new THREE.Mesh( geometries[i], material ) );
      spheres[i].position.set( this.clock_radius*Math.sin(i*2*PI/12),
                               0,
                               this.clock_radius*Math.cos(i*2*PI/12) );
      this.add(spheres[i]);
    }
    geometries.push( new THREE.SphereGeometry( this.radius, 100, 100 ) );
    spheres.push( new THREE.Mesh( geometries[12], material ) );
    this.add (spheres[12]);

    for(let i=0; i<resol_path; i++){

      points.push( new THREE.Vector3(this.cl_hands_length*Math.sin(i*2*PI/resol_path),
                                     0,
                                     this.cl_hands_length*Math.cos(i*2*PI/resol_path)) )

    }
    path = new THREE.CatmullRomCurve3(points);

    this.animationUpdate = () => {
      let dt = Date.now()-time;
      time = Date.now();
      let dpath_pos = (dt%looptime)/looptime; 
      path_pos = (path_pos+dpath_pos*that.speed)%1;
      if(path_pos<0){
        path_pos += 1.0;
      }
      let p = path.getPointAt( path_pos );
      spheres[12].position.set(p.x, p.y, p.z); 
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

      this.clock_speed = 1.0;
      
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

        this.clock_speed = 1.0;
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

    folder.add (this.guiControls, 'clock_speed', -5.0, 5.0, 1.0).name ('Speed : ').listen();
    
    folder.add (this.guiControls, 'reset').name ('[ Reset ]');
  }
  
  update () {
    this.scale.set (this.guiControls.sizeX,this.guiControls.sizeY,this.guiControls.sizeZ);
    this.position.set (this.guiControls.posX,this.guiControls.posY,this.guiControls.posZ);
    this.rotation.set (this.guiControls.rotX,this.guiControls.rotY,this.guiControls.rotZ);
    this.speed = this.guiControls.clock_speed;
    this.animationUpdate();
  }
}