import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/shipping_model.dart';
import '../services/shipping_service.dart';

final shippingServiceProvider = Provider<ShippingService>((ref) {
  return ShippingService();
});

class ShippingNotifier extends StateNotifier<AsyncValue<List<ShippingCourierResponse>>> {
  final ShippingService _shippingService;

  ShippingNotifier(this._shippingService) : super(const AsyncValue.data([]));

  Future<void> calculateCost(String destinationSubdistrictId) async {
    if (destinationSubdistrictId.isEmpty) {
      state = const AsyncValue.data([]);
      return;
    }

    state = const AsyncValue.loading();
    try {
      final couriers = await _shippingService.calculateCost(
        origin: '1391', // Default hardcoded origin (Kebon Jeruk)
        destination: destinationSubdistrictId,
        weight: 1000,   // Default hardcoded weight 1KG
        courier: 'jne:sicepat:jnt:tiki:anteraja:pos',
      );
      state = AsyncValue.data(couriers);
    } catch (e, st) {
      state = AsyncValue.error(e, st);
    }
  }

  void reset() {
    state = const AsyncValue.data([]);
  }
}

final shippingProvider = StateNotifierProvider<ShippingNotifier, AsyncValue<List<ShippingCourierResponse>>>((ref) {
  final shippingService = ref.read(shippingServiceProvider);
  return ShippingNotifier(shippingService);
});
