import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';

// --- Komponen Inti Animasi 3 Titik (Three.js) ---
const MorphingParticles = () => {
  const pointsRef = useRef();

  // 1. Definisikan Titik Target (Tepat 3 Titik)
  
  // State: Memisah (Segitiga longgar)
  const dispersedVertices = useMemo(() => new Float32Array([
    -0.8,  0.5, 0, // Titik 1
     0.8,  0.5, 0, // Titik 2
     0.0, -0.7, 0  // Titik 3
  ]), []);

  // State: Menyatu membentuk Gembok Abstrak (Handle + Body Base)
  // Membentuk segitiga sangat tajam ke atas seperti siluet gembok minimalis
  const lockVertices = useMemo(() => new Float32Array([
     0.0,  0.6, 0, // Titik 1: Bagian atas handle
    -0.3, -0.2, 0, // Titik 2: Bawah kiri body
     0.3, -0.2, 0  // Titik 3: Bawah kanan body
  ]), []);

  // Buffer untuk posisi saat ini (diperbarui setiap frame)
  const currentPositions = useMemo(() => new Float32Array(3 * 3), []);

  // 2. Loop Animasi (useFrame)
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const speed = 0.8; // Kecepatan loop

    // Faktor morphing (berosilasi 0 ke 1 menggunakan Sinus)
    // Kami menambahkan sedikit 'bias' agar titik menahan bentuk gembok lebih lama
    const rawSin = Math.sin(t * speed * Math.PI * 2);
    const morphFactor = THREE.MathUtils.lerp(0, 1, (rawSin + 1) / 2);

    // Interpolasi posisi setiap titik antara 'dispersed' dan 'lock'
    for (let i = 0; i < 3; i++) {
      const idx = i * 3;
      // Interpolasi X, Y (Z tetap 0)
      currentPositions[idx] = THREE.MathUtils.lerp(dispersedVertices[idx], lockVertices[idx], morphFactor);
      currentPositions[idx + 1] = THREE.MathUtils.lerp(dispersedVertices[idx + 1], lockVertices[idx + 1], morphFactor);
      currentPositions[idx + 2] = 0;
    }

    // Beritahu Three.js bahwa posisi perlu diperbarui di GPU
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={currentPositions}
          count={3}
          itemSize={3}
        />
      </bufferGeometry>
      {/* PointsMaterial untuk membuat titik bulat hitam yang tajam */}
      <pointsMaterial
        color="#171717" // neutral-900
        size={0.12}      // Ukuran titik, sesuaikan agar elegan
        sizeAttenuation={true} // Titik mengecil jika kamera menjauh
        transparent={true}
        alphaTest={0.5} // Membantu membuat lingkaran bersih tanpa shader kustom
        opacity={0.9}
      />
    </points>
  );
};


// --- Komponen Utama Loading Screen ---
const LoadingScreenRoute = () => (
  <div className="flex min-h-screen items-center justify-center bg-white selection:bg-neutral-100">
    <div className="flex flex-col items-center gap-12">
      
      {/* Container untuk Canvas Three.js */}
      {/* h-24 w-24 memberikan ruang yang cukup namun tetap minimalis */}
      <div className="h-24 w-24 relative">
        <Canvas 
          camera={{ position: [0, 0, 3], fov: 50 }} 
          dpr={[1, 2]} // Support retina display untuk ketajaman
        >
          {/* Background Canvas Putih */}
          <color attach="background" args={['white']} />
          
          {/* Komponen Animasi Kita */}
          <MorphingParticles />
        </Canvas>
      </div>

      {/* Tipografi Modern & Minimalis (Sangat Dijaga agar tidak jamet) */}
      <div className="flex flex-col items-center gap-2 text-center">
        {/* Teks Utama: Ringan, tracking lebar */}
        <p className="text-sm font-medium tracking-wider text-neutral-900">
          Mengautentikasi
        </p>
        
        {/* Sub-teks: Sangat kecil, Uppercase, Tracking ekstrim untuk kesan premium/security */}
        <p className="text-[10px] uppercase tracking-[0.4em] text-neutral-400 font-semibold">
          Sistem Keamanan
        </p>
      </div>

    </div>
  </div>
);

export default LoadingScreenRoute;