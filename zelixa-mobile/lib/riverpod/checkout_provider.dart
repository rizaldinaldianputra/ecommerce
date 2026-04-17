import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/checkout_model.dart';
import '../services/order_service.dart';

final orderServiceProvider = Provider<OrderService>((ref) {
  return OrderService();
});

class CheckoutNotifier extends StateNotifier<AsyncValue<OrderResponse?>> {
  final OrderService _orderService;

  CheckoutNotifier(this._orderService) : super(const AsyncValue.data(null));

  Future<void> checkout(CheckoutRequest request) async {
    state = const AsyncValue.loading();
    try {
      final order = await _orderService.checkout(request);
      state = AsyncValue.data(order);
    } catch (e, st) {
      state = AsyncValue.error(e, st);
    }
  }
}

final checkoutProvider = StateNotifierProvider<CheckoutNotifier, AsyncValue<OrderResponse?>>((ref) {
  final orderService = ref.read(orderServiceProvider);
  return CheckoutNotifier(orderService);
});
