
# Driver Safety App - Prototype Smoke Test

It is recommended to perform the following smoke tests before demonstrating the prototype or creating a pull request.

## Check Project Setup

* [X] Clone the latest project from GitHub.

* [X] Install project dependencies.

```bash
npm install
```

* [X] Build the Ionic application.

```bash
ionic build
```

* [X] Sync the Capacitor Android project.

```bash
npx cap sync android
```

* [X] Open the Android project.

```bash
npx cap open android
```

* [X] Start the Android Emulator.

* [X] Run the application successfully.

---

# Check Home Screen

* [X] The application launches without crashing.

* [X] The Home screen is displayed.

* [X] The **Start Trip** button is visible.

* [X] Navigation menu and page layout display correctly.

---

# Check Location Permission

* [X] Tap **Start Trip**.

* [X] The application requests location permission.

* [X] Grant location permission.

* [X] The application enters **Active Trip** mode.

If permission is denied:

* [X] A clear message explains that location permission is required.

* [X] GPS tracking does not begin.

---

# Check Active Trip

* [X] GPS tracking starts successfully.

* [X] Current GPS coordinates are collected.

* [X] GPS point count increases while moving.

* [X] Speed is recorded when available.

* [X] If speed is unavailable, the application handles it safely.

* [X] Trip duration updates during the trip.

---

# Check End Trip

* [X] Tap **End Trip**.

* [X] GPS tracking stops.

* [X] Location listener is removed.

* [X] Trip data is saved successfully (if backend is implemented).

---

# Check Trip Summary

* [X] Trip Summary screen appears.

* [X] Start location is displayed.

* [X] End location is displayed.

* [X] Trip duration is displayed.

* [X] GPS point count is displayed.

* [X] Average speed is displayed (if available).

* [X] Maximum speed is displayed (if available).

* [X] Estimated distance is displayed (if implemented).

---

# Testing Information

| Item              | Result             |
| ----------------- | ------------------ |
| Tester            | __________________ |
| Date              | __________________ |
| Device / Emulator | __________________ |
| Android Version   | __________________ |
| Pass / Fail       | __________________ |
| Notes             | __________________ |

---

# Screenshots

Save the following screenshots in:

```text
testing/screenshots/
```

* [X] Home Screen

* [X] Active Trip Screen

* [X] Trip Summary Screen

* [X] Location Permission Dialog (optional)

---

# Smoke Test Result

* [X] All critical functions passed.

* [X] Prototype is ready for demonstration.

* [X] Any issues found have been documented in GitHub Issues.

