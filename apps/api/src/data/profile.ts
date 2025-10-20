import type {
  CreatorProfile,
  CreatorSummary,
  ProfileOverview
} from "@circlecast/core";

type CreatorEntry = CreatorSummary;

const creatorEntries: CreatorEntry[] = [
  {
    handle: "hazel-quinn",
    name: "Hazel Quinn",
    avatarUrl: "https://i.pravatar.cc/150?img=31",
    headline: "Designs ambient learning labs for indie makers.",
    focus: "Creative coding ecosystems",
    circles: 3,
    followers: 1240,
    status: "Hosting async code critique tonight"
  },
  {
    handle: "malik-reyes",
    name: "Malik Reyes",
    avatarUrl: "https://i.pravatar.cc/150?img=32",
    headline: "Coaches podcasters on calm launch systems.",
    focus: "Creator audio accelerators",
    circles: 4,
    followers: 980,
    status: "Reviewing member audition tapes"
  },
  {
    handle: "priya-raman",
    name: "Priya Raman",
    avatarUrl: "https://i.pravatar.cc/150?img=33",
    headline: "Builds premium circles for health educators.",
    focus: "Community-backed course design",
    circles: 2,
    followers: 1620,
    status: "Drafting companion onboarding prompts"
  },
  {
    handle: "devon-hart",
    name: "Devon Hart",
    avatarUrl: "https://i.pravatar.cc/150?img=34",
    headline: "Specialises in serene story circles for storytellers.",
    focus: "Narrative development studios",
    circles: 3,
    followers: 1124,
    status: "Publishing highlight anthology"
  },
  {
    handle: "lila-song",
    name: "Lila Song",
    avatarUrl: "https://i.pravatar.cc/150?img=35",
    headline: "Helps wellness founders run thoughtful masterminds.",
    focus: "Mindful business collectives",
    circles: 3,
    followers: 1420,
    status: "Opening premium breathwork track"
  },
  {
    handle: "nico-alvarez",
    name: "Nico Alvarez",
    avatarUrl: "https://i.pravatar.cc/150?img=36",
    headline: "Runs cohort labs for indie SaaS builders.",
    focus: "Lean growth operators",
    circles: 4,
    followers: 1885,
    status: "Scheduling async launch teardown"
  },
  {
    handle: "tessa-monroe",
    name: "Tessa Monroe",
    avatarUrl: "https://i.pravatar.cc/150?img=37",
    headline: "Curates hybrid salons for creative strategists.",
    focus: "Brand storytelling salons",
    circles: 2,
    followers: 950,
    status: "Companion queuing invite sequence"
  },
  {
    handle: "jordan-blake",
    name: "Jordan Blake",
    avatarUrl: "https://i.pravatar.cc/150?img=38",
    headline: "Mentors community-led product studios.",
    focus: "Member-driven product labs",
    circles: 5,
    followers: 2104,
    status: "Activating beta feedback sprint"
  },
  {
    handle: "rui-chen",
    name: "Rui Chen",
    avatarUrl: "https://i.pravatar.cc/150?img=39",
    headline: "Builds calm financial circles for freelancers.",
    focus: "Creative finance cohorts",
    circles: 3,
    followers: 1320,
    status: "Preparing tax season Q&A"
  },
  {
    handle: "amara-patel",
    name: "Amara Patel",
    avatarUrl: "https://i.pravatar.cc/150?img=40",
    headline: "Guides mindful leadership pods for founders.",
    focus: "Founder resilience pods",
    circles: 3,
    followers: 1750,
    status: "Launching companion accountability loop"
  },
  {
    handle: "felix-ibarra",
    name: "Felix Ibarra",
    avatarUrl: "https://i.pravatar.cc/150?img=41",
    headline: "Hosts async film scoring workshops.",
    focus: "Cinematic audio collectives",
    circles: 2,
    followers: 840,
    status: "Scoring critique goes live tomorrow"
  },
  {
    handle: "sienna-brooks",
    name: "Sienna Brooks",
    avatarUrl: "https://i.pravatar.cc/150?img=42",
    headline: "Supports designers building ethical products.",
    focus: "Inclusive product guilds",
    circles: 3,
    followers: 1640,
    status: "Publishing inclusive UX playbook"
  },
  {
    handle: "harper-kim",
    name: "Harper Kim",
    avatarUrl: "https://i.pravatar.cc/150?img=43",
    headline: "Runs career accelerators for community managers.",
    focus: "Community leadership studios",
    circles: 4,
    followers: 1520,
    status: "Companion summarised salary AMA"
  },
  {
    handle: "matteo-costa",
    name: "Matteo Costa",
    avatarUrl: "https://i.pravatar.cc/150?img=44",
    headline: "Facilitates slow productivity labs.",
    focus: "Calm operations collectives",
    circles: 2,
    followers: 1235,
    status: "Queueing gentle planning ritual"
  },
  {
    handle: "noor-elsayed",
    name: "Noor El-Sayed",
    avatarUrl: "https://i.pravatar.cc/150?img=45",
    headline: "Empowers educators launching micro-schools.",
    focus: "Learning innovation circles",
    circles: 3,
    followers: 2040,
    status: "Onboarding parent advisory council"
  },
  {
    handle: "elio-vargas",
    name: "Elio Vargas",
    avatarUrl: "https://i.pravatar.cc/150?img=46",
    headline: "Coaches indie game designers on community loops.",
    focus: "Indie game audio labs",
    circles: 3,
    followers: 990,
    status: "Showcase night kicks off Friday"
  },
  {
    handle: "gemma-wilde",
    name: "Gemma Wilde",
    avatarUrl: "https://i.pravatar.cc/150?img=47",
    headline: "Hosts experimental poetry circles.",
    focus: "Creative writing ateliers",
    circles: 4,
    followers: 1185,
    status: "Publishing companion-generated zine"
  },
  {
    handle: "aidan-walsh",
    name: "Aidan Walsh",
    avatarUrl: "https://i.pravatar.cc/150?img=48",
    headline: "Builds calm-growth programs for agencies.",
    focus: "Agency systems forums",
    circles: 3,
    followers: 1675,
    status: "Running pipeline ritual with members"
  },
  {
    handle: "soleil-park",
    name: "Soleil Park",
    avatarUrl: "https://i.pravatar.cc/150?img=49",
    headline: "Leads well-being circles for remote teams.",
    focus: "Team wellness studios",
    circles: 2,
    followers: 1330,
    status: "Companion drafted restorative prompts"
  },
  {
    handle: "vivian-hale",
    name: "Vivian Hale",
    avatarUrl: "https://i.pravatar.cc/150?img=50",
    headline: "Guides storytellers through documentary labs.",
    focus: "Documentary storytelling guilds",
    circles: 3,
    followers: 1580,
    status: "Co-editing member highlight reel"
  }
];

const cadences = [
  "Weekly · Mondays",
  "Weekly · Tuesdays",
  "Weekly · Wednesdays",
  "Weekly · Thursdays",
  "Weekly · Fridays",
  "Bi-weekly · Tuesdays",
  "Bi-weekly · Thursdays",
  "Monthly · First Monday"
];

const testimonialAuthors = [
  "Avery Stone · CircleCast producer",
  "Mila Gardner · Community coach",
  "Jonas Lee · Indie creator",
  "Zara Walsh · Education strategist",
  "Elias Moore · Product storyteller"
];

function buildCreatorProfile(entry: CreatorEntry, index: number): CreatorProfile {
  const firstName = entry.name.split(" ")[0];
  const cadenceA = cadences[index % cadences.length];
  const cadenceB = cadences[(index + 3) % cadences.length];
  const membersA = 18 + (index % 5) * 3;
  const membersB = 14 + (index % 7) * 2;
  const author = testimonialAuthors[index % testimonialAuthors.length];

  return {
    handle: entry.handle,
    headline: entry.headline,
    featuredCircles: [
      {
        id: `${entry.handle}-circle-1`,
        name: `${firstName}'s ${entry.focus.split(" ")[0]} Lab`,
        theme: entry.focus,
        cadence: cadenceA,
        members: membersA,
        highlight: `Companion surfaced ${entry.focus.toLowerCase()} rituals that keep members engaged.`
      },
      {
        id: `${entry.handle}-circle-2`,
        name: `${firstName} Studio Sessions`,
        theme: `${entry.focus} · Premium`,
        cadence: cadenceB,
        members: membersB,
        highlight: `Premium members co-create assets while the companion drafts follow-up actions.`
      }
    ],
    testimonials: [
      {
        id: `${entry.handle}-testimonial-1`,
        quote: `${firstName}'s circles feel handcrafted—every companion follow-up keeps momentum alive.`,
        author
      },
      {
        id: `${entry.handle}-testimonial-2`,
        quote: `Members rave about the calm pace and actionable prompts tailored to ${entry.focus.toLowerCase()}.`,
        author: "Member feedback snapshot"
      }
    ],
    highlights: [
      {
        id: `${entry.handle}-highlight-1`,
        title: `Clip: ${entry.focus}`,
        description: `A companion-generated reel capturing ${firstName}'s approach to ${entry.focus.toLowerCase()}.`
      },
      {
        id: `${entry.handle}-highlight-2`,
        title: "Session summary: Turning insights into action",
        description: `Companion summarised member breakthroughs and queued tasks for the next ${entry.focus.toLowerCase()} sprint.`
      }
    ]
  };
}

export const creatorProfilesMock: Record<string, CreatorProfile> = Object.fromEntries(
  creatorEntries.map((entry, index) => [entry.handle, buildCreatorProfile(entry, index)])
);

export const creatorProfileMock: CreatorProfile = creatorProfilesMock[creatorEntries[0].handle];

export const profileOverviewMock: ProfileOverview = {
  id: "creator-avery",
  name: "Avery Stone",
  handle: "avery-studio",
  headline:
    "Runs Indie Music Circle · Experimenting with calm, AI-supported audio masterminds.",
  avatarUrl:
    "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=200&q=80",
  expertise: ["Audio storytelling", "Community ops", "Creator growth"],
  location: "Brooklyn, NY",
  availability: "Weekdays · 10a–2p ET",
  birthdate: "1992-04-17T00:00:00.000Z",
  circles: [
    {
      id: "circle-1",
      name: "Indie Music Circle",
      cadence: "Weekly",
      members: 18,
      status: "Live session tomorrow · 10a ET"
    },
    {
      id: "circle-2",
      name: "Creator Monetisation Lab",
      cadence: "Bi-weekly",
      members: 12,
      status: "Companion drafting circle brief"
    }
  ],
  highlights: [
    {
      id: "highlight-1",
      title: "Session recap: Monetising micro-audiences",
      description:
        "Conversation around packaging live workshops into limited-time drops. Companion clipped 3 highlights.",
      circle: "Creator Monetisation Lab"
    },
    {
      id: "highlight-2",
      title: "Clip: Feedback loop for new members",
      description: "Shared onboarding prompt that doubled week 1 participation.",
      circle: "Indie Music Circle"
    }
  ],
  companionFocus: [
    {
      id: "task-1",
      title: "Polish highlight reel copy",
      eta: "12 min",
      status: "In progress"
    },
    {
      id: "task-2",
      title: "Queue invites for premium tier",
      eta: "25 min",
      status: "Queued"
    }
  ],
  stats: [
    { label: "Active circles", value: "2" },
    { label: "Member retention", value: "92%" },
    { label: "MRR", value: "$740" },
    { label: "New applications", value: "14" }
  ],
  agenda: [
    { id: "agenda-1", title: "Review companion summary", time: "Today · 2:00p" },
    { id: "agenda-2", title: "Host Indie Music Circle session", time: "Tomorrow · 10:00a" }
  ],
  following: creatorEntries
};

export const followingCreatorsMock = creatorEntries;
