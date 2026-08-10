# Helsana Design System «Unify» – Entwickler-Spezifikation

> Quelle Foundations: Figma `💠 Unify – 🎨 Styles & Assets` (fileKey `KSBYcbxHL2anWuXKGZ6jtm`)
> Quelle Komponenten: Figma `💠 Unify – 🧱 Core Components` (fileKey `FdDnzKBAvua0vvJr4AY6Lf`)
> Stand: 30.07.2026

---

## 1. Grundregeln (nicht verhandelbar)

1. **Token-Hierarchie:** `1 Primitives` → `2 Semantic Colors` → Komponente.
   Im UI-Code werden **ausschliesslich Semantic Tokens** verwendet. Primitives (`brand-500`, `neutral-300`, …) dürfen nur in der Token-Definitionsdatei vorkommen.
2. **Vier Farbmodi:** `light`, `light-hc` (High Contrast), `dark`, `dark-hc`. Jede App muss mindestens `light` + `dark` unterstützen; HC-Modi sind für Accessibility-Anforderungen vorgesehen.
3. **Ein Font:** `Akkurat Helsana` in Light (300), Regular (400), Bold (700). Keine anderen Schriften, keine anderen Schnitte.
4. **Ecken sind fast eckig:** Default-Radius ist **2 px**, Cards 4 px. Keine „pill“-Buttons ausser explizit `border-radius-full`.
5. **Spacing nur aus der Skala** (Tiernamen-Tokens). Keine krummen Werte.
6. **Icons:** Material Symbols **Rounded**, Grössen 16/24/32 px, Farbe immer über `text-*`-Token.

---

## 2. Farb-Primitives

### 2.1 Basic
| Token | HEX |
|---|---|
| `basic-black` | `#000000` |
| `basic-white` | `#FFFFFF` |

### 2.2 Neutral
| Token | HEX |
|---|---|
| `neutral-100` | `#F8F8F8` |
| `neutral-200` | `#F2F2F2` |
| `neutral-300` | `#E0E0E0` |
| `neutral-400` | `#B2B2B2` |
| `neutral-500` | `#949494` |
| `neutral-600` | `#707070` |
| `neutral-700` | `#404040` |
| `neutral-800` | `#202020` |

### 2.3 Brand (Helsana-Rot)
| Token | HEX |
|---|---|
| `brand-100` | `#EBCED9` |
| `brand-200` | `#D79DB3` |
| `brand-300` | `#C2587F` |
| `brand-400` | `#AD0B49` |
| **`brand-500`** | **`#9A0941`** ← Markenfarbe |
| `brand-600` | `#7D1C3A` |
| `brand-700` | `#6D062E` |
| `brand-800` | `#550524` |

### 2.4 Pink (Sekundärfarbe)
| Token | HEX |
|---|---|
| `pink-100` | `#FAE5EC` |
| `pink-200` | `#F6CADB` |
| `pink-300` | `#EF96B6` |
| `pink-400` | `#E55086` |
| `pink-500` | `#F20D78` |
| `pink-600` | `#DF006D` |
| `pink-700` | `#B8005A` |
| `pink-800` | `#98034D` |

### 2.5 Purple
| Token | HEX |
|---|---|
| `purple-100` | `#EEECF7` |
| `purple-200` | `#DED9EF` |
| `purple-300` | `#BDB3DD` |
| `purple-400` | `#9181C6` |
| `purple-500` | `#7E6CBC` |
| `purple-600` | `#5D45B0` |
| `purple-700` | `#463484` |
| `purple-800` | `#3A3255` |

### 2.6 Blue
| Token | HEX |
|---|---|
| `blue-100` | `#E6F3FB` |
| `blue-200` | `#D0E7F5` |
| `blue-300` | `#A1CEEC` |
| `blue-400` | `#62AEDF` |
| `blue-500` | `#409DD8` |
| `blue-600` | `#2887C3` |
| `blue-700` | `#1F6694` |
| `blue-800` | `#0D4D77` |

### 2.7 Yellow
| Token | HEX |
|---|---|
| `yellow-100` | `#FFF6D9` |
| `yellow-200` | `#FFEEB2` |
| `yellow-300` | `#FEDD66` |
| `yellow-400` | `#FEC600` |
| `yellow-500` | `#E5B300` |
| `yellow-600` | `#B48D00` |
| `yellow-700` | `#8C6D00` |
| `yellow-800` | `#5F4911` |

### 2.8 Green (dekorativ)
| Token | HEX |
|---|---|
| `green-100` | `#F2F7E0` |
| `green-200` | `#E9EFC1` |
| `green-300` | `#D3DF82` |
| `green-400` | `#B6CA2F` |
| `green-500` | `#A4B62A` |
| `green-600` | `#66801A` |
| `green-700` | `#4A6317` |
| `green-800` | `#344B11` |

### 2.9 Ecru
| Token | HEX |
|---|---|
| `ecru-100` | `#F5F2ED` |
| `ecru-200` | `#ECE5DB` |
| `ecru-300` | `#D8CAB6` |
| `ecru-400` | `#BEA786` |
| `ecru-500` | `#B49A74` |
| `ecru-600` | `#866548` |
| `ecru-700` | `#5C4337` |
| `ecru-800` | `#503B33` |

### 2.10 Status Red / Status Green (nur für Statusfarben!)
| Token | HEX | | Token | HEX |
|---|---|---|---|---|
| `status-red-100` | `#FFE4E1` | | `status-green-100` | `#EFFBDC` |
| `status-red-200` | `#FFC8C1` | | `status-green-200` | `#DAF2B2` |
| `status-red-300` | `#FFAA99` | | `status-green-300` | `#BBE96E` |
| `status-red-400` | `#FF715F` | | `status-green-400` | `#92DA00` |
| `status-red-500` | `#FF4D37` | | `status-green-500` | `#72BE00` |
| `status-red-600` | `#EB2C14` | | `status-green-600` | `#5E9801` |
| `status-red-700` | `#A41200` | | `status-green-700` | `#3C6A00` |
| `status-red-800` | `#7E1205` | | `status-green-800` | `#2C4F00` |

### 2.11 Transparency
| Token | HEX (8-stellig) |
|---|---|
| `black-opacity-60` | `#00000099` |
| `black-opacity-80` | `#000000CC` |
| `white-opacity-60` | `#FFFFFF99` |
| `white-opacity-80` | `#FFFFFFCC` |

### 2.12 Gradients
| Token | Definition |
|---|---|
| `gradient-blue-red` | `blue-500 (#409DD8)` → `brand-400 (#AD0B49)` |
| `gradient-red-purple` | `brand-400 (#AD0B49)` → `purple-400 (#9181C6)` → `purple-600 (#5D45B0)` |

---

## 3. Semantic Colors (das, was du im Code benutzt)

Legende: L = Light · L-HC = Light High Contrast · D = Dark · D-HC = Dark High Contrast

### 3.1 Text
| Token | L | L-HC | D | D-HC | Verwendung |
|---|---|---|---|---|---|
| `text-primary` | neutral-800 | neutral-800 | basic-white | basic-white | Standardtext, Headlines |
| `text-secondary` | neutral-600 | neutral-700 | neutral-400 | neutral-300 | Sekundärtext, Captions |
| `text-tertiary` | neutral-500 | neutral-500 | neutral-500 | neutral-400 | **Placeholder-Text** |
| `text-disabled` | neutral-400 | neutral-400 | neutral-600 | neutral-600 | deaktivierter Text |
| `text-brand` | brand-500 | brand-500 | brand-300 | pink-300 | Markentext, Textlinks |
| `text-decorative` | purple-500 | purple-500 | purple-400 | purple-300 | dekorative Akzenttexte |
| `text-nav-selected` | brand-500 | brand-500 | basic-white | basic-white | aktiver Nav-Eintrag |
| `text-on-colored-bg` | basic-white | basic-white | basic-white | basic-white | Text auf Brand-/Farbflächen |
| `text-on-interactive-primary` | basic-white | basic-white | basic-white | basic-black | Label auf Primary-Button |
| `text-on-interactive-disabled` | neutral-400 | neutral-400 | neutral-500 | neutral-500 | Label auf Disabled-Button |

### 3.2 Interactive
| Token | L | L-HC | D | D-HC | Verwendung |
|---|---|---|---|---|---|
| `interactive-primary` | brand-500 | brand-500 | pink-500 | pink-300 | Primary-Button-Fläche, aktive Controls |
| `interactive-primary-hover` | brand-400 | brand-400 | pink-600 | pink-200 | Hover/Pressed |
| `interactive-secondary` | pink-500 | pink-500 | pink-500 | pink-500 | sekundäre Interaktion |
| `interactive-disabled` | neutral-300 | neutral-300 | neutral-700 | neutral-700 | deaktivierte Fläche |
| `interactive-primary-on-colored-bg` | basic-white | basic-white | basic-white | basic-white | Button auf Brand-Fläche |
| `interactive-primary-on-colored-bg-hover` | brand-100 | brand-100 | brand-100 | brand-100 | dito, Hover |
| `interactive-disabled-on-colored-bg` | neutral-800 | neutral-800 | neutral-800 | neutral-800 | dito, disabled |

### 3.3 Background
| Token | L | L-HC | D | D-HC | Verwendung |
|---|---|---|---|---|---|
| `background-device` | basic-white | basic-white | basic-black | basic-black | App-/Seiten-Hintergrund |
| `background-card` | basic-white | basic-white | neutral-800 | neutral-800 | Cards, Panels, Sheets |
| `background-subtle-neutral` | neutral-100 | neutral-100 | neutral-800 | neutral-800 | dezente Flächen (ehem. „grauweiss“) |
| `background-medium-neutral` | neutral-200 | neutral-200 | neutral-700 | neutral-700 | stärker abgesetzte Flächen (ehem. „orbit“) |
| `background-brand` | brand-500 | brand-500 | brand-400 | brand-400 | Brand-Flächen / Header |
| `background-hover` | neutral-200 | neutral-300 | neutral-800 | neutral-800 | Hover auf Listen/Rows |
| `background-decorative-light` | purple-100 | purple-100 | purple-800 | purple-800 | dekorativer Sektionshintergrund |
| `background-overlay` | black-opacity-60 | black-opacity-60 | black-opacity-60 | black-opacity-60 | Modal-Scrim |
| `background-overlay-darker` | black-opacity-80 | black-opacity-80 | black-opacity-80 | black-opacity-80 | starker Scrim |
| `background-white-overlay` | white-opacity-60 | white-opacity-60 | white-opacity-60 | white-opacity-60 | heller Scrim |
| `background-white-overlay-darker` | white-opacity-80 | white-opacity-80 | white-opacity-80 | white-opacity-80 | dito, stärker |

### 3.4 Border
| Token | L | L-HC | D | D-HC | Verwendung |
|---|---|---|---|---|---|
| `border` | neutral-500 | neutral-700 | neutral-500 | neutral-400 | Standardrahmen (Inputs) |
| `border-light` | neutral-300 | neutral-300 | neutral-600 | neutral-600 | Divider, dezente Linien |
| `border-focus` | neutral-800 | neutral-800 | neutral-100 | neutral-100 | **Fokus-Ring** |
| `border-focus-width` | 1 px | 1 px | 1 px | 1 px | Breite des Fokus-Rings (modusunabhängig) |
| `border-card` | neutral-300 | neutral-300 | neutral-800 | neutral-800 | Card-Rahmen |
| `border-on-colored-bg` | neutral-100 | neutral-100 | neutral-100 | neutral-100 | Rahmen auf Brand-Fläche |

### 3.5 Constant (modusunabhängig)
| Token | Wert | Verwendung |
|---|---|---|
| `constant-black` | neutral-800 `#202020` | Elemente, die nie invertieren |
| `constant-white` | basic-white `#FFFFFF` | dito |

### 3.6 Status
| Token | L | L-HC | D | D-HC |
|---|---|---|---|---|
| `status-info` | blue-500 | blue-500 | blue-400 | blue-400 |
| `status-success` | status-green-600 | status-green-600 | status-green-600 | status-green-500 |
| `status-warning` | yellow-400 | yellow-400 | yellow-400 | yellow-400 |
| `status-error` | status-red-500 | status-red-500 | status-red-500 | status-red-500 |
| `status-notification` | pink-600 | pink-800 | pink-600 | pink-300 |
| `status-text-info` | blue-700 | blue-800 | blue-400 | blue-300 |
| `status-text-success` | status-green-700 | status-green-800 | status-green-500 | status-green-400 |
| `status-text-warning` | yellow-700 | yellow-800 | yellow-400 | yellow-300 |
| `status-text-error` | status-red-700 | status-red-800 | status-red-400 | status-red-300 |
| `status-light-bg-info` | blue-100 | blue-100 | blue-800 | blue-800 |
| `status-light-bg-success` | status-green-100 | status-green-100 | status-green-800 | status-green-800 |
| `status-light-bg-warning` | yellow-100 | yellow-100 | yellow-800 | yellow-800 |
| `status-light-bg-error` | status-red-100 | status-red-100 | status-red-800 | status-red-800 |
| `status-text-info-on-light-bg` | blue-800 | blue-800 | blue-100 | blue-100 |
| `status-text-success-on-light-bg` | status-green-700 | status-green-800 | status-green-100 | status-green-100 |
| `status-text-warning-on-light-bg` | yellow-800 | yellow-800 | yellow-100 | yellow-100 |
| `status-text-error-on-light-bg` | status-red-800 | status-red-800 | status-red-100 | status-red-100 |

**Regel Status-Banner:** Fläche = `status-light-bg-*`, Text darauf = `status-text-*-on-light-bg`, Icon = `status-*`.

### 3.7 Decorative
Muster pro Farbe: `-light` (Fläche hell) · `-medium` · `-` (Basis) · `-darker`.

| Farbe | `-light` L / D | `-medium` | Basis | `-darker` |
|---|---|---|---|---|
| pink | pink-100 / pink-200 | pink-200 | pink-400 | pink-500 |
| purple | purple-100 / purple-200 | purple-200 | purple-400 | purple-500 |
| blue | blue-100 / blue-200 | blue-200 | blue-400 | blue-500 |
| yellow | yellow-100 / yellow-200 | yellow-200 | yellow-400 | yellow-500 |
| green | green-100 / green-200 | green-200 | green-400 | green-500 |
| ecru | ecru-100 / ecru-200 | ecru-200 | ecru-400 | ecru-500 |

> `-medium`, Basis und `-darker` sind in allen vier Modi identisch. Nur `-light` wechselt in Dark auf die `-200`-Stufe.
> Bekannte Inkonsistenz im Figma: `decorative-purple-medium` referenziert im Light-HC-Modus `pink-200` – als `purple-200` implementieren.

---

## 4. Typografie

### 4.1 Font
```
font-family: "Akkurat Helsana", "Helvetica Neue", Arial, sans-serif;
```
Gewichte: **Light = 300**, **Regular = 400**, **Bold = 700**.
`font-family-headlines` und `font-family-body` sind beide `Akkurat Helsana`.

### 4.2 Headlines (Desktop / Mobile)
| Token | Weight | Desktop | Mobile |
|---|---|---|---|
| `h1` | Light 300 | 44 px / 120 % (52.8) | 32 px / 125 % (40) |
| `h2` | Bold 700 | 32 px / 125 % (40) | 28 px / 125 % (35) |
| `h3` | Light 300 | 28 px / 125 % (35) | 24 px / 125 % (30) |
| `h4` | Regular 400 | 24 px / 135 % (32.4) | 20 px / 135 % (27) |
| `h5` | Bold 700 | 20 px / 135 % (27) | 18 px / 135 % (24.3) |

> `h2` wird u. a. für Preise verwendet, `h4` auch für Quotes/Zitate.

### 4.3 Body (Desktop & Mobile identisch)
| Token | Weight | Size / Line-height |
|---|---|---|
| `body-l` | Regular 400 | 18 px / 140 % (25.2) |
| `body-l-bold` | Bold 700 | 18 px / 140 % (25.2) |
| `body-m` | Regular 400 | 16 px / 140 % (22.4) |
| `body-m-bold` | Bold 700 | 16 px / 140 % (22.4) |
| `body-m-copy` | Regular 400 | 16 px / **150 %** (24) — für lange Zeilenlängen (Fliesstext volle Breite) |
| `body-s` | Regular 400 | 14 px / 140 % (19.6) |
| `body-s-bold` | Bold 700 | 14 px / 140 % (19.6) |

### 4.4 Specific
| Token | Weight | Desktop | Mobile | Hinweis |
|---|---|---|---|---|
| `lead` | Light 300 | 22 px / 140 % (30.8) | 20 px / 140 % (28) | Lead-/Introtext |
| `nav` | Light 300 | 20 px / 140 % (28) | 32 px / **125 %** (40) | nur Header-Navigation |

> Achtung: `nav` ist der einzige Token, dessen Mobile-Zeilenhöhe **nicht** 140 % ist. Verifiziert an `Header 2629:4395` (`Specific/nav-size: 32`, `Specific/nav-line-height: 40`).

### 4.5 Helper (Desktop & Mobile identisch)
| Token | Weight | Size / Line-height |
|---|---|---|
| `helper-m` | Regular 400 | 12 px / 140 % (16.8) |
| `helper-m-bold` | Bold 700 | 12 px / 140 % (16.8) |
| `helper-s` | Regular 400 | 10 px / 140 % (14) |
| `helper-s-bold` | Bold 700 | 10 px / 140 % (14) |

### 4.6 Display (nur Helsana+ / grosse Zahlen)
| Token | Weight | Size / Line-height |
|---|---|---|
| `display-l` | Light 300 | 72 px / 120 % |
| `display-m` | Light 300 | 48 px / 120 % |
| `display-s` | Light 300 | 44 px / 120 % |

**Breakpoint-Konvention für Typo:** Mobile-Werte < 768 px, Desktop-Werte ≥ 768 px (Tablet nutzt Desktop-Typo). Letter-spacing überall `0`.

---

## 5. Spacing

Basis: `1rem = 16px`. Tokennamen sind Tiernamen (Grösse steigend).

| Token | px | rem |
|---|---|---|
| `space-none` | 0 | 0 |
| `space-ant` | 2 | 0.125 |
| `space-bee` | 4 | 0.25 |
| `space-snail` | 8 | 0.5 |
| `space-frog` | 12 | 0.75 |
| `space-rat` | 16 | 1 |
| `space-chicken` | 20 | 1.25 |
| `space-cat` | 24 | 1.5 |
| `space-dog` | 32 | 2 |
| `space-donkey` | 40 | 2.5 |
| `space-gorilla` | 48 | 3 |
| `space-lion` | 56 | 3.5 |
| `space-grizzly` | 64 | 4 |
| `space-rhino` | 80 | 5 |
| `space-elephant` | 96 | 6 |

> Grössere Abstände (112–384 px) sind in der Spec dokumentiert, aber **nicht tokenisiert** – als Vielfache von 16 px als Layout-Werte setzen.

---

## 6. Borders

### 6.1 Border Radius
| Token | Wert | Verwendung |
|---|---|---|
| `border-radius-0px` | 0 | flächige Elemente |
| **`border-radius-2px`** | 2 | **Default** – Buttons, Input Fields usw. |
| `border-radius-4px` | 4 | grössere Elemente, z. B. Cards |
| `border-radius-6px` | 6 | |
| `border-radius-8px` | 8 | iOS-26-Kontexte |
| `border-radius-16px` | 16 | iOS-26-Kontexte |
| `border-radius-full` | 9999 | Avatare, Pills, Badges |

### 6.2 Border Width
| Token | Wert | Verwendung |
|---|---|---|
| `border-width-none` | 0 | |
| `border-width-s` | 1 | Default für Input Fields usw. |
| `border-width-m` | 2 | Button Secondary Border, Input Border Active |
| `border-width-l` | 4 | Button Secondary Border Focus |

---

## 7. Shadows & Effects

| Token | CSS `box-shadow` | Verwendung |
|---|---|---|
| `shadow-s` | `0px 1px 4px 0px rgba(0,0,0,0.16)` | leichte Erhebung |
| `shadow-m` | `1px 6px 20px -8px rgba(0,0,0,0.12)` | Cards |
| `shadow-m-hover` | `1px 12px 24px -12px rgba(0,0,0,0.32)` | Card-Hover |
| `shadow-l` | `0px 4px 32px -8px rgba(0,0,0,0.16)` | Overlays, grosse/screenfüllende Elemente |
| `shadow-l-hover` | `0px 8px 40px -12px rgba(0,0,0,0.32)` | dito, Hover |
| `shadow-border` | `0px 12px 16px -8px rgba(0,0,0,0.16)` | rahmenersetzende Kante |

---

## 8. Grid & Layout

| Breakpoint | Viewport | Seiten-Margin | Gutter | Container min-width |
|---|---|---|---|---|
| **Mobile** | 375 – 767 px (min-height 812) | 16 px | 16 px | 343 px |
| **Tablet** | 768 – 1023 px (min-height 900) | 32 px | 16 px | 704 px |
| **Desktop** | ≥ 1024 px (min-height 1024) | 40 px | 16 px | 1024 px |

- **Design-/Referenzbreite Desktop: 1280 px.**
- Container ist zentriert, wächst bis `100vw − 2 × Margin`.
- Card-Raster auf Desktop: **3 Spalten** (Stand 04.03.26, angeglichen an helsana.ch – vorher 4).

```css
--breakpoint-mobile: 375px;
--breakpoint-tablet: 768px;
--breakpoint-desktop: 1024px;
--layout-max-width: 1280px;
--layout-margin-mobile: 16px;
--layout-margin-tablet: 32px;
--layout-margin-desktop: 40px;
--layout-gutter: 16px;
```

---

## 9. Assets

### 9.1 UI-Icons
- Basis: **Material Symbols, Style „Rounded"**, ggf. „Fill" aktiviert.
- Grössen-Set: **16 / 24 / 32 px** (Quelle: 24 px SVG).
- Benennung: englisch, `lowercase`, Wortteile mit **Bindestrich** getrennt. Bei einigen Icons ist der State mit **doppeltem Bindestrich** abgetrennt (z. B. `visibility--off`), bei anderen mit einfachem (`visibility-off`) – die Figma-Bibliothek ist an dieser Stelle uneinheitlich. Im Code auf **eine** Schreibweise normalisieren und beim Import mappen.
- Standardfarbe: `text-primary` (via `currentColor` / `fill`).
- Alle Icons: gleiche optische Grösse, gleiche Strichstärke.
- Vorhandene Icons u. a.: `add`, `add_circle`, `alert-circle`, `arrow-up/down/left/right`, `attachment`, `bar-chart`, `bill(s)`, `calendar`, `cancel-circle`, `card`, `chat`, `check-circle`, `checkmark`, `chevron-up/down/left/right`, `clock`, `close`, `cloud-offline`, `copy`, `delete`, `direction`, `document(s)`, `download`, `duplicate`, `edit`, `edit-square`, `expand`, `external_link`, `favorite`, `filter`, `fullscreen`, `fullscreen exit`, `gift`, `health`, `home`, `hourglass`, `info-circle`, `learn`, `lightbulb`, `list view`, `location`, `login`, `logout`, `loop`, `mark-as-read`, `mark-as-unread`, `menu`, `menu-book`, `message`, `minimize`, `money-in`, `more-horizontal`, `more-vertical`, `notification`, `offer`, `passkey`, `pdf`, `pendency`, `phone`, `photo-camera`, `placeholder`, `play`, `refresh`, `reload`, `replay`, `restart`, `scan(s)`, `search`, `send`, `settings`, `share ios`, `share android`, `sort`, `sort-ascending`, `sort-descending`, `sort-down`, `star`, `system-update`, `thumbs up`, `thumbs down`, `timer`, `trophy`, `upload`, `user`, `visibility`, `visibility-off`, `warning`.

### 9.2 Piktogramme
- Illustrative, detailliertere Symbole (deutsche Benennung, z. B. `arznei`, `freie-arztwahl`, `zahnaerztliche-behandlung`, `betriebliches-gesundheits-management`).
- Einheitliche optische Grösse; Strichstärke darf variieren.
- Aufbau: eine geflattete Vektorebene namens `Vektor`, Constraints H+V = `Scale`, Farbe `text-primary`.

### 9.3 Social Media Icons
`facebook`, `google-plus`, `insta`, `linkedin`, `x`, `xing`, `youtube`

### 9.4 Logos
`Helsana-Logo`, `Logo-MyHelsana`, `Logo-HelsanaPlus`, `Logo-Coach`, `Logo-Helsana-Favicon`
→ Immer das offizielle Logo-Asset (SVG) verwenden, **nie** als Text nachbauen.

---

## 10. CSS-Implementierung (copy-paste-fähig)

### 10.1 Primitives + Foundations
```css
:root {
  /* ===== Basic ===== */
  --basic-black:#000000;   --basic-white:#FFFFFF;

  /* ===== Neutral ===== */
  --neutral-100:#F8F8F8; --neutral-200:#F2F2F2; --neutral-300:#E0E0E0; --neutral-400:#B2B2B2;
  --neutral-500:#949494; --neutral-600:#707070; --neutral-700:#404040; --neutral-800:#202020;

  /* ===== Brand ===== */
  --brand-100:#EBCED9; --brand-200:#D79DB3; --brand-300:#C2587F; --brand-400:#AD0B49;
  --brand-500:#9A0941; --brand-600:#7D1C3A; --brand-700:#6D062E; --brand-800:#550524;

  /* ===== Pink ===== */
  --pink-100:#FAE5EC; --pink-200:#F6CADB; --pink-300:#EF96B6; --pink-400:#E55086;
  --pink-500:#F20D78; --pink-600:#DF006D; --pink-700:#B8005A; --pink-800:#98034D;

  /* ===== Purple ===== */
  --purple-100:#EEECF7; --purple-200:#DED9EF; --purple-300:#BDB3DD; --purple-400:#9181C6;
  --purple-500:#7E6CBC; --purple-600:#5D45B0; --purple-700:#463484; --purple-800:#3A3255;

  /* ===== Blue ===== */
  --blue-100:#E6F3FB; --blue-200:#D0E7F5; --blue-300:#A1CEEC; --blue-400:#62AEDF;
  --blue-500:#409DD8; --blue-600:#2887C3; --blue-700:#1F6694; --blue-800:#0D4D77;

  /* ===== Yellow ===== */
  --yellow-100:#FFF6D9; --yellow-200:#FFEEB2; --yellow-300:#FEDD66; --yellow-400:#FEC600;
  --yellow-500:#E5B300; --yellow-600:#B48D00; --yellow-700:#8C6D00; --yellow-800:#5F4911;

  /* ===== Green ===== */
  --green-100:#F2F7E0; --green-200:#E9EFC1; --green-300:#D3DF82; --green-400:#B6CA2F;
  --green-500:#A4B62A; --green-600:#66801A; --green-700:#4A6317; --green-800:#344B11;

  /* ===== Ecru ===== */
  --ecru-100:#F5F2ED; --ecru-200:#ECE5DB; --ecru-300:#D8CAB6; --ecru-400:#BEA786;
  --ecru-500:#B49A74; --ecru-600:#866548; --ecru-700:#5C4337; --ecru-800:#503B33;

  /* ===== Status Red / Green ===== */
  --status-red-100:#FFE4E1; --status-red-200:#FFC8C1; --status-red-300:#FFAA99; --status-red-400:#FF715F;
  --status-red-500:#FF4D37; --status-red-600:#EB2C14; --status-red-700:#A41200; --status-red-800:#7E1205;
  --status-green-100:#EFFBDC; --status-green-200:#DAF2B2; --status-green-300:#BBE96E; --status-green-400:#92DA00;
  --status-green-500:#72BE00; --status-green-600:#5E9801; --status-green-700:#3C6A00; --status-green-800:#2C4F00;

  /* ===== Transparency ===== */
  --black-opacity-60:#00000099; --black-opacity-80:#000000CC;
  --white-opacity-60:#FFFFFF99; --white-opacity-80:#FFFFFFCC;

  /* ===== Gradients ===== */
  --gradient-blue-red: linear-gradient(135deg, #409DD8 0%, #AD0B49 100%);
  --gradient-red-purple: linear-gradient(135deg, #AD0B49 0%, #9181C6 50%, #5D45B0 100%);

  /* ===== Typography ===== */
  --font-family-base: "Akkurat Helsana", "Helvetica Neue", Arial, sans-serif;
  /* Im Figma existieren zwei Alias-Tokens – beide zeigen auf denselben Font. */
  --font-family-headlines: var(--font-family-base);
  --font-family-body: var(--font-family-base);
  --font-weight-light: 300; --font-weight-regular: 400; --font-weight-bold: 700;

  /* ===== Spacing ===== */
  --space-none:0; --space-ant:2px; --space-bee:4px; --space-snail:8px; --space-frog:12px;
  --space-rat:16px; --space-chicken:20px; --space-cat:24px; --space-dog:32px; --space-donkey:40px;
  --space-gorilla:48px; --space-lion:56px; --space-grizzly:64px; --space-rhino:80px; --space-elephant:96px;

  /* ===== Border ===== */
  --border-radius-0px:0px; --border-radius-2px:2px; --border-radius-4px:4px; --border-radius-6px:6px;
  --border-radius-8px:8px; --border-radius-16px:16px; --border-radius-full:9999px;
  --border-width-none:0px; --border-width-s:1px; --border-width-m:2px; --border-width-l:4px;

  /* ===== Shadows ===== */
  --shadow-s: 0px 1px 4px 0px rgba(0,0,0,0.16);
  --shadow-m: 1px 6px 20px -8px rgba(0,0,0,0.12);
  --shadow-m-hover: 1px 12px 24px -12px rgba(0,0,0,0.32);
  --shadow-l: 0px 4px 32px -8px rgba(0,0,0,0.16);
  --shadow-l-hover: 0px 8px 40px -12px rgba(0,0,0,0.32);
  --shadow-border: 0px 12px 16px -8px rgba(0,0,0,0.16);
}
```

### 10.2 Semantic Tokens – Light (Basis)
```css
:root, [data-color-mode="light"] {
  /* Text */
  --text-primary: var(--neutral-800);
  --text-secondary: var(--neutral-600);
  --text-tertiary: var(--neutral-500);
  --text-disabled: var(--neutral-400);
  --text-brand: var(--brand-500);
  --text-decorative: var(--purple-500);
  --text-nav-selected: var(--brand-500);
  --text-on-colored-bg: var(--basic-white);
  --text-on-interactive-primary: var(--basic-white);
  --text-on-interactive-disabled: var(--neutral-400);

  /* Interactive */
  --interactive-primary: var(--brand-500);
  --interactive-primary-hover: var(--brand-400);
  --interactive-secondary: var(--pink-500);
  --interactive-disabled: var(--neutral-300);
  --interactive-primary-on-colored-bg: var(--basic-white);
  --interactive-primary-on-colored-bg-hover: var(--brand-100);
  --interactive-disabled-on-colored-bg: var(--neutral-800);

  /* Background */
  --background-device: var(--basic-white);
  --background-card: var(--basic-white);
  --background-subtle-neutral: var(--neutral-100);
  --background-medium-neutral: var(--neutral-200);
  --background-brand: var(--brand-500);
  --background-hover: var(--neutral-200);
  --background-decorative-light: var(--purple-100);
  --background-overlay: var(--black-opacity-60);
  --background-overlay-darker: var(--black-opacity-80);
  --background-white-overlay: var(--white-opacity-60);
  --background-white-overlay-darker: var(--white-opacity-80);

  /* Border */
  --border: var(--neutral-500);
  --border-light: var(--neutral-300);
  --border-focus: var(--neutral-800);
  --border-focus-width: var(--border-width-s);
  --border-card: var(--neutral-300);
  --border-on-colored-bg: var(--neutral-100);

  /* Constant */
  --constant-black: var(--neutral-800);
  --constant-white: var(--basic-white);

  /* Status */
  --status-info: var(--blue-500);
  --status-success: var(--status-green-600);
  --status-warning: var(--yellow-400);
  --status-error: var(--status-red-500);
  --status-notification: var(--pink-600);
  --status-text-info: var(--blue-700);
  --status-text-success: var(--status-green-700);
  --status-text-warning: var(--yellow-700);
  --status-text-error: var(--status-red-700);
  --status-light-bg-info: var(--blue-100);
  --status-light-bg-success: var(--status-green-100);
  --status-light-bg-warning: var(--yellow-100);
  --status-light-bg-error: var(--status-red-100);
  --status-text-info-on-light-bg: var(--blue-800);
  --status-text-success-on-light-bg: var(--status-green-700);
  --status-text-warning-on-light-bg: var(--yellow-800);
  --status-text-error-on-light-bg: var(--status-red-800);

  /* Decorative */
  --decorative-pink-light: var(--pink-100);
  --decorative-pink-medium: var(--pink-200);
  --decorative-pink: var(--pink-400);
  --decorative-pink-darker: var(--pink-500);
  --decorative-purple-light: var(--purple-100);
  --decorative-purple-medium: var(--purple-200);
  --decorative-purple: var(--purple-400);
  --decorative-purple-darker: var(--purple-500);
  --decorative-blue-light: var(--blue-100);
  --decorative-blue-medium: var(--blue-200);
  --decorative-blue: var(--blue-400);
  --decorative-blue-darker: var(--blue-500);
  --decorative-yellow-light: var(--yellow-100);
  --decorative-yellow-medium: var(--yellow-200);
  --decorative-yellow: var(--yellow-400);
  --decorative-yellow-darker: var(--yellow-500);
  --decorative-green-light: var(--green-100);
  --decorative-green-medium: var(--green-200);
  --decorative-green: var(--green-400);
  --decorative-green-darker: var(--green-500);
  --decorative-ecru-light: var(--ecru-100);
  --decorative-ecru-medium: var(--ecru-200);
  --decorative-ecru: var(--ecru-400);
  --decorative-ecru-darker: var(--ecru-500);
}
```

### 10.3 Light High Contrast (nur Abweichungen)
```css
[data-color-mode="light-hc"] {
  --text-secondary: var(--neutral-700);
  --border: var(--neutral-700);
  --background-hover: var(--neutral-300);
  --status-text-info: var(--blue-800);
  --status-text-success: var(--status-green-800);
  --status-text-warning: var(--yellow-800);
  --status-text-error: var(--status-red-800);
  --status-notification: var(--pink-800);
  --status-text-success-on-light-bg: var(--status-green-800);
}
```

### 10.4 Dark (nur Abweichungen zu Light)
```css
[data-color-mode="dark"] {
  --text-primary: var(--basic-white);
  --text-secondary: var(--neutral-400);
  --text-disabled: var(--neutral-600);
  --text-brand: var(--brand-300);
  --text-decorative: var(--purple-400);
  --text-nav-selected: var(--basic-white);
  --text-on-interactive-disabled: var(--neutral-500);

  --interactive-primary: var(--pink-500);
  --interactive-primary-hover: var(--pink-600);
  --interactive-disabled: var(--neutral-700);

  --background-device: var(--basic-black);
  --background-card: var(--neutral-800);
  --background-subtle-neutral: var(--neutral-800);
  --background-medium-neutral: var(--neutral-700);
  --background-brand: var(--brand-400);
  --background-hover: var(--neutral-800);
  --background-decorative-light: var(--purple-800);

  --border-light: var(--neutral-600);
  --border-focus: var(--neutral-100);
  --border-card: var(--neutral-800);

  --status-info: var(--blue-400);
  --status-text-info: var(--blue-400);
  --status-text-success: var(--status-green-500);
  --status-text-warning: var(--yellow-400);
  --status-text-error: var(--status-red-400);
  --status-light-bg-info: var(--blue-800);
  --status-light-bg-success: var(--status-green-800);
  --status-light-bg-warning: var(--yellow-800);
  --status-light-bg-error: var(--status-red-800);
  --status-text-info-on-light-bg: var(--blue-100);
  --status-text-success-on-light-bg: var(--status-green-100);
  --status-text-warning-on-light-bg: var(--yellow-100);
  --status-text-error-on-light-bg: var(--status-red-100);

  --decorative-pink-light: var(--pink-200);
  --decorative-purple-light: var(--purple-200);
  --decorative-blue-light: var(--blue-200);
  --decorative-yellow-light: var(--yellow-200);
  --decorative-green-light: var(--green-200);
  --decorative-ecru-light: var(--ecru-200);
}
```

### 10.5 Dark High Contrast (vollständige Abweichungen zu Light)
```css
[data-color-mode="dark-hc"] {
  --text-primary: var(--basic-white);
  --text-secondary: var(--neutral-300);
  --text-tertiary: var(--neutral-400);
  --text-disabled: var(--neutral-600);
  --text-brand: var(--pink-300);
  --text-decorative: var(--purple-300);
  --text-nav-selected: var(--basic-white);
  --text-on-interactive-primary: var(--basic-black);
  --text-on-interactive-disabled: var(--neutral-500);

  --interactive-primary: var(--pink-300);
  --interactive-primary-hover: var(--pink-200);
  --interactive-disabled: var(--neutral-700);

  --background-device: var(--basic-black);
  --background-card: var(--neutral-800);
  --background-subtle-neutral: var(--neutral-800);
  --background-medium-neutral: var(--neutral-700);
  --background-brand: var(--brand-400);
  --background-hover: var(--neutral-800);
  --background-decorative-light: var(--purple-800);

  --border: var(--neutral-400);
  --border-light: var(--neutral-600);
  --border-focus: var(--neutral-100);
  --border-card: var(--neutral-800);

  --status-info: var(--blue-400);
  --status-success: var(--status-green-500);
  --status-notification: var(--pink-300);
  --status-text-info: var(--blue-300);
  --status-text-success: var(--status-green-400);
  --status-text-warning: var(--yellow-300);
  --status-text-error: var(--status-red-300);
  --status-light-bg-info: var(--blue-800);
  --status-light-bg-success: var(--status-green-800);
  --status-light-bg-warning: var(--yellow-800);
  --status-light-bg-error: var(--status-red-800);
  --status-text-info-on-light-bg: var(--blue-100);
  --status-text-success-on-light-bg: var(--status-green-100);
  --status-text-warning-on-light-bg: var(--yellow-100);
  --status-text-error-on-light-bg: var(--status-red-100);

  --decorative-pink-light: var(--pink-200);
  --decorative-purple-light: var(--purple-200);
  --decorative-blue-light: var(--blue-200);
  --decorative-yellow-light: var(--yellow-200);
  --decorative-green-light: var(--green-200);
  --decorative-ecru-light: var(--ecru-200);
}
```

### 10.6 System-Preference Fallback
```css
@media (prefers-color-scheme: dark) {
  :root:not([data-color-mode]) { /* Inhalt von 10.4 hier wiederholen */ }
}
```

### 10.7 Typo-Utilities
```css
.h1 { font: var(--font-weight-light) 32px/1.25 var(--font-family-base); }
.h2 { font: var(--font-weight-bold)  28px/1.25 var(--font-family-base); }
.h3 { font: var(--font-weight-light) 24px/1.25 var(--font-family-base); }
.h4 { font: var(--font-weight-regular) 20px/1.35 var(--font-family-base); }
.h5 { font: var(--font-weight-bold)  18px/1.35 var(--font-family-base); }

@media (min-width: 768px) {
  .h1 { font-size: 44px; line-height: 1.2; }
  .h2 { font-size: 32px; }
  .h3 { font-size: 28px; }
  .h4 { font-size: 24px; }
  .h5 { font-size: 20px; }
}

.body-l        { font: var(--font-weight-regular) 18px/1.4 var(--font-family-base); }
.body-l-bold   { font: var(--font-weight-bold)    18px/1.4 var(--font-family-base); }
.body-m        { font: var(--font-weight-regular) 16px/1.4 var(--font-family-base); }
.body-m-bold   { font: var(--font-weight-bold)    16px/1.4 var(--font-family-base); }
.body-m-copy   { font: var(--font-weight-regular) 16px/1.5 var(--font-family-base); }
.body-s        { font: var(--font-weight-regular) 14px/1.4 var(--font-family-base); }
.body-s-bold   { font: var(--font-weight-bold)    14px/1.4 var(--font-family-base); }

.lead { font: var(--font-weight-light) 20px/1.4 var(--font-family-base); }
.nav  { font: var(--font-weight-light) 32px/40px var(--font-family-base); }
@media (min-width: 768px) {
  .lead { font-size: 22px; }
  .nav  { font-size: 20px; line-height: 28px; }
}

.helper-m      { font: var(--font-weight-regular) 12px/1.4 var(--font-family-base); }
.helper-m-bold { font: var(--font-weight-bold)    12px/1.4 var(--font-family-base); }
.helper-s      { font: var(--font-weight-regular) 10px/1.4 var(--font-family-base); }
.helper-s-bold { font: var(--font-weight-bold)    10px/1.4 var(--font-family-base); }

.display-l { font: var(--font-weight-light) 72px/1.2 var(--font-family-base); }
.display-m { font: var(--font-weight-light) 48px/1.2 var(--font-family-base); }
.display-s { font: var(--font-weight-light) 44px/1.2 var(--font-family-base); }
```

### 10.8 Layout-Container
```css
.container {
  width: 100%;
  max-width: var(--layout-max-width);
  margin-inline: auto;
  padding-inline: var(--layout-margin-mobile);
}
@media (min-width: 768px)  { .container { padding-inline: var(--layout-margin-tablet); } }
@media (min-width: 1024px) { .container { padding-inline: var(--layout-margin-desktop); } }
```

---

## 11. Tailwind-Konfiguration

```js
// tailwind.config.js
export default {
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      // Semantic (nur diese im Markup verwenden!)
      text: {
        primary: 'var(--text-primary)', secondary: 'var(--text-secondary)',
        tertiary: 'var(--text-tertiary)', disabled: 'var(--text-disabled)',
        brand: 'var(--text-brand)', decorative: 'var(--text-decorative)',
        'nav-selected': 'var(--text-nav-selected)',
        'on-colored-bg': 'var(--text-on-colored-bg)',
        'on-interactive-primary': 'var(--text-on-interactive-primary)',
        'on-interactive-disabled': 'var(--text-on-interactive-disabled)',
      },
      interactive: {
        primary: 'var(--interactive-primary)',
        'primary-hover': 'var(--interactive-primary-hover)',
        secondary: 'var(--interactive-secondary)',
        disabled: 'var(--interactive-disabled)',
        'primary-on-colored-bg': 'var(--interactive-primary-on-colored-bg)',
        'primary-on-colored-bg-hover': 'var(--interactive-primary-on-colored-bg-hover)',
        'disabled-on-colored-bg': 'var(--interactive-disabled-on-colored-bg)',
      },
      background: {
        device: 'var(--background-device)', card: 'var(--background-card)',
        'subtle-neutral': 'var(--background-subtle-neutral)',
        'medium-neutral': 'var(--background-medium-neutral)',
        brand: 'var(--background-brand)', hover: 'var(--background-hover)',
        'decorative-light': 'var(--background-decorative-light)',
        overlay: 'var(--background-overlay)', 'overlay-darker': 'var(--background-overlay-darker)',
        'white-overlay': 'var(--background-white-overlay)',
        'white-overlay-darker': 'var(--background-white-overlay-darker)',
      },
      border: {
        DEFAULT: 'var(--border)', light: 'var(--border-light)',
        focus: 'var(--border-focus)', card: 'var(--border-card)',
        'on-colored-bg': 'var(--border-on-colored-bg)',
      },
      constant: { black: 'var(--constant-black)', white: 'var(--constant-white)' },
      status: {
        info: 'var(--status-info)', success: 'var(--status-success)',
        warning: 'var(--status-warning)', error: 'var(--status-error)',
        notification: 'var(--status-notification)',
        'text-info': 'var(--status-text-info)', 'text-success': 'var(--status-text-success)',
        'text-warning': 'var(--status-text-warning)', 'text-error': 'var(--status-text-error)',
        'light-bg-info': 'var(--status-light-bg-info)', 'light-bg-success': 'var(--status-light-bg-success)',
        'light-bg-warning': 'var(--status-light-bg-warning)', 'light-bg-error': 'var(--status-light-bg-error)',
        'text-info-on-light-bg': 'var(--status-text-info-on-light-bg)',
        'text-success-on-light-bg': 'var(--status-text-success-on-light-bg)',
        'text-warning-on-light-bg': 'var(--status-text-warning-on-light-bg)',
        'text-error-on-light-bg': 'var(--status-text-error-on-light-bg)',
      },
      decorative: {
        'pink-light':'var(--decorative-pink-light)','pink-medium':'var(--decorative-pink-medium)',
        pink:'var(--decorative-pink)','pink-darker':'var(--decorative-pink-darker)',
        'purple-light':'var(--decorative-purple-light)','purple-medium':'var(--decorative-purple-medium)',
        purple:'var(--decorative-purple)','purple-darker':'var(--decorative-purple-darker)',
        'blue-light':'var(--decorative-blue-light)','blue-medium':'var(--decorative-blue-medium)',
        blue:'var(--decorative-blue)','blue-darker':'var(--decorative-blue-darker)',
        'yellow-light':'var(--decorative-yellow-light)','yellow-medium':'var(--decorative-yellow-medium)',
        yellow:'var(--decorative-yellow)','yellow-darker':'var(--decorative-yellow-darker)',
        'green-light':'var(--decorative-green-light)','green-medium':'var(--decorative-green-medium)',
        green:'var(--decorative-green)','green-darker':'var(--decorative-green-darker)',
        'ecru-light':'var(--decorative-ecru-light)','ecru-medium':'var(--decorative-ecru-medium)',
        ecru:'var(--decorative-ecru)','ecru-darker':'var(--decorative-ecru-darker)',
      },
    },
    spacing: {
      none:'0', ant:'2px', bee:'4px', snail:'8px', frog:'12px', rat:'16px', chicken:'20px',
      cat:'24px', dog:'32px', donkey:'40px', gorilla:'48px', lion:'56px', grizzly:'64px',
      rhino:'80px', elephant:'96px',
    },
    borderRadius: { none:'0', DEFAULT:'2px', sm:'2px', md:'4px', lg:'6px', xl:'8px','2xl':'16px', full:'9999px' },
    borderWidth: { 0:'0px', DEFAULT:'1px', s:'1px', m:'2px', l:'4px' },
    boxShadow: {
      s:'0px 1px 4px 0px rgba(0,0,0,0.16)',
      m:'1px 6px 20px -8px rgba(0,0,0,0.12)',
      'm-hover':'1px 12px 24px -12px rgba(0,0,0,0.32)',
      l:'0px 4px 32px -8px rgba(0,0,0,0.16)',
      'l-hover':'0px 8px 40px -12px rgba(0,0,0,0.32)',
      border:'0px 12px 16px -8px rgba(0,0,0,0.16)',
    },
    fontFamily: { sans: ['"Akkurat Helsana"','"Helvetica Neue"','Arial','sans-serif'] },
    fontWeight: { light:'300', normal:'400', bold:'700' },
    screens: { mobile:'375px', tablet:'768px', desktop:'1024px' },
    extend: { maxWidth: { layout: '1280px' } },
  },
}
```

---

## 12. Komponenten

> Quelle: Figma-File **💠 Unify – 🧱 Core Components** (`FdDnzKBAvua0vvJr4AY6Lf`).
> Alle Werte sind aus den Figma-Varianten extrahiert, nicht geschätzt.

---

### 12.1 Namens- und Strukturkonventionen (verbindlich)

| Bereich | Regel |
|---|---|
| **Komponenten** | Beginnen mit Grossbuchstaben: `Button`, `Card`, `Input Field`. Varianten & States immer über Component Properties, nie über Kopien. |
| **Hilfs-Komponenten** | Mit Punkt-Präfix: `.Box`, `.Pill`, `.Menu Item`, `.Stepper/Steps`. Diese sind **intern** und werden nicht direkt platziert. |
| **Layer & Gruppen** | Immer Auto-Layout-Frames. Übergeordnete Ebene benennt den Inhalt (`Box + Hover`), Kinder nach Funktion (`Box`, `Hover`, `Label`). Verboten: `Group 1`, `Frame 3`. |
| **Properties** | Erster Buchstabe gross, gruppiert in `Type`, `State`, `Size`, `Platform`, `Breakpoint`, `Rounded`, `On colored bg`. |
| **States** | Einheitlich `Default` · `Hover` · `Active` · `Focus` · `Disabled` (+ `Error` bei Formularfeldern). |
| **Booleans** | `True` / `False`. |
| **Tokens** | Kleinschreibung, Bindestrich-getrennt, eigener Textstyle. |

---

### 12.2 Übergreifende Muster

**Rounded-Property**
Fast jede Komponente hat `Rounded` mit **Default `False`**. `False` ist der Web-/Helsana-CI-Look, `True` der iOS-26-Look.

| Komponente | Rounded = False | Rounded = True |
|---|---|---|
| Button | `2px` | `9999px` (Pill) |
| Input Field, Select, Textarea, Dialog, Attachment | `2px` | `8px` |
| Inline Notification, Tooltip, Date Picker | `2px` | `16px` |
| Checkbox-Box | `2px` | `4px` |

> Verifiziert an den Figma-Variablen der jeweiligen Komponente. **Pills** (`.Pill`, `Tab Pills`, `Filter Pills`) und der **Icon Button** haben *keine* `Rounded`-Property – sie sind immer `9999px`.

**⚠️ Artefakte des Doku-Templates – nicht übernehmen**
Wer selbst Werte aus dem Figma zieht, sieht Variablen, die **nicht** zum Helsana-DS gehören, sondern zum Dokumentations-Template der Datei:

| Artefakt | Bedeutung | Ersatz im Code |
|---|---|---|
| `var(--p-border-radius-050)` | 2 | `--border-radius-2px` |
| `var(--p-border-radius-150)` | 8 **oder** 16 – je nach Komponente | `--border-radius-8px` / `--border-radius-16px` |
| `var(--p-border-radius-full)` | 9999 | `--border-radius-full` |
| `Colors/specs-050`, `Colors/specs-500` | Türkistöne des Spec-Rasters | ersatzlos streichen |
| `Specs/*`, Poppins, JetBrains Mono | Beschriftung der Spec-Seiten | ersatzlos streichen |

**Focus-Ring – ein einziges Muster für alle Komponenten**

```css
.u-focus-ring { position: relative; }
.u-focus-ring::after {
  content: "";
  position: absolute;
  inset: -5px;                                   /* 5 px Aussenabstand */
  border: var(--border-focus-width, 1px) solid var(--border-focus, #202020);
  border-radius: calc(var(--radius, 2px) + 5px); /* = 7px bei Default-Radius */
  pointer-events: none;
}
```

* Farbe immer `border-focus #202020` – **nie** Brand-Rot.
* Breite immer `1px` (`border-focus-width`).
* Beim Button liegt der Ring zusätzlich über einem Hover-Hintergrund.

**Weitere globale Achsen**

| Property | Werte | Bedeutung |
|---|---|---|
| `Platform` | `Web` · `App` | Formularfelder: Web = Label in der Border-Kerbe, App = Label oberhalb |
| `Breakpoint` | `Desktop` · `Mobile` | Header, Footer, Dialog, Breadcrumb, Stepper, Notification, Tooltip, Accordion |
| `On colored bg` | `False` · `True` | Invertierte Interactive-Tokens auf Brand-/Bildhintergrund |
| `Size` | `Large` · `Small` | Button, Icon Button, Toggle |

**Disabled-Konvention**
Entweder eigene Disabled-Tokens (`interactive-disabled #e0e0e0`, `text-disabled #b2b2b2`) **oder** `opacity: 0.5` (Checkbox, Radio) bzw. `opacity: 0.4` (On-colored-bg). Nie beides kombinieren.

---

### 12.3 Komponenten-Inventar (54 Komponenten)

| Page | Komponente | Node-ID | Property-Achsen |
|---|---|---|---|
| Button | **Button** | `8:429` | Type · State · Size · On colored bg · Rounded |
| Icon Button | **Icon Button** | `397:4264` | Type · Size · State |
| Action-Link | **Action-Link** | `1456:349` | Type · State · On colored bg |
| Input Field | **Input Field** | `349:1276` | Platform · State · Filled · Rounded · Text |
| Text Area | **Textarea** | `668:2856` | Platform · State · Filled · Rounded |
| Select | **Select** | `556:4271` | Platform · State · Filled · Rounded |
| Select | Dropdown Menu | `9118:4190` | Rounded |
| Select | Dropdown Menu Item | `673:4106` | State |
| Checkbox | **Checkbox** | `50:144` | State · Checked |
| Checkbox | `.Box` | `50:60` | Checked · Status |
| Checkbox | Checkbox-Box (Karte) | `1682:5482` | Show Title · Rounded |
| Radio Button | **Radio Button** | `84:952` | State · Selected |
| Radio Button | `.Radio Circle` | `84:943` | Selected · Status |
| Toggle | **Toggle** | `812:5789` | State · Checked · Size |
| Accordion | **Accordion** | `7857:9128` | State · Device |
| Dialog | **Dialog** | `653:6177` | Breakpoint · Rounded |
| Inline Notification | **Inline Notification** | `3746:14998` | Breakpoint · Type · Rounded |
| Tooltip | **Tooltip** | `191:361` | Breakpoint · Placement · Rounded |
| Tooltip | Info Icon | `440:2407` | Tooltip Position |
| Tooltip | `.Caret` | `188:530` | Direction · Rounded |
| Tab Pills | **Tab Pills** | `3305:3684` | Tab Count 2–4 |
| Filter Pills | **Filter Pills** | `3305:4159` | Filter Count 2–8 |
| Filter Pills | `.Pill` | `3025:689` | Type · State · On decorative bg |
| Stepper | **Stepper** | `2498:1483` | Breakpoint · Step 1–5/Complete |
| Stepper | `.Stepper/Steps` | `2495:525` | Breakpoint · Position · Status |
| Stepper | `.Stepper/Connector` | `2507:2341` | Breakpoint · Type · Status |
| Stepper | `.Stepper/Border` | `2494:281` | Status |
| Breadcrumbs | **Breadcrumb** | `2753:2493` | Level 1–8 · Breakpoint |
| Breadcrumbs | `.Breadcrumb Parts` | `2753:2478` | State |
| Header | **Header** | `2629:4395` | Breakpoint · State |
| Header | Header Nav | `2678:5541` | – |
| Header | `.Menu Item` | `2627:5692` | Breakpoint · State |
| Header | `.Menu Accordion` | `2629:2797` | State |
| Header | `.Accordion Header` | `2628:472` | State |
| Footer | **Footer** | `2353:1587` | Breakpoint |
| Footer | `.Legal Links` | `2351:1977` | Breakpoint |
| Footer | `.Language Switch` / `.Language Item` | `2351:1812` / `2359:8018` | State |
| Footer | `.Social Icons` | `2351:1815` | – |
| Date Picker | **Date Picker** | `3022:1704` | Type · View · Rounded |
| Date Picker | `.Picker Item` | `3020:266` | State |
| Date Picker | `.Week` | `3020:363` | – |
| Form Attachment | **Form Attachment** | `668:3705` | State · Platform · Filled · Buttons |
| Form Attachment | Attachment | `1068:1350` | State-Attachment · Rounded |
| Bottom Sheet | **Bottom-Up-Sheet** | `13600:1764` | – |
| Single Select 🟠💛 | **Single Select** | `4676:2353` | Option Count 2–8 |
| Single Select 🟠💛 | **Single Select A** | `4797:959` | Option Count · Breakpoint · Colored BG |
| Single Select 🟠💛 | `.option` / `.optionA` | `4676:2261` / `4797:1004` | Position · State |
| 🧩 Helper | Backdrop / Media Placeholder / Slot | `812:6482` / `703:8486` / `842:5090` | – |
| (Loading-Indicator) 🟠 | Textarea (WIP-Duplikat) | `4983:2784` | Platform · State · Filled |
| 🗑️ Archive | Smart Filter (abgekündigt) | `3177:2025` | – |

> 🟠 / 💛 markieren Work-in-Progress-Komponenten. Nicht produktiv verwenden.
> Die letzten beiden Zeilen komplettieren die Zahl auf **54**; sie sind bewusst **nicht** für den produktiven Einsatz vorgesehen (WIP-Duplikat bzw. Archiv).

---

### 12.4 Button `8:429`

**Achsen:** `Type` (Primary/Secondary) × `State` (Default/Hover/Active/Focus/Disabled) × `Size` (Large/Small) × `On colored bg` × `Rounded` = 80 Varianten.

**Geometrie**

| | Large | Small |
|---|---|---|
| min-height / min-width | `56px` | `40px` |
| padding-inline | `space-dog 32px` | `space-rat 16px` |
| padding-block | `space-rat 16px` | `space-snail 8px` |
| Label | `body-m-bold` 16 / 22.4 | `body-s-bold` 14 / 19.6 |
| Icon-Slot | `24px` | `16px` |
| gap | `space-snail 8px` | `space-snail 8px` |
| radius | `2px` bzw. `9999px` | `2px` bzw. `9999px` |

**Farben – On colored bg = False**

| State | Primary | Secondary |
|---|---|---|
| Default | `bg interactive-primary #9a0941`, `color text-on-interactive-primary #fff` | `border 2px interactive-primary #9a0941`, transparent, `color #9a0941` |
| Hover | `bg interactive-primary-hover #ad0b49` | `border 4px #ad0b49` |
| Active | `bg #ad0b49` | `border 4px #ad0b49` |
| Focus | `bg #ad0b49` + Focus-Ring | `border 4px #ad0b49` + `bg background-device #fff` + Focus-Ring |
| Disabled | `bg interactive-disabled #e0e0e0`, `color text-on-interactive-disabled #b2b2b2` | `border 2px #e0e0e0`, `color #b2b2b2` |

**Farben – On colored bg = True**

| State | Primary | Secondary |
|---|---|---|
| Default | `bg interactive-primary-on-colored-bg #fff`, `color interactive-secondary #9a0941` | `border 2px #fff`, `color #fff` |
| Hover / Active | `bg interactive-primary-on-colored-bg-hover #ebced9` | `border 4px #fff` |
| Focus | wie Hover + Focus-Ring | `border 4px #fff` + `bg background-brand #9a0941` + Focus-Ring |
| Disabled | `bg interactive-disabled-on-colored-bg #202020`, `opacity .4` | `border 2px #202020`, `opacity .4` |

**Verwendung (aus der Figma-Doku)**
* Genau **eine** Primary Action pro Screen.
* Schritt-Flows: „Weiter" = Primary (rechts), „Zurück" = Secondary (links, LTR).
* Labels eindeutig benennen – kein „OK"/„Weiter" ohne Kontext.
* ❌ „Zurück" nicht als Action-Link verstecken, wenn es ein gleichwertiger Step ist.
* ❌ Keine doppelten Rückwege (Button **und** Action-Link mit gleichem Ziel).
* Im Einsatz bei: helsana.ch, Easy Sales, Gesundheitsbudget-Rechner, myHelsana Web.

---

### 12.5 Icon Button `397:4264`

**Achsen:** `Type` (Action/Neutral/On picture) × `Size` (Large/Small) × `State`.

* Hit-Area: `44px` (Large), Icon-Container `32px` (Small); Padding `space-bee 4px`; `border-radius: 9999px`.
* Icon: `24px`, Farbe `text-primary #202020`.
* **Action / Neutral:** Default & Disabled ohne Hintergrund; Hover / Active / Focus → `bg background-subtle-neutral #f8f8f8`.
* **On picture:** Container `bg constant-black #202020`, Icon weiss.
* Disabled: `color text-disabled #b2b2b2`.
* Focus: Standard-Focus-Ring, Radius folgt `9999px`.

> Icon Buttons sind immer rund – auch im Rounded=False-Kontext.

---

### 12.6 Action-Link `1456:349`

**Achsen:** `Type` (Leading-Icon / Button-Link / Trailing-Icon) × `State` × `On colored bg`.

* Typografie: `body-s-bold` 14 / 19.6.
* `padding-top: space-ant 2px`, `padding-inline: space-bee 4px`; gap `4px` (mit Icon) bzw. `2px`.
* Icon `24px`, Pfeil-Glyphe `20 × 14px`.
* Default `interactive-primary #9a0941` → Hover/Active `interactive-primary-hover #ad0b49` → Disabled `text-disabled #b2b2b2`.
* On colored bg: `#fff` → Hover `#ebced9` → Disabled `#202020` + `opacity .4`; Unterstrich-/Randfarbe `border-on-colored-bg #f8f8f8`.
* Focus: Standard-Focus-Ring.

**Einsatz:** tertiäre Aktion, Navigation innerhalb von Fliesstext, „Mehr erfahren". Nie als Ersatz für einen Primary Button in einem Step-Flow.

---

### 12.7 Input Field `349:1276`

**Achsen:** `Platform` (Web/App) × `State` (Default / Active-Focus / Error / Disabled) × `Filled` × `Rounded` × `Text` (Placeholder/Label/Filled).

**Box**

```
height: 56px; width: 100%;
padding: space-rat 16px; gap: space-snail 8px;
background: background-device #fff;
border-radius: 2px  (Rounded=True → 8px)
overflow: clip;
```

**Border pro State**

| State | Border |
|---|---|
| Default | `1px solid border #949494` |
| Active / Focus | `2px solid border-focus #202020` |
| Error | `1px solid status-error #ff4d37` (App: durchgehend 1px) |
| Disabled | `1px solid border-light #e0e0e0` |

**Text**

| Element | Style | Farbe |
|---|---|---|
| Eingabe | `body-m` 16 / 22.4 | `text-primary #202020` |
| Placeholder | `body-m` | `text-tertiary #949494` |
| Label | `body-s` 14 / 19.6 | `text-secondary #707070` |
| Disabled (alles) | – | `text-disabled #b2b2b2` |
| Fehlermeldung | `body-s` + Icon `alert_circle` 16px, gap `4px` | `status-text-error #a41200` |

* **Platform = Web:** Label sitzt als Notch in der oberen Border (Floating Label).
* **Platform = App:** Label steht als eigene Zeile über dem Feld.
* Trailing Icon `24px`, optional.

---

### 12.8 Textarea `668:2856`

Gleiche State-/Border-/Farb-Logik wie Input Field, abweichende Geometrie:

```
min-height: 68px;
padding: 20px 12px 12px;   /* pt space-chicken, px/pb space-frog */
gap: space-snail 8px;
border-radius: 2px (Rounded=True → 8px);
```

* Zeichenzähler unten rechts: `helper-m` 12 / 140 %, Farbe `text-secondary #707070`.
* Optionale Leading-/Trailing-Icons (16px) über Boolean-Props.
* Resize: nur vertikal.

---

### 12.9 Select `556:4271` + Dropdown Menu `9118:4190`

**Trigger** – identisch zum Input Field:
`height 56px` · `padding 16px` · `border-radius 2px / 8px` · Border wie oben · Chevron `chevron_down` 24px, im offenen Zustand `chevron_up`.

**Menü**

```
width: 272–280px;
background: background-card #fff;
border: 1px solid border-card #e0e0e0;
border-radius: 2px (Rounded=True → 8px);
box-shadow: var(--shadow-m, 1px 6px 20px -8px rgba(0,0,0,.12));
```

**Menu Item `673:4106`**

```
padding: space-frog 12px space-chicken 20px;   /* py 12 / px 20 */
font: body-m 16 / 22.4;
color: text-secondary #707070;
```
`State = Active` → `background: background-hover #f2f2f2`, `color: text-primary #202020`.

---

### 12.10 Checkbox `50:144` + `.Box 50:60`

* Wrapper: `display:flex; gap: space-snail 8px; align-items:flex-start;` – im Error-State `flex-direction: column; gap: space-bee 4px;`.
* Box: `24 × 24px`, `border-width 2px`, `border-radius 2px` (Checkbox-Box-Karte: `4px`).
* Checkmark-Icon `16px`; Indeterminate-Balken `11 × 2px`.

| State | Box |
|---|---|
| Default (unchecked) | `border text-secondary #707070` |
| Hover / Checked | `border + background text-primary #202020`, Haken weiss |
| Error | `border status-error #ff4d37` |
| Disabled | Wrapper `opacity: .5` |

* Label `body-m` 16 / 22.4, `text-primary`.
* Fehlertext `body-s`, `status-text-error #a41200`, Icon 16px, gap `4px`.
* Focus: Standard-Focus-Ring um die Box.

---

### 12.11 Radio Button `84:952` + `.Radio Circle 84:943`

Identische Logik wie Checkbox, nur:
* Kreis `24 × 24px`, `border-radius: 9999px`, Punkt `16px` gefüllt `text-primary #202020`.
* Kein Indeterminate-State.
* States: `Default | Hover | Error | Error-hover | Disabled | Focus`.
* Standard-Fehlertext: „Dieses Feld ist erforderlich".

---

### 12.12 Toggle `812:5789`

**Achsen:** `State` (Default/Disabled) × `Checked` × `Size` (Default/Small).

| | Size = Default | Size = Small |
|---|---|---|
| Track | `64 × 28px` | `36 × 20px` |
| Knob | `36 × 24px` | `20 × 16px` |
| Padding | `2px` | `2px` |

```
track  { border-radius: 9999px; }
knob   { border-radius: 9999px;
         box-shadow: var(--shadow-s, 0 1px 4px 0 rgba(0,0,0,.16)); }
```

| Zustand | Track | Knob |
|---|---|---|
| Checked = True | `status-success #5e9801`, `justify-content:flex-end` | `constant-white #fff` |
| Checked = False | `text-tertiary #949494` | `constant-white #fff` |
| Disabled | `interactive-disabled #e0e0e0` | `text-on-interactive-disabled #b2b2b2` |
| Disabled + Checked | wie Disabled | Knob mit 16px-Haken |

> Der Toggle nutzt **Grün** (`status-success`), nicht Brand-Rot. Interaktive Varianten als `<button>` markieren, Disabled als nicht-fokussierbares Element.

---

### 12.13 Accordion `7857:9128`

**Achsen:** `State` (Collapsed/Extended) × `Device` (Desktop/Mobile/App).

```
Header:  height 48px; padding-block 16px; gap 8–16px;
Titel:   Headlines/h4  → Desktop 24px, Mobile 20px
Copy:    body-m-copy 16 / 150 %
Trenner: 1px, background border-light #e0e0e0 (oben/unten schaltbar)
Chevron: chevron_down / chevron_up, 24px, rechtsbündig
Breite:  Desktop 677px, Mobile 343px (Content-Breite)
```
* Optionales Leading-Icon (32 / 48px) links vom Titel.
* Optionaler Action-Link im geöffneten Body.
* Gesamter Header ist Klickfläche (`role="button"`, `aria-expanded`).

---

### 12.14 Dialog `653:6177`

**Achsen:** `Breakpoint` (Desktop/Mobile) × `Rounded`.

```
width:  Desktop 504px | Mobile 327px
padding: space-cat 24px; gap: space-cat 24px;
background: background-card #fff;
border-radius: 2px (Rounded=True → 8px);
box-shadow: var(--shadow-l, 0 4px 32px -8px rgba(0,0,0,.16));
```

* Titel `Headlines/h4` 24px, Beschreibung `body-m` 16 / 22.4 `text-secondary #707070`.
* Optionales Icon (24px) und Helper-Text (`body-s`).
* **Buttons:** Desktop nebeneinander rechtsbündig (Secondary links, Primary rechts) · Mobile gestapelt volle Breite, Primary **oben**.
* Overlay: Helper-Komponente `Backdrop 812:6482`.

---

### 12.15 Inline Notification `3746:14998`

**Achsen:** `Breakpoint` × `Type` (Info/Error/Warning/Success) × `Rounded`.

```
padding: space-frog 12px; gap: 8–12px;
border-radius: 2px (Rounded=True → 16px);
Icon: 20–24px, Titel body-m-bold, Text body-m-copy, Action-Link body-s-bold
Breite: Desktop 790px | Mobile 283px (Referenz)
```

| Type | Hintergrund | Textfarbe | Icon |
|---|---|---|---|
| Info | `status-light-bg-info #e6f3fb` | `status-text-info-on-light-bg #0d4d77` | `info_circle` |
| Success | `status-light-bg-success #effbdc` | `status-text-success-on-light-bg #3c6a00` | `check_circle` |
| Warning | `status-light-bg-warning #fff6d9` | `status-text-warning-on-light-bg #5f4911` | `warning` |
| Error | `status-light-bg-error #ffe4e1` | `status-text-error-on-light-bg #7e1205` | `cancel_circle` |

* Optionaler Action-Link mit `arrow_right`, optionales Trailing-Icon (Schliessen).
* Live-Region setzen: `role="status"` (Info/Success) bzw. `role="alert"` (Error/Warning).

---

### 12.16 Tooltip `191:361` + Info Icon `440:2407`

```
width: 288px;
padding: 16px 20px 16px 8px;   /* py space-rat, pr space-chicken, pl space-snail */
background: background-card #fff;
border: 1px solid border-card #e0e0e0;
border-radius: 2px (Rounded=True → 16px);
box-shadow: 0 4px 16px rgba(0,0,0,.16);
```
* Titel `Headlines/h4` 24px, Text `body-m` 16, optionaler Link `interactive-primary #9a0941`.
* Schliessen-Icon (`close`, 24px) oben rechts.
* `.Caret 188:530` in 4 Richtungen, ca. `20px` Kantenlänge (rotiertes Quadrat 28.28px).
* `Placement`: Top · Left · Right · Bottom · Default.
* **Info Icon** trägt den Tooltip und bietet 8 Positionierungen.

---

### 12.17 Tab Pills `3305:3684` und Filter Pills `3305:4159` / `.Pill 3025:689`

**Tab Pills** – Tabs teilen die Breite gleichmässig:

```
Container: display:flex; gap: space-snail 8px;
Tab:       flex: 1 0 0; min-width: 0; height: 36px;
           padding: space-bee 4px space-frog 12px;
           border-radius: 9999px;
```
| Zustand | Hintergrund | Text |
|---|---|---|
| Aktiv | `interactive-primary-hover #ad0b49` | `body-m-bold`, `#fff` |
| Inaktiv | `background-card #fff` | `body-m`, `text-primary #202020` |

**`.Pill` (Filter)** – `Type` (Label/Icon) × `State` (Default/Active) × `On decorative bg`:

```
height: 36px; border-radius: 9999px;
Type=Label: padding: 4px 12px;
Type=Icon:  36 × 36px, padding 4px, Icon 24px
```
| Zustand | Hintergrund | Text |
|---|---|---|
| Default | `background-subtle-neutral #f8f8f8` (auf dekorativem BG: `background-card #fff`) | `body-m`, `#202020` |
| Active | `interactive-primary-hover #ad0b49` | `body-m-bold`, `#fff` |

`Filter Pills` bündelt 2–8 Pills plus optionalen „More Options"-Trigger.

---

### 12.18 Stepper `2498:1483`

**`.Stepper/Steps 2495:525`** – `Breakpoint` × `Position` (First/Middle/Last) × `Status` (Inactive/Current/Done):

```
Kreis:     24 × 24px; border-radius: 9999px;
Connector: height 2px; width 56px (Mobile) / 100px (Desktop);
Label:     body-s 14 / 19.6
```

| Status | Kreis | Label |
|---|---|---|
| Inactive | `background border-light #e0e0e0`, Nummer `text-secondary #707070` | `text-secondary` |
| Current | `background text-primary #202020`, Nummer `background-device #fff` | `body-s-bold`, `text-primary` |
| Done | `background status-success #5e9801`, Haken 16px weiss | `text-primary` |

Connector: erledigte Abschnitte `status-success`, offene `border-light`.
`Stepper` selbst: `Step = 1…5 | Complete`.

---

### 12.19 Breadcrumb `2753:2493` + `.Breadcrumb Parts 2753:2478`

```
padding-block: space-ant 2px;
font: body-s 14 / 19.6;
```
| State | Farbe |
|---|---|
| Default | `text-primary #202020` |
| Hover / Current | `text-secondary #707070` |

* `Level = 1…8`, `Breakpoint = Desktop | Mobile` (Mobile kürzt auf die letzte Ebene mit `chevron_left`).
* Aktuelle Seite als `aria-current="page"`, nicht verlinkt.

---

### 12.20 Header `2629:4395` + `.Menu Item 2627:5692`

**`.Menu Item`** nutzt den Textstyle `Specific/nav` (Font `font-family-headlines`, Weight 300):

| | Desktop | Mobile |
|---|---|---|
| Höhe | `52px` | `48px` |
| Padding | `padding-bottom: space-cat 24px` | `padding-inline: space-cat 24px`, Breite 375px |
| Schrift | `20px / 28px` | `32px / 40px` |
| Active-Indikator | Balken `48 × 4px` unterhalb | Balken `4 × 48px` links, gap `space-chicken 20px` |

| State | Farbe |
|---|---|
| Default | `text-primary #202020` |
| Hover / Active / Focus | `text-nav-selected #9a0941` |
| Dropdown | `text-primary` + `chevron_down` 24px, gap `space-bee 4px` |
| Focus | Focus-Ring (Desktop: `inset -5px -5px 12px -5px`) |

**Header** kombiniert: `Helsana-Logo`, `Header Nav`, `Icon Button` (Suche/Burger), `.Menu Accordion`, `.Meta Nav Link`.
`State = Default | Expanded` (Mobile-Overlay-Navigation).

---

### 12.21 Footer `2353:1587`

`Breakpoint = Desktop | Mobile`.

```
Hintergrund: background-device #fff
Trennlinien: 1px border-light #e0e0e0
Padding:     space-dog 32px (Block) / space-donkey 40px (unten)
Spaltenabstand: space-cat 24px, Zeilenabstand space-rat 16px
```

| Element | Typografie |
|---|---|
| Spaltenüberschrift | `body-m-bold` 16 / 22.4 |
| Link | `body-m` 16 / 22.4, `text-primary #202020` |
| Sprachumschalter | `body-s` 14 / 19.6 |
| Rechtliche Hinweise / Copyright | `helper-m` 12 / 16.8 |

| Sub-Komponente | Node-ID | Inhalt |
|---|---|---|
| `.Legal Links` | `2351:1977` | Impressum, Datenschutz, optional Nutzungsbestimmungen |
| `.Language Switch` / `.Language Item` | `2351:1812` / `2359:8018` | DE / FR / IT / EN, `State = Default` · `Active` |
| `.Social Icons` | `2351:1815` | Social-Media-Icon-Reihe |

---

### 12.22 Date Picker `3022:1704`

```
background: background-card #fff;
border: 1px solid border-card #e0e0e0;
border-radius: 2px (Rounded=True → 16px);
box-shadow: var(--shadow-l, 0 4px 32px -8px rgba(0,0,0,.16));   /* nur Type=Popover */
padding/gap: space-frog 12px · space-rat 16px · space-chicken 20px · space-cat 24px
```

| Element | Typografie / Stil |
|---|---|
| Monats-/Jahrestitel | `Headlines/h5` 20 / 27, Bold |
| Wochentagskürzel | `body-s-bold` 14 / 19.6, `text-tertiary #949494` |
| Tageszahl | `body-l` 18 / 25.2 · ausgewählt `body-l-bold` |
| `.Picker Item` `3020:266` | Kreis `border-radius: 9999px`; States `Default` · `Hover` · `Selected` · `Current` · `Disabled` · `Null` |
| Selected | `background: interactive-primary #9a0941`, `color: text-on-interactive-primary #fff` |
| Current | Rahmen in `text-nav-selected #9a0941` |
| Disabled | `text-disabled #b2b2b2` |
| `.Week` `3020:363` | Zeilen-Wrapper (7 Picker Items) |

`Type = Inline` · `Popover` — `View = Day` · `Month` · `Year` — `Rounded = False` · `True`

---

### 12.23 Weitere Komponenten

| Komponente | Node-ID | Kurzspezifikation |
|---|---|---|
| **Form Attachment** | `668:3705` | Upload-Feld. `State = Default` · `Active/Focus` · `Error (Field)` · `Error (Attachment)` · `Disabled`; `Buttons = 1` · `2`. Infotext: „Sie können bis zu 6 JPG- oder PDF-Dateien (max. 10 MB) hochladen." |
| **Attachment** | `1068:1350` | Datei-Chip: `background-medium-neutral #f2f2f2`, Radius 2px (Rounded=True → 8px), Padding `space-rat 16px`, gap `space-snail 8px`. Dateiname `body-m`, Grösse `body-m-bold`. Fehlerzustand: `status-light-bg-error #ffe4e1` + `status-text-error-on-light-bg #7e1205`. Disabled `text-disabled #b2b2b2`. |
| **Bottom-Up-Sheet** | `13600:1764` | Mobile-Sheet mit Backdrop. |
| **Checkbox-Box** | `1682:5482` | Auswahlkarte mit Checkbox, `Show Title`, `Rounded` (2 / 4px). |
| **Single Select / Single Select A** | `4676:2353` / `4797:959` | Segmented Control, 2–8 Optionen. 🟠 WIP – noch nicht produktiv nutzen. |
| **Backdrop** | `812:6482` | Overlay hinter Dialog / Sheet. |
| **Media Placeholder / Slot** | `703:8486` / `842:5090` | Platzhalter im Design, nicht implementieren. |

---

### 12.24 CSS-Referenzimplementierung

```css
/* ---------- Button ---------- */
.u-btn {
  display: inline-flex; align-items: center; justify-content: center;
  gap: var(--space-snail);
  min-height: 56px; min-width: 56px;
  padding: var(--space-rat) var(--space-dog);
  font: var(--body-m-bold);
  border: none; border-radius: var(--border-radius-2px);
  cursor: pointer; text-decoration: none;
}
.u-btn--small { min-height: 40px; min-width: 40px;
  padding: var(--space-snail) var(--space-rat); font: var(--body-s-bold); }
.u-btn--rounded { border-radius: var(--border-radius-full); }

.u-btn--primary { background: var(--interactive-primary); color: var(--text-on-interactive-primary); }
.u-btn--primary:hover,
.u-btn--primary:active { background: var(--interactive-primary-hover); }
.u-btn--primary:disabled { background: var(--interactive-disabled); color: var(--text-on-interactive-disabled); cursor: not-allowed; }

.u-btn--secondary { background: transparent; color: var(--interactive-primary);
  border: var(--border-width-m) solid var(--interactive-primary); }
.u-btn--secondary:hover,
.u-btn--secondary:active { border-width: var(--border-width-l); border-color: var(--interactive-primary-hover); }
.u-btn--secondary:disabled { border-color: var(--interactive-disabled); color: var(--text-on-interactive-disabled); }

/* Focus-Ring – gilt für alle Komponenten */
.u-btn:focus-visible,
.u-input:focus-visible,
.u-link:focus-visible { outline: none; }
.u-btn:focus-visible::after,
.u-link:focus-visible::after {
  content: ""; position: absolute; inset: -5px;
  border: var(--border-focus-width) solid var(--border-focus);
  border-radius: 7px;
}

/* ---------- Input ---------- */
.u-input {
  display: flex; align-items: center; gap: var(--space-snail);
  height: 56px; width: 100%;
  padding: var(--space-rat);
  background: var(--background-device);
  color: var(--text-primary);
  font: var(--body-m);
  border: var(--border-width-s) solid var(--border);
  border-radius: var(--border-radius-2px);
}
.u-input::placeholder { color: var(--text-tertiary); }
.u-input:focus { border-width: var(--border-width-m); border-color: var(--border-focus); }
.u-input[aria-invalid="true"] { border-color: var(--status-error); }
.u-input:disabled { border-color: var(--border-light); color: var(--text-disabled); }
.u-input--rounded { border-radius: var(--border-radius-8px); }

.u-input-error {
  display: flex; align-items: center; gap: var(--space-bee);
  font: var(--body-s); color: var(--status-text-error);
}

/* ---------- Pill / Tab ---------- */
.u-pill {
  display: inline-flex; align-items: center; justify-content: center;
  height: 36px; padding: var(--space-bee) var(--space-frog);
  border-radius: var(--border-radius-full);
  background: var(--background-subtle-neutral);
  color: var(--text-primary); font: var(--body-m);
  border: none; cursor: pointer;
}
.u-pill[aria-selected="true"],
.u-pill--active { background: var(--interactive-primary-hover);
  color: var(--text-on-interactive-primary); font: var(--body-m-bold); }

/* ---------- Toggle ---------- */
.u-toggle { width: 64px; height: 28px; padding: 2px;
  display: flex; align-items: center;
  background: var(--text-tertiary); border-radius: var(--border-radius-full);
  border: none; cursor: pointer; }
.u-toggle[aria-checked="true"] { background: var(--status-success); justify-content: flex-end; }
.u-toggle__knob { width: 36px; height: 24px; border-radius: var(--border-radius-full);
  background: var(--constant-white); box-shadow: var(--shadow-s); }
.u-toggle:disabled { background: var(--interactive-disabled); }
.u-toggle:disabled .u-toggle__knob { background: var(--text-on-interactive-disabled); }

/* ---------- Inline Notification ---------- */
.u-notification {
  display: flex; gap: var(--space-frog); padding: var(--space-frog);
  border-radius: var(--border-radius-2px);
}
.u-notification--info    { background: var(--status-light-bg-info);    color: var(--status-text-info-on-light-bg); }
.u-notification--success { background: var(--status-light-bg-success); color: var(--status-text-success-on-light-bg); }
.u-notification--warning { background: var(--status-light-bg-warning); color: var(--status-text-warning-on-light-bg); }
.u-notification--error   { background: var(--status-light-bg-error);   color: var(--status-text-error-on-light-bg); }
```

---

### 12.25 Implementierungs-Checkliste pro Komponente

- [ ] Alle States abgebildet: `Default | Hover | Active | Focus | Disabled` (+ `Error`)
- [ ] Focus ausschliesslich über `:focus-visible`, Ring `1px #202020`, Offset 5px
- [ ] Nur Semantic Tokens verwendet – keine Hex-Werte im Komponenten-CSS
- [ ] `Rounded`-Variante als Modifier-Klasse, Default = eckig (2px)
- [ ] Responsives Verhalten laut `Breakpoint`-Variante (nicht selbst erfunden)
- [ ] Touch-Target ≥ 44 × 44px (Icon Button: exakt 44px)
- [ ] ARIA: `aria-expanded` (Accordion/Dropdown), `aria-current` (Breadcrumb/Nav), `aria-invalid` + `aria-describedby` (Formularfelder), `role="alert"`/`"status"` (Notification), `aria-checked` (Toggle)
- [ ] Disabled-Elemente aus der Tab-Reihenfolge entfernen
- [ ] Kontrast geprüft in allen 4 Modi (light, light-hc, dark, dark-hc)

---

## 13. Accessibility

- Fokus ist **immer sichtbar** und folgt genau **einem** Muster (siehe 12.2):
  `outline: var(--border-focus-width, 1px) solid var(--border-focus)` mit `outline-offset: 5px`.
  `border-focus` ist Light = `neutral-800 #202020`, Dark = `neutral-100 #F8F8F8` – **nie** Markenmagenta.
- Fokus nur über `:focus-visible` ausspielen, nie über `:focus` (sonst erscheint der Ring auch bei Mausklick).
- `outline: none` ohne gleichwertigen Ersatz ist verboten.
- `text-tertiary` ist **nur für Placeholder** zulässig – nicht für Fliesstext.
- Für WCAG-AAA-Anforderungen die `-hc`-Modi aktivieren (`data-color-mode="light-hc"` bzw. `"dark-hc"`).
- Statusfarben nie als alleiniger Bedeutungsträger – immer Icon + Text.
- Touch-Targets min. **44 × 44 px**. Der Icon Button ist exakt 44 px, der Button 56 px. Bei kleineren Zielen die Fläche per Padding oder Pseudo-Element vergrössern.
- Zeilenlänge: bei > ~75 Zeichen `body-m-copy` (150 % Line-height) statt `body-m` verwenden.
- Disabled-Elemente aus der Tab-Reihenfolge nehmen; `aria-disabled` nur, wenn das Element fokussierbar bleiben soll.

---

## 14. Checkliste vor jedem Commit

- [ ] Keine Hex-Codes im Komponenten-Code – nur Semantic Tokens
- [ ] Keine Primitive-Tokens (`brand-500`, `neutral-300`, …) direkt im UI
- [ ] Keine Doku-Template-Artefakte übernommen (`--p-border-radius-*`, `Colors/specs-*`) – siehe 12.2
- [ ] Alle Abstände aus der Tier-Skala
- [ ] Radius: 2 px Default / 4 px Cards / `full` nur für Pills & Avatare; `Rounded=True` nur bewusst gesetzt
- [ ] Nur `Akkurat Helsana` mit 300/400/700 – keine 500/600/800
- [ ] Light **und** Dark Mode geprüft
- [ ] Fokus-States sichtbar und getestet (Tastatur): 1 px `border-focus`, Offset 5 px, `:focus-visible`
- [ ] Button-Höhe 56 px (Large) bzw. 40 px (Small) – auch bei Secondary mit 2/4 px Border
- [ ] Icons als Material Symbols **Rounded**, 16/24/32 px
- [ ] Offizielles Logo-SVG, kein Text-Nachbau
- [ ] Container-Paddings 16 / 32 / 40 px je Breakpoint, Gutter 16 px

---

## 15. Figma-Referenzen (für MCP-Zugriff)

### 15.1 Foundations – `💠 Unify – 🎨 Styles & Assets`

fileKey: `KSBYcbxHL2anWuXKGZ6jtm`

| Page | node-id |
|---|---|
| 📕 Getting started | `147:2913` |
| 🎨 Color | `3:2` |
| 🅰️ Typography | `195:689` |
| ↔ Spacings | `87:2088` |
| 📐 Grid | `40398:141` |
| 🔳 Borders | `195:690` |
| 🔍 Shadows & Effects | `38874:2652` |
| 🖼️ Assets | `39027:998` |
| 🛠 DS Resources | `5:1205` |

### 15.2 Komponenten – `💠 Unify – 🧱 Core Components`

fileKey: `FdDnzKBAvua0vvJr4AY6Lf`

| Page | page-node-id |
|---|---|
| 📕 Getting Started | `8:974` |
| Button | `0:1` |
| Icon Button | `846:7754` |
| Action-Link | `1456:244` |
| Input Field | `576:6098` |
| Text Area | `576:6149` |
| Select | `707:7525` |
| Checkbox | `45:428` |
| Radio Button | `84:818` |
| Toggle | `812:5671` |
| Accordion | `1640:920` |
| Dialog | `812:6216` |
| Inline Notification | `3745:9` |
| Tooltip | `264:1088` |
| Tab Pills | `3331:1943` |
| Filter Pills | `2191:9275` |
| Stepper | `2191:9383` |
| Breadcrumbs | `2191:6912` |
| Header | `2191:7840` |
| Footer | `2191:7732` |
| Date Picker | `2191:7624` |
| Form Attachment | `576:6150` |
| Bottom Sheet | `769:7181` |
| Single Select 🟠💛 | `2517:517` |
| 🧩 Helper Components | `806:6312` |
| (Loading-Indicator) 🟠 | `3905:1447` |
| 🗑️ Archive | `873:7771` |

> Die letzten beiden Pages enthalten WIP- bzw. abgekündigte Komponenten und sind **nicht** produktiv zu verwenden.

> Die Node-IDs der einzelnen Komponenten stehen in Kapitel 12.3.
> Schnellster Einstieg per MCP: `list_file_components_for_code_connect` mit dem fileKey liefert alle 54 Komponenten inkl. Node-IDs und Varianten-Properties.
