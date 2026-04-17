import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/address_model.dart';
import '../services/address_service.dart';

final addressServiceProvider = Provider<AddressService>((ref) {
  return AddressService();
});

class AddressNotifier extends StateNotifier<AsyncValue<List<AddressResponse>>> {
  final AddressService _addressService;

  AddressNotifier(this._addressService) : super(const AsyncValue.loading()) {
    fetchAddresses();
  }

  Future<void> fetchAddresses() async {
    state = const AsyncValue.loading();
    try {
      final addresses = await _addressService.getUserAddresses();
      // Sort so default address is first
      addresses.sort((a, b) => b.isDefault ? 1 : 0);
      state = AsyncValue.data(addresses);
    } catch (e, st) {
      state = AsyncValue.error(e, st);
    }
  }
}

final addressProvider = StateNotifierProvider<AddressNotifier, AsyncValue<List<AddressResponse>>>((ref) {
  final addressService = ref.read(addressServiceProvider);
  return AddressNotifier(addressService);
});
