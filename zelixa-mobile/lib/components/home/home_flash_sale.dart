import 'package:flutter/material.dart';
import '../card_widget.dart';

class HomeFlashSale extends StatelessWidget {
  const HomeFlashSale({super.key});

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: 280,
      child: ListView.builder(
        padding: const EdgeInsets.symmetric(horizontal: 16),
        scrollDirection: Axis.horizontal,
        itemCount: 5,
        itemBuilder: (context, index) {
          return Container(
            width: 150,
            margin: const EdgeInsets.only(right: 16),
            child: ProductCard(
              image: 'https://picsum.photos/300?random=${index + 10}',
              title: 'Flash Item $index',
              brand: 'Zelixa',
              price: 50000 + (index * 5000),
              originalPrice: 100000 + (index * 5000),
              rating: 4.2,
              sizes: const ['S', 'M', 'L', 'XL'],
              colorHexes: const ['#FF5733', '#33FF57', '#3357FF', '#F1C40F'],
            ),
          );
        },
      ),
    );
  }
}
