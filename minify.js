// HTML içindeki satır içi <script> ve <style> bloklarını esbuild ile küçültür (üst düzey adlar korunur)
const fs = require('fs');
const esbuild = require('/opt/npm-tools/node_modules/esbuild');
const [, , inp, out] = process.argv;
let html = fs.readFileSync(inp, 'utf8');
let js0 = 0, js1 = 0, css0 = 0, css1 = 0;
html = html.replace(/<script>([\s\S]*?)<\/script>/g, (m, code) => {
  if (code.includes('/*__THREE__*/') || code.trim().length < 50) return m;
  const r = esbuild.transformSync(code, { loader: 'js', minify: true, target: 'es2019', legalComments: 'none' });
  js0 += code.length; js1 += r.code.length;
  return '<script>' + r.code.replace(/<\/script/gi, '<\\/script') + '</script>';
});
html = html.replace(/<style>([\s\S]*?)<\/style>/g, (m, code) => {
  if (code.includes('/*__FONTS__*/') || code.trim().length < 50) return m;
  const r = esbuild.transformSync(code, { loader: 'css', minify: true, target: ['chrome90', 'safari14'] });
  css0 += code.length; css1 += r.code.length;
  return '<style>' + r.code + '</style>';
});
// gövdedeki girinti boşlukları
html = html.replace(/>\s*\n\s+</g, '>\n<');
fs.writeFileSync(out, html);
console.log(`js ${js0} -> ${js1}, css ${css0} -> ${css1}`);
