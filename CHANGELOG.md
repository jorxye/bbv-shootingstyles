# Changelog

## 1.1.0-fork

- Added `config.lua`.
- Moved client logic to `client/main.lua`.
- Rebuilt NUI with vanilla JavaScript and responsive CSS.
- Removed external CDN dependencies.
- Removed hardcoded NUI resource name.
- Added selected style persistence with client KVP.
- Added client exports and events.
- Added style validation in NUI callbacks.
- Added animation dictionary cache.
- Replaced broad `ClearPedTasks` usage with safer `StopAnimTask` where possible.
- Added configurable decorator name and loop intervals.
- Improved README, troubleshooting and integration examples.
