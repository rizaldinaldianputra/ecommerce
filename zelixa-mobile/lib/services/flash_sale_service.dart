import 'package:dio/dio.dart';
import 'package:zelixa/config/api_url.dart';
import '../models/flash_sale_model.dart';
import 'common_service.dart';

class FlashSaleService extends CommonService {
  Future<List<FlashSale>> getActiveFlashSales() async {
    try {
      final String baseUrlNoV1 = baseUrl.replaceFirst('/v1', '');
      
      final response = await get('$baseUrlNoV1/flash-sales/active');
      if (response.data != null && response.data is List) {
        final List<dynamic> list = response.data;
        return list.map((e) => FlashSale.fromJson(e)).toList();
      }
      return [];
    } catch (e) {
      rethrow;
    }
  }
}
