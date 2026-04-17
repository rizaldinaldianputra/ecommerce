import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../config/app_style.dart';
import '../../riverpod/cart_provider.dart';
import '../../riverpod/checkout_provider.dart';
import '../../riverpod/address_provider.dart';
import '../../riverpod/shipping_provider.dart';
import '../../models/checkout_model.dart';
import '../../models/address_model.dart';
import '../../models/shipping_model.dart';
import 'package:toastification/toastification.dart';

class CheckoutPage extends ConsumerStatefulWidget {
  const CheckoutPage({super.key});

  @override
  ConsumerState<CheckoutPage> createState() => _CheckoutPageState();
}

class _CheckoutPageState extends ConsumerState<CheckoutPage> {
  AddressResponse? selectedAddress;
  ShippingCourierResponse? selectedCourier;
  bool _addressInitialized = false;

  String? appliedVoucher;
  double discount = 0;

  bool _isProcessing = false;

  Future<void> _processCheckout() async {
    if (selectedAddress == null || selectedCourier == null) {
      toastification.show(
        context: context,
        title: const Text('Pilih alamat dan metode pengiriman terlebih dahulu'),
        type: ToastificationType.warning,
        autoCloseDuration: const Duration(seconds: 3),
      );
      return;
    }

    setState(() => _isProcessing = true);
    try {
      final request = CheckoutRequest(
        shippingService: selectedCourier!.name,
        destinationSubdistrictId: selectedAddress!.subdistrictId,
        shippingAmount: selectedCourier!.cost,
        voucherCode: appliedVoucher,
      );

      await ref.read(checkoutProvider.notifier).checkout(request);
      final checkoutState = ref.read(checkoutProvider);

      checkoutState.whenOrNull(
        data: (order) async {
          if (order != null && order.paymentUrl != null) {
            final uri = Uri.parse(order.paymentUrl!);
            if (await canLaunchUrl(uri)) {
              await launchUrl(uri, mode: LaunchMode.externalApplication);
              if (mounted) _showSuccessDialog(context);

              ref.read(cartProvider.notifier).clearCart();
            } else {
              if (mounted) {
                toastification.show(
                  context: context,
                  title: const Text('Gagal membuka halaman pembayaran'),
                  type: ToastificationType.error,
                  autoCloseDuration: const Duration(seconds: 3),
                );
              }
            }
          } else {
            if (mounted) _showSuccessDialog(context);
          }
        },
        error: (err, st) {
          toastification.show(
            context: context,
            title: Text('Checkout Gagal: $err'),
            type: ToastificationType.error,
            autoCloseDuration: const Duration(seconds: 3),
          );
        },
      );
    } finally {
      if (mounted) setState(() => _isProcessing = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final cartState = ref.watch(cartProvider);
    final addressState = ref.watch(addressProvider);
    final shippingState = ref.watch(shippingProvider);

    final subtotal = ref.watch(cartTotalProvider);
    final double shippingCost = selectedCourier?.cost ?? 0.0;
    final double total = subtotal + shippingCost - discount;

    if (!_addressInitialized &&
        addressState is AsyncData &&
        addressState.value!.isNotEmpty) {
      WidgetsBinding.instance.addPostFrameCallback((_) {
        if (mounted) {
          setState(() {
            selectedAddress = addressState.value!.first;
            _addressInitialized = true;
          });
          ref
              .read(shippingProvider.notifier)
              .calculateCost(selectedAddress!.subdistrictId);
        }
      });
    }

    return Scaffold(
      backgroundColor: Colors.grey.shade50,
      appBar: AppBar(
        title: const Text(
          'Checkout',
          style: TextStyle(
            color: Colors.black,
            fontSize: 18,
            fontWeight: FontWeight.bold,
          ),
        ),
        backgroundColor: Colors.white,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.black),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: cartState.when(
        data: (cartItems) {
          if (cartItems.isEmpty) {
            return const Center(child: Text("Keranjang kosong"));
          }

          return SingleChildScrollView(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // ADDRESS SECTION
                _buildSectionTitle('Alamat Pengiriman'),
                if (selectedAddress == null)
                  _buildSelectableCard(
                    icon: Icons.location_on,
                    title: 'Pilih Alamat Pengiriman',
                    subtitle: 'Belum ada alamat yang dipilih',
                    trailing: 'Pilih',
                    onTap: () => _showAddressModal(
                      context,
                      addressState.valueOrNull ?? [],
                    ),
                  )
                else
                  Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(15),
                      border: Border.all(color: Colors.grey.shade200),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            Icon(
                              Icons.location_on,
                              color: AppColors.primary,
                              size: 20,
                            ),
                            const SizedBox(width: 8),
                            Text(
                              selectedAddress!.label,
                              style: const TextStyle(
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            if (selectedAddress!.isDefault)
                              Container(
                                margin: const EdgeInsets.only(left: 8),
                                padding: const EdgeInsets.symmetric(
                                  horizontal: 6,
                                  vertical: 2,
                                ),
                                decoration: BoxDecoration(
                                  color: AppColors.primary.withOpacity(0.1),
                                  borderRadius: BorderRadius.circular(4),
                                ),
                                child: Text(
                                  'Utama',
                                  style: TextStyle(
                                    color: AppColors.primary,
                                    fontSize: 10,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                              ),
                            const Spacer(),
                            GestureDetector(
                              onTap: () => _showAddressModal(
                                context,
                                addressState.valueOrNull ?? [],
                              ),
                              child: Text(
                                'Ubah',
                                style: TextStyle(
                                  color: AppColors.primary,
                                  fontSize: 12,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 8),
                        Text(
                          '${selectedAddress!.recipientName} | ${selectedAddress!.phoneNumber}',
                          style: const TextStyle(fontSize: 13),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          selectedAddress!.addressLine,
                          style: const TextStyle(
                            fontSize: 13,
                            color: Colors.grey,
                          ),
                        ),
                      ],
                    ),
                  ),
                const SizedBox(height: 24),

                // PRODUCT SUMMARY
                _buildSectionTitle('Pesanan Anda'),
                Container(
                  padding: const EdgeInsets.symmetric(vertical: 8),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(15),
                    border: Border.all(color: Colors.grey.shade200),
                  ),
                  child: ListView.separated(
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    itemCount: cartItems.length,
                    separatorBuilder: (context, index) => const Divider(),
                    itemBuilder: (context, index) {
                      final item = cartItems[index];
                      return Padding(
                        padding: const EdgeInsets.all(16),
                        child: Row(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            ClipRRect(
                              borderRadius: BorderRadius.circular(10),
                              child: Image.network(
                                item.imageUrl.isNotEmpty
                                    ? item.imageUrl
                                    : 'https://picsum.photos/200',
                                width: 80,
                                height: 80,
                                fit: BoxFit.cover,
                              ),
                            ),
                            const SizedBox(width: 16),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    item.productName,
                                    style: const TextStyle(
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                  const SizedBox(height: 4),
                                  Text(
                                    'Varian: ${item.size}, ${item.color}',
                                    style: const TextStyle(
                                      fontSize: 12,
                                      color: Colors.grey,
                                    ),
                                  ),
                                  const SizedBox(height: 8),
                                  Row(
                                    mainAxisAlignment:
                                        MainAxisAlignment.spaceBetween,
                                    children: [
                                      Text(
                                        'Rp ${item.price.toInt()}',
                                        style: TextStyle(
                                          color: AppColors.primary,
                                          fontWeight: FontWeight.bold,
                                        ),
                                      ),
                                      Text(
                                        'x${item.quantity}',
                                        style: const TextStyle(
                                          color: Colors.grey,
                                        ),
                                      ),
                                    ],
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                      );
                    },
                  ),
                ),
                const SizedBox(height: 24),

                // SHIPPING METHOD
                _buildSectionTitle('Metode Pengiriman'),
                _buildSelectableCard(
                  icon: Icons.local_shipping_outlined,
                  title: selectedCourier != null
                      ? selectedCourier!.name
                      : 'Pilih Kurir Pengiriman',
                  subtitle: selectedCourier != null
                      ? 'Estimasi tiba ${selectedCourier!.etd} hari'
                      : (selectedAddress == null
                            ? 'Pilih alamat terlebih dahulu'
                            : 'Pilih kurir'),
                  trailing: selectedCourier != null
                      ? 'Rp ${shippingCost.toInt()}'
                      : 'Pilih',
                  onTap: () {
                    if (selectedAddress == null) {
                      toastification.show(
                        context: context,
                        title: const Text(
                          'Silakan pilih alamat terlebih dahulu',
                        ),
                        type: ToastificationType.warning,
                        autoCloseDuration: const Duration(seconds: 3),
                      );
                      return;
                    }
                    _showCourierModal(context, shippingState);
                  },
                ),
                const SizedBox(height: 24),

                // VOUCHER SECTION
                _buildSectionTitle('Voucher Zelixa'),
                _buildSelectableCard(
                  icon: Icons.confirmation_number_outlined,
                  title: appliedVoucher ?? 'Pilih atau masukkan kode',
                  subtitle: appliedVoucher != null
                      ? 'Promo berhasil dipasang'
                      : 'Hemat lebih banyak dengan voucher',
                  trailing: 'Lihat',
                  onTap: () {
                    // Mock voucher apply
                    setState(() {
                      appliedVoucher = 'ZELIXAFEST2026';
                      discount = 25000;
                    });
                  },
                ),
                const SizedBox(height: 24),

                // PAYMENT METHOD
                _buildSectionTitle('Metode Pembayaran'),
                _buildSelectableCard(
                  icon: Icons.account_balance_wallet_outlined,
                  title: 'Midtrans Online Payment',
                  subtitle: 'Bank Transfer, e-Wallet, dll',
                  trailing: 'Ganti',
                  onTap: () {},
                ),
                const SizedBox(height: 24),

                // ORDER SUMMARY
                _buildSectionTitle('Ringkasan Pembayaran'),
                Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(15),
                    border: Border.all(color: Colors.grey.shade200),
                  ),
                  child: Column(
                    children: [
                      _buildSummaryRow(
                        'Subtotal untuk Produk',
                        'Rp ${subtotal.toInt()}',
                      ),
                      _buildSummaryRow(
                        'Subtotal Pengiriman',
                        'Rp ${shippingCost.toInt()}',
                      ),
                      if (discount > 0)
                        _buildSummaryRow(
                          'Diskon Voucher',
                          '- Rp ${discount.toInt()}',
                          isDiscount: true,
                        ),
                      const Divider(height: 24),
                      _buildSummaryRow(
                        'Total Pembayaran',
                        'Rp ${total.toInt()}',
                        isTotal: true,
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 100), // Space for bottom bar
              ],
            ),
          );
        },
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (err, _) => Center(child: Text("Error: $err")),
      ),
      bottomSheet: cartState.hasValue && cartState.value!.isNotEmpty
          ? Container(
              padding: const EdgeInsets.fromLTRB(20, 16, 20, 34),
              decoration: BoxDecoration(
                color: Colors.white,
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.05),
                    blurRadius: 10,
                    offset: const Offset(0, -5),
                  ),
                ],
              ),
              child: Row(
                children: [
                  Column(
                    mainAxisSize: MainAxisSize.min,
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Total Pembayaran',
                        style: TextStyle(fontSize: 12, color: Colors.grey),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        'Rp ${total.toInt()}',
                        style: TextStyle(
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                          color: AppColors.primary,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(width: 24),
                  Expanded(
                    child: ElevatedButton(
                      onPressed: _isProcessing ? null : _processCheckout,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppColors.primary,
                        padding: const EdgeInsets.symmetric(vertical: 16),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(15),
                        ),
                        elevation: 0,
                      ),
                      child: _isProcessing
                          ? const SizedBox(
                              width: 20,
                              height: 20,
                              child: CircularProgressIndicator(
                                color: Colors.white,
                                strokeWidth: 2,
                              ),
                            )
                          : const Text(
                              'Buat Pesanan',
                              style: TextStyle(
                                color: Colors.white,
                                fontWeight: FontWeight.bold,
                                fontSize: 16,
                              ),
                            ),
                    ),
                  ),
                ],
              ),
            )
          : const SizedBox.shrink(),
    );
  }

  Widget _buildSectionTitle(String title) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Text(
        title,
        style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15),
      ),
    );
  }

  Widget _buildSelectableCard({
    required IconData icon,
    required String title,
    required String subtitle,
    required String trailing,
    required VoidCallback onTap,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(15),
          border: Border.all(color: Colors.grey.shade200),
        ),
        child: Row(
          children: [
            Icon(icon, color: Colors.grey.shade600, size: 22),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: const TextStyle(
                      fontWeight: FontWeight.w600,
                      fontSize: 13,
                    ),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    subtitle,
                    style: const TextStyle(color: Colors.grey, fontSize: 12),
                  ),
                ],
              ),
            ),
            Text(
              trailing,
              style: TextStyle(
                color: AppColors.primary,
                fontSize: 13,
                fontWeight: FontWeight.bold,
              ),
            ),
            const Icon(Icons.chevron_right, color: Colors.grey, size: 20),
          ],
        ),
      ),
    );
  }

  Widget _buildSummaryRow(
    String label,
    String value, {
    bool isDiscount = false,
    bool isTotal = false,
  }) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            label,
            style: TextStyle(
              color: isTotal ? Colors.black : Colors.grey.shade700,
              fontWeight: isTotal ? FontWeight.bold : FontWeight.normal,
              fontSize: isTotal ? 15 : 13,
            ),
          ),
          Text(
            value,
            style: TextStyle(
              color: isDiscount
                  ? Colors.red
                  : (isTotal ? AppColors.primary : Colors.black),
              fontWeight: isTotal ? FontWeight.bold : FontWeight.w600,
              fontSize: isTotal ? 18 : 13,
            ),
          ),
        ],
      ),
    );
  }

  void _showSuccessDialog(BuildContext context) {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Icon(Icons.check_circle, color: Colors.green, size: 80),
            const SizedBox(height: 24),
            const Text(
              'Pesanan Berhasil!',
              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 22),
            ),
            const SizedBox(height: 8),
            const Text(
              'Selesaikan pembayaran di halaman Midtrans yang muncul.',
              textAlign: TextAlign.center,
              style: TextStyle(color: Colors.grey),
            ),
            const SizedBox(height: 32),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: () {
                  Navigator.of(context).popUntil((route) => route.isFirst);
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.primary,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                  padding: const EdgeInsets.symmetric(vertical: 14),
                ),
                child: const Text(
                  'Selesai',
                  style: TextStyle(
                    color: Colors.white,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  void _showAddressModal(
    BuildContext context,
    List<AddressResponse> addresses,
  ) {
    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      isScrollControlled: true,
      builder: (context) {
        return Container(
          padding: const EdgeInsets.all(16),
          constraints: BoxConstraints(
            maxHeight: MediaQuery.of(context).size.height * 0.7,
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Center(
                child: Container(
                  width: 40,
                  height: 4,
                  decoration: BoxDecoration(
                    color: Colors.grey,
                    borderRadius: BorderRadius.all(Radius.circular(2)),
                  ),
                ),
              ),
              const SizedBox(height: 16),
              const Text(
                'Pilih Alamat Pengiriman',
                style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 16),
              if (addresses.isEmpty)
                const Padding(
                  padding: EdgeInsets.all(16.0),
                  child: Center(child: Text('Belum ada alamat')),
                )
              else
                Expanded(
                  child: ListView.separated(
                    shrinkWrap: true,
                    itemCount: addresses.length,
                    separatorBuilder: (_, __) => const Divider(),
                    itemBuilder: (context, index) {
                      final addr = addresses[index];
                      final isSelected = selectedAddress?.id == addr.id;
                      return ListTile(
                        onTap: () {
                          setState(() {
                            selectedAddress = addr;
                            selectedCourier =
                                null; // Reset courier when address changes
                          });
                          ref
                              .read(shippingProvider.notifier)
                              .calculateCost(addr.subdistrictId);
                          Navigator.pop(context);
                        },
                        title: Row(
                          children: [
                            Text(
                              addr.label,
                              style: const TextStyle(
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            if (addr.isDefault)
                              Container(
                                margin: const EdgeInsets.only(left: 8),
                                padding: const EdgeInsets.symmetric(
                                  horizontal: 6,
                                  vertical: 2,
                                ),
                                decoration: BoxDecoration(
                                  color: AppColors.primary.withOpacity(0.1),
                                  borderRadius: BorderRadius.circular(4),
                                ),
                                child: Text(
                                  'Utama',
                                  style: TextStyle(
                                    color: AppColors.primary,
                                    fontSize: 10,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                              ),
                          ],
                        ),
                        subtitle: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const SizedBox(height: 4),
                            Text('${addr.recipientName} | ${addr.phoneNumber}'),
                            Text(
                              addr.addressLine,
                              style: const TextStyle(
                                fontSize: 12,
                                color: Colors.grey,
                              ),
                            ),
                          ],
                        ),
                        trailing: isSelected
                            ? Icon(Icons.check_circle, color: AppColors.primary)
                            : null,
                      );
                    },
                  ),
                ),
            ],
          ),
        );
      },
    );
  }

  void _showCourierModal(
    BuildContext context,
    AsyncValue<List<ShippingCourierResponse>> shippingState,
  ) {
    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      isScrollControlled: true,
      builder: (context) {
        return Container(
          padding: const EdgeInsets.all(16),
          constraints: BoxConstraints(
            maxHeight: MediaQuery.of(context).size.height * 0.7,
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Center(
                child: Container(
                  width: 40,
                  height: 4,
                  decoration: BoxDecoration(
                    color: Colors.grey,
                    borderRadius: BorderRadius.circular(2),
                  ),
                ),
              ),
              const SizedBox(height: 16),
              const Text(
                'Pilih Kurir Pengiriman',
                style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 16),
              shippingState.when(
                data: (couriers) {
                  if (couriers.isEmpty) {
                    return const Padding(
                      padding: EdgeInsets.all(16),
                      child: Center(
                        child: Text('Kurir tidak tersedia untuk area ini'),
                      ),
                    );
                  }
                  return Expanded(
                    child: ListView.separated(
                      shrinkWrap: true,
                      itemCount: couriers.length,
                      separatorBuilder: (_, __) => const Divider(),
                      itemBuilder: (context, index) {
                        final courier = couriers[index];
                        final isSelected =
                            selectedCourier?.code == courier.code &&
                            selectedCourier?.service == courier.service;
                        return ListTile(
                          onTap: () {
                            setState(() {
                              selectedCourier = courier;
                            });
                            Navigator.pop(context);
                          },
                          leading: Icon(
                            Icons.local_shipping,
                            color: isSelected ? AppColors.primary : Colors.grey,
                          ),
                          title: Text(
                            courier.name,
                            style: const TextStyle(fontWeight: FontWeight.bold),
                          ),
                          subtitle: Text(
                            'Estimasi ${courier.etd} hari\n${courier.description}',
                            style: const TextStyle(fontSize: 12),
                          ),
                          trailing: Text(
                            'Rp ${courier.cost.toInt()}',
                            style: TextStyle(
                              color: AppColors.primary,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        );
                      },
                    ),
                  );
                },
                loading: () => const Center(
                  child: Padding(
                    padding: EdgeInsets.all(32),
                    child: CircularProgressIndicator(),
                  ),
                ),
                error: (err, _) => Center(child: Text('Error: $err')),
              ),
            ],
          ),
        );
      },
    );
  }
}
