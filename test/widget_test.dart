// This is a basic Flutter widget test.
//
// To perform an interaction with a widget in your test, use the WidgetTester
// utility in the flutter_test package. For example, you can send tap and scroll
// gestures. You can also use WidgetTester to find child widgets in the widget
// tree, read text, and verify that the values of widget properties are correct.

import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:network_image_mock/network_image_mock.dart';

import 'package:trashscanner_mobile/screens/auth_screen.dart';

void main() {
  testWidgets('Показывается экран авторизации', (tester) async {
    await mockNetworkImagesFor(() async {
      await tester.pumpWidget(
        MaterialApp(
          home: AuthScreen(onAuthenticated: () {}),
        ),
      );

      expect(find.text('Анализатор мусора'), findsOneWidget);
      expect(find.text('Войти'), findsOneWidget);
    });
  });
}
