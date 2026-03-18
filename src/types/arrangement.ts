export interface DotPosition {
  x: number;
  y: number;
  color: DotColor;
  groupId: number;
}

export interface DotGroup {
  id: number;
  dots: DotPosition[];
  quantity: number;
}

export interface DotArrangement {
  totalQuantity: number;
  groups: DotGroup[];
  layout: ArrangementLayout;
}

export type DotColor = 'red' | 'blue';

export type ArrangementLayout =
  | 'template'
  | 'random'
  | 'subgrouped';

export interface ArrangementTemplate {
  name: string;
  quantity: number;
  positions: Array<{ x: number; y: number }>;
}
