const PI = Math.PI;

class MyRecorrido extends THREE.Object3D {
  constructor(gui,titleGui, camara) {
    super();

    this.modelo;
    var t_1 = { t:0.0 };
    var t_2 = { t:0.0 };
    var t_f = { t:1.0 };
    var points1 = [], points2 = [], radius = 5.0, resol_path = 20;
    var path1, path2;
    
    var mtl_path = '../models/cerdo.mtl';
    var obj_path = '../models/cerdo.obj';
    var that = this;
    var materialLoader = new THREE.MTLLoader();
    var objectLoader = new THREE.OBJLoader();
    materialLoader.load(mtl_path, 
      function(materials){
        objectLoader.setMaterials(materials);
        objectLoader.load(obj_path, 
          function(object){
            that.modelo = object;
            that.modelo.scale.set(0.01,0.01,0.01);
            that.add(that.modelo);
          }, null, null);
      });

    for(let i=0; i<=resol_path; i++){
      points1.push( new THREE.Vector3(radius*Math.cos((resol_path-i)*2*PI/resol_path) - radius,
                                     0,
                                     radius*Math.sin((resol_path-i)*2*PI/resol_path)) )
      points2.push( new THREE.Vector3(radius*Math.cos((i-resol_path/2)*2*PI/resol_path) + radius,
                                     0,
                                     radius*Math.sin((i-resol_path/2)*2*PI/resol_path)) )

    }
    var materialPath = new THREE.LineBasicMaterial( {color:0xff0000} );
    var path1 = new THREE.CatmullRomCurve3(points1);
    var geomLine1 = new THREE.Geometry();
    geomLine1.vertices = path1.getPoints(100);
    var visiblePath1 = new THREE.Line(geomLine1, materialPath);
    this.add(visiblePath1);
    var path2 = new THREE.CatmullRomCurve3(points2);
    var geomLine2 = new THREE.Geometry();
    geomLine2.vertices = path2.getPoints(100);
    var visiblePath2 = new THREE.Line(geomLine2, materialPath);
    this.add(visiblePath2);

    this.anim1 = new TWEEN.Tween(t_1).to(t_f, 4000).easing(TWEEN.Easing.Quadratic.InOut).onUpdate( () => {
      var posicion = path1.getPointAt(t_1.t);
      this.modelo.position.copy(posicion);
      var tangente = path1.getTangentAt(t_1.t);
      posicion.add(tangente);
      this.modelo.lookAt(posicion);
      camara.lookAt(this.modelo.position);
    });
    this.anim2 = new TWEEN.Tween(t_2).to(t_f, 8000).easing(TWEEN.Easing.Quadratic.InOut).onUpdate( () => {
      var posicion = path2.getPointAt(t_2.t);
      this.modelo.position.copy(posicion);
      var tangente = path2.getTangentAt(t_2.t);
      posicion.add(tangente);
      this.modelo.lookAt(posicion);
      camara.lookAt(this.modelo.position);
    }); 
    this.anim1.chain(this.anim2);
    this.anim2.chain(this.anim1);
    this.anim1.delay(1200).start();

  }
    
  update () {
    TWEEN.update();
  }
}