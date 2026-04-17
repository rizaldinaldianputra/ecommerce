import 'package:dio/dio.dart';
import '../models/checkout_model.dart';
import 'common_service.dart';

class OrderService extends CommonService {
  Future<OrderResponse> checkout(CheckoutRequest request) async {
    try {
      final response = await post('/checkout', data: request.toJson());
      if (response.data != null && response.data['data'] != null) {
        return OrderResponse.fromJson(response.data['data']);
      }
      throw Exception('Checkout failed: Invalid response');
    } catch (e) {
      rethrow;
    }
  }
}
