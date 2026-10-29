        /* =====================================================
           KAHVE DEDE — çizim (SVG, koddan; dış görsel yok)
           ===================================================== */
        const DEDE_HATS = {"kasket": "  <!-- kasket -->\n  <path d=\"M58 76 Q64 30 122 30 Q178 32 184 72 Q150 58 120 60 Q86 60 58 76 Z\" fill=\"url(#dd-cap)\" stroke=\"#3E2A1C\" stroke-width=\"4\" stroke-linejoin=\"round\"/>\n  <path d=\"M60 74 Q100 50 170 62 Q196 66 206 80 Q170 74 140 74 Q96 74 60 80 Z\" fill=\"#6E5039\" stroke=\"#3E2A1C\" stroke-width=\"4\" stroke-linejoin=\"round\"/>\n  <g stroke=\"#A88A70\" stroke-width=\"2\" opacity=\".55\"><path d=\"M78 54 l10 -10 M96 46 l10 -10 M116 42 l10 -10 M136 42 l10 -10 M156 48 l10 -10\"/></g>\n  <circle cx=\"122\" cy=\"32\" r=\"5\" fill=\"#5E4330\" stroke=\"#3E2A1C\" stroke-width=\"2\"/>\n", "beret": "  <!-- bere -->\n  <path d=\"M56 76 Q52 42 112 34 Q182 28 190 66 Q150 58 118 60 Q84 62 56 76 Z\" fill=\"#2F6FB5\" stroke=\"#163E6B\" stroke-width=\"4\" stroke-linejoin=\"round\"/>\n  <path d=\"M58 74 Q120 54 190 66\" stroke=\"#9CC6F0\" stroke-width=\"5\" fill=\"none\" stroke-linecap=\"round\"/>\n  <path d=\"M118 34 q4 -12 12 -14\" stroke=\"#163E6B\" stroke-width=\"5\" fill=\"none\" stroke-linecap=\"round\"/>\n", "chef": "  <!-- aşçı şapkası -->\n  <g stroke=\"#B9B2A8\" stroke-width=\"4\" stroke-linejoin=\"round\">\n    <circle cx=\"86\" cy=\"34\" r=\"24\" fill=\"#FFFFFF\"/><circle cx=\"122\" cy=\"20\" r=\"28\" fill=\"#FFFFFF\"/><circle cx=\"158\" cy=\"34\" r=\"24\" fill=\"#FFFFFF\"/>\n    <path d=\"M66 46 Q120 30 178 46 L172 78 Q120 66 70 78 Z\" fill=\"#FFFFFF\"/>\n  </g>\n  <path d=\"M70 70 Q120 58 172 70\" stroke=\"#E7DFD2\" stroke-width=\"5\" fill=\"none\"/>\n", "crown": "  <!-- taç -->\n  <path d=\"M64 74 L60 30 L88 52 L120 18 L152 52 L180 30 L176 74 Q120 62 64 74 Z\" fill=\"#F2C25A\" stroke=\"#8A5A10\" stroke-width=\"4\" stroke-linejoin=\"round\"/>\n  <circle cx=\"60\" cy=\"28\" r=\"7\" fill=\"#FFE27A\" stroke=\"#8A5A10\" stroke-width=\"3\"/><circle cx=\"120\" cy=\"16\" r=\"8\" fill=\"#FFE27A\" stroke=\"#8A5A10\" stroke-width=\"3\"/><circle cx=\"180\" cy=\"28\" r=\"7\" fill=\"#FFE27A\" stroke=\"#8A5A10\" stroke-width=\"3\"/>\n  <circle cx=\"92\" cy=\"62\" r=\"6\" fill=\"#E63946\"/><circle cx=\"120\" cy=\"58\" r=\"7\" fill=\"#2F7FD8\"/><circle cx=\"148\" cy=\"62\" r=\"6\" fill=\"#3FA34D\"/>\n", "witch": "  <!-- cadı şapkası -->\n  <path d=\"M84 62 Q100 30 116 10 Q128 -6 150 -2 Q132 10 138 34 Q142 50 160 62 Z\" fill=\"#4B2466\" stroke=\"#1F0F2B\" stroke-width=\"4\" stroke-linejoin=\"round\"/>\n  <ellipse cx=\"120\" cy=\"66\" rx=\"80\" ry=\"16\" fill=\"#3A1A4F\" stroke=\"#1F0F2B\" stroke-width=\"4\"/>\n  <path d=\"M88 58 Q122 50 158 58 L160 66 Q122 58 86 66 Z\" fill=\"#FF8A1E\" stroke=\"#1F0F2B\" stroke-width=\"2.5\"/>\n  <rect x=\"114\" y=\"52\" width=\"14\" height=\"14\" rx=\"2\" fill=\"#FFD27A\" stroke=\"#1F0F2B\" stroke-width=\"2.5\"/>\n"};
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

