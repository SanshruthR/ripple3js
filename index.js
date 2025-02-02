import * as THREE from 'https://esm.sh/three';

export function Ripple3js() {
  console.log('Initializing Ripple Effect...');

  // Loading screen setup 
  const loader = document.createElement('div');
  loader.style.position = 'fixed';
  loader.style.top = '0';
  loader.style.left = '0';
  loader.style.width = '100%';
  loader.style.height = '100%';
  loader.style.backgroundColor = '#000';
  loader.style.display = 'flex';
  loader.style.justifyContent = 'center';
  loader.style.alignItems = 'center';
  loader.style.zIndex = '1000';
  loader.innerHTML = '<div style="color: #fff;</div>';
  document.body.appendChild(loader);

  // Scene/camera setup
  const rippleScene = new THREE.Scene();
  const imageScene = new THREE.Scene();
  const finalScene = new THREE.Scene();

  let width = window.innerWidth;
  let height = window.innerHeight;
  const camera = new THREE.OrthographicCamera(
    width / -2, width / 2, height / 2, height / -2, -1000, 1000
  );
  camera.position.z = 2;

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(width, height);
  renderer.domElement.style.position = 'fixed';
  renderer.domElement.style.top = '0';
  renderer.domElement.style.left = '0';
  renderer.domElement.style.zIndex = '-1';
  document.body.appendChild(renderer.domElement);

  // Mouse/touch handling 
  const mouse = { x: 0, y: 0 };
  const handlePointerMove = (x, y) => {
    mouse.x = x - window.innerWidth / 2;
    mouse.y = window.innerHeight / 2 - y;
  };
  window.addEventListener('mousemove', (e) => handlePointerMove(e.clientX, e.clientY));
  window.addEventListener('touchmove', (e) => handlePointerMove(e.touches[0].clientX, e.touches[0].clientY));

  // Ripple setup
  const maxRipples = 40;
  const rippleMeshes = [];
  const textureLoader = new THREE.TextureLoader();

  
  const brushTexture = textureLoader.load(
    'https://raw.githubusercontent.com/SanshruthR/ripple3js/refs/heads/main/brush.png',
    () => console.log('Brush texture loaded.'),
    undefined,
    (err) => console.error('Error loading brush.png:', err)
  );


  for (let i = 0; i < maxRipples; i++) {
    const mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(120, 120),
      new THREE.MeshBasicMaterial({ map: brushTexture, transparent: true, opacity: 0 })
    );
    mesh.visible = false;
    rippleMeshes.push(mesh);
    rippleScene.add(mesh);
  }


  const vertexShader = `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;
  const fragmentShader = `
    uniform sampler2D uTexture;
    uniform sampler2D uDisplacement;
    uniform vec2 winResolution;
    varying vec2 vUv;
    const float PI = 3.141592653589793238;
    void main() {
      vec2 vUvScreen = gl_FragCoord.xy / winResolution;
      vec4 displacement = texture2D(uDisplacement, vUvScreen);
      float theta = displacement.r * 2.0 * PI;
      vec2 dir = vec2(sin(theta), cos(theta));
      vec2 uv = vUvScreen + dir * displacement.r * 0.075;
      vec4 color = texture2D(uTexture, uv);
      gl_FragColor = color;
    }
  `;
  const shaderMaterial = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      uTexture: { value: null },
      uDisplacement: { value: null },
      winResolution: { value: new THREE.Vector2(width, height) },
    },
    transparent: true,
  });
  const quad = new THREE.Mesh(new THREE.PlaneGeometry(width, height), shaderMaterial);
  finalScene.add(quad);

  // FBO setup 
  let fboBase = new THREE.WebGLRenderTarget(width, height);
  let fboTexture = new THREE.WebGLRenderTarget(width, height);

  // Image planes setup
  const imgElements = Array.from(document.querySelectorAll('img'));
  const imagePlanes = [];

  // Preload textures
  const preloadTextures = () => {
    return Promise.all(imgElements.map(img => new Promise((resolve, reject) => {
      textureLoader.load(img.src, resolve, undefined, reject);
    })));
  };

  preloadTextures().then((textures) => {
    document.body.removeChild(loader);

    
    imgElements.forEach((img, index) => {
      img.style.opacity = '0';
      const rect = img.getBoundingClientRect();
      const geometry = new THREE.PlaneGeometry(rect.width, rect.height);
      const material = new THREE.MeshBasicMaterial({ map: textures[index], transparent: true });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.userData.prevWidth = rect.width;
      mesh.userData.prevHeight = rect.height;
      imageScene.add(mesh);
      imagePlanes.push({ element: img, mesh });
    });

   
    function updateImagePlanes() {
      imagePlanes.forEach(({ element, mesh }) => {
        const rect = element.getBoundingClientRect();
        
       
        const x = rect.left + rect.width/2 - width/2;
        const y = height/2 - rect.top - rect.height/2;
        mesh.position.set(x, y, 0);

       
        if (mesh.userData.prevWidth !== rect.width || mesh.userData.prevHeight !== rect.height) {
          mesh.geometry.dispose();
          mesh.geometry = new THREE.PlaneGeometry(rect.width, rect.height);
          mesh.userData.prevWidth = rect.width;
          mesh.userData.prevHeight = rect.height;
        }
      });
    }

    // Animation loop
    let currentRipple = 0;
    const prevMouse = { x: mouse.x, y: mouse.y };

    function animate() {
      requestAnimationFrame(animate);

   
      updateImagePlanes();

     
      if (Math.abs(mouse.x - prevMouse.x) > 0.1 || Math.abs(mouse.y - prevMouse.y) > 0.1) {
        currentRipple = (currentRipple + 1) % maxRipples;
        const ripple = rippleMeshes[currentRipple];
        ripple.position.set(mouse.x, mouse.y, 0);
        ripple.visible = true;
        ripple.material.opacity = 1;
        ripple.scale.set(1.75, 1.75, 1.75);
      }
      prevMouse.x = mouse.x;
      prevMouse.y = mouse.y;

      rippleMeshes.forEach(mesh => {
        if (mesh.visible) {
          mesh.rotation.z += 0.025;
          mesh.material.opacity *= 0.95;
          mesh.scale.multiplyScalar(0.98).add(new THREE.Vector3(0.155, 0.155, 0));
          if (mesh.material.opacity < 0.01) mesh.visible = false;
        }
      });

     
      renderer.setRenderTarget(fboBase);
      renderer.render(rippleScene, camera);
      renderer.setRenderTarget(fboTexture);
      renderer.render(imageScene, camera);
      shaderMaterial.uniforms.uTexture.value = fboTexture.texture;
      shaderMaterial.uniforms.uDisplacement.value = fboBase.texture;
      renderer.setRenderTarget(null);
      renderer.render(finalScene, camera);
    }

 
    let scrollTimeout;
    window.addEventListener('scroll', () => {
      if (!scrollTimeout) {
        scrollTimeout = requestAnimationFrame(() => {
          updateImagePlanes();
          scrollTimeout = null;
        });
      }
    });


    window.addEventListener('resize', () => {
      width = window.innerWidth;
      height = window.innerHeight;
      camera.left = -width/2;
      camera.right = width/2;
      camera.top = height/2;
      camera.bottom = -height/2;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      shaderMaterial.uniforms.winResolution.value.set(width, height);
      fboBase.setSize(width, height);
      fboTexture.setSize(width, height);
      quad.geometry.dispose();
      quad.geometry = new THREE.PlaneGeometry(width, height);
    });

    animate();
  }).catch(err => console.error('Texture loading failed:', err));
}

window.addEventListener('load', Ripple3js);