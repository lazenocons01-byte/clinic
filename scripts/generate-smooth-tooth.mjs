import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import * as fs from 'fs';
import * as path from 'path';

// Node polyfill for FileReader
if (typeof globalThis.FileReader === 'undefined') {
  globalThis.FileReader = class FileReader {
    readAsArrayBuffer(blob) {
      blob.arrayBuffer().then((buf) => {
        this.result = buf;
        if (this.onloadend) this.onloadend();
      });
    }
  };
}

/**
 * Creates an organic, continuous, seamless 3D Human Molar.
 * Uses a subdivided spherical manifold geometry so there are ZERO seams, ZERO gaps,
 * and 100% continuous smooth surface normals!
 */
function createOrganicMolarGeometry() {
  // Base high-res sphere that we sculpt into a molar
  // 64 width segments, 48 height segments for silky smooth curvature
  const widthSegments = 72;
  const heightSegments = 56;
  const radius = 1.0;
  
  const geo = new THREE.SphereGeometry(radius, widthSegments, heightSegments);
  const pos = geo.attributes.position;
  const v = new THREE.Vector3();

  // Anatomical cusp centers on the crown (theta angles in X-Z plane)
  const cusps = [
    { x:  0.42, z: -0.38, h: 0.38, w: 0.36 }, // Mesiobuccal
    { x:  0.38, z:  0.38, h: 0.32, w: 0.35 }, // Distobuccal
    { x: -0.38, z:  0.38, h: 0.30, w: 0.34 }, // Distolingual
    { x: -0.42, z: -0.38, h: 0.36, w: 0.38 }, // Mesiolingual
  ];

  // 4 Anatomical root centers tapering downwards
  const roots = [
    { ox:  0.34, oz: -0.32, len: 1.45, curveX:  0.06, curveZ: -0.04 }, // Root 1
    { ox:  0.32, oz:  0.32, len: 1.35, curveX:  0.05, curveZ:  0.06 }, // Root 2
    { ox: -0.32, oz:  0.32, len: 1.35, curveX: -0.05, curveZ:  0.06 }, // Root 3
    { ox: -0.34, oz: -0.32, len: 1.45, curveX: -0.06, curveZ: -0.04 }, // Root 4
  ];

  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);

    // Initial sphere coordinates
    const origY = v.y; // -1 to +1
    const phi = Math.acos(Math.max(-1, Math.min(1, origY / radius))); // 0 (top) to PI (bottom)
    const theta = Math.atan2(v.z, v.x); // -PI to PI

    // --- 1. CROWN SCULPTING (Upper hemisphere, origY > -0.1) ---
    if (origY >= -0.15) {
      // Shape crown into rounded rectangular cross-section (molar contour)
      const cosT = Math.cos(theta);
      const sinT = Math.sin(theta);
      const p = 3.4;
      const superellipse = 1.0 / Math.pow(Math.pow(Math.abs(cosT * 1.05), p) + Math.pow(Math.abs(sinT * 0.95), p), 1 / p);
      
      // Horizontal expansion to form crown table
      v.x *= superellipse * 1.05;
      v.z *= superellipse * 1.05;

      // Crown height adjustment
      const normY = (origY + 0.15) / 1.15; // 0 at waist, 1 at top
      
      // Top occlusal surface sculpting (cusps & central fossa)
      if (origY > 0.45) {
        // Flatten crown top into chewing table
        const topFactor = Math.pow((origY - 0.45) / 0.55, 1.4);
        v.y = 0.65 + topFactor * 0.35;

        // Add 4 organic cusp mounds
        for (const cusp of cusps) {
          const dx = v.x - cusp.x;
          const dz = v.z - cusp.z;
          const distSq = dx * dx + dz * dz;
          const cuspHeight = cusp.h * Math.exp(-distSq / (2 * cusp.w * cusp.w));
          v.y += cuspHeight * topFactor;
        }

        // Central fossa depression (natural pit in the center)
        const centerDistSq = v.x * v.x + v.z * v.z;
        const pitDip = 0.14 * Math.exp(-centerDistSq / 0.12);
        v.y -= pitDip * topFactor;

        // Developmental grooves radiating outwards
        const grooveAngle = Math.sin(theta * 4);
        const grooveDip = Math.max(0, -grooveAngle) * 0.05 * (1 - Math.sqrt(centerDistSq));
        v.y -= grooveDip;
      } else {
        // Cervical bulge at middle third
        const bulge = Math.sin((origY + 0.15) / 0.6 * Math.PI) * 0.12;
        v.x += Math.cos(theta) * bulge;
        v.z += Math.sin(theta) * bulge;
      }
    }

    // --- 2. ROOT SCULPTING (Lower hemisphere, origY < -0.15) ---
    if (origY < -0.15) {
      const rootT = (-origY - 0.15) / 0.85; // 0 at cervical line to 1 at bottom
      
      // Find nearest root quadrant
      let nearestRoot = roots[0];
      let minDistSq = 999;
      for (const r of roots) {
        const dSq = (v.x - r.ox) * (v.x - r.ox) + (v.z - r.oz) * (v.z - r.oz);
        if (dSq < minDistSq) {
          minDistSq = dSq;
          nearestRoot = r;
        }
      }

      // Smoothly bifurcate/trifurcate into the 4 roots as we go down
      const splitFactor = Math.pow(rootT, 1.3);
      
      // Pull vertex towards nearest root center
      const targetCenterX = nearestRoot.ox + rootT * nearestRoot.curveX;
      const targetCenterZ = nearestRoot.oz + rootT * nearestRoot.curveZ;
      
      // Root thickness tapers downwards
      const rootThickness = 0.28 * (1.0 - rootT * 0.68);

      v.x = THREE.MathUtils.lerp(v.x, targetCenterX + (v.x - nearestRoot.ox) * 0.4, splitFactor);
      v.z = THREE.MathUtils.lerp(v.z, targetCenterZ + (v.z - nearestRoot.oz) * 0.4, splitFactor);

      // Elongate roots downward
      v.y = -0.2 - rootT * nearestRoot.len;

      // Round the root apex tips
      if (rootT > 0.88) {
        const tipS = (rootT - 0.88) / 0.12;
        const pinch = 1.0 - Math.pow(tipS, 1.5) * 0.6;
        v.x = targetCenterX + (v.x - targetCenterX) * pinch;
        v.z = targetCenterZ + (v.z - targetCenterZ) * pinch;
      }
    }

    pos.setXYZ(i, v.x, v.y, v.z);
  }

  // Recalculate completely smooth organic vertex normals
  geo.computeVertexNormals();
  geo.center(); // center the pivot perfectly
  return geo;
}

async function exportSmoothModels() {
  console.log("Generating flawless organic 3D molar...");

  const exporter = new GLTFExporter();
  const toothGeo = createOrganicMolarGeometry();

  // 1. Hero Tooth Group
  const heroGroup = new THREE.Group();
  heroGroup.name = "DentivoMolarTooth";

  // Translucent Enamel
  const enamelMat = new THREE.MeshPhysicalMaterial({
    name: "EnamelCrownAndRoots",
    color: new THREE.Color(0xffffff),
    roughness: 0.08,
    metalness: 0.02,
    transmission: 0.85,
    ior: 1.54,
    thickness: 1.8,
    clearcoat: 1.0,
    clearcoatRoughness: 0.04,
    attenuationColor: new THREE.Color(0x75f5c5),
    attenuationDistance: 0.8,
    transparent: true,
    opacity: 0.95,
  });

  const toothMesh = new THREE.Mesh(toothGeo, enamelMat);
  toothMesh.name = "EnamelCrownAndRoots";
  toothMesh.castShadow = true;
  toothMesh.receiveShadow = true;
  heroGroup.add(toothMesh);

  // Inner core scaled down to 82%
  const innerGeo = toothGeo.clone();
  innerGeo.scale(0.82, 0.82, 0.82);
  const coreMat = new THREE.MeshStandardMaterial({
    name: "GlowingInternalCore",
    color: new THREE.Color(0x75f5c5),
    emissive: new THREE.Color(0x0e5a44),
    emissiveIntensity: 0.65,
    roughness: 0.35,
  });
  const coreMesh = new THREE.Mesh(innerGeo, coreMat);
  coreMesh.name = "GlowingInternalCore";
  heroGroup.add(coreMesh);

  // Export hero tooth GLB
  await new Promise((resolve, reject) => {
    exporter.parse(
      heroGroup,
      (gltf) => {
        const buffer = Buffer.from(gltf);
        fs.writeFileSync(path.resolve('public/models/tooth.glb'), buffer);
        console.log(`Exported flawless tooth.glb (${(buffer.length / 1024).toFixed(1)} KB)`);
        resolve();
      },
      (err) => reject(err),
      { binary: true }
    );
  });

  // 2. Anatomy Tooth
  const anatomyGroup = new THREE.Group();
  anatomyGroup.name = "ToothAnatomyLayers";

  // Enamel shell
  const aEnamelMat = new THREE.MeshPhysicalMaterial({
    name: "Layer_Enamel",
    color: new THREE.Color(0xf2fbf7),
    transmission: 0.75,
    roughness: 0.12,
    ior: 1.54,
    transparent: true,
    opacity: 0.7,
  });
  const aEnamelMesh = new THREE.Mesh(toothGeo.clone(), aEnamelMat);
  aEnamelMesh.name = "Layer_Enamel";
  anatomyGroup.add(aEnamelMesh);

  // Dentin layer (scaled 0.88)
  const dentinGeo = toothGeo.clone();
  dentinGeo.scale(0.88, 0.88, 0.88);
  const dentinMat = new THREE.MeshStandardMaterial({
    name: "Layer_Dentin",
    color: new THREE.Color(0xf6e5af),
    roughness: 0.4,
  });
  const dentinMesh = new THREE.Mesh(dentinGeo, dentinMat);
  dentinMesh.name = "Layer_Dentin";
  anatomyGroup.add(dentinMesh);

  // Vascular Pulp core (scaled 0.65)
  const pulpGeo = toothGeo.clone();
  pulpGeo.scale(0.62, 0.68, 0.62);
  const pulpMat = new THREE.MeshStandardMaterial({
    name: "Layer_PulpChamber",
    color: new THREE.Color(0xe63946),
    emissive: new THREE.Color(0x9b111e),
    emissiveIntensity: 0.6,
    roughness: 0.3,
  });
  const pulpMesh = new THREE.Mesh(pulpGeo, pulpMat);
  pulpMesh.name = "Layer_PulpChamber";
  anatomyGroup.add(pulpMesh);

  // Gingiva gum ring
  const gumGeo = new THREE.TorusGeometry(0.85, 0.22, 24, 64);
  gumGeo.rotateX(Math.PI * 0.5);
  gumGeo.translate(0, -0.15, 0);
  const gumMat = new THREE.MeshStandardMaterial({
    name: "Layer_Gingiva",
    color: new THREE.Color(0xe87a90),
    roughness: 0.5,
  });
  const gumMesh = new THREE.Mesh(gumGeo, gumMat);
  gumMesh.name = "Layer_Gingiva";
  anatomyGroup.add(gumMesh);

  await new Promise((resolve, reject) => {
    exporter.parse(
      anatomyGroup,
      (gltf) => {
        const buffer = Buffer.from(gltf);
        fs.writeFileSync(path.resolve('public/models/tooth-anatomy.glb'), buffer);
        console.log(`Exported flawless tooth-anatomy.glb (${(buffer.length / 1024).toFixed(1)} KB)`);
        resolve();
      },
      (err) => reject(err),
      { binary: true }
    );
  });

  console.log("All smooth organic models regenerated successfully!");
}

exportSmoothModels().catch(console.error);

