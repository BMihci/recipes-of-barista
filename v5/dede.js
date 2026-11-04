        /* =====================================================
           KAHVE DEDE — çarpan veren dede (Gates of Olympus’taki gibi,
           ama kendi karakterimiz): çatı penceresinden cezvesiyle çarpan fırlatır.
           ===================================================== */
        ASSETS.sym.dede = DEDE_IMG;
        /* Çarpan: Türk kahvesi fincanı (kademe rengine göre kuşak) */
        const CUP_COL = { o1: ['#3FA34D', '#BDF0B0'], o2: ['#2F7FD8', '#B9DDFF'], o3: ['#8E44D6', '#E6C9FF'], o4: ['#D8342A', '#FFD0A0'] };
        function cupSVG(tier, style) {
            style = style || (typeof cosmEquipped === 'function' ? cosmEquipped('cup') : 'klasik');
            let [c, l] = CUP_COL[tier] || CUP_COL.o1;
            let body = '#FFFDF8', rim = '#D9A73A', saucer = '#E9DCC6', deco = '';
            let gold = false;   // Zaman Hazinesi: dönem fincanlarının altın sürümü (h_egypt …)
            if (style && style.indexOf('h_') === 0 && typeof ERA_LOOKS !== 'undefined' && ERA_LOOKS[style.slice(2)]) { gold = true; style = ERA_LOOKS[style.slice(2)].cup; }
            if (style === 'lale') {         // lale motifli İznik fincanı
                body = '#F6FBFF'; deco = `<g stroke="${c}" stroke-width="2.4" fill="${l}"><path d="M44 66 q-6 -12 0 -18 q4 6 0 18z"/><path d="M60 70 q-7 -14 0 -21 q7 7 0 21z"/><path d="M76 66 q6 -12 0 -18 q-4 6 0 18z"/></g><path d="M44 66 q16 8 32 0" stroke="#3FA34D" stroke-width="2.5" fill="none"/>`;
            } else if (style === 'altin') { // altın gövde, beyaz kuşak
                body = '#F2C25A'; rim = '#FFF3C4'; saucer = '#F7D27A'; l = '#FFFFFF';
            } else if (style === 'matcha') { // matcha çanağı: yeşil sırlı, beyaz damla
                body = '#7DB46C'; rim = '#E9F7DA'; saucer = '#CFE6B8'; c = '#3F7A3A'; l = '#E9F7DA';
            } else if (style === 'pastel') { // pembe-mavi şekerli pastel
                body = '#FFD3E2'; rim = '#C9E7FF'; saucer = '#FFF0B3'; c = '#8EC5F0'; l = '#FFFFFF';
                deco = `<g fill="#FFFFFF" opacity=".9"><circle cx="40" cy="74" r="2"/><circle cx="58" cy="80" r="2"/><circle cx="78" cy="74" r="2"/></g>`;
            } else if (style === 'toprak') { // el yapımı toprak fincan, buğday başağı
                body = '#B9683A'; rim = '#E8B84A'; saucer = '#D9A070'; c = '#7A3E1C'; l = '#E8B84A';
                deco = `<g stroke="#E8B84A" stroke-width="2.4" fill="#E8B84A"><path d="M60 82 L60 66" fill="none"/><ellipse cx="56" cy="72" rx="3" ry="5" transform="rotate(-30 56 72)"/><ellipse cx="64" cy="72" rx="3" ry="5" transform="rotate(30 64 72)"/><ellipse cx="60" cy="66" rx="3" ry="5"/></g>`;
            } else if (style === 'lapis') {   // Mısır: lacivert lapis, altın, Horus gözü
                body = '#2F4F9F'; rim = '#F2C25A'; saucer = '#F2C25A';
                deco = `<path d="M42 60 q18 -14 36 0 q-18 14 -36 0z" fill="#F7EFE2" stroke="#F2C25A" stroke-width="2.5"/><circle cx="60" cy="60" r="5" fill="#111"/><path d="M54 68 q-2 8 -8 10" stroke="#F2C25A" stroke-width="2.5" fill="none"/>`;
            } else if (style === 'amfora') {  // Yunan: pişmiş toprak + menderes
                body = '#D9822B'; rim = '#2A1A0C'; saucer = '#C66A1E';
                deco = `<path d="M28 54 h8 v-6 h8 v6 h8 v-6 h8 v6 h8 v-6 h8 v6 h8 v-6 h8 v6 h6" stroke="#111" stroke-width="3" fill="none"/><path d="M34 72 q26 10 52 0" stroke="#111" stroke-width="3" fill="none"/>`;
            } else if (style === 'run') {     // Viking: ahşap kupa + rünler
                body = '#8A5A2A'; rim = '#C9CED4'; saucer = '#6E4A22';
                deco = `<g stroke="#F4E2B8" stroke-width="3" fill="none" stroke-linecap="round"><path d="M40 50 v18 M40 50 l7 6 l-7 6"/><path d="M58 48 v20 M52 54 l12 7"/><path d="M74 50 l6 18 l6 -18"/></g><path d="M26 44 Q60 54 94 44" stroke="#C9CED4" stroke-width="4" fill="none"/>`;
            } else if (style === 'zafer') {   // Roma: kızıl + altın defne
                body = '#A8281E'; rim = '#F2C25A'; saucer = '#F2C25A';
                deco = `<g fill="#F2C25A"><ellipse cx="44" cy="62" rx="6" ry="3" transform="rotate(-40 44 62)"/><ellipse cx="50" cy="70" rx="6" ry="3" transform="rotate(-20 50 70)"/><ellipse cx="76" cy="62" rx="6" ry="3" transform="rotate(40 76 62)"/><ellipse cx="70" cy="70" rx="6" ry="3" transform="rotate(20 70 70)"/></g><text x="60" y="58" text-anchor="middle" font-size="12" font-weight="900" fill="#F2C25A">SPQR</text>`;
            } else if (style === 'zarf') {    // Osmanlı: porselen fincan + altın zarf
                rim = '#D9A73A';
                deco = `<path d="M28 58 Q60 70 92 58 L86 84 Q60 94 34 84Z" fill="#D9A73A" stroke="#8A5A10" stroke-width="2.5"/><g fill="#FFF3C4"><circle cx="44" cy="74" r="2.6"/><circle cx="60" cy="78" r="2.6"/><circle cx="76" cy="74" r="2.6"/><circle cx="52" cy="82" r="1.8"/><circle cx="68" cy="82" r="1.8"/></g><path d="M38 64 q22 8 44 0" stroke="#8A5A10" stroke-width="1.6" fill="none"/>`;
            } else if (style === 'gul') {     // Viktorya: beyaz porselen, pembe güller
                rim = '#C9A0B0'; saucer = '#F4EAF0';
                deco = `<g><circle cx="44" cy="62" r="7" fill="#E88AA6"/><circle cx="44" cy="62" r="3" fill="#C0506E"/><circle cx="76" cy="62" r="7" fill="#E88AA6"/><circle cx="76" cy="62" r="3" fill="#C0506E"/><circle cx="60" cy="70" r="6" fill="#F2B0C4"/></g><g fill="#6FA84A"><ellipse cx="52" cy="66" rx="5" ry="2.5"/><ellipse cx="68" cy="66" rx="5" ry="2.5"/></g>`;
            } else if (style === 'sevr') {    // Fransa: Sèvres mavisi + altın madalyon
                body = '#2F4F9F'; rim = '#E8C04A'; saucer = '#E8EEFF';
                deco = `<ellipse cx="60" cy="62" rx="16" ry="12" fill="#FFFDF8" stroke="#E8C04A" stroke-width="3"/><circle cx="60" cy="62" r="4" fill="#E88AA6"/><path d="M28 46 Q60 56 92 46" stroke="#E8C04A" stroke-width="3" fill="none"/>`;
            } else if (style === 'majolika') { // İtalya: sarı majolika + mavi kıvrımlar
                body = '#F2C94C'; rim = '#2F6FB5'; saucer = '#F7E2A0';
                deco = `<g stroke="#2F6FB5" stroke-width="3" fill="none" stroke-linecap="round"><path d="M34 60 q6 -10 12 0 t12 0 t12 0 t12 0 t12 0"/><path d="M38 74 q6 -8 12 0 t12 0 t12 0 t12 0"/></g><circle cx="60" cy="50" r="4" fill="#C0392B"/>`;
            } else if (style === 'caz') {     // Caz Çağı: siyah-altın art deco yelpaze
                body = '#151515'; rim = '#D4A72C'; saucer = '#2A2A2A';
                deco = `<g stroke="#D4A72C" stroke-width="2.4" fill="none"><path d="M60 84 L36 50 M60 84 L48 46 M60 84 L60 44 M60 84 L72 46 M60 84 L84 50"/><path d="M40 56 Q60 44 80 56"/></g>`;
            } else if (style === 'kumsaati') { // Zaman Bekçisi: mor-altın, kum saati amblemi
                body = '#2A1E3A'; rim = '#C9963A'; saucer = '#3A2A55';
                deco = `<g stroke="#C9963A" stroke-width="2.6" fill="none"><path d="M46 50 h28 M46 82 h28"/><path d="M49 50 Q49 62 60 66 Q71 62 71 50 M49 82 Q49 70 60 66 Q71 70 71 82"/></g><path d="M52 54 Q60 62 68 54Z M53 80 Q60 72 67 80Z" fill="#F2C25A"/><g fill="#7FE3FF"><circle cx="36" cy="58" r="2"/><circle cx="84" cy="62" r="2"/><circle cx="40" cy="76" r="1.5"/><circle cx="82" cy="78" r="1.5"/></g>`;
            } else if (style === 'destekci') { // Destekçi: gül-altın, kalp latte art
                body = '#FFE3EA'; rim = '#F7C873'; saucer = '#F7C873';
                deco = `<path d="M60 76 C46 62 40 52 50 46 C56 42 60 48 60 52 C60 48 64 42 70 46 C80 52 74 62 60 76 Z" fill="#FF6F91" stroke="#8A2A40" stroke-width="2.5"/><path d="M52 50 q3 -3 6 0" stroke="#fff" stroke-width="2.4" fill="none"/><g fill="#F7C873"><circle cx="36" cy="60" r="3"/><circle cx="84" cy="60" r="3"/><circle cx="40" cy="74" r="2"/><circle cx="80" cy="74" r="2"/></g>`;
            } else if (style === 'dost') {    // Dost: iki fincan tokuşturan mavi fincan
                body = '#DCEBFF'; rim = '#3A6EA5'; saucer = '#BFD7F5';
                deco = `<g stroke="#1E3A5F" stroke-width="2.4"><path d="M38 56 h18 v14 q-9 7 -18 0z" fill="#FFF6E4"/><path d="M64 56 h18 v14 q-9 7 -18 0z" fill="#FFF6E4"/></g><path d="M60 50 c-3 -5 -10 -2 -6 3 l6 5 l6 -5 c4 -5 -3 -8 -6 -3z" fill="#FF6F91"/><path d="M40 82 q20 6 40 0" stroke="#3A6EA5" stroke-width="3" fill="none"/>`;
            } else if (style === 'beta') {    // Beta tester: laboratuvar fincanı, yeşil iksir, β rozeti
                body = '#DFF6EE'; rim = '#1F8A70'; saucer = '#BFE8DA'; c = '#1F8A70'; l = '#E9FFE8';
                deco = `<path d="M30 64 Q60 76 90 64 L86 84 Q60 94 34 84Z" fill="#59D29A" opacity=".85"/><g fill="#E9FFE8"><circle cx="46" cy="76" r="3"/><circle cx="70" cy="80" r="2.2"/><circle cx="58" cy="70" r="1.8"/></g><circle cx="60" cy="52" r="11" fill="#1F8A70" stroke="#0F4A3A" stroke-width="2.5"/><path d="M56 61 V47 Q56 43 60 43 Q64 43 64 46.5 Q64 49.5 60.5 50.5 Q65 51 65 55 Q65 59.5 60 59.5 Q57.5 59.5 56 58" fill="none" stroke="#E9FFE8" stroke-width="2.4" stroke-linecap="round"/>`;
            } else if (style === 'balkabagi') { // balkabağı fincan: oyulmuş yüz
                body = '#FF8A1E'; rim = '#3A1A4F'; saucer = '#5A2A7A'; c = '#3A1A4F'; l = '#FFD27A';
                deco = `<g fill="#3A1A4F"><path d="M40 52 l8 -8 l8 8z"/><path d="M64 52 l8 -8 l8 8z"/><path d="M40 66 q20 12 40 0 l-6 2 l-4 -4 l-4 5 l-6 -5 l-6 5 l-4 -5 l-4 4z"/></g>`;
            }
            if (gold) { body = '#F2C25A'; rim = '#FFF3C4'; saucer = '#F7D27A'; deco += `<g fill="#FFFFFF"><path d="M32 46 l2 5 l5 2 l-5 2 l-2 5 l-2 -5 l-5 -2 l5 -2z"/><path d="M86 70 l1.5 4 l4 1.5 l-4 1.5 l-1.5 4 l-1.5 -4 l-4 -1.5 l4 -1.5z"/></g>`; }
            const NOBAND = ['beta', 'destekci', 'dost', 'balkabagi', 'lale', 'lapis', 'amfora', 'run', 'zafer', 'zarf', 'gul', 'sevr', 'majolika', 'caz', 'kumsaati'];
            const band = NOBAND.includes(style) ? '' : `<path d="M26 48 Q60 58 94 48 L93 62 Q60 72 27 62 Z" fill="${c}"/>
              <g fill="${l}"><circle cx="38" cy="56" r="3"/><circle cx="50" cy="60" r="3"/><circle cx="62" cy="61" r="3"/><circle cx="74" cy="59" r="3"/><circle cx="85" cy="55" r="3"/></g>
              <path d="M26 46 Q60 56 94 46" stroke="${rim}" stroke-width="2.5" fill="none"/><path d="M27 64 Q60 74 93 64" stroke="${rim}" stroke-width="2.5" fill="none"/>`;
            const ring = style === 'lale' || style === 'balkabagi' ? `<path d="M27 40 Q60 50 93 40" stroke="${c}" stroke-width="4" fill="none"/>` : '';
            return `<svg viewBox="0 0 120 110" class="cup" aria-hidden="true">
              <ellipse cx="60" cy="96" rx="52" ry="11" fill="${saucer}" stroke="#B8945E" stroke-width="3"/>
              <ellipse cx="60" cy="93" rx="38" ry="6" fill="#F7EFE2" opacity=".85"/>
              <path d="M24 30 Q24 86 60 90 Q96 86 96 30 Z" fill="${body}" stroke="#B8945E" stroke-width="3"/>
              ${band}${ring}${deco}
              <ellipse cx="60" cy="30" rx="36" ry="9" fill="${rim}"/>
              <ellipse cx="60" cy="31" rx="31" ry="6.5" fill="#5A3416"/>
              <ellipse cx="60" cy="30" rx="27" ry="5" fill="#B9844F"/>
              <g fill="#E7C7A0" opacity=".9"><circle cx="50" cy="29" r="2"/><circle cx="64" cy="31" r="1.6"/><circle cx="71" cy="28" r="1.4"/></g>
              <path d="M34 36 Q32 60 40 76" stroke="#fff" stroke-width="4" fill="none" opacity=".6" stroke-linecap="round"/>
            </svg>`;
        }
        const Dede = {
            hideT: null,
            el() { return $('dede'); },
            mount() {
                const box = this.el();
                if (!box || box.dataset.ready) return;
                box.dataset.ready = '1';
                box.innerHTML = `<div class="dd-aura"></div><div class="dd-fig">${dedeSVG(typeof cosmEquipped === 'function' ? cosmEquipped('cap') : 'kasket')}</div><div class="dd-bub" id="dede-bub"></div>`;
            },
            /* yalnızca çarpan zamanı ortaya çıkar */
            show() {
                this.mount();
                const box = this.el(); if (!box) return;
                clearTimeout(this.hideT);
                if (!box.classList.contains('on')) { box.classList.add('on'); playSynthNote(392, 0.18, 'triangle', 0.04); playSynthNote(587, 0.22, 'triangle', 0.035); }
            },
            hideLater(ms) {
                clearTimeout(this.hideT);
                this.hideT = setTimeout(() => { const b = this.el(); if (b) b.classList.remove('on'); const bb = $('dede-bub'); if (bb) bb.classList.remove('show'); }, ms);
            },
            hideNow() { clearTimeout(this.hideT); const b = this.el(); if (b) b.classList.remove('on'); },
            anim(cls, ms) {
                const box = this.el(); if (!box) return;
                box.classList.remove(cls); void box.offsetWidth; box.classList.add(cls);
                clearTimeout(this['t_' + cls]);
                this['t_' + cls] = setTimeout(() => box.classList.remove(cls), ms);
            },
            say(text, ms) {
                const b = $('dede-bub'); if (!b) return;
                b.textContent = text;
                b.classList.remove('show'); void b.offsetWidth; b.classList.add('show');
                clearTimeout(this.sayT);
                this.sayT = setTimeout(() => b.classList.remove('show'), ms || 1500);
            },
            /* cezvenin ağzı → hedef hücre: altın kahve şimşeği */
            spout() {
                const wrap = $('reel-wrap').getBoundingClientRect();
                const sp = document.querySelector('#dede #dd-spout');
                const r = sp ? sp.getBoundingClientRect() : this.el().getBoundingClientRect();
                return { x: r.left + r.width / 2 - wrap.left, y: r.top + r.height / 2 - wrap.top };
            },
            bolt(xPct, yPct, tier) {
                const layer = $('orb-layer'); if (!layer) return;
                const s = this.spout();
                const tx = xPct / 100 * layer.clientWidth, ty = yPct / 100 * layer.clientHeight;
                const dx = tx - s.x, dy = ty - s.y, len = Math.hypot(dx, dy), ang = Math.atan2(dy, dx) * 180 / Math.PI;
                const b = document.createElement('div');
                b.className = 'dd-bolt ' + (tier || '');
                b.style.left = s.x + 'px'; b.style.top = s.y + 'px'; b.style.width = len + 'px';
                b.style.transform = `rotate(${ang}deg)`;
                const segs = 7; let d = 'M0 10';
                for (let i = 1; i <= segs; i++) d += ` L${(i / segs * 100).toFixed(1)} ${i === segs ? 10 : (10 + (i % 2 ? -1 : 1) * (4 + Math.random() * 5)).toFixed(1)}`;
                b.innerHTML = `<svg viewBox="0 0 100 20" preserveAspectRatio="none"><path d="${d}" class="g"/><path d="${d}" class="c"/></svg>`;
                layer.appendChild(b);
                setTimeout(() => b.remove(), 700);
            },
            ENTER: 420,
            /* bir çarpan fırlat: Dede belirir, cezveyi kaldırır, şimşek, fincan */
            cast(i, v, pos, orbEl, fast) {
                const k = fast ? 0.5 : 1;
                const t0 = (i === 0 ? 0 : this.ENTER * k) + i * 380 * k;
                if (i === 0) this.show();
                const tc = i === 0 ? this.ENTER * k : t0;
                setTimeout(() => {
                    this.anim('cast', 650 * k + 300);
                    if (i === 0) this.say(tf(L().dede.lines[Math.floor(Math.random() * L().dede.lines.length)], { v }), 1500 * k + 400);
                    playSynthNote(660, 0.08, 'triangle', 0.04);
                }, tc);
                setTimeout(() => {
                    this.bolt(pos.x, pos.y, orbEl.className.split(' ').pop());
                    const z = $('zap'); z.classList.remove('on'); void z.offsetWidth; z.classList.add('on');
                    z.style.setProperty('--zx', pos.x + '%');
                    playSynthNote(1175, 0.08, 'sine', 0.05); playSynthNote(294, 0.2, 'triangle', 0.04);
                    buzz(30);
                    flashLights();
                }, tc + 260 * k);
                orbEl.style.animationDelay = ((tc + 330 * k) / 1000) + 's';
                this.hideLater(tc + 330 * k + 2200);   // kazanç yoksa kendiliğinden gider
                return tc + 330 * k;
            },
            /* çarpanlar kazanca uçarken: “Dede çarpan verdi!” */
            give(x, big) {
                this.show();
                this.anim('cheer', 1100);
                this.say(big ? tf(L().dede.big, { v: x }) : tf(L().dede.lines[Math.floor(Math.random() * L().dede.lines.length)], { v: x }), 1800);
                if (big) { [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => playSynthNote(f, 0.22, 'triangle', 0.045), i * 100)); buzz([30, 40, 60]); }
                this.hideLater(2000);
            },
            intro() {
                if (Profile.seenDede) return;
                Profile.seenDede = true; saveProfile();
                setTimeout(() => showDialog('dede', L().dede.name, L().dede.first), 900);
            }
        };

