export interface Event {
  _id: string;
  title: string;
  org: string;
  type?: string;
  source?: string;
  sourceUrl?: string;
  applyUrl?: string;
  mode?: string;
  location?: string;
  deadline?: string | null;
  tags?: string[];
  description?: string;
  featured?: boolean;
  collectedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
}