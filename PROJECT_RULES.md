# Правила работы на проекте

Общие соглашения для разработки Bet Tracker. Структура папок описана отдельно в [STRUCTURE.md](./STRUCTURE.md).

---

## Цвета

**Все цвета берутся только из `src/constants/color/`.**

Запрещено:
- хардкодить HEX/rgb в компонентах (`#3390EC`, `"white"`, `"#555"`);
- задавать цвета напрямую в `index.css` (кроме технического reset).

Разрешено:
- использовать токены из `constants/color/color.consts.ts`;
- обращаться к цветам через MUI-тему: `theme.palette.primary.main`, `bgcolor: "background.paper"`, `color: "text.secondary"`;
- добавлять новый цвет в `constants/color/color.consts.ts`, затем подключать в `theme/createAppTheme.ts`.

```
constants/color/
└── color.consts.ts    # PALETTE, LIGHT_THEME, DARK_THEME, SEMANTIC_COLORS
```

---

## Без магических строк

**Не используем «магические строки» в коде.** Повторяющиеся и значимые значения выносим в константы или enum.

### Что выносить

| Тип значения | Куда класть | Пример файла |
|--------------|-------------|--------------|
| Доменная сущность (enum + interface) | `interfaces/` | `bet.interface.ts` |
| Маршруты, сообщения (2+ файла) | `constants/` | `routes.consts.ts`, `messages.consts.ts` |
| Цвета | `constants/color/` | `color.consts.ts` |
| Значения для одного файла | **внутри этого файла** | константы вверху `AddValue.tsx` |

### Когда НЕ создавать отдельный файл констант

**Если константа используется только в одном файле — отдельный `*.consts.ts` не создаём.** Значения объявляем в том же файле, где применяются (вверху компонента, api-метода или хука).

Отдельный файл констант оправдан только когда значение импортируется **из двух и более файлов**.

```ts
// ✅ Один потребитель — константа внутри файла
// pages/Statistics/Statistics.tsx
const CHART_CONFIG = { LINE_TYPE: "monotone" } as const;

// ✅ Два потребителя — отдельный файл
// constants/messages.consts.ts → AddValue.tsx + Statistics.tsx
```

### Что считается магической строкой

- `"win"`, `"football"`, `"BYN"` в компонентах
- `"/bets/"` в api-файлах
- `"bet-tracker-theme"` в хуках
- `"light"` / `"dark"` вне enum темы
- повторяющиеся тексты алертов и ошибок

### Что допустимо оставить inline

- уникальные UI-лейблы без повторного использования (если не планируется i18n);
- `aria-label` и `role`, если не дублируются;
- технические MUI-пропсы: `variant="contained"`, `component="form"`.

---

## Объединение файлов одной сущности

**Enum, интерфейсы и константы одной сущности хранятся в одном файле**, а не разбросаны по `betStatus.enum.ts` + `bet.interface.ts` + `betSport.enum.ts`.

| Сущность | Файл |
|----------|------|
| Ставка (bet) | `interfaces/bet.interface.ts` — enum + интерфейсы |
| Тема | `interfaces/theme.interface.ts` — ThemeMode + MUI-расширения |
| Цвета | `constants/color/color.consts.ts` — вся палитра |
| Статистика (страница) | `generateChartData.ts` — интерфейс + хелпер |
| Компонент TabPanel | `TabPanel.tsx` — props + компонент |

Не дробить одну сущность на несколько файлов без необходимости.

---

## Enum

- Enum одной сущности — в том же файле, что интерфейсы этой сущности.
- Строковые enum для значений API: `Win = "win"`.

```ts
// interfaces/bet.interface.ts
export enum BetStatus {
  Win = "win",
  Lose = "lose",
}

export interface IBet {
  status: BetStatus;
}
```

---

## Константы

- Файл: `entity.consts.ts`.
- Объекты с `as const` для неизменяемых наборов значений.
- Массивы опций для селектов, навигации, конфигурации.

```ts
export const BET_STATUS_OPTIONS = [
  { value: BetStatus.Win, label: BetStatus.Win },
] as const;
```

---

## API

- Базовый URL и пути эндпоинтов — внутри соответствующего `api/*.api.ts`, если используются только там.
- Если URL или путь нужен в нескольких api-файлах — вынести в `constants/`.
- В компонентах и страницах прямых вызовов `axios` нет.

---

## Тема

- `ThemeMode` и MUI-расширения — `interfaces/theme.interface.ts`.
- Цветовые токены — `constants/color/color.consts.ts`.
- Ключ localStorage и media query — внутри `hooks/useThemeMode.tsx`.
- Переключение только через `useThemeMode`.

---

## Импорты и типы

- Общие интерфейсы — `interfaces/`.
- Типы домена предпочтительно строить на enum, а не на union строк в компонентах.
- Страницы не вызывают `axios` напрямую.

---

## Чеклист перед коммитом

- [ ] Нет новых HEX-цветов вне `constants/color/`
- [ ] Нет повторяющихся строк без константы/enum
- [ ] Нет лишних `*.consts.ts` с единственным потребителем
- [ ] Сборка проходит: `npm run build`
