import 'package:dio/dio.dart';
import '../models/shipping_model.dart';
import 'common_service.dart';

class ShippingService extends CommonService {
  Future<List<ShippingCourierResponse>> calculateCost({
    required String origin,
    required String destination,
    required int weight,
    required String courier,
  }) async {
    try {
      final response = await post('/shipping/cost', data: {
        'origin': origin,
        'destination': destination,
        'weight': weight,
        'courier': courier,
      });

      if (response.data != null && response.data['data'] != null) {
        final List<dynamic> list = response.data['data'];
        return list.map((e) => ShippingCourierResponse.fromJson(e)).toList();
      }
      return [];
    } catch (e) {
      rethrow;
    }
  }
}
