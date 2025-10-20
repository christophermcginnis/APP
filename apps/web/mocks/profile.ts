import type {
  CreatorProfile,
  CreatorSummary,
  ProfileOverview
} from "@circlecast/core";

const creatorSummaries: CreatorSummary[] = [
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
  }
];

const creatorProfilesMock: Record<string, CreatorProfile> = Object.fromEntries(
  creatorSummaries.map((summary, index) => {
    const cadenceA = index % 2 === 0 ? "Weekly · Thursdays" : "Bi-weekly · Tuesdays";
    const cadenceB = index % 2 === 0 ? "Monthly · Saturdays" : "Weekly · Mondays";
    const membersBase = 16 + index * 2;

    return [
      summary.handle,
      {
        handle: summary.handle,
        headline: summary.headline,
        featuredCircles: [
          {
            id: `${summary.handle}-circle-1`,
            name: `${summary.name.split(" ")[0]}'s ${summary.focus.split(" ")[0]} Lab`,
            theme: summary.focus,
            cadence: cadenceA,
            members: membersBase,
            highlight: `Companion surfaced rituals that keep ${summary.focus.toLowerCase()} thriving.`
          },
          {
            id: `${summary.handle}-circle-2`,
            name: `${summary.name.split(" ")[0]} Studio Sessions`,
            theme: `${summary.focus} · Premium`,
            cadence: cadenceB,
            members: membersBase - 4,
            highlight:
              "Premium members co-create assets while Companion drafts follow-up actions."
          }
        ],
        testimonials: [
          {
            id: `${summary.handle}-testimonial-1`,
            quote: `${summary.name.split(" ")[0]}'s circles feel handcrafted—every follow-up keeps momentum alive.`,
            author: "Member momentum snapshot"
          },
          {
            id: `${summary.handle}-testimonial-2`,
            quote: "Members rave about the calm pace and actionable prompts tailored to the group.",
            author: "CircleCast Pulse"
          }
        ],
        highlights: [
          {
            id: `${summary.handle}-highlight-1`,
            title: "Companion clip: Weekly spotlight",
            description: "A reel capturing breakthrough ideas from the latest live session."
          },
          {
            id: `${summary.handle}-highlight-2`,
            title: "Session summary: Turning insights into action",
            description:
              "Companion summarised member breakthroughs and queued next-step tasks."
          }
        ]
      }
    ];
  })
);

const profileOverviewMock: ProfileOverview = {
  id: "creator-avery",
  name: "Avery Stone",
  handle: "avery-studio",
  headline:
    "Runs Indie Music Circle · Experimenting with calm, AI-supported audio masterminds.",
  avatarUrl:
    "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=200&q=80",
  location: "Brooklyn, NY",
  availability: "Weekdays · 10a–2p ET",
  birthdate: "1992-04-17T00:00:00.000Z",
  expertise: ["Audio storytelling", "Community ops", "Creator growth"],
  circles: [
    {
      id: "circle-1",
      name: "Indie Music Circle",
      cadence: "Weekly · Thursdays",
      members: 18,
      status: "Live session tomorrow · 10a ET"
    },
    {
      id: "circle-2",
      name: "Creator Monetisation Lab",
      cadence: "Bi-weekly · Tuesdays",
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
  following: creatorSummaries
};

const creatorProfileMock = creatorProfilesMock[creatorSummaries[0].handle];

const followingCreatorsMock = creatorSummaries;

export {
  creatorProfileMock,
  creatorProfilesMock,
  followingCreatorsMock,
  profileOverviewMock
};
