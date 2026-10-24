        /* =====================================================
           3D SAHNE
           ===================================================== */
        const texCache = {};
        let maxAniso = 1;

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
            ctx.font = '700 24px "Fredoka", "Nunito", sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(text, S / 2, 215);
        }

        function getSymbolTexture(sym, win) {
            const mode = win ? 'w' : 'n';
            const key = sym.id + ':' + mode;
            if (texCache[key]) return texCache[key];

            const S = 256;
            const canvas = document.createElement('canvas');
            canvas.width = S; canvas.height = S;
            const ctx = canvas.getContext('2d');

            // kart zemini
            roundRectPath(ctx, 8, 8, S - 16, S - 16, 40);
            const g = ctx.createLinearGradient(0, 0, 0, S);
            let edge;
            if (mode === 'w') { g.addColorStop(0, '#FFF6CC'); g.addColorStop(1, '#FFD36E'); edge = '#E8932B'; }
            else if (sym.special === 'foam')  { g.addColorStop(0, '#F6FCEA'); g.addColorStop(1, '#D9EDB8'); edge = '#8DBB57'; }
            else if (sym.special === 'wild')  { g.addColorStop(0, '#F4F9FF'); g.addColorStop(1, '#D4E6F8'); edge = '#8FB2D8'; }
            else if (sym.special === 'stamp') { g.addColorStop(0, '#FFF3EE'); g.addColorStop(1, '#F8D3C6'); edge = '#C9705A'; }
            else                   { g.addColorStop(0, '#FFFCF5'); g.addColorStop(1, '#FBE8CF'); edge = '#D9B68A'; }
            ctx.fillStyle = g;
            ctx.fill();
            ctx.lineWidth = mode === 'n' ? 7 : 10;
            ctx.strokeStyle = edge;
            ctx.stroke();
            // iç parlama çizgisi
            roundRectPath(ctx, 17, 17, S - 34, S - 34, 32);
            ctx.lineWidth = 3;
            ctx.strokeStyle = 'rgba(255,255,255,.9)';
            ctx.stroke();

            // sembol
            const img = IMG[sym.img];
            if (img && img.width) {
                const maxS = sym.id === 'book' ? 168 : sym.id === 'stamp' ? 160 : 178;
                const sc = Math.min(maxS / img.width, maxS / img.height);
                const w = img.width * sc, h = img.height * sc;
                ctx.drawImage(img, (S - w) / 2, (S - h) / 2 + (sym.id === 'book' || sym.id === 'stamp' ? -8 : 2), w, h);
            }

            // rozetler
            if (sym.id === 'book') drawBadge(ctx, S, 'WILD', '#E36F6B', 124);
            else if (sym.special === 'foam') drawBadge(ctx, S, 'KÖPÜK', '#6FA43E', 144);
            else if (sym.special === 'wild') drawBadge(ctx, S, 'JOKER', '#4F8FD0', 144);
            else if (sym.special === 'stamp') drawBadge(ctx, S, 'DAMGA', '#B8452F', 144);

            const tex = new THREE.CanvasTexture(canvas);
            tex.anisotropy = maxAniso;
            texCache[key] = tex;
            return tex;
        }

        function createSymbolMesh(sym) {
            const geo = new THREE.PlaneGeometry(0.93, 0.93);
            const mat = new THREE.MeshBasicMaterial({ map: getSymbolTexture(sym, false), transparent: true });
            return new THREE.Mesh(geo, mat);
        }

        function updateSymbolMesh(mesh, sym, win) {
            mesh.material.map = getSymbolTexture(sym, win);
            mesh.material.needsUpdate = true;
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

        function buildReelScene(N) {
            scene = new THREE.Scene();
            camera = new THREE.PerspectiveCamera(45, 1.5, 0.1, 100);
            camera.position.set(0, 0, 8);

            scene.add(new THREE.AmbientLight(0xffffff, 0.9));
            const dirLight = new THREE.DirectionalLight(0xfff0d6, 0.9);
            dirLight.position.set(3, 6, 8);
            scene.add(dirLight);

            // --- Slot makinesi gövdesi (ahşap + altın çerçeve + krem panel) ---
            const cabinet = new THREE.Group();
            scene.add(cabinet);
            const frame = new THREE.Mesh(
                new THREE.BoxGeometry(N + 0.5, 3.5, 0.5),
                new THREE.MeshStandardMaterial({ color: 0x7A4A28, roughness: 0.65, metalness: 0.05 })
            );
            cabinet.add(frame);
            const gold = new THREE.Mesh(
                new THREE.BoxGeometry(N + 0.22, 3.22, 0.5),
                new THREE.MeshStandardMaterial({ color: 0xE3AE4A, roughness: 0.35, metalness: 0.45 })
            );
            gold.position.z = 0.02;
            cabinet.add(gold);
            const panel = new THREE.Mesh(
                new THREE.PlaneGeometry(N, 3.0),
                new THREE.MeshBasicMaterial({ color: 0xFFF0DA })
            );
            panel.position.z = 0.28;
            cabinet.add(panel);

            // makara ayırıcıları
            for (let i = 1; i < N; i++) {
                const div = new THREE.Mesh(
                    new THREE.PlaneGeometry(0.03, 3.0),
                    new THREE.MeshBasicMaterial({ color: 0xEBD3B2 })
                );
                div.position.set(-N / 2 + i, 0, 0.285);
                cabinet.add(div);
            }

            // köşe altın çiviler
            const studGeo = new THREE.SphereGeometry(0.07, 14, 14);
            const studMat = new THREE.MeshStandardMaterial({ color: 0xFFD27A, roughness: 0.25, metalness: 0.6 });
            const sx = N / 2 + 0.12;
            [[-sx, 1.62], [sx, 1.62], [-sx, -1.62], [sx, -1.62]].forEach(p => {
                const s = new THREE.Mesh(studGeo, studMat);
                s.position.set(p[0], p[1], 0.27);
                cabinet.add(s);
            });

            // heyecan (2 Wild) için makara arkası parıltı panelleri
            teasePlanes = [];
            for (let r = 0; r < N; r++) {
                const m = new THREE.Mesh(
                    new THREE.PlaneGeometry(0.98, 3.0),
                    new THREE.MeshBasicMaterial({ color: 0xFFC94A, transparent: true, opacity: 0 })
                );
                m.position.set(-(N - 1) / 2 + r, 0, 0.29);
                m.visible = false;
                scene.add(m);
                teasePlanes.push(m);
            }

            // --- Makaralar ---
            reelColumns = [];
            for (let r = 0; r < N; r++) {
                const reelGroup = new THREE.Group();
                reelGroup.position.x = -(N - 1) / 2 + r;
                scene.add(reelGroup);
                if (!gameState.grid[r]) gameState.grid[r] = [];
                for (let row = 0; row < 3; row++) {
                    const symData = gameState.grid[r][row] || visualSymbol(r);
                    gameState.grid[r][row] = symData;
                    const mesh = createSymbolMesh(symData);
                    mesh.position.y = 1 - row;
                    mesh.position.z = 0.31;
                    reelGroup.add(mesh);
                }
                reelColumns.push({ group: reelGroup, bounceStart: 0 });
            }
            gameState.grid.length = N;
            builtReels = N;
            winningMeshRefs = [];
        }

        function refreshGridMeshes() {
            winningMeshRefs = [];
            for (let r = 0; r < reelColumns.length; r++) {
                for (let row = 0; row < 3; row++) {
                    const mesh = reelColumns[r].group.children[row];
                    mesh.scale.set(1, 1, 1);
                    mesh.rotation.z = 0;
                    updateSymbolMesh(mesh, gameState.grid[r][row], false);
                }
            }
        }

        function setTease(r, on) {
            const p = teasePlanes[r];
            if (p) p.visible = !!on;
        }
        function clearTease() { teasePlanes.forEach(p => { p.visible = false; }); $('reel-wrap').classList.remove('tease'); }

        function onWindowResize() {
            const container = document.getElementById('three-container');
            if (!container || !renderer || !camera) return;
            const width = container.clientWidth;
            const height = container.clientHeight;
            if (!width || !height) return;
            renderer.setSize(width, height, false);
            camera.aspect = width / height;
            const t = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
            const distH = 3.75 / (2 * t);
            const distW = (builtReels + 0.75) / (2 * t * camera.aspect);
            camera.position.z = Math.max(distH, distW) + 0.3;
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

            const nowMs = Date.now();
            const time = nowMs * 0.007;
            winningMeshRefs.forEach(mesh => {
                let base = 1;
                const ps = mesh.userData && mesh.userData.popStart;
                if (ps) {                                  // genişleme "büyüme" animasyonu
                    const k = (nowMs - ps) / 420;
                    if (k < 1) base = 0.35 + 0.65 * (1 - Math.pow(1 - k, 3)) + Math.sin(k * Math.PI) * 0.25;
                    else mesh.userData.popStart = 0;
                }
                mesh.rotation.z = Math.sin(time) * 0.12;
                const scale = base * (1.0 + Math.sin(time * 3) * 0.07);
                mesh.scale.set(scale, scale, 1);
            });

            // heyecan parıltısı
            teasePlanes.forEach((p, i) => {
                if (p.visible) p.material.opacity = 0.28 + Math.sin(nowMs * 0.012 + i) * 0.18;
            });

            // makara durma sekmesi
            reelColumns.forEach(col => {
                if (col.bounceStart) {
                    const t = (nowMs - col.bounceStart) / 260;
                    if (t >= 1) { col.group.position.y = 0; col.bounceStart = 0; }
                    else col.group.position.y = -Math.sin(t * Math.PI) * 0.07;
                }
            });

            if (renderer && scene && camera) renderer.render(scene, camera);
        }
