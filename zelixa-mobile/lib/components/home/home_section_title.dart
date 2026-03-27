import 'package:flutter/material.dart';

class HomeSectionTitle extends StatelessWidget {
  final String title;
  final bool hasTimer;
  final VoidCallback? onSeeAll;

  const HomeSectionTitle({
    super.key,
    required this.title,
    this.hasTimer = false,
    this.onSeeAll,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        if (hasTimer) ...[
          const Icon(Icons.flash_on, color: Colors.yellow, size: 20),
          const SizedBox(width: 4),
        ],
        Text(
          title,
          style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
        ),
        if (hasTimer) ...[
          const SizedBox(width: 12),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
            decoration: BoxDecoration(
              color: Colors.red,
              borderRadius: BorderRadius.circular(4),
            ),
            child: const Text(
              '02:14:35',
              style: TextStyle(
                color: Colors.white,
                fontSize: 12,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
        ],
        const Spacer(),
        GestureDetector(
          onTap: onSeeAll,
          child: const Text(
            'See All',
            style: TextStyle(
              color: Colors.deepPurple,
              fontWeight: FontWeight.bold,
            ),
          ),
        ),
      ],
    );
  }
}
