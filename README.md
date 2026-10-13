# Galaxy Watch Ultra — Concept Site

An interactive, scroll-driven product page for the Samsung Galaxy Watch Ultra, built with Next.js, React Three Fiber and GSAP. The watch itself is modeled from scratch in code with three.js: no downloaded 3D files.

> Fan-made concept. Not affiliated with or endorsed by Samsung.

![Hero](docs/screenshots/desktop-overview.jpg)

## Highlights

- **A watch built in code:** the cushion-shaped titanium case, bezel, sapphire display, buttons, BioActive sensor, perforated Marine band and buckle are all generated procedurally with three.js (extrusions, custom ribbon geometry and canvas textures).
- **Scroll-driven 3D story:** one real-time model turns to show the titanium side and Quick Button, faces you for the display, then turns to its sensor while the band fades away.
- **Interactive hotspots:** labels pinned to the sapphire crystal, the Quick Button, the titanium case and the sensor that follow the model as it moves.
- **Night Mode:** switch the 3D watch face between day and the red night display.
- **Quick Button:** press the orange button to start a workout with a live timer, heart rate and distance. Press and hold to sound the emergency siren, synthesized with the Web Audio API.
- **Energy Score:** move sliders for sleep, activity and sleeping heart rate and watch the score and a live heart-rate trace react.
- **Dual-frequency GPS:** a simulated run through a city, recorded with L1 only or with L1 + L5, so you can see the track drift between tall buildings.
- **Built tough:** water, altitude, temperature and MIL-STD-810H in one switcher.
- **Battery:** rings for 100 h and 48 h that fill as you scroll.
- **Colors:** Titanium Blue, Silver, Gray and White, each with its own bezel, band and watch face color.
- **Watch Ultra vs Watch9:** headline gains and a side-by-side spec table.
- **Galaxy ecosystem:** links to its sister projects, the [Galaxy S26 Ultra](https://s27-ultra-concept.vercel.app) and [Galaxy Buds4 Pro](https://buds4-pro-concept.vercel.app) concept sites.

## Screenshots

| | |
|---|---|
| ![Titanium](docs/screenshots/desktop-titanium.jpg) | ![Display](docs/screenshots/desktop-display.jpg) |
| **Titanium design** with hotspots | **Night Mode** on the 3D display |
| ![Sensor](docs/screenshots/desktop-sensor.jpg) | ![Quick Button](docs/screenshots/desktop-quick.jpg) |
| **BioActive Sensor** on the back | **Quick Button:** workout or siren |
| ![Health](docs/screenshots/desktop-health.jpg) | ![GPS](docs/screenshots/desktop-gps.jpg) |
| **Energy Score** sliders | **L1 vs L1 + L5** GPS |
| ![Built tough](docs/screenshots/desktop-tough.jpg) | ![Battery](docs/screenshots/desktop-battery.jpg) |
| **Built tough** | **Up to 100 hours** |
| ![Colors](docs/screenshots/desktop-colors.jpg) | ![Compare](docs/screenshots/desktop-compare.jpg) |
| **Colors** | **vs Galaxy Watch9** |

### Mobile

| | | | |
|---|---|---|---|
| ![Hero](docs/screenshots/mobile-overview.jpg) | ![Titanium](docs/screenshots/mobile-titanium.jpg) | ![Display](docs/screenshots/mobile-display.jpg) | ![Colors](docs/screenshots/mobile-colors.jpg) |

## Tech

- Next.js 16 (App Router, Turbopack), React 19, TypeScript, Tailwind CSS v4
- @react-three/fiber, @react-three/drei, three.js
- GSAP ScrollTrigger and Lenis for scroll
- Web Audio API for the siren, Canvas 2D for the heart-rate and GPS demos

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Credits

Designed and built by Hasan Alp Güngör. Product names and specifications belong to Samsung; figures are from Samsung's public announcement and product pages.
