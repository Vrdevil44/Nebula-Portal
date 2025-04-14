import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer';

const OrbitSimulation = ({ 
  mode, 
  timeScale, 
  showOrbits, 
  showLabels, 
  viewMode, 
  customBodies,
  onBodySelect 
}) => {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const labelRendererRef = useRef(null);
  const controlsRef = useRef(null);
  const bodiesRef = useRef([]);
  const orbitsRef = useRef([]);
  const animationFrameRef = useRef(null);
  const clockRef = useRef(new THREE.Clock());
  
  // Physics constants
  const G = 6.67430e-11; // Gravitational constant
  const AU = 149.6e9; // 1 AU in meters
  const SCALE_FACTOR = 1 / AU * 10; // Scale down to reasonable size
  const TIME_STEP = 3600 * 24; // 1 day in seconds
  
  // Initialize simulation
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Initialize Three.js scene
    initScene();
    
    // Add celestial bodies based on selected mode
    initBodies();
    
    // Start animation loop
    startAnimation();
    
    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current || !cameraRef.current || !rendererRef.current || !labelRendererRef.current) return;
      
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      
      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
      
      rendererRef.current.setSize(width, height);
      labelRendererRef.current.setSize(width, height);
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameRef.current);
      
      // Clean up Three.js resources
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
      
      if (sceneRef.current) {
        sceneRef.current.traverse((object) => {
          if (object.geometry) {
            object.geometry.dispose();
          }
          
          if (object.material) {
            if (Array.isArray(object.material)) {
              object.material.forEach(material => material.dispose());
            } else {
              object.material.dispose();
            }
          }
        });
      }
    };
  }, []);
  
  // Update when mode changes
  useEffect(() => {
    if (!sceneRef.current) return;
    
    // Clear existing bodies and orbits
    clearBodies();
    
    // Initialize new bodies based on mode
    initBodies();
    
    // Reset clock
    clockRef.current.start();
  }, [mode, customBodies]);
  
  // Update when view mode changes
  useEffect(() => {
    if (!cameraRef.current) return;
    
    if (viewMode === '2d') {
      // Set camera to top-down view
      cameraRef.current.position.set(0, 50, 0);
      cameraRef.current.lookAt(0, 0, 0);
      
      // Restrict orbit controls to rotate only around y-axis
      if (controlsRef.current) {
        controlsRef.current.minPolarAngle = 0;
        controlsRef.current.maxPolarAngle = Math.PI / 4;
      }
    } else {
      // Reset to 3D view
      cameraRef.current.position.set(30, 20, 30);
      cameraRef.current.lookAt(0, 0, 0);
      
      // Allow full orbit control
      if (controlsRef.current) {
        controlsRef.current.minPolarAngle = 0;
        controlsRef.current.maxPolarAngle = Math.PI;
      }
    }
  }, [viewMode]);
  
  // Update orbit visibility
  useEffect(() => {
    if (!orbitsRef.current) return;
    
    orbitsRef.current.forEach(orbit => {
      orbit.visible = showOrbits;
    });
  }, [showOrbits]);
  
  // Update label visibility
  useEffect(() => {
    if (!bodiesRef.current) return;
    
    bodiesRef.current.forEach(body => {
      if (body.label) {
        body.label.visible = showLabels;
      }
    });
  }, [showLabels]);
  
  // Initialize Three.js scene
  const initScene = () => {
    // Create scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000005);
    sceneRef.current = scene;
    
    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0x333333);
    scene.add(ambientLight);
    
    // Add directional light (sun)
    const sunLight = new THREE.PointLight(0xffffff, 1.5);
    sunLight.position.set(0, 0, 0);
    scene.add(sunLight);
    
    // Create starfield background
    createStarfield();
    
    // Create camera
    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(30, 20, 30);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;
    
    // Create WebGL renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;
    
    // Create CSS2D renderer for labels
    const labelRenderer = new CSS2DRenderer();
    labelRenderer.setSize(width, height);
    labelRenderer.domElement.style.position = 'absolute';
    labelRenderer.domElement.style.top = '0';
    labelRenderer.domElement.style.pointerEvents = 'none';
    containerRef.current.appendChild(labelRenderer.domElement);
    labelRendererRef.current = labelRenderer;
    
    // Add orbit controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.minDistance = 5;
    controls.maxDistance = 100;
    controlsRef.current = controls;
  };
  
  // Create starfield background
  const createStarfield = () => {
    const starCount = 2000;
    const starGeometry = new THREE.BufferGeometry();
    const starMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.1,
      transparent: true,
      opacity: 0.8,
      sizeAttenuation: true
    });
    
    const starPositions = [];
    const starColors = [];
    
    for (let i = 0; i < starCount; i++) {
      // Create stars in a sphere around the scene
      const theta = 2 * Math.PI * Math.random();
      const phi = Math.acos(2 * Math.random() - 1);
      const radius = 100 + Math.random() * 100;
      
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);
      
      starPositions.push(x, y, z);
      
      // Random star colors (mostly white, some blue/red)
      const colorChoice = Math.random();
      if (colorChoice > 0.95) {
        // Blue-ish
        starColors.push(0.8, 0.8, 1);
      } else if (colorChoice > 0.9) {
        // Red-ish
        starColors.push(1, 0.8, 0.8);
      } else {
        // White-ish with slight variations
        const shade = 0.8 + Math.random() * 0.2;
        starColors.push(shade, shade, shade);
      }
    }
    
    starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starPositions, 3));
    starGeometry.setAttribute('color', new THREE.Float32BufferAttribute(starColors, 3));
    starMaterial.vertexColors = true;
    
    const stars = new THREE.Points(starGeometry, starMaterial);
    sceneRef.current.add(stars);
  };
  
  // Initialize celestial bodies based on selected mode
  const initBodies = () => {
    switch (mode) {
      case 'solar-system':
        createSolarSystem();
        break;
      case 'exoplanets':
        createExoplanetSystem();
        break;
      case 'binary-stars':
        createBinaryStarSystem();
        break;
      case 'custom':
        createCustomSystem();
        break;
      default:
        createSolarSystem();
    }
  };
  
  // Create solar system simulation
  const createSolarSystem = () => {
    // Solar system data (mass in kg, radius in km, distance in AU, velocity in km/s)
    const solarSystemData = [
      {
        name: 'Sun',
        mass: 1.989e30,
        radius: 696340,
        position: new THREE.Vector3(0, 0, 0),
        velocity: new THREE.Vector3(0, 0, 0),
        color: 0xffff00,
        emissive: true,
        massUnit: 'kg',
        radiusUnit: 'km',
        description: 'The star at the center of our Solar System.'
      },
      {
        name: 'Mercury',
        mass: 3.3011e23,
        radius: 2439.7,
        position: new THREE.Vector3(0.387, 0, 0),
        velocity: new THREE.Vector3(0, 0, 47.87),
        color: 0x8c8c8c,
        massUnit: 'kg',
        radiusUnit: 'km',
        description: 'The smallest and innermost planet in the Solar System.'
      },
      {
        name: 'Venus',
        mass: 4.8675e24,
        radius: 6051.8,
        position: new THREE.Vector3(0.723, 0, 0),
        velocity: new THREE.Vector3(0, 0, 35.02),
        color: 0xe6e6b8,
        massUnit: 'kg',
        radiusUnit: 'km',
        description: 'The second planet from the Sun, known for its thick atmosphere.'
      },
      {
        name: 'Earth',
        mass: 5.972e24,
        radius: 6371,
        position: new THREE.Vector3(1, 0, 0),
        velocity: new THREE.Vector3(0, 0, 29.78),
        color: 0x2b82bd,
        massUnit: 'kg',
        radiusUnit: 'km',
        description: 'Our home planet, the only known celestial body to support life.'
      },
      {
        name: 'Mars',
        mass: 6.4171e23,
        radius: 3389.5,
        position: new THREE.Vector3(1.524, 0, 0),
        velocity: new THREE.Vector3(0, 0, 24.13),
        color: 0xc1440e,
        massUnit: 'kg',
        radiusUnit: 'km',
        description: 'The fourth planet from the Sun, known as the Red Planet.'
      },
      {
        name: 'Jupiter',
        mass: 1.8982e27,
        radius: 69911,
        position: new THREE.Vector3(5.203, 0, 0),
        velocity: new THREE.Vector3(0, 0, 13.07),
        color: 0xd8ca9d,
        massUnit: 'kg',
        radiusUnit: 'km',
        description: 'The largest planet in our Solar System, a gas giant.'
      },
      {
        name: 'Saturn',
        mass: 5.6834e26,
        radius: 58232,
        position: new THREE.Vector3(9.537, 0, 0),
        velocity: new THREE.Vector3(0, 0, 9.69),
        color: 0xead6b8,
        massUnit: 'kg',
        radiusUnit: 'km',
        description: 'The sixth planet from the Sun, famous for its prominent ring system.'
      },
      {
        name: 'Uranus',
        mass: 8.6810e25,
        radius: 25362,
        position: new THREE.Vector3(19.191, 0, 0),
        velocity: new THREE.Vector3(0, 0, 6.81),
        color: 0xb1e3e3,
        massUnit: 'kg',
        radiusUnit: 'km',
        description: 'The seventh planet from the Sun, an ice giant with a tilted axis.'
      },
      {
        name: 'Neptune',
        mass: 1.02413e26,
        radius: 24622,
        position: new THREE.Vector3(30.069, 0, 0),
        velocity: new THREE.Vector3(0, 0, 5.43),
        color: 0x3d85c6,
        massUnit: 'kg',
        radiusUnit: 'km',
        description: 'The eighth and farthest known planet from the Sun, an ice giant.'
      }
    ];
    
    // Create bodies
    createBodies(solarSystemData);
    
    // Create orbit paths
    createOrbitPaths(solarSystemData);
  };
  
  // Create exoplanet system simulation
  const createExoplanetSystem = () => {
    // TRAPPIST-1 system data (mass in Earth masses, radius in Earth radii, distance in AU)
    const trappist1Data = [
      {
        name: 'TRAPPIST-1',
        mass: 0.089 * 1.989e30, // 0.089 solar masses
        radius: 0.121 * 696340, // 0.121 solar radii
        position: new THREE.Vector3(0, 0, 0),
        velocity: new THREE.Vector3(0, 0, 0),
        color: 0xff6347, // Reddish (M-dwarf star)
        emissive: true,
        massUnit: 'kg',
        radiusUnit: 'km',
        description: 'An ultra-cool red dwarf star about 40 light-years from Earth.'
      },
      {
        name: 'TRAPPIST-1b',
        mass: 1.017,
        radius: 1.121,
        position: new THREE.Vector3(0.01111, 0, 0),
        velocity: new THREE.Vector3(0, 0, 80),
        color: 0xc1440e,
        massUnit: 'Earth masses',
        radiusUnit: 'Earth radii',
        orbitalPeriod: 1.51,
        distance: 0.01111,
        description: 'The innermost planet in the TRAPPIST-1 system, likely tidally locked.'
      },
      {
        name: 'TRAPPIST-1c',
        mass: 1.156,
        radius: 1.095,
        position: new THREE.Vector3(0.01521, 0, 0),
        velocity: new THREE.Vector3(0, 0, 70),
        color: 0xd8ca9d,
        massUnit: 'Earth masses',
        radiusUnit: 'Earth radii',
        orbitalPeriod: 2.42,
        distance: 0.01521,
        description: 'The second planet in the system, likely has a thick atmosphere.'
      },
      {
        name: 'TRAPPIST-1d',
        mass: 0.297,
        radius: 0.784,
        position: new THREE.Vector3(0.02144, 0, 0),
        velocity: new THREE.Vector3(0, 0, 60),
        color: 0x8c8c8c,
        massUnit: 'Earth masses',
        radiusUnit: 'Earth radii',
        orbitalPeriod: 4.05,
        distance: 0.02144,
        description: 'The third planet, may be at the inner edge of the habitable zone.'
      },
      {
        name: 'TRAPPIST-1e',
        mass: 0.772,
        radius: 0.910,
        position: new THREE.Vector3(0.02817, 0, 0),
        velocity: new THREE.Vector3(0, 0, 50),
        color: 0x2b82bd,
        massUnit: 'Earth masses',
        radiusUnit: 'Earth radii',
        orbitalPeriod: 6.10,
        distance: 0.02817,
        description: 'The most likely planet in the system to host Earth-like conditions.'
      },
      {
        name: 'TRAPPIST-1f',
        mass: 0.934,
        radius: 1.046,
        position: new THREE.Vector3(0.03710, 0, 0),
        velocity: new THREE.Vector3(0, 0, 45),
        color: 0x3d85c6,
        massUnit: 'Earth masses',
        radiusUnit: 'Earth radii',
        orbitalPeriod: 9.21,
        distance: 0.03710,
        description: 'A planet in the habitable zone that may have a water-rich composition.'
      },
      {
        name: 'TRAPPIST-1g',
        mass: 1.148,
        radius: 1.148,
        position: new THREE.Vector3(0.04510, 0, 0),
        velocity: new THREE.Vector3(0, 0, 40),
        color: 0xb1e3e3,
        massUnit: 'Earth masses',
        radiusUnit: 'Earth radii',
        orbitalPeriod: 12.35,
        distance: 0.04510,
        description: 'One of the outer planets in the habitable zone.'
      },
      {
        name: 'TRAPPIST-1h',
        mass: 0.331,
        radius: 0.773,
        position: new THREE.Vector3(0.05953, 0, 0),
        velocity: new THREE.Vector3(0, 0, 35),
        color: 0xe6e6b8,
        massUnit: 'Earth masses',
        radiusUnit: 'Earth radii',
        orbitalPeriod: 18.77,
        distance: 0.05953,
        description: 'The outermost known planet in the system, likely too cold for liquid water.'
      }
    ];
    
    // Create bodies
    createBodies(trappist1Data);
    
    // Create orbit paths
    createOrbitPaths(trappist1Data);
  };
  
  // Create binary star system simulation
  const createBinaryStarSystem = () => {
    // Binary star system with planets (fictional but based on real physics)
    const binarySystemData = [
      {
        name: 'Alpha',
        mass: 1.1 * 1.989e30, // 1.1 solar masses
        radius: 1.2 * 696340, // 1.2 solar radii
        position: new THREE.Vector3(1, 0, 0),
        velocity: new THREE.Vector3(0, 0, -10),
        color: 0xffdd00, // Yellow-orange star
        emissive: true,
        massUnit: 'kg',
        radiusUnit: 'km',
        description: 'The primary star in this binary system.'
      },
      {
        name: 'Beta',
        mass: 0.8 * 1.989e30, // 0.8 solar masses
        radius: 0.9 * 696340, // 0.9 solar radii
        position: new THREE.Vector3(-1, 0, 0),
        velocity: new THREE.Vector3(0, 0, 13.75),
        color: 0xff6347, // Reddish star
        emissive: true,
        massUnit: 'kg',
        radiusUnit: 'km',
        description: 'The secondary star in this binary system.'
      },
      {
        name: 'Planet I',
        mass: 1.2 * 5.972e24, // 1.2 Earth masses
        radius: 1.1 * 6371, // 1.1 Earth radii
        position: new THREE.Vector3(0, 0, 4),
        velocity: new THREE.Vector3(-20, 0, 0),
        color: 0x2b82bd,
        massUnit: 'Earth masses',
        radiusUnit: 'Earth radii',
        description: 'A planet in a circumbinary orbit around both stars.'
      },
      {
        name: 'Planet II',
        mass: 0.8 * 5.972e24, // 0.8 Earth masses
        radius: 0.9 * 6371, // 0.9 Earth radii
        position: new THREE.Vector3(0, 0, -5),
        velocity: new THREE.Vector3(18, 0, 0),
        color: 0xc1440e,
        massUnit: 'Earth masses',
        radiusUnit: 'Earth radii',
        description: 'A smaller planet in a wider circumbinary orbit.'
      },
      {
        name: 'Planet III',
        mass: 0.3 * 1.8982e27, // 0.3 Jupiter masses
        radius: 0.4 * 69911, // 0.4 Jupiter radii
        position: new THREE.Vector3(0, 0, 8),
        velocity: new THREE.Vector3(-15, 0, 0),
        color: 0xd8ca9d,
        massUnit: 'Jupiter masses',
        radiusUnit: 'Jupiter radii',
        description: 'A gas giant in a stable orbit around the binary pair.'
      }
    ];
    
    // Create bodies
    createBodies(binarySystemData);
    
    // For binary systems, we don't create fixed orbit paths as they're more complex
  };
  
  // Create custom system from user-defined bodies
  const createCustomSystem = () => {
    if (!customBodies || customBodies.length === 0) {
      // Create a default star if no custom bodies
      const defaultStar = {
        name: 'Default Star',
        mass: 1.989e30,
        radius: 696340,
        position: new THREE.Vector3(0, 0, 0),
        velocity: new THREE.Vector3(0, 0, 0),
        color: 0xffff00,
        emissive: true,
        massUnit: 'kg',
        radiusUnit: 'km',
        description: 'Default star. Add custom bodies to create your own system.'
      };
      
      createBodies([defaultStar]);
      return;
    }
    
    // Convert custom bodies to simulation format
    const simulationBodies = customBodies.map(body => {
      return {
        name: body.name || `Body ${body.id}`,
        mass: body.mass * 5.972e24, // Convert Earth masses to kg
        radius: body.radius * 6371, // Convert Earth radii to km
        position: new THREE.Vector3(
          body.position.x,
          body.position.y,
          body.position.z
        ),
        velocity: new THREE.Vector3(
          body.velocity.x,
          body.velocity.y,
          body.velocity.z
        ),
        color: new THREE.Color(body.color).getHex(),
        massUnit: 'Earth masses',
        radiusUnit: 'Earth radii',
        description: body.description || 'A custom celestial body.'
      };
    });
    
    // Add a default star if none exists
    const hasStar = simulationBodies.some(body => body.mass > 1.989e29); // Roughly 0.1 solar masses
    
    if (!hasStar) {
      simulationBodies.unshift({
        name: 'Star',
        mass: 1.989e30,
        radius: 696340,
        position: new THREE.Vector3(0, 0, 0),
        velocity: new THREE.Vector3(0, 0, 0),
        color: 0xffff00,
        emissive: true,
        massUnit: 'kg',
        radiusUnit: 'km',
        description: 'The central star of your custom system.'
      });
    }
    
    // Create bodies
    createBodies(simulationBodies);
  };
  
  // Create celestial bodies from data
  const createBodies = (bodiesData) => {
    const bodies = [];
    
    bodiesData.forEach((bodyData) => {
      // Scale radius for visualization (not physically accurate but better for viewing)
      let displayRadius;
      
      if (bodyData.mass > 1.989e29) {
        // Star - scale down less to make them stand out
        displayRadius = Math.log(bodyData.radius) * 0.2;
      } else if (bodyData.mass > 1.8982e26) {
        // Gas giant
        displayRadius = Math.log(bodyData.radius) * 0.15;
      } else {
        // Rocky planet
        displayRadius = Math.log(bodyData.radius) * 0.1;
      }
      
      // Ensure minimum visible size
      displayRadius = Math.max(displayRadius, 0.1);
      
      // Create sphere geometry
      const geometry = new THREE.SphereGeometry(displayRadius, 32, 32);
      
      // Create material
      let material;
      if (bodyData.emissive) {
        // Emissive material for stars
        material = new THREE.MeshBasicMaterial({
          color: bodyData.color,
          emissive: bodyData.color,
          emissiveIntensity: 1
        });
      } else {
        // Standard material for planets
        material = new THREE.MeshStandardMaterial({
          color: bodyData.color,
          roughness: 0.7,
          metalness: 0.3
        });
      }
      
      // Create mesh
      const mesh = new THREE.Mesh(geometry, material);
      
      // Set position
      mesh.position.set(
        bodyData.position.x * 10, // Scale up for better visualization
        bodyData.position.y * 10,
        bodyData.position.z * 10
      );
      
      // Add to scene
      sceneRef.current.add(mesh);
      
      // Create label if needed
      let label = null;
      if (showLabels) {
        const labelDiv = document.createElement('div');
        labelDiv.className = 'celestial-label';
        labelDiv.textContent = bodyData.name;
        labelDiv.style.color = 'white';
        labelDiv.style.fontSize = '12px';
        labelDiv.style.fontWeight = 'bold';
        labelDiv.style.padding = '2px 6px';
        labelDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
        labelDiv.style.borderRadius = '4px';
        labelDiv.style.pointerEvents = 'none';
        
        label = new CSS2DObject(labelDiv);
        label.position.set(0, displayRadius + 0.5, 0);
        mesh.add(label);
      }
      
      // Store body data for physics simulation
      bodies.push({
        mesh,
        label,
        mass: bodyData.mass,
        velocity: new THREE.Vector3(
          bodyData.velocity.x / 3600, // Convert km/s to km/h and scale
          bodyData.velocity.y / 3600,
          bodyData.velocity.z / 3600
        ),
        name: bodyData.name,
        color: bodyData.color,
        radius: bodyData.radius,
        displayRadius,
        massUnit: bodyData.massUnit,
        radiusUnit: bodyData.radiusUnit,
        orbitalPeriod: bodyData.orbitalPeriod,
        distance: bodyData.distance,
        description: bodyData.description,
        isEmissive: bodyData.emissive
      });
      
      // Add click event to select body
      mesh.userData.bodyIndex = bodies.length - 1;
    });
    
    // Store bodies reference
    bodiesRef.current = bodies;
    
    // Add raycaster for body selection
    addBodySelectionRaycaster();
  };
  
  // Create orbit paths for visualization
  const createOrbitPaths = (bodiesData) => {
    const orbits = [];
    
    // Skip the first body (usually the star)
    for (let i = 1; i < bodiesData.length; i++) {
      const bodyData = bodiesData[i];
      
      // Calculate orbit radius
      const orbitRadius = Math.sqrt(
        Math.pow(bodyData.position.x, 2) +
        Math.pow(bodyData.position.y, 2) +
        Math.pow(bodyData.position.z, 2)
      ) * 10; // Scale to match body positions
      
      // Create orbit path
      const orbitGeometry = new THREE.RingGeometry(orbitRadius - 0.02, orbitRadius + 0.02, 128);
      const orbitMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.2
      });
      
      const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
      orbit.rotation.x = Math.PI / 2; // Rotate to horizontal plane
      
      // Add to scene
      sceneRef.current.add(orbit);
      orbits.push(orbit);
    }
    
    // Store orbits reference
    orbitsRef.current = orbits;
  };
  
  // Add raycaster for body selection
  const addBodySelectionRaycaster = () => {
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    
    const handleClick = (event) => {
      // Calculate mouse position in normalized device coordinates
      const rect = containerRef.current.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      
      // Update the raycaster
      raycaster.setFromCamera(mouse, cameraRef.current);
      
      // Get intersected objects
      const intersects = raycaster.intersectObjects(sceneRef.current.children);
      
      if (intersects.length > 0) {
        const selectedObject = intersects[0].object;
        
        // Check if it's a celestial body
        if (selectedObject.userData.bodyIndex !== undefined) {
          const bodyIndex = selectedObject.userData.bodyIndex;
          const selectedBody = bodiesRef.current[bodyIndex];
          
          // Calculate current velocity in km/s
          const velocity = Math.sqrt(
            Math.pow(selectedBody.velocity.x * 3600, 2) +
            Math.pow(selectedBody.velocity.y * 3600, 2) +
            Math.pow(selectedBody.velocity.z * 3600, 2)
          ).toFixed(2);
          
          // Notify parent component
          onBodySelect({
            name: selectedBody.name,
            mass: selectedBody.isEmissive 
              ? (selectedBody.mass / 1.989e30).toFixed(2) + ' solar masses'
              : (selectedBody.mass / 5.972e24).toFixed(2),
            radius: selectedBody.isEmissive
              ? (selectedBody.radius / 696340).toFixed(2) + ' solar radii'
              : (selectedBody.radius / 6371).toFixed(2),
            massUnit: selectedBody.massUnit,
            radiusUnit: selectedBody.radiusUnit,
            orbitalPeriod: selectedBody.orbitalPeriod,
            distance: selectedBody.distance,
            velocity,
            color: selectedBody.color,
            description: selectedBody.description
          });
        }
      }
    };
    
    // Add event listener
    containerRef.current.addEventListener('click', handleClick);
  };
  
  // Clear existing bodies and orbits
  const clearBodies = () => {
    // Remove bodies
    bodiesRef.current.forEach(body => {
      sceneRef.current.remove(body.mesh);
      if (body.mesh.geometry) body.mesh.geometry.dispose();
      if (body.mesh.material) {
        if (Array.isArray(body.mesh.material)) {
          body.mesh.material.forEach(material => material.dispose());
        } else {
          body.mesh.material.dispose();
        }
      }
    });
    
    // Remove orbits
    orbitsRef.current.forEach(orbit => {
      sceneRef.current.remove(orbit);
      if (orbit.geometry) orbit.geometry.dispose();
      if (orbit.material) orbit.material.dispose();
    });
    
    // Clear arrays
    bodiesRef.current = [];
    orbitsRef.current = [];
  };
  
  // Start animation loop
  const startAnimation = () => {
    const animate = () => {
      // Update physics
      updatePhysics();
      
      // Update controls
      if (controlsRef.current) {
        controlsRef.current.update();
      }
      
      // Render scene
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
      
      // Render labels
      if (labelRendererRef.current && sceneRef.current && cameraRef.current) {
        labelRendererRef.current.render(sceneRef.current, cameraRef.current);
      }
      
      // Continue animation loop
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    
    animate();
  };
  
  // Update physics simulation
  const updatePhysics = () => {
    const bodies = bodiesRef.current;
    if (!bodies || bodies.length === 0) return;
    
    // Get elapsed time
    const deltaTime = clockRef.current.getDelta() * timeScale * TIME_STEP;
    
    // Calculate forces and update velocities
    for (let i = 0; i < bodies.length; i++) {
      const bodyA = bodies[i];
      
      // Skip updating the central star in solar system and exoplanet modes
      if ((mode === 'solar-system' || mode === 'exoplanets') && i === 0) continue;
      
      // Calculate gravitational forces from all other bodies
      const acceleration = new THREE.Vector3(0, 0, 0);
      
      for (let j = 0; j < bodies.length; j++) {
        if (i === j) continue;
        
        const bodyB = bodies[j];
        
        // Calculate direction and distance
        const direction = new THREE.Vector3().subVectors(bodyB.mesh.position, bodyA.mesh.position);
        const distance = direction.length();
        direction.normalize();
        
        // Calculate gravitational force (F = G * m1 * m2 / r^2)
        // We scale this for better visualization
        const forceMagnitude = G * bodyA.mass * bodyB.mass / (distance * distance) * SCALE_FACTOR;
        
        // Convert force to acceleration (F = ma, so a = F/m)
        const accelerationMagnitude = forceMagnitude / bodyA.mass;
        
        // Add to total acceleration
        acceleration.add(direction.multiplyScalar(accelerationMagnitude));
      }
      
      // Update velocity (v = v0 + a*t)
      bodyA.velocity.add(acceleration.multiplyScalar(deltaTime));
    }
    
    // Update positions
    for (let i = 0; i < bodies.length; i++) {
      const body = bodies[i];
      
      // Skip updating the central star in solar system and exoplanet modes
      if ((mode === 'solar-system' || mode === 'exoplanets') && i === 0) continue;
      
      // Update position (p = p0 + v*t)
      body.mesh.position.add(body.velocity.clone().multiplyScalar(deltaTime));
    }
  };
  
  return (
    <div ref={containerRef} className="w-full h-full" />
  );
};

export default OrbitSimulation;
