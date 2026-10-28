export const SENIORITY_VALUES = ["intern", "entry", "mid", "all"] as const;

export const SENIORITY_OPTIONS = [
  { value: "intern", label: "Internship / Co-op" },
  { value: "entry", label: "Entry-level / Junior" },
  { value: "mid", label: "Mid-level" },
  { value: "all", label: "Any seniority" },
] as const;

export type SeniorityValue = (typeof SENIORITY_VALUES)[number];

export const WORK_MODE_VALUES = ["remote", "hybrid", "onsite"] as const;

export const WORK_MODE_OPTIONS = [
  {
    value: "remote",
    label: "Remote",
    description: "Work from anywhere permitted by the employer.",
  },
  {
    value: "hybrid",
    label: "Hybrid",
    description: "A mix of remote and on-site work.",
  },
  {
    value: "onsite",
    label: "On-site",
    description: "Work from a specific office or location.",
  },
] as const;

export type WorkModeValue = (typeof WORK_MODE_VALUES)[number];

export const EMPLOYMENT_TYPE_VALUES = [
  "full-time",
  "part-time",
  "internship",
  "contract",
  "freelance",
] as const;

export const EMPLOYMENT_TYPE_OPTIONS = [
  { value: "full-time", label: "Full-time" },
  { value: "part-time", label: "Part-time" },
  { value: "internship", label: "Internship" },
  { value: "contract", label: "Contract" },
  { value: "freelance", label: "Freelance" },
] as const;

export type EmploymentTypeValue = (typeof EMPLOYMENT_TYPE_VALUES)[number];

export const SKILL_SUGGESTIONS = [
  "React",
  "Next.js",
  "TypeScript",
  "JavaScript",
  "Node.js",
  "Python",
  "Java",
  "Go",
  "SQL",
  "PostgreSQL",
  "MongoDB",
  "REST APIs",
  "GraphQL",
  "Tailwind CSS",
  "CSS",
  "HTML",
  "Git",
  "Docker",
  "Kubernetes",
  "AWS",
  "Azure",
  "GCP",
  "Testing",
  "Playwright",
  "Jest",
  "Data Analysis",
  "Machine Learning",
  "Figma",
  "Product Management",
] as const;

export const COUNTRY_SUGGESTIONS = [
  "US",
  "CA",
  "GB",
  "IE",
  "DE",
  "FR",
  "NL",
  "ES",
  "PT",
  "PL",
  "EU",
  "IN",
  "AU",
  "NZ",
  "SG",
  "BR",
  "MX",
  "ZA",
  "NG",
  "KE",
] as const;

export const LOCATION_SUGGESTIONS = [
  "Remote",
  "New York, NY",
  "San Francisco, CA",
  "Austin, TX",
  "Seattle, WA",
  "London, UK",
  "Berlin, DE",
  "Amsterdam, NL",
  "Dublin, IE",
  "Toronto, CA",
  "Bangalore, IN",
  "Sydney, AU",
  "Singapore",
] as const;
