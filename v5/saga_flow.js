        /* =====================================================
           SAGA AKIŞI: zaman makinesi, dönem girişleri, bölüm şeritleri
           ===================================================== */
        function playChapterStory(n) {
            const c = CHAPTERS[n];
            if (!c.saga) { playStory(n); return; }
            if (Game.save) { Game.save.seen['story' + n] = true; persist(); }
            const era = Engine.eraOf(n);
            if (n === Engine.SAGA_FIRST) Cinema.play('tm', () => Cinema.play('era:' + era.key, () => enterStage(n)));
            else if (n === era.from) Cinema.play('era:' + era.key, () => enterStage(n));
            else Cinema.play('ch:' + n, () => enterStage(n));
        }
        function replayChapterStory(n) {
            const era = Engine.eraOf(n);
            if (n === Engine.SAGA_FIRST) Cinema.play('tm', () => Cinema.play('era:' + era.key, () => openMap()));
            else Cinema.play(n === era.from ? 'era:' + era.key : 'ch:' + n, () => openMap());
        }
        function sagaLine(n) {
            const k = eraKey(n); if (!k) return null;
            const ls = ST().lines[k], ln = ls[(n + 1) % ls.length];
            return [ln[0] === 'dede' ? 'dede' : ln[0], castName(ln[0]), ln[1]];
        }
        function showSagaIntro(n) {
            const k = eraKey(n), EM = ERA_META[k], T = ST().era[k], c = CHAPTERS[n];
            const art = $('ci-art');
            art.innerHTML = `<span class="era-badge" style="--c:${EM.col};--c2:${EM.col2}">${eraIcon(k, 40)}</span>`;
            ['barista', 'cozybear'].forEach(s => { const im = document.createElement('img'); im.src = ASSETS.sym[s]; im.alt = ''; art.appendChild(im); });
            $('ci-title').textContent = `${ST().chWord} ${n}: ${stageName(n).toLocaleUpperCase(CUR_LANG() === 'en' ? 'en-US' : 'tr-TR')}`;
            $('ci-text').innerHTML = tf(L().intro.saga, { era: eraName(k), years: EM.years[CUR_LANG()], buff: T.buff, buffD: T.buffD, at: fmt(c.unlockAt), price: fmt(c.price), bal: fmt(gameState.balance), left: Engine.STAGE_COUNT - n });
            $('ci-ok').textContent = L().intro.btn;
            openModal('modal-chapter-intro');
        }
        function updateEraChip() {
            const k = eraKey(gameState.chapter), chip = $('era-chip');
            if (!chip) return;
            if (!k) { document.body.dataset.era = ''; return; }
            const EM = ERA_META[k], T = ST().era[k];
            chip.style.setProperty('--c', EM.col); chip.style.setProperty('--c2', EM.col2);
            $('era-ic').innerHTML = eraIcon(k, 22); $('era-buff').textContent = T.buff; $('era-desc').textContent = T.buffD;
        }
        function eraInfo() {
            const k = eraKey(gameState.chapter); if (!k) return;
            const T = ST().era[k], e = Engine.eraOf(gameState.chapter);
            showDialog('dede', castName('dede'), tf(L().intro.eraInfo, { era: eraName(k), buff: T.buff, buffD: T.buffD, a: e.from, b: e.from + e.n - 1 }));
        }
        /* eski kayıtlar: zorluk → Hikâye; v5'te oyunu bitirmiş (5. şube) kayıt Saga'ya geçer */
        function migrateSaga(sv) {
            sv.diff = 'story';
            if (sv.treasureTotal === undefined) sv.treasureTotal = sv.treasure || 0;
            if (sv.saga) return;
            sv.saga = true; sv.v = 6; sv.treasure = sv.treasure || 0;
            if (sv.finished && sv.stage === 5) {
                const c6 = CHAPTERS[Engine.SAGA_FIRST];
                sv.finished = false; sv.stage = Engine.SAGA_FIRST; sv.peak = 0; sv.quests = null;
                const extra = Math.max(0, (sv.balance || 0) - c6.carryMax);
                sv.treasure += extra; sv.treasureTotal = (sv.treasureTotal || 0) + extra;
                sv.balance = Math.min(c6.carryMax, Math.max(sv.balance || 0, c6.start));
                sv.bet = 0; sv.fs = null; sv.pendingTM = true;
            }
        }
