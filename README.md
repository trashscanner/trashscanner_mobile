# TrashScanner Mobile 🌱♻️

[![CI](https://github.com/trashscanner/trashscanner_mobile/actions/workflows/ci.yml/badge.svg)](https://github.com/trashscanner/trashscanner_mobile/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/trashscanner/trashscanner_mobile/branch/main/graph/badge.svg)](https://codecov.io/gh/trashscanner/trashscanner_mobile)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=trashscanner_trashscanner_mobile&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=trashscanner_trashscanner_mobile)
[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=trashscanner_trashscanner_mobile&metric=sqale_rating)](https://sonarcloud.io/summary/new_code?id=trashscanner_trashscanner_mobile)

Мобильное приложение для анализа типов мусора и поиска пунктов переработки. Помогает экологично утилизировать отходы с помощью AI-распознавания и интерактивных карт.

## ✨ Функционал

- 📸 **Камера**: сканирование мусора для определения типа
- 🤖 **AI-анализ**: автоматическое распознавание материала (пластик, стекло, металл и т.д.)
- 📊 **Статистика**: отслеживание переработанных отходов
- 🗺️ **Карта**: поиск ближайших пунктов утилизации
- 👤 **Профиль**: достижения и прогресс по экологичности

## 🚀 Быстрый старт

### Предварительные требования

- Node.js 20+
- npm или yarn
- Expo CLI (`npm install -g expo-cli`)
- Expo Go на телефоне (iOS/Android)

### Установка

```bash
# Клонировать репозиторий
git clone https://github.com/trashscanner/trashscanner_mobile.git
cd trashscanner_mobile

# Установить зависимости
npm install

# Запустить development сервер
npm start
```

### Запуск на устройстве

1. Откройте **Expo Go** на телефоне
2. Отсканируйте QR-код из терминала
3. Приложение загрузится автоматически

### Команды разработки

```bash
npm start          # Запустить Expo dev server
npm run android    # Запустить на Android эмуляторе
npm run ios        # Запустить на iOS симуляторе
npm run web        # Запустить веб-версию

npm run typecheck  # Проверить типы TypeScript
npm run lint       # Запустить ESLint
npm run format     # Форматировать код Prettier
npm test           # Запустить тесты
npm run test:coverage  # Тесты с покрытием
```

## 🏗️ Технологический стек

- **Framework**: React Native + Expo SDK 54
- **Язык**: TypeScript
- **UI**: Custom components с native styling
- **Навигация**: State-based navigation
- **Иконки**: Expo Vector Icons (Feather, FontAwesome5)
- **Тестирование**: Jest + React Native Testing Library
- **CI/CD**: GitHub Actions
- **Quality**: SonarCloud, Codecov

## 📁 Структура проекта

```
trashscanner_mobile/
├── src/
│   ├── components/      # Переиспользуемые UI-компоненты
│   │   ├── Button.tsx
│   │   ├── NavigationBar.tsx
│   │   ├── Badge.tsx
│   │   └── Avatar.tsx
│   └── screens/         # Экраны приложения
│       ├── AuthScreen.tsx
│       ├── CameraScreen.tsx
│       ├── AnalysisScreen.tsx
│       ├── StatsScreen.tsx
│       ├── MapScreen.tsx
│       └── ProfileScreen.tsx
├── App.tsx              # Главный компонент
├── app.json             # Expo конфигурация
└── package.json         # Зависимости
```

## 🧪 Тестирование

```bash
# Запустить все тесты
npm test

# Тесты в watch режиме
npm test -- --watch

# Покрытие кода
npm run test:coverage
```

Текущее покрытие тестами можно увидеть в бейдже сверху.

## 🔧 CI/CD

Проект использует GitHub Actions для автоматизации:

- ✅ **Lint & Format**: проверка кода на стиль
- 🧪 **Tests**: запуск unit-тестов с покрытием
- 🏗️ **Build**: сборка приложения
- 🚀 **Preview**: деплой превью на Expo для PR
- 📊 **Quality Gate**: анализ в SonarCloud

Pipeline запускается автоматически при создании Pull Request.

## 📄 Лицензия

MIT

## 🤝 Контрибьютинг

1. Форкните репозиторий
2. Создайте feature-ветку (`git checkout -b feature/amazing-feature`)
3. Закоммитьте изменения (`git commit -m 'Add amazing feature'`)
4. Запушьте в ветку (`git push origin feature/amazing-feature`)
5. Откройте Pull Request

---

Сделано с ❤️ для заботы об экологии

