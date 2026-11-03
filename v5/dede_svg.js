        /* =====================================================
           KAHVE DEDE — çizim (SVG, koddan; dış görsel yok)
           ===================================================== */
        const DEDE_HATS = {"kasket": "  <!-- kasket -->\n  <path d=\"M58 76 Q64 30 122 30 Q178 32 184 72 Q150 58 120 60 Q86 60 58 76 Z\" fill=\"url(#dd-cap)\" stroke=\"#3E2A1C\" stroke-width=\"4\" stroke-linejoin=\"round\"/>\n  <path d=\"M60 74 Q100 50 170 62 Q196 66 206 80 Q170 74 140 74 Q96 74 60 80 Z\" fill=\"#6E5039\" stroke=\"#3E2A1C\" stroke-width=\"4\" stroke-linejoin=\"round\"/>\n  <g stroke=\"#A88A70\" stroke-width=\"2\" opacity=\".55\"><path d=\"M78 54 l10 -10 M96 46 l10 -10 M116 42 l10 -10 M136 42 l10 -10 M156 48 l10 -10\"/></g>\n  <circle cx=\"122\" cy=\"32\" r=\"5\" fill=\"#5E4330\" stroke=\"#3E2A1C\" stroke-width=\"2\"/>\n", "beret": "  <!-- bere -->\n  <path d=\"M56 76 Q52 42 112 34 Q182 28 190 66 Q150 58 118 60 Q84 62 56 76 Z\" fill=\"#2F6FB5\" stroke=\"#163E6B\" stroke-width=\"4\" stroke-linejoin=\"round\"/>\n  <path d=\"M58 74 Q120 54 190 66\" stroke=\"#9CC6F0\" stroke-width=\"5\" fill=\"none\" stroke-linecap=\"round\"/>\n  <path d=\"M118 34 q4 -12 12 -14\" stroke=\"#163E6B\" stroke-width=\"5\" fill=\"none\" stroke-linecap=\"round\"/>\n", "chef": "  <!-- aşçı şapkası -->\n  <g stroke=\"#B9B2A8\" stroke-width=\"4\" stroke-linejoin=\"round\">\n    <circle cx=\"86\" cy=\"34\" r=\"24\" fill=\"#FFFFFF\"/><circle cx=\"122\" cy=\"20\" r=\"28\" fill=\"#FFFFFF\"/><circle cx=\"158\" cy=\"34\" r=\"24\" fill=\"#FFFFFF\"/>\n    <path d=\"M66 46 Q120 30 178 46 L172 78 Q120 66 70 78 Z\" fill=\"#FFFFFF\"/>\n  </g>\n  <path d=\"M70 70 Q120 58 172 70\" stroke=\"#E7DFD2\" stroke-width=\"5\" fill=\"none\"/>\n", "crown": "  <!-- taç -->\n  <path d=\"M64 74 L60 30 L88 52 L120 18 L152 52 L180 30 L176 74 Q120 62 64 74 Z\" fill=\"#F2C25A\" stroke=\"#8A5A10\" stroke-width=\"4\" stroke-linejoin=\"round\"/>\n  <circle cx=\"60\" cy=\"28\" r=\"7\" fill=\"#FFE27A\" stroke=\"#8A5A10\" stroke-width=\"3\"/><circle cx=\"120\" cy=\"16\" r=\"8\" fill=\"#FFE27A\" stroke=\"#8A5A10\" stroke-width=\"3\"/><circle cx=\"180\" cy=\"28\" r=\"7\" fill=\"#FFE27A\" stroke=\"#8A5A10\" stroke-width=\"3\"/>\n  <circle cx=\"92\" cy=\"62\" r=\"6\" fill=\"#E63946\"/><circle cx=\"120\" cy=\"58\" r=\"7\" fill=\"#2F7FD8\"/><circle cx=\"148\" cy=\"62\" r=\"6\" fill=\"#3FA34D\"/>\n", "witch": "  <!-- cadı şapkası -->\n  <path d=\"M84 62 Q100 30 116 10 Q128 -6 150 -2 Q132 10 138 34 Q142 50 160 62 Z\" fill=\"#4B2466\" stroke=\"#1F0F2B\" stroke-width=\"4\" stroke-linejoin=\"round\"/>\n  <ellipse cx=\"120\" cy=\"66\" rx=\"80\" ry=\"16\" fill=\"#3A1A4F\" stroke=\"#1F0F2B\" stroke-width=\"4\"/>\n  <path d=\"M88 58 Q122 50 158 58 L160 66 Q122 58 86 66 Z\" fill=\"#FF8A1E\" stroke=\"#1F0F2B\" stroke-width=\"2.5\"/>\n  <rect x=\"114\" y=\"52\" width=\"14\" height=\"14\" rx=\"2\" fill=\"#FFD27A\" stroke=\"#1F0F2B\" stroke-width=\"2.5\"/>\n"};

        /* Dönem kıyafetleri (Zaman Yolculuğu mağazası) */
        DEDE_HATS.nemes = `  <!-- nemes başlığı -->
  <path d="M60 80 Q62 28 122 24 Q182 28 184 80 L200 150 L176 150 L166 88 Q122 74 78 88 L68 150 L44 150 Z" fill="#F2C25A" stroke="#5A3A10" stroke-width="4" stroke-linejoin="round"/>
  <g stroke="#2F4F9F" stroke-width="6" fill="none" stroke-linecap="round"><path d="M72 48 Q122 34 172 48"/><path d="M66 64 Q122 50 178 64"/><path d="M56 106 L74 106 M52 126 L72 126 M170 106 L188 106 M172 126 L192 126"/></g>
  <path d="M74 86 Q122 70 170 86" stroke="#2F4F9F" stroke-width="9" fill="none"/>
  <path d="M122 30 q-9 -14 0 -24 q11 9 0 24z" fill="#E8B84A" stroke="#5A3A10" stroke-width="3"/>
`;
        DEDE_HATS.defne = (() => {   // defne tacı: kafanın üstünde yay boyunca yapraklar
            let s = '  <!-- defne tacı -->\n  <path d="M62 74 Q122 22 182 74" stroke="#5A3A10" stroke-width="4" fill="none"/>\n  <g fill="#6FA84A" stroke="#2E5A1E" stroke-width="2.5">';
            for (let i = 0; i <= 12; i++) {
                const a = Math.PI * (1 - i / 12), x = 122 + Math.cos(a) * 62, y = 74 - Math.sin(a) * 44, rot = -a * 180 / Math.PI + (i % 2 ? 40 : -40) + 90;
                s += `<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="13" ry="6" transform="rotate(${rot.toFixed(0)} ${x.toFixed(1)} ${y.toFixed(1)})"/>`;
            }
            return s + '</g>\n  <circle cx="122" cy="32" r="6" fill="#F2C25A" stroke="#8A5A10" stroke-width="2"/>\n';
        })();
        DEDE_HATS.boynuz = `  <!-- viking miğferi -->
  <path d="M66 58 Q28 52 22 8 Q44 36 72 40 Z" fill="#F4EFE6" stroke="#5A4A3A" stroke-width="3.5" stroke-linejoin="round"/>
  <path d="M178 58 Q216 52 222 8 Q200 36 172 40 Z" fill="#F4EFE6" stroke="#5A4A3A" stroke-width="3.5" stroke-linejoin="round"/>
  <path d="M62 78 Q64 20 122 18 Q180 20 182 78 Z" fill="#9AA3AB" stroke="#3A4248" stroke-width="4"/>
  <path d="M60 76 L184 76" stroke="#6E5039" stroke-width="10" stroke-linecap="round"/>
  <path d="M122 20 L122 76" stroke="#7E878E" stroke-width="8"/>
  <g fill="#D9DEE2"><circle cx="80" cy="70" r="3"/><circle cx="100" cy="72" r="3"/><circle cx="144" cy="72" r="3"/><circle cx="164" cy="70" r="3"/></g>
`;
        DEDE_HATS.migfer = `  <!-- roma miğferi -->
  <path d="M70 26 Q122 -18 174 26 Q122 8 70 26Z" fill="#C0392B" stroke="#6A1A12" stroke-width="3"/>
  <g stroke="#8E1E1E" stroke-width="2"><path d="M84 18 L88 26 M100 8 L102 20 M122 4 L122 18 M144 8 L142 20 M160 18 L156 26"/></g>
  <path d="M64 80 Q66 26 122 24 Q178 26 180 80 Z" fill="#C9CED4" stroke="#4A5058" stroke-width="4"/>
  <path d="M58 80 Q122 66 186 80 L186 88 Q122 76 58 88Z" fill="#D9A73A" stroke="#6A4A10" stroke-width="3"/>
`;
        DEDE_HATS.kavuk = `  <!-- kavuk / sarık -->
  <ellipse cx="122" cy="38" rx="44" ry="30" fill="#C0392B" stroke="#6A1A12" stroke-width="4"/>
  <path d="M54 82 Q46 44 80 40 Q122 30 164 40 Q198 44 190 82 Q122 66 54 82Z" fill="#FFFDF5" stroke="#9A8A70" stroke-width="4"/>
  <g stroke="#D8CDB8" stroke-width="3" fill="none"><path d="M60 72 Q122 46 184 72"/><path d="M58 58 Q122 36 186 58"/></g>
  <path d="M120 46 q-6 -30 10 -42 q-2 22 -4 42z" fill="#fff" stroke="#9A8A70" stroke-width="2"/>
  <circle cx="122" cy="52" r="8" fill="#2F7FD8" stroke="#D9A73A" stroke-width="3"/>
`;
        DEDE_HATS.silindir = `  <!-- silindir şapka -->
  <path d="M84 72 L88 2 Q122 -6 156 2 L160 72 Z" fill="#2A2420" stroke="#000" stroke-width="4"/>
  <path d="M86 56 L158 56 L159 68 L85 68Z" fill="#8E2A2A"/>
  <ellipse cx="122" cy="72" rx="76" ry="13" fill="#1E1A18" stroke="#000" stroke-width="3"/>
`;
        DEDE_HATS.tricorne = `  <!-- üç köşeli şapka -->
  <path d="M48 72 Q58 26 122 28 Q186 26 196 72 Q170 56 122 60 Q74 56 48 72Z" fill="#1E2240" stroke="#0A0A14" stroke-width="4" stroke-linejoin="round"/>
  <path d="M46 74 Q122 38 198 74" fill="none" stroke="#D9A73A" stroke-width="4"/>
  <path d="M108 62 L122 86 L136 62 Z" fill="#1E2240" stroke="#D9A73A" stroke-width="3"/>
  <circle cx="152" cy="52" r="9" fill="#fff" stroke="#2F4F9F" stroke-width="4"/><circle cx="152" cy="52" r="3" fill="#E63946"/>
`;
        DEDE_HATS.ronesans = `  <!-- rönesans beresi -->
  <path d="M150 40 Q200 -2 224 -8 Q198 20 156 48Z" fill="#F4EFE6" stroke="#9A8A70" stroke-width="2.5"/>
  <ellipse cx="114" cy="44" rx="76" ry="26" fill="#8E1E2A" stroke="#4A0E14" stroke-width="4" transform="rotate(-8 114 44)"/>
  <path d="M60 76 Q122 60 184 76 L182 64 Q122 50 62 64Z" fill="#D9A73A" stroke="#6A4A10" stroke-width="3"/>
`;
        DEDE_HATS.fotr = `  <!-- fötr şapka -->
  <path d="M74 68 Q76 20 122 16 Q168 20 170 68Z" fill="#6E727A" stroke="#2A2C30" stroke-width="4"/>
  <path d="M122 18 Q116 32 122 44" stroke="#2A2C30" stroke-width="4" fill="none"/>
  <path d="M75 54 Q122 46 169 54 L170 66 Q122 58 74 66Z" fill="#111"/>
  <ellipse cx="122" cy="70" rx="86" ry="14" fill="#5A5E66" stroke="#2A2C30" stroke-width="4"/>
`;

        DEDE_HATS.bandana = `  <!-- yeşil bandana -->
  <path d="M60 72 Q62 34 120 30 Q178 32 182 70 Q150 60 120 60 Q90 60 60 72 Z" fill="#5FA463" stroke="#2C5A2E" stroke-width="4" stroke-linejoin="round"/>
  <g fill="#E9F7DA" opacity=".9"><circle cx="92" cy="50" r="4"/><circle cx="118" cy="42" r="4"/><circle cx="146" cy="48" r="4"/><circle cx="104" cy="56" r="2.6"/><circle cx="134" cy="55" r="2.6"/><circle cx="164" cy="58" r="2.6"/></g>
  <path d="M60 72 Q120 54 182 70" stroke="#2C5A2E" stroke-width="5" fill="none" stroke-linecap="round"/>
  <path d="M180 66 q18 -6 24 6 q-12 2 -18 -2 q6 12 -2 20 q-6 -10 -4 -24z" fill="#5FA463" stroke="#2C5A2E" stroke-width="3.5" stroke-linejoin="round"/>
`;
        DEDE_HATS.hasir = `  <!-- hasır şapka -->
  <ellipse cx="122" cy="70" rx="86" ry="15" fill="#E8C46A" stroke="#8A6420" stroke-width="4"/>
  <path d="M74 66 Q76 26 122 24 Q168 26 170 66 Q122 56 74 66 Z" fill="#F2D37E" stroke="#8A6420" stroke-width="4" stroke-linejoin="round"/>
  <path d="M76 58 Q122 46 168 58 L169 66 Q122 56 75 66 Z" fill="#C0392B" stroke="#7A1E14" stroke-width="2.5"/>
  <g stroke="#B88A32" stroke-width="2" opacity=".7" fill="none"><path d="M86 44 Q122 34 158 44"/><path d="M82 34 Q122 22 162 36" opacity=".6"/><path d="M50 72 Q122 86 194 72"/></g>
  <path d="M150 52 q8 -12 16 -4 q-6 2 -8 10z" fill="#E8B84A" stroke="#8A6420" stroke-width="2"/>
`;
        function dedeSVG(hat) { return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 240">
  <defs>
    <radialGradient id="dd-fur" cx="45%" cy="38%" r="70%"><stop offset="0" stop-color="#E2B386"/><stop offset=".65" stop-color="#C98F5E"/><stop offset="1" stop-color="#A9703F"/></radialGradient>
    <radialGradient id="dd-muz" cx="50%" cy="35%" r="70%"><stop offset="0" stop-color="#FFF6EA"/><stop offset="1" stop-color="#EBD7BD"/></radialGradient>
    <linearGradient id="dd-cap" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8C6A4F"/><stop offset="1" stop-color="#5E4330"/></linearGradient>
    <linearGradient id="dd-cop" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFC08A"/><stop offset=".45" stop-color="#D9773A"/><stop offset="1" stop-color="#8E3F17"/></linearGradient>
    <linearGradient id="dd-sw" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7FA36A"/><stop offset="1" stop-color="#557A48"/></linearGradient>
  </defs>
  <!-- gövde: yeşil hırka -->
  <path d="M52 236 Q56 176 120 170 Q184 176 188 236 Z" fill="url(#dd-sw)" stroke="#3E5A34" stroke-width="4"/>
  <path d="M120 172 L104 236 M120 172 L136 236" stroke="#3E5A34" stroke-width="3" fill="none"/>
  <circle cx="113" cy="200" r="3.2" fill="#F2D49B"/><circle cx="111" cy="218" r="3.2" fill="#F2D49B"/>
  <!-- kulaklar -->
  <circle cx="62" cy="62" r="24" fill="url(#dd-fur)" stroke="#7A4B2A" stroke-width="4"/><circle cx="62" cy="64" r="12" fill="#E9B9A0"/>
  <circle cx="178" cy="62" r="24" fill="url(#dd-fur)" stroke="#7A4B2A" stroke-width="4"/><circle cx="178" cy="64" r="12" fill="#E9B9A0"/>
  <!-- kafa -->
  <ellipse cx="120" cy="112" rx="72" ry="66" fill="url(#dd-fur)" stroke="#7A4B2A" stroke-width="4"/>
  <!-- yanlarda kır saç tutamları -->
  <path d="M50 104 q-12 6 -8 18 q-10 4 -4 16 q10 2 16 -8" fill="#F4F1EC" stroke="#B9B2A8" stroke-width="3"/>
  <path d="M190 104 q12 6 8 18 q10 4 4 16 q-10 2 -16 -8" fill="#F4F1EC" stroke="#B9B2A8" stroke-width="3"/>
${DEDE_HATS[hat] || DEDE_HATS.kasket}  <!-- gür beyaz kaşlar -->
  <path d="M74 96 q12 -14 34 -6 q-4 8 -14 8 q-10 2 -20 -2Z" fill="#FAF8F4" stroke="#B9B2A8" stroke-width="2.5" stroke-linejoin="round"/>
  <path d="M166 96 q-12 -14 -34 -6 q4 8 14 8 q10 2 20 -2Z" fill="#FAF8F4" stroke="#B9B2A8" stroke-width="2.5" stroke-linejoin="round"/>
  <!-- yuvarlak gözlük + gülen gözler -->
  <g class="dd-eyes">
    <path d="M84 112 q8 -8 16 0" stroke="#3A2416" stroke-width="4.5" fill="none" stroke-linecap="round"/>
    <path d="M140 112 q8 -8 16 0" stroke="#3A2416" stroke-width="4.5" fill="none" stroke-linecap="round"/>
  </g>
  <g fill="rgba(210,235,255,.28)" stroke="#C9A24B" stroke-width="4"><circle cx="92" cy="111" r="17"/><circle cx="148" cy="111" r="17"/></g>
  <path d="M109 109 q11 -6 22 0" stroke="#C9A24B" stroke-width="4" fill="none"/>
  <path d="M80 104 q4 -4 9 -5" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round" opacity=".8"/>
  <!-- yanaklar -->
  <ellipse cx="74" cy="136" rx="11" ry="7" fill="#F29C9C" opacity=".55"/><ellipse cx="166" cy="136" rx="11" ry="7" fill="#F29C9C" opacity=".55"/>
  <!-- ağız çevresi -->
  <ellipse cx="120" cy="146" rx="34" ry="26" fill="url(#dd-muz)" stroke="#C7A27E" stroke-width="3"/>
  <ellipse cx="120" cy="132" rx="11" ry="8" fill="#3A2416"/><ellipse cx="116" cy="129" rx="4" ry="2.4" fill="#fff" opacity=".7"/>
  <!-- koca bıyık -->
  <path class="dd-must" d="M120 140 q-14 -6 -30 4 q-14 9 -26 2 q4 16 24 16 q20 0 32 -14 q12 14 32 14 q20 0 24 -16 q-12 7 -26 -2 q-16 -10 -30 -4Z" fill="#FAF8F4" stroke="#B9B2A8" stroke-width="3" stroke-linejoin="round"/>
  <path class="dd-mouth" d="M110 164 q10 10 20 0" stroke="#7A3A2A" stroke-width="4" fill="#E86A6A" stroke-linecap="round"/>
  <!-- kol + cezve -->
  <g class="dd-arm">
    <path d="M168 204 Q192 186 196 156" stroke="#3E5A34" stroke-width="30" fill="none" stroke-linecap="round"/>
    <path d="M168 204 Q192 186 196 156" stroke="url(#dd-sw)" stroke-width="22" fill="none" stroke-linecap="round"/>
    <g class="dd-pot">
      <path d="M196 150 L214 102" stroke="#3E2A1C" stroke-width="10" stroke-linecap="round"/>
      <path d="M196 150 L214 102" stroke="#B07444" stroke-width="5.5" stroke-linecap="round"/>
      <path d="M208 70 Q200 102 210 114 Q226 124 240 114 Q248 100 240 68 Z" fill="url(#dd-cop)" stroke="#5C2A10" stroke-width="4" stroke-linejoin="round"/>
      <path d="M203 70 L243 66 L248 56 Q224 54 201 62 Z" fill="#E08A4A" stroke="#5C2A10" stroke-width="3.5" stroke-linejoin="round"/>
      <path id="dd-spout" d="M247 58 l6 -7" stroke="#5C2A10" stroke-width="4" stroke-linecap="round"/>
      <path d="M212 80 q2 14 4 26" stroke="#FFE2C2" stroke-width="3" fill="none" opacity=".7" stroke-linecap="round"/>
      <circle cx="195" cy="154" r="15" fill="url(#dd-fur)" stroke="#7A4B2A" stroke-width="4"/>
      <path d="M186 150 q6 -4 12 0" stroke="#7A4B2A" stroke-width="3" fill="none" stroke-linecap="round"/>
    </g>
    <g class="dd-steam" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round" opacity=".85">
      <path d="M216 50 q-8 -10 0 -20 q8 -10 0 -20"/><path d="M232 46 q-6 -8 0 -16 q6 -8 0 -16"/>
    </g>
  </g>
</svg>`; }
        const DEDE_SVG = dedeSVG('kasket');
        const DEDE_IMG = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(DEDE_SVG);

