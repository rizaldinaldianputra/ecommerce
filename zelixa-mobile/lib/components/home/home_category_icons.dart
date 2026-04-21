import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../riverpod/home_provider.dart';

class HomeCategoryIcons extends ConsumerWidget {
  const HomeCategoryIcons({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final categoriesAsync = ref.watch(homeCategoriesProvider);

    return categoriesAsync.when(
      data: (categories) {
        if (categories.isEmpty) return const SizedBox.shrink();

        // Limit to 5 categories to match UI design
        final displayCategories = categories.take(5).toList();

        return Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: displayCategories.map((cat) {
            return Column(
              children: [
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    shape: BoxShape.circle,
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withValues(alpha: 0.05),
                        blurRadius: 8,
                        offset: const Offset(0, 4),
                      ),
                    ],
                  ),
                  child: cat.imageUrl != null && cat.imageUrl!.isNotEmpty
                      ? Image.network(
                          cat.imageUrl!,
                          width: 24,
                          height: 24,
                          errorBuilder: (ctx, _, __) => const Icon(
                            Icons.category_outlined,
                            color: Color(0xFF6A1B9A),
                            size: 24,
                          ),
                        )
                      : const Icon(
                          Icons.category_outlined,
                          color: Color(0xFF6A1B9A),
                          size: 24,
                        ),
                ),
                const SizedBox(height: 8),
                Text(
                  cat.name,
                  style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w500),
                  overflow: TextOverflow.ellipsis,
                ),
              ],
            );
          }).toList(),
        );
      },
      loading: () => const Center(child: CircularProgressIndicator()),
      error: (error, _) => const Center(child: Icon(Icons.error_outline)),
    );
  }
}
