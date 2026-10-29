(function(){
  class V{constructor(x,y,z){this.x=x||0;this.y=y||0;this.z=z||0}set(x,y,z){this.x=x;this.y=y;this.z=z;return this}setScalar(s){this.x=this.y=this.z=s;return this}}
  class C{constructor(h){this.v=h}setScalar(s){this.s=s;return this}convertSRGBToLinear(){return this}setHex(h){this.v=h;return this}setHSL(){return this}getHex(){return this.v||0}}
  class O{constructor(){this.position=new V();this.scale=new V();this.scale.set(1,1,1);this.rotation=new V();this.children=[];this.userData={};this.visible=true;}add(c){this.children.push(c);c.parent=this}remove(c){this.children=this.children.filter(x=>x!==c)}lookAt(){}traverse(f){f(this);this.children.forEach(c=>c.traverse?c.traverse(f):f(c))}}
  class Mat{constructor(o){Object.assign(this,o||{});this.color=new C(o&&o.color);}dispose(){}}
  class Shape{constructor(){this.holes=[]}moveTo(){}lineTo(){}quadraticCurveTo(){}}
  window.THREE={
    Scene:class extends O{}, Group:class extends O{}, Mesh:class extends O{constructor(g,m){super();this.geometry=g;this.material=m||new Mat()}},
    PerspectiveCamera:class extends O{updateProjectionMatrix(){}constructor(f,a){super();this.fov=f||45;this.aspect=a||1;this.up=new V()}},
    WebGLRenderer:class{constructor(){this.domElement=document.createElement('canvas');this.capabilities={getMaxAnisotropy:()=>4}}
      setClearColor(){}setPixelRatio(){}setSize(w,h){this.domElement.width=w;this.domElement.height=h}
      render(scene,cam){ // önizleme: tambur yüzlerini 2D'de izdüşür
        const cv=this.domElement, c=cv.getContext('2d'); if(!c) return; const W=cv.width,H=cv.height; c.fillStyle='#2a160b'; c.fillRect(0,0,W,H);
        const f=(H/2)/Math.tan((cam.fov||42)*Math.PI/360); const items=[];
        const walk=(o,M)=>{ (o.children||[]).forEach(ch=>{ const rx=(M.rx||0); const cy=Math.cos(rx), sy=Math.sin(rx);
            const p=ch.position; const wy=M.y+(p.y*cy - p.z*sy), wz=M.z+(p.y*sy + p.z*cy), wx=M.x+p.x;
            const N={x:wx,y:wy,z:wz,rx:rx+(ch.rotation.x||0)};
            if(ch.material&&ch.material.map&&ch.material.map.canvas&&ch.geometry&&ch.geometry.constructor.name==='PlaneGeometry'&&ch.userData&&ch.userData.k!==undefined){ items.push({ch,N}); }
            walk(ch,N); }); };
        walk(scene,{x:0,y:0,z:0,rx:0});
        items.sort((a,b)=>a.N.z-b.N.z);
        items.forEach(({ch,N})=>{ const nz=Math.cos(N.rx); if(nz<=0.02) return; const d=(cam.position.z-N.z); const sc=f/d;
          const sx=W/2+N.x*sc, sy=H/2-(N.y-(cam.position.y||0))*sc; const hh=1.0*nz*sc, ww=0.9*sc*(ch.scale.x||1);
          c.drawImage(ch.material.map.canvas, sx-ww/2, sy-hh/2, ww, hh*(ch.scale.y||1));
          const b=(ch.material.color&&ch.material.color.s!==undefined)?ch.material.color.s:1; if(b<1){c.fillStyle='rgba(0,0,0,'+(1-Math.min(1,b))+')'; c.fillRect(sx-ww/2, sy-hh/2, ww, hh);} });
        // pencere maskesi (±1.5)
        const sc0=f/(cam.position.z-0.5); const hw=(window.frameH?frameH-1.45:3)/2; const top=H/2-(hw-(cam.position.y||0))*sc0, bot=H/2-(-hw-(cam.position.y||0))*sc0;
        c.fillStyle='#8A5530'; c.fillRect(0,0,W,top); c.fillRect(0,bot,W,H-bot);
      }},
    AmbientLight:class extends O{}, DirectionalLight:class extends O{}, HemisphereLight:class extends O{}, PointLight:class extends O{},
    BoxGeometry:class{dispose(){}}, PlaneGeometry:class{dispose(){}}, SphereGeometry:class{dispose(){}}, CylinderGeometry:class{dispose(){}}, ExtrudeGeometry:class{dispose(){}}, ConeGeometry:class{dispose(){}}, TorusGeometry:class{dispose(){}}, CircleGeometry:class{dispose(){}},
    Fog:class{}, Texture:class{constructor(i){this.image=i}dispose(){}}, RepeatWrapping:1000, BackSide:1, MeshToonMaterial:Mat, MeshPhongMaterial:Mat,
    Shape:Shape, Path:Shape, Color:C,
    MeshStandardMaterial:Mat, MeshBasicMaterial:Mat,
    CanvasTexture:class{constructor(c){this.canvas=c;this.repeat={set(){}};this.offset={x:0,y:0}}dispose(){}}, Vector3:V,
    AdditiveBlending:2, DoubleSide:2, sRGBEncoding:3001,
    MathUtils:{degToRad:d=>d*Math.PI/180}
  };
})();
