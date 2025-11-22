import { TrashType } from '../types/api';

export interface TrashTypeInfo {
  label: string;
  icon: string;
  color: string;
  recommendation: string;
}

const TRASH_TYPE_MAP: Record<string, TrashTypeInfo> = {
  [TrashType.Cardboard]: {
    label: 'Картон',
    icon: '📦',
    color: '#8D6E63',
    recommendation: 'Утилизируйте в контейнер для бумаги. Сложите коробки для экономии места.',
  },
  [TrashType.Glass]: {
    label: 'Стекло',
    icon: '🥤',
    color: '#26A69A',
    recommendation: 'Стекло можно перерабатывать бесконечно. Отнесите в контейнер для стекла.',
  },
  [TrashType.Metal]: {
    label: 'Металл',
    icon: '🔩',
    color: '#78909C',
    recommendation: 'Металл полностью перерабатывается. Сдайте в пункт приема металлолома.',
  },
  [TrashType.Paper]: {
    label: 'Бумага',
    icon: '📄',
    color: '#FFA726',
    recommendation: 'Бумагу можно переработать в новую. Используйте синий контейнер.',
  },
  [TrashType.Plastic]: {
    label: 'Пластик',
    icon: '🧴',
    color: '#42A5F5',
    recommendation: 'Проверьте маркировку пластика. Утилизируйте в желтый контейнер.',
  },
  [TrashType.Trash]: {
    label: 'Общий мусор',
    icon: '🗑️',
    color: '#757575',
    recommendation: 'Утилизируйте в контейнер для смешанных отходов.',
  },
  [TrashType.Undefined]: {
    label: 'Не определено',
    icon: '❓',
    color: '#9E9E9E',
    recommendation: 'Попробуйте сфотографировать объект с другого ракурса.',
  },
};

/**
 * Get trash type information including label, icon, color, and disposal recommendation
 */
export const getTrashTypeInfo = (type: string): TrashTypeInfo => {
  return TRASH_TYPE_MAP[type] || TRASH_TYPE_MAP[TrashType.Undefined];
};

/**
 * Get primary trash type and confidence from prediction result
 */
export const getPrimaryTrashType = (
  result: Record<string, number>
): { type: string; confidence: number } => {
  const entries = Object.entries(result);
  if (entries.length === 0) return { type: TrashType.Undefined, confidence: 0 };

  const [primaryType, confidence] = entries.reduce((max, current) =>
    current[1] > max[1] ? current : max
  );

  return { type: primaryType, confidence };
};
