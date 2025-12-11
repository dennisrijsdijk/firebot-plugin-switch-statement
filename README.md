# Archival Notice

This repository has been archived, since this feature is now available in the stable release of Firebot v5.

Firebot's builtin effect has the ability to duplicate Cases in the Switch Case Effect, so migrating to it may be desirable.

To migrate plugin Switch effects to Firebot's native effect, follow these steps:
- Create a backup and move it outside of Firebot's directory (eg. to your desktop)
- Remove the script from Firebot and delete the script file from the data folder
- Go to Data Folder, and open it in VSCode or another text editor which does find & replace across a whole directory
- Close Firebot
- search for `dennisontheinternet:switch-statement`
- replace all with `firebot:switch-statement`
- Open Firebot and verify the switch case effects now have the ability to duplicate the cases

## Firebot Switch Statement

This Firebot plugin adds a Switch Statement effect, which is a simplified version of the "Conditional Effects" effect.

## Features

- Text/Number Comparison
- Number Range
- Fallthrough Cases

## Installation

- Download the `firebot-switch.js` file from the [releases](https://github.com/dennisrijsdijk/firebot-plugin-switch-statement/releases) page
- In Firebot, go to Settings > Scripts and enable Custom Scripts if not already enabled
- Click "Manage Startup Scripts", then click "Add New Script"
- Click on the hyperlink "scripts folder" and copy the downloaded `firebot-switch.js` to the folder.
- In Firebot, click the refresh button, then select `firebot-switch.js`
- Click Save
