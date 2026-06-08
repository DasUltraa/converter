# Kuglers Converter

Kuglers Converter ist eine selbst gehostete Web-App zur Konvertierung gängiger Datei- und Datenformate. Die App stellt eine Next.js-Oberfläche bereit und nutzt lokale Tools sowie Node-Adapter für die eigentliche Umwandlung.

## Ziel des Projekts

Das Projekt zeigt, wie eine eigene Converter-App mit Upload-Begrenzung, temporärer Verarbeitung und mehreren Format-Adaptern aufgebaut werden kann. Die öffentliche Repository-Version ist als Demo- und Portfolio-Projekt gedacht.

## Features

- Upload- und Konvertierungsworkflow über eine Web-Oberfläche
- Bildkonvertierungen mit Sharp
- Dokumentkonvertierungen mit LibreOffice, Pandoc und Poppler
- Audio-/Video-Unterstützung über ffmpeg
- Archivformate mit 7z und tar
- Entwicklerformate wie JSON, YAML, XML, TOML, CSV und Base64
- Healthcheck-Endpunkt
- Dockerfile mit benötigten Systemtools

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

## Lokale Installation

```bash
npm install
cp .env.example .env
npm run dev
```

Die Anwendung läuft standardmäßig lokal über den Next.js-Entwicklungsserver.

## Environment Variables

Siehe `.env.example`. Die Datei enthält nur leere Beispielwerte.

| Variable | Zweck |
| --- | --- |
| `NEXT_PUBLIC_APP_URL` | öffentliche Basis-URL der App |
| `MAX_UPLOAD_SIZE_MB` | serverseitiges Upload-Limit |
| `TEMP_DIR` | temporäres Arbeitsverzeichnis |
| `NODE_ENV` | Laufzeitumgebung |

Echte Werte gehören nicht ins Repository.

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

Produktive Compose- und Reverse-Proxy-Dateien sollten nicht veröffentlicht werden.

## Projektstruktur

```text
src/app/         App Router, Seiten und API-Routen
src/components/  UI-Komponenten
src/lib/         Konverter, Validierung und Hilfsfunktionen
public/          statische Assets
```

## Sicherheitshinweise

Uploads dürfen nur temporär verarbeitet werden. Keine Nutzerdaten, temporären Dateien, Logs, produktiven `.env`-Dateien oder Reverse-Proxy-Konfigurationen committen. Vor einer Veröffentlichung sollten die Dateityp- und Größenlimits nochmals manuell geprüft werden.

Weitere Hinweise stehen in `SECURITY.md`.

## Lizenz

Dieses Projekt steht unter der MIT License. Details siehe `LICENSE`.
