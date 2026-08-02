import { Sphere } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";

export const AnimatedSparkles = () => {
    const groupRef = useRef();

    useFrame((state) => {
        const t = state.clock.elapsedTime;
        // Animasi menyatu (0.0) dan memisah (hingga ~0.45 agar tidak terpotong di mobile) secara loop
        const spread = (Math.sin(t * 2) + 1) / 2 * 0.45;

        if (groupRef.current) {
            // Putaran keseluruhan grup untuk efek swirl yang elegan
            groupRef.current.rotation.y = t * 1.5;
            groupRef.current.rotation.x = t * 0.8;
            groupRef.current.rotation.z = t * 0.5;

            // Distribusi 5 sparkles
            groupRef.current.children.forEach((child, i) => {
                const angle = i * ((Math.PI * 2) / 5);
                child.position.x = Math.cos(angle) * spread;
                child.position.y = Math.sin(angle) * spread;
                // Tambahan dimensi Z agar gerakan lebih natural
                child.position.z = Math.sin(t * 3 + i) * 0.4 * spread;
            });
        }
    });

    // 5 Sparkles: 3 Dominan hitam/gelap, 2 Warna soft (soft purple, soft teal)
    const colors = ['#09090b', '#18181b', '#27272a', '#e9d5ff', '#ccfbf1'];

    return (
        <group ref={groupRef}>
            {colors.map((color, i) => (
                <Sphere key={i} args={[0.06, 32, 32]}>
                    <meshStandardMaterial 
                        color={color} 
                        roughness={0.1} 
                        metalness={0.9} 
                        emissive={i > 2 ? color : '#000000'}
                        emissiveIntensity={i > 2 ? 0.5 : 0}
                    />
                </Sphere>
            ))}
        </group>
    );
};