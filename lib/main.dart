import 'package:flutter/material.dart';

import 'models/app_models.dart';
import 'screens/analysis_screen.dart';
import 'screens/auth_screen.dart';
import 'screens/camera_screen.dart';
import 'screens/map_screen.dart';
import 'screens/profile_screen.dart';
import 'screens/stats_screen.dart';
import 'theme/app_theme.dart';

void main() {
  runApp(const TrashScannerApp());
}

class TrashScannerApp extends StatefulWidget {
  const TrashScannerApp({super.key});

  @override
  State<TrashScannerApp> createState() => _TrashScannerAppState();
}

enum AppPage { camera, stats, map, profile, analysis }

class _TrashScannerAppState extends State<TrashScannerApp> {
  bool _isAuthenticated = false;
  AppPage _currentPage = AppPage.camera;
  int _currentNavIndex = 0;

  AnalysisResult? _analysisResult;

  static const List<AppPage> _navigationPages = [
    AppPage.camera,
    AppPage.stats,
    AppPage.map,
    AppPage.profile,
  ];

  final UserProfile _userProfile = const UserProfile(
    name: 'Анна Петрова',
    email: 'anna.petrova@email.com',
    avatarUrl:
        'https://images.unsplash.com/photo-1494790108755-2616c13488ac?w=150&h=150&fit=crop&crop=face',
    status: 'Эко-активист',
    analyzedCount: 127,
    totalKg: 45.2,
    activeDays: 15,
  );

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'Trash Scanner',
      theme: buildAppTheme(),
      home: _buildHome(),
    );
  }

  Widget _buildHome() {
    if (!_isAuthenticated) {
      return AuthScreen(onAuthenticated: _handleAuthenticated);
    }

    if (_currentPage == AppPage.analysis && _analysisResult != null) {
      return AnalysisScreen(
        result: _analysisResult!,
        onRestart: _handleRestartAnalysis,
        onOpenMap: _handleOpenMap,
      );
    }

    return Scaffold(
      body: IndexedStack(
        index: _currentNavIndex,
        children: [
          CameraScreen(onCapture: _handleCapture),
          const StatsScreen(),
          const MapScreen(),
          ProfileScreen(user: _userProfile, onLogout: _handleLogout),
        ],
      ),
      bottomNavigationBar: _buildBottomNavigation(),
    );
  }

  Widget _buildBottomNavigation() {
    return Container(
      decoration: const BoxDecoration(
        color: Colors.white,
        boxShadow: [
          BoxShadow(
            color: Color(0x0D000000),
            blurRadius: 12,
            offset: Offset(0, -2),
          ),
        ],
      ),
      child: SafeArea(
        top: false,
        child: BottomNavigationBar(
          currentIndex: _currentNavIndex,
          type: BottomNavigationBarType.fixed,
          onTap: _handleNavTap,
          items: const [
            BottomNavigationBarItem(
              icon: Icon(Icons.photo_camera_outlined),
              activeIcon: Icon(Icons.photo_camera),
              label: 'Камера',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.bar_chart_outlined),
              activeIcon: Icon(Icons.bar_chart),
              label: 'Статистика',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.map_outlined),
              activeIcon: Icon(Icons.map),
              label: 'Карта',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.person_outline),
              activeIcon: Icon(Icons.person),
              label: 'Профиль',
            ),
          ],
        ),
      ),
    );
  }

  void _handleAuthenticated() {
    setState(() {
      _isAuthenticated = true;
      _currentPage = AppPage.camera;
      _currentNavIndex = 0;
    });
  }

  void _handleCapture(String imagePath) {
    setState(() {
      _analysisResult = _mockAnalysisResult(imagePath);
      _currentPage = AppPage.analysis;
    });
  }

  void _handleRestartAnalysis() {
    setState(() {
      _currentPage = AppPage.camera;
      _currentNavIndex = 0;
    });
  }

  void _handleOpenMap() {
    setState(() {
      _currentPage = AppPage.map;
      _currentNavIndex = _navigationPages.indexOf(AppPage.map);
    });
  }

  void _handleNavTap(int index) {
    setState(() {
      _currentNavIndex = index;
      _currentPage = _navigationPages[index];
    });
  }

  void _handleLogout() {
    setState(() {
      _isAuthenticated = false;
      _analysisResult = null;
      _currentPage = AppPage.camera;
      _currentNavIndex = 0;
    });
  }

  AnalysisResult _mockAnalysisResult(String imagePath) {
    return AnalysisResult(
      type: 'Пластик',
      category: 'PET-бутылка',
      recommendation: 'Отправить в контейнер для пластика',
      confidence: 95,
      imagePath: imagePath,
    );
  }
}
