# Chaos Machine

## Interface
- `ToDo:` style app title (Chaos Machine)
- `ToDo:` splash screen
- `ToDo:` icons


## Modules
### FixMe
- `FixMe:` color modules:
  - `ToDo:` padding
  - `ToDo:` delay before name color appears
  - `ToDo:` random colors
 

### ToDo
- `ToDo:` ContinueCountdown.js
  - Counter to default (100 - 0)
  - Continue (y/n)
  - Y: Continuing counter
  - N: skip rest of module

- `ToDo:` BartModule.js
  - graph -> square
  - x + y: personal, public, private, professional
  - add time for third dimension

- `ToDo:` PoemReader.js
  - `ToDo:` read .txt file
  - `ToDo:` one .txt file per poem
  - `ToDo:` create PoemTemplate to use for individual poems

- `ToDo:` RandomCalculations.js

- `ToDo:` NameTaker.js
  - `ToDo:` prompt for name
  - `ToDo:` print: so, your name is 'x'. why don't I believe you

- `ToDo:` ImageViewer.js
  - `ToDo:` image directory

- `Abandoned:` RandomClock.js


## Directory Structure
- Updated 2025-05-12

```
ChaosMachineWebView/
├── assets/
│   ├── css/
│   │   └── styles.css
│   ├── fonts/
│   │   ├── RobotoMono-Bold.ttf
│   │   ├── RobotoMono-Bold.woff2
│   │   ├── RobotoMono-Regular.ttf
│   │   └── RobotoMono-Regular.woff2
│   ├── js/
│   │   ├── core/
│   │   │   ├── modules/
│   │   │   │   ├── colors/
│   │   │   │   │   ├── ColorDarkBlue.js
│   │   │   │   │   ├── ColorDarkOrange.js
│   │   │   │   │   └── ColorDarkRed.js
│   │   │   │   ├── poetry/
│   │   │   │   │   ├── HaikuElastiek.js
│   │   │   │   │   └── HaikuMat.js
│   │   │   │   ├── shared/
│   │   │   │   ├── └── randomPercentager.js
│   │   │   │   ├── tools/
│   │   │   │   ├── └── ShowProgress.js
│   │   │   │   └── ModuleTemplate.js
│   │   │   └── ChaosMachine.js
│   │   └── app.js
│   └── index.html
├── .gitignore
├── CHANGELOG.md
└── README.md
```


## Description
Chaos Machine is an art project that spews out random output taken from texts, scripts, sounds and images. User interaction is coming. Randomness is not chaos. Chaos is not madness.

Android: Java / WebView / JavaScript 
Prototype written in Python, switched to JavaScript for compatibility with WebView / Android


## Version number
MAJOR.MINOR.PATCH (SemVer)
See for current version number:
- changelog.md
- app/build.gradle


## Vulnerabilities
- `Done:` ./shared/randomPercentager.js (script in index.html)
  - `Done:` moved randomPercentager to ./modules/shared/
- `Done:` MainActivity.java:
  - webSettings.setJavaScriptEnabled(true);
  - `Note:` fix needed if using external sources for texts, images
