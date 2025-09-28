import 'package:flutter/material.dart';

import '../models/app_models.dart';
import '../theme/app_theme.dart';

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key, required this.user, required this.onLogout});

  final UserProfile user;
  final VoidCallback onLogout;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.fromLTRB(24, 20, 24, 120),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _buildHeader(context),
              const SizedBox(height: 24),
              _buildProfileCard(context),
              const SizedBox(height: 24),
              _buildStatsRow(context),
              const SizedBox(height: 24),
              _buildSettings(context),
              const SizedBox(height: 24),
              _buildAchievements(context),
              const SizedBox(height: 24),
              _buildLogoutButton(context),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildHeader(BuildContext context) {
    return Row(
      children: [
        const Icon(Icons.person, color: AppColors.primary),
        const SizedBox(width: 12),
        Text(
          'Профиль',
          style:
              Theme.of(context).textTheme.titleMedium?.copyWith(fontWeight: FontWeight.w600),
        ),
      ],
    );
  }

  Widget _buildProfileCard(BuildContext context) {
    return Card(
      margin: EdgeInsets.zero,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: Row(
          children: [
            CircleAvatar(
              radius: 36,
              backgroundImage: NetworkImage(user.avatarUrl),
            ),
            const SizedBox(width: 20),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    user.name,
                    style: Theme.of(context)
                        .textTheme
                        .titleMedium
                        ?.copyWith(fontWeight: FontWeight.w600),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    user.email,
                    style: Theme.of(context)
                        .textTheme
                        .bodySmall
                        ?.copyWith(color: AppColors.neutral),
                  ),
                  const SizedBox(height: 12),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                    decoration: BoxDecoration(
                      color: AppColors.primary.withValues(alpha: 0.08),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Container(
                          width: 6,
                          height: 6,
                          decoration: const BoxDecoration(
                            color: AppColors.primary,
                            shape: BoxShape.circle,
                          ),
                        ),
                        const SizedBox(width: 8),
                        Text(
                          user.status,
                          style: Theme.of(context)
                              .textTheme
                              .bodySmall
                              ?.copyWith(color: AppColors.primary, fontWeight: FontWeight.w600),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            IconButton(
              onPressed: () {},
              icon: const Icon(Icons.settings_outlined),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildStatsRow(BuildContext context) {
    return Row(
      children: [
        _StatTile(
          value: user.analyzedCount.toString(),
          label: 'Анализов',
          color: AppColors.primary,
        ),
        const SizedBox(width: 12),
        _StatTile(
          value: user.totalKg.toStringAsFixed(1),
          label: 'кг',
          color: AppColors.secondary,
        ),
        const SizedBox(width: 12),
        _StatTile(
          value: user.activeDays.toString(),
          label: 'Дней',
          color: AppColors.accent,
        ),
      ],
    );
  }

  Widget _buildSettings(BuildContext context) {
    final items = [
      _SettingItem(
        icon: Icons.notifications_none,
        title: 'Уведомления',
        subtitle: 'Push-уведомления и напоминания',
        hasSwitch: true,
        value: true,
      ),
      _SettingItem(
        icon: Icons.language,
        title: 'Язык',
        subtitle: 'Русский',
        hasSwitch: false,
      ),
      _SettingItem(
        icon: Icons.dark_mode_outlined,
        title: 'Тёмная тема',
        subtitle: 'Автоматически',
        hasSwitch: true,
        value: false,
      ),
    ];

    return Card(
      margin: EdgeInsets.zero,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Настройки',
              style:
                  Theme.of(context).textTheme.titleSmall?.copyWith(fontWeight: FontWeight.w600),
            ),
            const SizedBox(height: 20),
            ...items.map((item) => _SettingsTile(item: item)),
          ],
        ),
      ),
    );
  }

  Widget _buildAchievements(BuildContext context) {
    const emojis = ['🌱', '♻️', '🏆', '⭐', '🌍'];
    return Card(
      margin: EdgeInsets.zero,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Достижения',
              style:
                  Theme.of(context).textTheme.titleSmall?.copyWith(fontWeight: FontWeight.w600),
            ),
            const SizedBox(height: 16),
            SizedBox(
              height: 72,
              child: ListView.separated(
                scrollDirection: Axis.horizontal,
                itemBuilder: (context, index) {
                  return Container(
                    width: 60,
                    height: 60,
                    decoration: BoxDecoration(
                      color: AppColors.primary.withValues(alpha: 0.08),
                      borderRadius: BorderRadius.circular(18),
                    ),
                    alignment: Alignment.center,
                    child: Text(
                      emojis[index],
                      style: const TextStyle(fontSize: 26),
                    ),
                  );
                },
                separatorBuilder: (_, __) => const SizedBox(width: 12),
                itemCount: emojis.length,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildLogoutButton(BuildContext context) {
    return OutlinedButton.icon(
      onPressed: onLogout,
      icon: const Icon(Icons.logout, color: Colors.redAccent),
      label: Text(
        'Выйти',
        style: Theme.of(context)
            .textTheme
            .bodyMedium
            ?.copyWith(color: Colors.redAccent, fontWeight: FontWeight.w600),
      ),
      style: OutlinedButton.styleFrom(
        side: const BorderSide(color: Color(0x33FF5252)),
        minimumSize: const Size.fromHeight(52),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      ),
    );
  }
}

class _StatTile extends StatelessWidget {
  const _StatTile({required this.value, required this.label, required this.color});

  final String value;
  final String label;
  final Color color;

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: Card(
        margin: EdgeInsets.zero,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        child: Padding(
          padding: const EdgeInsets.symmetric(vertical: 20, horizontal: 12),
          child: Column(
            children: [
              Text(
                value,
                style: Theme.of(context).textTheme.titleMedium?.copyWith(
                      color: color,
                      fontWeight: FontWeight.w600,
                    ),
              ),
              const SizedBox(height: 6),
              Text(
                label,
                style: Theme.of(context)
                    .textTheme
                    .bodySmall
                    ?.copyWith(color: AppColors.neutral),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _SettingItem {
  const _SettingItem({
    required this.icon,
    required this.title,
    required this.subtitle,
    required this.hasSwitch,
    this.value = false,
  });

  final IconData icon;
  final String title;
  final String subtitle;
  final bool hasSwitch;
  final bool value;
}

class _SettingsTile extends StatelessWidget {
  const _SettingsTile({required this.item});

  final _SettingItem item;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Row(
        children: [
          Container(
            width: 44,
            height: 44,
            decoration: BoxDecoration(
              color: AppColors.primary.withValues(alpha: 0.1),
              borderRadius: BorderRadius.circular(14),
            ),
            child: Icon(item.icon, color: AppColors.primary),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  item.title,
                  style: Theme.of(context)
                      .textTheme
                      .bodyMedium
                      ?.copyWith(fontWeight: FontWeight.w600),
                ),
                const SizedBox(height: 4),
                Text(
                  item.subtitle,
                  style: Theme.of(context)
                      .textTheme
                      .bodySmall
                      ?.copyWith(color: AppColors.neutral),
                ),
              ],
            ),
          ),
          if (item.hasSwitch)
            Switch(
              value: item.value,
              onChanged: (_) {},
              thumbColor: WidgetStateProperty.resolveWith((states) {
                if (states.contains(WidgetState.selected)) {
                  return AppColors.primary;
                }
                return null;
              }),
              trackColor: WidgetStateProperty.resolveWith((states) {
                if (states.contains(WidgetState.selected)) {
                  return AppColors.primary.withValues(alpha: 0.3);
                }
                return null;
              }),
            )
          else
            const Icon(Icons.chevron_right, color: AppColors.neutral),
        ],
      ),
    );
  }
}
