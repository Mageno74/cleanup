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

keine

## Extension Settings

Startnummer --> mit dieser Nummer startet die Nummerierung (z.B.:1000 --> N1000)

Schritt --> um diesen Wert wird die Zeilennummer erhöht (z.B.: 5 --> N1005)

Einrückung --> Anzahl der Leerzeichen für die Einrückung

Maximanle Anzahl an leeren Zeilen --> Legt fest wie viele leere Zeilen in Folge vorkommen dürfen


## Known Issues

alles auf eigene Gefahr

## Release Notes
version 1.0.3
--- Fehleranzeige verbessert

version 1.0.2
--- Setting für maximale Anzahl an leeren Zeilen
--- "onlyFormat" hinzu

version 1.0.1
--- Setting für Nummerierung und Einrückung hinzu

version 1.0.0 
--- Veröffentlichung


