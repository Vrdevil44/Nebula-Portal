import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer';

const StarMap = ({ 
  viewMode, 
  season, 
  showLabels, 
  showBoundaries, 
  constellations,
  activeConstellation,
  onConstellationSelect 
}) => {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const labelRendererRef = useRef(null);
  const controlsRef = useRef(null);
  const starsRef = useRef([]);
  const constellationLinesRef = useRef([]);
  const constellationBoundariesRef = useRef([]);
  const constellationLabelsRef = useRef([]);
  const animationFrameRef = useRef(null);
  const raycasterRef = useRef(new THREE.Raycaster());
  const mouseRef = useRef(new THREE.Vector2());
  
  // Initialize scene
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Initialize Three.js scene
    initScene();
    
    // Create starfield
    createStarfield();
    
    // Add constellations
    updateConstellations();
    
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
    
    // Handle mouse click for constellation selection
    const handleClick = (event) => {
      // Calculate mouse position in normalized device coordinates
      const rect = containerRef.current.getBoundingClientRect();
      mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouseRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      
      // Update the raycaster
      raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current);
      
      // Get intersected objects
      const intersects = raycasterRef.current.intersectObjects(sceneRef.current.children, true);
      
      if (intersects.length > 0) {
        const selectedObject = intersects[0].object;
        
        // Check if it's a constellation object
        if (selectedObject.userData.constellationId) {
          const selectedConstellation = constellations.find(
            c => c.id === selectedObject.userData.constellationId
          );
          
          if (selectedConstellation) {
            onConstellationSelect(selectedConstellation);
          }
        }
      }
    };
    
    containerRef.current.addEventListener('click', handleClick);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      if (containerRef.current) {
        containerRef.current.removeEventListener('click', handleClick);
      }
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
  
  // Update when view mode or season changes
  useEffect(() => {
    if (!sceneRef.current) return;
    
    updateViewSettings();
  }, [viewMode, season]);
  
  // Update when constellations or active constellation changes
  useEffect(() => {
    if (!sceneRef.current) return;
    
    updateConstellations();
  }, [constellations, activeConstellation]);
  
  // Update when label or boundary visibility changes
  useEffect(() => {
    if (!sceneRef.current) return;
    
    updateVisibility();
  }, [showLabels, showBoundaries]);
  
  // Initialize Three.js scene
  const initScene = () => {
    // Create scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000005);
    sceneRef.current = scene;
    
    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0x333333);
    scene.add(ambientLight);
    
    // Create camera
    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 50);
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
    controls.rotateSpeed = 0.5;
    controls.minDistance = 20;
    controls.maxDistance = 100;
    controlsRef.current = controls;
  };
  
  // Create starfield
  const createStarfield = () => {
    // Clear existing stars
    starsRef.current.forEach(star => {
      if (star.geometry) star.geometry.dispose();
      if (star.material) star.material.dispose();
      sceneRef.current.remove(star);
    });
    starsRef.current = [];
    
    // Create background stars (smaller, more numerous)
    const backgroundStarCount = 3000;
    const backgroundStarGeometry = new THREE.BufferGeometry();
    const backgroundStarMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.1,
      transparent: true,
      opacity: 0.7,
      sizeAttenuation: true
    });
    
    const backgroundStarPositions = [];
    const backgroundStarColors = [];
    
    for (let i = 0; i < backgroundStarCount; i++) {
      // Create stars in a sphere around the scene
      const theta = 2 * Math.PI * Math.random();
      const phi = Math.acos(2 * Math.random() - 1);
      const radius = 80 + Math.random() * 20;
      
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);
      
      backgroundStarPositions.push(x, y, z);
      
      // Random star colors (mostly white, some blue/red)
      const colorChoice = Math.random();
      if (colorChoice > 0.95) {
        // Blue-ish
        backgroundStarColors.push(0.8, 0.8, 1);
      } else if (colorChoice > 0.9) {
        // Red-ish
        backgroundStarColors.push(1, 0.8, 0.8);
      } else {
        // White-ish with slight variations
        const shade = 0.7 + Math.random() * 0.3;
        backgroundStarColors.push(shade, shade, shade);
      }
    }
    
    backgroundStarGeometry.setAttribute('position', new THREE.Float32BufferAttribute(backgroundStarPositions, 3));
    backgroundStarGeometry.setAttribute('color', new THREE.Float32BufferAttribute(backgroundStarColors, 3));
    backgroundStarMaterial.vertexColors = true;
    
    const backgroundStars = new THREE.Points(backgroundStarGeometry, backgroundStarMaterial);
    sceneRef.current.add(backgroundStars);
    starsRef.current.push(backgroundStars);
    
    // Create foreground stars (brighter, constellation stars)
    const foregroundStarCount = 500;
    const foregroundStarGeometry = new THREE.BufferGeometry();
    const foregroundStarMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.3,
      transparent: true,
      opacity: 1,
      sizeAttenuation: true
    });
    
    const foregroundStarPositions = [];
    const foregroundStarColors = [];
    
    for (let i = 0; i < foregroundStarCount; i++) {
      // Create stars in a sphere around the scene
      const theta = 2 * Math.PI * Math.random();
      const phi = Math.acos(2 * Math.random() - 1);
      const radius = 60;
      
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);
      
      foregroundStarPositions.push(x, y, z);
      
      // Random star colors (mostly white, some blue/red)
      const colorChoice = Math.random();
      if (colorChoice > 0.9) {
        // Blue-ish
        foregroundStarColors.push(0.8, 0.8, 1);
      } else if (colorChoice > 0.8) {
        // Red-ish
        foregroundStarColors.push(1, 0.8, 0.8);
      } else {
        // White-ish with slight variations
        const shade = 0.9 + Math.random() * 0.1;
        foregroundStarColors.push(shade, shade, shade);
      }
    }
    
    foregroundStarGeometry.setAttribute('position', new THREE.Float32BufferAttribute(foregroundStarPositions, 3));
    foregroundStarGeometry.setAttribute('color', new THREE.Float32BufferAttribute(foregroundStarColors, 3));
    foregroundStarMaterial.vertexColors = true;
    
    const foregroundStars = new THREE.Points(foregroundStarGeometry, foregroundStarMaterial);
    sceneRef.current.add(foregroundStars);
    starsRef.current.push(foregroundStars);
  };
  
  // Update view settings based on viewMode and season
  const updateViewSettings = () => {
    if (!cameraRef.current || !controlsRef.current) return;
    
    // Adjust camera position based on view mode
    switch (viewMode) {
      case 'northern':
        cameraRef.current.position.set(0, 30, 40);
        break;
      case 'southern':
        cameraRef.current.position.set(0, -30, 40);
        break;
      case 'equatorial':
        cameraRef.current.position.set(0, 0, 50);
        break;
      default:
        cameraRef.current.position.set(0, 0, 50);
    }
    
    cameraRef.current.lookAt(0, 0, 0);
    
    // Adjust rotation based on season
    let seasonRotation = 0;
    switch (season) {
      case 'spring':
        seasonRotation = 0;
        break;
      case 'summer':
        seasonRotation = Math.PI / 2;
        break;
      case 'autumn':
        seasonRotation = Math.PI;
        break;
      case 'winter':
        seasonRotation = 3 * Math.PI / 2;
        break;
      default:
        seasonRotation = 0;
    }
    
    // Rotate the entire scene
    starsRef.current.forEach(star => {
      star.rotation.y = seasonRotation;
    });
    
    // Reset controls
    controlsRef.current.update();
  };
  
  // Update constellations
  const updateConstellations = () => {
    // Clear existing constellation lines and labels
    clearConstellations();
    
    // Create constellation lines and labels for each constellation
    constellations.forEach(constellation => {
      createConstellation(constellation);
    });
    
    // Update visibility
    updateVisibility();
  };
  
  // Clear existing constellations
  const clearConstellations = () => {
    // Clear constellation lines
    constellationLinesRef.current.forEach(line => {
      if (line.geometry) line.geometry.dispose();
      if (line.material) line.material.dispose();
      sceneRef.current.remove(line);
    });
    constellationLinesRef.current = [];
    
    // Clear constellation boundaries
    constellationBoundariesRef.current.forEach(boundary => {
      if (boundary.geometry) boundary.geometry.dispose();
      if (boundary.material) boundary.material.dispose();
      sceneRef.current.remove(boundary);
    });
    constellationBoundariesRef.current = [];
    
    // Clear constellation labels
    constellationLabelsRef.current.forEach(label => {
      sceneRef.current.remove(label);
    });
    constellationLabelsRef.current = [];
  };
  
  // Create a constellation
  const createConstellation = (constellation) => {
    // Generate random star positions for this constellation
    const starCount = constellation.stars.length;
    const stars = [];
    
    // Create a base position for the constellation
    let baseX, baseY, baseZ;
    
    // Position based on hemisphere
    switch (constellation.hemisphere) {
      case 'northern':
        baseX = (Math.random() - 0.5) * 80;
        baseY = 20 + Math.random() * 30;
        baseZ = (Math.random() - 0.5) * 80;
        break;
      case 'southern':
        baseX = (Math.random() - 0.5) * 80;
        baseY = -20 - Math.random() * 30;
        baseZ = (Math.random() - 0.5) * 80;
        break;
      case 'equatorial':
        baseX = (Math.random() - 0.5) * 80;
        baseY = (Math.random() - 0.5) * 20;
        baseZ = (Math.random() - 0.5) * 80;
        break;
      default:
        baseX = (Math.random() - 0.5) * 80;
        baseY = (Math.random() - 0.5) * 60;
        baseZ = (Math.random() - 0.5) * 80;
    }
    
    // Generate star positions
    for (let i = 0; i < starCount; i++) {
      // Create a position relative to the base position
      const x = baseX + (Math.random() - 0.5) * 15;
      const y = baseY + (Math.random() - 0.5) * 15;
      const z = baseZ + (Math.random() - 0.5) * 15;
      
      stars.push(new THREE.Vector3(x, y, z));
    }
    
    // Create lines connecting the stars
    for (let i = 0; i < stars.length - 1; i++) {
      const lineGeometry = new THREE.BufferGeometry().setFromPoints([stars[i], stars[i + 1]]);
      
      // Determine if this is the active constellation
      const isActive = activeConstellation && activeConstellation.id === constellation.id;
      
      const lineMaterial = new THREE.LineBasicMaterial({
        color: isActive ? 0xff88ff : 0x4488ff,
        transparent: true,
        opacity: isActive ? 0.8 : 0.4,
        linewidth: isActive ? 2 : 1
      });
      
      const line = new THREE.Line(lineGeometry, lineMaterial);
      line.userData.constellationId = constellation.id;
      
      sceneRef.current.add(line);
      constellationLinesRef.current.push(line);
    }
    
    // Create a boundary around the constellation
    const boundaryPoints = [];
    const centerPoint = new THREE.Vector3(baseX, baseY, baseZ);
    
    // Create a circle of points around the center
    const segments = 16;
    const radius = 15;
    
    for (let i = 0; i < segments; i++) {
      const theta = (i / segments) * Math.PI * 2;
      const x = centerPoint.x + radius * Math.cos(theta);
      const y = centerPoint.y + radius * Math.sin(theta) * 0.7; // Slightly elliptical
      const z = centerPoint.z;
      
      boundaryPoints.push(new THREE.Vector3(x, y, z));
    }
    
    // Close the loop
    boundaryPoints.push(boundaryPoints[0]);
    
    const boundaryGeometry = new THREE.BufferGeometry().setFromPoints(boundaryPoints);
    
    // Determine if this is the active constellation
    const isActive = activeConstellation && activeConstellation.id === constellation.id;
    
    const boundaryMaterial = new THREE.LineBasicMaterial({
      color: isActive ? 0xff88ff : 0x4488ff,
      transparent: true,
      opacity: isActive ? 0.5 : 0.2,
      linewidth: isActive ? 2 : 1
    });
    
    const boundary = new THREE.Line(boundaryGeometry, boundaryMaterial);
    boundary.userData.constellationId = constellation.id;
    
    sceneRef.current.add(boundary);
    constellationBoundariesRef.current.push(boundary);
    
    // Create a label for the constellation
    const labelDiv = document.createElement('div');
    labelDiv.className = 'constellation-label';
    labelDiv.textContent = constellation.name;
    labelDiv.style.color = isActive ? '#ff88ff' : 'white';
    labelDiv.style.fontSize = isActive ? '14px' : '12px';
    labelDiv.style.fontWeight = 'bold';
    labelDiv.style.padding = '2px 6px';
    labelDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
    labelDiv.style.borderRadius = '4px';
    labelDiv.style.pointerEvents = 'none';
    
    const label = new CSS2DObject(labelDiv);
    label.position.copy(centerPoint);
    label.userData.constellationId = constellation.id;
    
    sceneRef.current.add(label);
    constellationLabelsRef.current.push(label);
    
    // Create individual star points
    stars.forEach((starPosition, index) => {
      // Create a small sphere for each star
      const starGeometry = new THREE.SphereGeometry(0.3, 8, 8);
      const starMaterial = new THREE.MeshBasicMaterial({
        color: isActive ? 0xff88ff : 0xffffff,
        transparent: true,
        opacity: isActive ? 1 : 0.8
      });
      
      const starMesh = new THREE.Mesh(starGeometry, starMaterial);
      starMesh.position.copy(starPosition);
      starMesh.userData.constellationId = constellation.id;
      starMesh.userData.starName = constellation.stars[index];
      
      sceneRef.current.add(starMesh);
      constellationLinesRef.current.push(starMesh);
      
      // Add a label for important stars
      if (constellation.stars[index] === constellation.brightestStar || index === 0) {
        const starLabelDiv = document.createElement('div');
        starLabelDiv.className = 'star-label';
        starLabelDiv.textContent = constellation.stars[index];
        starLabelDiv.style.color = '#aaccff';
        starLabelDiv.style.fontSize = '10px';
        starLabelDiv.style.padding = '1px 4px';
        starLabelDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
        starLabelDiv.style.borderRadius = '4px';
        starLabelDiv.style.pointerEvents = 'none';
        
        const starLabel = new CSS2DObject(starLabelDiv);
        starLabel.position.copy(starPosition);
        starLabel.position.y += 0.5;
        
        sceneRef.current.add(starLabel);
        constellationLabelsRef.current.push(starLabel);
      }
    });
  };
  
  // Update visibility of labels and boundaries
  const updateVisibility = () => {
    // Update label visibility
    constellationLabelsRef.current.forEach(label => {
      label.visible = showLabels;
    });
    
    // Update boundary visibility
    constellationBoundariesRef.current.forEach(boundary => {
      boundary.visible = showBoundaries;
    });
  };
  
  // Start animation loop
  const startAnimation = () => {
    const animate = () => {
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
  
  return (
    <div ref={containerRef} className="w-full h-full" />
  );
};

export default StarMap;
