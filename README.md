# Kuglers Converter

Kuglers Converter ist eine selbst gehostete Web-App zur Konvertierung gaengiger Datei- und Datenformate. Die App stellt eine Next.js-Oberflaeche bereit und nutzt lokale Tools sowie Node-Adapter fuer die eigentliche Umwandlung.

## Ziel des Projekts

Das Projekt zeigt, wie eine eigene Converter-App mit Upload-Begrenzung, temporaerer Verarbeitung und mehreren Format-Adaptern aufgebaut werden kann. Die oeffentliche Repository-Version ist als Demo- und Portfolio-Projekt gedacht.

## Features

- Upload- und Konvertierungsworkflow ueber eine Web-Oberflaeche
- Bildkonvertierungen mit Sharp
- Dokumentkonvertierungen mit LibreOffice, Pandoc und Poppler
- Audio-/Video-Unterstuetzung ueber ffmpeg
- Archivformate mit 7z und tar
- Entwicklerformate wie JSON, YAML, XML, TOML, CSV und Base64
- Healthcheck-Endpunkt
- Dockerfile mit benoetigten Systemtools

## Tech Stack

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- Node.js
- Sharp
- ffmpeg
- LibreOffice
- Pandoc
- Docker

## Screenshots

Screenshots koennen vor der Veroeffentlichung in `docs/screenshots/` oder als GitHub-Repository-Medien ergaenzt werden.

## Lokale Installation

```bash
npm install
cp .env.example .env
npm run dev
```

Die Anwendung laeuft standardmaessig lokal ueber den Next.js-Entwicklungsserver.

## Environment Variables

Siehe `.env.example`. Die Datei enthaelt nur leere Beispielwerte.

| Variable | Zweck |
| --- | --- |
| `NEXT_PUBLIC_APP_URL` | oeffentliche Basis-URL der App |
| `MAX_UPLOAD_SIZE_MB` | serverseitiges Upload-Limit |
| `TEMP_DIR` | temporaeres Arbeitsverzeichnis |
| `NODE_ENV` | Laufzeitumgebung |

Echte Werte gehoeren nicht ins Repository.

## Development-Befehle

```bash
npm run dev
npm run lint
npm run typecheck
```

## Build-Befehle

```bash
npm run build
npm run start
```

## Docker-Setup

Eine neutrale Compose-Vorlage liegt in `docker-compose.example.yml`.

```bash
cp .env.example .env
cp docker-compose.example.yml docker-compose.yml
docker compose up -d --build
```

Produktive Compose- und Reverse-Proxy-Dateien sollten nicht veroeffentlicht werden.

## Projektstruktur

```text
src/app/         App Router, Seiten und API-Routen
src/components/  UI-Komponenten
src/lib/         Konverter, Validierung und Hilfsfunktionen
public/          statische Assets
```

## Roadmap

- weitere Adapter sauber kapseln
- Konvertierungsjobs optional in eine Queue auslagern
- Testdateien mit synthetischen Demo-Daten ergaenzen
- UI-Screenshots fuer GitHub dokumentieren
- Secret-Scanning in CI ergaenzen

## Sicherheitshinweise

Uploads duerfen nur temporaer verarbeitet werden. Keine Nutzerdaten, temporären Dateien, Logs, produktiven `.env`-Dateien oder Reverse-Proxy-Konfigurationen committen. Vor einer Veroeffentlichung sollten die Dateityp- und Groessenlimits nochmals manuell geprueft werden.

Weitere Hinweise stehen in `SECURITY.md`.

## Lizenz

Dieses Projekt steht unter der MIT License. Details siehe `LICENSE`.
