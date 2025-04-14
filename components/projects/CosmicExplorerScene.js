import { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { FlyControls } from 'three/examples/jsm/controls/FlyControls';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';

const CosmicExplorerScene = ({ setActiveObject, controlMode }) => {
  const canvasRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const composerRef = useRef(null);
  const orbitControlsRef = useRef(null);
  const flyControlsRef = useRef(null);
  const objectsRef = useRef({});
  const raycasterRef = useRef(new THREE.Raycaster());
  const mouseRef = useRef(new THREE.Vector2());
  
  // Initialize scene
  useEffect(() => {
    if (!canvasRef.current) return;
    
    // Create scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000005);
    scene.fog = new THREE.FogExp2(0x000005, 0.00025);
    sceneRef.current = scene;
    
    // Create camera
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 50);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;
    
    // Create renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    rendererRef.current = renderer;
    
    // Create post-processing
    const composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);
    
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      1.5, // strength
      0.4, // radius
      0.85 // threshold
    );
    composer.addPass(bloomPass);
    
    // Add custom shader for space atmosphere
    const spaceShader = {
      uniforms: {
        tDiffuse: { value: null },
        time: { value: 0 }
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D tDiffuse;
        uniform float time;
        varying vec2 vUv;
        
        void main() {
          vec4 color = texture2D(tDiffuse, vUv);
          
          // Add subtle color shift based on position and time
          float r = color.r + 0.03 * sin(vUv.x * 10.0 + time * 0.1);
          float g = color.g + 0.03 * sin(vUv.y * 10.0 + time * 0.15);
          float b = color.b + 0.03 * sin((vUv.x + vUv.y) * 5.0 + time * 0.2);
          
          gl_FragColor = vec4(r, g, b, color.a);
        }
      `
    };
    
    const spacePass = new ShaderPass(spaceShader);
    composer.addPass(spacePass);
    
    composerRef.current = composer;
    
    // Create controls
    const orbitControls = new OrbitControls(camera, renderer.domElement);
    orbitControls.enableDamping = true;
    orbitControls.dampingFactor = 0.05;
    orbitControls.rotateSpeed = 0.5;
    orbitControls.zoomSpeed = 0.5;
    orbitControls.minDistance = 5;
    orbitControls.maxDistance = 100;
    orbitControlsRef.current = orbitControls;
    
    const flyControls = new FlyControls(camera, renderer.domElement);
    flyControls.movementSpeed = 10;
    flyControls.rollSpeed = 0.1;
    flyControls.autoForward = false;
    flyControls.dragToLook = true;
    flyControls.enabled = false;
    flyControlsRef.current = flyControls;
    
    // Create starfield
    createStarfield(scene);
    
    // Create cosmic objects
    createCosmicObjects(scene);
    
    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      composer.setSize(window.innerWidth, window.innerHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Handle mouse move for object selection
    const handleMouseMove = (event) => {
      mouseRef.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    // Animation loop
    const clock = new THREE.Clock();
    
    const animate = () => {
      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();
      
      // Update controls based on mode
      if (controlMode === 'orbit') {
        orbitControlsRef.current.enabled = true;
        flyControlsRef.current.enabled = false;
        orbitControlsRef.current.update();
      } else {
        orbitControlsRef.current.enabled = false;
        flyControlsRef.current.enabled = true;
        flyControlsRef.current.update(delta);
      }
      
      // Update shader uniforms
      spacePass.uniforms.time.value = elapsedTime;
      
      // Update cosmic objects
      updateCosmicObjects(elapsedTime);
      
      // Check for object intersection
      raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current);
      const intersects = raycasterRef.current.intersectObjects(Object.values(objectsRef.current));
      
      if (intersects.length > 0) {
        const object = intersects[0].object;
        document.body.style.cursor = 'pointer';
        
        // Find the object ID
        for (const [id, obj] of Object.entries(objectsRef.current)) {
          if (obj === object || (obj.children && obj.children.includes(object))) {
            setActiveObject(id);
            break;
          }
        }
      } else {
        document.body.style.cursor = 'auto';
      }
      
      // Render
      composerRef.current.render();
      
      requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      
      // Dispose resources
      renderer.dispose();
      orbitControls.dispose();
      
      // Reset cursor
      document.body.style.cursor = 'auto';
    };
  }, [setActiveObject, controlMode]);
  
  // Create starfield with different star layers
  const createStarfield = (scene) => {
    // Distant stars (small, numerous)
    const distantStarGeometry = new THREE.BufferGeometry();
    const distantStarCount = 10000;
    const distantStarPositions = new Float32Array(distantStarCount * 3);
    const distantStarColors = new Float32Array(distantStarCount * 3);
    const distantStarSizes = new Float32Array(distantStarCount);
    
    for (let i = 0; i < distantStarCount; i++) {
      // Position
      distantStarPositions[i * 3] = (Math.random() - 0.5) * 2000;
      distantStarPositions[i * 3 + 1] = (Math.random() - 0.5) * 2000;
      distantStarPositions[i * 3 + 2] = (Math.random() - 0.5) * 2000;
      
      // Color (mostly white with slight variations)
      const r = 0.8 + Math.random() * 0.2;
      const g = 0.8 + Math.random() * 0.2;
      const b = 0.8 + Math.random() * 0.2;
      
      distantStarColors[i * 3] = r;
      distantStarColors[i * 3 + 1] = g;
      distantStarColors[i * 3 + 2] = b;
      
      // Size
      distantStarSizes[i] = Math.random() * 0.5 + 0.1;
    }
    
    distantStarGeometry.setAttribute('position', new THREE.BufferAttribute(distantStarPositions, 3));
    distantStarGeometry.setAttribute('color', new THREE.BufferAttribute(distantStarColors, 3));
    distantStarGeometry.setAttribute('size', new THREE.BufferAttribute(distantStarSizes, 1));
    
    const distantStarMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        pixelRatio: { value: Math.min(window.devicePixelRatio, 2) }
      },
      vertexShader: `
        attribute float size;
        attribute vec3 color;
        varying vec3 vColor;
        uniform float time;
        uniform float pixelRatio;
        
        void main() {
          vColor = color;
          
          // Slight twinkling effect
          float twinkle = sin(time * 0.5 + position.x * 0.1 + position.y * 0.1 + position.z * 0.1) * 0.5 + 0.5;
          
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size * pixelRatio * (150.0 / -mvPosition.z) * (0.8 + twinkle * 0.4);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        
        void main() {
          float distanceToCenter = length(gl_PointCoord - vec2(0.5));
          float strength = 1.0 - (distanceToCenter * 2.0);
          
          if (strength < 0.0) discard;
          
          gl_FragColor = vec4(vColor, strength);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexColors: true
    });
    
    const distantStars = new THREE.Points(distantStarGeometry, distantStarMaterial);
    scene.add(distantStars);
    
    // Closer, brighter stars
    const brightStarGeometry = new THREE.BufferGeometry();
    const brightStarCount = 200;
    const brightStarPositions = new Float32Array(brightStarCount * 3);
    const brightStarColors = new Float32Array(brightStarCount * 3);
    const brightStarSizes = new Float32Array(brightStarCount);
    
    // Color options for bright stars
    const brightStarColorOptions = [
      new THREE.Color(0xFFFFFF), // White
      new THREE.Color(0xFFD9D9), // Slightly red
      new THREE.Color(0xD9FFFF), // Slightly blue
      new THREE.Color(0xFFFFD9)  // Slightly yellow
    ];
    
    for (let i = 0; i < brightStarCount; i++) {
      // Position
      brightStarPositions[i * 3] = (Math.random() - 0.5) * 500;
      brightStarPositions[i * 3 + 1] = (Math.random() - 0.5) * 500;
      brightStarPositions[i * 3 + 2] = (Math.random() - 0.5) * 500;
      
      // Color
      const color = brightStarColorOptions[Math.floor(Math.random() * brightStarColorOptions.length)];
      brightStarColors[i * 3] = color.r;
      brightStarColors[i * 3 + 1] = color.g;
      brightStarColors[i * 3 + 2] = color.b;
      
      // Size
      brightStarSizes[i] = Math.random() * 2 + 1;
    }
    
    brightStarGeometry.setAttribute('position', new THREE.BufferAttribute(brightStarPositions, 3));
    brightStarGeometry.setAttribute('color', new THREE.BufferAttribute(brightStarColors, 3));
    brightStarGeometry.setAttribute('size', new THREE.BufferAttribute(brightStarSizes, 1));
    
    const brightStarMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        pixelRatio: { value: Math.min(window.devicePixelRatio, 2) }
      },
      vertexShader: `
        attribute float size;
        attribute vec3 color;
        varying vec3 vColor;
        uniform float time;
        uniform float pixelRatio;
        
        void main() {
          vColor = color;
          
          // More pronounced twinkling for bright stars
          float twinkle = sin(time + position.x * 0.05 + position.y * 0.05 + position.z * 0.05) * 0.5 + 0.5;
          
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size * pixelRatio * (300.0 / -mvPosition.z) * (0.7 + twinkle * 0.6);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        
        void main() {
          float distanceToCenter = length(gl_PointCoord - vec2(0.5));
          float strength = 1.0 - (distanceToCenter * 2.0);
          
          // Add glow effect
          strength = pow(strength, 1.5);
          
          if (strength < 0.0) discard;
          
          gl_FragColor = vec4(vColor, strength);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexColors: true
    });
    
    const brightStars = new THREE.Points(brightStarGeometry, brightStarMaterial);
    scene.add(brightStars);
  };
  
  // Create cosmic objects (nebulae, galaxies, etc.)
  const createCosmicObjects = (scene) => {
    // Eagle Nebula
    const eagleNebula = createNebula(
      [0xFF9999, 0xFF5555, 0xFFAAAA],
      [30, 25, 20],
      [0.3, 0.4, 0.5]
    );
    eagleNebula.position.set(-30, 15, -50);
    scene.add(eagleNebula);
    objectsRef.current.nebula1 = eagleNebula;
    
    // Andromeda Galaxy
    const andromedaGalaxy = createGalaxy(
      0xFFFFFF,
      0x8888FF,
      20000,
      20,
      2.5,
      0.5
    );
    andromedaGalaxy.position.set(50, -20, -100);
    andromedaGalaxy.rotation.x = Math.PI / 6;
    scene.add(andromedaGalaxy);
    objectsRef.current.galaxy1 = andromedaGalaxy;
    
    // Black Hole
    const blackHole = createBlackHole(5, 15);
    blackHole.position.set(-10, -15, -30);
    scene.add(blackHole);
    objectsRef.current.blackhole1 = blackHole;
    
    // Star Cluster
    const starCluster = createStarCluster(500, 15);
    starCluster.position.set(20, 30, -60);
    scene.add(starCluster);
    objectsRef.current.cluster1 = starCluster;
  };
  
  // Create a nebula using multiple particle systems
  const createNebula = (colors, sizes, opacities) => {
    const nebulaGroup = new THREE.Group();
    
    for (let i = 0; i < colors.length; i++) {
      const particleCount = 5000;
      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(particleCount * 3);
      
      // Create cloud-like distribution
      for (let j = 0; j < particleCount; j++) {
        // Use gaussian-like distribution
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const r = sizes[i] * Math.pow(Math.random(), 0.3);
        
        positions[j * 3] = r * Math.sin(phi) * Math.cos(theta);
        positions[j * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
        positions[j * 3 + 2] = r * Math.cos(phi);
      }
      
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      
      const material = new THREE.PointsMaterial({
        color: new THREE.Color(colors[i]),
        size: 0.5,
        transparent: true,
        opacity: opacities[i],
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });
      
      const particles = new THREE.Points(geometry, material);
      nebulaGroup.add(particles);
    }
    
    return nebulaGroup;
  };
  
  // Create a spiral galaxy
  const createGalaxy = (coreColor, armColor, particleCount, radius, armCount, armWidth) => {
    const galaxyGroup = new THREE.Group();
    
    // Galaxy particles
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    const coreColorObj = new THREE.Color(coreColor);
    const armColorObj = new THREE.Color(armColor);
    
    for (let i = 0; i < particleCount; i++) {
      // Calculate position in galaxy
      const distance = Math.random() * radius;
      const angle = distance * 0.3 + Math.random() * armWidth;
      
      const armAngle = (Math.floor(Math.random() * armCount) / armCount) * Math.PI * 2;
      const spiralAngle = angle + armAngle;
      
      positions[i * 3] = Math.cos(spiralAngle) * distance;
      positions[i * 3 + 1] = (Math.random() - 0.5) * distance * 0.2;
      positions[i * 3 + 2] = Math.sin(spiralAngle) * distance;
      
      // Color based on distance from center
      const mixRatio = distance / radius;
      const color = new THREE.Color().lerpColors(coreColorObj, armColorObj, mixRatio);
      
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const material = new THREE.PointsMaterial({
      size: 0.1,
      transparent: true,
      opacity: 0.8,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    
    const galaxyParticles = new THREE.Points(geometry, material);
    galaxyGroup.add(galaxyParticles);
    
    // Galaxy core glow
    const coreGeometry = new THREE.SphereGeometry(radius * 0.1, 32, 32);
    const coreMaterial = new THREE.MeshBasicMaterial({
      color: coreColor,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });
    
    const core = new THREE.Mesh(coreGeometry, coreMaterial);
    galaxyGroup.add(core);
    
    return galaxyGroup;
  };
  
  // Create a black hole
  const createBlackHole = (radius, discRadius) => {
    const blackHoleGroup = new THREE.Group();
    
    // Event horizon (black sphere)
    const horizonGeometry = new THREE.SphereGeometry(radius, 32, 32);
    const horizonMaterial = new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.9
    });
    
    const horizon = new THREE.Mesh(horizonGeometry, horizonMaterial);
    blackHoleGroup.add(horizon);
    
    // Accretion disc
    const discGeometry = new THREE.RingGeometry(radius * 1.2, discRadius, 64);
    const discMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 }
      },
      vertexShader: `
        varying vec2 vUv;
        
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        varying vec2 vUv;
        
        void main() {
          float r = length(vUv - vec2(0.5));
          
          // Radial gradient
          float intensity = smoothstep(0.0, 0.5, 1.0 - r * 2.0);
          
          // Rotating color pattern
          float angle = atan(vUv.y - 0.5, vUv.x - 0.5);
          float pattern = sin(angle * 20.0 + time * 0.5 + r * 20.0) * 0.5 + 0.5;
          
          // Hot inner part, cooler outer part
          vec3 innerColor = vec3(1.0, 0.5, 0.0); // Orange
          vec3 outerColor = vec3(0.6, 0.0, 1.0);  // Purple
          vec3 color = mix(innerColor, outerColor, r * 2.0);
          
          // Apply pattern and intensity
          color *= pattern * intensity;
          
          gl_FragColor = vec4(color, intensity * 0.7);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    
    const disc = new THREE.Mesh(discGeometry, discMaterial);
    disc.rotation.x = Math.PI / 2;
    blackHoleGroup.add(disc);
    
    // Gravitational lensing effect (distortion sphere)
    const lensGeometry = new THREE.SphereGeometry(radius * 2, 32, 32);
    const lensMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 }
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        
        void main() {
          vNormal = normal;
          vPosition = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        varying vec3 vNormal;
        varying vec3 vPosition;
        
        void main() {
          float fresnel = pow(1.0 - abs(dot(normalize(vNormal), vec3(0.0, 0.0, 1.0))), 3.0);
          vec3 color = vec3(0.0, 0.1, 0.2) * fresnel;
          
          gl_FragColor = vec4(color, fresnel * 0.3);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    
    const lens = new THREE.Mesh(lensGeometry, lensMaterial);
    blackHoleGroup.add(lens);
    
    return blackHoleGroup;
  };
  
  // Create a star cluster
  const createStarCluster = (starCount, radius) => {
    const clusterGroup = new THREE.Group();
    
    // Star colors
    const starColors = [
      0xFFFFFF, // White
      0xFFEEDD, // Warm white
      0xDDEEFF, // Cool white
      0xFFDDAA, // Yellow-white
      0xAADDFF  // Blue-white
    ];
    
    // Create stars
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);
    const sizes = new Float32Array(starCount);
    
    for (let i = 0; i < starCount; i++) {
      // Position with cluster concentration toward center
      const distance = Math.pow(Math.random(), 2) * radius;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      positions[i * 3] = distance * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = distance * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = distance * Math.cos(phi);
      
      // Color
      const color = new THREE.Color(starColors[Math.floor(Math.random() * starColors.length)]);
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
      
      // Size (larger stars toward center)
      const sizeFactor = 1 - (distance / radius);
      sizes[i] = (Math.random() * 0.5 + 0.5) * sizeFactor + 0.1;
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    
    const material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        pixelRatio: { value: Math.min(window.devicePixelRatio, 2) }
      },
      vertexShader: `
        attribute float size;
        attribute vec3 color;
        varying vec3 vColor;
        uniform float time;
        uniform float pixelRatio;
        
        void main() {
          vColor = color;
          
          // Subtle twinkling
          float twinkle = sin(time * 2.0 + position.x * 10.0 + position.y * 8.0 + position.z * 6.0) * 0.5 + 0.5;
          
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size * pixelRatio * (200.0 / -mvPosition.z) * (0.8 + twinkle * 0.4);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        
        void main() {
          float distanceToCenter = length(gl_PointCoord - vec2(0.5));
          float strength = 1.0 - (distanceToCenter * 2.0);
          
          // Star glow
          strength = pow(strength, 1.5);
          
          if (strength < 0.0) discard;
          
          gl_FragColor = vec4(vColor, strength);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexColors: true
    });
    
    const stars = new THREE.Points(geometry, material);
    clusterGroup.add(stars);
    
    // Add cluster glow
    const glowGeometry = new THREE.SphereGeometry(radius * 0.8, 32, 32);
    const glowMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 }
      },
      vertexShader: `
        varying vec3 vPosition;
        uniform float time;
        
        void main() {
          vPosition = position;
          
          // Subtle pulsing
          float pulse = sin(time * 0.5) * 0.05 + 1.0;
          vec3 pos = position * pulse;
          
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vPosition;
        uniform float time;
        
        void main() {
          float r = length(vPosition) / 5.0;
          float alpha = (1.0 - r) * 0.1;
          
          vec3 color = vec3(0.6, 0.8, 1.0);
          
          gl_FragColor = vec4(color, alpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.BackSide
    });
    
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    clusterGroup.add(glow);
    
    return clusterGroup;
  };
  
  // Update cosmic objects animations
  const updateCosmicObjects = (time) => {
    // Update nebula
    if (objectsRef.current.nebula1) {
      objectsRef.current.nebula1.rotation.y = time * 0.05;
      objectsRef.current.nebula1.rotation.z = time * 0.03;
      
      // Pulse effect
      const pulse = Math.sin(time * 0.2) * 0.05 + 1;
      objectsRef.current.nebula1.scale.set(pulse, pulse, pulse);
    }
    
    // Update galaxy
    if (objectsRef.current.galaxy1) {
      objectsRef.current.galaxy1.rotation.z = time * 0.1;
    }
    
    // Update black hole
    if (objectsRef.current.blackhole1) {
      // Update shader uniforms for accretion disc
      const disc = objectsRef.current.blackhole1.children[1];
      if (disc.material.uniforms) {
        disc.material.uniforms.time.value = time;
      }
      
      // Update shader uniforms for gravitational lens
      const lens = objectsRef.current.blackhole1.children[2];
      if (lens.material.uniforms) {
        lens.material.uniforms.time.value = time;
      }
      
      // Rotate the black hole
      objectsRef.current.blackhole1.rotation.z = time * 0.2;
    }
    
    // Update star cluster
    if (objectsRef.current.cluster1) {
      // Update shader uniforms for stars
      const stars = objectsRef.current.cluster1.children[0];
      if (stars.material.uniforms) {
        stars.material.uniforms.time.value = time;
      }
      
      // Update shader uniforms for glow
      const glow = objectsRef.current.cluster1.children[1];
      if (glow.material.uniforms) {
        glow.material.uniforms.time.value = time;
      }
      
      // Rotate the cluster
      objectsRef.current.cluster1.rotation.y = time * 0.05;
    }
  };
  
  return <canvas ref={canvasRef} className="w-full h-full" />;
};

export default CosmicExplorerScene;
