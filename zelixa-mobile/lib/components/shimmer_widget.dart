import 'package:flutter/material.dart';
import 'package:shimmer/shimmer.dart';

class ZelixaShimmer extends StatelessWidget {
  final double width;
  final double height;
  final ShapeBorder shapeBorder;

  const ZelixaShimmer.rectangular({
    super.key,
    this.width = double.infinity,
    required this.height,
    this.shapeBorder = const RoundedRectangleBorder(
      borderRadius: BorderRadius.all(Radius.circular(12)),
    ),
  });

  const ZelixaShimmer.circular({
    super.key,
    required this.width,
    required this.height,
    this.shapeBorder = const CircleBorder(),
  });

  @override
  Widget build(BuildContext context) {
    return Shimmer.fromColors(
      baseColor: Colors.grey[300]!,
      highlightColor: Colors.grey[100]!,
      period: const Duration(milliseconds: 1500),
      child: Container(
        width: width,
        height: height,
        decoration: ShapeDecoration(
          color: Colors.grey[400]!,
          shape: shapeBorder,
        ),
      ),
    );
  }

  // --- Predefined Shimmer Layouts ---

  static Widget productCard() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const ZelixaShimmer.rectangular(height: 140),
        const SizedBox(height: 12),
        FractionallySizedBox(
          widthFactor: 0.6,
          child: const ZelixaShimmer.rectangular(height: 12),
        ),
        const SizedBox(height: 8),
        FractionallySizedBox(
          widthFactor: 0.4,
          child: const ZelixaShimmer.rectangular(height: 10),
        ),
      ],
    );
  }

  static Widget listTile() {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8.0, horizontal: 16.0),
      child: Row(
        children: [
          const ZelixaShimmer.circular(width: 50, height: 50),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const ZelixaShimmer.rectangular(height: 14),
                const SizedBox(height: 8),
                FractionallySizedBox(
                  widthFactor: 0.7,
                  child: const ZelixaShimmer.rectangular(height: 10),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
