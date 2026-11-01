        /* =====================================================
           SES — müzik ve efekt ayrı ses kanalları (Ayarlar'dan)
           ===================================================== */
        let audioCtx = null;
        let casinoMusicInterval = null;
        let bonusMusicInterval = null;
        let isMuted = false;
        let musBus = null, sfxBus = null;

        function initAudio() {
            if (!audioCtx) {
                const AC = window.AudioContext || window.webkitAudioContext;
                if (!AC) return;
                audioCtx = new AC();
                musBus = audioCtx.createGain(); musBus.connect(audioCtx.destination);
                sfxBus = audioCtx.createGain(); sfxBus.connect(audioCtx.destination);
                applyVolumes();
            }
            if (audioCtx.state === 'suspended') audioCtx.resume();
        }
        function busOut(kind) { initAudio(); return kind === 'music' ? musBus : sfxBus; }
        function applyVolumes() {
            if (!audioCtx) return;
            const mv = (typeof Settings !== 'undefined' && Settings.musVol !== undefined) ? Settings.musVol : 0.7;
            const sv = (typeof Settings !== 'undefined' && Settings.sfxVol !== undefined) ? Settings.sfxVol : 0.9;
            musBus.gain.value = Math.max(0, Math.min(1, mv)) * 1.4;
            sfxBus.gain.value = Math.max(0, Math.min(1, sv)) * 1.1;
        }

        function setMuteIcon() {
            const muteBtn = document.getElementById('mute-btn');
            if (muteBtn) muteBtn.innerText = isMuted ? '🔇' : '🔊';
        }
        function toggleMute() {
            isMuted = !isMuted;
            try { Settings.muted = isMuted; saveSettings(); } catch (e) {}
            setMuteIcon();
            if (isMuted) {
                stopCasinoMusic();
                stopBonusMusic();
                if (typeof StoryMusic !== 'undefined') StoryMusic.stop(true);
            } else {
                if (document.body.dataset.screen === 'screen-story') { StoryMusic.start(StoryPlayer.theme() || 'cozy'); return; }
                if (document.body.dataset.mode !== 'game') return;
                if (gameState.freeSpinsRemaining > 0 || gameState.rainRemaining > 0) startBonusMusic();
                else startCasinoMusic();
            }
            if (typeof refreshSettingsUI === 'function') refreshSettingsUI();
        }

        /* =====================================================
           OYUN MÜZİĞİ: melodili, akorlu, yumuşak (16 ölçülük şarkılar)
           Kafe teması: swing'li sıcak caz-pop · Bonus teması: neşeli, hızlı
           ===================================================== */
        const GameMusic = (function () {
            const mf = n => 440 * Math.pow(2, (n - 69) / 12);
            const SONGS = {
                cafe: { bpm: 104, swing: 0.62, bass: [0, null, null, 7, 12, null, 7, null], comp: [2, 6], kick: [0, 4], snare: [2, 6], hat: [1, 3, 5, 7],
                    leadVol: 0.032, padVol: 0.016, bassVol: 0.07, cutoff: 1700,
                    chords: [[[53,57,60,64]], [[50,53,57,60]], [[55,58,62,65]], [[48,52,55,58]], [[53,57,60,64]], [[50,54,57,60]], [[55,58,62,65],[48,52,55,58]], [[53,57,60,62]],
                             [[46,50,53,57]], [[46,49,53,55]], [[45,48,52,55]], [[50,54,57,60]], [[55,58,62,65]], [[48,52,55,58]], [[53,57,60,64]], [[48,52,55,58]]],
                    mel: [[72,null,69,72,77,null,76,null], [74,null,null,72,69,null,65,null], [70,null,69,70,74,null,72,null], [76,null,74,null,72,null,null,null],
                          [72,null,69,72,77,null,79,null], [78,null,77,null,74,null,72,null], [70,72,74,null,76,null,74,null], [77,null,null,null,null,null,72,74],
                          [74,null,77,null,79,null,77,null], [73,null,null,74,73,null,70,null], [72,null,76,null,79,null,76,null], [78,null,76,null,74,null,72,null],
                          [70,null,74,null,77,null,74,null], [76,null,79,null,76,null,72,null], [77,null,76,null,72,null,69,null], [67,null,70,null,72,null,76,null]] },
                bonus: { bpm: 128, swing: 0.5, bass: [0, null, 12, null, 7, null, 12, 7], comp: [1, 3, 5, 7], kick: [0, 4], snare: [2, 6], hat: [0, 1, 2, 3, 4, 5, 6, 7],
                    leadVol: 0.034, padVol: 0.013, bassVol: 0.07, cutoff: 2100, sparkle: true,
                    chords: [[[48,52,55,60]], [[45,48,52,57]], [[53,57,60,65]], [[55,59,62,67]], [[48,52,55,60]], [[52,56,59,62]], [[45,48,52,57]], [[55,59,62,65]],
                             [[53,57,60,65]], [[55,59,62,67]], [[52,55,59,64]], [[45,48,52,57]], [[53,57,60,65]], [[55,59,62,67]], [[48,52,55,60]], [[55,59,62,65]]],
                    mel: [[72,null,76,79,null,76,72,null], [69,null,72,76,null,72,69,null], [65,null,69,72,77,null,76,null], [74,null,71,null,67,null,null,null],
                          [72,null,76,79,null,79,81,null], [80,null,79,null,76,null,71,null], [81,null,79,null,76,null,72,null], [74,null,77,null,76,null,74,null],
                          [77,null,77,76,77,null,81,null], [79,null,79,77,79,null,83,null], [76,null,79,null,83,null,79,null], [81,null,null,79,76,null,72,null],
                          [77,null,76,null,74,null,72,null], [74,null,76,null,77,null,79,null], [84,null,79,null,76,null,72,null], [71,null,74,null,77,null,79,null]] }
            };
            // Cadılar Bayramı: la minörde sevimli-ürkütücü müzik kutusu valsi
            SONGS.spooky = { bpm: 96, swing: 0.62, bass: [0, null, 7, null, 0, null, 7, null], comp: [2, 6], kick: [0, 4], snare: [2, 6], hat: [3, 7],
                leadVol: 0.03, padVol: 0.014, bassVol: 0.07, cutoff: 1500, sparkle: true,
                chords: [[[52,57,60,64]], [[50,53,57,62]], [[52,56,59,62]], [[52,57,60,64]], [[53,57,60,65]], [[50,53,57,62]], [[52,56,59,62]], [[52,57,60,64]],
                         [[52,55,60,64]], [[50,55,59,62]], [[52,57,60,64]], [[52,56,59,62]], [[53,57,60,65]], [[52,56,59,62]], [[52,57,60,64]], [[52,56,59,62]]],
                mel: [[69,null,72,76,null,75,76,null], [74,null,72,null,69,null,65,null], [68,null,71,74,null,72,71,null], [69,null,null,null,64,null,null,null],
                      [72,null,69,72,77,null,76,null], [74,null,77,null,74,null,72,null], [71,null,68,null,64,null,68,71], [69,null,null,null,null,null,null,null],
                      [72,null,76,null,79,null,76,null], [74,null,71,null,67,null,71,null], [72,null,69,null,64,null,69,null], [68,null,64,null,59,null,68,null],
                      [77,null,76,null,74,null,72,null], [71,null,72,null,74,null,76,null], [81,null,76,null,72,null,69,null], [68,null,71,null,74,null,76,null]] };
            let song = null, timer = null, nextBar = 0, bar = 0, bus = null;
            function out() { if (!bus) { bus = audioCtx.createGain(); bus.gain.value = 1; bus.connect(musBus); } return bus; }
            function env(g, t, a, peak, dur) { g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(peak, t + a); g.gain.exponentialRampToValueAtTime(0.0001, t + dur); }
            function lead(n, t, dur, S) {   // sıcak "chiptune" kurşun: kare + üçgen, alçak geçiren süzgeç, hafif vibrato
                const f = mf(n), lp = audioCtx.createBiquadFilter(), g = audioCtx.createGain();
                lp.type = 'lowpass'; lp.frequency.setValueAtTime(S.cutoff, t); lp.frequency.exponentialRampToValueAtTime(S.cutoff * 0.55, t + dur);
                const o1 = audioCtx.createOscillator(), o2 = audioCtx.createOscillator(), vib = audioCtx.createOscillator(), vg = audioCtx.createGain();
                o1.type = 'square'; o2.type = 'triangle'; o1.frequency.value = f; o2.frequency.value = f;
                vib.frequency.value = 5.2; vg.gain.value = f * 0.006; vib.connect(vg); vg.connect(o1.frequency); vg.connect(o2.frequency);
                const m1 = audioCtx.createGain(); m1.gain.value = 0.45;
                o1.connect(m1); m1.connect(lp); o2.connect(lp); lp.connect(g); g.connect(out());
                env(g, t, 0.012, S.leadVol, dur);
                [o1, o2, vib].forEach(o => { o.start(t); o.stop(t + dur + 0.05); });
            }
            function keys(notes, t, dur, vol) {   // elektrik piyano benzeri yumuşak akor
                notes.forEach(n => {
                    const o = audioCtx.createOscillator(), o2 = audioCtx.createOscillator(), g = audioCtx.createGain();
                    o.type = 'sine'; o2.type = 'sine'; o.frequency.value = mf(n); o2.frequency.value = mf(n) * 2.001;
                    const g2 = audioCtx.createGain(); g2.gain.value = 0.25;
                    o.connect(g); o2.connect(g2); g2.connect(g); g.connect(out());
                    env(g, t, 0.006, vol, dur);
                    o.start(t); o2.start(t); o.stop(t + dur + 0.05); o2.stop(t + dur + 0.05);
                });
            }
            function bassNote(n, t, dur, vol) {
                const o = audioCtx.createOscillator(), g = audioCtx.createGain(), lp = audioCtx.createBiquadFilter();
                o.type = 'triangle'; o.frequency.value = mf(n); lp.type = 'lowpass'; lp.frequency.value = 600;
                o.connect(lp); lp.connect(g); g.connect(out()); env(g, t, 0.006, vol, dur); o.start(t); o.stop(t + dur + 0.05);
            }
            function kick(t, v) {
                const o = audioCtx.createOscillator(), g = audioCtx.createGain();
                o.frequency.setValueAtTime(120, t); o.frequency.exponentialRampToValueAtTime(45, t + 0.12);
                g.gain.setValueAtTime(v, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.16);
                o.connect(g); g.connect(out()); o.start(t); o.stop(t + 0.18);
            }
            function brush(t, dur, v, freq) {
                const s = audioCtx.createBufferSource(), f = audioCtx.createBiquadFilter(), g = audioCtx.createGain();
                s.buffer = noiseBuf(); f.type = 'bandpass'; f.frequency.value = freq; f.Q.value = 0.7;
                g.gain.setValueAtTime(v, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
                s.connect(f); f.connect(g); g.connect(out()); s.start(t, Math.random() * 0.3); s.stop(t + dur + 0.02);
            }
            function sparkle(n, t) {
                const o = audioCtx.createOscillator(), g = audioCtx.createGain();
                o.type = 'sine'; o.frequency.value = mf(n + 24); o.connect(g); g.connect(out()); env(g, t, 0.004, 0.012, 0.35); o.start(t); o.stop(t + 0.4);
            }
            function scheduleBar(S, b, t0) {
                const beat = 60 / S.bpm, bars = S.mel.length;
                const slotT = s => t0 + Math.floor(s / 2) * beat + (s % 2 ? beat * S.swing : 0);
                const chs = S.chords[b % bars], mel = S.mel[b % bars];
                for (let s = 0; s < 8; s++) {
                    const t = slotT(s), ch = chs.length > 1 && s >= 4 ? chs[1] : chs[0];
                    const bb = S.bass[s];
                    if (bb !== null && bb !== undefined) bassNote(ch[0] - 12 + bb, t, beat * 0.45, S.bassVol);
                    if (S.comp.indexOf(s) !== -1) keys(ch.slice(1), t, beat * 0.5, S.padVol);
                    if (s === 0) keys(ch, t, beat * 1.6, S.padVol * 0.7);
                    const m = mel[s];
                    if (m) { let len = 1; while (s + len < 8 && mel[s + len] === null && len < 3) len++; lead(m, t, beat * 0.5 * len * 0.95, S); if (S.sparkle && s % 2 === 0) sparkle(m, t); }
                    if (S.kick.indexOf(s) !== -1) kick(t, 0.07);
                    if (S.snare.indexOf(s) !== -1) brush(t, 0.14, 0.03, 2200);
                    if (S.hat.indexOf(s) !== -1) brush(t, 0.04, s % 2 ? 0.008 : 0.012, 7500);
                }
                return t0 + 4 * beat;
            }
            function tick() {
                if (!song || isMuted || !audioCtx) return;
                const S = SONGS[song];
                while (nextBar < audioCtx.currentTime + 0.25) { nextBar = scheduleBar(S, bar, nextBar); bar++; }
            }
            return {
                play(name) {
                    if (isMuted) return;
                    initAudio(); if (!audioCtx) return;
                    if (song === name && timer) return;
                    this.stop();
                    song = name; bar = 0; nextBar = audioCtx.currentTime + 0.1;
                    timer = setInterval(tick, 60); tick();
                },
                stop() { if (timer) clearInterval(timer); timer = null; song = null; },
                current() { return song; },
                _sched(name, bars) { let tt = 0.05; for (let b = 0; b < bars; b++) tt = scheduleBar(SONGS[name], b, tt); return tt; }
            };
        })();

        function startCasinoMusic() {
            if (isMuted) return;
            if (GameMusic.current() === 'bonus') return;
            GameMusic.play(typeof themeOn === 'function' && themeOn() ? 'spooky' : 'cafe');
            casinoMusicInterval = 1;
        }
        function stopCasinoMusic() {
            if (GameMusic.current() === 'cafe' || GameMusic.current() === 'spooky') GameMusic.stop();
            casinoMusicInterval = null;
        }
        function startBonusMusic() {
            if (isMuted) return;
            GameMusic.play('bonus');
            bonusMusicInterval = 1;
        }
        function stopBonusMusic() {
            if (GameMusic.current() === 'bonus') GameMusic.stop();
            bonusMusicInterval = null;
            if (!isMuted && gameState.freeSpinsRemaining === 0 && gameState.rainRemaining <= 0 && document.body.dataset.mode === 'game') startCasinoMusic();
        }

        function playSynthNote(freq, duration, type = 'sine', volume = 0.05, bus) {
            if (isMuted) return;
            initAudio();
            if (!audioCtx) return;
            const now = audioCtx.currentTime;
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = type;
            osc.frequency.setValueAtTime(freq, now);
            gain.gain.setValueAtTime(volume, now);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
            if (freq > 1300) gain.gain.setValueAtTime(volume * 0.55, now);
            if (type === 'square' || type === 'sawtooth') {
                const lp = audioCtx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 2200;
                osc.connect(lp); lp.connect(gain);
            } else osc.connect(gain);
            gain.connect(bus === 'music' ? musBus : sfxBus);
            osc.start(now);
            osc.stop(now + duration);
        }

        function playSpinSound() {
            if (isMuted) return;
            initAudio();
            if (!audioCtx) return;
            const now = audioCtx.currentTime;
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            const d = (typeof turboOn === 'function' && turboOn()) ? 0.18 : 0.4;
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(140, now);
            osc.frequency.linearRampToValueAtTime(400, now + d);
            gain.gain.setValueAtTime(0.09, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + d);
            osc.connect(gain);
            gain.connect(sfxBus);
            osc.start(now);
            osc.stop(now + d);
        }
        /* titreşim (telefon; Ayarlar'dan kapatılabilir) */
        function buzz(ms) {
            try { if (typeof Settings !== 'undefined' && Settings.vibe === false) return; if (navigator.vibrate) navigator.vibrate(ms); } catch (e) {}
        }

        /* ---------- çan, sayfa çevirme, hologram sesleri ---------- */
        function bellAt(freq, t, vol, dur) {
            // çan: uyumsuz üst sesler + uzun sönüm
            [[1, 1], [2.0, .5], [2.76, .35], [5.4, .18], [8.93, .08]].forEach(([m, g]) => {
                const o = audioCtx.createOscillator(), gn = audioCtx.createGain();
                o.type = 'sine'; o.frequency.setValueAtTime(freq * m, t);
                gn.gain.setValueAtTime(0.0001, t);
                gn.gain.exponentialRampToValueAtTime(vol * g, t + 0.008);
                gn.gain.exponentialRampToValueAtTime(0.0001, t + dur / (1 + m * 0.35));
                o.connect(gn); gn.connect(sfxBus); o.start(t); o.stop(t + dur);
            });
        }
        function playBell(freq, delay, vol, dur) {
            if (isMuted) return; initAudio(); if (!audioCtx) return;
            bellAt(freq, audioCtx.currentTime + (delay || 0), vol || 0.06, dur || 2.2);
        }
        /* not defteri seçildiğinde: çan kaskadı + parlak akor */
        function playBellCelebration() {
            if (isMuted) return; initAudio(); if (!audioCtx) return;
            const t = audioCtx.currentTime;
            [1046.5, 1318.5, 1568, 2093, 1568, 2093, 2637].forEach((f, i) => bellAt(f, t + i * 0.11, 0.05, 2.4));
            [523.25, 659.25, 783.99].forEach(f => bellAt(f, t + 0.85, 0.045, 3.2));
            // altta yumuşak "taa-daa" akoru
            [261.63, 329.63, 392, 523.25].forEach((f, i) => {
                const o = audioCtx.createOscillator(), g = audioCtx.createGain();
                o.type = 'triangle'; o.frequency.value = f;
                g.gain.setValueAtTime(0.0001, t + 0.8); g.gain.linearRampToValueAtTime(0.035, t + 0.9); g.gain.exponentialRampToValueAtTime(0.0001, t + 2.6);
                o.connect(g); g.connect(sfxBus); o.start(t + 0.8); o.stop(t + 2.7);
            });
            buzz([40, 60, 40, 60, 120]);
        }
        /* =====================================================
           BÜYÜK KUTLAMA (free spin sonu / büyük kazanç): 3–5 sn'lik fanfar + çanlar + şıngırdayan altınlar.
           Kendi ses kanalından çalar (atlanınca yumuşakça susar); müzik bu sırada kısılır.
           Dönen değer: ışık efektleri için vuruş zamanları (ms).
           ===================================================== */
        let jpBus = null, jpEnd = 0;
        function playJackpot(tier, sec) {
            const beats = [];
            sec = sec || (3.2 + (tier || 0) * 0.9);
            const B = 0.19;   // sekizlik nota (~158 bpm)
            const mel = [   // [vuruş, nota(midi), uzunluk(vuruş)]
                [0, 67, 1], [1, 72, 1], [2, 76, 1], [3, 79, 2], [5, 76, 1], [6, 79, 3],
                [9, 77, 1], [10, 76, 1], [11, 74, 1], [12, 72, 1], [13, 74, 1], [14, 76, 2], [16, 79, 1], [17, 84, 5]];
            const extra = tier >= 1 ? [[22, 81, 1], [23, 79, 1], [24, 84, 7]] : [];
            const notes = mel.concat(extra), lastBeat = notes[notes.length - 1][0] + notes[notes.length - 1][2];
            const scale = Math.min(1.25, sec / (lastBeat * B + 0.6));
            const b = B * scale;
            notes.forEach(n => beats.push(Math.round(n[0] * b * 1000)));
            if (isMuted) return beats;
            initAudio(); if (!audioCtx) return beats;
            const t0 = audioCtx.currentTime + 0.05;
            if (jpBus) { try { jpBus.gain.cancelScheduledValues(t0); jpBus.gain.setTargetAtTime(0, t0, 0.05); } catch (e) {} }
            jpBus = audioCtx.createGain(); jpBus.gain.value = 1; jpBus.connect(sfxBus);
            const out = jpBus, hz = m => 440 * Math.pow(2, (m - 69) / 12);
            // müziği kıs, sonra geri aç
            try { const mv = musBus.gain.value; musBus.gain.cancelScheduledValues(t0); musBus.gain.setTargetAtTime(mv * 0.22, t0, 0.08); musBus.gain.setTargetAtTime(mv, t0 + lastBeat * b + 0.8, 0.4); } catch (e) {}
            // pirinç (bakır üflemeli) ses: iki hafif akortsuz testere + alçak geçiren süzgeç
            const brass = (f, at, dur, vol) => {
                const lp = audioCtx.createBiquadFilter(), g = audioCtx.createGain();
                lp.type = 'lowpass'; lp.Q.value = 1.2;
                lp.frequency.setValueAtTime(700, at); lp.frequency.linearRampToValueAtTime(2600, at + 0.06); lp.frequency.exponentialRampToValueAtTime(1500, at + dur);
                g.gain.setValueAtTime(0.0001, at); g.gain.linearRampToValueAtTime(vol, at + 0.03); g.gain.setValueAtTime(vol * 0.8, at + Math.max(0.05, dur - 0.08)); g.gain.exponentialRampToValueAtTime(0.0001, at + dur + 0.12);
                [-6, 6].forEach(dt => { const o = audioCtx.createOscillator(); o.type = 'sawtooth'; o.frequency.value = f; o.detune.value = dt; o.connect(lp); o.start(at); o.stop(at + dur + 0.15); });
                lp.connect(g); g.connect(out);
            };
            notes.forEach(([s, m, l]) => {
                const at = t0 + s * b, dur = l * b * 0.92;
                brass(hz(m), at, dur, 0.05);
                brass(hz(m - 12), at, dur, 0.022);
                if (l >= 2) bellAt(hz(m + 12), at, 0.035, 1.6);
            });
            // bas ve akorlar: C – F – G – C
            [[0, [48, 64, 67]], [9, [53, 65, 69]], [13, [55, 62, 71]], [17, [48, 64, 67, 72]]].concat(tier >= 1 ? [[22, [53, 69, 72]], [24, [48, 64, 67, 72, 76]]] : []).forEach(([s, ch], i, arr) => {
                const at = t0 + s * b, end = t0 + (i + 1 < arr.length ? arr[i + 1][0] : lastBeat) * b;
                ch.forEach((m, k) => { const o = audioCtx.createOscillator(), g = audioCtx.createGain(); o.type = k ? 'triangle' : 'sine'; o.frequency.value = hz(m);
                    g.gain.setValueAtTime(0.0001, at); g.gain.linearRampToValueAtTime(k ? 0.018 : 0.06, at + 0.04); g.gain.exponentialRampToValueAtTime(0.0001, end + 0.3);
                    o.connect(g); g.connect(out); o.start(at); o.stop(end + 0.35); });
            });
            // davul: her vuruşta yumuşak tok vuruş, final akorunda trampet sağanağı
            for (let s = 0; s < lastBeat; s += 2) { const at = t0 + s * b, o = audioCtx.createOscillator(), g = audioCtx.createGain(); o.type = 'sine';
                o.frequency.setValueAtTime(150, at); o.frequency.exponentialRampToValueAtTime(50, at + 0.12); g.gain.setValueAtTime(0.11, at); g.gain.exponentialRampToValueAtTime(0.0001, at + 0.16);
                o.connect(g); g.connect(out); o.start(at); o.stop(at + 0.18); }
            const rollAt = t0 + 15 * b;
            for (let i = 0; i < 14; i++) { const at = rollAt + i * b / 3.5, s = audioCtx.createBufferSource(), f = audioCtx.createBiquadFilter(), g = audioCtx.createGain();
                s.buffer = noiseBuf(); f.type = 'highpass'; f.frequency.value = 2200; g.gain.setValueAtTime(0.012 + i * 0.002, at); g.gain.exponentialRampToValueAtTime(0.0001, at + 0.07);
                s.connect(f); f.connect(g); g.connect(out); s.start(at, Math.random() * 0.3); s.stop(at + 0.08); }
            // çan kaskadları (başta ve finalde)
            [2093, 2637, 3136, 4186].forEach((f, i) => bellAt(f, t0 + i * 0.07, 0.03, 1.8));
            [1046.5, 1318.5, 1568, 2093, 2637, 3136].forEach((f, i) => bellAt(f, t0 + 17 * b + i * 0.08, 0.035, 2.4));
            // şıngırdayan altın paralar: rastgele metalik "ting"ler (kutlama boyunca)
            const coinEnd = lastBeat * b + 0.4, n = Math.round(coinEnd * (tier >= 2 ? 26 : tier ? 20 : 15));
            for (let i = 0; i < n; i++) {
                const at = t0 + Math.random() * coinEnd, f = 2400 + Math.random() * 1800;
                [[1, 0.022], [1.51, 0.012], [2.73, 0.006]].forEach(([m, v]) => { const o = audioCtx.createOscillator(), g = audioCtx.createGain(); o.type = 'sine'; o.frequency.value = f * m;
                    g.gain.setValueAtTime(0.0001, at); g.gain.exponentialRampToValueAtTime(v, at + 0.004); g.gain.exponentialRampToValueAtTime(0.0001, at + 0.09 + Math.random() * 0.12);
                    o.connect(g); g.connect(out); o.start(at); o.stop(at + 0.25); });
            }
            jpEnd = t0 + lastBeat * b + 2.4;
            buzz(tier ? [60, 80, 60, 80, 200] : [50, 70, 120]);
            return beats;
        }
        function stopJackpot() {
            if (!audioCtx || !jpBus) return;
            const t = audioCtx.currentTime;
            try { jpBus.gain.cancelScheduledValues(t); jpBus.gain.setTargetAtTime(0, t, 0.12); musBus.gain.cancelScheduledValues(t); applyVolumes(); } catch (e) {}
            jpBus = null;
        }
        let _noise = null;
        function noiseBuf() {
            if (_noise) return _noise;
            _noise = audioCtx.createBuffer(1, audioCtx.sampleRate * 0.6, audioCtx.sampleRate);
            const d = _noise.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
            return _noise;
        }
        function playPageFlip() {
            if (isMuted) return; initAudio(); if (!audioCtx) return;
            const t = audioCtx.currentTime, s = audioCtx.createBufferSource(), f = audioCtx.createBiquadFilter(), g = audioCtx.createGain();
            s.buffer = noiseBuf(); f.type = 'bandpass'; f.Q.value = 0.8;
            f.frequency.setValueAtTime(900, t); f.frequency.exponentialRampToValueAtTime(3200, t + 0.45);
            g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(0.09, t + 0.12); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.55);
            s.connect(f); f.connect(g); g.connect(sfxBus); s.start(t); s.stop(t + 0.6);
        }
        function playHoloTick(step) {
            if (isMuted) return; initAudio(); if (!audioCtx) return;
            const t = audioCtx.currentTime, o = audioCtx.createOscillator(), g = audioCtx.createGain();
            o.type = 'sine'; o.frequency.setValueAtTime(660 + (step % 8) * 55, t); o.frequency.exponentialRampToValueAtTime(1320 + (step % 8) * 80, t + 0.06);
            g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(0.03, t + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.12);
            o.connect(g); g.connect(sfxBus); o.start(t); o.stop(t + 0.13);
        }
