# BigRed//Hacks 2026 Event Website

A hackathon event site frontend.

---

## Project Structure

```
eventsite-fa26/
  frontend/    # React + TypeScript + Vite + Tailwind CSS
```

---

## Getting Started

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Build
npm run build
```

---

## Frontend

### `/components/`

UI components

#### `NavBar/`

- `NavBar.tsx`: Navigation bar
- `NavButton.tsx`: Navigation button
- `NavButtonSet.tsx`: A set of navigation buttons, including for responsive layouts

#### `ScrollBar/`

- `ScrollBar.tsx`: Custom scrollbar
- `ScrollBarTrack.tsx`: Visual scrollbar track behind `ScrollBar`

#### Other Components

- `Accordian.tsx`: Expandable/collapsible item used in FAQ
- `MLHBadge.tsx`: MLH Trust Badge
- `TrackCard.tsx`: Card displaying a track (used in `Tracks.tsx`)
- `WaveText.tsx`: Animated bouncing text component for loading sections

---

### `/sections/`

- `Landing1.tsx`, `Landing2.tsx`: Hero sections
- `About.tsx`: Describes event and our mission
- `Tracks.tsx`: Displays hackathon tracks using `TrackCard`
- `Schedule.tsx`: Shows event schedule image
- `FAQ.tsx`: Frequently asked questions using `Accordian`
- `Sponsors.tsx`: Sponsor showcase section
- `Home.tsx`: Main container section that includes the two hero sections
- `Footer.tsx`: Footer
- `SectionProps.tsx`: Shared TypeScript props for consistency

---

### `/config/`

- `config.ts`: Static data used by the app (e.g., track definitions, FAQ entries)

---

### `/utils/`

- `smoothScrollTo.tsx`: Utility for animating smooth scrolling behavior on anchor clicks

---

## Tech Stack

- **React** + **TypeScript**
- **Tailwind CSS**
- **Vite**
