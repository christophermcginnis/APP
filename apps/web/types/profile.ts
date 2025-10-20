export type ProfileCircleSummary = {
  id: string;
  name: string;
  cadence: string;
  members: number;
  status: string;
};

export type ProfileHighlight = {
  id: string;
  title: string;
  description: string;
  circle?: string;
};

export type ProfileTask = {
  id: string;
  title: string;
  eta: string;
  status: string;
};

export type ProfileStat = {
  label: string;
  value: string;
};

export type ProfileAgendaItem = {
  id: string;
  title: string;
  time: string;
};

export type ProfileOverview = {
  id: string;
  name: string;
  handle: string;
  headline: string;
  avatarUrl?: string;
  location: string;
  availability: string;
  expertise: string[];
  circles: ProfileCircleSummary[];
  highlights: ProfileHighlight[];
  companionFocus: ProfileTask[];
  stats: ProfileStat[];
  agenda: ProfileAgendaItem[];
  following: CreatorSummary[];
};

export type CreatorCircleSummary = {
  id: string;
  name: string;
  theme: string;
  cadence: string;
  members: number;
  highlight: string;
};

export type CreatorTestimonial = {
  id: string;
  quote: string;
  author: string;
};

export type CreatorHighlight = {
  id: string;
  title: string;
  description: string;
};

export type CreatorProfile = {
  handle: string;
  headline: string;
  featuredCircles: CreatorCircleSummary[];
  testimonials: CreatorTestimonial[];
  highlights: CreatorHighlight[];
};

export type CreatorSummary = {
  handle: string;
  name: string;
  avatarUrl?: string;
  headline: string;
  focus: string;
  circles: number;
  followers: number;
  status: string;
};
