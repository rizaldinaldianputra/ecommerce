import 'package:flutter/material.dart';
import '../../config/app_style.dart';

class CheckoutPage extends StatefulWidget {
  final Map<String, dynamic> checkoutData;

  const CheckoutPage({super.key, required this.checkoutData});

  @override
  State<CheckoutPage> createState() => _CheckoutPageState();
}

class _CheckoutPageState extends State<CheckoutPage> {
  String selectedShipping = 'JNE Reguler';
  double shippingCost = 15000;
  String? appliedVoucher;
  double discount = 0;

  @override
  Widget build(BuildContext context) {
    final double productPrice = widget.checkoutData['price'] ?? 0;
    final int quantity = widget.checkoutData['quantity'] ?? 1;
    final double subtotal = productPrice * quantity;
    final double total = subtotal + shippingCost - discount;

    return Scaffold(
      backgroundColor: Colors.grey.shade50,
      appBar: AppBar(
        title: const Text('Checkout', style: TextStyle(color: Colors.black, fontSize: 18, fontWeight: FontWeight.bold)),
        backgroundColor: Colors.white,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.black),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // ADDRESS SECTION
            _buildSectionTitle('Alamat Pengiriman'),
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
                      Icon(Icons.location_on, color: AppColors.primary, size: 20),
                      const SizedBox(width: 8),
                      const Text('Rumah Utama', style: TextStyle(fontWeight: FontWeight.bold)),
                      const Spacer(),
                      Text('Ubah', style: TextStyle(color: AppColors.primary, fontSize: 12, fontWeight: FontWeight.bold)),
                    ],
                  ),
                  const SizedBox(height: 8),
                  const Text('Rizal Dinaldian | (+62) 812-3456-7890', style: TextStyle(fontSize: 13)),
                  const SizedBox(height: 4),
                  const Text('Jl. Merdeka No. 123, Central Jakarta, DKI Jakarta, 10110', style: TextStyle(fontSize: 13, color: Colors.grey)),
                ],
              ),
            ),
            const SizedBox(height: 24),

            // PRODUCT SUMMARY
            _buildSectionTitle('Pesanan Anda'),
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(15),
                border: Border.all(color: Colors.grey.shade200),
              ),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  ClipRRect(
                    borderRadius: BorderRadius.circular(10),
                    child: Image.network(
                      widget.checkoutData['image'] ?? 'https://picsum.photos/200',
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
                        Text(widget.checkoutData['title'] ?? 'Product Name', style: const TextStyle(fontWeight: FontWeight.bold)),
                        const SizedBox(height: 4),
                        Text('Varian: ${widget.checkoutData['size'] ?? 'M'}, ${widget.checkoutData['color'] ?? 'Default'}', style: const TextStyle(fontSize: 12, color: Colors.grey)),
                        const SizedBox(height: 8),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text('Rp ${productPrice.toInt()}', style: TextStyle(color: AppColors.primary, fontWeight: FontWeight.bold)),
                            Text('x$quantity', style: const TextStyle(color: Colors.grey)),
                          ],
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),

            // SHIPPING METHOD
            _buildSectionTitle('Metode Pengiriman'),
            _buildSelectableCard(
              icon: Icons.local_shipping_outlined,
              title: selectedShipping,
              subtitle: 'Estimasi tiba 28 - 30 Mar',
              trailing: 'Rp ${shippingCost.toInt()}',
              onTap: () {
                // TODO: Open modal for courier selection
              },
            ),
            const SizedBox(height: 24),

            // VOUCHER SECTION
            _buildSectionTitle('Voucher Zelixa'),
            _buildSelectableCard(
              icon: Icons.confirmation_number_outlined,
              title: appliedVoucher ?? 'Pilih atau masukkan kode',
              subtitle: appliedVoucher != null ? 'Promo berhasil dipasang' : 'Hemat lebih banyak dengan voucher',
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
              title: 'ZelixaPay / OVO',
              subtitle: 'Saldo: Rp 2.500.000',
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
                  _buildSummaryRow('Subtotal untuk Produk', 'Rp ${subtotal.toInt()}'),
                  _buildSummaryRow('Subtotal Pengiriman', 'Rp ${shippingCost.toInt()}'),
                  if (discount > 0) _buildSummaryRow('Diskon Voucher', '- Rp ${discount.toInt()}', isDiscount: true),
                  const Divider(height: 24),
                  _buildSummaryRow('Total Pembayaran', 'Rp ${total.toInt()}', isTotal: true),
                ],
              ),
            ),
            const SizedBox(height: 100), // Space for bottom bar
          ],
        ),
      ),
      bottomSheet: Container(
        padding: const EdgeInsets.fromLTRB(20, 16, 20, 34),
        decoration: BoxDecoration(
          color: Colors.white,
          boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 10, offset: const Offset(0, -5))],
        ),
        child: Row(
          children: [
            Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text('Total Pembayaran', style: TextStyle(fontSize: 12, color: Colors.grey)),
                const SizedBox(height: 4),
                Text('Rp ${total.toInt()}', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: AppColors.primary)),
              ],
            ),
            const SizedBox(width: 24),
            Expanded(
              child: ElevatedButton(
                onPressed: () => _showSuccessDialog(context),
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.primary,
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(15)),
                  elevation: 0,
                ),
                child: const Text('Buat Pesanan', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16)),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSectionTitle(String title) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Text(title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15)),
    );
  }

  Widget _buildSelectableCard({required IconData icon, required String title, required String subtitle, required String trailing, required VoidCallback onTap}) {
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
                  Text(title, style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 13)),
                  const SizedBox(height: 2),
                  Text(subtitle, style: const TextStyle(color: Colors.grey, fontSize: 12)),
                ],
              ),
            ),
            Text(trailing, style: TextStyle(color: AppColors.primary, fontSize: 13, fontWeight: FontWeight.bold)),
            const Icon(Icons.chevron_right, color: Colors.grey, size: 20),
          ],
        ),
      ),
    );
  }

  Widget _buildSummaryRow(String label, String value, {bool isDiscount = false, bool isTotal = false}) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: TextStyle(color: isTotal ? Colors.black : Colors.grey.shade700, fontWeight: isTotal ? FontWeight.bold : FontWeight.normal, fontSize: isTotal ? 15 : 13)),
          Text(value, style: TextStyle(color: isDiscount ? Colors.red : (isTotal ? AppColors.primary : Colors.black), fontWeight: isTotal ? FontWeight.bold : FontWeight.w600, fontSize: isTotal ? 18 : 13)),
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
            const Text('Pesanan Berhasil!', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 22)),
            const SizedBox(height: 8),
            const Text('Terima kasih telah berbelanja di Zelixa. Pesanan Anda sedang diproses.', textAlign: TextAlign.center, style: TextStyle(color: Colors.grey)),
            const SizedBox(height: 32),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: () {
                   Navigator.of(context).popUntil((route) => route.isFirst);
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.primary,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  padding: const EdgeInsets.symmetric(vertical: 14),
                ),
                child: const Text('Kembali ke Beranda', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
