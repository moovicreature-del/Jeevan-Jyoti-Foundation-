const fs = require('fs');
const path = require('path');
const { Resvg } = require('@resvg/resvg-js');

// ============================================================================
// OFFICIAL JEEVAN JYOTI FOUNDATION GHAZIPUR LOGO GENERATOR
// Crystal-clear vector emblem matching jeevan_jyoti_foundation_transparent.png
// ============================================================================

function createOfficialSvg(size = 512) {
  // Generate 24 sunburst rays
  const numRays = 24;
  const sunR = 108;
  const cx = 256;
  const cy = 250;
  let sunRaysSvg = '';

  for (let i = 0; i < numRays; i++) {
    const angle1 = (i * 360 / numRays) * (Math.PI / 180);
    const angle2 = ((i + 0.5) * 360 / numRays) * (Math.PI / 180);
    const x1 = cx + sunR * Math.cos(angle1);
    const y1 = cy + sunR * Math.sin(angle1);
    const x2 = cx + sunR * Math.cos(angle2);
    const y2 = cy + sunR * Math.sin(angle2);
    // Draw triangular ray
    sunRaysSvg += `<polygon points="${cx},${cy} ${x1.toFixed(1)},${y1.toFixed(1)} ${x2.toFixed(1)},${y2.toFixed(1)}" fill="#E64A19" />\n`;
  }

  // Generate Wheat / Laurel Leaf Garland along circle r = 145
  let garlandSvg = '';
  const numLeaves = 22;
  for (let i = 0; i < numLeaves; i++) {
    // Left side (from bottom to top)
    const angleL = 100 + (i * 160 / (numLeaves - 1));
    const radL = angleL * (Math.PI / 180);
    const lx = cx + 145 * Math.cos(radL);
    const ly = cy + 145 * Math.sin(radL);
    const rotL = angleL + 90;

    // Right side (from bottom to top)
    const angleR = 80 - (i * 160 / (numLeaves - 1));
    const radR = angleR * (Math.PI / 180);
    const rx = cx + 145 * Math.cos(radR);
    const ry = cy + 145 * Math.sin(radR);
    const rotR = angleR - 90;

    garlandSvg += `
      <g transform="translate(${lx.toFixed(1)}, ${ly.toFixed(1)}) rotate(${rotL.toFixed(1)})">
        <path d="M 0,0 C -6,-10 -8,-20 0,-26 C 8,-20 6,-10 0,0 Z" fill="#F8C300" stroke="#8A6500" stroke-width="1.2" />
        <line x1="0" y1="0" x2="0" y2="-22" stroke="#8A6500" stroke-width="1" />
      </g>
      <g transform="translate(${rx.toFixed(1)}, ${ry.toFixed(1)}) rotate(${rotR.toFixed(1)})">
        <path d="M 0,0 C -6,-10 -8,-20 0,-26 C 8,-20 6,-10 0,0 Z" fill="#F8C300" stroke="#8A6500" stroke-width="1.2" />
        <line x1="0" y1="0" x2="0" y2="-22" stroke="#8A6500" stroke-width="1" />
      </g>
    `;
  }

  // Beaded textured decorative ring
  let beadedRing = '';
  const numBeads = 96;
  for (let i = 0; i < numBeads; i++) {
    const angle = (i * 360 / numBeads) * (Math.PI / 180);
    const bx = cx + 178 * Math.cos(angle);
    const by = cy + 178 * Math.sin(angle);
    beadedRing += `<circle cx="${bx.toFixed(1)}" cy="${by.toFixed(1)}" r="1.8" fill="#F5B800" />\n`;
  }

  return `
<svg width="${size}" height="${size}" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Outer Arc for JEEVAN JYOTI FOUNDATION -->
    <path id="textArcUpper" d="M 50,256 A 206,206 0 1,1 462,256" fill="none" />
    <!-- Lower Arc for GHAZIPUR -->
    <path id="textArcLower" d="M 462,256 A 206,206 0 0,1 50,256" fill="none" />

    <!-- Radiant Sun Background Gradient -->
    <radialGradient id="sunBgGrad" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#FFF176" />
      <stop offset="70%" stop-color="#FFD54F" />
      <stop offset="100%" stop-color="#FFC107" />
    </radialGradient>

    <!-- Gold Edge Gradient -->
    <linearGradient id="goldEdge" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFECB3" />
      <stop offset="50%" stop-color="#FFC107" />
      <stop offset="100%" stop-color="#FFA000" />
    </linearGradient>
  </defs>

  <!-- 1. Outer Dark Purple Ring -->
  <circle cx="256" cy="256" r="248" fill="#2C0C4D" stroke="#F5B800" stroke-width="5" />
  <circle cx="256" cy="256" r="243" fill="none" stroke="#FFA000" stroke-width="1.5" />

  <!-- 2. Upper Curved Text: JEEVAN JYOTI FOUNDATION -->
  <text fill="#F5B800" font-family="'Cinzel', 'Georgia', serif" font-weight="900" font-size="28" letter-spacing="4.5">
    <textPath href="#textArcUpper" startOffset="50%" text-anchor="middle">JEEVAN JYOTI FOUNDATION</textPath>
  </text>

  <!-- 3. Lower Curved Text: GHAZIPUR -->
  <text fill="#F5B800" font-family="'Cinzel', 'Georgia', serif" font-weight="900" font-size="34" letter-spacing="8">
    <textPath href="#textArcLower" startOffset="50%" text-anchor="middle">GHAZIPUR</textPath>
  </text>

  <!-- 4. Decorative Stars on Sides of Purple Ring -->
  <g fill="#F5B800" stroke="#FFA000" stroke-width="0.5">
    <!-- Left Star -->
    <polygon points="54,256 50,250 56,252 59,247 60,253 66,255 60,257 59,263 56,258 50,260" transform="translate(-10, 0) scale(1.2)" />
    <!-- Right Star -->
    <polygon points="458,256 454,250 460,252 463,247 464,253 470,255 464,257 463,263 460,258 454,260" transform="translate(10, 0) scale(1.2)" />
  </g>

  <!-- 5. Inner Golden Yellow Circle Field -->
  <circle cx="256" cy="256" r="182" fill="#F5B800" stroke="#2C0C4D" stroke-width="3.5" />
  <circle cx="256" cy="256" r="176" fill="none" stroke="#2C0C4D" stroke-width="1.5" />
  <circle cx="256" cy="256" r="172" fill="none" stroke="#9A7000" stroke-width="1" />

  <!-- Beaded pattern -->
  ${beadedRing}

  <!-- 6. Laurel / Wheat Leaf Wreath Garland -->
  <g id="wheatGarland">
    ${garlandSvg}
  </g>

  <!-- 7. Center Sunburst Radiance Circle -->
  <circle cx="${cx}" cy="${cy}" r="${sunR}" fill="url(#sunBgGrad)" stroke="#2C0C4D" stroke-width="3" />

  <!-- Radiating Sunbeams -->
  <g id="sunRays" opacity="0.95">
    ${sunRaysSvg}
  </g>

  <!-- Inner Sunburst Border Ring -->
  <circle cx="${cx}" cy="${cy}" r="${sunR}" fill="none" stroke="#2C0C4D" stroke-width="3" />

  <!-- 8. Meditating Yogi / Buddha Silhouette in Padmasana (Lotus Pose) -->
  <g fill="#2C0C4D">
    <!-- Head with Ushnisha (Topknot) -->
    <ellipse cx="256" cy="188" rx="14" ry="17" />
    <circle cx="256" cy="168" r="6" />

    <!-- Neck & Shoulders -->
    <path d="
      M 251,204
      C 246,207 236,212 226,217
      C 220,220 216,227 215,236
      C 214,244 216,252 220,265
      C 223,273 226,279 230,282
      L 230,285
      C 220,286 200,288 185,296
      C 178,300 180,306 188,307
      C 202,308 226,306 242,303
      C 248,307 254,308 256,308
      C 258,308 264,307 270,303
      C 286,306 310,308 324,307
      C 332,306 334,300 327,296
      C 312,288 292,286 282,285
      L 282,282
      C 286,279 289,273 292,265
      C 296,252 298,244 297,236
      C 296,227 292,220 286,217
      C 276,212 266,207 261,204
      Z
    " />

    <!-- Forearms resting on knees in Gyan Mudra -->
    <path d="
      M 216,242
      C 210,252 200,270 192,285
      C 188,292 186,298 190,300
      C 195,301 202,298 210,288
      C 216,280 224,268 226,255
      Z
    " />
    <path d="
      M 296,242
      C 302,252 312,270 320,285
      C 324,292 326,298 322,300
      C 317,301 310,298 302,288
      C 296,280 288,268 286,255
      Z
    " />

    <!-- Lotus Pose Crossed Legs Base -->
    <ellipse cx="256" cy="303" rx="42" ry="10" />
    <!-- Folded knees -->
    <ellipse cx="198" cy="300" rx="18" ry="8" transform="rotate(-8, 198, 300)" />
    <ellipse cx="314" cy="300" rx="18" ry="8" transform="rotate(8, 314, 300)" />
  </g>

  <!-- 9. ESTD - 2018 Text -->
  <text x="256" y="328" font-family="'Cinzel', 'Arial', sans-serif" font-weight="900" font-size="16" fill="#2C0C4D" text-anchor="middle" letter-spacing="2">
    ESTD - 2018
  </text>
</svg>
  `.trim();
}

async function run() {
  const svgString = createOfficialSvg(512);

  // 1. Write official SVG to public/
  fs.writeFileSync(path.join(__dirname, '../public/favicon.svg'), svgString);
  fs.writeFileSync(path.join(__dirname, '../public/logo.svg'), svgString);

  // 2. Render to PNG using Resvg
  const resvg512 = new Resvg(svgString, {
    fitTo: { mode: 'width', value: 512 }
  });
  const png512 = resvg512.render().asPng();

  const resvg192 = new Resvg(svgString, {
    fitTo: { mode: 'width', value: 192 }
  });
  const png192 = resvg192.render().asPng();

  // Targets to replace permanently in public/
  const targets = [
    { file: 'pwa-icon-512.png', buf: png512 },
    { file: 'pwa-icon-192.png', buf: png192 },
    { file: 'pwa-icon-maskable-512.png', buf: png512 },
    { file: 'pwa-icon-maskable-192.png', buf: png192 },
    { file: 'apple-touch-icon.png', buf: png512 },
    { file: 'default-pwa-icon-512.png', buf: png512 },
    { file: 'default-pwa-icon-192.png', buf: png192 },
    { file: 'default-apple-touch-icon.png', buf: png512 },
    { file: 'logo.png', buf: png512 }
  ];

  for (const t of targets) {
    fs.writeFileSync(path.join(__dirname, '../public', t.file), t.buf);
    console.log(`Replaced public/${t.file} successfully!`);
    const distPath = path.join(__dirname, '../dist', t.file);
    if (fs.existsSync(path.dirname(distPath))) {
      fs.writeFileSync(distPath, t.buf);
      console.log(`Replaced dist/${t.file} successfully!`);
    }
  }

  // Also write SVG to dist
  const distFavicon = path.join(__dirname, '../dist/favicon.svg');
  if (fs.existsSync(path.dirname(distFavicon))) {
    fs.writeFileSync(distFavicon, svgString);
  }

  console.log('✅ ALL OLD ICONS PERMANENTLY REPLACED WITH NEW OFFICIAL LOGO!');
}

run().catch(console.error);
