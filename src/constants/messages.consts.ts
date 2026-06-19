export const MESSAGES = {
  BET_CREATED: (id: number) => `✅ Ставка добавлена! ID: ${id}`,
  BET_UPDATED: (id: number) => `✅ Ставка #${id} обновлена`,
  BET_DELETED: "✅ Ставка удалена",
  BET_CREATE_ERROR: "❌ Ошибка при добавлении ставки",
  BET_UPDATE_ERROR: "❌ Ошибка при обновлении ставки",
  BET_DELETE_ERROR: "❌ Ошибка при удалении ставки",
  BETS_FETCH_ERROR: "Ошибка при получении ставок:",
  TRANSACTION_CREATED: "✅ Операция добавлена",
  TRANSACTION_CREATE_ERROR: "❌ Ошибка при добавлении операции",
  TRANSACTION_DELETE_ERROR: "❌ Ошибка при удалении операции",
  BUDGET_FETCH_ERROR: "Ошибка при получении данных бюджета:",
  FOOTBALL_FETCH_ERROR: "Ошибка при загрузке футбольных данных:",
  FOOTBALL_API_KEY_MISSING:
    "Добавьте VITE_FOOTBALL_DATA_API_KEY в .env (ключ с football-data.org)",
  DELETE_CONFIRM: "Удалить эту запись?",
  THEME_MODE_PROVIDER_ERROR: "useThemeMode must be used within ThemeModeProvider",
} as const;

export const BET_STATUS_LABELS = {
  pending: "В ожидании",
  win: "Выигрыш",
  lose: "Проигрыш",
  return: "Возврат",
  cashed_out: "Кэшаут",
} as const;

export const BET_SPORT_LABELS = {
  football: "Футбол",
  esports: "Киберспорт",
  hockey: "Хоккей",
} as const;

export const TRANSACTION_TYPE_LABELS = {
  initial: "Стартовый баланс",
  deposit: "Пополнение",
  withdrawal: "Снятие",
} as const;
