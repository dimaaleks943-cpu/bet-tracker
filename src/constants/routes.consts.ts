export const ROUTES = {
  BETS: "/",
  STATISTICS: "/statistics",
  BUDGET: "/budget",
  FOOTBALL: "/football",
} as const;

export const ROUTE_LABELS = {
  [ROUTES.BETS]: "Ставки",
  [ROUTES.STATISTICS]: "Статистика",
  [ROUTES.BUDGET]: "Бюджет",
  [ROUTES.FOOTBALL]: "Футбол",
} as const;
