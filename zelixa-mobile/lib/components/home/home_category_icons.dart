import 'package:flutter/material.dart';

class HomeCategoryIcons extends StatelessWidget {
  const HomeCategoryIcons({super.key});

  @override
  Widget build(BuildContext context) {
    final List<Map<String, dynamic>> categories = [
      {'name': 'Shirt', 'icon': Icons.checkroom_outlined},
      {'name': 'Shoes', 'icon': Icons.do_not_step_outlined},
      {'name': 'Watch', 'icon': Icons.watch_outlined},
      {'name': 'Bags', 'icon': Icons.local_mall_outlined},
      {'name': 'Other', 'icon': Icons.grid_view_outlined},
    ];

    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: categories.map((cat) {
        return Column(
          children: [
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: Colors.white,
                shape: BoxShape.circle,
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.05),
                    blurRadius: 8,
                    offset: const Offset(0, 4),
                  ),
                ],
              ),
              child: Icon(
                cat['icon'],
                color: const Color(0xFF6A1B9A),
                size: 24,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              cat['name'],
              style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w500),
            ),
          ],
        );
      }).toList(),
    );
  }
}
