import 'package:flutter/material.dart';
import 'package:timelines_plus/timelines_plus.dart';
import '../../config/app_style.dart';

class OrderDetailPage extends StatelessWidget {
  final Map<String, dynamic> orderData;

  const OrderDetailPage({super.key, required this.orderData});

  @override
  Widget build(BuildContext context) {
    bool isCompleted = orderData['status'] == 'Selesai';

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
                    orderData['id'] ?? 'ZLX-987654321',
                  ),
                  _buildDetailRow(
                    'Tanggal Pesanan',
                    orderData['date'] ?? '27 Mar 2026, 14:30',
                  ),
                  _buildDetailRow(
                    'Status',
                    orderData['status'] ?? 'Diproses',
                    valueColor: orderData['statusColor'],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),

            // TIMELINE SECTION

            // PRODUCT CARD
            _buildSectionTitle('Produk'),
            _buildWhiteCard(
              child: Row(
                children: [
                  ClipRRect(
                    borderRadius: BorderRadius.circular(10),
                    child: Image.network(
                      orderData['image'] ?? 'https://picsum.photos/200',
                      width: 70,
                      height: 70,
                      fit: BoxFit.cover,
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          orderData['productName'] ?? 'Premium Item',
                          style: const TextStyle(
                            fontWeight: FontWeight.bold,
                            fontSize: 14,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          '1 Barang x Rp ${orderData['total']}',
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
            const SizedBox(height: 20),

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
                    return DotIndicator(
                      color: index == 0
                          ? AppColors.primary
                          : Colors.grey.shade300,
                    );
                  },
                  connectorBuilder: (context, index, type) {
                    return SolidLineConnector(
                      color: index == 0
                          ? AppColors.primary
                          : Colors.grey.shade300,
                    );
                  },
                  contentsBuilder: (context, index) {
                    final statuses = [
                      {'title': 'Pesanan Selesai', 'time': '28 Mar, 09:00'},
                      {
                        'title': 'Diterima oleh [Nama Penerima]',
                        'time': '28 Mar, 08:45',
                      },
                      {
                        'title': 'Kurir sedang menuju alamat anda',
                        'time': '28 Mar, 07:30',
                      },
                      {
                        'title': 'Pesanan dikirim dari gudang',
                        'time': '27 Mar, 20:00',
                      },
                      {'title': 'Pembayaran Berhasil', 'time': '27 Mar, 14:35'},
                    ];
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
                  _buildDetailRow('Metode Pembayaran', 'Zelixa Pay / E-Wallet'),
                  _buildDetailRow('Total Harga', 'Rp ${orderData['total']}'),
                  _buildDetailRow('Biaya Pengiriman', 'Rp 15.000'),
                  const Divider(height: 24),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text(
                        'Total Bayar',
                        style: TextStyle(fontWeight: FontWeight.bold),
                      ),
                      Text(
                        'Rp ${orderData['total']}',
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
