import type { ArrangementLayout } from '../../types/arrangement';

export interface DifficultyLevel {
  id: number;
  name: string;
  description: string;
  quantityRange: [number, number];
  displayDuration: number;
  layouts: ArrangementLayout[];
  useSubgroups: boolean;
}

export const LEVELS: DifficultyLevel[] = [
  {
    id: 1,
    name: '처음 만나는 수',
    description: '1~3개의 점을 한눈에 파악해요',
    quantityRange: [1, 3],
    displayDuration: 2000,
    layouts: ['template'],
    useSubgroups: false,
  },
  {
    id: 2,
    name: '조금 더 많이',
    description: '3~5개의 점을 다양한 배열로 만나요',
    quantityRange: [3, 5],
    displayDuration: 1500,
    layouts: ['template', 'random'],
    useSubgroups: false,
  },
  {
    id: 3,
    name: '나누어 보기',
    description: '점들을 묶어서 파악해요',
    quantityRange: [4, 6],
    displayDuration: 1500,
    layouts: ['subgrouped'],
    useSubgroups: true,
  },
  {
    id: 4,
    name: '큰 수도 척척',
    description: '6~10개의 점을 구조적으로 파악해요',
    quantityRange: [6, 10],
    displayDuration: 1200,
    layouts: ['subgrouped'],
    useSubgroups: true,
  },
  {
    id: 5,
    name: '10의 친구',
    description: '십 프레임으로 10의 보수를 익혀요',
    quantityRange: [8, 15],
    displayDuration: 1000,
    layouts: ['subgrouped'],
    useSubgroups: true,
  },
];
