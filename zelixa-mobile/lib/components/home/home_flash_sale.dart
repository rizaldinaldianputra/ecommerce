import 'dart:async' as java_timer;

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../riverpod/home_provider.dart';
import '../card_widget.dart';

class HomeFlashSale extends ConsumerWidget {
  const HomeFlashSale({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final flashSaleAsync = ref.watch(homeFlashSaleContentProvider);

    return flashSaleAsync.when(
      data: (items) {
        if (items.isEmpty) {
          return const SizedBox.shrink();
        }

        // Logic check: If index 0 is a campaign (has products list), use that.
        // Otherwise, fallback to the list of individual items.
        final campaign = items.firstWhere(
          (i) => i.products != null && i.products!.isNotEmpty,
          orElse: () => items.first,
        );

        // Scheduling logic: Only show if within start/end dates
        final now = DateTime.now();
        if (campaign.startDate != null && now.isBefore(campaign.startDate!)) {
          return const SizedBox.shrink();
        }
        if (campaign.endDate != null && now.isAfter(campaign.endDate!)) {
          return const SizedBox.shrink();
        }

        final List<Map<String, dynamic>> displayProducts = [];
        if (campaign.products != null && campaign.products!.isNotEmpty) {
          for (var p in campaign.products!) {
            displayProducts.add({'product': p, 'item': campaign});
          }
        } else {
          for (var i in items) {
            if (i.product != null) {
              displayProducts.add({'product': i.product, 'item': i});
            }
          }
        }

        if (displayProducts.isEmpty) return const SizedBox.shrink();

        return Column(
          children: [
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: Row(
                children: [
                  const Icon(Icons.bolt, color: Colors.amber, size: 28),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'FLASH SALE',
                          style: TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                            color: Colors.pink,
                            letterSpacing: 1.2,
                          ),
                        ),
                        if (campaign.title != null &&
                            campaign.title!.isNotEmpty)
                          Text(
                            campaign.title!,
                            style: TextStyle(
                              fontSize: 12,
                              fontWeight: FontWeight.bold,
                              color: Colors.grey.shade600,
                            ),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                      ],
                    ),
                  ),
                  if (campaign.endDate != null)
                    _FlashSaleTimer(endDate: campaign.endDate!),
                ],
              ),
            ),
            const SizedBox(height: 16),
            SizedBox(
              height: 280,
              child: ListView.builder(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                scrollDirection: Axis.horizontal,
                itemCount: displayProducts.length,
                itemBuilder: (context, index) {
                  final data = displayProducts[index];
                  final product = data['product'];
                  final item = data['item'];

                  return Container(
                    width: 150,
                    margin: const EdgeInsets.only(right: 16),
                    child: ProductCard(
                      image:
                          product.imageUrl ??
                          item.imageUrl ??
                          'https://picsum.photos/300?random=$index',
                      title: product.name,
                      brand: 'Zelixa',
                      price: product.price,
                      originalPrice: product.discountPrice != null
                          ? product.price
                          : product.price * 1.2,
                      rating: 4.5,
                      sizes: const ['S', 'M', 'L', 'XL'],
                      colorHexes: const [
                        '#FF5733',
                        '#33FF57',
                        '#3357FF',
                        '#F1C40F',
                      ],
                    ),
                  );
                },
              ),
            ),
          ],
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

class _FlashSaleTimer extends StatefulWidget {
  final DateTime endDate;
  const _FlashSaleTimer({required this.endDate});

  @override
  State<_FlashSaleTimer> createState() => _FlashSaleTimerState();
}

class _FlashSaleTimerState extends State<_FlashSaleTimer> {
  late Duration _timeLeft;
  late java_timer.Timer _timer;

  @override
  void initState() {
    super.initState();
    _timeLeft = widget.endDate.difference(DateTime.now());
    _timer = java_timer.Timer.periodic(const Duration(seconds: 1), (timer) {
      setState(() {
        _timeLeft = widget.endDate.difference(DateTime.now());
      });
    });
  }

  @override
  void dispose() {
    _timer.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    if (_timeLeft.isNegative) return const SizedBox.shrink();

    String twoDigits(int n) => n.toString().padLeft(2, "0");
    final hours = twoDigits(_timeLeft.inHours);
    final minutes = twoDigits(_timeLeft.inMinutes.remainder(60));
    final seconds = twoDigits(_timeLeft.inSeconds.remainder(60));

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
            decoration: BoxDecoration(
              color: Colors.pink,
              borderRadius: BorderRadius.circular(4),
            ),
            child: Text(
              hours,
              style: const TextStyle(
                color: Colors.white,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
          const Padding(
            padding: EdgeInsets.symmetric(horizontal: 4),
            child: Text(":", style: TextStyle(fontWeight: FontWeight.bold)),
          ),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
            decoration: BoxDecoration(
              color: Colors.pink,
              borderRadius: BorderRadius.circular(4),
            ),
            child: Text(
              minutes,
              style: const TextStyle(
                color: Colors.white,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
          const Padding(
            padding: EdgeInsets.symmetric(horizontal: 4),
            child: Text(":", style: TextStyle(fontWeight: FontWeight.bold)),
          ),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
            decoration: BoxDecoration(
              color: Colors.pink,
              borderRadius: BorderRadius.circular(4),
            ),
            child: Text(
              seconds,
              style: const TextStyle(
                color: Colors.white,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
