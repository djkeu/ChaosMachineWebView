# Chaos Machine

## Version number
MAJOR.MINOR.PATCH (SemVer) 
See for current version number:
- changelog.md
- app/build.gradle

## Description
Chaos Machine is an art project that spews out random output taken from texts, scripts, sounds and images. User interaction is coming. Randomness is not chaos. Chaos is not madness.

Android: Java / WebView / JavaScript 
Prototype written in Python, switched to JavaScript for compatibility with WebView / mobile apps

## ToDo
### Vulnerabilities
- FixMe: MainActivity.java:
  - webSettings.setJavaScriptEnabled(true);
- FixMe: ./shared/randomPercentager.js (script in index.html)

### Interface
- ToDo: ChaosMachine.js
  - delays module headers

- TODO: style app title (Chaos Machine)

- Done: Start button to start the machine
- Done: Stop button to stop the machine

### Modules
- Note: ModuleTemplate.js is not accurate

- FixMe: delays in HaikuModules
- FixMe: delays in ShowProgress should match percentages: test

- ToDo: BartModule.js
  - graph -> square
  - x + y: personal, public, private, professional
  - add time for third dimension

- ToDo: ShowColorBlock.js
  - ToDo: display block of random color
    - Note: text file with color names?
  - ToDo: display name/code of color in block in white/black letters
  - ToDo: animation

- ToDo: RandomClock.js

- ToDo: PoemReader.js
  - ToDo: read .txt file
  - ToDo: one .txt file per poem
  - ToDo: create PoemTemplate to use for individual poems

- ToDo: RandomCalculations.js

- ToDo: ImageViewer.js
  - ToDo: image directory

- ToDo: NameTaker.js
  - ToDo: prompt for name
  - ToDo: print: so, your name is 'x'. why don't I believe you

## Directory Structure
- ToDo: update to WebView directory structure

```
chaos_machine/
├── web/
│   ├── css/
│   │   └── styles.css
│   ├── js/
│   │   ├── core/
│   │   │   ├── modules/
│   │   │   │   ├── poetry/
│   │   │   │   │   ├── HaikuElastiek.js
│   │   │   │   │   └── HaikuMat.js
│   │   │   │   ├── tools/
│   │   │   │   ├── └── ShowProgress.js
│   │   │   │   └── ModuleTemplate.js
│   │   │   └── ChaosMachine.js
│   │   └── app.js
│   └── index.html
├── .gitignore
└── README.md
```
