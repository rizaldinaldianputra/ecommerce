import 'package:dio/dio.dart';
import '../models/cart_model.dart';
import 'common_service.dart';

class CartService extends CommonService {
  Future<List<CartItemResponse>> getCart() async {
    try {
      final response = await get('/cart');
      if (response.data != null && response.data['data'] != null) {
        final List<dynamic> list = response.data['data'];
        return list.map((e) => CartItemResponse.fromJson(e)).toList();
      }
      return [];
    } catch (e) {
      rethrow;
    }
  }

  Future<CartItemResponse> addToCart(CartItemRequest request) async {
    try {
      final response = await post('/cart', data: request.toJson());
      if (response.data != null && response.data['data'] != null) {
        return CartItemResponse.fromJson(response.data['data']);
      }
      throw Exception('Failed to add to cart: Invalid response');
    } catch (e) {
      rethrow;
    }
  }

  Future<CartItemResponse> updateQuantity(int itemId, int quantity) async {
    try {
      final response = await put('/cart/$itemId?quantity=$quantity');
      if (response.data != null && response.data['data'] != null) {
        return CartItemResponse.fromJson(response.data['data']);
      }
      throw Exception('Failed to update quantity: Invalid response');
    } catch (e) {
      rethrow;
    }
  }

  Future<void> removeFromCart(int itemId) async {
    try {
      await delete('/cart/$itemId');
    } catch (e) {
      rethrow;
    }
  }

  Future<void> clearCart() async {
    try {
      await delete('/cart/clear');
    } catch (e) {
      rethrow;
    }
  }
}
