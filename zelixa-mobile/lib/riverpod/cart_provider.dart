import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/cart_model.dart';
import '../services/cart_service.dart';

final cartServiceProvider = Provider<CartService>((ref) {
  return CartService();
});

class CartNotifier extends StateNotifier<AsyncValue<List<CartItemResponse>>> {
  final CartService _cartService;

  CartNotifier(this._cartService) : super(const AsyncValue.loading()) {
    fetchCart();
  }

  Future<void> fetchCart() async {
    state = const AsyncValue.loading();
    try {
      final items = await _cartService.getCart();
      state = AsyncValue.data(items);
    } catch (e, st) {
      state = AsyncValue.error(e, st);
    }
  }

  Future<void> addToCart(int productVariantId, int quantity) async {
    try {
      await _cartService.addToCart(CartItemRequest(
        productVariantId: productVariantId,
        quantity: quantity,
      ));
      await fetchCart();
    } catch (e) {
      rethrow;
    }
  }

  Future<void> updateQuantity(int itemId, int newQuantity) async {
    try {
      await _cartService.updateQuantity(itemId, newQuantity);
      await fetchCart();
    } catch (e) {
      rethrow;
    }
  }

  Future<void> removeFromCart(int itemId) async {
    try {
      await _cartService.removeFromCart(itemId);
      await fetchCart();
    } catch (e) {
      rethrow;
    }
  }

  Future<void> clearCart() async {
    try {
      await _cartService.clearCart();
      await fetchCart();
    } catch (e) {
      rethrow;
    }
  }
}

final cartProvider = StateNotifierProvider<CartNotifier, AsyncValue<List<CartItemResponse>>>((ref) {
  final cartService = ref.read(cartServiceProvider);
  return CartNotifier(cartService);
});

// Selector for total price
final cartTotalProvider = Provider<double>((ref) {
  final cartState = ref.watch(cartProvider);
  return cartState.when(
    data: (items) => items.fold(0, (sum, item) => sum + (item.price * item.quantity)),
    loading: () => 0.0,
    error: (_, __) => 0.0,
  );
});
