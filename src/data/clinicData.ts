import type { Doctor, Service, TechnologyItem, AnatomyLayer, Testimonial, Appointment } from '../types';

export const CLINIC_INFO = {
  name: 'Dentivo Dental Center of Excellence',
  tagline: 'Healthier Smiles. Brighter Lives.',
  address: '450 Lexington Avenue, Suite 1800, New York, NY 10017',
  phone: '+1 (212) 555-0198',
  emergencyPhone: '+1 (800) 555-9911',
  email: 'concierge@dentivoclinic.com',
  workingHours: [
    { days: 'Monday – Friday', hours: '8:00 AM – 7:30 PM' },
    { days: 'Saturday', hours: '9:00 AM – 5:00 PM' },
    { days: 'Sunday', hours: 'Emergency Care Only (24/7 On-Call)' }
  ],
  stats: [
    { label: 'Happy Patients', value: 15400, suffix: '+' },
    { label: 'Clinical Success Rate', value: 99.6, suffix: '%' },
    { label: 'Board Specialists', value: 18, suffix: '+' },
    { label: 'Years of Excellence', value: 16, suffix: ' Yrs' }
  ]
};

export const ANATOMY_LAYERS: AnatomyLayer[] = [
  {
    id: 'enamel',
    name: 'Enamel',
    scientificName: 'Substantia Adamantina',
    subtitle: 'The hardest substance in the human body',
    cameraPosition: [0, 0.35, 4.2],
    hotspotPosition: [0, 0.75, 0.65],
    color: '#75F5C5',
    hardness: '5.0 on Mohs scale (harder than steel)',
    thickness: '2.0 mm – 2.5 mm at cusp tips',
    description: 'Enamel forms the protective outer translucent shell of the anatomical crown. It withstands intense masticatory forces up to 200 pounds of pressure during chewing.',
    primaryFunction: 'Shields internal vital tooth structures from physical abrasion, acidic erosion, thermal shock, and bacterial invasion.',
    composition: '96% Hydroxyapatite crystalline minerals, 3% water, 1% organic matrix proteins (amelogenins & enamelins). Non-living tissue (cannot regenerate naturally once lost).',
    clinicalRisks: ['Demineralization from dietary acids', 'Micro-fractures from bruxism/clenching', 'Enamel hypoplasia'],
    careGuidelines: ['Remineralizing fluoride treatments', 'Nano-hydroxyapatite toothpaste', 'Nightguard therapy for grinders']
  },
  {
    id: 'dentin',
    name: 'Dentin',
    scientificName: 'Substantia Eburnea',
    subtitle: 'Micro-tubular shock-absorbing ivory matrix',
    cameraPosition: [0, 0.2, 4.2],
    hotspotPosition: [0.35, 0.35, 0.52],
    color: '#F4D06F',
    hardness: '3.0 on Mohs scale (resilient & elastic)',
    thickness: '3.0 mm – 3.5 mm surrounding pulp chamber',
    description: 'Dentin lies directly beneath enamel. It contains over 30,000 microscopic fluid-filled tubules per square millimeter connecting the outer tooth to nerve endings in the pulp.',
    primaryFunction: 'Acts as an elastic cushion preventing the brittle enamel from shattering during forceful chewing; transmits thermal and pressure signals.',
    composition: '70% Hydroxyapatite, 20% Type I collagen fibrils, 10% water. Living tissue maintained by odontoblasts that can lay down secondary and tertiary reparative dentin.',
    clinicalRisks: ['Exposed dentinal tubules causing acute hot/cold sensitivity', 'Accelerated carious decay once enamel is breached'],
    careGuidelines: ['Potassium nitrate desensitizing varnishes', 'Laser tubule occlusion', 'Biomimetic resin bonding']
  },
  {
    id: 'pulp',
    name: 'Dental Pulp',
    scientificName: 'Pulpa Dentis',
    subtitle: 'The living, sensitive core containing nerves and blood vessels',
    cameraPosition: [0, 0.1, 4.2],
    hotspotPosition: [-0.15, 0.15, 0.45],
    color: '#FF6B6B',
    hardness: 'Soft living vascular mesenchymal tissue',
    thickness: 'Central chamber (1.5mm) with root canal extensions',
    description: 'The anatomical heart of the tooth. Dental pulp houses a rich capillary plexus, unmyelinated and myelinated nerve fibers, sensory receptors, and mesenchymal stem cells.',
    primaryFunction: 'Nourishes the tooth structure, senses pain as an alarm for bacterial irritation, and synthesizes new protective dentin when stimulated.',
    composition: 'Fibroblasts, odontoblast palisade layer, capillary endothelia, sensory trigeminal nerve arborizations, lymphatic channels.',
    clinicalRisks: ['Irreversible pulpitis from deep carious lesions', 'Pulp necrosis requiring micro-endodontic root canal therapy'],
    careGuidelines: ['Routine 3D digital vitality scans', 'Pulp capping with bioactive mineral trioxide aggregate (MTA)', 'Painless laser endodontics']
  },
  {
    id: 'root',
    name: 'Roots & Canals',
    scientificName: 'Radix Dentis',
    subtitle: 'Deep anatomical anchors secured into the alveolar jawbone',
    cameraPosition: [0, -0.4, 4.3],
    hotspotPosition: [0.32, -0.85, 0.35],
    color: '#70C1B3',
    hardness: 'High tensile strength cementum-sheathed bone',
    thickness: 'Length: 12 mm – 16 mm into maxillary/mandibular bone',
    description: 'Molar roots diverge deep into the bone socket. Coated with cementum, they provide mechanical anchor points through thousands of periodontal Sharpey collagen fibers.',
    primaryFunction: 'Distributes chewing forces smoothly across the jawbone and conduits vascular supply from systemic circulation via the apical foramen.',
    composition: 'Root dentin sheath, thin cellular/acellular cementum coating, neurovascular bundle passing through apical foramina.',
    clinicalRisks: ['Periapical abscess formation', 'Root canal obliteration', 'External cervical resorption'],
    careGuidelines: ['3D CBCT imaging for canal anatomy tracing', 'Ultrasonic irrigation', 'Apex locator verification']
  },
  {
    id: 'gum',
    name: 'Gingiva & Periodontium',
    scientificName: 'Gingiva Proper',
    subtitle: 'The vital biological seal protecting roots and jawbone',
    cameraPosition: [0, -0.1, 4.2],
    hotspotPosition: [-0.45, -0.2, 0.65],
    color: '#FF9EAA',
    hardness: 'Keratinized mucosal barrier tissue',
    thickness: '1.5 mm – 2.0 mm stippled pink margin',
    description: 'Gingival tissue creates a hermetic biological barrier around the cervical neck of every tooth, preventing oral bacteria and pathogens from invading the underlying alveolar bone.',
    primaryFunction: 'Provides antimicrobial epithelial defense, holds teeth firmly in place, and cushions chewing forces.',
    composition: 'Stratified squamous keratinized epithelium, dense connective collagen fibers, junctional epithelium hemidesmosomes.',
    clinicalRisks: ['Gingivitis / Periodontitis', 'Gingival recession exposing sensitive root surfaces', 'Alveolar bone loss'],
    careGuidelines: ['Ultrasonic deep scaling & prophylaxis', 'Laser gingival contouring', 'Chlorhexidine targeted rinses']
  }
];

export const DOCTORS: Doctor[] = [
  {
    id: 'doc-1',
    name: 'Dr. Sarah Jenkins, DDS, FACP',
    title: 'Lead Prosthodontist & Clinical Director',
    qualification: 'DDS, Harvard School of Dental Medicine | Board Certified Prosthodontist',
    specialization: 'Full Mouth Rehabilitation & Digital Smile Design',
    experienceYears: 16,
    image: '/images/doctors/doctor-1.jpg',
    rating: 4.98,
    reviewCount: 342,
    completedCases: 3800,
    bio: 'Dr. Jenkins combines 16+ years of Ivy League clinical leadership with state-of-the-art computer-guided restorations. She is an international lecturer on aesthetic biomechanics.',
    education: ['Harvard University (DDS, Magna Cum Laude)', 'Columbia University (Specialty Residency in Prosthodontics)'],
    certifications: ['Fellow of American College of Prosthodontists (FACP)', 'Diplomate of American Board of Prosthodontics'],
    availableDays: ['Monday', 'Tuesday', 'Thursday', 'Friday']
  },
  {
    id: 'doc-2',
    name: 'Dr. Alexander Vance, DMD, ICOI',
    title: 'Surgical Implantologist & Maxillofacial Specialist',
    qualification: 'DMD, University of Pennsylvania | Fellowship in Surgical Implantology',
    specialization: '3D Guided Dental Implants & Bone Regeneration',
    experienceYears: 14,
    image: '/images/doctors/doctor-2.jpg',
    rating: 4.97,
    reviewCount: 289,
    completedCases: 4200,
    bio: 'Pioneer in robotic and computer-assisted flapless implant placement. Dr. Vance has delivered pain-free single-day implant restorations for patients worldwide.',
    education: ['University of Pennsylvania (DMD)', 'Mayo Clinic Maxillofacial Fellowship'],
    certifications: ['Master of the International Congress of Oral Implantologists (ICOI)', 'Member of AO (Academy of Osseointegration)'],
    availableDays: ['Monday', 'Wednesday', 'Friday', 'Saturday']
  },
  {
    id: 'doc-3',
    name: 'Dr. Maya Lin, DDS, AAACD',
    title: 'Aesthetic Dental Surgeon & Smile Architect',
    qualification: 'DDS, University of California, San Francisco (UCSF)',
    specialization: 'Ultra-Thin Porcelain Veneers & Invisible Orthodontics',
    experienceYears: 12,
    image: '/images/doctors/doctor-3.jpg',
    rating: 4.99,
    reviewCount: 412,
    completedCases: 2950,
    bio: 'Renowned for hand-crafted biomimetic veneers that look indistinguishable from natural enamel. Featured in American Academy of Cosmetic Dentistry publications.',
    education: ['UCSF School of Dentistry (DDS)', 'NYU Rosenthal Aesthetic Continuum'],
    certifications: ['Accredited Member, American Academy of Cosmetic Dentistry (AAACD)', 'Invisalign Diamond Top 1% Provider'],
    availableDays: ['Tuesday', 'Wednesday', 'Thursday', 'Saturday']
  },
  {
    id: 'doc-4',
    name: 'Dr. Robert Chen, DDS, MS',
    title: 'Endodontic Specialist & Microsurgery Pioneer',
    qualification: 'DDS, Tufts University | MS in Endodontics, University of Michigan',
    specialization: 'Painless Microscopic Root Canal Therapy',
    experienceYears: 15,
    image: '/images/doctors/doctor-4.jpg',
    rating: 4.96,
    reviewCount: 310,
    completedCases: 5100,
    bio: 'Utilizing Carl Zeiss 3D operating microscopes and painless acoustic irrigation, Dr. Chen turns feared root canal procedures into a relaxing, zero-pain experience.',
    education: ['Tufts University School of Dental Medicine (DDS)', 'University of Michigan (MS Endodontics)'],
    certifications: ['Diplomate, American Board of Endodontics', 'Specialist Member, American Association of Endodontists'],
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Friday']
  }
];

export const SERVICES: Service[] = [
  {
    id: 'general-dentistry',
    name: 'General Dentistry',
    tagline: 'Comprehensive biological oral care & preventative preservation',
    category: 'Preventative',
    description: 'Advanced preventative care using 3D intraoral digital scans, painless ultrasonic biofilm removal, and saliva microbiome mapping.',
    fullOverview: 'We move beyond drill-and-fill dentistry with biological diagnostics. Using 4K intraoral video magnification, we detect demineralization years before a cavity physically forms, allowing non-invasive remineralization therapy.',
    duration: '45 - 60 minutes',
    recoveryTime: 'Immediate (Zero downtime)',
    recommendedFrequency: 'Every 6 months',
    startingPrice: '$180',
    highlight: 'Includes 3D Digital Scan',
    benefits: [
      'Comprehensive 3D intraoral digital twin creation',
      'Painless ultrasonic EMS Airflow biofilm polishing',
      'Saliva pH and pathogenic bacterial culture screening',
      'Early non-invasive remineralization protocols'
    ],
    steps: [
      { stepNumber: 1, title: 'High-Definition 3D Scan', description: 'Zero radiation optical scanning of all tooth surfaces in 60 seconds.' },
      { stepNumber: 2, title: 'Biofilm Guided Therapy', description: 'Warm water and erythritol powder gently removes calculus without scraping enamel.' },
      { stepNumber: 3, title: 'Fluoride & Nano-HA Infusion', description: 'Deep mineral replenishment strengthens the crystalline enamel matrix.' }
    ]
  },
  {
    id: 'teeth-whitening',
    name: 'Teeth Whitening',
    tagline: 'Laser-activated power whitening with zero thermal sensitivity',
    category: 'Cosmetic',
    description: 'Medical-grade laser phototherapy lifts stubborn decades-old staining by 8 to 12 shades in a single 45-minute clinical session.',
    fullOverview: 'Unlike generic abrasive whitening treatments, our Dentivo LumiBrite cold-light laser system activates safe hydrogen peroxide gels without heating tooth pulpal tissue. You achieve red-carpet brightness with zero nerve sensitivity.',
    duration: '45 minutes',
    recoveryTime: 'Immediate',
    recommendedFrequency: 'Annual touch-up or every 18 months',
    startingPrice: '$350',
    highlight: '8-12 Shades Whiter in 45 Min',
    benefits: [
      'Cold-light laser prevents pulp irritation and sensitivity',
      'Customized desensitizing potassium-fluoride barrier',
      'Lifts coffee, red wine, tobacco, and intrinsic tetracycline stains',
      'Includes custom bespoke home-maintenance trays'
    ],
    steps: [
      { stepNumber: 1, title: 'Shade Mapping & Enamel Polish', description: 'Spectrophotometer digital measurement of baseline enamel chroma.' },
      { stepNumber: 2, title: 'Gingival Barrier Isolation', description: 'Medical liquid dam protects soft gum tissue completely.' },
      { stepNumber: 3, title: 'Laser Photo-Activation', description: 'Three 15-minute cycles of dual-wavelength cold laser light.' }
    ]
  },
  {
    id: 'dental-implants',
    name: 'Dental Implants',
    tagline: 'Permanent robotic 3D-guided titanium and zirconia root replacement',
    category: 'Surgical',
    description: 'Permanent biomechanical tooth replacement anchored directly into the jawbone using computer-navigated surgical guides.',
    fullOverview: 'Engineered with aerospace-grade biocompatible titanium or hypoallergenic Swiss ceramic zirconia. Every implant is positioned with sub-millimeter precision through 3D CBCT bone planning, ensuring lifelong osseointegration and natural mastication.',
    duration: '60 - 90 minutes per implant',
    recoveryTime: '24 - 48 hours mild healing',
    recommendedFrequency: 'Permanent Lifetime Solution',
    startingPrice: '$1,850',
    highlight: '99.6% Lifetime Success Rate',
    benefits: [
      'Prevents facial bone loss and collapses adjacent tooth alignment',
      'Feels, bites, and flosses exactly like a natural organic tooth',
      'Computer-guided flapless technique requires no extensive stitches',
      'Lifetime manufacturer warranty on implant fixture'
    ],
    steps: [
      { stepNumber: 1, title: 'CBCT 3D Bone Density Analysis', description: 'Micro-dose tomography constructs a 3D bone navigation model.' },
      { stepNumber: 2, title: 'Precision Robotic Insertion', description: 'Implant is placed through a keyhole stent in under 25 minutes.' },
      { stepNumber: 3, title: 'Custom Zirconia Crown Delivery', description: 'CAD/CAM sculpted crown matches surrounding tooth translucency.' }
    ]
  },
  {
    id: 'root-canal',
    name: 'Root Canal Treatment',
    tagline: 'Painless Zeiss microscopic therapy that saves your natural tooth',
    category: 'Restorative',
    description: 'High-precision micro-endodontics removes infected pulp tissue and seals root canals with zero discomfort under acoustic irrigation.',
    fullOverview: 'We transform the dreaded root canal into a relaxing experience with computer-controlled anesthesia (The Wand) and 25x Carl Zeiss magnification. By sterilizing microscopic accessory canals with photodynamic laser, we preserve your natural tooth structure for life.',
    duration: '60 minutes',
    recoveryTime: 'Zero to 24 hours mild tenderness',
    recommendedFrequency: 'As required',
    startingPrice: '$890',
    highlight: 'Zero-Pain Guarantee',
    benefits: [
      'Relieves excruciating toothache and throbbing inflammation instantly',
      'Microscopic visual field ensures zero hidden infected canals are missed',
      'Biocompatible bioceramic sealer guarantees hermetic apical closure',
      'Preserves your natural biological jawbone foundation'
    ],
    steps: [
      { stepNumber: 1, title: 'Microscopic Canal Localization', description: 'High-magnification optics locate even calcified micro-canals.' },
      { stepNumber: 2, title: 'GentleWave Acoustic Cleaning', description: 'Soundwaves flush bacteria from microscopic canal tubules.' },
      { stepNumber: 3, title: 'Bioceramic 3D Hermetic Seal', description: 'Warm vertical condensation locks out future bacterial infiltration.' }
    ]
  },
  {
    id: 'orthodontics',
    name: 'Orthodontics & Clear Aligners',
    tagline: 'Next-generation AI invisible aligners and discreet biomechanics',
    category: 'Cosmetic',
    description: 'Custom clear aligner therapy powered by AI tooth-movement simulations for rapid, discreet correction of crowding and bite alignment.',
    fullOverview: 'Say goodbye to painful metal brackets. Our medical-grade SmartTrack aligners gently guide teeth into optimal occlusion in 6 to 12 months. With remote weekly AI scans, you visit the clinic only when you want to.',
    duration: 'Initial consult: 30 minutes | Treatment: 6 - 12 months',
    recoveryTime: 'None (Wear aligners 22 hrs/day)',
    recommendedFrequency: 'Weekly aligner progression',
    startingPrice: '$2,400',
    highlight: 'Predictive 3D Outcome Simulation',
    benefits: [
      'Virtually invisible crystal-clear polymer aesthetic',
      'Removable for effortless eating, brushing, and flossing',
      'AI monitoring app tracks tooth movement from your smartphone',
      'Includes complimentary custom final retention package'
    ],
    steps: [
      { stepNumber: 1, title: 'iTero 5D Orthodontic Scan', description: 'Preview your finished straight smile on screen before starting.' },
      { stepNumber: 2, title: 'Bespoke Aligner Fabrication', description: 'Laser-trimmed aligners crafted for maximum comfort against gums.' },
      { stepNumber: 3, title: 'Virtual Weekly Tracking', description: 'AI evaluates tooth progression and prompts your next aligner set.' }
    ]
  },
  {
    id: 'cosmetic-dentistry',
    name: 'Cosmetic Dentistry & Veneers',
    tagline: 'Artisanal hand-layered porcelain veneers and smile transformations',
    category: 'Cosmetic',
    description: 'Ultra-thin feldspathic and E.max porcelain veneers custom sculpted to correct gaps, chips, discoloration, and asymmetry.',
    fullOverview: 'Our master ceramists hand-layer each veneer with micro-translucency matching natural enamel light reflection. Requiring minimal to zero tooth reduction, we design bespoke smiles tailored to your facial proportions and lip dynamics.',
    duration: '2 appointments across 10 days',
    recoveryTime: 'Immediate',
    recommendedFrequency: 'Veneers last 15 - 25+ years with proper hygiene',
    startingPrice: '$1,200 / tooth',
    highlight: 'Minimal Prep Biomimetic Ceramic',
    benefits: [
      'Indistinguishable from organic enamel with natural luminescence',
      'Permanently stain-proof against coffee, wine, and tea',
      'Corrects chipped edges, irregular lengths, and wide diastema gaps',
      'Interactive temporary trial smile lets you test-drive your new look'
    ],
    steps: [
      { stepNumber: 1, title: 'Digital Smile Simulation & Mockup', description: 'Test an aesthetic temporary smile directly in your mouth.' },
      { stepNumber: 2, title: 'Micro-Preparation & 3D Impression', description: 'Less than 0.3mm enamel contouring for maximum tooth conservation.' },
      { stepNumber: 3, title: 'Adhesive Cementation Bonding', description: 'High-strength composite resin bonding forms a monolithic bond.' }
    ]
  },
  {
    id: 'dental-crowns',
    name: 'Same-Day Dental Crowns',
    tagline: 'CAD/CAM milled monolithic zirconia crowns in a single 90-minute visit',
    category: 'Restorative',
    description: 'Precision robotic milling crafts high-strength monolithic ceramic crowns while you relax, eliminating messy goop and temporary crowns.',
    fullOverview: 'Using in-house German 5-axis CAD/CAM milling units, we restore severely damaged, cracked, or root-canal-treated teeth in one comfortable appointment. Sintered from solid zirconia or lithium disilicate for unmatched fracture resistance.',
    duration: '90 minutes (Single appointment)',
    recoveryTime: 'Eat immediately after appointment',
    recommendedFrequency: 'Lasts 15 to 20+ years',
    startingPrice: '$950',
    highlight: 'Single-Visit In-House Milling',
    benefits: [
      'No temporary crowns that break or fall off over weekends',
      'Digital 3D impressions eliminate gag-inducing silicone impression trays',
      'High-fracture resistance rated up to 1,200 MPa of flexural strength',
      'Perfect anatomical margins protect tooth from recurring margin decay'
    ],
    steps: [
      { stepNumber: 1, title: '3D Optical Scanning', description: 'High-speed video scanner creates a sub-micron 3D model of prepared tooth.' },
      { stepNumber: 2, title: 'CAD Architectural Design', description: 'Software maps natural occlusal grooves to fit opposing bite.' },
      { stepNumber: 3, title: 'In-Office Precision Milling & Sintering', description: 'Diamond burs sculpt crown from a solid ceramic block in 14 minutes.' }
    ]
  },
  {
    id: 'pediatric-dentistry',
    name: 'Pediatric Dentistry',
    tagline: 'Gentle, anxiety-free dental experiences for growing smiles',
    category: 'Pediatric',
    description: 'Compassionate pediatric care focusing on preventive interceptive orthodontics, sealants, and positive clinical memories.',
    fullOverview: 'We foster a lifetime of dental confidence through game-based pediatric checkups, virtual reality distraction headsets, and pain-free needleless laser dentistry. We nurture healthy tooth eruption and airway development from age 1.',
    duration: '35 - 45 minutes',
    recoveryTime: 'Immediate',
    recommendedFrequency: 'Every 6 months',
    startingPrice: '$140',
    highlight: 'VR Goggles & Gentle Touch',
    benefits: [
      'Child-friendly sensory-adapted dental suites with favorite cartoons',
      'BPA-free dental sealants protect deep chewing grooves against decay',
      'Interceptive myofunctional screening detects mouth-breathing early',
      'Zero-scare philosophy builds confident, lifelong oral habits'
    ],
    steps: [
      { stepNumber: 1, title: 'Playful Discovery Tour', description: 'Child explores dental instruments with gentle "count-the-teeth" game.' },
      { stepNumber: 2, title: 'Comfortable Foam Cleaning', description: 'Gentle organic berry-flavored prophylaxis paste polishes enamel.' },
      { stepNumber: 3, title: 'Protective Cusp Sealants', description: 'Flowable glass ionomer shields young permanent molars from cavities.' }
    ]
  }
];

export const TECHNOLOGIES: TechnologyItem[] = [
  {
    id: '3d-scan',
    title: 'iTero 5D HD Intraoral Scanning',
    subtitle: '6,000 optical frames per second with near-infrared caries detection',
    tag: 'Zero Radiation',
    description: 'Replaces uncomfortable goop impressions with an optical wand capturing 20-micron digital models. Identifies interproximal cavities beneath enamel before visible on conventional film.',
    clinicalImpact: 'Eliminates patient gag reflex; produces instant photorealistic 3D dental twin in 60 seconds.',
    specs: ['20-Micron Optical Accuracy', '6,000 Frames/sec High-Speed Sensor', 'Near-Infrared Imaging (NIRI)'],
    accuracy: '99.8% Dimensional Precision',
    iconName: 'ScanLine'
  },
  {
    id: 'ai-diagnostics',
    title: 'Dentivo AI Diagnostic Engine',
    subtitle: 'Neural-network computer vision trained on 2.5 million verified radiographs',
    tag: 'Machine Learning',
    description: 'Our proprietary AI assistant analyzes panoramic and bitewing scans instantaneously, highlighting early bone loss, hidden abscesses, and micro-cavities with confidence heatmaps.',
    clinicalImpact: 'Reduces diagnostic false-negatives by 48%; delivers objective, transparent visual reports directly to patients.',
    specs: ['Deep Residual Convolutional Network', 'Real-Time Millisecond Inference', 'FDA-Cleared Diagnostic Software'],
    accuracy: '98.9% Caries Detection Sensitivity',
    iconName: 'BrainCircuit'
  },
  {
    id: 'cbct-xray',
    title: 'Ultra-Low Dose 3D CBCT',
    subtitle: 'Volumetric maxillofacial cone beam tomography with 85% reduced radiation',
    tag: 'Green Radiation',
    description: 'Generates a 360° anatomical volume of jawbones, nerve pathways, and sinus cavities for safe implant osteotomies and root canal tracing at radiation doses comparable to an airplane flight.',
    clinicalImpact: 'Allows surgeons to map nerve canals with millimeter safety margins, preventing surgical complications.',
    specs: ['75-Micron Isotropic Voxel Resolution', 'Fast 4.9 Second Scan Time', 'Algorithmic Scatter Artifact Reduction'],
    accuracy: 'Sub-Millimeter Anatomical Accuracy',
    iconName: 'Radio'
  },
  {
    id: 'laser-dentistry',
    title: 'Waterlase Er,Cr:YSGG Laser',
    subtitle: 'Hydrophotonic painless hard and soft tissue biological sculpting',
    tag: 'Needleless & Painless',
    description: 'Harnesses energized water droplets energized by an Erbium laser to vaporize decay without vibration, drill noise, or friction heat. Often requires zero local anesthetic needles.',
    clinicalImpact: 'Patients experience no numbing post-procedure, allowing immediate return to meetings, speaking, and eating.',
    specs: ['2780 nm Hydrophotonic Wavelength', 'Coagulative Hemostatic Action', 'Sterilizes Cavity Preparation at 99.9%'],
    accuracy: 'Microscopic Tissue Preservation',
    iconName: 'Sparkles'
  },
  {
    id: 'robot-implants',
    title: 'Yomi Robotic-Assisted Surgery',
    subtitle: 'Haptic robotic guidance providing real-time spatial osteotomy control',
    tag: 'Next-Gen Robotics',
    description: 'Assists Dr. Vance by physically guiding the surgical handpiece with haptic feedback, preventing any deviation from the pre-planned surgical trajectory while accommodating patient movement.',
    clinicalImpact: 'Achieves exact angular entry down to 0.5 degrees, allowing minimally invasive flapless single-visit tooth replacement.',
    specs: ['Multi-Axis Robotic Arm', 'Dynamic Optical Rigid-Body Tracking', 'Continuous Collision Detection'],
    accuracy: '0.2 mm Positional Repeatability',
    iconName: 'Cpu'
  },
  {
    id: 'plasma-sterilization',
    title: 'Hospital-Grade Plasma Sterilization',
    subtitle: 'Class-B fractionated vacuum & cold gas plasma autoclaves',
    tag: 'Surgical Sterility',
    description: 'Operates under strict multi-chamber vacuum cycles with RFID tracking on every single dental handpiece, ensuring hospital-grade microbiological sterility surpassing CDC and OSHA guidelines.',
    clinicalImpact: 'Zero risk of cross-contamination; every instrument pouch is digitally logged and barcode-scanned at chairside.',
    specs: ['Fractionated Pulse Vacuum Chamber', 'Vaporized Hydrogen Peroxide (VHP)', 'Real-Time Chemical Indicator RFID'],
    accuracy: '100% Spore Log-6 Eradication',
    iconName: 'ShieldCheck'
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 'test-1',
    patientName: 'Sophia Montgomery',
    location: 'Manhattan, New York',
    treatment: 'Full Porcelain Veneers & Whitening',
    rating: 5,
    review: 'I had severe dental anxiety from childhood trauma. Dentivo completely redefined healthcare for me. The 3D preview showed me my future smile before Dr. Lin even touched a tooth. The outcome is so natural my closest friends think I was born with these teeth.',
    date: '2 weeks ago',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200',
    verified: true
  },
  {
    id: 'test-2',
    patientName: 'Marcus Sterling',
    location: 'Brooklyn, New York',
    treatment: 'Computer-Guided Dental Implant',
    rating: 5,
    review: 'Lost a molar playing rugby. Dr. Vance placed my implant using the 3D surgical guide in under 30 minutes with literally zero post-op pain. I took one Advil and was back working the next morning. Unbelievable precision.',
    date: '1 month ago',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    verified: true
  },
  {
    id: 'test-3',
    patientName: 'Elena Rostova',
    location: 'Greenwich, Connecticut',
    treatment: 'Same-Day Monolithic Crown',
    rating: 5,
    review: 'Cracked my crown at lunch. Dentivo scanned me at 2:00 PM, milled a gorgeous solid ceramic crown in their laboratory while I drank espresso in their lounge, and cemented it by 3:30 PM. No temporary crown, no second visit. The future is here.',
    date: '1 month ago',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
    verified: true
  },
  {
    id: 'test-4',
    patientName: 'David K. Rosenthal',
    location: 'Tribeca, New York',
    treatment: 'Microscopic Painless Root Canal',
    rating: 5,
    review: 'I was dreading a root canal for weeks. Dr. Robert Chen and his team were extraordinary. The acoustic irrigation felt like nothing more than an electric toothbrush. I literally fell asleep in the chair listening to noise-cancelling headphones. Zero pain.',
    date: '2 months ago',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
    verified: true
  }
];

export const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'app-1',
    referenceCode: 'DEN-2026-7821',
    patientName: 'Eleanor Vance',
    email: 'eleanor.v@horizoncapital.com',
    phone: '+1 (917) 555-8321',
    serviceId: 'teeth-whitening',
    serviceName: 'Laser Teeth Whitening',
    doctorId: 'doc-3',
    doctorName: 'Dr. Maya Lin, DDS, AAACD',
    date: '2026-11-15',
    timeSlot: '10:00 AM',
    status: 'confirmed',
    notes: 'Bride preparing for wedding photoshoot; requested gentle desensitizer.',
    createdAt: '2026-11-08T09:20:00Z'
  },
  {
    id: 'app-2',
    referenceCode: 'DEN-2026-9043',
    patientName: 'Jameson Thorne',
    email: 'j.thorne@apexdesigns.io',
    phone: '+1 (646) 555-4920',
    serviceId: 'dental-implants',
    serviceName: 'Dental Implants',
    doctorId: 'doc-2',
    doctorName: 'Dr. Alexander Vance, DMD, ICOI',
    date: '2026-11-16',
    timeSlot: '02:30 PM',
    status: 'confirmed',
    notes: 'Secondary consultation following CBCT scan of lower right first molar (#30).',
    createdAt: '2026-11-09T14:15:00Z'
  },
  {
    id: 'app-3',
    referenceCode: 'DEN-2026-4412',
    patientName: 'Catherine Sterling',
    email: 'catherine.s@sterlinglaw.com',
    phone: '+1 (212) 555-3310',
    serviceId: 'general-dentistry',
    serviceName: 'General Dentistry & 3D Scan',
    doctorId: 'doc-1',
    doctorName: 'Dr. Sarah Jenkins, DDS, FACP',
    date: '2026-11-18',
    timeSlot: '11:15 AM',
    status: 'pending',
    notes: 'Bi-annual preventative checkup; interested in nightguard for teeth clenching.',
    createdAt: '2026-11-10T11:00:00Z'
  }
];

export const TIME_SLOTS = [
  { time: '08:30 AM', period: 'Morning', available: true },
  { time: '09:15 AM', period: 'Morning', available: true },
  { time: '10:00 AM', period: 'Morning', available: false }, // booked
  { time: '11:00 AM', period: 'Morning', available: true },
  { time: '11:45 AM', period: 'Morning', available: true },
  { time: '01:30 PM', period: 'Afternoon', available: true },
  { time: '02:15 PM', period: 'Afternoon', available: true },
  { time: '03:00 PM', period: 'Afternoon', available: false }, // booked
  { time: '03:45 PM', period: 'Afternoon', available: true },
  { time: '04:30 PM', period: 'Evening', available: true },
  { time: '05:15 PM', period: 'Evening', available: true },
  { time: '06:00 PM', period: 'Evening', available: true }
];
