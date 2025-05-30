# Chaos Machine


## Description
Chaos Machine gives meaning to your life. Chaos Machine spews out only the best output, taken from texts, scripts, sounds and images. User interaction has arrived. Randomness is not chaos. Chaos is not madness. 

Android: Java / WebView / JavaScript 
Prototype written in Python, switched to JavaScript for compatibility with WebView / Android

### Alternative app title
Click Me. Click Me gives meaning to your life...





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


## VSCode

Build Chaos Machine app in terminal:
```
$ runchaos
```

Added to ~/.bashrc:
```
alias runchaos='set -e; ./gradlew assembleDebug && adb install -t -r app/build/outputs/apk/debug/app-debug.apk && adb shell am start -n com.chaosmachine.webview/.MainActivity'
```

