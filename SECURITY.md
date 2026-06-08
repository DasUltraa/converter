# Security Policy

## Supported Use

Dieses Repository ist für eine bereinigte Demo- oder Portfolio-Version der Converter-App gedacht. Die App verarbeitet Uploads temporär und sollte ohne dauerhafte Speicherung von Nutzerdaten betrieben werden.

## Secrets

Committe keine `.env`-Dateien, produktiven Docker-Compose-Dateien, Caddy-Konfigurationen, Tokens, Zertifikate, privaten Schlüssel, Uploads, temporären Dateien oder Logs.

`.env.example` enthält nur leere Beispielwerte. Echte Werte gehören in die lokale `.env`, CI-Secrets oder die Hosting-Umgebung.

## Upload Safety

Betreibe die App mit Dateigrößenlimit, temporärem Arbeitsverzeichnis und regelmäßiger Bereinigung. Stelle sicher, dass Fehlermeldungen keine Dateiinhalte oder lokalen Pfade offenlegen.

## Reporting

Sicherheitsprobleme bitte privat an den Repository-Maintainer melden und keine produktiven Werte oder Beispieldateien mit sensiblen Inhalten weitergeben.
