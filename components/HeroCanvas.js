import { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { gsap } from 'gsap';

const HeroCanvas = ({ cursorPosition }) => {
  const canvasRef = useRef(null);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const particlesRef = useRef(null);
  const composerRef = useRef(null);
  const nebulaMeshRef = useRef(null);
  
  // Enhanced particle system with more dynamic behavior
  useEffect(() => {
    if (!canvasRef.current) return;
    
    // Initialize scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    
    // Initialize camera with enhanced perspective
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 5;
    cameraRef.current = camera;
    
    // Initialize renderer with improved settings
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    rendererRef.current = renderer;
    
    // Enhanced post-processing with stronger bloom effect
    const composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);
    
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      1.8, // increased strength
      0.5, // increased radius
      0.75 // lowered threshold for more glow
    );
    composer.addPass(bloomPass);
    composerRef.current = composer;
    
    // Create enhanced particle system with more particles
    const particleCount = 3000; // Increased from 2000
    const particles = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const speeds = new Float32Array(particleCount); // Added for varied animation speeds
    
    // Enhanced color palette with more vibrant colors
    const colorChoices = [
      new THREE.Color('#FF00FF'), // nebula-pink
      new THREE.Color('#00FFFF'), // electric-blue
      new THREE.Color('#39FF14'), // neon-teal
      new THREE.Color('#FFFFFF'), // white
      new THREE.Color('#FF3366'), // hot pink
      new THREE.Color('#9900FF'), // purple
    ];
    
    for (let i = 0; i < particleCount; i++) {
      // Position with wider distribution
      positions[i * 3] = (Math.random() - 0.5) * 25; // x - increased range
      positions[i * 3 + 1] = (Math.random() - 0.5) * 25; // y - increased range
      positions[i * 3 + 2] = (Math.random() - 0.5) * 25; // z - increased range
      
      // More varied colors
      const color = colorChoices[Math.floor(Math.random() * colorChoices.length)];
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
      
      // More varied sizes
      sizes[i] = Math.random() * 0.15 + 0.05; // Increased max size
      
      // Random speeds for more dynamic movement
      speeds[i] = Math.random() * 0.5 + 0.5;
    }
    
    particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    particles.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    particles.setAttribute('speed', new THREE.BufferAttribute(speeds, 1)); // Add speed attribute
    
    // Enhanced shader material with time-based animation
    const particleMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        pixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
        cursorX: { value: 0 },
        cursorY: { value: 0 },
      },
      vertexShader: `
        attribute float size;
        attribute vec3 color;
        attribute float speed;
        varying vec3 vColor;
        uniform float time;
        uniform float pixelRatio;
        uniform float cursorX;
        uniform float cursorY;
        
        void main() {
          vColor = color;
          
          // Add subtle wave motion based on time and position
          vec3 pos = position;
          float waveX = sin(time * speed + pos.x) * 0.3;
          float waveY = cos(time * speed + pos.y) * 0.3;
          float waveZ = sin(time * speed + pos.z) * 0.3;
          
          // Add cursor influence
          float cursorInfluence = 0.5;
          float distX = pos.x - cursorX * 10.0;
          float distY = pos.y - cursorY * 10.0;
          float dist = sqrt(distX * distX + distY * distY);
          float influence = max(0.0, 5.0 - dist) / 5.0 * cursorInfluence;
          
          // Apply wave and cursor influence
          pos.x += waveX;
          pos.y += waveY;
          pos.z += waveZ;
          
          // Cursor repulsion effect
          if (influence > 0.0) {
            pos.x += distX * influence * 0.2;
            pos.y += distY * influence * 0.2;
          }
          
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_PointSize = size * pixelRatio * (300.0 / -mvPosition.z) * (1.0 + sin(time * speed) * 0.2); // Pulsating size
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        uniform float time;
        
        void main() {
          float distanceToCenter = length(gl_PointCoord - vec2(0.5));
          float strength = 1.0 - (distanceToCenter * 2.0);
          
          // Enhanced glow effect
          strength = pow(strength, 1.5);
          
          if (strength < 0.0) discard;
          
          // Pulsating opacity based on time
          float pulse = 0.9 + sin(time * 2.0) * 0.1;
          
          gl_FragColor = vec4(vColor, strength * pulse);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexColors: true,
    });
    
    const particleSystem = new THREE.Points(particles, particleMaterial);
    scene.add(particleSystem);
    particlesRef.current = particleSystem;
    
    // Enhanced nebula cloud with more complex geometry
    const nebulaGeometry = new THREE.IcosahedronGeometry(4, 5); // Larger and more detailed
    const nebulaMaterial = new THREE.MeshBasicMaterial({
      color: 0x3A0880, // Deeper purple
      wireframe: true,
      transparent: true,
      opacity: 0.4,
    });
    const nebulaMesh = new THREE.Mesh(nebulaGeometry, nebulaMaterial);
    scene.add(nebulaMesh);
    nebulaMeshRef.current = nebulaMesh;
    
    // Add secondary nebula elements for more depth
    const secondaryGeometry = new THREE.TorusKnotGeometry(2, 0.5, 100, 16);
    const secondaryMaterial = new THREE.MeshBasicMaterial({
      color: 0xFF00FF,
      wireframe: true,
      transparent: true,
      opacity: 0.2,
    });
    const secondaryMesh = new THREE.Mesh(secondaryGeometry, secondaryMaterial);
    scene.add(secondaryMesh);
    
    // Handle window resize with improved responsiveness
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      composer.setSize(window.innerWidth, window.innerHeight);
      
      // Update pixel ratio uniform
      particleMaterial.uniforms.pixelRatio.value = Math.min(window.devicePixelRatio, 2);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Enhanced animation loop with more dynamic movement
    const clock = new THREE.Clock();
    
    const animate = () => {
      const elapsedTime = clock.getElapsedTime();
      
      // Update particle system with more complex rotation
      particleSystem.rotation.x = elapsedTime * 0.05;
      particleSystem.rotation.y = elapsedTime * 0.03;
      particleSystem.rotation.z = elapsedTime * 0.01;
      
      // Update nebula mesh with more complex rotation
      nebulaMesh.rotation.x = elapsedTime * 0.1;
      nebulaMesh.rotation.y = elapsedTime * 0.15;
      nebulaMesh.rotation.z = elapsedTime * 0.05;
      
      // Update secondary mesh with different rotation
      secondaryMesh.rotation.x = -elapsedTime * 0.12;
      secondaryMesh.rotation.y = -elapsedTime * 0.07;
      secondaryMesh.rotation.z = elapsedTime * 0.09;
      
      // Subtle scale pulsing for nebula
      const pulseFactor = 1 + Math.sin(elapsedTime * 0.5) * 0.05;
      nebulaMesh.scale.set(pulseFactor, pulseFactor, pulseFactor);
      
      // Update shader uniforms
      particleMaterial.uniforms.time.value = elapsedTime;
      particleMaterial.uniforms.cursorX.value = cursorPosition.x;
      particleMaterial.uniforms.cursorY.value = cursorPosition.y;
      
      // Render with enhanced composer
      composer.render();
      
      requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      window.removeEventListener('resize', handleResize);
      
      // Dispose resources
      particles.dispose();
      particleMaterial.dispose();
      nebulaGeometry.dispose();
      nebulaMaterial.dispose();
      secondaryGeometry.dispose();
      secondaryMaterial.dispose();
      renderer.dispose();
    };
  }, []);
  
  // Enhanced cursor position effect with smoother transitions
  useEffect(() => {
    if (!cameraRef.current || !nebulaMeshRef.current) return;
    
    // Smooth camera movement with GSAP
    gsap.to(cameraRef.current.position, {
      x: cursorPosition.x * 0.5, // Increased influence
      y: cursorPosition.y * 0.5, // Increased influence
      duration: 1,
      ease: "power2.out"
    });
    
    // Always look at center
    cameraRef.current.lookAt(0, 0, 0);
    
    // Add subtle rotation to nebula mesh based on cursor
    if (nebulaMeshRef.current) {
      gsap.to(nebulaMeshRef.current.rotation, {
        x: nebulaMeshRef.current.rotation.x + cursorPosition.y * 0.05,
        y: nebulaMeshRef.current.rotation.y + cursorPosition.x * 0.05,
        duration: 1,
        ease: "power2.out"
      });
    }
    
  }, [cursorPosition]);
  
  return <canvas ref={canvasRef} className="w-full h-full" />;
};

export default HeroCanvas;
