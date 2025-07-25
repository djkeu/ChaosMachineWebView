# Changelog
Changelog for Chaos Machine

## [0.6.10] - 2025-05-25
### Added
- changeOutputBgColor.js: changes background of the output div
### Changed
- rename ColorCmBackground.js to changeBodyBgColor.js
- rename class, button in changeBodyBgColor.js

---

## [0.6.9] - 2025-05-25
### Added
- create js/core/shared folder
### Fixed
- create fileLoader.js to allow use of local .txt, .json and image files
- ColorCmBackground.js: use colors.txt to load colors
### Changed
- move GetRandomNumbers.js to js/core/shared

---

## [0.6.8] - 2025-05-24
### Fixed
- show_progress.js: prevent 99% from showing as last result of loop
### Changed
- ChaosMachine.js: comment out display of `--- Running ${module.name} ---`

---

## [0.6.7] - 2025-05-23
### Changed
- combine all Color modules into one module (ColorCmBackground.js)
- click coloredSquare to change background Chaos Machine
- style coloredSquare

---

## [0.6.6] - 2025-05-21
### Changed
- replace Dutch haiku HaikuMat with HaikuBrokenPhone
- replace HaikuElastiek with HaikuCodeDance

---

## [0.6.5] - 2025-05-18
### Changed
- New app icons
- margin top app title (Chaos Machine)

---

## [0.6.4] - 2025-05-16
### Changed
- Color modules:
  - add delay before display of color name in squares
- ShowProgress.js:
  - Delay 'Show progress:'
  - Delay 'Progress 100%'

---

## [0.6.3] - 2025-05-15
### Fixed
- ModuleContainer.js:
  - Start/stop routine
### Changed
- GetRandomNumbers.js:
  - return number instead of percentage
  - rename to GetRandomNumbers.js
  - getRandomPercentage() -> getRandomNumber()
  - relink modules, index.html
- Color modules:
  - style

---

## [0.6.2] - 2025-05-14
### Changed
- ShowProgress.js:
  - wait before display of progress in loop
  - length wait matches percentage progress
  - total run module: 10 seconds
- Style App title

---

## [0.6.1] - 2025-05-13
### Changed
- ChaosMachine.js:
  - delay === Chaos Machine Started ===
  - delays module headers
### Fixed
- ChaosMachine.js: clean up stopping routine after Stop button is clicked

---

## [0.6.0] - 2025-05-12
### Added
- ColorDarkOrange.js
- ColorDarkGreen.js

---

## [0.5.1] - 2025-05-09
### Fixed
- Vulnerability setJavaScriptEnabled in MainActivity.java
- Vulnerability global randomPercentager.js

---

## [0.5.0] - 2025-05-09
### Changed
- randomPercentager.js:
    - Randomize position, fontSizes in color modules

---

## [0.4.1] - 2025-05-07
### Added.
- Modules category: Colors
- ColorDarkBlue.js
- ColorDarkRed.js
### Changed
- Width, height darkRed square.
- Position top, left of darkRed square.

---

## [0.3.0] - 2025-05-01
### Added
- Modules category: Tools
- ShowProgress.js

---

## [0.2.0] - 2025-05-01
### Added
- Modules category: Poetry
- HaikuElastiek.js
- HaikuMat.js

---

## [0.1.0] - 2025-04-xx
- First beta release.

---


# About Changelog.md

## [2.x.x]-date  // MAJOR.MINOR.PATCH-date
### Added
- (New features, modules, or UI elements).
### Changed
- (Existing functionality updates).
### Fixed
- (Bug fixes).
### Removed
- (Deprecated or removed features).

---
