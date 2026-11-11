# Çalışma klasörünü (work) bir git deposuna kopyalar: kaynaklar + derlenmiş oyun. Kullanım: python3 tools/sync_repo.py <repo_klasörü>
import os, sys, shutil
W = os.path.dirname(os.path.dirname(os.path.abspath(__file__))); R = sys.argv[1]
KEEP = {'.git'}
for f in os.listdir(R):
    if f in KEEP: continue
    p = os.path.join(R, f); shutil.rmtree(p) if os.path.isdir(p) and not os.path.islink(p) else os.remove(p)
ign = shutil.ignore_patterns('*_backup*', '*_pre_*', 'lang_packs.js', '__pycache__', 'node_modules', '*.pyc')
for d in ['v5', 'legal', 'android_src', 'sym', 'fonts', 'tools']: shutil.copytree(f'{W}/{d}', f'{R}/{d}', ignore=ign)
shutil.copytree(f'{W}/out/server', f'{R}/server', ignore=ign)
for f in ['engine.js', 'version.json', 'template_v4_final.html', 'build.py', 'minify.js', 'stub.js', 'vendor_three_r128.min.js', 'bg_a.jpg', 'bg_b.jpg', 'CLAUDE.md', 'README.md', 'CHANGELOG.md']:
    if os.path.exists(f'{W}/{f}'): shutil.copy(f'{W}/{f}', f'{R}/{f}')
shutil.copy(f'{W}/out/recipes_of_barista_3d_deluxe.html', f'{R}/recipes_of_barista_3d_deluxe.html')
open(f'{R}/.gitignore', 'w').write('out/\nbuild_cache/\ntemplate.html\nfirebase_config.json\nnode_modules/\nv5/lang_packs.js\n__pycache__/\n')
print('synced ->', R)
