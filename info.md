# Architektura webu: React Portfolio Template z GH
- Moderní webový stack založený na Reactu a Tailwind CSS
- Výsledkem je responzivní a upravitelný web
  
## Architektura stacku
+------------------------------------------------------+
|                Webový prohlížeč                      |
|               (Chrome, Firefox, Edge...)             |
+---------------------------+--------------------------+
                            |
                            ▼
+------------------------------------------------------+
|               Frontend: React (HTML/CSS/JS)          |
|                                                      |
| - JSX komponenty (App, Header, Hero, Projects, ...)  |
| - Stylování pomocí Tailwind CSS                      |
| - Responsivní design                                 |
| - JavaScript logika                                  |
| - Stavová data (např. active section, dark mode)     |
+------------------------------------------------------+
                            |
                            ▼
+------------------------------------------------------+
|              Build Tool: Vite                        |
| - Zajišťuje rychlé načítání během vývoje             |
| - Kompiluje a optimalizuje kód pro produkci          |
| - Spouští lokální vývojový server (localhost)        |
+------------------------------------------------------+
                            |
                            ▼
+------------------------------------------------------+
|              Nasazení: GitHub Pages / Netlify        |
| - Umožňuje web publikovat online                     |

| - Zdarma pro studenty                                |
+------------------------------------------------------+


## Struktura složek 

📁 react-portfolio-template/
├── 📁 public/               # statické soubory (favicon, index.html)
├── 📁 src/
│   ├── 📁 components/       # jednotlivé části webu (Hero, Navbar, ...)
│   ├── 📁 data/             # osobní data uživatele (projekty, odkazy)
│   ├── 📁 hooks/            # vlastní React hooky (např. detect section)
│   ├── App.jsx             # hlavní komponenta
│   └── index.js            # start aplikace
├── 📄 tailwind.config.js   # konfigurace Tailwindu
├── 📄 vite.config.js       # konfigurace buildu
└── 📄 package.json         # seznam balíčků a skriptů


## Co se naučíme

- Práce s komponentovým systémem Reactu (JSX, props, state)
- Stylování pomocí Tailwind CSS bez psaní vlastního CSS
- Úprava šablon pro vlastní účely (projekty, texty, odkazy)
- Používání Gitu a GitHubu (klonování, úpravy, commit, push)
- Nasazení stránky online přes GitHub Pages nebo Netlify


## Odkazy

> Webová šablona (DEMO): [DEMO](https://reactportfoliotemplate.paytonpierce.dev)
> GitHub repozitář: [GitHub Projekt](https://github.com/paytonjewell/ReactPortfolioTemplate)