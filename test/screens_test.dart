import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:network_image_mock/network_image_mock.dart';

import 'package:trashscanner_mobile/models/app_models.dart';
import 'package:trashscanner_mobile/screens/analysis_screen.dart';
import 'package:trashscanner_mobile/screens/profile_screen.dart';
import 'package:trashscanner_mobile/screens/stats_screen.dart';

void main() {
  group('StatsScreen', () {
    testWidgets('отображает основные показатели', (tester) async {
      await tester.pumpWidget(const MaterialApp(home: StatsScreen()));

      expect(find.text('Статистика'), findsOneWidget);
      expect(find.text('127'), findsOneWidget);
      expect(find.text('Проанализировано'), findsOneWidget);
      expect(find.text('45.2'), findsOneWidget);
      expect(find.text('кг переработано'), findsOneWidget);
      expect(find.text('Пластик'), findsOneWidget);
    });
  });

  group('AnalysisScreen', () {
    testWidgets('показывает результат анализа и рекомендации', (tester) async {
      const result = AnalysisResult(
        type: 'Пластик',
        category: 'PET-бутылка',
        recommendation: 'Сдайте в контейнер для пластика',
        confidence: 92,
        imagePath: 'https://example.com/image.jpg',
      );

      await mockNetworkImagesFor(() async {
        await tester.pumpWidget(
          MaterialApp(
            home: AnalysisScreen(
              result: result,
              onRestart: () {},
              onOpenMap: () {},
            ),
          ),
        );
        await tester.pumpAndSettle();
      });

      expect(find.text('Результат анализа'), findsOneWidget);
      expect(find.text('Пластик'), findsWidgets);
      expect(find.text('PET-бутылка'), findsOneWidget);
      expect(find.textContaining('92%'), findsOneWidget);
      expect(find.text('Сдайте в контейнер для пластика'), findsOneWidget);
      expect(find.text('Повторить анализ'), findsOneWidget);
      expect(find.text('Найти пункт утилизации'), findsOneWidget);
    });
  });

  group('ProfileScreen', () {
    testWidgets('отображает данные пользователя и настройки', (tester) async {
      const user = UserProfile(
        name: 'Анна Петрова',
        email: 'anna@example.com',
        avatarUrl: 'https://example.com/avatar.jpg',
        status: 'Эко-активист',
        analyzedCount: 10,
        totalKg: 5.5,
        activeDays: 3,
      );

      await mockNetworkImagesFor(() async {
        await tester.pumpWidget(
          MaterialApp(
            home: ProfileScreen(
              user: user,
              onLogout: () {},
            ),
          ),
        );
        await tester.pumpAndSettle();
      });

      expect(find.text('Профиль'), findsOneWidget);
      expect(find.text('Анна Петрова'), findsOneWidget);
      expect(find.text('anna@example.com'), findsOneWidget);
      expect(find.text('Эко-активист'), findsOneWidget);
      expect(find.text('Анализов'), findsOneWidget);
      expect(find.text('кг'), findsOneWidget);
      expect(find.text('Дней'), findsOneWidget);
      expect(find.text('Уведомления'), findsOneWidget);
      expect(find.text('Выйти'), findsOneWidget);
    });
  });
}
