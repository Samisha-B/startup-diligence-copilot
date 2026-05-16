export type Deal = {
  id: string;
  startupName: string;
  website: string;
  stage: string;
  sector: string;
  createdAt: string;
};

export const dealsStore: Deal[] = [];