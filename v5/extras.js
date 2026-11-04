        /* =====================================================
           SİPARİŞ FİŞLERİ (normal spinlerde mini hedefler) — kural engine.js'de (orderStep), burada arayüz
           ===================================================== */
        const ORDER_TXT = {
            tr: { title: 'Sipariş', wins: '{s} spinde {n} kazanç', big: 'Tek spinde bahsin {x} katı', books: 'Tek spinde 2 Reçete Kitabı', streak: 'Art arda {n} kazanç',
                  left: '{n} spin', streak3: '🧾🧾🧾 3 sipariş üst üste! Bahşiş kavanozu +{v}', streakT: 'Seri', potion: 'İksir', done: '📋 Sipariş tamam! +{v}', fail: 'Sipariş kaçtı, yenisi geliyor…', next: 'Yeni sipariş birazdan…', reward: 'Ödül: bahsin {r} katı' },
            en: { title: 'Order', wins: '{n} wins in {s} spins', big: '{x}× your bet in one spin', books: '2 Recipe Books in one spin', streak: '{n} wins in a row',
                  left: '{n} spins', streak3: '🧾🧾🧾 3 orders in a row! Tip jar +{v}', streakT: 'Streak', potion: 'Potion', done: '📋 Order complete! +{v}', fail: 'Order missed, a new one is coming…', next: 'New order soon…', reward: 'Reward: {r}× bet' }
        };
        const OT = () => ORDER_TXT[CUR_LANG()] || ORDER_TXT.tr;
        function orderText(o) {
            const T = Engine.ORDER_TYPES.find(x => x.id === o.t), X = OT();
            return tf(X[o.t], { n: T.goal, s: T.spins, x: T.x });
        }
        function renderOrder() {
            const el = $('order-tk'), sv = Game.save;
            if (!el) return;
            const o = sv && sv.order;
            if (!sv) { el.classList.add('hidden'); return; }
            el.classList.remove('hidden');
            const dim = typeof freeActive === 'function' && freeActive() ? ' dim' : '';
            const st = (o && o.s) || 0;
            const extra = `<span class="ok-st" title="${OT().streakT}">${[0, 1, 2].map(i => `<i class="${i < st ? 'on' : ''}"></i>`).join('')}</span>` + (sv.potion > 0 ? `<span class="ok-po" title="${OT().potion}">${ICON.flask(14)}${sv.potion}</span>` : '');
            if (!o || !o.t) { el.className = 'order-tk idle' + dim; el.innerHTML = `${ICON.ticket(18)}<span>${OT().next}</span>${extra}`; return; }
            const T = Engine.ORDER_TYPES.find(x => x.id === o.t);
            const pct = Math.min(100, o.prog / o.goal * 100);
            el.className = 'order-tk' + dim;
            el.innerHTML = `${ICON.ticket(18)}<b>${orderText(o)}</b><span class="ok-bar"><i style="width:${pct}%"></i></span><small>${o.goal > 1 ? o.prog + '/' + o.goal + ' · ' : ''}${tf(OT().left, { n: o.left })} · ×${fx(T.reward)}</small>${extra}`;
            el.title = tf(OT().reward, { r: fx(T.reward) });
        }
        function orderTick(res) {
            const sv = Game.save; if (!sv) return;
            const r = Engine.orderStep(sv.order, { win: res.total, bet: gameState.bet, scatter: res.scatter }, Math.random);
            sv.order = r.o;
            if (r.done && r.reward > 0) {
                gameState.balance += r.reward;
                const el = $('order-tk');
                if (el) { el.classList.remove('pop'); void el.offsetWidth; el.classList.add('pop'); }
                setTimeout(() => setMessage(tf(OT().done, { v: fmt(r.reward) }), true), 900);
                [659, 880, 1175].forEach((f, i) => setTimeout(() => playSynthNote(f, 0.14, 'triangle', 0.05), 900 + i * 90));
                // seri: 3 sipariş üst üste = bahşiş kavanozu (ödül motorda; burada yalnızca kutlama)
                if (r.jar) setTimeout(() => { setMessage(tf(OT().streak3, { v: fmt(r.jar) }), true); [784, 988, 1175, 1568].forEach((f, i) => setTimeout(() => playSynthNote(f, 0.16, 'sine', 0.06), i * 80)); }, 2400);
                updateHUD();
            } else if (r.failed) { const el = $('order-tk'); if (el) el.classList.add('fail'); }
            renderOrder();
        }

        /* =====================================================
           SÜRÜM GEÇMİŞİ (Ayarlar › Sürüm geçmişi)
           ===================================================== */
        function openHistory() {
            const H = (APP_VERSION.history || []), lg = CUR_LANG();
            const T = lg === 'en' ? { t: '📜 Version history', ok: 'CLOSE' } : { t: '📜 Sürüm geçmişi', ok: 'KAPAT' };
            let h = '';
            H.forEach(v => {
                h += `<div class="vh-item"><div class="vh-head"><b>v${escapeHtml(v.num)}</b><span>“${escapeHtml((v.name && (v.name[lg] || v.name.tr)) || '')}”</span>${v.date ? `<small>${escapeHtml(v.date)}</small>` : ''}</div>
                      <ul>${(v.notes[lg] || v.notes.tr).map(n => `<li>${n}</li>`).join('')}</ul></div>`;
            });
            $('nw-title').textContent = T.t; $('nw-name').textContent = '';
            $('nw-list').innerHTML = `<div class="vh-list">${h}</div>`;
            $('nw-ok').textContent = T.ok;
            closeModal('modal-settings');
            openModal('modal-news');
        }

        /* =====================================================
           ÇİZGİ ROMAN ARŞİVİ (Kupa Odası › Çizgi Roman): açılmış sayıları yeniden oku
           ===================================================== */
        const COMIC_TXT = {
            tr: { info: 'Açtığın her sayı burada. Bir kapağa dokun, yeniden oku.', lockS: '{n}. şubeye ulaşınca', lockTm: 'Kasabayı kurtarınca', lockEra: '{n}. bölüme ulaşınca', lockFin: 'Sagayı bitirince', busy: 'Makaralar dursun, sonra oku ☕', read: 'OKU' },
            en: { info: 'Every issue you’ve unlocked is here. Tap a cover to read it again.', lockS: 'Reach branch {n}', lockTm: 'Save the town', lockEra: 'Reach chapter {n}', lockFin: 'Finish the saga', busy: 'Wait for the reels to stop ☕', read: 'READ' }
        };
        function comicIssues() {
            const sv = Game.save, st = (sv && sv.stage) || 1, fin = !!(sv && sv.finished), CT = COMIC_TXT[CUR_LANG()] || COMIC_TXT.tr;
            const town = ['barista', 'matcha', 'cupcake', 'coffeebag', 'stamp'];
            const out = [1, 2, 3, 4, 5].map(n => ({ id: 's' + n, open: fin || st >= n, art: `<img src="${ASSETS.sym[town[n - 1]]}" alt="">`, col: ['#E07A5F', '#7DB46C', '#FF9FBF', '#E8B84A', '#8E44D6'][n - 1], lock: tf(CT.lockS, { n }) }));
            out.push({ id: 'tm', open: fin || st >= Engine.SAGA_FIRST, art: ICON.hourglass(54), col: '#6B4FB5', lock: CT.lockTm });
            Engine.ERAS.forEach(e => out.push({ id: 'era:' + e.key, open: fin || st >= e.from, art: eraIcon(e.key, 54), col: ERA_META[e.key].col, lock: tf(CT.lockEra, { n: e.from }) }));
            out.push({ id: 'finale', open: fin, art: ICON.skyscraper(54), col: '#D4A72C', lock: CT.lockFin });
            return out;
        }
        function hubComics() {
            if (!Game.save) return `<p class="hub-note">${L().hub.needSave}</p>`;
            const CT = COMIC_TXT[CUR_LANG()] || COMIC_TXT.tr;
            return `<p class="hub-info">${CT.info}</p><div class="cx-grid">` + comicIssues().map(c => {
                if (!c.open) return `<div class="cx locked"><span class="cx-no">?</span><span class="cx-art">${ICON.chest(40)}</span><small>🔒 ${c.lock}</small></div>`;
                const sc = cinemaScript(c.id) || {}, iss = String(sc.issue || '').split('·')[0].trim();
                return `<button class="cx" style="--c:${c.col}" onclick="readComic('${c.id}')"><span class="cx-no">${escapeHtml(iss)}</span><span class="cx-art">${c.art}</span><b>${escapeHtml(sc.title || '')}</b><i>${CT.read}</i></button>`;
            }).join('') + '</div>';
        }
        function readComic(id) {
            if (gameState.isSpinning) { setMessage((COMIC_TXT[CUR_LANG()] || COMIC_TXT.tr).busy); return; }
            closeModal('modal-hub');
            const inGame = document.body.dataset.mode === 'game';
            if (inGame) { stopCasinoMusic(); stopBonusMusic(); }
            Cinema.play(id, () => { if (inGame && typeof startCasinoMusic === 'function') startCasinoMusic(); openHub('comics'); });
        }
