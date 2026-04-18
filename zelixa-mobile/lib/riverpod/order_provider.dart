import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/checkout_model.dart';
import '../services/order_service.dart';

final orderServiceProvider = Provider<OrderService>((ref) {
  return OrderService();
});

class OrderNotifier extends StateNotifier<AsyncValue<List<OrderResponse>>> {
  final OrderService _orderService;

  OrderNotifier(this._orderService) : super(const AsyncValue.loading()) {
    fetchOrders();
  }

  Future<void> fetchOrders() async {
    try {
      state = const AsyncValue.loading();
      // Sort DESC locally to be safe
      final orders = await _orderService.getMyOrders();
      orders.sort((a, b) => b.id.compareTo(a.id)); 
      state = AsyncValue.data(orders);
    } catch (e, st) {
      state = AsyncValue.error(e, st);
    }
  }
}

final orderProvider = StateNotifierProvider<OrderNotifier, AsyncValue<List<OrderResponse>>>((ref) {
  final service = ref.read(orderServiceProvider);
  return OrderNotifier(service);
});
