import 'package:flutter/material.dart';

import '../models/app_models.dart';
import '../theme/app_theme.dart';

class MapScreen extends StatelessWidget {
  const MapScreen({super.key});

  List<RecyclingPoint> get _points => const [
        RecyclingPoint(
          name: 'Эко-центр Зелёный',
          address: 'ул. Ленина, 45',
          distance: '0.3 км',
          acceptedTypes: ['Пластик', 'Стекло', 'Бумага'],
          isOpen: true,
        ),
        RecyclingPoint(
          name: 'Пункт сбора MetalCorp',
          address: 'пр. Мира, 12',
          distance: '0.7 км',
          acceptedTypes: ['Металл', 'Батарейки'],
          isOpen: true,
        ),
        RecyclingPoint(
          name: 'Городской экопункт',
          address: 'ул. Садовая, 88',
          distance: '1.2 км',
          acceptedTypes: ['Пластик', 'Бумага', 'Одежда'],
          isOpen: false,
        ),
      ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Column(
          children: [
            _buildHeader(context),
            _buildMap(context),
            _buildList(context),
          ],
        ),
      ),
    );
  }

  Widget _buildHeader(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(24, 20, 24, 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const Icon(Icons.location_on, color: AppColors.primary, size: 26),
              const SizedBox(width: 10),
              Text(
                'Пункты утилизации',
                style: Theme.of(context)
                    .textTheme
                    .titleMedium
                    ?.copyWith(fontWeight: FontWeight.w600),
              ),
            ],
          ),
          const SizedBox(height: 20),
          TextField(
            decoration: InputDecoration(
              hintText: 'Введите адрес...',
              prefixIcon: const Icon(Icons.search, color: AppColors.neutral),
              suffixIcon: IconButton(
                onPressed: () {},
                icon: const Icon(Icons.tune, color: AppColors.neutral),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildMap(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 24),
      child: Stack(
        children: [
          Container(
            height: 180,
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(24),
              gradient: const LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: [Color(0x1500BCD4), Color(0x154CAF50)],
              ),
            ),
          ),
          Positioned.fill(
            child: CustomPaint(
              painter: _MapMarkersPainter(),
            ),
          ),
          Positioned(
            top: 16,
            right: 16,
            child: Material(
              color: Colors.white,
              shape: const CircleBorder(),
              elevation: 4,
              child: IconButton(
                onPressed: () {},
                icon: const Icon(Icons.navigation, color: AppColors.primary),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildList(BuildContext context) {
    return Expanded(
      child: Container(
        margin: const EdgeInsets.fromLTRB(24, 24, 24, 0),
        decoration: const BoxDecoration(),
        child: ListView.separated(
          padding: const EdgeInsets.only(bottom: 120),
          itemCount: _points.length + 1,
          separatorBuilder: (_, __) => const SizedBox(height: 16),
          itemBuilder: (context, index) {
            if (index == 0) {
              return Text(
                'Ближайшие пункты',
                style: Theme.of(context)
                    .textTheme
                    .titleSmall
                    ?.copyWith(fontWeight: FontWeight.w600),
              );
            }
            final point = _points[index - 1];
            return _RecyclingPointCard(point: point);
          },
        ),
      ),
    );
  }
}

class _RecyclingPointCard extends StatelessWidget {
  const _RecyclingPointCard({required this.point});

  final RecyclingPoint point;

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: EdgeInsets.zero,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        point.name,
                        style: Theme.of(context)
                            .textTheme
                            .bodyLarge
                            ?.copyWith(fontWeight: FontWeight.w600),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        point.address,
                        style: Theme.of(context)
                            .textTheme
                            .bodySmall
                            ?.copyWith(color: AppColors.neutral),
                      ),
                    ],
                  ),
                ),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.end,
                  children: [
                    Text(
                      point.distance,
                      style: Theme.of(context)
                          .textTheme
                          .bodySmall
                          ?.copyWith(
                            color: AppColors.secondary,
                            fontWeight: FontWeight.w600,
                          ),
                    ),
                    const SizedBox(height: 6),
                    Text(
                      point.isOpen ? 'Открыто' : 'Закрыто',
                      style: Theme.of(context).textTheme.bodySmall?.copyWith(
                            color: point.isOpen ? AppColors.primary : AppColors.error,
                            fontWeight: FontWeight.w600,
                          ),
                    ),
                  ],
                ),
              ],
            ),
            const SizedBox(height: 16),
            Wrap(
              spacing: 8,
              runSpacing: 8,
              children: [
                for (final type in point.acceptedTypes)
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                    decoration: BoxDecoration(
                      color: AppColors.primary.withValues(alpha: 0.08),
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: AppColors.primary.withValues(alpha: 0.15)),
                    ),
                    child: Text(
                      type,
                      style: Theme.of(context)
                          .textTheme
                          .bodySmall
                          ?.copyWith(color: AppColors.primary, fontWeight: FontWeight.w500),
                    ),
                  ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

class _MapMarkersPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final points = [
      Offset(size.width * 0.25, size.height * 0.3),
      Offset(size.width * 0.7, size.height * 0.45),
      Offset(size.width * 0.4, size.height * 0.75),
    ];
    final colors = [AppColors.primary, AppColors.secondary, AppColors.accent];

    for (var i = 0; i < points.length; i++) {
      final paint = Paint()
        ..color = colors[i]
        ..style = PaintingStyle.fill;

      canvas.drawCircle(points[i], 16, paint);
      canvas.drawCircle(points[i], 6, Paint()..color = Colors.white);
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
