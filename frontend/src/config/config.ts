interface Track {
  title: string;
  description: string;
}

interface FAQItem {
  question: string;
  answer: string;
}

export const tracks: Track[] = [
  {
    title: "BIG RED",
    description:
      "The main track judged on technical skill, design, creativity, impact, and theme.",
  },
  {
    title: "HARDWARE",
    description:
      "Optional track focused on hardware use and technical implementation.",
  },
  {
    title: "SOFTWARE",
    description:
      "Optional track focused on software development and technical depth.",
  },
  {
    title: "BEGINNER",
    description:
      "For first-time hackers, rewarding the best overall beginner project.",
  },
  {
    title: "PEOPLE'S CHOICE",
    description: "Voted on by participants for favorite project overall.",
  },
  {
    title: "DESIGN",
    description:
      "Optional track evaluating design quality and visual presentation.",
  },
];

export const faqData: FAQItem[] = [
  {
    question: "What is the BigRed//Hacks Hackathon?",
    answer:
      "BigRed//Hacks is Cornell's largest student-run hackathon — a weekend-long event where students build hardware or software projects, attend workshops, and learn from mentors.",
  },
  {
    question: "Who can participate and how can I sign up?",
    answer:
      "BigRed//Hacks is open to all university students 18 or older, regardless of major or experience. Sign up on our registration page when applications open.",
  },
  {
    question: "How are teams formed? Can I participate without a team?",
    answer:
      "You can form a team of up to four people, or sign up solo — we host team matching events before and during the hackathon to help you find collaborators.",
  },
  {
    question: "Where can I ask questions?",
    answer:
      "Email us at bigredhacks@cornell.edu, DM us on Instagram @bigredhacks, or fill out the contact form on our site.",
  },
  {
    question: "Where and when is the hackathon?",
    answer:
      "BigRed//Hacks 2026 will take place October 2nd - 4th on Cornell University's Ithaca Campus.",
  },
  {
    question: "When will the next hackathon be?",
    answer:
      "BigRed//Hacks runs annually each fall — follow our socials for date confirmations as the season approaches.",
  },
  {
    question: "Will food and overnight accommodations be provided?",
    answer:
      "Yes — breakfast, lunch, and dinner are provided throughout the weekend, and overnight accommodations are available at the event venue.",
  },
  {
    question: "How can I get involved in BigRed//Hacks as a member?",
    answer:
      "We recruit new organizing-team members each fall after the hackathon. Follow us on Instagram and LinkedIn for application announcements.",
  },
];

export const eventDates = {
  start: "10.02",
  end: "10.04",
  year: 2026,
};
