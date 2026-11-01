        /* =====================================================
           3D SAHNE — gerçek silindir makaralar (tambur)
           Her makara 12 yüzlü bir tamburdur; yüzler dönerken ışığa göre
           aydınlanır/kararır, arkaya geçen yüzlere yeni semboller basılır.
           ===================================================== */
        const texCache = {};
        let maxAniso = 1;
        const FACES = 28;                                  // geniş tambur: 5 satırın beşi de net görünür
        const RW = Engine.ROWS, RMID = (Engine.ROWS - 1) / 2;   // görünen satır sayısı ve orta satır
        const STEP = Math.PI * 2 / FACES;
        const APO = 0.5 / Math.tan(Math.PI / FACES);      // yüz merkezinin eksene uzaklığı (yüz yüksekliği = 1)
        const DRUM_Z = 0.36 - APO;                         // tambur ekseni (ön yüz z≈0.36)
        const VMAX = 19;                                   // rad/sn (≈3 tur/sn)
        let bulbs = [], drums = [], winFlash = 0, lastFrame = 0, lastRender = 0, frameMats = null, frameH = 0;
        /* Görünüm değişince çerçeve renklerini sahneyi yeniden kurmadan güncelle */
        function applyFrameSkin() {
            if (!frameMats || !window.THREE) return;
            const SK = FRAME_SKINS[cosmEquipped('frame')] || FRAME_SKINS.klasik;
            frameMats.wood.color = srgb(SK.wood); frameMats.gold.color = srgb(SK.gold); frameMats.gold.emissive = srgb(SK.glow);
            if (frameMats.back) frameMats.back.color = srgb(SK.back);
            bulbs.forEach((b, i) => { const c = SK.bulbs[i % SK.bulbs.length]; b.material.color = srgb(c); b.material.emissive = srgb(c); });
            if (hwDecor) hwDecor.visible = cosmEquipped('frame') === 'balkabagi';
        }


        /* ---------- Cadılar Bayramı çerçeve süsleri (Balkabağı çerçevesi takılıyken) ---------- */
        let hwDecor = null;
        function hwTex(kind) {
            const cv = document.createElement('canvas'); cv.width = cv.height = 256;
            const c = cv.getContext('2d');
            if (kind === 'pumpkin') {
                c.translate(128, 140);
                const g = c.createRadialGradient(-30, -30, 10, 0, 0, 120); g.addColorStop(0, '#FFB25A'); g.addColorStop(.6, '#FF7A12'); g.addColorStop(1, '#B4420A');
                c.lineWidth = 7; c.strokeStyle = '#4A1C05'; c.fillStyle = g;
                [[-58, 0, 52], [58, 0, 52], [-26, 0, 60], [26, 0, 60], [0, 0, 62]].forEach(([x, y, rx]) => { c.beginPath(); c.ellipse(x, y, rx, 86, 0, 0, Math.PI * 2); c.fill(); c.stroke(); });
                c.fillStyle = '#5E8C2A'; c.strokeStyle = '#2E4A12'; c.beginPath(); c.moveTo(-10, -84); c.quadraticCurveTo(-4, -124, 22, -126); c.lineTo(16, -110); c.quadraticCurveTo(8, -100, 10, -82); c.closePath(); c.fill(); c.stroke();
                const glow = c.createRadialGradient(0, 10, 4, 0, 10, 70); glow.addColorStop(0, '#FFF7B0'); glow.addColorStop(.5, '#FFD23A'); glow.addColorStop(1, '#FF9A1A');
                c.fillStyle = glow; c.strokeStyle = '#4A1C05'; c.lineWidth = 5;
                const tri = (x, y, s) => { c.beginPath(); c.moveTo(x - s, y + s * .7); c.lineTo(x, y - s * .8); c.lineTo(x + s, y + s * .7); c.closePath(); c.fill(); c.stroke(); };
                tri(-36, -18, 20); tri(36, -18, 20); tri(0, 14, 11);
                c.beginPath(); c.moveTo(-56, 30); c.quadraticCurveTo(0, 82, 56, 30); c.lineTo(40, 38); c.lineTo(30, 52); c.lineTo(18, 42); c.lineTo(4, 58); c.lineTo(-8, 44); c.lineTo(-20, 56); c.lineTo(-32, 42); c.lineTo(-44, 48); c.closePath(); c.fill(); c.stroke();
            } else if (kind === 'web') {
                c.strokeStyle = 'rgba(255,255,255,.85)'; c.lineWidth = 3; c.shadowColor = 'rgba(200,170,255,.9)'; c.shadowBlur = 6;
                for (let i = 0; i <= 6; i++) { const a = i / 6 * Math.PI / 2; c.beginPath(); c.moveTo(0, 0); c.lineTo(Math.cos(a) * 250, Math.sin(a) * 250); c.stroke(); }
                for (let r = 40; r < 250; r += 38) { c.beginPath(); for (let i = 0; i <= 6; i++) { const a = i / 6 * Math.PI / 2, rr = r + (i % 2 ? -7 : 0); i ? c.lineTo(Math.cos(a) * rr, Math.sin(a) * rr) : c.moveTo(Math.cos(a) * rr, Math.sin(a) * rr); } c.stroke(); }
            } else if (kind === 'spider') {
                c.translate(128, 128); c.strokeStyle = '#140818'; c.lineWidth = 9; c.lineCap = 'round';
                [-1, 1].forEach(s => [[-50, -40], [-62, -6], [-60, 30], [-44, 60]].forEach(([x, y]) => { c.beginPath(); c.moveTo(0, 6); c.quadraticCurveTo(s * x * .6, y - 30, s * x, y); c.stroke(); }));
                c.fillStyle = '#1E0B24'; c.beginPath(); c.ellipse(0, 24, 38, 44, 0, 0, Math.PI * 2); c.fill(); c.beginPath(); c.arc(0, -22, 24, 0, Math.PI * 2); c.fill();
                c.fillStyle = '#FF8A1E'; c.beginPath(); c.arc(-9, -26, 6, 0, Math.PI * 2); c.arc(9, -26, 6, 0, Math.PI * 2); c.fill();
                c.fillStyle = '#B66DFF'; c.beginPath(); c.moveTo(0, 8); c.lineTo(12, 26); c.lineTo(0, 44); c.lineTo(-12, 26); c.closePath(); c.fill();
            } else if (kind === 'ghost') {
                c.translate(128, 120); c.fillStyle = 'rgba(255,255,255,.92)'; c.strokeStyle = 'rgba(180,140,255,.9)'; c.lineWidth = 5; c.shadowColor = 'rgba(190,150,255,.9)'; c.shadowBlur = 18;
                c.beginPath(); c.moveTo(-70, 100); c.lineTo(-70, -20); c.bezierCurveTo(-70, -110, 70, -110, 70, -20); c.lineTo(70, 100);
                for (let i = 0; i < 5; i++) c.quadraticCurveTo(56 - i * 28, 80, 42 - i * 28, 100);
                c.closePath(); c.fill(); c.stroke(); c.shadowBlur = 0;
                c.fillStyle = '#2A1238'; c.beginPath(); c.ellipse(-24, -20, 11, 15, 0, 0, Math.PI * 2); c.ellipse(24, -20, 11, 15, 0, 0, Math.PI * 2); c.fill();
                c.fillStyle = '#FF9FBF'; c.beginPath(); c.ellipse(-40, 6, 10, 6, 0, 0, Math.PI * 2); c.ellipse(40, 6, 10, 6, 0, 0, Math.PI * 2); c.fill();
                c.strokeStyle = '#2A1238'; c.lineWidth = 5; c.beginPath(); c.arc(0, 8, 12, 0.15 * Math.PI, 0.85 * Math.PI); c.stroke();
            }
            return makeTex(cv);
        }
        function buildHwDecor(N, WIN_H) {
            const g = new THREE.Group();
            const ox = (N + 1.1) / 2, oy = (WIN_H + 1.15) / 2;
            const plane = (tex, s, x, y, z) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(s, s), new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false })); m.position.set(x, y, z); g.add(m); return m; };
            const pk = hwTex('pumpkin');
            g.userData.pumpkins = [plane(pk, 0.9, -ox + 0.12, -oy + 0.36, 0.86), plane(pk, 0.78, ox - 0.1, -oy + 0.32, 0.86), plane(pk, 0.5, -ox + 0.68, -oy + 0.2, 0.84)];
            const web = plane(hwTex('web'), 1.0, -ox + 0.5, oy - 0.5, 0.8); web.rotation.z = -Math.PI / 2; web.scale.x = -1;
            const thread = new THREE.Mesh(new THREE.PlaneGeometry(0.02, 1), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: .6, depthWrite: false }));
            thread.position.set(ox - 1.15, oy - 0.2, 0.82); g.add(thread);
            const spider = plane(hwTex('spider'), 0.42, ox - 1.15, oy - 0.7, 0.84);
            const ghost = plane(hwTex('ghost'), 0.75, ox + 0.15, oy - 0.05, 0.9);
            Object.assign(g.userData, { thread, spider, ghost, oy, ox });
            g.visible = false;
            return g;
        }
        function updateHwDecor(now) {
            if (!hwDecor || !hwDecor.visible) return;
            const U = hwDecor.userData;
            U.pumpkins.forEach((p, i) => p.material.color.setScalar(0.82 + 0.18 * Math.abs(Math.sin(now * 0.011 + i * 2.1) * Math.sin(now * 0.0037 + i))));
            const drop = 0.45 + 0.3 * (0.5 + 0.5 * Math.sin(now * 0.0012));
            U.spider.position.y = U.oy - 0.25 - drop; U.spider.rotation.z = Math.sin(now * 0.002) * 0.15;
            U.thread.scale.y = drop; U.thread.position.y = U.oy - 0.25 - drop / 2;
            U.ghost.position.y = U.oy - 0.05 + Math.sin(now * 0.0021) * 0.12; U.ghost.position.x = U.ox + 0.15 + Math.sin(now * 0.0013) * 0.08;
            U.ghost.material.opacity = 0.75 + 0.25 * Math.sin(now * 0.003);
        }

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
            if (typeof Settings !== 'undefined' && Settings.cb) drawMark(ctx, sym);
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

        /* Renk körü modu: her sembolün sol üst köşesinde ayırt edici bir şekil */
        const CB_MARK = { barista: 'circle', girlfriend: 'heart', baking_bear: 'square', portafilter: 'triangle', v60: 'diamond', espresso: 'hexagon',
                          aeropress: 'plus', golden_bean: 'ring', croissant: 'moon', book: 'star', pitcher: 'J', matcha: 'M', cupcake: 'K', coffeebag: 'H', stamp: 'D' };
        function drawMark(ctx, sym) {
            const k = CB_MARK[sym.id]; if (!k) return;
            const x = 46, y = 46, r = 20;
            ctx.save();
            ctx.beginPath(); ctx.arc(x, y, r + 7, 0, Math.PI * 2); ctx.fillStyle = '#FFFFFF'; ctx.fill();
            ctx.lineWidth = 4; ctx.strokeStyle = '#1E1E1E'; ctx.stroke();
            ctx.fillStyle = '#1E1E1E'; ctx.strokeStyle = '#1E1E1E'; ctx.lineWidth = 6;
            ctx.beginPath();
            const poly = (n, rot, rr) => { for (let i = 0; i < n; i++) { const a = rot + i * Math.PI * 2 / n; i ? ctx.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr) : ctx.moveTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); } ctx.closePath(); ctx.fill(); };
            if (k === 'circle') { ctx.arc(x, y, r * .7, 0, Math.PI * 2); ctx.fill(); }
            else if (k === 'ring') { ctx.arc(x, y, r * .62, 0, Math.PI * 2); ctx.stroke(); }
            else if (k === 'square') { ctx.fillRect(x - r * .62, y - r * .62, r * 1.24, r * 1.24); }
            else if (k === 'triangle') poly(3, -Math.PI / 2, r * .85);
            else if (k === 'diamond') poly(4, 0, r * .85);
            else if (k === 'hexagon') poly(6, 0, r * .75);
            else if (k === 'plus') { ctx.fillRect(x - r * .2, y - r * .75, r * .4, r * 1.5); ctx.fillRect(x - r * .75, y - r * .2, r * 1.5, r * .4); }
            else if (k === 'moon') { ctx.arc(x, y, r * .72, 0, Math.PI * 2); ctx.fill(); ctx.globalCompositeOperation = 'destination-out'; ctx.beginPath(); ctx.arc(x + r * .38, y - r * .2, r * .6, 0, Math.PI * 2); ctx.fill(); ctx.globalCompositeOperation = 'source-over'; }
            else if (k === 'heart') { ctx.moveTo(x, y + r * .7); ctx.bezierCurveTo(x - r * 1.1, y - r * .1, x - r * .5, y - r * .9, x, y - r * .3); ctx.bezierCurveTo(x + r * .5, y - r * .9, x + r * 1.1, y - r * .1, x, y + r * .7); ctx.fill(); }
            else if (k === 'star') { for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * .38 : r * .85; i ? ctx.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr) : ctx.moveTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); } ctx.closePath(); ctx.fill(); }
            else { ctx.font = "900 30px 'Baloo 2', Arial, sans-serif"; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(k, x, y + 2); }
            ctx.restore();
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
            const key = sym.id + ':' + mode + ':' + CUR_LANG() + (Settings.cb ? ':cb' : '');
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

        /* =====================================================
           SLOT MAKİNESİ KOLU (3D): çerçevenin sağ yanında. Spin başlarken hızla aşağı çekilir,
           makaralar dönerken yavaşça yukarı kalkar; turboda hızlı in-çık, "durdur"da hızlı dönüş.
           ===================================================== */
        const LEVER_W = 1.0, LEVER_REST = -0.12, LEVER_PULL = 2.35, LEVER_LEN = 1.45;
        let leverObj = null, rainbowUntil = 0, rainbowOn = false;
        const LEVER_STYLES = {
            kirmizi:     { shaft: 0xD8DDE3, sm: 0.9, knob: 0xE0262E, km: 0.15, mount: 0x8E959C, shape: 'ball' },
            portafiltre: { shaft: 0xC9CED4, sm: 0.9, knob: 0x1E1A18, km: 0.05, mount: 0x6E747A, shape: 'grip' },
            cezve:       { shaft: 0xC77A3A, sm: 0.85, knob: 0x6A3B1C, km: 0.05, mount: 0xB0652A, shape: 'grip' },
            cekirdek:    { shaft: 0xE3AE4A, sm: 0.75, knob: 0x5A3016, km: 0.1, mount: 0x7A4A22, shape: 'bean' },
            altin:       { shaft: 0xF2C25A, sm: 0.95, knob: 0xFFD86B, km: 0.9, mount: 0xC8942E, shape: 'ball', glow: 0x6a4400 }
        };
        function leverOn() { return typeof cosmEquipped === 'function' && cosmEquipped('lever') !== 'yok'; }
        function buildLever(N) {
            const g = new THREE.Group();
            const S = LEVER_STYLES[cosmEquipped('lever')] || LEVER_STYLES.kirmizi;
            const x0 = (N + 1.1) / 2;
            const metal = (c, m, r) => new THREE.MeshStandardMaterial({ color: srgb(c), metalness: m, roughness: r });
            // yan gövde: yuvarlatılmış kutu + krom halka
            const mount = new THREE.Mesh(new THREE.BoxGeometry(0.34, 1.0, 0.56), metal(S.mount, 0.7, 0.35));
            mount.position.set(x0 + 0.13, -0.15, 0.25);
            g.add(mount);
            const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.2, 24), metal(S.shaft, 0.9, 0.2));
            hub.rotation.z = Math.PI / 2;
            hub.position.set(x0 + 0.36, -0.15, 0.25);
            g.add(hub);
            const arm = new THREE.Group();   // pivot: kol bu nokta etrafında X ekseninde döner
            arm.position.set(x0 + 0.48, -0.15, 0.25);
            const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.06, LEVER_LEN, 16), metal(S.shaft, S.sm, 0.22));
            shaft.position.y = LEVER_LEN / 2;
            arm.add(shaft);
            const km = new THREE.MeshStandardMaterial({ color: srgb(S.knob), metalness: S.km, roughness: 0.25, emissive: srgb(S.glow || 0x000000), emissiveIntensity: S.glow ? 0.5 : 0 });
            let knob;
            if (S.shape === 'grip') { knob = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.09, 0.5, 18), km); knob.position.y = LEVER_LEN + 0.2; }
            else if (S.shape === 'bean') { knob = new THREE.Mesh(new THREE.SphereGeometry(0.2, 22, 18), km); knob.scale.set(0.8, 1.15, 0.8); knob.position.y = LEVER_LEN + 0.12;
                const groove = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.4, 0.33), metal(0x2A160B, 0, 0.8)); groove.position.y = LEVER_LEN + 0.12; arm.add(groove); }
            else { knob = new THREE.Mesh(new THREE.SphereGeometry(0.2, 24, 20), km); knob.position.y = LEVER_LEN + 0.1; }
            arm.add(knob);
            g.add(arm);
            g.userData.arm = arm;
            g.userData.top = [arm.position.x, arm.position.y, arm.position.z];
            arm.rotation.x = LEVER_REST;
            g.visible = leverOn();
            return g;
        }
        const Lever = {
            a: LEVER_REST, q: [], cur: null,
            // seq: [[hedefAçı, ms, 'in'|'out'|'lin'], ...]
            play(seq) { if (!leverOn()) return; this.q = seq.slice(); this.cur = null; },
            pull(totalMs, fast) {
                const down = fast ? 110 : 150;
                const up = fast ? 200 : Math.max(380, (totalMs || 900) - down + 120);
                this.play([[LEVER_PULL, down, 'in'], [LEVER_PULL, fast ? 20 : 60, 'lin'], [LEVER_REST, up, fast ? 'out' : 'slow']]);
                if (leverOn()) { playSynthNote(110, 0.09, 'square', 0.04); setTimeout(() => playSynthNote(70, 0.12, 'sine', 0.06), down); }
            },
            release() { if (!leverOn() || (this.q.length === 0 && !this.cur)) return; this.play([[LEVER_REST, 170, 'out']]); },
            step(now) {
                const arm = leverObj && leverObj.userData.arm;
                if (!arm) return;
                if (!this.cur && this.q.length) { const [to, ms, e] = this.q[0]; this.cur = { from: this.a, to, ms, e, t0: now }; }
                if (!this.cur) return;
                const c = this.cur, k = Math.min(1, (now - c.t0) / c.ms);
                const f = c.e === 'in' ? k * k : c.e === 'out' ? 1 - Math.pow(1 - k, 3) : c.e === 'slow' ? 1 - Math.pow(1 - k, 1.6) : k;
                this.a = c.from + (c.to - c.from) * f;
                if (k >= 1) { this.a = c.to; this.q.shift(); this.cur = null; }
                arm.rotation.x = this.a + (this.a > 1.5 ? Math.sin(now * 0.08) * 0.015 : 0);
            }
        };
        function refreshLever() {
            if (!scene || !leverObj) return;
            scene.remove(leverObj);
            leverObj = buildLever(builtReels || 5);
            scene.add(leverObj);
            Lever.a = LEVER_REST; Lever.q = []; Lever.cur = null;
            onWindowResize();
        }
        /* kola dokunmak için görünmez düğme: kolun ekrandaki yerine oturtulur */
        function placeLeverHit() {
            let b = $('lever-hit');
            if (!leverOn() || !leverObj) { if (b) b.style.display = 'none'; return; }
            if (!b) {
                b = document.createElement('button'); b.id = 'lever-hit'; b.type = 'button';
                b.setAttribute('aria-label', (L().lever && L().lever.aria) || 'Lever');
                b.onclick = () => { if (gameState.isSpinning) { if (curSpin && curSpin.slam) curSpin.slam(); } else spinReels(); };
                $('three-container').appendChild(b);
            }
            const cont = $('three-container'), W = cont.clientWidth || 1, H = cont.clientHeight || 1;
            const f = (H / 2) / Math.tan(((camera && camera.fov) || 42) * Math.PI / 360);
            const [px, py, pz] = leverObj.userData.top, camZ = camera.position.z, camX = camera.position.x;
            const proj = (x, y, z) => { const sc = f / (camZ - z); return [W / 2 + (x - camX) * sc, H / 2 - y * sc]; };
            const top = proj(px, py + LEVER_LEN + 0.35, pz), bot = proj(px, py - 0.6, pz), sc = f / (camZ - pz);
            const w = Math.max(44, 0.9 * sc);
            b.style.display = '';
            b.style.left = (top[0] - w / 2) + 'px'; b.style.width = w + 'px';
            b.style.top = top[1] + 'px'; b.style.height = Math.max(60, bot[1] - top[1]) + 'px';
        }
        function celebrateLights(ms) { rainbowUntil = performance.now() + (ms || 4000); winFlash = performance.now(); }

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

            const WIN_W = N + 0.1, WIN_H = +(2 * APO * Math.sin((RMID + 0.5) * STEP) + 0.06).toFixed(2);
            frameH = WIN_H + 1.45;

            // --- makara penceresinin arkası (koyu boşluk) ---
            const back = new THREE.Mesh(new THREE.PlaneGeometry(WIN_W + 0.4, WIN_H + 0.6), new THREE.MeshBasicMaterial({ color: srgb((FRAME_SKINS[cosmEquipped('frame')] || FRAME_SKINS.klasik).back) }));
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
                for (let row = 0; row < RW; row++) if (!gameState.grid[r][row]) gameState.grid[r][row] = visualSymbol(r);
                faces.forEach(f => setFace(f, visualSymbol(r), false));
                for (let row = 0; row < RW; row++) setFace(meshAt(r, row), gameState.grid[r][row], false);
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
            const SK = FRAME_SKINS[cosmEquipped('frame')] || FRAME_SKINS.klasik;
            const wood = new THREE.MeshStandardMaterial({ color: srgb(SK.wood), roughness: 0.55, metalness: 0.05 });
            const gold = new THREE.MeshStandardMaterial({ color: srgb(SK.gold), roughness: 0.28, metalness: 0.75, emissive: srgb(SK.glow), emissiveIntensity: 0.4 });
            frameMats = { wood, gold, back: back.material };
            const outer = frameRing(N + 1.1, WIN_H + 1.15, 0.45, WIN_W, WIN_H, 0.18, 0.28, wood);
            outer.position.z = 0.38;
            scene.add(outer);
            const rim = frameRing(WIN_W + 0.22, WIN_H + 0.22, 0.24, WIN_W, WIN_H, 0.16, 0.08, gold);
            rim.position.z = 0.62;
            scene.add(rim);

            // --- renkli ampuller (çerçeve boyunca kayan ışıklar) ---
            bulbs = [];
            const palette = SK.bulbs;
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

            // --- slot makinesi kolu (Atölye'den alınır; sağ yanda) ---
            leverObj = buildLever(N);
            scene.add(leverObj);

            // --- heyecan (2 Wild) parıltısı: makara önünde parlayan çerçeve ---
            hwDecor = buildHwDecor(N, WIN_H);
            scene.add(hwDecor);
            hwDecor.visible = cosmEquipped('frame') === 'balkabagi';
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
            const a = (RMID - row) * STEP;
            const y = APO * Math.sin(a), z = DRUM_Z + APO * Math.cos(a);
            const cont = document.getElementById('three-container');
            const W = cont.clientWidth || 1, H = cont.clientHeight || 1;
            const f = (H / 2) / Math.tan(((camera && camera.fov) || 42) * Math.PI / 360);
            const camZ = camera ? camera.position.z : 9, camY = camera ? camera.position.y : 0, camX = camera ? camera.position.x : 0;
            const sc = f / (camZ - z);
            return { x: (W / 2 + (x - camX) * sc) / W * 100, y: (H / 2 - (y - camY) * sc) / H * 100 };
        }

        /* Görünür satırın yüzü: 0 = üst, 1 = orta, 2 = alt */
        function meshAt(r, row) {
            const d = drums[r];
            if (!d) return null;
            return d.faces[((d.mid + (RMID - row)) % FACES + FACES) % FACES];
        }

        /* Yüzün ekrandaki açısına göre ışık (öne bakan parlak, kenara dönen koyu) */
        function updateFaceShading(d) {
            d.faces.forEach(f => {
                let a = f.userData.k * STEP - d.phi;
                a = Math.atan2(Math.sin(a), Math.cos(a));
                const c = Math.cos(a);
                // görünen 3 satır (±1 adım) tam parlak; pencereden çıkan yüzler hızla kararır (silindir derinliği)
                const edge = Math.abs(a) - STEP * (RMID + 0.25);
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
                for (let row = 0; row < RW; row++) {
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
                for (let row = 0; row < RW; row++) { const f = d.faces[fi(m + (RMID - row))]; setFace(f, col[row], false); f.userData.locked = true; }
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
            const distH = (frameH || 4.45) / (2 * t);
            const lw = leverOn() ? LEVER_W : 0;   // kol takılıysa sahne sağa doğru genişler
            const distW = (builtReels + 1.5 + lw) / (2 * t * camera.aspect);
            camera.position.z = Math.max(distH, distW) + 0.6;
            camera.position.x = lw / 2;
            camera.lookAt(lw / 2, 0, 0);
            placeLeverHit();
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
            const busy = drums.some(d => d.mode !== 'idle') || winningMeshRefs.length > 0 || now - winFlash < 1600 || teasePlanes.some(p => p.visible) || Lever.q.length > 0 || now < rainbowUntil;
            if (document.hidden || (!busy && now - lastRender < 66)) return;
            lastRender = now;
            const dt = lastFrame ? Math.min(0.05, (now - lastFrame) / 1000) : 0.016;
            lastFrame = now;
            drums.forEach(d => stepDrum(d, now, dt));
            Lever.step(now);

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
            updateHwDecor(now);
            const candle = hwDecor && hwDecor.visible && !flashing;   // Balkabağı: mum gibi titreşen ampuller
            if (now < rainbowUntil) {   // büyük kutlama: ampuller gökkuşağının tüm renklerinde hızla döner
                rainbowOn = true;
                const n = bulbs.length || 1;
                bulbs.forEach((b, i) => {
                    const h = ((now * 0.0011) + i / n * 2) % 1;
                    b.material.color.setHSL(h, 1, 0.55); b.material.emissive.setHSL(h, 1, 0.5);
                    b.material.emissiveIntensity = 0.9 + 0.8 * Math.abs(Math.sin(now * 0.012 + i * 0.4));
                });
                if (renderer && scene && camera) renderer.render(scene, camera);
                return;
            } else if (rainbowOn) { rainbowOn = false; applyFrameSkin(); }
            bulbs.forEach((b, i) => {
                if (candle) { b.material.emissiveIntensity = 0.45 + 0.7 * Math.abs(Math.sin(now * 0.009 + i * 1.7) * Math.sin(now * 0.0047 + i * 0.6)); return; }
                const w = Math.sin(now * speed - i * 0.55);
                b.material.emissiveIntensity = flashing ? (Math.floor(now / 110 + i) % 2 ? 1.6 : 0.25) : 0.35 + 0.9 * Math.max(0, w);
            });

            if (renderer && scene && camera) renderer.render(scene, camera);
        }
