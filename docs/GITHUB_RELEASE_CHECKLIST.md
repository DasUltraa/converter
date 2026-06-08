# GitHub Release Checklist

Vor einer öffentlichen Veröffentlichung:

- `.env` darf nicht getrackt sein.
- produktive `docker-compose.yml` und Reverse-Proxy-Konfigurationen dürfen nicht getrackt sein.
- Uploads, temporäre Dateien, Logs und Konvertierungsartefakte dürfen nicht getrackt sein.
- `.env.example` muss leere Beispielwerte enthalten.
- Upload-Limit, Temp-Verzeichnis und Fehlermeldungen manuell prüfen.
- Nur neutrale Testdateien für Demos verwenden.

Empfohlene Checks:

```bash
git status --short
git ls-files | grep -E '(^|/)(\.env|.*\.log|uploads/|tmp/|docker-compose\.yml|deploy/)'
npm run lint
npm run typecheck
npm run build
```
