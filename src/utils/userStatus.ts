export enum UserStatus {
  Newbie = 'newbie',
  EcoScout = 'eco_scout',
  GreenGuard = 'green_guard',
  EcoWarrior = 'eco_warrior',
  NatureHero = 'nature_hero',
  EarthDefender = 'earth_defender',
  EcoChampion = 'eco_champion',
  PlanetGuardian = 'planet_guardian',
  EcoLegend = 'eco_legend',
}

export interface UserStatusInfo {
  label: string;
  icon: string;
  color: string;
  requiredRating: number;
  nextLevel?: {
    label: string;
    requiredRating: number;
  };
}

const USER_STATUS_MAP: Record<string, UserStatusInfo> = {
  [UserStatus.Newbie]: {
    label: 'Новичок',
    icon: '🌱',
    color: '#9E9E9E',
    requiredRating: 0,
    nextLevel: {
      label: 'Эко-разведчик',
      requiredRating: 100,
    },
  },
  [UserStatus.EcoScout]: {
    label: 'Эко-разведчик',
    icon: '🔍',
    color: '#4CAF50',
    requiredRating: 100,
    nextLevel: {
      label: 'Зеленый страж',
      requiredRating: 300,
    },
  },
  [UserStatus.GreenGuard]: {
    label: 'Зеленый страж',
    icon: '🛡️',
    color: '#8BC34A',
    requiredRating: 300,
    nextLevel: {
      label: 'Эко-воин',
      requiredRating: 500,
    },
  },
  [UserStatus.EcoWarrior]: {
    label: 'Эко-воин',
    icon: '⚔️',
    color: '#66BB6A',
    requiredRating: 500,
    nextLevel: {
      label: 'Герой природы',
      requiredRating: 1000,
    },
  },
  [UserStatus.NatureHero]: {
    label: 'Герой природы',
    icon: '🦸',
    color: '#26A69A',
    requiredRating: 1000,
    nextLevel: {
      label: 'Защитник Земли',
      requiredRating: 1500,
    },
  },
  [UserStatus.EarthDefender]: {
    label: 'Защитник Земли',
    icon: '🌍',
    color: '#00BCD4',
    requiredRating: 1500,
    nextLevel: {
      label: 'Эко-чемпион',
      requiredRating: 3000,
    },
  },
  [UserStatus.EcoChampion]: {
    label: 'Эко-чемпион',
    icon: '🏆',
    color: '#0288D1',
    requiredRating: 3000,
    nextLevel: {
      label: 'Хранитель планеты',
      requiredRating: 5000,
    },
  },
  [UserStatus.PlanetGuardian]: {
    label: 'Хранитель планеты',
    icon: '👑',
    color: '#1976D2',
    requiredRating: 5000,
    nextLevel: {
      label: 'Эко-легенда',
      requiredRating: 10000,
    },
  },
  [UserStatus.EcoLegend]: {
    label: 'Эко-легенда',
    icon: '⭐',
    color: '#FFD700',
    requiredRating: 10000,
    // No next level - this is max
  },
};

/**
 * Get user status information including label, icon, color, and level requirements
 */
export const getUserStatusInfo = (status: string, currentRating = 0): UserStatusInfo => {
  const info = USER_STATUS_MAP[status] || USER_STATUS_MAP[UserStatus.Newbie];

  // Calculate progress if there's a next level
  return {
    ...info,
    progress: info.nextLevel
      ? Math.min(
          100,
          ((currentRating - info.requiredRating) /
            (info.nextLevel.requiredRating - info.requiredRating)) *
            100
        )
      : 100,
  } as UserStatusInfo & { progress: number };
};
