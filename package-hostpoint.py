from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED

root = Path(__file__).parent
output = root / 'output'
output.mkdir(exist_ok=True)
archive = output / 'ATLS-sito-nuovo-Hostpoint.zip'
with ZipFile(archive, 'w', ZIP_DEFLATED) as z:
    for p in sorted((root / 'dist').rglob('*')):
        if not p.is_file():
            continue
        name = p.relative_to(root / 'dist').as_posix()
        if name == 'config.js':
            text = p.read_text(encoding='utf-8').replace("emailMode: 'compose'", "emailMode: 'server'").replace("formEndpoint: ''", "formEndpoint: 'api/forms.php'")
            z.writestr(name, text)
        else:
            z.write(p, name)
    z.write(root / 'hosting/api/forms.php', 'api/forms.php')
print(archive)
