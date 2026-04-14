import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

// --- SHADER CONFIGURATION ---
const vertexShader = `
  varying vec2 vUv;
  varying vec3 vPosition;
  
  void main() {
    vUv = uv;
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform float uTime;
  uniform vec3 uColor;
  uniform vec3 uScanColor;
  
  varying vec3 vPosition;
  varying vec2 vUv;

  void main() {
    // Area scan bergerak naik turun
    float scanPos = sin(uTime * 1.5) * 2.0; 
    
    // Hitung jarak vertikal pixel ke garis scan
    float dist = abs(vPosition.y - scanPos);
    
    // Ketebalan garis bercahaya
    float intensity = smoothstep(0.15, 0.0, dist); 
    
    // Warna: Mix antara warna dasar (wireframe tipis) dan warna scan (garis utama)
    vec3 finalColor = mix(uColor, uScanColor, intensity * 2.5);
    
    // Transparansi shader
    // Di background putih, kita butuh alpha yang cukup agar terlihat elegan
    float alpha = 0.3 + (intensity * 0.7); 

    // Efek glitch/techy di wireframe
    if(mod(vPosition.y * 20.0, 1.0) < 0.1) alpha *= 0.2;

    gl_FragColor = vec4(finalColor, alpha);
  }
`;

const FaceModel = () => {
  const meshRef = useRef();
  const solidMeshRef = useRef();

  const { nodes } = useGLTF('/face.glb');

  // Uniforms untuk Shader
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      // PENTING: Warna wireframe diubah ke Abu-abu agar terlihat di background Putih
      uColor: { value: new THREE.Color("#fff") }, // Abu-abu sangat muda (Base)
      uScanColor: { value: new THREE.Color("#fff") }, // Abu-abu medium (Garis Scan)
    }),
    []
  );

  useFrame((state) => {
    const { clock } = state;
    const elapsedTime = clock.getElapsedTime();

    // Animasi Shader Wireframe
    if (meshRef.current) {
      meshRef.current.material.uniforms.uTime.value = elapsedTime;
      meshRef.current.rotation.y = Math.sin(elapsedTime * 0.5) * 0.3;
    }

    // Animasi Solid Mesh
    if (solidMeshRef.current) {
      solidMeshRef.current.rotation.y = Math.sin(elapsedTime * 0.5) * 0.3;
    }
  });

  return (
    <group dispose={null} position={[0, -0.9, 0]}>
      
      {/* 1. LAYER SOLID (Kulit Bersih) */}
      <mesh 
        ref={solidMeshRef}
        geometry={nodes.geometry_0.geometry} 
        scale={[3, 3, 3]} 
      >
        {/* Material Putih Bersih (Ceramic/Plastic Look) */}
        <meshStandardMaterial 
          color="#fff"    // Putih Murni
          roughness={0}    // Cukup halus tapi tidak seperti kaca
          metalness={0}    // Metalness rendah agar tidak terlihat abu-abu/gelap
        />
      </mesh>

      {/* 2. LAYER WIREFRAME / SCANNER */}
      <mesh 
        ref={meshRef}
        geometry={nodes.geometry_0.geometry} 
        scale={[3.001, 3.001, 3.001]} 
      >
        <shaderMaterial
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
          wireframe={true} 
          transparent={true}
          side={THREE.DoubleSide}
          depthWrite={false}
          // PENTING: Hapus AdditiveBlending agar warna abu-abu terlihat di atas putih
          // blending={THREE.NormalBlending} (Default)
        />
      </mesh>

    </group>
  );
};

const FaceScanner = () => {
  return (
    // Background Putih Bersih
    <div className="w-full h-full relative"> 
        <Canvas camera={{ position: [0, 0, 6], fov: 45 }} dpr={[1, 2]} gl={{ alpha: true }}>
            {/* Pencahayaan High-Key (Terang Benderang) */}
            <ambientLight intensity={2} color="#ffffff" /> {/* Ambient sangat terang */}
            <directionalLight position={[10, 10, 5]} intensity={1.5} color="#ffffff" />
            <spotLight position={[-10, 10, 5]} intensity={1} color="#f3f4f6" /> {/* Sedikit warm grey */}
            <pointLight position={[0, -10, 5]} intensity={0.5} color="#ffffff" />

            <FaceModel />
            
            <OrbitControls 
                enableZoom={false} 
                enablePan={false} 
                minPolarAngle={Math.PI / 2.5} 
                maxPolarAngle={Math.PI / 1.5}
            />
        </Canvas>
        
        {/* Modern Overlay UI - Diubah ke Abu-abu agar terlihat di background putih */}
        <div className="absolute inset-0 pointer-events-none p-6 flex flex-col justify-between">
            {/* Top Corners */}
            <div className="flex justify-between items-start opacity-30">
                <div className="w-8 h-8 border-l-2 border-t-2 border-gray-800 rounded-tl-lg"></div>
                <div className="w-8 h-8 border-r-2 border-t-2 border-gray-800 rounded-tr-lg"></div>
            </div>

             {/* Bottom Corners */}
             <div className="flex justify-between items-end opacity-30">
                <div className="w-8 h-8 border-l-2 border-b-2 border-gray-800 rounded-bl-lg"></div>
                <div className="w-8 h-8 border-r-2 border-b-2 border-gray-800 rounded-br-lg"></div>
            </div>
        </div>
    </div>
  );
};

// Preload
useGLTF.preload('/face.glb');

export default FaceScanner;