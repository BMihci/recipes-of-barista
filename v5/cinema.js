        /* =====================================================
           3D ANİMASYON HİKÂYELERİ (v6.1)
           Bütün hikâye (1–5. şubeler, zaman makinesi, dönemler, final) gerçek zamanlı 3D sahnelerle
           anlatılır: yumuşak ışık ve gölgeler, ACES ton eşleme, yuvarlak hatlı sevimli 3D ayıcıklar,
           kamera hareketleri (yaklaşma, yörünge, vinç), karakter animasyonları ve altyazılar.
           Aynı sahne kurucusu oyun sırasında dönem arka planlarını da çizer.
           ===================================================== */
        const World3D = (function () {
            let R = null;
            function renderer() {
                if (R) return R;
                R = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true, alpha: false });
                R.setPixelRatio(Math.min(1.5, window.devicePixelRatio || 1));
                if (THREE.sRGBEncoding !== undefined) R.outputEncoding = THREE.sRGBEncoding;
                if (THREE.ACESFilmicToneMapping !== undefined) { R.toneMapping = THREE.ACESFilmicToneMapping; R.toneMappingExposure = 1.05; }
                if (R.shadowMap) { R.shadowMap.enabled = true; if (THREE.PCFSoftShadowMap !== undefined) R.shadowMap.type = THREE.PCFSoftShadowMap; }
                return R;
            }
            const col = c => srgb(typeof c === 'string' ? parseInt(c.slice(1), 16) : c);
            /* çizgi roman modu: düz (cel) gölgelendirme + mürekkep kontur */
            let TOON = false, GRAD = null;
            function gradMap() {
                if (GRAD || !THREE.DataTexture) return GRAD;
                GRAD = new THREE.DataTexture(new Uint8Array([105, 105, 105, 255, 178, 178, 178, 255, 255, 255, 255, 255]), 3, 1, THREE.RGBAFormat);
                GRAD.minFilter = GRAD.magFilter = THREE.NearestFilter; GRAD.generateMipmaps = false; GRAD.needsUpdate = true;
                return GRAD;
            }
            const TOON_KEYS = ['transparent', 'opacity', 'side', 'map', 'emissive', 'emissiveIntensity'];
            const std = (c, o) => {
                if (TOON && THREE.MeshToonMaterial) {
                    const p = { color: col(c), gradientMap: gradMap() };
                    if (o) TOON_KEYS.forEach(k => { if (o[k] !== undefined) p[k] = o[k]; });
                    return new THREE.MeshToonMaterial(p);
                }
                return new THREE.MeshStandardMaterial(Object.assign({ color: col(c), roughness: 0.62, metalness: 0.04 }, o || {}));
            };
            const INK = 0x16110d, OLX = {};
            let OLF = null;
            function olMat(th) {   // normal yönünde şişirilmiş arka yüz = kontur
                const k = th.toFixed(3);
                if (OLX[k]) return OLX[k];
                const m = new THREE.MeshBasicMaterial({ color: INK, side: THREE.BackSide });
                m.onBeforeCompile = s => { s.vertexShader = s.vertexShader.replace('#include <begin_vertex>', 'vec3 transformed = vec3(position) + normal * ' + k + ';'); };
                m.customProgramCacheKey = () => 'ol' + k; m.userData.shared = true;
                return (OLX[k] = m);
            }
            function olFlat() { if (!OLF) { OLF = new THREE.MeshBasicMaterial({ color: INK, side: THREE.BackSide }); OLF.userData.shared = true; } return OLF; }
            function inkScene(g, ground) {
                const list = [];
                g.traverse(o => {
                    if (!o.isMesh || o === ground || o.userData.ol) return;
                    const geo = o.geometry; if (!geo || geo.type === 'PlaneGeometry') return;
                    const m0 = [].concat(o.material)[0]; if (m0 && (m0.isMeshBasicMaterial || (m0.transparent && m0.opacity < 0.9))) return;
                    if (!geo.boundingSphere) { if (!geo.computeBoundingSphere) return; geo.computeBoundingSphere(); }
                    const s = Math.max(Math.abs(o.scale.x), Math.abs(o.scale.y), Math.abs(o.scale.z)) || 1, r = geo.boundingSphere.radius * s;
                    if (r < 0.06) return;
                    list.push([o, r, s]);
                });
                list.forEach(([o, r, s]) => {
                    const w = r > 3 ? 0.06 : r > 0.9 ? 0.04 : r > 0.3 ? 0.026 : 0.018, geo = o.geometry, P = geo.parameters || {};
                    let ol;
                    if (geo.type === 'BoxGeometry') { ol = new THREE.Mesh(geo, olFlat()); ol.scale.set(1 + 2 * w / (P.width * Math.abs(o.scale.x) || 1), 1 + 2 * w / (P.height * Math.abs(o.scale.y) || 1), 1 + 2 * w / (P.depth * Math.abs(o.scale.z) || 1)); }
                    else if (geo.type === 'CylinderGeometry' && !P.openEnded) { const rr = Math.max(P.radiusTop, P.radiusBottom) || 1; ol = new THREE.Mesh(geo, olFlat()); ol.scale.set(1 + w / (rr * Math.abs(o.scale.x)), 1 + 2 * w / (P.height * Math.abs(o.scale.y) || 1), 1 + w / (rr * Math.abs(o.scale.z))); }
                    else ol = new THREE.Mesh(geo, olMat(Math.round(w / s * 1000) / 1000));
                    ol.userData.ol = true; ol.castShadow = false; ol.receiveShadow = false; ol.raycast = () => {};
                    o.add(ol);
                });
            }
            const basic = (c, o) => new THREE.MeshBasicMaterial(Object.assign({ color: col(c) }, o || {}));
            function canvasTex(w, h, draw, rep) {
                const cv = document.createElement('canvas'); cv.width = w; cv.height = h;
                draw(cv.getContext('2d'), w, h);
                const t = new THREE.CanvasTexture(cv);
                if (THREE.sRGBEncoding !== undefined) t.encoding = THREE.sRGBEncoding;
                if (rep) { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rep[0], rep[1]); }
                return t;
            }
            const skyTex = (a, b, stars) => canvasTex(64, 256, (c, w, h) => {
                const g = c.createLinearGradient(0, 0, 0, h); g.addColorStop(0, b); g.addColorStop(0.72, a); g.addColorStop(1, a);
                c.fillStyle = g; c.fillRect(0, 0, w, h);
                if (stars) { c.fillStyle = '#fff'; for (let i = 0; i < 50; i++) c.fillRect(Math.random() * w, Math.random() * h * 0.6, 1, 1); }
            });
            const winTex = (bg, lit, cols, rows) => canvasTex(128, 256, (c, w, h) => {
                c.fillStyle = bg; c.fillRect(0, 0, w, h);
                for (let x = 0; x < cols; x++) for (let y = 0; y < rows; y++) { c.fillStyle = Math.random() < 0.65 ? lit : 'rgba(0,0,0,.4)'; c.fillRect(8 + x * (w - 16) / cols, 8 + y * (h - 16) / rows, (w - 16) / cols - 6, (h - 16) / rows - 8); }
            });
            const archTex = (bg, dark, n, rows) => canvasTex(512, 256, (c, w, h) => {
                c.fillStyle = bg; c.fillRect(0, 0, w, h); c.fillStyle = dark;
                for (let r = 0; r < rows; r++) for (let i = 0; i < n; i++) {
                    const x = i * w / n + w / n * 0.2, aw = w / n * 0.6, y0 = r * h / rows + h / rows * 0.25, ah = h / rows * 0.65;
                    c.beginPath(); c.moveTo(x, y0 + ah); c.lineTo(x, y0 + aw / 2); c.arc(x + aw / 2, y0 + aw / 2, aw / 2, Math.PI, 0); c.lineTo(x + aw, y0 + ah); c.fill();
                }
            });
            const stripeTex = (a, b, n, horiz) => canvasTex(256, 256, (c, w, h) => { for (let i = 0; i < n; i++) { c.fillStyle = i % 2 ? b : a; if (horiz) c.fillRect(0, i * h / n, w, h / n + 1); else c.fillRect(i * w / n, 0, w / n + 1, h); } });
            const spiralTex = (a, b) => canvasTex(256, 256, (c, w, h) => {
                c.fillStyle = a; c.fillRect(0, 0, w, h); c.translate(w / 2, h / 2);
                for (let i = 0; i < 9; i++) { c.rotate(Math.PI * 2 / 9); const g = c.createLinearGradient(0, 0, 128, 0); g.addColorStop(0, '#fff'); g.addColorStop(1, b); c.fillStyle = g; c.beginPath(); c.moveTo(0, 0); c.quadraticCurveTo(70, -40, 140, -10); c.quadraticCurveTo(70, -10, 0, 0); c.fill(); }
                const r = c.createRadialGradient(0, 0, 4, 0, 0, 60); r.addColorStop(0, '#fff'); r.addColorStop(1, 'rgba(255,255,255,0)'); c.fillStyle = r; c.beginPath(); c.arc(0, 0, 60, 0, 7); c.fill();
            });
            const signTex = (txt, bg, fg) => canvasTex(512, 128, (c, w, h) => { c.fillStyle = bg; c.fillRect(0, 0, w, h); c.fillStyle = fg; c.font = 'bold 74px Baloo 2, sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(txt, w / 2, h / 2 + 4); });

            function add(g, geo, mat, x, y, z, rx, ry, rz, s) {
                const m = new THREE.Mesh(geo, mat);
                m.position.set(x || 0, y || 0, z || 0);
                if (rx || ry || rz) m.rotation.set(rx || 0, ry || 0, rz || 0);
                if (s) { if (Array.isArray(s)) m.scale.set(s[0], s[1], s[2]); else m.scale.set(s, s, s); }
                g.add(m); return m;
            }
            const SPH = (r, a, b) => new THREE.SphereGeometry(r, a || 24, b || 18);

            /* ---------- dekorlar ---------- */
            const P = {
                pyramid(g, x, z, s) { add(g, new THREE.ConeGeometry(s, s * 1.15, 4), std('#E2B25C', { roughness: 0.9 }), x, s * 0.575, z, 0, Math.PI / 4); },
                palm(g, x, z, h) {
                    h = h || 2.4; add(g, new THREE.CylinderGeometry(0.08, 0.13, h, 8), std('#8A5A2A'), x, h / 2, z, 0, 0, 0.08);
                    for (let i = 0; i < 6; i++) add(g, new THREE.ConeGeometry(0.22, 1.5, 4), std(i % 2 ? '#3F8A3A' : '#5FAE4E'), x + Math.cos(i) * 0.5, h - 0.1, z + Math.sin(i) * 0.5, Math.PI / 2 + 0.5, i, 0, [1, 1, 0.3]);
                },
                column(g, x, z, h, c) { add(g, new THREE.CylinderGeometry(0.2, 0.24, h, 14), std(c || '#F4EFE6'), x, h / 2, z); add(g, new THREE.BoxGeometry(0.62, 0.16, 0.62), std(c || '#F4EFE6'), x, h + 0.08, z); },
                temple(g, x, z, w) {
                    add(g, new THREE.BoxGeometry(w + 0.6, 0.4, 2.6), std('#E6DED0'), x, 0.2, z);
                    for (let i = 0; i < 6; i++) { P.column(g, x - w / 2 + i * w / 5, z + 0.9, 2.6); P.column(g, x - w / 2 + i * w / 5, z - 0.9, 2.6); }
                    add(g, new THREE.BoxGeometry(w + 0.6, 0.3, 2.6), std('#EDE6DA'), x, 3.0, z);
                    add(g, new THREE.CylinderGeometry(1.5, 1.5, w + 0.6, 3), std('#F4EFE6'), x, 3.55, z, 0, 0, Math.PI / 2, [0.45, 1, 1]);
                },
                mountain(g, x, z, s, snow) { add(g, new THREE.ConeGeometry(s, s * 1.4, 7), std(snow ? '#5C7A92' : '#8C7A5A', { roughness: 0.95 }), x, s * 0.7, z); if (snow) add(g, new THREE.ConeGeometry(s * 0.42, s * 0.6, 7), std('#FFFFFF'), x, s * 1.12, z); },
                longship(g, x, z, ry) {
                    const s = new THREE.Group(); s.position.set(x, 0.2, z); s.rotation.y = ry || 0; g.add(s);
                    add(s, new THREE.SphereGeometry(1, 20, 10, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), std('#7A4A22'), 0, 0.5, 0, 0, 0, 0, [2.6, 0.7, 0.75]);
                    add(s, new THREE.ConeGeometry(0.12, 1.3, 8), std('#7A4A22'), 2.6, 1.2, 0, 0, 0, -0.5);
                    add(s, SPH(0.18, 10, 8), std('#5A3416'), 2.95, 1.75, 0);
                    for (let i = 0; i < 6; i++) add(s, new THREE.CylinderGeometry(0.22, 0.22, 0.05, 16), std(['#C0392B', '#F2C25A', '#2F6FB5'][i % 3]), -1.6 + i * 0.6, 0.55, 0.62, Math.PI / 2);
                    add(s, new THREE.CylinderGeometry(0.06, 0.06, 2.6, 8), std('#5A3416'), 0, 1.7, 0);
                    add(s, new THREE.PlaneGeometry(1.8, 1.4), new THREE.MeshStandardMaterial({ map: stripeTex('#C0392B', '#F4EFE6', 6), side: THREE.DoubleSide }), 0, 2.1, 0.05);
                },
                colosseum(g, x, z, r) { add(g, new THREE.CylinderGeometry(r, r, r * 0.75, 40, 1, true), new THREE.MeshStandardMaterial({ map: archTex('#D9B98A', '#5A3A1A', 14, 3), side: THREE.DoubleSide }), x, r * 0.375, z); },
                aqueduct(g, x, z, w) { add(g, new THREE.BoxGeometry(w, 2.4, 0.5), new THREE.MeshStandardMaterial({ map: archTex('#CDB48A', '#5A3A1A', 6, 2) }), x, 1.2, z); },
                mosque(g, x, z, s) {
                    add(g, new THREE.CylinderGeometry(1.6 * s, 1.8 * s, 1.4 * s, 16), std('#EDE3D2'), x, 0.7 * s, z);
                    add(g, new THREE.SphereGeometry(1.5 * s, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2), std('#7FA8B8', { metalness: 0.3 }), x, 1.4 * s, z);
                    add(g, new THREE.ConeGeometry(0.1 * s, 0.6 * s, 8), std('#F2C25A', { metalness: 0.8 }), x, 3.1 * s, z);
                    [-1, 1].forEach(k => { add(g, new THREE.CylinderGeometry(0.16 * s, 0.2 * s, 4.6 * s, 10), std('#F4EFE6'), x + k * 2.6 * s, 2.3 * s, z); add(g, new THREE.ConeGeometry(0.22 * s, 1 * s, 10), std('#7FA8B8'), x + k * 2.6 * s, 5.1 * s, z); add(g, new THREE.TorusGeometry(0.26 * s, 0.05 * s, 6, 14), std('#D9A73A'), x + k * 2.6 * s, 3.7 * s, z, Math.PI / 2); });
                },
                clocktower(g, x, z) {
                    add(g, new THREE.BoxGeometry(1.2, 6, 1.2), std('#B89A6A'), x, 3, z);
                    add(g, new THREE.ConeGeometry(0.95, 1.8, 4), std('#3E4A52'), x, 6.9, z, 0, Math.PI / 4);
                    const ct = canvasTex(128, 128, (c) => { c.fillStyle = '#F7F1DE'; c.beginPath(); c.arc(64, 64, 60, 0, 7); c.fill(); c.strokeStyle = '#222'; c.lineWidth = 6; c.stroke(); c.lineWidth = 5; c.beginPath(); c.moveTo(64, 64); c.lineTo(64, 22); c.moveTo(64, 64); c.lineTo(94, 70); c.stroke(); });
                    add(g, new THREE.CircleGeometry(0.48, 24), new THREE.MeshBasicMaterial({ map: ct }), x, 5.1, z + 0.61);
                },
                building(g, x, z, w, h, c, lit) { add(g, new THREE.BoxGeometry(w, h, w * 0.8), new THREE.MeshStandardMaterial({ map: winTex(c, lit || '#FFE9A8', 3, Math.max(3, Math.round(h))) }), x, h / 2, z); },
                skyscraper(g, x, z, w, h) { const t = winTex('#26203A', '#FFD86B', 4, Math.round(h * 1.5)); const m = new THREE.MeshStandardMaterial({ map: t, emissiveMap: t, emissive: col('#ffffff'), emissiveIntensity: 0.35, roughness: 0.6 }); add(g, new THREE.BoxGeometry(w, h, w), m, x, h / 2, z); add(g, new THREE.ConeGeometry(w * 0.35, h * 0.18, 4), std('#C9B27A', { metalness: 0.7 }), x, h + h * 0.09, z, 0, Math.PI / 4); },
                balloon(g, x, y, z) { add(g, SPH(1.2), new THREE.MeshStandardMaterial({ map: stripeTex('#2F4F9F', '#E8C04A', 10) }), x, y, z, 0, 0, 0, [1, 1.2, 1]); add(g, new THREE.BoxGeometry(0.6, 0.45, 0.6), std('#8A5A2A'), x, y - 1.9, z); },
                dome(g, x, z, s) {
                    add(g, new THREE.BoxGeometry(3.6 * s, 1.5 * s, 3.6 * s), std('#E8DCC4'), x, 0.75 * s, z);
                    add(g, new THREE.CylinderGeometry(1.7 * s, 1.7 * s, 1.4 * s, 8), std('#EFE4CF'), x, 2.2 * s, z);
                    add(g, new THREE.SphereGeometry(1.6 * s, 8, 10, 0, Math.PI * 2, 0, Math.PI / 2), std('#C4623A'), x, 2.9 * s, z, 0, 0, 0, [1, 1.3, 1]);
                    add(g, new THREE.CylinderGeometry(0.3 * s, 0.3 * s, 0.7 * s, 8), std('#F4EFE6'), x, 5.3 * s, z);
                },
                tree(g, x, z, c, s) { s = s || 1; add(g, new THREE.CylinderGeometry(0.1 * s, 0.14 * s, 1 * s, 8), std('#7A4A22'), x, 0.5 * s, z); add(g, SPH(0.7 * s, 16, 12), std(c || '#5FA463', { roughness: 0.85 }), x, 1.4 * s, z); },
                house(g, x, z, c, ry) { const h = new THREE.Group(); h.position.set(x, 0, z); h.rotation.y = ry || 0; g.add(h); add(h, new THREE.BoxGeometry(1.6, 1.3, 1.4), std('#FFF6EA'), 0, 0.65, 0); add(h, new THREE.ConeGeometry(1.3, 0.9, 4), std(c || '#E07A5F'), 0, 1.75, 0, 0, Math.PI / 4); add(h, new THREE.BoxGeometry(0.35, 0.6, 0.05), std('#8A5A2A'), 0, 0.3, 0.71); add(h, new THREE.BoxGeometry(0.35, 0.35, 0.05), basic('#FFE9A8'), 0.45, 0.85, 0.71); },
                water(g, z, c, w) { add(g, new THREE.PlaneGeometry(w || 80, 6), std(c || '#3E8FC8', { roughness: 0.12, metalness: 0.35 }), 0, 0.02, z, -Math.PI / 2); },
                lamp(g, x, z) { add(g, new THREE.CylinderGeometry(0.05, 0.07, 2.4, 8), std('#222'), x, 1.2, z); add(g, SPH(0.16, 10, 8), basic('#FFE08A'), x, 2.45, z); const l = new THREE.PointLight(0xFFD27A, 0.8, 6); l.position.set(x, 2.4, z); g.add(l); },
                cup(g, x, y, z, s, c) { s = s || 1; add(g, new THREE.CylinderGeometry(0.16 * s, 0.12 * s, 0.22 * s, 18), std(c || '#FFFDF8'), x, y + 0.11 * s, z); add(g, new THREE.CylinderGeometry(0.15 * s, 0.15 * s, 0.01, 18), std('#6B3A1A'), x, y + 0.215 * s, z); add(g, new THREE.TorusGeometry(0.07 * s, 0.02 * s, 6, 12), std(c || '#FFFDF8'), x + 0.17 * s, y + 0.12 * s, z); },
                espressoMachine(g, x, z) { add(g, new THREE.BoxGeometry(1.2, 0.9, 0.7), std('#C9CED4', { metalness: 0.8, roughness: 0.25 }), x, 1.55, z); add(g, new THREE.BoxGeometry(1.25, 0.12, 0.75), std('#B8653A', { metalness: 0.7 }), x, 2.06, z); [-0.3, 0.3].forEach(k => add(g, new THREE.CylinderGeometry(0.06, 0.08, 0.22, 10), std('#333'), x + k, 1.0, z + 0.25)); },
                counter(g, z) { add(g, new THREE.BoxGeometry(7, 1.1, 1.1), std('#8A5530'), 0, 0.55, z); add(g, new THREE.BoxGeometry(7.2, 0.1, 1.25), std('#E8C49A'), 0, 1.12, z); },
                shelves(g, z) { add(g, new THREE.BoxGeometry(14, 6, 0.3), std('#C99A66'), 0, 3, z); for (let r = 0; r < 3; r++) { add(g, new THREE.BoxGeometry(12, 0.08, 0.5), std('#7A4A22'), 0, 1.8 + r * 1.2, z + 0.3); for (let i = 0; i < 9; i++) add(g, new THREE.CylinderGeometry(0.15, 0.15, 0.4, 12), std(['#E07A5F', '#5FA463', '#F2B84B', '#7FB8E0'][(i + r) % 4], { roughness: 0.3 }), -5 + i * 1.25, 2.05 + r * 1.2, z + 0.35); } },
                bunting(g, y, z, w) { const cs = ['#E63946', '#F2C25A', '#5FA463', '#2F7FD8', '#FF9FBF']; for (let i = 0; i < 14; i++) add(g, new THREE.ConeGeometry(0.2, 0.4, 3), std(cs[i % 5]), -w / 2 + i * w / 13, y - Math.sin(i / 13 * Math.PI) * 0.4, z, Math.PI, 0, 0); },
                cake(g, x, z, s) { add(g, new THREE.CylinderGeometry(0.5 * s, 0.5 * s, 0.4 * s, 24), std('#FFB3C8'), x, 0.2 * s + 0.9, z); add(g, new THREE.CylinderGeometry(0.35 * s, 0.35 * s, 0.35 * s, 24), std('#FFF6EA'), x, 0.58 * s + 0.9, z); add(g, SPH(0.08 * s, 10, 8), std('#E63946'), x, 0.82 * s + 0.9, z); add(g, new THREE.CylinderGeometry(0.6, 0.6, 0.9, 16), std('#C99A66'), x, 0.45, z); },
                oven(g, x, z) { add(g, new THREE.SphereGeometry(1.2, 20, 12, 0, Math.PI * 2, 0, Math.PI / 2), std('#C4623A', { roughness: 0.9 }), x, 0, z); add(g, new THREE.CircleGeometry(0.4, 16, 0, Math.PI), basic('#FF8A1E'), x, 0.05, z + 1.18); },
                coffeePlant(g, x, z) { add(g, SPH(0.45, 14, 10), std('#3F7A3A', { roughness: 0.9 }), x, 0.45, z, 0, 0, 0, [1, 1.2, 1]); for (let i = 0; i < 5; i++) add(g, SPH(0.06, 8, 6), std('#C0392B'), x + Math.cos(i * 1.3) * 0.38, 0.4 + (i % 3) * 0.15, z + Math.sin(i * 1.3) * 0.38); },
                sack(g, x, z) { add(g, SPH(0.4, 14, 10), std('#C9A06A', { roughness: 1 }), x, 0.35, z, 0, 0, 0, [1, 1.1, 0.9]); add(g, new THREE.CylinderGeometry(0.12, 0.2, 0.2, 10), std('#8A6A3A'), x, 0.8, z); },
                hill(g, x, z, s, c) { add(g, SPH(s, 24, 14), std(c || '#8FCB6B', { roughness: 1 }), x, -s * 0.55, z, 0, 0, 0, [1.6, 1, 1]); },
                syrupTower(g, x, z, h) { add(g, new THREE.CylinderGeometry(1.4, 1.8, h, 16), std('#5A2A6A', { roughness: 0.4 }), x, h / 2, z); add(g, new THREE.ConeGeometry(1.6, 2.2, 16), std('#8A2A12', { roughness: 0.2 }), x, h + 1.1, z); add(g, new THREE.PlaneGeometry(2.6, 0.65), new THREE.MeshBasicMaterial({ map: signTex('SYRUP', '#2A0D3A', '#FF8A1E') }), x, h * 0.7, z + 1.62); const l = new THREE.PointLight(0xFF6A1E, 1.4, 12); l.position.set(x, h * 0.7, z + 3); g.add(l); },
                castle(g, x, z) { add(g, new THREE.BoxGeometry(7, 4, 2), std('#6B4A8A'), x, 2, z); [-3.5, 3.5, -1.2, 1.2].forEach((k, i) => { const h = i < 2 ? 6 : 7.5; add(g, new THREE.CylinderGeometry(0.8, 0.9, h, 14), std('#5A3F82'), x + k, h / 2, z + (i < 2 ? 0.4 : -0.6)); add(g, new THREE.ConeGeometry(1.05, 1.8, 14), std('#C0392B'), x + k, h + 0.9, z + (i < 2 ? 0.4 : -0.6)); }); add(g, new THREE.PlaneGeometry(14, 3), std('#D9822B', { roughness: 0.1, metalness: 0.3 }), x, 0.03, z + 2.6, -Math.PI / 2); },
                ruin(g) { for (let i = 0; i < 7; i++) add(g, new THREE.BoxGeometry(0.8 + Math.random(), 1 + Math.random() * 3, 0.8), std(i % 2 ? '#7A5BA8' : '#5A3F82'), -6 + i * 2, 0.8, -6 - Math.random() * 4, 0, Math.random(), (Math.random() - 0.5) * 0.9); add(g, new THREE.CircleGeometry(4, 24), std('#D9822B', { roughness: 0.1, metalness: 0.3 }), 0, 0.03, -2, -Math.PI / 2); },
                timemachine(g, x, z, s) {
                    s = s || 1;
                    const brass = std('#C9963A', { metalness: 0.85, roughness: 0.28 }), copper = std('#B8653A', { metalness: 0.8, roughness: 0.3 });
                    const tm = new THREE.Group(); tm.position.set(x, 0, z); g.add(tm);
                    add(tm, new THREE.CylinderGeometry(1.5 * s, 1.8 * s, 0.6 * s, 24), copper, 0, 0.3 * s, 0);
                    add(tm, new THREE.TorusGeometry(1.6 * s, 0.18 * s, 12, 40), brass, 0, 2.1 * s, 0);
                    const inner = add(tm, new THREE.TorusGeometry(1.25 * s, 0.07 * s, 8, 32), brass, 0, 2.1 * s, 0, 0, 0, 0.6);
                    const v = add(tm, new THREE.CircleGeometry(1.45 * s, 40), new THREE.MeshBasicMaterial({ map: spiralTex('#4B2A8A', '#7FE3FF') }), 0, 2.1 * s, -0.02);
                    const gears = [];
                    for (let i = 0; i < 6; i++) { const a = i / 6 * Math.PI * 2; gears.push(add(tm, new THREE.TorusGeometry(0.3 * s, 0.08 * s, 6, 12), brass, Math.cos(a) * 1.9 * s, 2.1 * s + Math.sin(a) * 1.9 * s, 0, 0, 0, a)); }
                    add(tm, new THREE.CylinderGeometry(0.45 * s, 0.6 * s, 0.8 * s, 16), copper, 0, 4.2 * s, 0);
                    add(tm, new THREE.BoxGeometry(1.2 * s, 0.12 * s, 0.12 * s), std('#5A3416'), 0.9 * s, 4.25 * s, 0, 0, 0, 0.25);
                    [-1, 1].forEach(k => add(tm, new THREE.CylinderGeometry(0.09 * s, 0.09 * s, 3.4 * s, 10), copper, k * 2.1 * s, 1.7 * s, -0.3, 0, 0, k * 0.15));
                    const l = new THREE.PointLight(0x9F7BFF, 2.2, 9); l.position.set(0, 2.1 * s, 1.2); tm.add(l);
                    return { upd: (t) => { v.rotation.z = -t * 2.2; inner.rotation.z = 0.6 + t * 1.3; gears.forEach((q, i) => { q.rotation.z += 0.03 * (i % 2 ? 1 : -1); }); l.intensity = 2 + Math.sin(t * 6) * 0.6; } };
                },
                vortex(g) { const t = spiralTex('#2A1A5A', '#7FE3FF'); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(3, 2); const m = add(g, new THREE.CylinderGeometry(7, 2, 40, 32, 1, true), new THREE.MeshBasicMaterial({ map: t, side: THREE.BackSide }), 0, 2, -14, Math.PI / 2); return { upd: (tt) => { m.rotation.y = tt * 1.5; t.offset.y = -tt * 0.4; } }; },
                gondola(g, x, z) { add(g, new THREE.BoxGeometry(3, 0.25, 0.5), std('#141414'), x, 0.25, z); add(g, new THREE.BoxGeometry(0.1, 0.8, 0.1), std('#D9A73A'), x + 1.5, 0.6, z); },
                statue(g, x, z) { const c = '#6FB8A0'; add(g, new THREE.BoxGeometry(1.6, 1.6, 1.6), std('#8A7A6A'), x, 0.8, z); add(g, new THREE.CylinderGeometry(0.45, 0.7, 3.2, 12), std(c), x, 3.2, z); add(g, SPH(0.35, 12, 10), std(c), x, 5.05, z); add(g, new THREE.CylinderGeometry(0.08, 0.08, 1.4, 8), std(c), x + 0.5, 5.4, z, 0, 0, -0.3); add(g, new THREE.ConeGeometry(0.18, 0.4, 8), basic('#FFC94D'), x + 0.72, 6.2, z); }
            };
            function rnd(seed) { let a = seed | 0; return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
            /* sahneler: (grup, rastgele, fx listesi) — fx'e her karede çağrılacak güncelleyiciler eklenir */
            const SCENES = {
                cafe(g, r) { P.shelves(g, -4.2); P.counter(g, -2.2); P.espressoMachine(g, -1.8, -2.3); for (let i = 0; i < 4; i++) P.cup(g, 0.5 + i * 0.5, 1.17, -2.0, 1, ['#FFFDF8', '#F2B84B', '#7FB8E0', '#FF9FBF'][i]); P.lamp(g, 3, -3); add(g, new THREE.PlaneGeometry(4, 0.9), new THREE.MeshBasicMaterial({ map: signTex('BEARISTA', '#6B4226', '#FFE9A8') }), 0, 5.4, -4.0); },
                town(g, r) { for (let i = 0; i < 6; i++) P.house(g, -9 + i * 3.6, -6 - r() * 3, ['#E07A5F', '#F2B84B', '#8FCB6B', '#7FB8E0', '#FF9FBF', '#C9A0DC'][i]); for (let i = 0; i < 5; i++) P.tree(g, -10 + i * 5 + r(), -10); P.bunting(g, 3.4, -4, 12); },
                city(g, r) { P.syrupTower(g, 2, -12, 9); for (let i = 0; i < 6; i++) P.building(g, -10 + i * 3, -8 - r() * 3, 2.2, 2 + r() * 3, '#3A2E4A', '#8F7BFF'); },
                matcha(g, r) { P.house(g, -4, -6, '#5FA463'); P.house(g, 4, -6, '#E07A5F'); add(g, new THREE.PlaneGeometry(2.6, 0.6), new THREE.MeshBasicMaterial({ map: signTex('MATCHA', '#3F7A3A', '#E9F7DA') }), -4, 2.6, -5.2); for (let i = 0; i < 8; i++) P.tree(g, -10 + i * 3, -11, '#7FBF6A', 0.9); },
                bakery(g, r) { P.oven(g, 3.5, -5); P.bunting(g, 3.6, -3.5, 12); for (let i = 0; i < 3; i++) P.cake(g, -3 + i * 1.8, -3.4, 1); for (let i = 0; i < 4; i++) P.house(g, -9 + i * 6, -9, ['#FF9FBF', '#F2B84B', '#7FB8E0', '#E07A5F'][i]); },
                farm(g, r) { P.hill(g, -6, -14, 6, '#7FBF6A'); P.hill(g, 7, -16, 7, '#8FCB6B'); for (let i = 0; i < 10; i++) P.coffeePlant(g, -6 + (i % 5) * 3, -4 - Math.floor(i / 5) * 2.5); for (let i = 0; i < 3; i++) P.sack(g, 3 + i * 0.9, -1.5); P.house(g, -8, -8, '#C0392B'); },
                castle(g, r) { P.castle(g, 0, -10); },
                flood(g, r) { P.castle(g, 0, -12); add(g, new THREE.PlaneGeometry(40, 20), std('#D9822B', { roughness: 0.08, metalness: 0.35 }), 0, 0.25, -2, -Math.PI / 2); for (let i = 0; i < 4; i++) P.house(g, -7 + i * 4.5, -5, ['#E07A5F', '#F2B84B', '#7FB8E0', '#FF9FBF'][i]); },
                ruins(g) { P.ruin(g); },
                cellar(g) { add(g, new THREE.BoxGeometry(14, 6, 0.4), new THREE.MeshStandardMaterial({ map: archTex('#6E5A4A', '#3A2A1E', 5, 1) }), 0, 3, -5); for (let i = 0; i < 4; i++) add(g, new THREE.CylinderGeometry(0.5, 0.5, 1.1, 14), std('#7A4A22'), -4 + i * 0.4, 0.55, -2.5 - i * 0.9); P.lamp(g, 2.5, -2); },
                lab(g, r, fx) { SCENES.cellar(g); fx.push(P.timemachine(g, 0, -2.6, 1).upd); },
                vortex(g, r, fx) { fx.push(P.vortex(g).upd); },
                egypt(g, r) { P.water(g, -8, '#3E9FD0'); for (let i = 0; i < 3; i++) P.pyramid(g, -10 + i * 9 + r() * 3, -18 - r() * 8, 4 + r() * 3); for (let i = 0; i < 5; i++) P.palm(g, -7 + i * 3.5 + r(), -4 - r() * 3, 2 + r()); },
                greece(g, r) { P.temple(g, 0, -9, 7); P.water(g, -16, '#2F86D0', 120); for (let i = 0; i < 4; i++) P.tree(g, -8 + i * 5 + r() * 2, -4 - r() * 2, '#7FA05A'); P.mountain(g, -14, -30, 8); P.mountain(g, 12, -34, 10); },
                viking(g, r) { P.water(g, -6, '#2E5A7A', 120); P.longship(g, -2 + r() * 2, -8, 0.2); for (let i = 0; i < 4; i++) P.mountain(g, -16 + i * 10, -24 - r() * 8, 6 + r() * 4, true); P.house(g, 6, -3, '#5A3416'); },
                rome(g, r) { P.colosseum(g, 2, -14, 6); P.aqueduct(g, -8, -9, 10); for (let i = 0; i < 3; i++) P.column(g, -5 + i * 4, -3 - r(), 2.8); P.tree(g, 8, -5, '#3F6A3A'); },
                ottoman(g, r) { P.mosque(g, 0, -14, 1.3); P.water(g, -7, '#3E7FA8', 120); for (let i = 0; i < 6; i++) add(g, SPH(0.16, 8, 6), std(['#E63946', '#F2C25A', '#E07A5F'][i % 3]), -5 + i * 2, 0.5, -2 - r()); P.house(g, -9, -5, '#C0392B'); P.house(g, 9, -5, '#1F6B5A'); },
                victorian(g, r) { P.clocktower(g, 4, -10); for (let i = 0; i < 5; i++) P.building(g, -10 + i * 3.2, -6 - r() * 2, 2.4, 3 + r() * 3, '#7A4A3A'); P.lamp(g, -3, -1.5); P.lamp(g, 3, -1.5); },
                france(g, r) { P.building(g, 0, -12, 12, 4, '#E8DCC4', '#FFF6D0'); P.balloon(g, 4 + r() * 2, 5, -6); for (let i = 0; i < 6; i++) add(g, new THREE.BoxGeometry(1.2, 0.8, 1.2), std('#4F7A42'), -7 + i * 2.8, 0.4, -4); add(g, new THREE.CylinderGeometry(1, 1.2, 0.5, 16), std('#DDE7FF'), -3, 0.25, -2); },
                italy(g, r) { P.dome(g, 0, -12, 1.4); add(g, new THREE.BoxGeometry(1, 6, 1), new THREE.MeshStandardMaterial({ map: stripeTex('#EFE4CF', '#3F7A3A', 12, true) }), 6, 3, -11); P.water(g, -4, '#3E8F8A', 120); P.gondola(g, -3 + r() * 2, -4); P.house(g, -8, -7, '#C4623A'); },
                jazz(g, r) { for (let i = 0; i < 8; i++) P.skyscraper(g, -14 + i * 4, -12 - r() * 8, 2 + r(), 6 + r() * 10); add(g, SPH(1.4, 20, 14), basic('#FFF3C4'), -8, 11, -30); add(g, new THREE.BoxGeometry(3, 0.8, 0.2), basic('#FF4FA3'), 3, 3.4, -6); },
                liberty(g, r) { SCENES.jazz(g, r); P.statue(g, 6, -9); }
            };
            /* gökyüzü üst · alt, zemin, gece?, ışık rengi */
            const ENV = {
                cafe: ['#F3D9B0', '#C99A66', '#B9844F', 0, 0xFFE2B8], town: ['#FFF0C8', '#8FD0F0', '#BFE3A4', 0, 0xFFF0D8], city: ['#5A2A6A', '#120C24', '#2A2438', 1, 0xB88CFF],
                matcha: ['#E9F7DA', '#8FCB6B', '#CDEBB4', 0, 0xF0FFE0], bakery: ['#FFE6F0', '#FF9FBF', '#F7D2DE', 0, 0xFFF0F4], farm: ['#FFF0C8', '#7FC4E8', '#9FD07A', 0, 0xFFF0D0],
                castle: ['#6A3A7A', '#1A0C24', '#4A3060', 1, 0xFF9A5A], flood: ['#7A4A6A', '#2A1424', '#5A3A50', 1, 0xFFAA60], ruins: ['#5A2A6A', '#1A0C24', '#3A2448', 1, 0xFF9A5A],
                cellar: ['#4A3A2E', '#2A1E16', '#3A2E24', 0, 0xFFC890], lab: ['#3A2E4A', '#140C24', '#3A2E24', 0, 0xC8A0FF], vortex: ['#2A1A5A', '#0A0420', '#2A1A5A', 1, 0x9FE8FF],
                egypt: ['#FFE0A0', '#F08C3C', '#E9C37A', 0, 0xFFE0B0], greece: ['#D8F0FF', '#5FA8E8', '#E6DCC8', 0, 0xFFFFFF], viking: ['#3B6A8A', '#101A33', '#E4EEF6', 1, 0xB8D8FF],
                rome: ['#FFE6C0', '#E88A4C', '#D9C4A0', 0, 0xFFE0B8], ottoman: ['#FFE0B8', '#E8836A', '#CFC2A8', 0, 0xFFE0C0], victorian: ['#C9C4BC', '#6E6A64', '#7E7A74', 0, 0xE8E0D0],
                france: ['#E6EEFF', '#8FA6E0', '#BFD9A0', 0, 0xFFF4E8], italy: ['#FFEACC', '#E89A5A', '#D8B890', 0, 0xFFE8C8], jazz: ['#4A2A6A', '#120C24', '#2A2438', 1, 0xFFC8F0],
                liberty: ['#4A2A6A', '#120C24', '#2A2438', 1, 0xFFC8F0]
            };
            // günün saati (arka planlarda bölüme göre değişir): sabah · öğle · gün batımı · gece
            const TOD = [null, ['#FFE8C8', '#9FC8F0'], ['#FFB070', '#7A4A8A'], ['#2A2050', '#0A0820', 1]];

            /* ---------- SEVİMLİ 3D AYICIKLAR ---------- */
            const CHARS = {
                barista:    { fur: '#A86A3C', belly: '#E8C49A', muzzle: '#F0D2AE', ear: '#E8A9A0', apron: '#6B4226', scarf: '#E07A5F' },
                cozybear:   { fur: '#F6F1EA', belly: '#FFFFFF', muzzle: '#FFFFFF', ear: '#F4B8C4', hat: 'beanie', hatCol: '#5FA8E8', s: 0.86 },
                bakingbear: { fur: '#F4EEE6', belly: '#FFFFFF', muzzle: '#FFFFFF', ear: '#F0B8B0', hat: 'chef', apron: '#FFFFFF', s: 1.02 },
                dede:       { fur: '#A87A52', belly: '#E8C49A', muzzle: '#F2DCC0', ear: '#E8A9A0', hat: 'cap', hatCol: '#6E5039', sweater: '#4F7A42', mustache: true, pipe: true, s: 1.04 }
            };
            function bear(key) {
                const C = CHARS[key] || CHARS.barista, g = new THREE.Group(), fur = std(C.fur, { roughness: 0.78 });
                const parts = {};
                add(g, SPH(0.17, 16, 12), fur, -0.2, 0.13, 0.05, 0, 0, 0, [1, 0.75, 1.25]);
                add(g, SPH(0.17, 16, 12), fur, 0.2, 0.13, 0.05, 0, 0, 0, [1, 0.75, 1.25]);
                const body = new THREE.Group(); body.position.y = 0.62; g.add(body); parts.body = body;
                add(body, SPH(0.5), C.sweater ? std(C.sweater, { roughness: 0.9 }) : fur, 0, 0, 0, 0, 0, 0, [1, 1.06, 0.9]);
                if (C.apron) { add(body, SPH(0.42, 20, 14), std(C.apron, { roughness: 0.85 }), 0, -0.04, 0.18, 0, 0, 0, [0.82, 0.96, 0.55]); add(body, new THREE.BoxGeometry(0.2, 0.12, 0.04), std(C.apron === '#FFFFFF' ? '#E8DCC4' : '#8A5A3A'), 0, -0.12, 0.42); }
                else if (!C.sweater) add(body, SPH(0.36, 18, 12), std(C.belly, { roughness: 0.85 }), 0, -0.02, 0.22, 0, 0, 0, [1, 1.1, 0.55]);
                if (C.sweater) for (let i = 0; i < 3; i++) add(body, SPH(0.03, 8, 6), std('#F2C25A', { metalness: 0.6 }), 0, 0.15 - i * 0.16, 0.46);
                if (C.scarf) add(body, new THREE.TorusGeometry(0.34, 0.08, 10, 24), std(C.scarf, { roughness: 0.9 }), 0, 0.42, 0, Math.PI / 2);
                const arm = (k) => { const a = new THREE.Group(); a.position.set(k * 0.44, 0.28, 0); body.add(a); add(a, new THREE.CylinderGeometry(0.1, 0.12, 0.38, 12), C.sweater ? std(C.sweater, { roughness: 0.9 }) : fur, 0, -0.18, 0); add(a, SPH(0.13, 14, 10), fur, 0, -0.38, 0.02); a.rotation.z = k * 0.45; return a; };
                parts.armL = arm(-1); parts.armR = arm(1);
                const head = new THREE.Group(); head.position.y = 1.36; g.add(head); parts.head = head;
                add(head, SPH(0.48, 28, 22), fur, 0, 0, 0, 0, 0, 0, [1.08, 0.96, 1]);
                [-1, 1].forEach(k => { add(head, SPH(0.16, 16, 12), fur, k * 0.34, 0.36, -0.03); add(head, SPH(0.09, 12, 10), std(C.ear), k * 0.34, 0.36, 0.07, 0, 0, 0, [1, 1, 0.5]); });
                add(head, SPH(0.19, 18, 14), std(C.muzzle, { roughness: 0.8 }), 0, -0.11, 0.38, 0, 0, 0, [1.3, 0.88, 0.8]);
                add(head, SPH(0.065, 12, 10), std('#3A2416', { roughness: 0.3 }), 0, -0.03, 0.53, 0, 0, 0, [1.35, 1, 1]);
                add(head, new THREE.TorusGeometry(0.05, 0.013, 6, 14, Math.PI), std('#3A2416'), 0, -0.13, 0.52, 0, 0, Math.PI);
                parts.eyes = [];
                [-1, 1].forEach(k => {
                    const e = new THREE.Group(); e.position.set(k * 0.17, 0.06, 0.41); head.add(e);
                    add(e, SPH(0.066, 14, 12), std('#1A1010', { roughness: 0.2 }), 0, 0, 0);
                    add(e, SPH(0.022, 8, 6), basic('#FFFFFF'), 0.022, 0.028, 0.05);
                    parts.eyes.push(e);
                    add(head, SPH(0.08, 12, 8), std('#FF9FB0', { transparent: true, opacity: 0.55, roughness: 1 }), k * 0.3, -0.1, 0.35, 0, 0, 0, [1, 0.6, 0.3]);
                    if (C.mustache) { add(head, SPH(0.12, 14, 10), std('#FFFFFF', { roughness: 1 }), k * 0.1, -0.19, 0.46, 0, 0, k * 0.3, [1.5, 0.65, 0.7]); add(head, SPH(0.06, 10, 8), std('#FFFFFF', { roughness: 1 }), k * 0.18, 0.16, 0.42, 0, 0, 0, [1.6, 0.6, 0.6]); }
                });
                if (C.hat === 'beanie') { add(head, new THREE.SphereGeometry(0.5, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2), std(C.hatCol, { roughness: 0.95 }), 0, 0.08, 0, 0, 0, 0, [1.06, 0.78, 1.06]); add(head, new THREE.TorusGeometry(0.47, 0.08, 10, 28), std('#DDEEFF', { roughness: 0.95 }), 0, 0.1, 0, Math.PI / 2); add(head, SPH(0.12, 12, 10), std('#FFFFFF', { roughness: 1 }), 0, 0.5, 0); }
                if (C.hat === 'chef') { add(head, new THREE.CylinderGeometry(0.3, 0.32, 0.32, 20), std('#FFFFFF'), 0, 0.5, 0); [-0.2, 0, 0.2].forEach((k, i) => add(head, SPH(0.2, 14, 10), std('#FFFFFF', { roughness: 0.9 }), k, 0.75 + (i === 1 ? 0.06 : 0), 0)); }
                if (C.hat === 'cap') { add(head, new THREE.SphereGeometry(0.5, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2), std(C.hatCol, { roughness: 0.9 }), 0, 0.12, 0, 0, 0, 0, [1.06, 0.5, 1.06]); add(head, new THREE.CylinderGeometry(0.3, 0.3, 0.04, 20, 1, false, -Math.PI / 2, Math.PI), std('#5A3F2A'), 0, 0.14, 0.32, 0, 0, 0, [1.2, 1, 1]); }
                if (C.pipe) { const p = new THREE.Group(); p.position.set(0.18, -0.18, 0.5); head.add(p); add(p, new THREE.CylinderGeometry(0.02, 0.02, 0.32, 8), std('#3A2416'), 0.13, 0, 0, 0, 0, Math.PI / 2 - 0.3); add(p, new THREE.CylinderGeometry(0.06, 0.05, 0.12, 10), std('#6B3A1A'), 0.27, 0.05, 0); }
                g.scale.setScalar(C.s || 1);
                g.traverse(o => { if (o.isMesh) { o.castShadow = true; } });
                return { g, parts, blink: 1 + Math.random() * 2 };
            }
            function villainBot(s) {
                const g = new THREE.Group(), body = new THREE.Group(); g.add(body); g.scale.setScalar(s || 1);
                const glass = std('#8A2A12', { roughness: 0.1, metalness: 0.25, transparent: true, opacity: 0.93 });
                add(body, new THREE.CylinderGeometry(0.75, 0.8, 1.9, 28), glass, 0, 1.0, 0);
                add(body, new THREE.CylinderGeometry(0.3, 0.75, 0.55, 28), glass, 0, 2.2, 0);
                add(body, new THREE.CylinderGeometry(0.34, 0.34, 0.3, 24), std('#D62828', { metalness: 0.4, roughness: 0.3 }), 0, 2.6, 0);
                add(body, new THREE.CylinderGeometry(0.77, 0.77, 0.9, 28, 1, true, -1.1, 2.2), std('#FFF3C4', { side: THREE.DoubleSide }), 0, 1.05, 0);
                const eyes = [];
                [-1, 1].forEach(k => { add(body, SPH(0.16, 14, 12), basic('#FFFFFF'), k * 0.28, 1.2, 0.72); eyes.push(add(body, SPH(0.08, 10, 8), basic('#E63946'), k * 0.26, 1.18, 0.86)); add(body, new THREE.BoxGeometry(0.34, 0.07, 0.07), std('#111'), k * 0.28, 1.43, 0.8, 0, 0, -k * 0.4); });
                add(body, new THREE.TorusGeometry(0.18, 0.035, 8, 16, Math.PI), std('#111'), 0, 0.82, 0.8);
                const arms = [-1, 1].map(k => { const a = new THREE.Group(); a.position.set(k * 0.8, 1.4, 0); body.add(a); add(a, new THREE.CylinderGeometry(0.08, 0.08, 1.0, 10), std('#9AA3AB', { metalness: 0.8, roughness: 0.3 }), 0, -0.45, 0); add(a, SPH(0.16, 12, 10), std('#D62828', { metalness: 0.5 }), 0, -0.95, 0); a.rotation.z = k * 0.9; return a; });
                g.traverse(o => { if (o.isMesh) o.castShadow = true; });
                return { g, body, eyes, arms };
            }
            function confetti(g, r, fx) { const cs = ['#E63946', '#F2C25A', '#4CAF50', '#2F7FD8', '#FF9FBF']; const ps = []; for (let i = 0; i < 90; i++) ps.push(add(g, new THREE.PlaneGeometry(0.12, 0.2), basic(cs[i % 5], { side: THREE.DoubleSide }), (r() - 0.5) * 10, 1 + r() * 6, -1 - r() * 5, r() * 6, r() * 6, r() * 6)); fx.push((t, dt) => ps.forEach((p, i) => { p.position.y -= dt * (0.9 + (i % 5) * 0.2); p.rotation.x += dt * 3; p.rotation.y += dt * 2; if (p.position.y < 0) p.position.y += 6; })); }
            function sparks(g, r, fx, c) { const ps = []; for (let i = 0; i < 50; i++) ps.push(add(g, SPH(0.035 + r() * 0.05, 6, 5), basic(c || '#9FE8FF'), (r() - 0.5) * 8, 0.5 + r() * 4.5, -1.5 - r() * 3)); fx.push((t) => ps.forEach((p, i) => { p.position.y += Math.sin(t * 2 + i) * 0.004; p.material.opacity = 1; p.scale.setScalar(0.6 + 0.5 * Math.abs(Math.sin(t * 4 + i))); })); }
            function rainOf(g, r, fx, c, shape) { const ps = []; for (let i = 0; i < 40; i++) ps.push(add(g, shape === 'cup' ? new THREE.CylinderGeometry(0.12, 0.09, 0.16, 10) : SPH(0.12, 10, 8), std(c), (r() - 0.5) * 9, 1 + r() * 6, -0.5 - r() * 4)); fx.push((t, dt) => ps.forEach((p, i) => { p.position.y -= dt * (1.6 + (i % 4) * 0.3); p.rotation.x += dt * 2; if (p.position.y < 0.1) p.position.y += 6; })); }
            function hearts(g, r, fx) { const hs = []; for (let i = 0; i < 18; i++) hs.push(add(g, SPH(0.1, 10, 8), basic('#FF6B8A'), (r() - 0.5) * 6, r() * 4, -0.5 - r() * 2, 0, 0, 0, [1.2, 1, 0.5])); fx.push((t, dt) => hs.forEach((h, i) => { h.position.y += dt * 0.6; if (h.position.y > 4.5) h.position.y = 0.5; h.position.x += Math.sin(t * 2 + i) * 0.003; })); }

            /* sahne kur: spec → { scene, cam, update } */
            function build(spec, aspect) {
                TOON = !!spec.toon;
                const r = rnd((spec.seed || 1) * 7919 + 13);
                const scene = new THREE.Scene(), fx = [];
                let env = (ENV[spec.sc] || ENV.town).slice();
                if (spec.tod && TOD[spec.tod]) { const T = TOD[spec.tod]; env[0] = T[0]; env[1] = T[1]; env[3] = T[2] || env[3]; }
                scene.background = skyTex(env[0], env[1], env[3]);
                if (!spec.noFog) scene.fog = new THREE.Fog(col(env[1]).getHex(), 16, 52);
                scene.add(new THREE.HemisphereLight(0xFFF4E0, 0x6A5040, env[3] ? 0.55 : 0.85));
                const key = new THREE.DirectionalLight(env[4] || 0xFFE2B8, env[3] ? 0.85 : 1.25);
                key.position.set(-4 + r() * 2, 9, 7);
                if (key.shadow) { key.castShadow = true; key.shadow.mapSize.width = key.shadow.mapSize.height = 1024; const sc = key.shadow.camera; sc.left = -8; sc.right = 8; sc.top = 8; sc.bottom = -4; sc.near = 1; sc.far = 30; key.shadow.radius = 4; key.shadow.bias = -0.0005; }
                scene.add(key);
                const rim = new THREE.DirectionalLight(env[3] ? 0x8FB8FF : 0xFFB070, 0.65); rim.position.set(6, 4, -8); scene.add(rim);
                const g = new THREE.Group(); scene.add(g);
                const ground = add(g, new THREE.PlaneGeometry(140, 140), std(env[2], { roughness: 0.95 }), 0, 0, -20, -Math.PI / 2); ground.receiveShadow = true;
                (SCENES[spec.sc] || SCENES.town)(g, r, fx);
                if (spec.tm) fx.push(P.timemachine(g, spec.tmX !== undefined ? spec.tmX : 3.2, -3.4, 0.75).upd);
                // karakterler
                const actors = [], A = spec.actors || [], n = A.length;
                A.forEach((a, i) => {
                    const def = Array.isArray(a) ? { k: a[0], anim: a[1] } : (typeof a === 'string' ? { k: a } : a);
                    const b = bear(def.k);
                    const x = def.x !== undefined ? def.x : (i - (n - 1) / 2) * 1.35 + (spec.vil && spec.vil !== 'big' ? -1 : 0);
                    const z = def.z !== undefined ? def.z : 0.4 - Math.abs(i - (n - 1) / 2) * 0.3;
                    b.home = [x, z]; b.anim = def.anim || 'idle'; b.delay = def.d !== undefined ? def.d : i * 0.25; b.key = def.k;
                    b.g.position.set(x, 0, z); g.add(b.g); actors.push(b);
                });
                let vil = null;
                if (spec.vil) {
                    vil = villainBot(spec.vil === 'big' ? 2.1 : 1.05);
                    vil.g.position.set(spec.vil === 'big' ? 0 : 1.9, 0, spec.vil === 'big' ? -2.6 : -0.9);
                    vil.mode = spec.vil; g.add(vil.g);
                }
                if (spec.fx === 'confetti') confetti(g, r, fx);
                if (spec.fx === 'sparks') sparks(g, r, fx);
                if (spec.fx === 'hearts') hearts(g, r, fx);
                if (spec.fx === 'matcha') rainOf(g, r, fx, '#7DB46C', 'cup');
                if (spec.fx === 'cakes') rainOf(g, r, fx, '#FFB3C8', 'cup');
                if (spec.fx === 'stamps') rainOf(g, r, fx, '#E63946');
                g.traverse(o => { if (o.isMesh && !o.castShadow && o !== ground && o.geometry && o.geometry.type !== 'PlaneGeometry') { o.castShadow = !!spec.shadows; o.receiveShadow = true; } });
                if (TOON) inkScene(g, ground);
                TOON = false;
                // kamera hareketi
                const cam = new THREE.PerspectiveCamera(48, aspect, 0.1, 220);
                const M = CAMS[spec.cam || 'push'] || CAMS.push, orb = spec.orbit || 0;
                const rot = (p) => [p[0] * Math.cos(orb) + p[2] * Math.sin(orb), p[1], -p[0] * Math.sin(orb) + p[2] * Math.cos(orb)];
                const pz = aspect < 0.8 ? 1.3 : 1;   // dikey ekranda kamera biraz geri çekilir
                const sc3 = p => [p[0] * pz, M.l[1] + (p[1] - M.l[1]) * pz, p[2] * pz];
                const from = rot(sc3(M.f)), to = rot(sc3(M.t));
                const ease = u => u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2;
                const tgt = new THREE.Vector3(M.l[0], M.l[1], M.l[2]);
                function setCam(u) {
                    const e = ease(Math.max(0, Math.min(1, u)));
                    if (M.orbit) { const a = orb + (e - 0.5) * M.orbit, R0 = M.f[2] * pz; cam.position.set(Math.sin(a) * R0, M.f[1] + (M.t[1] - M.f[1]) * e, Math.cos(a) * R0); }
                    else cam.position.set(from[0] + (to[0] - from[0]) * e, from[1] + (to[1] - from[1]) * e, from[2] + (to[2] - from[2]) * e);
                    cam.fov = (M.fov || 48) + (aspect < 0.8 ? 10 : 0);
                    const roll = M.roll || 0; cam.up.set(Math.sin(roll), Math.cos(roll), 0);
                    cam.lookAt(tgt); cam.updateProjectionMatrix();
                }
                setCam(0);
                const look = new THREE.Vector3();
                function update(t, dt, u, talking) {
                    setCam(u);
                    actors.forEach((b, i) => {
                        const T = Math.max(0, t - b.delay), [hx, hz] = b.home, P2 = b.parts;
                        let x = hx, y = 0, sq = 1;
                        if (b.anim === 'in-left' || b.anim === 'in-right') { const k = Math.min(1, T / 1.1), dir = b.anim === 'in-left' ? -1 : 1; x = hx + dir * 6 * Math.pow(1 - k, 2); y = k < 1 ? Math.abs(Math.sin(T * 9)) * 0.22 : 0; }
                        if (b.anim === 'jump' || b.anim === 'cheer') { const ph = (T * 1.4 + i * 0.3) % 1; y = Math.max(0, Math.sin(ph * Math.PI)) * 0.55; sq = ph < 0.08 || ph > 0.92 ? 0.88 : 1.04; }
                        b.g.position.set(x, y, hz);
                        b.g.scale.y = (CHARS[b.key].s || 1) * (sq + Math.sin(t * 2.6 + i) * 0.015);
                        // kameraya hafif dönük
                        b.g.rotation.y = Math.atan2(cam.position.x - x, cam.position.z - hz) * 0.55;
                        P2.body.rotation.z = Math.sin(t * 1.8 + i) * 0.03;
                        P2.head.rotation.z = Math.sin(t * 1.3 + i) * 0.06;
                        P2.head.rotation.x = (talking === b.key ? Math.sin(t * 11) * 0.07 : 0) + Math.sin(t * 0.9 + i) * 0.03;
                        if (b.anim === 'wave' || talking === b.key) { P2.armR.rotation.z = -2.4 + Math.sin(t * 8) * 0.35; }
                        else if (b.anim === 'cheer') { P2.armR.rotation.z = -2.6 + Math.sin(t * 9) * 0.2; P2.armL.rotation.z = 2.6 - Math.sin(t * 9) * 0.2; }
                        else { P2.armR.rotation.z = 0.45 + Math.sin(t * 2 + i) * 0.06; P2.armL.rotation.z = -0.45 - Math.sin(t * 2 + i) * 0.06; }
                        b.blink -= dt; const bl = b.blink < 0.12 ? 0.1 : 1; if (b.blink < 0) b.blink = 2 + Math.random() * 3;
                        P2.eyes.forEach(e => { e.scale.y = bl; });
                    });
                    if (vil) {
                        if (vil.mode === 'fall') { const k = Math.min(1, t / 0.9); vil.g.rotation.z = 1.35 * (1 - Math.pow(1 - k, 3)); vil.g.position.y = 0; }
                        else { vil.body.position.y = Math.abs(Math.sin(t * 3)) * 0.08; vil.body.rotation.z = Math.sin(t * 2) * 0.05; vil.arms.forEach((a, k) => { a.rotation.z = (k ? 1 : -1) * (0.9 + Math.sin(t * 6 + k) * 0.35); }); }
                        vil.eyes.forEach(e => e.scale.setScalar(1 + Math.sin(t * 10) * 0.2));
                    }
                    fx.forEach(f => f(t, dt));
                }
                return { scene, cam, update, toon: !!spec.toon };
            }
            const CAMS = {
                push:  { f: [0, 1.9, 7.2], t: [0, 1.5, 4.4], l: [0, 1.15, 0], fov: 46 },
                wide:  { f: [0, 3.2, 11.5], t: [0, 2.6, 9.4], l: [0, 1.5, -2], fov: 50 },
                orbit: { f: [0, 1.9, 6.2], t: [0, 2.1, 6.2], l: [0, 1.15, 0], fov: 48, orbit: 0.9 },
                low:   { f: [0.8, 0.45, 6.2], t: [0.3, 0.6, 4.9], l: [0, 2.3, -1], fov: 56, roll: 0.05 },
                crane: { f: [0, 7.5, 10], t: [0, 2.2, 6.4], l: [0, 1.0, 0], fov: 48 },
                close: { f: [0.6, 1.6, 3.9], t: [0.25, 1.5, 3.0], l: [0, 1.3, 0], fov: 42 },
                dutch: { f: [-2.8, 1.9, 6.4], t: [-1.9, 1.7, 5.2], l: [0, 1.4, -1], fov: 50, roll: 0.2 },
                hero:  { f: [1.9, 0.7, 4.9], t: [1.2, 0.8, 4.1], l: [0, 1.7, -0.5], fov: 52, roll: -0.1 },
                bg:    { f: [0, 2.2, 12], t: [0, 2.2, 12], l: [0, 3.4, -12], fov: 58 }
            };
            function dispose(o) { o.traverse(n => { if (n.geometry) n.geometry.dispose(); if (n.material) [].concat(n.material).forEach(m => { if (m.userData && m.userData.shared) return; if (m.map) m.map.dispose(); m.dispose(); }); }); if (o.background && o.background.dispose) o.background.dispose(); }
            /* çizgi romanda düz renkler (ton eşleme yok), oyun arka planında ACES */
            function render(W) {
                const R = renderer(), tm = W.toon ? THREE.NoToneMapping : THREE.ACESFilmicToneMapping;
                if (tm !== undefined && R.toneMapping !== tm) R.toneMapping = tm;
                R.render(W.scene, W.cam);
            }
            /* dönem arka planı: bölüme göre kamera açısı ve günün saati değişir */
            const bgCache = {};
            function backdrop(n, w, h) {
                const k = n + ':' + w + 'x' + h;
                if (bgCache[k]) return bgCache[k];
                const c = CHAPTERS[n], e = Engine.eraOf(n); if (!e) return '';
                const R = renderer();
                const spec = { sc: e.key === 'jazz' && c.final ? 'liberty' : e.key, cam: 'bg', seed: n * 11, noFog: true, orbit: (n % 2 ? 1 : -1) * (0.42 + (n * 0.37) % 0.3), tod: [0, 1, 0, 2, 0, 1, 3, 0, 2, 1][c.eraStep % 10] * (e.key === 'viking' || e.key === 'jazz' ? 0 : 1), tm: n % 3 === 0, tmX: 6, shadows: false };
                const W = build(spec, w / h);
                W.update(2.5, 0.016, 1, null);
                if (R.shadowMap) R.shadowMap.enabled = false;
                R.setSize(w, h, false); render(W);
                if (R.shadowMap) R.shadowMap.enabled = true;
                const url = R.domElement.toDataURL('image/jpeg', 0.82);
                dispose(W.scene);
                // bellek: en fazla 4 arka plan resmi tut (en eskisini at)
                const ks = Object.keys(bgCache); if (ks.length >= 4) delete bgCache[ks[0]];
                return (bgCache[k] = url);
            }
            return { renderer, build, dispose, backdrop, render, CHARS };
        })();

        /* ---------- hikâye senaryoları (dil bağımsız sahne düzeni; metinler STORY_TXT ve SAGA_TXT'te) ---------- */
        const ALL4 = ['barista', 'cozybear', 'dede', 'bakingbear'];
        const COMIC_CAST = { barista: 'Bearista', cozybear: { tr: 'MaviKuş', en: 'BlueBird' }, bakingbear: { tr: 'Fırıncı Ayı', en: 'Baker Bear' }, dede: { tr: 'Kahve Dede', en: 'Grandpa Brew' }, villain: 'SyruppoLab' };
        const castName = k => { const v = COMIC_CAST[k]; return typeof v === 'string' ? v : v ? v[CUR_LANG()] || v.tr : k; };
        const STORY_SHOTS = {   // 1–5. şube hikâyeleri: aynı örgü, yeni 3D sahneler; who = konuşan
            1: [{ sc: 'cafe', cam: 'push', actors: [['barista', 'idle'], ['cozybear', 'in-right']], who: 'barista', music: 'cozy', fx: 'hearts' },
                { sc: 'cafe', cam: 'orbit', actors: [['bakingbear', 'in-left']], who: 'bakingbear', music: 'cozy' },
                { sc: 'city', cam: 'low', vil: 'big', who: 'villain', music: 'villain', fx: 'sparks' },
                { sc: 'town', cam: 'hero', actors: [['barista', 'cheer'], ['cozybear', 'jump'], ['bakingbear', 'idle']], who: 'barista', music: 'heroic' }],
            2: [{ sc: 'matcha', cam: 'crane', actors: [['barista', 'cheer'], ['cozybear', 'jump']], who: 'barista', music: 'heroic', fx: 'confetti' },
                { sc: 'city', cam: 'dutch', vil: 'big', who: 'villain', music: 'villain' },
                { sc: 'matcha', cam: 'wide', fx: 'matcha', music: 'villain' },
                { sc: 'matcha', cam: 'hero', actors: [['barista', 'wave'], ['cozybear', 'idle']], who: 'barista', music: 'heroic', fx: 'sparks' }],
            3: [{ sc: 'bakery', cam: 'crane', actors: [['bakingbear', 'cheer']], who: 'bakingbear', music: 'heroic', fx: 'confetti' },
                { sc: 'city', cam: 'low', vil: 'big', who: 'villain', music: 'villain', fx: 'sparks' },
                { sc: 'bakery', cam: 'orbit', fx: 'cakes', actors: [['bakingbear', 'jump']], music: 'heroic' },
                { sc: 'bakery', cam: 'hero', actors: [['barista', 'cheer'], ['bakingbear', 'cheer'], ['cozybear', 'jump']], music: 'heroic' }],
            4: [{ sc: 'farm', cam: 'crane', actors: [['cozybear', 'wave']], who: 'cozybear', music: 'cozy' },
                { sc: 'city', cam: 'dutch', vil: 'big', who: 'villain', music: 'villain' },
                { sc: 'farm', cam: 'orbit', actors: [['barista', 'jump'], ['bakingbear', 'idle']], music: 'heroic' },
                { sc: 'farm', cam: 'hero', actors: [['barista', 'cheer'], ['cozybear', 'jump']], who: 'barista', music: 'heroic', fx: 'sparks' }],
            5: [{ sc: 'castle', cam: 'low', vil: 'big', music: 'battle', fx: 'sparks' },
                { sc: 'flood', cam: 'crane', music: 'battle' },
                { sc: 'town', cam: 'push', fx: 'stamps', actors: [['cozybear', 'wave']], who: 'cozybear', music: 'heroic' },
                { sc: 'castle', cam: 'hero', actors: [['barista', 'cheer'], ['cozybear', 'idle'], ['bakingbear', 'idle']], who: 'barista', music: 'battle' }]
        };
        const SAGA_SHOTS = {
            tm: [{ sc: 'ruins', cam: 'low', vil: 'big', fx: 'sparks', music: 'battle' }, { sc: 'ruins', cam: 'dutch', vil: 'fall', actors: [['barista', 'idle']] },
                 { sc: 'town', cam: 'crane', actors: [['cozybear', 'jump'], ['barista', 'cheer'], ['bakingbear', 'jump']], fx: 'confetti', music: 'victory' }, { sc: 'cellar', cam: 'close', actors: [['dede', 'wave']] },
                 { sc: 'lab', cam: 'low', fx: 'sparks', music: 'heroic' }, { sc: 'lab', cam: 'push', actors: [['barista', 'wave'], ['cozybear', 'idle']], tmX: 0 },
                 { sc: 'lab', cam: 'dutch', actors: [['dede', 'wave']] }, { sc: 'vortex', cam: 'close', actors: ALL4.map(k => [k, 'jump']), fx: 'sparks' }],
            era: k => [{ sc: k, cam: 'wide', tm: true, tmX: 0, fx: 'sparks' }, { sc: k, cam: 'orbit', actors: [['cozybear', 'in-left'], ['barista', 'in-right']] },
                       { sc: k, cam: 'close', actors: [['dede', 'wave']] }, { sc: k, cam: 'hero', actors: ALL4.map(k2 => [k2, 'cheer']) }],
            finale: [{ sc: 'liberty', cam: 'low', vil: 'big', fx: 'sparks', music: 'battle' }, { sc: 'liberty', cam: 'crane', actors: [['cozybear', 'wave'], ['barista', 'jump'], ['bakingbear', 'jump']] },
                     { sc: 'liberty', cam: 'dutch', vil: 'fall', fx: 'sparks' }, { sc: 'liberty', cam: 'hero', actors: ALL4.map(k => [k, 'cheer']), fx: 'confetti', music: 'victory' }]
        };
        function eraShots(k) {
            const s = SAGA_SHOTS.era(k);
            if (k === 'jazz') s[2] = { sc: 'jazz', cam: 'dutch', vil: 'stand' };
            if (k === 'ottoman') s[1].actors = [['dede', 'in-left'], ['cozybear', 'in-right']];
            if (k === 'rome' || k === 'italy') s[1].actors = [['bakingbear', 'in-left']];
            return s;
        }
        /* bir hikâyenin çekim listesi: [{ ...sahne, narr, bub:[who,text], sfx, tag }] + başlık */
        function cinemaScript(id) {
            if (/^s\d$/.test(id)) {
                const n = +id.slice(1), tx = STORY_TXT[CUR_LANG()] && STORY_TXT[CUR_LANG()][n] || STORY_TXT.tr[n];
                return { title: tx.title, issue: tx.issue, cta: tx.cta[0], shots: STORY_SHOTS[n].map((s, i) => { const t = tx.shots[i] || {}; return Object.assign({ seed: n * 10 + i }, s, { narr: t.narr, tag: t.tag, sfx: t.sfx && t.sfx.replace(/<br>/g, ' '), bub: t.bub ? [s.who || 'barista', t.bub] : null }); }) };
            }
            const C = ST().comic;
            const fromPanels = (panels, shots, seed) => panels.map((p, j) => Object.assign({ seed: seed + j }, shots[j], { narr: p.cap, sfx: p.sfx, bub: p.bub }));
            if (id === 'tm') return { title: C.tm[0].title.split('·').pop().trim(), issue: C.tm[0].title.split('·')[0].trim(), shots: fromPanels(C.tm[0].panels.concat(C.tm[1].panels), SAGA_SHOTS.tm, 600) };
            if (id === 'finale') return { title: C.finale.title.split('·').pop().trim(), issue: C.finale.title.split('·')[0].trim(), shots: fromPanels(C.finale.panels, SAGA_SHOTS.finale, 1000) };
            if (id.startsWith('era:')) {
                const k = id.slice(4), pg = C.era[k], ei = Engine.ERAS.findIndex(e => e.key === k);
                return { title: eraName(k), issue: pg.title.split('·')[0].trim() + ' · ' + ERA_META[k].years[CUR_LANG()], era: k, shots: fromPanels(pg.panels, eraShots(k), 700 + ei * 10) };
            }
            if (id.startsWith('ch:')) {
                const n = +id.slice(3), k = eraKey(n), lines = ST().lines[k], ln = lines[n % lines.length];
                return { title: stageName(n), issue: `${eraName(k)} · ${ST().chWord} ${n}`, era: k, short: true, shots: [
                    { sc: k, cam: ['wide', 'crane', 'orbit'][n % 3], orbit: ((n * 37) % 100 / 100 - 0.5) * 1.2, seed: n * 3, tm: n % 2 === 0, narr: `${ERA_META[k].years[CUR_LANG()]} · ${stageName(n)}` },
                    { sc: k, cam: ['close', 'hero', 'push'][n % 3], orbit: ((n * 53) % 100 / 100 - 0.5) * 0.8, seed: n * 3 + 1, actors: [[ln[0], 'wave']], bub: [ln[0], ln[1]] }] };
            }
            return null;
        }

        /* ---------- oynatıcı: Marvel tarzı çizgi roman sayfası ----------
           Çekimler sayfalara bölünür; her sayfada paneller sırayla açılır. Sıradaki panelde canlı 3D
           (cel gölgeli + mürekkep konturlu) sahne oynar; bitince o kare dondurulup panele basılır.
           Altyazı kutuları, konuşma balonları ve ses efektleri gerçek çizgi roman harfleme stilinde. */
        const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
        function letterHTML(txt) {   // vurgular: isimler, sayılar ve ünlemden önceki kelime kalın-italik
            let h = esc(txt);
            const names = ['Bearista', 'SyruppoLab', 'Syruppolab', 'MaviKuş', 'BlueBird', 'Kahve Dede', 'Grandpa Brew', 'Fırıncı Ayı', 'Baker Bear'];
            names.forEach(n => { h = h.split(n).join('\u0001' + n + '\u0002'); });
            h = h.replace(/(\d[\d.,]*)/g, '\u0001$1\u0002');
            h = h.replace(/([^\s\u0001\u0002]+)(?=[!?]+(\s|$))/gu, '\u0001$1\u0002');
            return h.replace(/\u0001/g, '<em>').replace(/\u0002/g, '</em>').replace(/<em>([^<]*)<em>/g, '<em>$1').replace(/<\/em>([^<]*)<\/em>/g, '$1</em>');
        }
        function comicPages(n, portrait) {
            const out = []; let k = n;
            while (k > 0) { const c = portrait ? (k === 4 ? 2 : Math.min(3, k)) : (k === 5 ? 3 : Math.min(4, k)); out.push(c); k -= c; }
            return out;
        }
        function comicLayout(shots, portrait) {
            const n = shots.length, L = s => ((s.narr || '').length + (s.bub ? s.bub[1].length : 0));
            if (portrait) {
                if (n === 1) return { a: "'a'", r: '1fr', c: '1fr' };
                if (n === 2) return { a: "'a' 'b'", r: '1fr 1fr', c: '1fr' };
                if (L(shots[1]) < 95 && L(shots[2]) < 95) return { a: "'a a' 'b c'", r: '1.15fr 1fr', c: '1fr 1fr' };
                return { a: "'a' 'b' 'c'", r: '1fr 1fr 1fr', c: '1fr' };
            }
            if (n === 1) return { a: "'a'", r: '1fr', c: '1fr' };
            if (n === 2) return { a: "'a b'", r: '1fr', c: '1.2fr 1fr' };
            if (n === 3) return { a: "'a b' 'a c'", r: '1fr 1fr', c: '1.35fr 1fr' };
            return { a: "'a a b' 'c d d'", r: '1fr 1fr', c: '1fr 1fr 1fr' };
        }
        const COVER_TXT = {
            tr: { saga: 'ZAMAN YOLCULUĞU SAGASI', price: '5<small>ÇEKİRDEK</small>', presents: 'BEARISTA VE EKİBİ', cover: 'KAPAK', finale: 'BÜYÜK FİNAL!', tm: 'YENİ MACERA BAŞLIYOR!' },
            en: { saga: 'THE TIME-TRAVEL SAGA', price: '5<small>BEANS</small>', presents: 'BEARISTA & CREW IN', cover: 'COVER', finale: 'THE GRAND FINALE!', tm: 'A NEW ADVENTURE BEGINS!' }
        };
        function coverSpec(id) {   // kapak yalnızca büyük anlarda: zaman makinesi, her dönem girişi, final
            const CT = () => COVER_TXT[CUR_LANG()] || COVER_TXT.tr;
            if (id === 'tm') return { shot: { sc: 'vortex', cam: 'low', actors: ALL4.map(k => [k, 'cheer']), fx: 'sparks', seed: 590 }, icon: () => ICON.hourglass(64), tag: () => CT().tm, music: 'heroic' };
            if (id === 'finale') return { shot: { sc: 'liberty', cam: 'low', vil: 'big', actors: [['barista', 'cheer'], ['cozybear', 'jump']], fx: 'sparks', seed: 990 }, icon: () => ICON.skyscraper(64), tag: () => CT().finale, music: 'battle' };
            if (id.startsWith('era:')) {
                const k = id.slice(4), ei = Engine.ERAS.findIndex(e => e.key === k);
                return { shot: { sc: k, cam: ei % 2 ? 'low' : 'hero', actors: ALL4.map(k2 => [k2, 'cheer']), fx: 'sparks', tm: true, tmX: -3.2, seed: 690 + ei * 10 }, icon: () => eraIcon(k, 64), tag: () => ERA_META[k].years[CUR_LANG()] };
            }
            return null;
        }
        const Cinema = {
            script: null, i: 0, t0: 0, raf: null, W: null, done: null, typing: null, dur: 6, last: 0, theme: null, eraN: 0,
            pages: [], pg: 0, pi: 0, panel: null, turnT: 0,
            el() {
                let m = $('cine');
                if (m) return m;
                m = document.createElement('div'); m.id = 'cine'; m.className = 'cine'; m.setAttribute('role', 'dialog');
                m.innerHTML = `<div class="kp-top"><span class="kp-pn" id="cn-pn"></span><span class="cn-dots" id="cn-dots"></span><button class="cn-skip" id="cn-skip" type="button"></button></div>
                    <div class="kp-book" id="kp-book"></div>
                    <div class="cn-title" id="cn-title"><small id="cn-issue"></small><b id="cn-ttl"></b></div>
                    <button class="btn cn-go" id="cn-go" type="button"></button>`;
                document.body.appendChild(m);
                m.addEventListener('click', e => { if (e.target.closest('.cn-skip') || e.target.closest('.cn-go')) return; Cinema.tap(); });
                $('cn-skip').onclick = () => Cinema.finish();
                $('cn-go').onclick = () => Cinema.finish();
                return m;
            },
            portrait() { const w = window.innerWidth, h = (window.visualViewport && window.visualViewport.height) || window.innerHeight; return w / h < 0.95; },
            play(id, done) {
                const sc = cinemaScript(id);
                if (!sc || !window.THREE) { if (done) done(); return; }
                this.script = sc; this.done = done; this.id = id;
                const m = this.el();
                m.setAttribute('lang', CUR_LANG());
                $('cn-skip').textContent = ST().comic.skip;
                $('cn-go').textContent = sc.cta || ST().comic.go;
                $('cn-go').classList.remove('show'); m.classList.remove('end');
                $('cn-issue').textContent = sc.issue || ''; $('cn-ttl').textContent = sc.title || '';
                m.classList.add('open'); document.body.classList.add('cine-open');
                stopCasinoMusic(); stopBonusMusic();
                // sayfalar
                const sizes = comicPages(sc.shots.length, this.portrait());
                let k = 0; this.pages = sizes.map(c => { const r = []; for (let j = 0; j < c; j++) r.push(k++); return r; });
                $('cn-dots').innerHTML = this.pages.map(() => '<i></i>').join('');
                window.addEventListener('resize', this._rs || (this._rs = () => this.resize()));
                $('cn-title').classList.remove('show'); void $('cn-title').offsetWidth;
                this.cover = !!coverSpec(id);
                if (!sc.short && !this.cover) $('cn-title').classList.add('show');
                this.theme = null;
                if (sc.era) { this.eraN = this.id.startsWith('ch:') ? +this.id.slice(3) : Engine.ERAS.find(e => e.key === sc.era).from; }
                if (this.cover) this.openCover(); else this.openPage(0);
                if (!this.raf) this.raf = requestAnimationFrame(t => this.frame(t));
            },
            /* dönem kapağı: tam sayfa, canlı 3D kapak resmi + başlık logosu, sayı numarası, fiyat etiketi */
            openCover() {
                const sc = this.script, spec = coverSpec(this.id), book = $('kp-book'), CT = COVER_TXT[CUR_LANG()] || COVER_TXT.tr;
                const iss = String(sc.issue || '').split('·'), no = (iss[0] || '').replace(/[^#0-9]/g, '') || '#';
                const pg = document.createElement('div'); pg.className = 'kp-page cover';
                pg.innerHTML = `<div class="kp kp-cv in live" data-i="cover"><div class="kp-art"></div><div class="kp-tone"></div>
                    <div class="cv-mast"><small>${CT.saga}</small><b>RECIPES OF BARISTA</b></div>
                    <div class="cv-no"><b>${esc(no)}</b><small>${esc((iss[1] || '').trim())}</small></div>
                    <div class="cv-price">${CT.price}</div>
                    <div class="cv-ttl"><small>${CT.presents}</small><b>${esc(sc.title || '')}</b>${spec.tag ? `<i>${esc(spec.tag())}</i>` : ''}</div>
                    <div class="cv-corner">${spec.icon()}</div></div>`;
                book.appendChild(pg);
                $('cn-pn').textContent = CT.cover; $('cn-dots').querySelectorAll('i').forEach(d => d.classList.remove('on'));
                this.i = -1; this.pi = -1; this.pg = -1; this.t0 = performance.now(); this.typing = null;
                this.panel = pg.querySelector('.kp');
                const asp = this.mount() || 0.7;
                if (this.W) World3D.dispose(this.W.scene);
                this.W = World3D.build(Object.assign({ shadows: !lowFx(), toon: true }, spec.shot), asp);
                this.music(spec.music || null);
                this.dur = 4.2;
                playSynthNote(98, 0.3, 'sawtooth', 0.05); playSynthNote(196, 0.4, 'triangle', 0.06);
            },
            openPage(p) {
                this.pg = p; this.turnT = 0;
                const sc = this.script, idx = this.pages[p], shots = idx.map(i => sc.shots[i]), port = this.portrait(), lay = comicLayout(shots, port);
                const book = $('kp-book'), old = book.querySelector('.kp-page');
                if (old) { old.classList.add('out'); setTimeout(() => old.remove(), 600); }
                const pg = document.createElement('div');
                pg.className = 'kp-page' + (p === 0 && !sc.short ? ' first' : '');
                const head = p === 0 && !sc.short ? `<div class="kp-head"><small>${esc(sc.issue || '')}</small><b>${esc(sc.title || '')}</b></div>` : '';
                pg.innerHTML = head + `<div class="kp-grid" style="grid-template-areas:${lay.a};grid-template-rows:${lay.r};grid-template-columns:${lay.c}">` + idx.map((si, j) => {
                    const s = sc.shots[si], area = 'abcd'[j], evil = s.bub && s.bub[0] === 'villain';
                    return `<div class="kp" data-i="${si}" style="grid-area:${area}"><div class="kp-art"></div><div class="kp-tone"></div><div class="kp-lines"></div>
                        ${s.narr ? `<div class="kp-cap">${s.tag ? `<i class="kp-tag">${esc(s.tag)}</i>` : ''}${letterHTML(s.narr)}</div>` : ''}
                        ${s.bub ? `<div class="kp-bub ${evil ? 'evil' : ''} ${(si % 2) ? 'l' : 'r'}"><b class="kp-who">${esc(castName(s.bub[0]))}</b><span></span></div>` : ''}
                        ${s.sfx ? `<div class="kp-sfx">${esc(s.sfx)}</div>` : ''}</div>`;
                }).join('') + '</div>';
                book.appendChild(pg);
                $('cn-pn').textContent = (p + 1) + '/' + this.pages.length;
                $('cn-dots').querySelectorAll('i').forEach((d, k) => d.classList.toggle('on', k <= p));
                if (p > 0) playPageFlip();
                this.show(idx[0], p === 0 && !sc.short ? 1500 : 450);
            },
            /* aktif panele canlı 3D tuvali yerleştir */
            mount() {
                const P = this.panel; if (!P) return;
                const art = P.querySelector('.kp-art'), R = World3D.renderer(), cv = R.domElement;
                if (cv.parentNode !== art) art.appendChild(cv);
                const w = Math.max(40, art.clientWidth), h = Math.max(40, art.clientHeight), q = lowFx() ? 0.7 : 1;
                R.setPixelRatio(Math.min(1.5, (window.devicePixelRatio || 1)) * q);
                R.setSize(w, h, false); cv.style.width = '100%'; cv.style.height = '100%';
                if (this.W) { this.W.cam.aspect = w / h; this.W.cam.updateProjectionMatrix(); }
                return w / h;
            },
            resize() { if (this.isOpen()) this.mount(); },
            freeze() {   // biten paneli dondur: son kare panele basılır
                const P = this.panel; if (!P || !this.W) return;
                try { World3D.render(this.W); P.querySelector('.kp-art').style.backgroundImage = `url(${World3D.renderer().domElement.toDataURL('image/jpeg', 0.84)})`; } catch (e) {}
                P.classList.add('done'); P.classList.remove('live');
                const b = P.querySelector('.kp-bub span'); if (b && this.typing && this.typing.panel === P) { this.typing.done = true; b.innerHTML = letterHTML(this.typing.txt); }
                P.querySelectorAll('.kp-cap,.kp-bub,.kp-sfx').forEach(x => x.classList.add('show'));
            },
            music(name) {
                if (isMuted) return;
                if (this.script.era && !name) { StoryMusic.stop(); if (typeof startEraMusic === 'function') startEraMusic(this.eraN); this.theme = 'era'; return; }
                if (name && name !== this.theme) { GameMusic.stop(); StoryMusic.start(name); this.theme = name; }
            },
            show(i, delay) {
                const sh = this.script.shots[i];
                this.i = i; this.pi = this.pages[this.pg].indexOf(i); this.t0 = performance.now(); this.typing = null; this.turnT = 0;
                this.timers = (this.timers || []).filter(x => { clearTimeout(x); return false; });
                if (this.W) World3D.dispose(this.W.scene);
                const P = $('kp-book').querySelector(`.kp-page:not(.out) .kp[data-i="${i}"]`);
                this.panel = P; P.classList.add('live', 'in');
                delay = delay || 350;
                const asp = this.mount() || 1;
                this.W = World3D.build(Object.assign({ shadows: !lowFx(), toon: true }, sh), asp);
                this.music(sh.music || (i === 0 && !this.script.era ? 'cozy' : null));
                const cap = P.querySelector('.kp-cap'), bub = P.querySelector('.kp-bub'), sfx = P.querySelector('.kp-sfx');
                if (cap) this.timers.push(setTimeout(() => cap.classList.add('show'), delay));
                if (sfx) this.timers.push(setTimeout(() => { sfx.classList.add('show'); P.classList.add('slam'); playSynthNote(110, 0.25, 'sawtooth', 0.06); playSynthNote(70, 0.35, 'sine', 0.08); buzz(30); }, delay + 650));
                let textLen = (sh.narr || '').length;
                if (bub && sh.bub) {
                    textLen += sh.bub[1].length;
                    this.timers.push(setTimeout(() => { bub.classList.add('show'); this.type(sh.bub[1], sh.bub[0], bub.querySelector('span'), P); }, delay + (sh.narr ? 1000 : 300)));
                }
                this.dur = Math.max(4.6, 2.2 + textLen * 0.045 + delay / 1000);
                if (i === this.script.shots.length - 1) this.timers.push(setTimeout(() => { $('cn-go').classList.add('show'); $('cine').classList.add('end'); this.mount(); }, this.dur * 1000 * 0.6));
            },
            type(txt, who, node, P) {
                let k = 0;
                this.typing = { txt, who, done: false, panel: P };
                const job = this.typing;
                const tick = () => { if (job !== this.typing || job.done) return; k += 2; node.textContent = txt.slice(0, k); if (k % 6 === 0) playSynthNote(who === 'villain' ? 180 : 620 + (k % 4) * 40, 0.03, 'triangle', 0.015); if (k >= txt.length) { job.done = true; node.innerHTML = letterHTML(txt); return; } setTimeout(tick, 28); };
                tick();
            },
            next() {   // sıradaki panel / sayfa
                if (this.cover) { this.cover = false; this.freeze(); this.openPage(0); return; }
                const idx = this.pages[this.pg];
                this.freeze();
                if (this.pi < idx.length - 1) { playSynthNote(620, 0.04); this.show(idx[this.pi + 1], 300); return; }
                if (this.pg < this.pages.length - 1) { this.openPage(this.pg + 1); return; }
                this.finish();
            },
            frame(now) {
                this.raf = null;
                if (!this.isOpen()) return;
                this.raf = requestAnimationFrame(t => this.frame(t));
                if (document.hidden) return;
                if (this.last && now - this.last < 30) return;   // hikâye 30 kare/sn: çizgi film akıcılığı, yarı GPU yükü
                const dt = this.last ? Math.min(0.05, (now - this.last) / 1000) : 0.016; this.last = now;
                const t = (now - this.t0) / 1000, u = t / this.dur;
                if (this.cover) {
                    if (this.W) { this.W.update(t, dt, Math.min(1, u), null); World3D.render(this.W); }
                    if (u >= 1) this.next();
                    return;
                }
                if (this.W && this.panel && !this.panel.classList.contains('done')) {
                    const sh = this.script.shots[this.i];
                    this.W.update(t, dt, Math.min(1, u), this.typing && !this.typing.done ? this.typing.who : (sh.bub && t > 1.5 ? sh.bub[0] : null));
                    World3D.render(this.W);
                }
                if (u >= 1) {
                    const last = this.i === this.script.shots.length - 1, endOfPage = this.pi === this.pages[this.pg].length - 1;
                    if (last) { if (!this.panel.classList.contains('done') && u >= 1.6) this.freeze(); return; }   // son kare: oyuncu "devam"a basana kadar bekler
                    if (endOfPage) { if (!this.turnT) this.turnT = now; if (now - this.turnT < 1100) return; }   // sayfa bitti: bir an bakılsın
                    this.next();
                }
            },
            tap() {
                if (this.typing && !this.typing.done) { this.typing.done = true; const P = this.typing.panel, n = P && P.querySelector('.kp-bub span'); if (n) n.innerHTML = letterHTML(this.typing.txt); if (P) P.querySelectorAll('.kp-cap').forEach(x => x.classList.add('show')); return; }
                this.next();
            },
            finish() {
                (this.timers || []).forEach(clearTimeout); this.timers = [];
                const m = $('cine'); if (m) m.classList.remove('open');
                document.body.classList.remove('cine-open');
                if (this.raf) cancelAnimationFrame(this.raf); this.raf = null; this.last = 0;
                if (this.W) { World3D.dispose(this.W.scene); this.W = null; }
                const cv = World3D.renderer().domElement; if (cv.parentNode) cv.parentNode.removeChild(cv);
                const book = $('kp-book'); if (book) book.innerHTML = '';   // dondurulmuş kareleri bellekten at
                this.panel = null; this.typing = null;
                try { StoryMusic.stop(); } catch (e) {}
                if (this.theme === 'era') GameMusic.stop();
                const d = this.done; this.done = null;
                if (d) d();
            },
            isOpen() { return !!($('cine') && $('cine').classList.contains('open')); }
        };
        const Comic = Cinema;   // eski çağrılar için
        function playStory(id) {
            if (Game.save) { Game.save.seen['story' + id] = true; persist(); }
            Cinema.play('s' + id, () => enterStage(id));
        }
        /* dönem arka planı (oyun ekranı) */
        function applyEraBackdrop(n) {
            const bg = $('bg-game'); if (!bg) return;
            if (!CHAPTERS[n] || !CHAPTERS[n].saga || !window.THREE) { bg.style.backgroundImage = ''; return; }
            const w = Math.min(1600, Math.round(window.innerWidth * Math.min(1.5, window.devicePixelRatio || 1))), h = Math.min(1600, Math.round(window.innerHeight * Math.min(1.5, window.devicePixelRatio || 1)));
            try { const k = Math.min(1, 1400 / Math.max(w, h)); const url = World3D.backdrop(n, Math.max(320, Math.round(w * k)), Math.max(320, Math.round(h * k))); if (url) bg.style.backgroundImage = `url(${url})`; } catch (e) { bg.style.backgroundImage = ''; }
        }
