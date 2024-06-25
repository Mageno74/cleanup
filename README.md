# cleanup README

cleanup ist für Siemens Sinumerik 840D CNC Programme

## Usage

Befehlszeile öffnen (Windows -> STRG+Shift+P, macOS -> Umschalt+Command+P)

"cleanup" in die Befehlszeile schreiben und mit Enter Bestätigen

"onlyFormat"  in die Befehlszeile schreiben und mit Enter Bestätigen

## Features
"onlyFormat" --> orginale Zeilennummern bleiben erhalten. Zeilen ohne Nummer bekommen die Nummer N1111

"cleanup" --> es nummeriert den CNC Code neu. Es beginnt mit "N1000" und erhöht jede Zeile um 5

es werden Zeilen die nur eine Zeilennummer enthalten gelöscht

es werden Leerzeilen gelöscht, wenn mehr als eine Leerzeile in folge kommt

es werden Leerzeichen am Zeilenende gelöscht

Komentare nach einem ";" bleiben unverändert

es wird die Einrückung (2 Leerzeichen) bei IF/ENDIF/ELSE, WHILE/ENDWHILE, LOOP/ENDLOOP richtig gestellt

es wird überprüft ob IF/ENDIF/ELSE, WHILE/ENDWHILE, LOOP/ENDLOOP paarweise vorkommen

die Verschachtelung von IF/ENDIF/ELSE, WHILE/ENDWHILE, LOOP/ENDLOOP wird überprüft

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


