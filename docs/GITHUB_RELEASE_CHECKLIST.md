# GitHub Release Checklist

Vor einer oeffentlichen Veroeffentlichung:

- `.env` darf nicht getrackt sein.
- produktive `docker-compose.yml` und Reverse-Proxy-Konfigurationen duerfen nicht getrackt sein.
- Uploads, temporaere Dateien, Logs und Konvertierungsartefakte duerfen nicht getrackt sein.
- `.env.example` muss leere Beispielwerte enthalten.
- Upload-Limit, Temp-Verzeichnis und Fehlermeldungen manuell pruefen.
- Nur synthetische Testdateien fuer Demos verwenden.

Empfohlene Checks:

```bash
git status --short
git ls-files | grep -E '(^|/)(\.env|.*\.log|uploads/|tmp/|docker-compose\.yml|deploy/)'
npm run lint
npm run typecheck
npm run build
```
