import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../riverpod/home_provider.dart';
import '../card_widget.dart';

class HomeFlashSale extends ConsumerWidget {
  const HomeFlashSale({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final flashSaleAsync = ref.watch(homeFlashSaleProvider);

    return flashSaleAsync.when(
      data: (flashSale) {
        if (flashSale == null || flashSale.items.isEmpty) {
          return const SizedBox.shrink();
        }

        return SizedBox(
          height: 280,
          child: ListView.builder(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            scrollDirection: Axis.horizontal,
            itemCount: flashSale.items.length,
            itemBuilder: (context, index) {
              final item = flashSale.items[index];
              return Container(
                width: 150,
                margin: const EdgeInsets.only(right: 16),
                child: ProductCard(
                  image: 'https://picsum.photos/300?random=${index + 10}', // Fallback image for flash sale item
                  title: item.productName ?? 'Flash Item',
                  brand: 'Zelixa',
                  price: item.discountPrice,
                  originalPrice: item.discountPrice * 1.2, // Mock original price since item doesn't have it explicitly
                  rating: 4.5,
                  sizes: const ['S', 'M', 'L', 'XL'],
                  colorHexes: const ['#FF5733', '#33FF57', '#3357FF', '#F1C40F'],
                ),
              );
            },
          ),
        );
      },
      loading: () => const SizedBox(
        height: 280,
        child: Center(child: CircularProgressIndicator()),
      ),
      error: (error, _) => const SizedBox(
        height: 280,
        child: Center(child: Icon(Icons.error_outline)),
      ),
    );
  }
}
