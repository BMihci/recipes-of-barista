        /* =====================================================
           HİKÂYE OYNATICI (animasyonlu çizgi roman) + MÜZİK
           ===================================================== */
        const StoryMusic = (function () {
            // nota → frekans
            const N = n => 440 * Math.pow(2, (n - 69) / 12);
            const C = { C: 60, Cs: 61, D: 62, Eb: 63, E: 64, F: 65, Fs: 66, G: 67, Ab: 68, A: 69, Bb: 70, B: 71 };
            const chord = (root, kind) => {
                const r = C[root];
                const iv = { maj: [0, 4, 7], min: [0, 3, 7], maj7: [0, 4, 7, 11], m7: [0, 3, 7, 10], dom7: [0, 4, 7, 10] }[kind];
                return iv.map(i => r + i);
            };
            // Temalar: 8 vuruşluk (sekizlik) ölçüler, 4 ölçü döngü
            const THEMES = {
                cozy: {                 // Huzurlu Dem — lo-fi kafe cazı
                    bpm: 84, chords: [chord('C', 'maj7'), chord('A', 'm7'), chord('D', 'm7'), chord('G', 'dom7')],
                    bass: [0, null, null, 0, 7, null, 5, null], padType: 'triangle', padVol: 0.022, padHits: [0, 3, 5],
                    melody: [[76, null, 79, null, 81, 79, null, 76], [72, null, 76, null, 79, null, 76, null], [74, null, 77, 81, null, 79, 77, null], [79, null, 77, null, 74, null, 71, null]],
                    leadType: 'sine', leadVol: 0.05, kick: [0, 4], snare: [], hat: [1, 3, 5, 7], hatVol: 0.012
                },
                villain: {              // SyruppoLab — sinsi minör
                    bpm: 100, chords: [chord('A', 'min'), chord('F', 'maj'), chord('D', 'min'), chord('E', 'maj')],
                    bass: [0, 0, 12, 0, 0, 0, 12, 0], bassType: 'sawtooth', padType: 'sawtooth', padVol: 0.012, padHits: [0],
                    melody: [[69, null, 72, 71, null, 69, 68, null], [65, null, 69, 68, null, 65, 64, null], [62, null, 65, 64, null, 62, 61, null], [64, 65, 68, null, 71, null, 68, null]],
                    leadType: 'square', leadVol: 0.022, kick: [0, 4], snare: [2, 6], hat: [], hatVol: 0
                },
                battle: {               // Final — sürükleyici
                    bpm: 132, chords: [chord('D', 'min'), chord('Bb', 'maj'), chord('C', 'maj'), chord('A', 'maj')],
                    bass: [0, 0, 12, 0, 0, 12, 0, 12], bassType: 'square', padType: 'triangle', padVol: 0.016, padHits: [0, 4],
                    arp: true, leadType: 'triangle', leadVol: 0.03, kick: [0, 2, 4, 6], snare: [2, 6], hat: [1, 3, 5, 7], hatVol: 0.014
                },
                heroic: {               // Kahramanlar — umut dolu
                    bpm: 112, chords: [chord('F', 'maj'), chord('G', 'maj'), chord('E', 'min'), chord('A', 'min')],
                    bass: [0, null, 7, null, 0, null, 7, 12], padType: 'triangle', padVol: 0.02, padHits: [0, 2, 4, 6],
                    melody: [[72, null, 77, null, 81, null, 79, 77], [79, null, 74, null, 79, 81, 83, null], [83, null, 79, null, 76, null, 79, null], [81, null, 76, null, 72, 74, 76, null]],
                    leadType: 'square', leadVol: 0.024, kick: [0, 4], snare: [2, 6], hat: [1, 3, 5, 7], hatVol: 0.01
                },
                victory: {              // Zafer — parlak fanfar
                    bpm: 116, chords: [chord('C', 'maj'), chord('F', 'maj'), chord('G', 'maj'), chord('C', 'maj')],
                    bass: [0, null, 7, null, 12, null, 7, null], padType: 'triangle', padVol: 0.022, padHits: [0, 2, 4, 6],
                    melody: [[72, 76, 79, null, 84, null, 79, null], [77, 81, 84, null, 81, null, 77, null], [79, 83, 86, null, 83, 79, 77, null], [84, null, 79, null, 76, 79, 84, null]],
                    leadType: 'square', leadVol: 0.026, bell: true, kick: [0, 4], snare: [2, 6], hat: [1, 3, 5, 7], hatVol: 0.01
                }
            };
            let theme = null, timer = null, nextT = 0, step = 0, master = null;

            function out() {
                if (!master) { master = audioCtx.createGain(); master.gain.value = 1; master.connect(busOut('music')); }
                return master;
            }
            function tone(f, t, dur, type, vol, att) {
                const o = audioCtx.createOscillator(), g = audioCtx.createGain();
                o.type = type || 'sine'; o.frequency.setValueAtTime(f, t);
                g.gain.setValueAtTime(0.0001, t);
                g.gain.linearRampToValueAtTime(vol, t + (att || 0.01));
                g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
                o.connect(g); g.connect(out()); o.start(t); o.stop(t + dur + 0.05);
            }
            let noiseBuf = null;
            function noise(t, dur, vol, hp) {
                if (!noiseBuf) {
                    noiseBuf = audioCtx.createBuffer(1, audioCtx.sampleRate * 0.5, audioCtx.sampleRate);
                    const d = noiseBuf.getChannelData(0);
                    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
                }
                const s = audioCtx.createBufferSource(), f = audioCtx.createBiquadFilter(), g = audioCtx.createGain();
                s.buffer = noiseBuf; f.type = 'highpass'; f.frequency.value = hp || 6000;
                g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
                s.connect(f); f.connect(g); g.connect(out()); s.start(t); s.stop(t + dur + 0.02);
            }
            function kick(t) {
                const o = audioCtx.createOscillator(), g = audioCtx.createGain();
                o.frequency.setValueAtTime(140, t); o.frequency.exponentialRampToValueAtTime(42, t + 0.14);
                g.gain.setValueAtTime(0.11, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.18);
                o.connect(g); g.connect(out()); o.start(t); o.stop(t + 0.2);
            }

            function schedule() {
                if (!theme || isMuted || !audioCtx) return;
                const T = THEMES[theme], spb = 60 / T.bpm / 2;   // sekizlik süresi
                while (nextT < audioCtx.currentTime + 0.18) {
                    const bar = Math.floor(step / 8) % 4, s = step % 8, ch = T.chords[bar];
                    if (T.padHits.indexOf(s) !== -1) ch.forEach(n => tone(N(n), nextT, spb * 1.8, T.padType, T.padVol, 0.02));
                    const b = T.bass[s];
                    if (b !== null && b !== undefined) tone(N(ch[0] - 24 + b), nextT, spb * 0.9, T.bassType || 'sine', 0.06, 0.005);
                    if (T.arp) tone(N(ch[s % ch.length] + 12 + (s >= 4 ? 12 : 0)), nextT, spb * 0.8, T.leadType, T.leadVol, 0.005);
                    else if (T.melody) { const m = T.melody[bar][s]; if (m) tone(N(m), nextT, spb * 1.6, T.leadType, T.leadVol, 0.01); }
                    if (T.bell && s === 0) tone(N(ch[0] + 24), nextT, 0.9, 'sine', 0.03, 0.005);
                    if (T.kick.indexOf(s) !== -1) kick(nextT);
                    if (T.snare.indexOf(s) !== -1) noise(nextT, 0.12, 0.05, 1800);
                    if (T.hat.indexOf(s) !== -1) noise(nextT, 0.04, T.hatVol, 7000);
                    nextT += spb; step++;
                }
            }
            return {
                start(name) {
                    if (isMuted) { theme = name; return; }
                    initAudio();
                    if (!audioCtx) return;
                    if (theme === name && timer) return;
                    this.stop(true);
                    theme = name; step = 0; nextT = audioCtx.currentTime + 0.08;
                    timer = setInterval(schedule, 40);
                    schedule();
                },
                stop(keep) { if (timer) clearInterval(timer); timer = null; if (!keep) theme = null; },
                current() { return theme; },
                sfx(kind) {
                    if (isMuted) return;
                    initAudio(); if (!audioCtx) return;
                    const t = audioCtx.currentTime + 0.01;
                    if (kind === 'boom') { kick(t); noise(t, 0.6, 0.18, 120); tone(70, t, 0.5, 'sine', 0.12); }
                    else if (kind === 'crash') { noise(t, 1.2, 0.16, 300); kick(t); kick(t + 0.18); tone(55, t, 0.9, 'sawtooth', 0.05); }
                    else if (kind === 'whoosh') { noise(t, 0.35, 0.07, 1500); }
                    else if (kind === 'pop') { tone(880, t, 0.09, 'sine', 0.06); tone(1320, t + 0.05, 0.08, 'sine', 0.04); }
                    else if (kind === 'stamp') { kick(t); tone(220, t, 0.12, 'square', 0.04); }
                    else if (kind === 'sparkle') { [1568, 1976, 2349, 3136].forEach((f, i) => tone(f, t + i * 0.07, 0.35, 'sine', 0.035)); }
                    else if (kind === 'splash') { noise(t, 0.5, 0.1, 600); tone(180, t, 0.3, 'sine', 0.06); }
                }
            };
        })();

        /* ---------- Sahne tanımları ----------
           Her "shot": bg, tag, aktörler (giriş animasyonlu), konuşma balonu, efekt yazısı, anlatım, kamera hareketi, müzik, ses efektleri */
        const SVG_CITY = `<svg viewBox="0 0 300 200" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><g stroke="#111" stroke-width="3" stroke-linejoin="round"><rect x="8" y="104" width="46" height="96" fill="#3a1a4f"/><rect x="62" y="124" width="38" height="76" fill="#2d1440"/><rect x="190" y="112" width="44" height="88" fill="#3a1a4f"/><rect x="242" y="130" width="52" height="70" fill="#2d1440"/><g class="rise"><rect x="104" y="58" width="90" height="142" fill="#4b2466"/><polygon points="104,58 149,36 194,58" fill="#5d2d7e"/><rect x="114" y="74" width="70" height="40" rx="3" fill="#1b1030"/><rect x="134" y="146" width="30" height="54" fill="#1b1030"/><text x="149" y="92" text-anchor="middle" font-family="Bangers, Impact, sans-serif" font-size="14" fill="#7bf1a8" stroke="#111" stroke-width=".8" letter-spacing="1">SYRUPPO</text><text x="149" y="108" text-anchor="middle" font-family="Bangers, Impact, sans-serif" font-size="18" fill="#FF5964" stroke="#111" stroke-width=".8" letter-spacing="3">LAB</text></g></g><g class="bolt" fill="#FFE14D" stroke="#111" stroke-width="3" stroke-linejoin="round"><polygon points="64,8 44,60 62,60 50,104 88,44 68,44 82,8"/><polygon points="236,0 222,40 236,40 228,76 258,30 244,30 254,0"/></g></svg>`;
        const SVG_ANGRY = `<svg viewBox="0 0 300 200" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><g stroke="#111" stroke-width="3" stroke-linejoin="round"><rect x="8" y="104" width="46" height="96" fill="#4a1a2a"/><rect x="62" y="124" width="38" height="76" fill="#3a1220"/><rect x="190" y="112" width="44" height="88" fill="#4a1a2a"/><rect x="242" y="130" width="52" height="70" fill="#3a1220"/><rect x="104" y="58" width="90" height="142" fill="#6b2438"/><polygon points="104,58 149,36 194,58" fill="#8a2d46"/><rect x="114" y="72" width="70" height="46" rx="3" fill="#1b1030"/><rect x="134" y="150" width="30" height="50" fill="#1b1030"/></g><text x="149" y="86" text-anchor="middle" font-family="Bangers, Impact, sans-serif" font-size="12" fill="#7bf1a8" stroke="#111" stroke-width=".8" letter-spacing="1">SYRUPPO LAB</text><g class="eyes" stroke="#111" stroke-width="2.5" stroke-linecap="round"><ellipse cx="135" cy="104" rx="8" ry="7" fill="#fff"/><ellipse cx="163" cy="104" rx="8" ry="7" fill="#fff"/><circle cx="137" cy="106" r="3.4" fill="#111"/><circle cx="161" cy="106" r="3.4" fill="#111"/><path d="M124 92 L144 99" fill="none" stroke-width="4"/><path d="M174 92 L154 99" fill="none" stroke-width="4"/></g><g class="steam" fill="#fff" stroke="#111" stroke-width="2.5" opacity=".95"><circle cx="86" cy="86" r="9"/><circle cx="98" cy="76" r="7"/><circle cx="76" cy="72" r="6"/><circle cx="214" cy="86" r="9"/><circle cx="202" cy="76" r="7"/><circle cx="224" cy="72" r="6"/></g></svg>`;
        const SVG_CASTLE = () => `<svg viewBox="0 0 300 200" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><g class="rise"><g stroke="#111" stroke-width="3" stroke-linejoin="round"><rect x="18" y="98" width="50" height="102" fill="#5a2a14"/><rect x="232" y="98" width="50" height="102" fill="#5a2a14"/><rect x="78" y="72" width="144" height="128" fill="#7a3b1c"/><polygon points="18,98 43,64 68,98" fill="#3a1a4f"/><polygon points="232,98 257,64 282,98" fill="#3a1a4f"/><polygon points="78,72 150,20 222,72" fill="#4b2466"/><rect x="124" y="142" width="52" height="58" rx="26" fill="#1b1030"/><rect x="136" y="84" width="28" height="30" rx="3" fill="#1b1030"/></g><g class="drip" fill="#C8741B" stroke="#111" stroke-width="2.5" stroke-linejoin="round"><path d="M78 72 q0 30 9 30 q9 0 9 -30z"/><path d="M120 72 q0 20 7 20 q7 0 7 -20z"/><path d="M170 72 q0 34 9 34 q9 0 9 -34z"/><path d="M204 72 q0 18 7 18 q7 0 7 -18z"/><path d="M18 98 q0 22 8 22 q8 0 8 -22z"/><path d="M246 98 q0 24 8 24 q8 0 8 -24z"/></g><text x="150" y="132" text-anchor="middle" font-family="Bangers, Impact, sans-serif" font-size="13" fill="#FFD27A" stroke="#111" stroke-width=".8" letter-spacing="1.5">${L().castleSign || "ŞURUP KALESİ"}</text></g><g class="bolt" fill="#FFE14D" stroke="#111" stroke-width="3" stroke-linejoin="round"><polygon points="40,4 24,48 38,48 28,86 58,36 44,36 56,4"/></g></svg>`;
        const SVG_FLOOD = `<svg viewBox="0 0 300 200" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><g stroke="#111" stroke-width="3" stroke-linejoin="round"><rect x="20" y="70" width="60" height="130" fill="#E9D2AE"/><polygon points="14,72 50,40 86,72" fill="#B8452F"/><rect x="36" y="100" width="26" height="30" fill="#7EC8E3"/><rect x="200" y="84" width="70" height="116" fill="#F3E1C2"/><polygon points="194,86 235,52 276,86" fill="#5E8C61"/><rect x="220" y="110" width="30" height="28" fill="#7EC8E3"/></g><g class="wave"><path d="M-40 150 Q-15 135 10 150 T60 150 T110 150 T160 150 T210 150 T260 150 T310 150 T360 150 V210 H-40Z" fill="#C8741B" stroke="#111" stroke-width="3"/><path d="M-40 170 Q-15 158 10 170 T60 170 T110 170 T160 170 T210 170 T260 170 T310 170 T360 170 V210 H-40Z" fill="#A85A16" stroke="#111" stroke-width="2.5"/></g><g fill="#fff" opacity=".8"><circle cx="70" cy="160" r="3"/><circle cx="150" cy="156" r="2.5"/><circle cx="230" cy="162" r="3"/></g></svg>`;
        const SVG_RUINS = `<svg viewBox="0 0 300 200" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><g stroke="#111" stroke-width="3" stroke-linejoin="round"><polygon class="fall1" points="20,200 24,130 60,118 70,200" fill="#5a2a14"/><polygon class="fall2" points="232,200 240,138 276,150 282,200" fill="#5a2a14"/><polygon class="fall3" points="84,200 96,150 130,160 150,128 190,150 216,200" fill="#7a3b1c"/><polygon class="fly1" points="40,70 66,52 70,84 46,92" fill="#4b2466"/><polygon class="fly2" points="190,40 220,60 206,86 180,70" fill="#4b2466"/></g><g fill="#C8741B" stroke="#111" stroke-width="2.5"><ellipse cx="150" cy="188" rx="70" ry="10"/><circle cx="96" cy="178" r="6"/><circle cx="206" cy="180" r="7"/></g><g class="steam" fill="#fff" stroke="#111" stroke-width="2.5" opacity=".95"><circle cx="110" cy="100" r="12"/><circle cx="128" cy="86" r="9"/><circle cx="170" cy="96" r="11"/><circle cx="190" cy="108" r="8"/></g></svg>`;
