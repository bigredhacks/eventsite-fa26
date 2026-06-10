import "./App.css";

import NavBar from "./components/NavBar/NavBar";
import MLHBadge from "./components/MLHBadge";

import MainStage from "./sections/MainStage";
import Hero from "./sections/Hero";
import Tracks from "./sections/Tracks";
import Schedule from "./sections/Schedule";
import FAQ from "./sections/FAQ";
import Sponsors from "./sections/Sponsors";
import Footer from "./sections/Footer";

function App() {
  return (
    <div className="relative w-full">
      <MLHBadge />
      <NavBar />

      {/* Static illustrated landscape — single 1670×7310 ghost canvas
          covering the full Figma frame, behind every section. All
          landscape SVGs live here so nothing is clipped by section
          bounds. Sections render on top as transparent text overlays. */}
      <MainStage />

      <Hero />
      <div>
        <Tracks />
        <Schedule />
        <FAQ />
        <Sponsors />
        <Footer />
      </div>
    </div>
  );
}

export default App;
