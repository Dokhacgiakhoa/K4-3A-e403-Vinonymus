export type PlannerBackground = 'non_tech' | 'tech_base' | 'ai';

export type CatalogItemType = 'slide' | 'video' | 'notebook' | 'doc';

export interface CatalogItem {
  itemId: string;
  title: string;
  url: string;
  type: CatalogItemType;
  minutes: number;
  level: 'basic' | 'advanced';
  tags: string[];
  why: string;
}

export interface CatalogLab {
  labId: string;
  title: string;
  description: string;
  items: CatalogItem[];
}

export interface PlannerInput {
  background: PlannerBackground;
  availableMinutes: number;
  labId: string;
  note: string;
}

export interface PlannedTask {
  itemId: string;
  title: string;
  url: string;
  type: CatalogItemType;
  minutes: number;
  reason: string;
}

export interface PlannerDiagnosis {
  background: PlannerBackground;
  confidence: 'high' | 'low';
  summary: string;
}

export type PlannerResult =
  | {
      status: 'plan';
      source: 'ai' | 'baseline';
      diagnosis: PlannerDiagnosis;
      tasks: PlannedTask[];
      message: string;
    }
  | { status: 'clarify'; question: string }
  | { status: 'refuse'; message: string };
