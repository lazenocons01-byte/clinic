import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import * as fs from 'fs';
import * as path from 'path';

// Node polyfill for FileReader used by GLTFExporter binary mode
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

// Anatomical Molar Tooth Mesh Generator
function createMolarGeometry(scale = 1.0, isAnatomyCutaway = false, layerType = 'full') {
  // We will build an indexed BufferGeometry for the molar
  const positions = [];
  const normals = [];
  const uvs = [];
  const indices = [];

  // Crown parameters
  const crownRadialSegments = 72;
  const crownHeightSegments = 36;
  const occlusalRadialSegments = 24;

  // Cusp definitions (angles in radians, relative heights, positions)
  const cusps = [
    { angle: Math.PI * 0.25, r: 0.72, h: 1.28, power: 3.5, width: 0.9 }, // Mesiobuccal
    { angle: Math.PI * 0.75, r: 0.68, h: 1.22, power: 3.2, width: 0.85 }, // Distobuccal
    { angle: Math.PI * 1.25, r: 0.66, h: 1.18, power: 3.0, width: 0.85 }, // Distolingual
    { angle: Math.PI * 1.75, r: 0.74, h: 1.30, power: 3.5, width: 0.92 }, // Mesiolingual
  ];

  // Helper for cross-section radius of the crown at vertical height y
  function getCrownProfile(y, theta) {
    // Basic rounded rectangular / rhomboid base
    const cosT = Math.cos(theta);
    const sinT = Math.sin(theta);
    
    // Superellipse factor for molar squareness with rounded corners
    const p = 3.6;
    const rBase = 1.0 / Math.pow(Math.pow(Math.abs(cosT * 1.08), p) + Math.pow(Math.abs(sinT * 1.0), p), 1 / p);
    
    // Cervical bulge & waist
    // y goes from 0 (cervical line) to 1.0 (occlusal table rim)
    const t = Math.max(0, Math.min(1, y));
    const waist = 0.72; // narrow cervical line
    const bulge = 0.98; // max contour at middle third
    
    let radiusFactor;
    if (t < 0.35) {
      const s = t / 0.35;
      radiusFactor = waist + (bulge - waist) * Math.sin(s * Math.PI * 0.5);
    } else {
      const s = (t - 0.35) / 0.65;
      radiusFactor = bulge - 0.08 * Math.sin(s * Math.PI * 0.5);
    }

    return rBase * radiusFactor;
  }

  // Occlusal height computation at (r, theta)
  function getOcclusalHeight(r, theta, rMax) {
    const normR = Math.min(1, r / (rMax + 0.0001));
    const centralFossaHeight = 0.92;
    
    // Cusp contribution
    let cuspContribution = 0;
    for (const c of cusps) {
      let dAngle = Math.abs(theta - c.angle);
      if (dAngle > Math.PI) dAngle = 2 * Math.PI - dAngle;
      
      const angleInfluence = Math.exp(-Math.pow(dAngle / (0.65 * c.width), 2));
      const rInfluence = Math.exp(-Math.pow((normR - 0.75) / 0.35, 2));
      const cuspHeight = (c.h - centralFossaHeight) * angleInfluence * rInfluence;
      cuspContribution += cuspHeight;
    }

    // Groove depressions (sulcus between cusps)
    const groove1 = Math.exp(-Math.pow((theta - 0) / 0.22, 2)) * 0.12;
    const groove2 = Math.exp(-Math.pow((theta - Math.PI * 0.5) / 0.22, 2)) * 0.12;
    const groove3 = Math.exp(-Math.pow((theta - Math.PI) / 0.22, 2)) * 0.12;
    const groove4 = Math.exp(-Math.pow((theta - Math.PI * 1.5) / 0.22, 2)) * 0.12;
    const grooveDip = groove1 + groove2 + groove3 + groove4;

    // Center dip (central pit)
    const centerDip = (1 - Math.pow(normR, 1.8)) * 0.15;

    const finalY = centralFossaHeight + cuspContribution - grooveDip - centerDip * 0.5;
    return finalY;
  }

  // --- 1. BUILD CROWN WALLS ---
  const vertexMap = []; // [vIndex][uIndex]
  for (let iv = 0; iv <= crownHeightSegments; iv++) {
    const v = iv / crownHeightSegments; // 0 to 1
    const row = [];
    const yVal = v * 1.0; // from 0 to 1

    for (let iu = 0; iu <= crownRadialSegments; iu++) {
      const u = iu / crownRadialSegments;
      const theta = u * Math.PI * 2;
      
      const r = getCrownProfile(v, theta);
      let x = Math.cos(theta) * r;
      let z = Math.sin(theta) * r;
      let y = yVal;

      // At the top edge (v = 1.0), elevate to match the cusps rim
      if (v > 0.6) {
        const factor = (v - 0.6) / 0.4;
        const targetY = getOcclusalHeight(r, theta, r);
        y = yVal * (1 - factor) + targetY * factor;
      }

      // If cutaway anatomy mode (cross-section cut in front half)
      if (isAnatomyCutaway && z > 0 && Math.abs(x) < 0.95 && layerType === 'enamel') {
        // Leave a wedge cutaway to expose internal dentin and pulp!
        // We will clip or flag cutaway
      }

      positions.push(x * scale, y * scale, z * scale);
      uvs.push(u, v);
      row.push((positions.length / 3) - 1);
    }
    vertexMap.push(row);
  }

  // Generate crown wall faces
  for (let iv = 0; iv < crownHeightSegments; iv++) {
    for (let iu = 0; iu < crownRadialSegments; iu++) {
      const a = vertexMap[iv][iu];
      const b = vertexMap[iv + 1][iu];
      const c = vertexMap[iv + 1][iu + 1];
      const d = vertexMap[iv][iu + 1];

      indices.push(a, b, d);
      indices.push(b, c, d);
    }
  }

  // --- 2. BUILD OCCLUSAL CAP (TOP CHEWING SURFACE) ---
  const topRimIndices = vertexMap[crownHeightSegments];
  const capVertexMap = []; // [ir][iu]
  capVertexMap.push(topRimIndices); // outer edge

  for (let ir = 1; ir <= occlusalRadialSegments; ir++) {
    const rFactor = 1.0 - (ir / occlusalRadialSegments); // from 1.0 down to 0
    const row = [];

    if (ir === occlusalRadialSegments) {
      // Center point
      const centerY = getOcclusalHeight(0, 0, 1.0);
      positions.push(0, centerY * scale, 0);
      uvs.push(0.5, 0.5);
      const centerIdx = (positions.length / 3) - 1;
      row.push(centerIdx);
    } else {
      for (let iu = 0; iu <= crownRadialSegments; iu++) {
        const u = iu / crownRadialSegments;
        const theta = u * Math.PI * 2;
        const rMax = getCrownProfile(1.0, theta);
        const r = rMax * rFactor;

        const x = Math.cos(theta) * r;
        const z = Math.sin(theta) * r;
        const y = getOcclusalHeight(r, theta, rMax);

        positions.push(x * scale, y * scale, z * scale);
        uvs.push(0.5 + 0.5 * (x / rMax), 0.5 + 0.5 * (z / rMax));
        row.push((positions.length / 3) - 1);
      }
    }
    capVertexMap.push(row);
  }

  // Stitch occlusal concentric rings
  for (let ir = 0; ir < occlusalRadialSegments - 1; ir++) {
    for (let iu = 0; iu < crownRadialSegments; iu++) {
      const a = capVertexMap[ir][iu];
      const b = capVertexMap[ir + 1][iu];
      const c = capVertexMap[ir + 1][iu + 1];
      const d = capVertexMap[ir][iu + 1];

      // Clockwise orientation for top face
      indices.push(a, d, b);
      indices.push(d, c, b);
    }
  }

  // Stitch innermost ring to center vertex
  const centerIdx = capVertexMap[occlusalRadialSegments][0];
  const innerRing = capVertexMap[occlusalRadialSegments - 1];
  for (let iu = 0; iu < crownRadialSegments; iu++) {
    const a = innerRing[iu];
    const b = innerRing[iu + 1];
    indices.push(a, b, centerIdx);
  }

  // --- 3. BUILD 4 ANATOMICAL ROOTS ---
  // Roots coordinates at cervical neck
  const rootDefinitions = [
    { name: 'Mesiobuccal', ox: 0.46, oz: -0.42, curveX: 0.08, curveZ: -0.05, len: 2.15, r0: 0.36, r1: 0.09 },
    { name: 'Distobuccal',  ox: 0.44, oz:  0.42, curveX: 0.06, curveZ:  0.08, len: 1.95, r0: 0.34, r1: 0.08 },
    { name: 'Distolingual', ox: -0.44, oz:  0.42, curveX: -0.06, curveZ:  0.08, len: 2.05, r0: 0.35, r1: 0.08 },
    { name: 'Mesiolingual', ox: -0.46, oz: -0.42, curveX: -0.08, curveZ: -0.05, len: 2.20, r0: 0.37, r1: 0.09 },
  ];

  const rootSlices = 28;
  const rootRadialSegments = 24;

  for (const root of rootDefinitions) {
    const rootGrid = [];

    for (let is = 0; is <= rootSlices; is++) {
      const s = is / rootSlices; // 0 to 1
      const row = [];

      // Depth from cervical line (y=0) to root tip
      const y = -s * root.len;
      
      // Gentle natural organic curve towards apex
      const cx = root.ox + Math.pow(s, 1.8) * root.curveX;
      const cz = root.oz + Math.pow(s, 1.8) * root.curveZ;

      // Radius tapers from r0 down to r1, then closes with a rounded tip
      let rad = root.r0 * (1 - s * 0.75);
      if (s > 0.88) {
        // hemispherical rounded apex
        const tipS = (s - 0.88) / 0.12;
        rad = root.r0 * (1 - 0.88 * 0.75) * Math.cos(tipS * Math.PI * 0.5);
        if (rad < 0.01) rad = 0.01;
      }

      for (let ir = 0; ir <= rootRadialSegments; ir++) {
        const u = ir / rootRadialSegments;
        const theta = u * Math.PI * 2;
        
        // Root cross-section: slightly oval/flattened laterally
        const rx = Math.cos(theta) * rad * 0.95;
        const rz = Math.sin(theta) * rad * 1.15;

        const x = cx + rx;
        const z = cz + rz;

        positions.push(x * scale, y * scale, z * scale);
        uvs.push(u, s);
        row.push((positions.length / 3) - 1);
      }
      rootGrid.push(row);
    }

    // Connect root quads
    for (let is = 0; is < rootSlices; is++) {
      for (let ir = 0; ir < rootRadialSegments; ir++) {
        const a = rootGrid[is][ir];
        const b = rootGrid[is + 1][ir];
        const c = rootGrid[is + 1][ir + 1];
        const d = rootGrid[is][ir + 1];

        indices.push(a, b, d);
        indices.push(b, c, d);
      }
    }

    // Close apex tip
    const apexCenterIdx = rootGrid[rootSlices][0];
    const preApexRing = rootGrid[rootSlices - 1];
    for (let ir = 0; ir < rootRadialSegments; ir++) {
      indices.push(preApexRing[ir], rootGrid[rootSlices][ir], preApexRing[ir + 1]);
    }
  }

  // --- 4. BUILD FURCATION BASE (Floor connecting the 4 roots to cervical margin) ---
  const cervicalRing = vertexMap[0]; // y = 0
  const baseCenterY = -0.15;
  positions.push(0, baseCenterY * scale, 0);
  uvs.push(0.5, 0.5);
  const baseCenterIdx = (positions.length / 3) - 1;

  for (let iu = 0; iu < crownRadialSegments; iu++) {
    const a = cervicalRing[iu];
    const b = cervicalRing[iu + 1];
    indices.push(a, baseCenterIdx, b);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();

  return geometry;
}

// Internal Pulp Chamber & Root Canals Geometry
function createPulpGeometry(scale = 0.7) {
  const group = new THREE.Group();
  
  // Pulp chamber in crown with 4 pulp horns
  const pulpGeo = new THREE.DodecahedronGeometry(0.35 * scale, 2);
  // Deform pulp to reach into cusps
  const pos = pulpGeo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    let px = pos.getX(i);
    let py = pos.getY(i) + 0.7 * scale;
    let pz = pos.getZ(i);

    // stretch horns into the 4 cusps
    if (py > 0.7 * scale) {
      px *= 1.35;
      pz *= 1.35;
      py += 0.25 * scale;
    }
    pos.setXYZ(i, px, py, pz);
  }
  pulpGeo.computeVertexNormals();

  // Root canals (slender tubes extending down the 4 roots)
  const rootOrigins = [
    [ 0.44 * scale, 0.7 * scale, -0.40 * scale,  0.22 * scale, -1.8 * scale, -0.22 * scale],
    [ 0.42 * scale, 0.7 * scale,  0.40 * scale,  0.22 * scale, -1.6 * scale,  0.22 * scale],
    [-0.42 * scale, 0.7 * scale,  0.40 * scale, -0.22 * scale, -1.7 * scale,  0.22 * scale],
    [-0.44 * scale, 0.7 * scale, -0.40 * scale, -0.22 * scale, -1.8 * scale, -0.22 * scale],
  ];

  const geometries = [pulpGeo];
  for (const pts of rootOrigins) {
    const curve = new THREE.LineCurve3(
      new THREE.Vector3(pts[0], pts[1], pts[2]),
      new THREE.Vector3(pts[3], pts[4], pts[5])
    );
    const canalGeo = new THREE.TubeGeometry(curve, 16, 0.05 * scale, 8, false);
    geometries.push(canalGeo);
  }

  return { pulpGeo, rootOrigins };
}

async function exportModels() {
  console.log("Generating 3D Molar Tooth assets...");

  const exporter = new GLTFExporter();

  // 1. Full Hero Tooth Model (Translucent Enamel + PBR realistic shading)
  const heroToothGroup = new THREE.Group();
  heroToothGroup.name = "DentivoMolarTooth";

  const toothGeometry = createMolarGeometry(1.0);
  
  // Premium Translucent Enamel Material
  const enamelMaterial = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(0xffffff),
    roughness: 0.1,
    metalness: 0.02,
    transmission: 0.65, // glass/enamel translucency
    ior: 1.54, // natural hydroxyapatite enamel IOR
    thickness: 1.2,
    specularIntensity: 1.0,
    specularColor: new THREE.Color(0xffffff),
    clearcoat: 1.0,
    clearcoatRoughness: 0.05,
    attenuationColor: new THREE.Color(0x75f5c5), // Mint glow inside
    attenuationDistance: 0.8,
  });

  const toothMesh = new THREE.Mesh(toothGeometry, enamelMaterial);
  toothMesh.name = "EnamelCrownAndRoots";
  toothMesh.castShadow = true;
  toothMesh.receiveShadow = true;
  heroToothGroup.add(toothMesh);

  // Add internal glowing core matching the reference image caustics
  const innerCoreGeo = createMolarGeometry(0.85);
  const innerCoreMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0x75f5c5),
    emissive: new THREE.Color(0x105540),
    emissiveIntensity: 0.6,
    roughness: 0.3,
  });
  const innerCore = new THREE.Mesh(innerCoreGeo, innerCoreMat);
  innerCore.name = "GlowingInternalCore";
  heroToothGroup.add(innerCore);

  // Export hero tooth GLB
  await new Promise((resolve, reject) => {
    exporter.parse(
      heroToothGroup,
      (gltf) => {
        const buffer = Buffer.from(gltf);
        fs.writeFileSync(path.resolve('public/models/tooth.glb'), buffer);
        console.log(`Exported tooth.glb (${(buffer.length / 1024).toFixed(1)} KB)`);
        resolve();
      },
      (error) => reject(error),
      { binary: true }
    );
  });

  // 2. Multi-Layer Anatomy Model
  const anatomyGroup = new THREE.Group();
  anatomyGroup.name = "ToothAnatomyLayers";

  // Layer 1: Enamel Shell
  const enamelGeo = createMolarGeometry(1.0);
  const anatomyEnamelMat = new THREE.MeshPhysicalMaterial({
    name: "EnamelLayer",
    color: new THREE.Color(0xf2fbf7),
    transmission: 0.75,
    roughness: 0.15,
    ior: 1.54,
    transparent: true,
    opacity: 0.7,
  });
  const enamelMesh = new THREE.Mesh(enamelGeo, anatomyEnamelMat);
  enamelMesh.name = "Layer_Enamel";
  anatomyGroup.add(enamelMesh);

  // Layer 2: Dentin Core
  const dentinGeo = createMolarGeometry(0.88);
  const dentinMat = new THREE.MeshStandardMaterial({
    name: "DentinLayer",
    color: new THREE.Color(0xf6e5af), // warm ivory dentin
    roughness: 0.45,
    metalness: 0.05,
  });
  const dentinMesh = new THREE.Mesh(dentinGeo, dentinMat);
  dentinMesh.name = "Layer_Dentin";
  anatomyGroup.add(dentinMesh);

  // Layer 3: Pulp Tissue & Blood Vessels / Nerves
  const pulpMat = new THREE.MeshStandardMaterial({
    name: "PulpLayer",
    color: new THREE.Color(0xe63946), // vascular red pulp
    roughness: 0.3,
    emissive: new THREE.Color(0x9b111e),
    emissiveIntensity: 0.4,
  });
  const { pulpGeo, rootOrigins } = createPulpGeometry(0.55);
  const pulpMesh = new THREE.Mesh(pulpGeo, pulpMat);
  pulpMesh.name = "Layer_PulpChamber";
  anatomyGroup.add(pulpMesh);

  // Pulp canals
  for (let i = 0; i < rootOrigins.length; i++) {
    const pts = rootOrigins[i];
    const curve = new THREE.LineCurve3(
      new THREE.Vector3(pts[0], pts[1], pts[2]),
      new THREE.Vector3(pts[3], pts[4], pts[5])
    );
    const canalGeo = new THREE.TubeGeometry(curve, 12, 0.04, 8, false);
    const canalMesh = new THREE.Mesh(canalGeo, pulpMat);
    canalMesh.name = `Layer_RootCanal_${i + 1}`;
    anatomyGroup.add(canalMesh);
  }

  // Layer 4: Periodontal Gum / Gingiva collar
  const gumGeo = new THREE.TorusGeometry(0.85, 0.18, 16, 48);
  gumGeo.rotateX(Math.PI * 0.5);
  gumGeo.translate(0, -0.15, 0);
  const gumMat = new THREE.MeshStandardMaterial({
    name: "GumLayer",
    color: new THREE.Color(0xe87a90), // healthy gingival pink
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
        console.log(`Exported tooth-anatomy.glb (${(buffer.length / 1024).toFixed(1)} KB)`);
        resolve();
      },
      (error) => reject(error),
      { binary: true }
    );
  });

  console.log("All 3D models exported successfully!");
}

exportModels().catch((err) => {
  console.error("Error generating models:", err);
  process.exit(1);
});
