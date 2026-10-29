        /* =====================================================
           3D SAHNE — gerçek silindir makaralar (tambur)
           Her makara 12 yüzlü bir tamburdur; yüzler dönerken ışığa göre
           aydınlanır/kararır, arkaya geçen yüzlere yeni semboller basılır.
           ===================================================== */
        const texCache = {};
        let maxAniso = 1;
        const FACES = 20;                                  // geniş tambur: 3 satırın üçü de net görünür
        const STEP = Math.PI * 2 / FACES;
        const APO = 0.5 / Math.tan(Math.PI / FACES);      // yüz merkezinin eksene uzaklığı (yüz yüksekliği = 1)
        const DRUM_Z = 0.36 - APO;                         // tambur ekseni (ön yüz z≈0.36)
        const VMAX = 19;                                   // rad/sn (≈3 tur/sn)
        let bulbs = [], drums = [], winFlash = 0, lastFrame = 0, lastRender = 0;

        function roundRectPath(ctx, x, y, w, h, r) {
            ctx.beginPath();
            ctx.moveTo(x + r, y);
            ctx.arcTo(x + w, y, x + w, y + h, r);
            ctx.arcTo(x + w, y + h, x, y + h, r);
            ctx.arcTo(x, y + h, x, y, r);
            ctx.arcTo(x, y, x + w, y, r);
            ctx.closePath();
        }

        function drawBadge(ctx, S, text, color, w) {
            roundRectPath(ctx, (S - w) / 2, 196, w, 36, 18);
            ctx.fillStyle = color;
            ctx.fill();
            ctx.lineWidth = 4;
            ctx.strokeStyle = '#FFF6EA';
            ctx.stroke();
            ctx.fillStyle = '#FFF6EA';
            ctx.font = '800 24px "Baloo 2", "Nunito", sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(text, S / 2, 215);
        }

        /* Kart çizimi (makara şeridi: kenarlar dahil tam dolu, saydamlık yok) */
        function drawCard(sym, mode) {
            const S = 256;
            const canvas = document.createElement('canvas');
            canvas.width = S; canvas.height = S;
            const ctx = canvas.getContext('2d');
            // şerit zemini (tamburun kâğıdı)
            const sg = ctx.createLinearGradient(0, 0, 0, S);
            sg.addColorStop(0, '#F3DFC0'); sg.addColorStop(0.5, '#FFF4E2'); sg.addColorStop(1, '#F3DFC0');
            ctx.fillStyle = sg;
            ctx.fillRect(0, 0, S, S);
            ctx.fillStyle = 'rgba(160,110,60,.35)';
            ctx.fillRect(0, 0, S, 3); ctx.fillRect(0, S - 3, S, 3);

            roundRectPath(ctx, 10, 10, S - 20, S - 20, 38);
            const g = ctx.createLinearGradient(0, 0, 0, S);
            let edge;
            if (mode === 'w') { g.addColorStop(0, '#FFF8D2'); g.addColorStop(1, '#FFC94E'); edge = '#E8832B'; }
            else if (sym.special === 'foam')  { g.addColorStop(0, '#F6FCEA'); g.addColorStop(1, '#D3EDA9'); edge = '#7FB548'; }
            else if (sym.special === 'wild')  { g.addColorStop(0, '#F4F9FF'); g.addColorStop(1, '#C9E0F8'); edge = '#6FA0D8'; }
            else if (sym.special === 'stamp') { g.addColorStop(0, '#FFF3EE'); g.addColorStop(1, '#F8CDBE'); edge = '#C9705A'; }
            else if (sym.special === 'oven')  { g.addColorStop(0, '#FFF0F6'); g.addColorStop(1, '#FFBFD6'); edge = '#E06A9D'; }
            else if (sym.special === 'bag')   { g.addColorStop(0, '#F7F3E6'); g.addColorStop(1, '#E3CF98'); edge = '#9C7A3C'; }
            else if (sym.id === 'book')       { g.addColorStop(0, '#FFF1EC'); g.addColorStop(1, '#FFCFC4'); edge = '#E36F6B'; }
            else                   { g.addColorStop(0, '#FFFDF7'); g.addColorStop(1, '#FBE3C4'); edge = '#D9A86A'; }
            ctx.fillStyle = g;
            ctx.fill();
            ctx.lineWidth = mode === 'w' ? 11 : 7;
            ctx.strokeStyle = edge;
            ctx.stroke();
            // üst parlama
            ctx.save();
            roundRectPath(ctx, 18, 18, S - 36, (S - 36) * 0.45, 30);
            ctx.clip();
            const hl = ctx.createLinearGradient(0, 18, 0, 18 + (S - 36) * 0.45);
            hl.addColorStop(0, 'rgba(255,255,255,.75)'); hl.addColorStop(1, 'rgba(255,255,255,0)');
            ctx.fillStyle = hl;
            ctx.fillRect(0, 0, S, S);
            ctx.restore();

            const img = IMG[sym.img];
            if (img && img.width) {
                const small = sym.id === 'book' || sym.special === 'stamp' || sym.special === 'oven' || sym.special === 'bag';
                const maxS = small ? 160 : 178;
                const sc = Math.min(maxS / img.width, maxS / img.height);
                const w = img.width * sc, h = img.height * sc;
                ctx.shadowColor = 'rgba(90,50,20,.35)'; ctx.shadowBlur = 10; ctx.shadowOffsetY = 5;
                ctx.drawImage(img, (S - w) / 2, (S - h) / 2 + (small ? -8 : 2), w, h);
                ctx.shadowColor = 'transparent';
            }
            const B = L().badge;
            if (sym.id === 'book') drawBadge(ctx, S, B.book, '#E36F6B', 124);
            else if (sym.special === 'foam') drawBadge(ctx, S, B.foam, '#6FA43E', 144);
            else if (sym.special === 'wild') drawBadge(ctx, S, B.wild, '#4F8FD0', 144);
            else if (sym.special === 'stamp') drawBadge(ctx, S, B.stamp, '#B8452F', 144);
            else if (sym.special === 'oven') drawBadge(ctx, S, B.oven, '#D9558F', 144);
            else if (sym.special === 'bag') drawBadge(ctx, S, B.bag, '#7A5A22', 160);
            if (mode === 'w') {        // kazanç parıltısı
                ctx.save();
                roundRectPath(ctx, 10, 10, S - 20, S - 20, 38);
                ctx.lineWidth = 5; ctx.strokeStyle = 'rgba(255,255,255,.95)';
                ctx.shadowColor = '#FFE27A'; ctx.shadowBlur = 18;
                ctx.stroke();
                ctx.restore();
            }
            return canvas;
        }

        function makeTex(canvas) {
            const tex = new THREE.CanvasTexture(canvas);
            tex.anisotropy = maxAniso;
            if (THREE.sRGBEncoding !== undefined) tex.encoding = THREE.sRGBEncoding;
            return tex;
        }

        /* mode: 'n' normal, 'w' kazanan, 'b' hareket bulanıklığı (hızlı dönüş) */
        function getSymbolTexture(sym, win, blur) {
            const mode = win ? 'w' : blur ? 'b' : 'n';
            const key = sym.id + ':' + mode + ':' + CUR_LANG();
            if (texCache[key]) return texCache[key];
            let canvas;
            if (mode === 'b') {
                const base = drawCard(sym, 'n');
                canvas = document.createElement('canvas');
                canvas.width = base.width; canvas.height = base.height;
                const c = canvas.getContext('2d');
                const offs = [-30, -20, -10, 0, 10, 20, 30];
                // dikey hareket izi: kopyaları kaydırarak üst üste bindir
                offs.forEach((o, i) => { c.globalAlpha = i === 3 ? 0.5 : 0.16; c.drawImage(base, 0, o); });
                c.globalAlpha = 1;
            } else canvas = drawCard(sym, mode);
            texCache[key] = makeTex(canvas);
            return texCache[key];
        }

        function setFace(face, sym, win, blur) {
            face.userData.sym = sym;
            face.userData.win = !!win;
            face.userData.blur = !!blur;
            face.material.map = getSymbolTexture(sym, win, blur);
            face.material.needsUpdate = true;
        }
        /* eski çağrılar için: (mesh, sym, win) */
        function updateSymbolMesh(mesh, sym, win) { setFace(mesh, sym, win, false); }

        function srgb(hex) { const c = new THREE.Color(hex); if (c.convertSRGBToLinear && THREE.sRGBEncoding !== undefined) c.convertSRGBToLinear(); return c; }

        function gradTex(stops, w, h, horizontal) {
            const cv = document.createElement('canvas');
            cv.width = w || 16; cv.height = h || 256;
            const c = cv.getContext('2d');
            const g = horizontal ? c.createLinearGradient(0, 0, cv.width, 0) : c.createLinearGradient(0, 0, 0, cv.height);
            stops.forEach(s => g.addColorStop(s[0], s[1]));
            c.fillStyle = g;
            c.fillRect(0, 0, cv.width, cv.height);
            return makeTex(cv);
        }

        /* Renderer bir kez kurulur; makara sayısı değişince (6. makara) sahne yeniden inşa edilir */
        function initThreeJS() {
            const container = document.getElementById('three-container');
            const N = reelCount();
            $('reel-wrap').classList.toggle('six', N === 6);

            if (threeReady && builtReels === N) {
                refreshGridMeshes();
                onWindowResize();
                startRender();
                return;
            }
            if (!window.THREE) {
                container.innerHTML = '<p style="padding:20px;text-align:center;color:#fff">3D motoru yüklenemedi. İnternet bağlantını kontrol edip sayfayı yenile.</p>';
                return;
            }
            if (!renderer) {
                try {
                    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
                } catch (e) {
                    container.innerHTML = '<p style="padding:20px;text-align:center;color:#fff">Bu tarayıcı WebGL desteklemiyor.</p>';
                    return;
                }
                renderer.setClearColor(0x000000, 0);
                renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
                if (THREE.sRGBEncoding !== undefined) renderer.outputEncoding = THREE.sRGBEncoding;
                container.innerHTML = '';
                container.appendChild(renderer.domElement);
                maxAniso = Math.min(8, renderer.capabilities.getMaxAnisotropy());
                window.addEventListener('resize', onWindowResize);
                if (window.ResizeObserver) new ResizeObserver(onWindowResize).observe(container);
            }
            buildReelScene(N);
            threeReady = true;
            onWindowResize();
            startRender();
        }

        function roundedRectShape(w, h, r) {
            const s = new THREE.Shape();
            const x = -w / 2, y = -h / 2;
            s.moveTo(x + r, y);
            s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r);
            s.lineTo(x + w, y + h - r); s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
            s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r);
            s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y);
            return s;
        }
        function roundedRectPathTHREE(w, h, r) {
            const s = new THREE.Path();
            const x = -w / 2, y = -h / 2;
            s.moveTo(x + r, y);
            s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r);
            s.lineTo(x + w, y + h - r); s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
            s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r);
            s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y);
            return s;
        }
        function frameRing(ow, oh, orad, iw, ih, irad, depth, mat) {
            const shape = roundedRectShape(ow, oh, orad);
            shape.holes.push(roundedRectPathTHREE(iw, ih, irad));
            const geo = new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: true, bevelThickness: 0.06, bevelSize: 0.05, bevelSegments: 3, curveSegments: 10 });
            return new THREE.Mesh(geo, mat);
        }

        function buildReelScene(N) {
            scene = new THREE.Scene();
            camera = new THREE.PerspectiveCamera(42, 1.5, 0.1, 100);
            camera.position.set(0, 0.25, 8);

            // --- ışıklar (dolaba renk ve parlaklık) ---
            scene.add(new THREE.AmbientLight(0xfff1dc, 0.45));
            scene.add(new THREE.HemisphereLight(0xfff6e5, 0x7a4a28, 0.45));
            const key = new THREE.DirectionalLight(0xfff0d6, 0.95);
            key.position.set(2.5, 5, 8);
            scene.add(key);
            const pink = new THREE.PointLight(0xff7eb6, 0.75, 14);
            pink.position.set(-N / 2 - 1.2, 1.8, 2.6);
            scene.add(pink);
            const cyan = new THREE.PointLight(0x6fd6ff, 0.65, 14);
            cyan.position.set(N / 2 + 1.2, -1.6, 2.6);
            scene.add(cyan);

            const WIN_W = N + 0.1, WIN_H = 3.0;

            // --- makara penceresinin arkası (koyu boşluk) ---
            const back = new THREE.Mesh(new THREE.PlaneGeometry(WIN_W + 0.4, WIN_H + 0.6), new THREE.MeshBasicMaterial({ color: srgb(0x2a160b) }));
            back.position.z = DRUM_Z - APO - 0.2;
            scene.add(back);

            // --- tamburlar ---
            drums = [];
            reelColumns = [];
            const bodyMat = new THREE.MeshStandardMaterial({ color: srgb(0xEED6B4), roughness: 0.7, metalness: 0.0, side: THREE.DoubleSide });
            const capMat = new THREE.MeshStandardMaterial({ color: srgb(0xD9A85A), roughness: 0.35, metalness: 0.55 });
            for (let r = 0; r < N; r++) {
                const holder = new THREE.Group();
                holder.position.set(-(N - 1) / 2 + r, 0, DRUM_Z);
                scene.add(holder);
                const group = new THREE.Group();           // dönen kısım
                holder.add(group);
                const body = new THREE.Mesh(new THREE.CylinderGeometry(APO - 0.01, APO - 0.01, 0.9, 48, 1, true), bodyMat);
                body.rotation.z = Math.PI / 2;
                group.add(body);
                [-0.47, 0.47].forEach(x => {               // altın kenar halkaları
                    const ring = new THREE.Mesh(new THREE.CylinderGeometry(APO + 0.03, APO + 0.03, 0.04, 48), capMat);
                    ring.rotation.z = Math.PI / 2;
                    ring.position.x = x;
                    group.add(ring);
                });
                const faces = [];
                for (let k = 0; k < FACES; k++) {
                    const th = k * STEP;
                    const mat = new THREE.MeshBasicMaterial({ map: getSymbolTexture(visualSymbol(r), false), color: 0xffffff });
                    const face = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 1.0), mat);
                    face.position.set(0, APO * Math.sin(th), APO * Math.cos(th));
                    face.rotation.x = -th;
                    face.userData = { k, sym: null, locked: false, dirty: false, base: { y: face.position.y, z: face.position.z } };
                    group.add(face);
                    faces.push(face);
                }
                const d = { r, holder, group, faces, phi: 0, v: 0, mode: 'idle', t: 0, mid: 0, speedF: 1, onLand: null };
                drums.push(d);
                reelColumns.push({ group, drum: d });
                if (!gameState.grid[r]) gameState.grid[r] = [];
                for (let row = 0; row < 3; row++) if (!gameState.grid[r][row]) gameState.grid[r][row] = visualSymbol(r);
                faces.forEach(f => setFace(f, visualSymbol(r), false));
                for (let row = 0; row < 3; row++) setFace(meshAt(r, row), gameState.grid[r][row], false);
                updateFaceShading(d);
            }

            // --- derinlik gölgesi (üst/alt kararır) + cam yansıması ---
            const shade = new THREE.Mesh(new THREE.PlaneGeometry(WIN_W, WIN_H), new THREE.MeshBasicMaterial({
                map: gradTex([[0, 'rgba(20,8,2,.85)'], [0.045, 'rgba(20,8,2,.35)'], [0.09, 'rgba(20,8,2,0)'], [0.91, 'rgba(20,8,2,0)'], [0.955, 'rgba(20,8,2,.35)'], [1, 'rgba(20,8,2,.85)']]),
                transparent: true, depthWrite: false }));
            shade.position.z = 0.5;
            scene.add(shade);
            const glass = new THREE.Mesh(new THREE.PlaneGeometry(WIN_W, WIN_H), new THREE.MeshBasicMaterial({
                map: gradTex([[0, 'rgba(255,255,255,0)'], [0.18, 'rgba(255,255,255,.16)'], [0.26, 'rgba(255,255,255,0)'], [0.62, 'rgba(255,255,255,0)'], [0.7, 'rgba(255,255,255,.08)'], [0.76, 'rgba(255,255,255,0)']], 256, 16, true),
                transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
            glass.position.z = 0.52;
            glass.rotation.z = -0.12;
            glass.scale.set(1.05, 1.05, 1);
            scene.add(glass);

            // --- makara ayırıcıları (altın çubuklar) ---
            const sepMat = new THREE.MeshStandardMaterial({ color: srgb(0xE3AE4A), roughness: 0.3, metalness: 0.7 });
            for (let i = 1; i < N; i++) {
                const sep = new THREE.Mesh(new THREE.BoxGeometry(0.05, WIN_H, 0.06), sepMat);
                sep.position.set(-N / 2 + i, 0, 0.47);
                scene.add(sep);
            }

            // --- dolap: ahşap çerçeve + altın iç kenar ---
            const wood = new THREE.MeshStandardMaterial({ color: srgb(0x8A5530), roughness: 0.55, metalness: 0.05 });
            const gold = new THREE.MeshStandardMaterial({ color: srgb(0xF2C25A), roughness: 0.28, metalness: 0.75, emissive: srgb(0x3a2200), emissiveIntensity: 0.4 });
            const outer = frameRing(N + 1.1, WIN_H + 1.15, 0.45, WIN_W, WIN_H, 0.18, 0.28, wood);
            outer.position.z = 0.38;
            scene.add(outer);
            const rim = frameRing(WIN_W + 0.22, WIN_H + 0.22, 0.24, WIN_W, WIN_H, 0.16, 0.08, gold);
            rim.position.z = 0.62;
            scene.add(rim);

            // --- renkli ampuller (çerçeve boyunca kayan ışıklar) ---
            bulbs = [];
            const palette = [0xFFD27A, 0xFF8FAB, 0x7FE3FF, 0xA8F07A];
            // ampuller ahşap bandın tam ortasından, çerçevenin yuvarlak köşelerini izleyerek dizilir
            const inX = WIN_W / 2 + 0.11, outX = (N + 1.1) / 2, inY = WIN_H / 2 + 0.11, outY = (WIN_H + 1.15) / 2;
            const hx = (inX + outX) / 2, hy = (inY + outY) / 2, cr = 0.24;   // yol yarı-genişlik/yükseklik + köşe yarıçapı
            const segs = [];   // yuvarlak dikdörtgen çevresi: düz kenarlar + çeyrek yaylar
            const sx = hx - cr, sy = hy - cr;
            const perim = 4 * sx + 4 * sy + 2 * Math.PI * cr;
            const count = Math.max(16, Math.round(perim / 0.4));
            const pts = [];
            const at = (s) => {   // s: 0..perim, sol üstten saat yönünde
                const L1 = 2 * sx, A = Math.PI * cr / 2, L2 = 2 * sy;
                const seq = [['l', -sx, hy, 1, 0, L1], ['a', sx, sy, Math.PI / 2, -1, A], ['l', hx, sy, 0, -1, L2], ['a', sx, -sy, 0, -1, A],
                             ['l', sx, -hy, -1, 0, L1], ['a', -sx, -sy, -Math.PI / 2, -1, A], ['l', -hx, -sy, 0, 1, L2], ['a', -sx, sy, Math.PI, -1, A]];
                for (const g of seq) {
                    const len = g[5];
                    if (s <= len) {
                        if (g[0] === 'l') return [g[1] + g[3] * s, g[2] + g[4] * s];
                        const ang = g[3] + g[4] * (s / cr);
                        return [g[1] + cr * Math.cos(ang), g[2] + cr * Math.sin(ang)];
                    }
                    s -= len;
                }
                return [-sx, hy];
            };
            for (let i = 0; i < count; i++) pts.push(at(perim * i / count));
            const bulbGeo = new THREE.SphereGeometry(0.065, 14, 14);
            pts.forEach((p, i) => {
                const c = palette[i % palette.length];
                const m = new THREE.MeshStandardMaterial({ color: srgb(c), emissive: srgb(c), emissiveIntensity: 0.8, roughness: 0.3 });
                const b = new THREE.Mesh(bulbGeo, m);
                b.position.set(p[0], p[1], 0.69);
                scene.add(b);
                bulbs.push(b);
            });

            // --- heyecan (2 Wild) parıltısı: makara önünde parlayan çerçeve ---
            teasePlanes = [];
            const teaseTex = (() => {
                const cv = document.createElement('canvas'); cv.width = 128; cv.height = 384;
                const c = cv.getContext('2d');
                c.shadowColor = '#FFD24A'; c.shadowBlur = 26;
                c.strokeStyle = 'rgba(255,220,90,1)'; c.lineWidth = 12;
                roundRectPath(c, 14, 14, 100, 356, 18); c.stroke();
                return makeTex(cv);
            })();
            for (let r = 0; r < N; r++) {
                const m = new THREE.Mesh(new THREE.PlaneGeometry(1.02, WIN_H + 0.04), new THREE.MeshBasicMaterial({ map: teaseTex, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending }));
                m.position.set(-(N - 1) / 2 + r, 0, 0.56);
                m.visible = false;
                scene.add(m);
                teasePlanes.push(m);
            }

            gameState.grid.length = N;
            builtReels = N;
            winningMeshRefs = [];
            lastFrame = 0;
        }

        /* Hücrenin kapsayıcıdaki konumu (%) — perspektif izdüşümü */
        function cellScreenPos(r, row) {
            const N = builtReels || 5;
            const x = -(N - 1) / 2 + r;
            const a = (1 - row) * STEP;
            const y = APO * Math.sin(a), z = DRUM_Z + APO * Math.cos(a);
            const cont = document.getElementById('three-container');
            const W = cont.clientWidth || 1, H = cont.clientHeight || 1;
            const f = (H / 2) / Math.tan(((camera && camera.fov) || 42) * Math.PI / 360);
            const camZ = camera ? camera.position.z : 9, camY = camera ? camera.position.y : 0;
            const sc = f / (camZ - z);
            return { x: (W / 2 + x * sc) / W * 100, y: (H / 2 - (y - camY) * sc) / H * 100 };
        }

        /* Görünür satırın yüzü: 0 = üst, 1 = orta, 2 = alt */
        function meshAt(r, row) {
            const d = drums[r];
            if (!d) return null;
            return d.faces[((d.mid + (1 - row)) % FACES + FACES) % FACES];
        }

        /* Yüzün ekrandaki açısına göre ışık (öne bakan parlak, kenara dönen koyu) */
        function updateFaceShading(d) {
            d.faces.forEach(f => {
                let a = f.userData.k * STEP - d.phi;
                a = Math.atan2(Math.sin(a), Math.cos(a));
                const c = Math.cos(a);
                // görünen 3 satır (±1 adım) tam parlak; pencereden çıkan yüzler hızla kararır (silindir derinliği)
                const edge = Math.abs(a) - STEP * 1.25;
                const b = edge <= 0 ? 1.0 - 0.05 * Math.abs(a) / STEP : Math.max(0.08, 1.0 - edge * 3.2);
                f.material.color.setScalar(Math.max(0.12, Math.min(1.08, b)));
                f.userData.disp = a;
            });
        }

        function refreshGridMeshes() {
            winningMeshRefs = [];
            drums.forEach((d, r) => {
                if (!gameState.grid[r]) gameState.grid[r] = [];
                d.faces.forEach(f => { f.scale.set(1, 1, 1); f.rotation.z = 0; });
                for (let row = 0; row < 3; row++) {
                    if (!gameState.grid[r][row]) gameState.grid[r][row] = visualSymbol(r);
                    setFace(meshAt(r, row), gameState.grid[r][row], false);
                }
            });
        }

        /* ---------- Makara hareketi ---------- */
        const Reels = {
            fast: false,
            startAll(fast) {
                const now = performance.now();
                this.fast = !!fast;
                drums.forEach((d, i) => {
                    d.faces.forEach(f => { f.userData.locked = false; f.scale.set(1, 1, 1); f.rotation.z = 0; });
                    d.mode = 'wind'; d.t = now + i * (fast ? 12 : 45); d.phi0 = d.phi; d.v = 0; d.speedF = 1; d.onLand = null;
                });
            },
            setSpeed(r, f) { if (drums[r]) drums[r].speedF = f; },
            /* hedef sembolleri arkadaki (görünmeyen) yüzlere yaz, sonra yavaşlayıp dur */
            requestStop(r, col, onLand) {
                const d = drums[r];
                if (!d) { onLand && onLand(); return; }
                const m = Math.ceil((d.phi + Math.PI) / STEP);
                d.target = m * STEP;
                const fi = k => ((k % FACES) + FACES) % FACES;
                const top = d.faces[fi(m + 1)], mid = d.faces[fi(m)], bot = d.faces[fi(m - 1)];
                setFace(top, col[0], false); setFace(mid, col[1], false); setFace(bot, col[2], false);
                [top, mid, bot].forEach(f => { f.userData.locked = true; });
                d.newMid = fi(m);
                d.onLand = onLand;
                d.pending = true;               // hız sabitlenince yavaşlamaya geç
            },
            idle() { return drums.every(d => d.mode === 'idle' || d.mode === 'settle'); }
        };

        function stepDrum(d, now, dt) {
            const OV = 0.17;
            if (d.mode === 'idle') return;
            if (d.mode === 'wind') {                       // geri çekilme (beklenti)
                const u = Math.min(1, Math.max(0, (now - d.t) / (Reels.fast ? 50 : 140)));
                d.phi = d.phi0 - 0.2 * Math.sin(u * Math.PI / 2);
                if (u >= 1) { d.mode = 'accel'; d.v = 0; }
            } else if (d.mode === 'accel' || d.mode === 'spin') {
                const vt = VMAX * d.speedF;
                d.v += (vt - d.v) * Math.min(1, dt * (d.mode === 'accel' ? (Reels.fast ? 14 : 6) : 4));
                if (d.mode === 'accel' && d.v > vt * 0.92) d.mode = 'spin';
                d.phi += d.v * dt;
                if (d.pending && d.mode === 'spin') {
                    // hedefi yeniden hesapla (arada geçen açı yüzünden)
                    const fi = k => ((k % FACES) + FACES) % FACES;
                    const quick = Reels.fast && d.speedF >= 1;   // turbo: kısa fren (heyecan makaraları hariç)
                    while (d.target - d.phi < Math.PI * (quick ? 0.5 : 0.85)) {
                        // hedef yüzler öne yaklaştıysa bir tur ileri at: aynı yüzlere yaz, hedefi 2π ileri al
                        d.target += Math.PI * 2;
                    }
                    d.pending = false;
                    d.mode = 'decel';
                    d.p0 = d.phi; d.dist = d.target + OV - d.phi;
                    d.T = quick ? Math.max(0.14, 1.3 * d.dist / Math.max(4, d.v)) : Math.max(0.35, 3 * d.dist / Math.max(4, d.v));
                    d.t = now;
                    void fi;
                }
            } else if (d.mode === 'decel') {
                const u = Math.min(1, (now - d.t) / (d.T * 1000));
                d.phi = d.p0 + d.dist * (1 - Math.pow(1 - u, 3));
                d.v = 3 * d.dist / d.T * Math.pow(1 - u, 2);
                if (u >= 1) {
                    d.mode = 'settle'; d.t = now;
                    d.mid = d.newMid;
                    const cb = d.onLand; d.onLand = null;
                    if (cb) cb();
                }
            } else if (d.mode === 'settle') {          // hafif geri sekme
                const u = Math.min(1, (now - d.t) / (Reels.fast ? 120 : 230));
                const e = u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2;
                d.phi = d.target + OV * (1 - e);
                if (u >= 1) {
                    d.mode = 'idle';
                    d.phi = d.mid * STEP;              // açıyı normalize et
                    d.v = 0;
                }
            }
            d.group.rotation.x = d.phi;

            // arkaya geçen (görünmeyen) yüzlere yeni rastgele semboller; hızlıyken bulanık doku
            const fast = d.v > 9;
            d.faces.forEach(f => {
                let a = f.userData.k * STEP - d.phi;
                a = Math.atan2(Math.sin(a), Math.cos(a));
                if (!f.userData.locked) {
                    if (Math.cos(a) < -0.35) {
                        if (!f.userData.dirty) { f.userData.dirty = true; setFace(f, visualSymbol(d.r), false, fast); }
                    } else f.userData.dirty = false;
                }
                if (f.userData.blur !== fast && !f.userData.win && f.userData.sym) setFace(f, f.userData.sym, false, fast && !f.userData.locked);
                if (f.userData.locked && f.userData.blur && !fast) setFace(f, f.userData.sym, false, false);
            });
            updateFaceShading(d);
        }

        function setTease(r, on) {
            const p = teasePlanes[r];
            if (p) p.visible = !!on;
        }
        function clearTease() { teasePlanes.forEach(p => { p.visible = false; }); $('reel-wrap').classList.remove('tease'); }
        function flashLights() { winFlash = performance.now(); }

        function onWindowResize() {
            const container = document.getElementById('three-container');
            if (!container || !renderer || !camera) return;
            const width = container.clientWidth;
            const height = container.clientHeight;
            if (!width || !height) return;
            renderer.setSize(width, height, false);
            camera.aspect = width / height;
            const t = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
            const distH = 4.45 / (2 * t);
            const distW = (builtReels + 1.5) / (2 * t * camera.aspect);
            camera.position.z = Math.max(distH, distW) + 0.6;
            camera.lookAt(0, 0, 0);
            camera.updateProjectionMatrix();
        }

        function startRender() {
            threeActive = true;
            if (rafId === null) rafId = requestAnimationFrame(animate3D);
        }
        function stopRender() {
            threeActive = false;
            if (rafId !== null) { cancelAnimationFrame(rafId); rafId = null; }
        }

        function animate3D() {
            rafId = null;
            if (!threeActive) return;
            rafId = requestAnimationFrame(animate3D);

            const now = performance.now();
            // pil/işlemci tasarrufu: boştayken (dönüş, kazanç, heyecan yokken) ~15 kare/sn yeter
            const busy = drums.some(d => d.mode !== 'idle') || winningMeshRefs.length > 0 || now - winFlash < 1600 || teasePlanes.some(p => p.visible);
            if (document.hidden || (!busy && now - lastRender < 66)) return;
            lastRender = now;
            const dt = lastFrame ? Math.min(0.05, (now - lastFrame) / 1000) : 0.016;
            lastFrame = now;
            drums.forEach(d => stepDrum(d, now, dt));

            const time = now * 0.007;
            winningMeshRefs.forEach(mesh => {
                let base = 1;
                const ps = mesh.userData && mesh.userData.popStart;
                if (ps) {
                    const k = (now - ps) / 420;
                    if (k < 0) base = 1;
                    else if (k < 1) base = 0.6 + 0.4 * (1 - Math.pow(1 - k, 3)) + Math.sin(k * Math.PI) * 0.22;
                    else mesh.userData.popStart = 0;
                }
                mesh.rotation.z = Math.sin(time) * 0.08;
                const scale = base * (1.0 + Math.sin(time * 3) * 0.06);
                mesh.scale.set(scale, scale, 1);
            });

            // heyecan parıltısı
            teasePlanes.forEach((p, i) => {
                if (p.visible) p.material.opacity = 0.55 + Math.sin(now * 0.014 + i) * 0.4;
            });

            // ampuller: yavaş kayan ışık; dönüşte hızlanır, kazançta yanıp söner
            const spinning = drums.some(d => d.mode !== 'idle');
            const flashing = now - winFlash < 1600;
            const speed = flashing ? 0.02 : spinning ? 0.012 : 0.004;
            bulbs.forEach((b, i) => {
                const w = Math.sin(now * speed - i * 0.55);
                b.material.emissiveIntensity = flashing ? (Math.floor(now / 110 + i) % 2 ? 1.6 : 0.25) : 0.35 + 0.9 * Math.max(0, w);
            });

            if (renderer && scene && camera) renderer.render(scene, camera);
        }
