class MyScene extends THREE.Scene {
  constructor (myCanvas) {
    super();
    
    this.renderer = this.createRenderer(myCanvas);
    
    this.gui = this.createGUI ();

    this.createLights ();
    
    this.createCamera ();
    
    this.axis = new THREE.AxesHelper (7);
    this.axis.position.set(0,0,0)
    this.add (this.axis);

    this.model = new MySatelites(this.camera, this.gui, "Controles de los satelites");
    this.add (this.model);
  }
  
  createCamera () {

    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

    this.camera.position.set (20, 10, 20);
    var look = new THREE.Vector3 (0,0,0);
    this.camera.lookAt(look);
    this.add (this.camera);
    
    this.cameraControl = new THREE.TrackballControls (this.camera, this.renderer.domElement);

    this.cameraControl.rotateSpeed = 2.5;
    this.cameraControl.zoomSpeed = -2;
    this.cameraControl.panSpeed = 0.5;

    this.cameraControl.target = look;
  }
  
  createGUI () {

    var gui = new dat.GUI();

    this.guiControls = new function() {
      this.lightIntensity = 0.5;
      this.axisOnOff = true;
    }

    var folder = gui.addFolder ('Luz y Ejes');
    
    folder.add (this.guiControls, 'lightIntensity', 0, 1, 0.1).name('Intensidad de la Luz : ');
    
    folder.add (this.guiControls, 'axisOnOff').name ('Mostrar ejes : ');
    
    return gui;

  }
  
  createLights () {

    var ambientLight = new THREE.AmbientLight(0xffffff, 0.35);
    this.add (ambientLight);
    
    this.spotLight = new THREE.SpotLight( 0xffffff, this.guiControls.lightIntensity );
    this.spotLight.position.set( 0, 50, 0 );
    this.add (this.spotLight);
  }
  
  createRenderer (myCanvas) {
    
    var renderer = new THREE.WebGLRenderer();
    
    renderer.setClearColor(new THREE.Color(0xEEEEEE), 1.0);
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    
    $(myCanvas).append(renderer.domElement);
    
    return renderer;  
  }
  
  getCamera () {
    return this.camera;
  }
  
  setCameraAspect (ratio) {

    this.camera.aspect = ratio;
    this.camera.updateProjectionMatrix();
  }
  
  onWindowResize () {

    this.setCameraAspect (window.innerWidth / window.innerHeight);
    
    this.renderer.setSize (window.innerWidth, window.innerHeight);
  }

  update () {

    requestAnimationFrame(() => this.update())
    this.spotLight.intensity = this.guiControls.lightIntensity;
    this.axis.visible = this.guiControls.axisOnOff;
    this.cameraControl.update();
    this.model.update();
    this.renderer.render (this, this.getCamera());

  }
}

/// La función   main
$(function () {

  var scene = new MyScene("#WebGL-output");
  window.addEventListener ("resize", () => scene.onWindowResize());
  scene.update();

});
