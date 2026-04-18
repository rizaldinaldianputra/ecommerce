import 'package:flutter/material.dart';
import 'package:timelines_plus/timelines_plus.dart';
import '../../config/app_style.dart';
import '../../models/checkout_model.dart';
import 'package:intl/intl.dart';

class OrderDetailPage extends StatelessWidget {
  final OrderResponse orderData;

  const OrderDetailPage({super.key, required this.orderData});

  Color _getStatusColor(String status) {
    if (status.toUpperCase() == 'SELESAI') return Colors.green;
    if (status.toUpperCase() == 'DIBATALKAN') return Colors.red;
    if (status.toUpperCase() == 'DIKIRIM') return Colors.blue;
    return AppColors.primary;
  }

  @override
  Widget build(BuildContext context) {
    bool isCompleted = orderData.status.toUpperCase() == 'SELESAI';
    bool isCancelled = orderData.status.toUpperCase() == 'DIBATALKAN';

    String dateStr = orderData.createdAt ?? '';
    try {
      if (dateStr.isNotEmpty) {
        DateTime dt = DateTime.parse(dateStr);
        dateStr = DateFormat('dd MMM yyyy, HH:mm').format(dt);
      }
    } catch (e) {
      // ignore
    }

    return Scaffold(
      backgroundColor: Colors.grey.shade50,
      appBar: AppBar(
        title: const Text(
          'Detail Pesanan',
          style: TextStyle(
            color: Colors.black,
            fontWeight: FontWeight.bold,
            fontSize: 18,
          ),
        ),
        backgroundColor: Colors.white,
        elevation: 0,
        centerTitle: true,
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
            // ORDER INFO CARD
            _buildWhiteCard(
              child: Column(
                children: [
                   _buildDetailRow(
                    'No. Pesanan',
                    orderData.orderNumber,
                  ),
                  _buildDetailRow(
                    'Tanggal Pesanan',
                    dateStr,
                  ),
                  _buildDetailRow(
                    'Status',
                    orderData.status.toUpperCase(),
                    valueColor: _getStatusColor(orderData.status),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),

            _buildSectionTitle('Produk'),
            ...orderData.items.map((item) => Padding(
                  padding: const EdgeInsets.only(bottom: 12),
                  child: _buildWhiteCard(
                    child: Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        ClipRRect(
                          borderRadius: BorderRadius.circular(10),
                          child: Image.network(
                            item.imageUrl,
                            width: 70,
                            height: 70,
                            fit: BoxFit.cover,
                            errorBuilder: (_, __, ___) => Container(width: 70, height: 70, color: Colors.grey.shade200),
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
                                  fontSize: 14,
                                ),
                              ),
                              const SizedBox(height: 4),
                              Text(
                                'Varian: ${item.size}, ${item.color}',
                                style: const TextStyle(
                                  color: Colors.grey,
                                  fontSize: 12,
                                ),
                              ),
                              const SizedBox(height: 4),
                              Text(
                                '${item.quantity} Barang x Rp ${item.price.toInt()}',
                                style: const TextStyle(
                                  color: Colors.grey,
                                  fontSize: 12,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                )),
             
            const SizedBox(height: 8),

            _buildSectionTitle('Lacak Pengiriman'),
            _buildWhiteCard(
              child: FixedTimeline.tileBuilder(
                theme: TimelineThemeData(
                  nodePosition: 0,
                  indicatorTheme: const IndicatorThemeData(size: 15.0),
                  connectorTheme: const ConnectorThemeData(thickness: 2.0),
                ),
                builder: TimelineTileBuilder.connected(
                  indicatorBuilder: (context, index) {
                    final statusIdx = _getStatusIndex(orderData.status);
                    final isReached = (4 - index) <= statusIdx; 
                    return DotIndicator(
                      color: isReached
                          ? (isCancelled ? Colors.red : AppColors.primary)
                          : Colors.grey.shade300,
                    );
                  },
                  connectorBuilder: (context, index, type) {
                    final statusIdx = _getStatusIndex(orderData.status);
                    final isReached = (4 - index) <= statusIdx; 
                    return SolidLineConnector(
                      color: isReached
                          ? (isCancelled ? Colors.red : AppColors.primary)
                          : Colors.grey.shade300,
                    );
                  },
                  contentsBuilder: (context, index) {
                    final statuses = _generateTimelines(orderData);
                    return Padding(
                      padding: const EdgeInsets.only(left: 16.0, bottom: 20),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            statuses[index]['title']!,
                            style: TextStyle(
                              fontWeight: index == 0
                                  ? FontWeight.bold
                                  : FontWeight.normal,
                              fontSize: 13,
                              color: index == 0 ? Colors.black : Colors.grey,
                            ),
                          ),
                          Text(
                            statuses[index]['time']!,
                            style: const TextStyle(
                              color: Colors.grey,
                              fontSize: 11,
                            ),
                          ),
                        ],
                      ),
                    );
                  },
                  itemCount: 5,
                ),
              ),
            ),
            const SizedBox(height: 20),
            _buildSectionTitle('Info Pembayaran'),
            _buildWhiteCard(
              child: Column(
                children: [
                  _buildDetailRow('Metode Pembayaran', 'Midtrans'),
                  _buildDetailRow('Total Harga', 'Rp ${(orderData.totalAmount - orderData.shippingAmount).toInt()}'),
                  _buildDetailRow('Biaya Pengiriman', 'Rp ${orderData.shippingAmount.toInt()}'),
                  const Divider(height: 24),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text(
                        'Total Bayar',
                        style: TextStyle(fontWeight: FontWeight.bold),
                      ),
                      Text(
                        'Rp ${orderData.totalAmount.toInt()}',
                        style: TextStyle(
                          color: AppColors.primary,
                          fontWeight: FontWeight.bold,
                          fontSize: 16,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),

            // RATING SECTION (If Completed)
            if (isCompleted) ...[
              _buildSectionTitle('Beri Penilaian'),
              _buildWhiteCard(
                child: Column(
                  children: [
                    const Text(
                      'Bagaimana kualitas produk ini?',
                      style: TextStyle(fontSize: 13, color: Colors.grey),
                    ),
                    const SizedBox(height: 12),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: List.generate(
                        5,
                        (index) => const Icon(
                          Icons.star_border,
                          color: Colors.amber,
                          size: 30,
                        ),
                      ),
                    ),
                    const SizedBox(height: 16),
                    TextField(
                      decoration: InputDecoration(
                        hintText: 'Tulis ulasan anda...',
                        hintStyle: const TextStyle(fontSize: 13),
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(10),
                          borderSide: BorderSide(color: Colors.grey.shade200),
                        ),
                      ),
                      maxLines: 3,
                    ),
                    const SizedBox(height: 16),
                    SizedBox(
                      width: double.infinity,
                      child: ElevatedButton(
                        onPressed: () {},
                        style: ElevatedButton.styleFrom(
                          backgroundColor: AppColors.primary,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(10),
                          ),
                          padding: const EdgeInsets.symmetric(vertical: 12),
                        ),
                        child: const Text(
                          'Kirim Ulasan',
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
            ],
            const SizedBox(height: 40),
          ],
        ),
      ),
    );
  }

  int _getStatusIndex(String status) {
    if (status.toUpperCase() == 'SELESAI' || status.toUpperCase() == 'DIBATALKAN') return 4;
    if (status.toUpperCase() == 'DIKIRIM') return 3;
    if (status.toUpperCase() == 'DIKEMAS') return 2;
    if (status.toUpperCase() == 'DIBAYAR') return 1;
    return 0; // PENDING
  }

  List<Map<String, String>> _generateTimelines(OrderResponse order) {
    bool isCancelled = order.status.toUpperCase() == 'DIBATALKAN';
    return [
       {'title': isCancelled ? 'Pesanan Dibatalkan' : 'Pesanan Selesai / Sampai', 'time': ''},
       {'title': 'Kurir sedang menuju alamat anda', 'time': ''},
       {'title': 'Pesanan dikirim dari gudang', 'time': ''},
       {'title': 'Pesanan sedang dikemas', 'time': ''},
       {'title': 'Pesanan Dibuat', 'time': ''},
    ];
  }

  Widget _buildWhiteCard({required Widget child}) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(15),
        border: Border.all(color: Colors.grey.shade200),
      ),
      child: child,
    );
  }

  Widget _buildSectionTitle(String title) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12, left: 4),
      child: Text(
        title,
        style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15),
      ),
    );
  }

  Widget _buildDetailRow(String label, String value, {Color? valueColor}) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: const TextStyle(color: Colors.grey, fontSize: 13)),
          Text(
            value,
            style: TextStyle(
              fontWeight: FontWeight.bold,
              fontSize: 13,
              color: valueColor ?? Colors.black87,
            ),
          ),
        ],
      ),
    );
  }
}
