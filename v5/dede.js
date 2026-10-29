        /* =====================================================
           KAHVE DEDE — çarpan veren dede (Gates of Olympus’taki gibi,
           ama kendi karakterimiz): çatı penceresinden cezvesiyle çarpan fırlatır.
           ===================================================== */
        ASSETS.sym.dede = DEDE_IMG;
        /* Çarpan: Türk kahvesi fincanı (kademe rengine göre kuşak) */
        const CUP_COL = { o1: ['#3FA34D', '#BDF0B0'], o2: ['#2F7FD8', '#B9DDFF'], o3: ['#8E44D6', '#E6C9FF'], o4: ['#D8342A', '#FFD0A0'] };
        function cupSVG(tier) {
            const [c, l] = CUP_COL[tier] || CUP_COL.o1;
            return `<svg viewBox="0 0 120 110" class="cup" aria-hidden="true">
              <ellipse cx="60" cy="96" rx="52" ry="11" fill="#E9DCC6" stroke="#B8945E" stroke-width="3"/>
              <ellipse cx="60" cy="93" rx="38" ry="6" fill="#F7EFE2"/>
              <path d="M24 30 Q24 86 60 90 Q96 86 96 30 Z" fill="#FFFDF8" stroke="#B8945E" stroke-width="3"/>
              <path d="M26 48 Q60 58 94 48 L93 62 Q60 72 27 62 Z" fill="${c}"/>
              <g fill="${l}"><circle cx="38" cy="56" r="3"/><circle cx="50" cy="60" r="3"/><circle cx="62" cy="61" r="3"/><circle cx="74" cy="59" r="3"/><circle cx="85" cy="55" r="3"/></g>
              <path d="M26 46 Q60 56 94 46" stroke="#D9A73A" stroke-width="2.5" fill="none"/><path d="M27 64 Q60 74 93 64" stroke="#D9A73A" stroke-width="2.5" fill="none"/>
              <ellipse cx="60" cy="30" rx="36" ry="9" fill="#D9A73A"/>
              <ellipse cx="60" cy="31" rx="31" ry="6.5" fill="#5A3416"/>
              <ellipse cx="60" cy="30" rx="27" ry="5" fill="#B9844F"/>
              <g fill="#E7C7A0" opacity=".9"><circle cx="50" cy="29" r="2"/><circle cx="64" cy="31" r="1.6"/><circle cx="71" cy="28" r="1.4"/></g>
              <path d="M34 36 Q32 60 40 76" stroke="#fff" stroke-width="4" fill="none" opacity=".7" stroke-linecap="round"/>
            </svg>`;
        }
        const Dede = {
            hideT: null,
            el() { return $('dede'); },
            mount() {
                const box = this.el();
                if (!box || box.dataset.ready) return;
                box.dataset.ready = '1';
                box.innerHTML = `<div class="dd-aura"></div><div class="dd-fig">${DEDE_SVG}</div><div class="dd-bub" id="dede-bub"></div>`;
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

