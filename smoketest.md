
# Driver Safety App - Prototype Smoke Test

It is recommended to perform the following smoke tests before demonstrating the prototype or creating a pull request.

## Check Project Setup

* [ ] Clone the latest project from GitHub.

* [ ] Install project dependencies.

```bash
npm install
```

* [ ] Build the Ionic application.

```bash
ionic build
```

* [ ] Sync the Capacitor Android project.

```bash
npx cap sync android
```

* [ ] Open the Android project.

```bash
npx cap open android
```

* [ ] Start the Android Emulator.

* [ ] Run the application successfully.

---

# Check Home Screen

* [ ] The application launches without crashing.

* [ ] The Home screen is displayed.

* [ ] The **Start Trip** button is visible.

* [ ] Navigation menu and page layout display correctly.

---

# Check Location Permission

* [ ] Tap **Start Trip**.

* [ ] The application requests location permission.

* [ ] Grant location permission.

* [ ] The application enters **Active Trip** mode.

If permission is denied:

* [ ] A clear message explains that location permission is required.

* [ ] GPS tracking does not begin.

---

# Check Active Trip

* [ ] GPS tracking starts successfully.

* [ ] Current GPS coordinates are collected.

* [ ] GPS point count increases while moving.

* [ ] Speed is recorded when available.

* [ ] If speed is unavailable, the application handles it safely.

* [ ] Trip duration updates during the trip.

---

# Check End Trip

* [ ] Tap **End Trip**.

* [ ] GPS tracking stops.

* [ ] Location listener is removed.

* [ ] Trip data is saved successfully (if backend is implemented).

---

# Check Trip Summary

* [ ] Trip Summary screen appears.

* [ ] Start location is displayed.

* [ ] End location is displayed.

* [ ] Trip duration is displayed.

* [ ] GPS point count is displayed.

* [ ] Average speed is displayed (if available).

* [ ] Maximum speed is displayed (if available).

* [ ] Estimated distance is displayed (if implemented).

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

* [ ] Home Screen

* [ ] Active Trip Screen

* [ ] Trip Summary Screen

* [ ] Location Permission Dialog (optional)

---

# Smoke Test Result

* [ ] All critical functions passed.

* [ ] Prototype is ready for demonstration.

* [ ] Any issues found have been documented in GitHub Issues.
