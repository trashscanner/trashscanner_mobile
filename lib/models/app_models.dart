class AnalysisResult {
  const AnalysisResult({
    required this.type,
    required this.category,
    required this.recommendation,
    required this.confidence,
    this.imagePath,
  });

  final String type;
  final String category;
  final String recommendation;
  final double confidence;
  final String? imagePath;
}

class RecyclingPoint {
  const RecyclingPoint({
    required this.name,
    required this.address,
    required this.distance,
    required this.acceptedTypes,
    required this.isOpen,
  });

  final String name;
  final String address;
  final String distance;
  final List<String> acceptedTypes;
  final bool isOpen;
}

class WasteTypeStat {
  const WasteTypeStat({
    required this.type,
    required this.count,
    required this.percentage,
    required this.color,
  });

  final String type;
  final int count;
  final double percentage;
  final int color;
}

class UserProfile {
  const UserProfile({
    required this.name,
    required this.email,
    required this.avatarUrl,
    required this.status,
    required this.analyzedCount,
    required this.totalKg,
    required this.activeDays,
  });

  final String name;
  final String email;
  final String avatarUrl;
  final String status;
  final int analyzedCount;
  final double totalKg;
  final int activeDays;
}
