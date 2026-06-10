import { FaInstagram, FaLinkedin, FaEnvelope } from "react-icons/fa";
import brhLogoWhite from "@/assets/brh_logo_white.png";

export default function Footer() {
  return (
    <footer
      className="sticky bottom-0 left-0 w-full
                 flex flex-col md:flex-row
                 bg-sky4 font-bevietnam font-semibold text-white1
                 justify-between md:items-end
                 md:px-24 px-8
                 pt-12 pb-10
                 z-30"
    >
      {/* Left */}
      <div className="flex flex-col items-start space-y-4">
        <img
          src={brhLogoWhite}
          alt="BigRed//Hacks"
          className="md:h-16 h-12 pointer-events-none select-none"
        />
        <p className="md:text-2xl text-lg pointer-events-none select-none">
          Made with &lt;3 by BigRed//Hacks
        </p>
        <div className="flex flex-col space-y-1 md:text-base text-sm text-white1/85">
          <p className="pointer-events-none select-none">
            Registered Student Organization of Cornell University
          </p>
          <a
            href="https://hr.cornell.edu/about/workplace-rights/equal-education-and-employment"
            target="_blank"
            rel="noopener noreferrer"
            className="w-fit hover:text-yellow1"
          >
            Equal Education and Employment
          </a>
          <a
            href="https://static.mlh.io/docs/mlh-code-of-conduct.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="w-fit hover:text-yellow1"
          >
            MLH Code of Conduct
          </a>
        </div>
      </div>

      {/* Right */}
      <div className="flex flex-col items-end space-y-4 mt-6 md:mt-0">
        <p className="md:text-xl text-lg font-spartan font-bold">contact us!</p>
        <div className="flex space-x-4 mr-0.5">
          <a
            href="https://www.instagram.com/bigredhacks/"
            aria-label="Instagram"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaInstagram className="text-2xl hover:text-yellow1 hover:opacity-80" />
          </a>
          <a
            href="https://www.linkedin.com/company/bigredhacks/"
            aria-label="LinkedIn"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaLinkedin className="text-2xl hover:text-yellow1 hover:opacity-80" />
          </a>
          <a
            href="mailto:bigredhacks@cornell.edu"
            aria-label="Email bigredhacks@cornell.edu"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaEnvelope className="text-2xl hover:text-yellow1 hover:opacity-80" />
          </a>
        </div>
      </div>
    </footer>
  );
}
