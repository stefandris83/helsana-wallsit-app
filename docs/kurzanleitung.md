# Kurzanleitung Wandsitz-Pilot

Diese Seite erklaert in einfachen Worten, wie die App benutzt wird. Technische Details stehen in
der [README](../README.md).

---

## Die beiden Adressen

| Wofuer | Adresse |
|---|---|
| Testpersonen | <https://stefandris83.github.io/helsana-wallsit-app/> |
| Projektteam (Auswertung) | <https://stefandris83.github.io/helsana-wallsit-app/admin> |

Die App laeuft im Browser. Es muss nichts installiert werden, weder App Store noch Konto.

---

## Fuer Testpersonen: in fuenf Schritten starten

1. **Adresse oeffnen** (oben die erste). Am besten auf dem Handy.
2. **Einladungscode eingeben**, zum Beispiel `WS-2026-A1B2`. Weitere Codes stehen in
   `src/data/access-codes.ts`.
3. **Punkte bestaetigen** (Teilnahme, Datenschutz, Hinweis zur medizinischen Beratung).
4. **Kurze Fragen beantworten**: Profil, Ausgangslage, Trainingstage, Motivation. Dauert wenige
   Minuten und richtet den persoenlichen Wochenplan ein.
5. **Trainieren**: auf «Heute» die Einheit starten. Die App fuehrt durch vier Wandsitze mit je
   zwei Minuten Pause dazwischen.

**Wichtig zu wissen:** Alle Angaben bleiben auf dem eigenen Geraet gespeichert. Wer die Seite auf
einem anderen Handy oeffnet, faengt bei null an.

---

## Fuer das Projektteam

**Team-Zugang.** Der Code `WS-2026-TEAM` schaltet zusaetzlich die Demodaten frei
(Einstellungen → Demodaten). Er ist nicht fuer Testpersonen gedacht.

**Dashboard.** Die zweite Adresse oben oeffnen und den Zugangscode eingeben. Im Deploy ist das
der erkennbare Demo-Wert `pilot-admin-demo`.

Das Dashboard zeigt nur zusammengefasste Zahlen — keine Namen, keine Kontaktangaben, keine
Freitexte. Aggregierte Werte erscheinen erst ab fuenf Personen; darunter erscheint ein Hinweis,
dass zu wenige Daten vorliegen. Um trotzdem etwas zu sehen, im Dashboard den Schalter
«Demodaten» aktivieren.

---

## Sauber neu starten

1. **Auf dem Geraet:** Einstellungen → Daten loeschen. Damit sind alle lokalen Angaben weg.
2. **In der Ablage:** abgelegte Ergebnisberichte von Hand in der Supabase-Oberflaeche loeschen
   (Storage → `berichte`). Die App selbst hat bewusst kein Loeschrecht.

Reihenfolge beachten: **zuerst** die Geraete leeren, **dann** die Dateien in der Ablage loeschen.
Sonst kann ein noch offenes Geraet gleich wieder einen Bericht hochladen.

---

## Grenzen dieser Version

- Die Seite ist **oeffentlich erreichbar**. Der Einladungscode ordnet nur eine Pilotnummer zu, er
  schuetzt nicht vor Zugriff.
- Der Dashboard-Code ist ein **Platzhalter**, kein echter Anmeldeschutz. Er ist im ausgelieferten
  JavaScript lesbar.
- Deshalb: **keine echten Personendaten eingeben.** Diese Auslieferung ist fuer Demonstration und
  internes Testen gedacht.
- Vor einem Pilot mit echten Teilnehmenden sind noch offen: Auftragsverarbeitungsvertrag mit dem
  Ablage-Betreiber, Loeschfristen fuer abgelegte Berichte und die Zustimmung des Helsana-
  Datenschutzes (siehe [`schnittstellen.md`](schnittstellen.md)).
