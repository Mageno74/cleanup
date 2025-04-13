# cleanup README

cleanup ist für Siemens Sinumerik 840D CNC Programme

## Usage

Befehlszeile öffnen (Windows -> STRG+Shift+P, macOS -> Umschalt+Command+P)

"nc_nummerieren" in die Befehlszeile schreiben und mit Enter Bestätigen --> NC_nummerieren

"nc_formatieren"  in die Befehlszeile schreiben und mit Enter Bestätigen --> NC_formatieren

"nc_kontrollieren" in die Befehlszeile schreiben und mit Enter Bestätigen --> NC_kontollieren

## Features

"NC_nummerieren" --> es nummeriert den CNC Code neu. Es beginnt mit z.b."N1000" und erhöht jede Zeile um 5

"NC_formatieren" --> orginale Zeilennummern bleiben erhalten. Zeilen ohne Nummer bekommen die Nummer N1111

"NC_kontrollieren" --> es wird nicht formatiert oder nummeriert

es werden Zeilen die nur eine Zeilennummer enthalten gelöscht

es werden Leerzeilen gelöscht, wenn mehr als eine Leerzeile in folge kommt

es werden Leerzeichen am Zeilenende gelöscht

Komentare nach einem ";" bleiben unverändert

es wird die Einrückung (0 - 5 Leerzeichen) bei IF/ENDIF/ELSE, WHILE/ENDWHILE, LOOP/ENDLOOP FOR/ENDFOR richtig gestellt

es wird überprüft ob IF/ENDIF/ELSE, WHILE/ENDWHILE, LOOP/ENDLOOP FOR/ENDFOR paarweise vorkommen

die Verschachtelung von IF/ENDIF/ELSE, WHILE/ENDWHILE, LOOP/ENDLOOP FOR/ENDFOR wird überprüft

es wird überprüft ob Klammern paarweise vorkommen

## Requirements

VSCode Version 1.90.0

## Extension Settings

Startnummer --> mit dieser Nummer startet die Nummerierung (z.B.:1000 --> N1000)

Schritt --> um diesen Wert wird die Zeilennummer erhöht (z.B.: 5 --> N1005)

Einrückung --> Anzahl der Leerzeichen für die Einrückung

Maximanle Anzahl an leeren Zeilen --> Legt fest wie viele leere Zeilen in Folge vorkommen dürfen

## Known Issues

alles auf eigene Gefahr

## Release Notes

## [v1.0.9] - 2024-11-28

### Added

- Befehl "NC_kontollieren" hinzu

## [v1.0.8] - 2024-07-28

### Fixed

## [v1.0.7] - 2024-07-28

### Fixed

- bei enem MultiArchiv wird nach jedem Programm abebrochen Falls ein Fehler gefunden wird

## [v1.0.6] - 2024-07-22

### Added

- Bei Kommentare mit Zeilennummern bleibt die Zeilennummer erhalten

### Change

- Befehl nc_nummerieren --> NC_nummerieren
- Befehl nc_formatieren --> NC_formatieren

## [v1.0.5] -

### Fixed

- Fehler bei IF Fehler in einem MultiArchiv

## [v1.0.4] - 2024-06-24

### Added

- Logo

## [v1.0.3] - 2024-06-23

### Fixed

- problem bei der Fehleranzeige wenn mehrere Dateien geöffnet sind

## [v1.0.2] - 2024-06-22

### Added

- Setting für maximale Anzahl an leeren Zeilen
- Funktion nur formatieren, ohne zu nummerieren

## [v1.0.1] - 2024-06-21

### Added

- Setting für Nummerierung und Einrückung

## [v1.0.0] - 2024-06-20

- Initial release
