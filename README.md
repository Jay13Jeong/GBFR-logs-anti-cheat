# gbfr-anti-cheat

[![GitHub Release](https://img.shields.io/github/v/release/Jay13Jeong/GBFR-logs-anti-cheat)](https://github.com/Jay13Jeong/GBFR-logs-anti-cheat/releases)
[![GitHub Downloads](https://img.shields.io/github/downloads/Jay13Jeong/GBFR-logs-anti-cheat/total)](https://github.com/Jay13Jeong/GBFR-logs-anti-cheat/releases)
[![GitHub Discussions](https://img.shields.io/github/discussions/Jay13Jeong/GBFR-logs-anti-cheat)](https://github.com/Jay13Jeong/GBFR-logs-anti-cheat/discussions)
[![GitHub License](https://img.shields.io/github/license/Jay13Jeong/GBFR-logs-anti-cheat)](./LICENSE)

- Added cheat detection functionality for GBFR version 1.3.1.
- This program identifies the potential for cheating among party members.
- ** If there is a wrong detection while using this, please leave your comment [here](https://github.com/Jay13Jeong/GBFR-logs-anti-cheat/issues).
- This project was developed based on [false-spring/gbfr-logs](https://github.com/false-spring/gbfr-logs).

## How to install

- Go to [Releases](https://github.com/Jay13Jeong/GBFR-logs-anti-cheat/releases)
- Download the latest .msi installer and run it.
- Open GBFR Logs after the game is already running.

## Screenshots

### Skill Tracking

![캡처2](https://github.com/Jay13Jeong/GBFR-logs-anti-cheat/assets/63899204/848800d9-7db2-49e4-8c67-c9153b90e141)

![Meter](./docs/screenshots/skill-tracking.png)

### Equipment Tracking

![캡처4](https://github.com/Jay13Jeong/GBFR-logs-anti-cheat/assets/63899204/05793bdc-e992-4f80-969b-11b38873ba33)

### Multi-language Support

![Simplified Chinese](./docs/screenshots/simplified-chinese.png)

## Frequently Asked Questions

> Q: I closed the meter, but it's still running?

When you close the windows, GBFR Logs continues to run in your task tray in the bottom right of your desktop.

This task tray functionality is meant to give you more options for customizing:

- This lets you close the logs window, but be able to reopen it again later.
- You can toggle clickthrough of the overlay as well.

> Q: The meter isn't updating or displaying anything.

Try running the program after the game has been launched. Be sure to run the program as admin.

> Q: The application is not working / launching.

GBFR Logs uses your built-in Microsoft Edge Webview2 Runtime to run the application. This keeps the app relatively small as we don't have to package in a browser.

However, you may have an out-of-date or missing "Webview2 Runtime":

- Install the latest one from Microsoft: https://developer.microsoft.com/en-us/microsoft-edge/webview2/?form=MA13LH#download (Evergreen Bootstrapper should work here)

> Q: Is this safe? My antivirus is marking the installation as a virus / malware.

As always, this is up to you to trust GBFR Logs. The program can trigger false positive flags. There are reasons why it can give such alerts:

- GBFR Logs does code DLL injection into the running game process which can look like a virus-like program.
- GBFR Logs reads game memory and modifies game code at runtime in order to receive parser data.
- I recommend adding an exception / whitelisting for the installation folder so that your anti-virus does not delete it while your game is running, but you may not need to do so if you haven't ran into this issue.

See [how to add an exclusion to Windows Defender](https://support.microsoft.com/en-us/windows/add-an-exclusion-to-windows-security-811816c0-4dfd-af4a-47e4-c301afe13b26).

> Q: How do I uninstall?

You can uninstall GBFR Logs the normal way through the Control Panel or by running the uninstall script in the folder where you installed it to. You may also want to remove these folders.

- `%AppData%\gbfr-logs`

> Q: My issue isn't listed here, or I have a suggestion.
- Please leave your comments [here](https://github.com/Jay13Jeong/GBFR-logs-anti-cheat/discussions).

## For Developers

- Install nightly Rust ([rustup.rs](https://rustup.rs/)) + [Node.js](https://nodejs.org/en/download).
- Install NPM dependencies with `npm install`
- `npm run tauri dev`

## Under the hood

This project is split up into a few subprojects:

- `src-hook/` - Library that is injected into the game that broadcasts essential damage events.
- `src-tauri/` - The Tauri Rust backend that communicates with the hooked process and does parsing.
- `protocol/` - Defines the message protocol used by hook + back-end.
- `src/` - The JS front-end used by the Tauri web app

## Disclaimer

Please keep in mind that this tool is meant to improve the experience that Cygames has provided us and is not meant to cause them or anyone other players damage. GBFR Logs modifies your running game client and is not guaranteed to work after game patches, in which case you may experience instability or crashes.


