# Security Policy

## Supported Use

Dieses Repository ist fuer eine bereinigte Demo- oder Portfolio-Version der Converter-App gedacht. Die App verarbeitet Uploads temporaer und sollte ohne dauerhafte Speicherung von Nutzerdaten betrieben werden.

## Secrets

Committe keine `.env`-Dateien, produktiven Docker-Compose-Dateien, Caddy-Konfigurationen, Tokens, Zertifikate, privaten Schluessel, Uploads, temporaeren Dateien oder Logs.

`.env.example` enthaelt nur leere Beispielwerte. Echte Werte gehoeren in die lokale `.env`, CI-Secrets oder die Hosting-Umgebung.

## Upload Safety

Betreibe die App mit Dateigroessenlimit, temporaerem Arbeitsverzeichnis und regelmaessiger Bereinigung. Stelle sicher, dass Fehlermeldungen keine Dateiinhalte oder lokalen Pfade offenlegen.

## Reporting

Sicherheitsprobleme bitte privat an den Repository-Maintainer melden und keine produktiven Werte oder Beispieldateien mit sensiblen Inhalten weitergeben.
