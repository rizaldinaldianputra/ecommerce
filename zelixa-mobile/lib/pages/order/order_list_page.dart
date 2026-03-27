import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../config/app_style.dart';

class OrderListPage extends StatelessWidget {
  const OrderListPage({super.key});

  @override
  Widget build(BuildContext context) {
    // Mock data order
    final List<Map<String, dynamic>> orders = [
      {
        'id': 'ORD-20260327-001',
        'date': '27 Mar 2026',
        'status': 'Dikirim',
        'statusColor': Colors.blue,
        'total': 465000,
        'itemCount': 1,
        'image': 'https://picsum.photos/200/200?random=10',
        'productName': 'Premium Casual Hoodie',
      },
      {
        'id': 'ORD-20260325-092',
        'date': '25 Mar 2026',
        'status': 'Selesai',
        'statusColor': Colors.green,
        'total': 890000,
        'itemCount': 2,
        'image': 'https://picsum.photos/200/200?random=11',
        'productName': 'Slim Fit Denim Jacket',
      },
      {
        'id': 'ORD-20260320-045',
        'date': '20 Mar 2026',
        'status': 'Dibatalkan',
        'statusColor': Colors.red,
        'total': 150000,
        'itemCount': 1,
        'image': 'https://picsum.photos/200/200?random=12',
        'productName': 'White Basic T-Shirt',
      },
    ];

    return Scaffold(
      backgroundColor: Colors.grey.shade50,
      appBar: AppBar(
        title: const Text('Pesanan Saya', style: TextStyle(color: Colors.black, fontWeight: FontWeight.bold, fontSize: 18)),
        backgroundColor: Colors.white,
        elevation: 0,
        centerTitle: true,
      ),
      body: Column(
        children: [
          // SEARCH BAR IN ORDERS
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(15),
                border: Border.all(color: Colors.grey.shade200),
              ),
              child: const TextField(
                decoration: InputDecoration(
                  hintText: 'Cari pesanan anda...',
                  hintStyle: TextStyle(color: Colors.grey, fontSize: 14),
                  border: InputBorder.none,
                  icon: Icon(Icons.search, color: Colors.grey),
                ),
              ),
            ),
          ),

          // Status Tabs (Mock)
          Container(
            height: 50,
            color: Colors.white,
            child: ListView(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(horizontal: 16),
              children: [
                _buildTab('Semua', true),
                _buildTab('Belum Bayar', false),
                _buildTab('Dikemas', false),
                _buildTab('Dikirim', false),
                _buildTab('Selesai', false),
              ],
            ),
          ),
          
          Expanded(
            child: ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: orders.length,
              itemBuilder: (context, index) {
                final order = orders[index];
                return _buildOrderCard(context, order);
              },
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildTab(String label, bool isSelected) {
    return Container(
      margin: const EdgeInsets.only(right: 24),
      alignment: Alignment.center,
      decoration: BoxDecoration(
        border: Border(bottom: BorderSide(color: isSelected ? AppColors.primary : Colors.transparent, width: 2)),
      ),
      child: Text(
        label,
        style: TextStyle(
          color: isSelected ? AppColors.primary : Colors.grey,
          fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
        ),
      ),
    );
  }

  Widget _buildOrderCard(BuildContext context, Map<String, dynamic> order) {
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(15),
        border: Border.all(color: Colors.grey.shade200),
      ),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(
                  children: [
                    const Icon(Icons.shopping_bag_outlined, size: 16, color: Colors.grey),
                    const SizedBox(width: 8),
                    Text('Belanja', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Colors.grey.shade800)),
                    const SizedBox(width: 8),
                    Text(order['date'], style: const TextStyle(color: Colors.grey, fontSize: 12)),
                  ],
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(
                    color: (order['statusColor'] as Color).withOpacity(0.1),
                    borderRadius: BorderRadius.circular(6),
                  ),
                  child: Text(
                    order['status'],
                    style: TextStyle(color: order['statusColor'], fontWeight: FontWeight.bold, fontSize: 11),
                  ),
                ),
              ],
            ),
            const Divider(height: 24),
            Row(
              children: [
                ClipRRect(
                  borderRadius: BorderRadius.circular(8),
                  child: Image.network(order['image'], width: 60, height: 60, fit: BoxFit.cover),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(order['productName'], style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14), maxLines: 1, overflow: TextOverflow.ellipsis),
                      const SizedBox(height: 4),
                      Text('${order['itemCount']} produk', style: const TextStyle(color: Colors.grey, fontSize: 12)),
                    ],
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text('Total Pesanan', style: TextStyle(color: Colors.grey, fontSize: 11)),
                    Text('Rp ${order['total']}', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: Colors.black)),
                  ],
                ),
                Row(
                  children: [
                    OutlinedButton(
                      onPressed: () {},
                      style: OutlinedButton.styleFrom(
                        side: BorderSide(color: Colors.grey.shade300),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                        minimumSize: const Size(0, 0),
                      ),
                      child: const Text('Beli Lagi', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Colors.black87)),
                    ),
                    const SizedBox(width: 8),
                    ElevatedButton(
                      onPressed: () {
                        context.push('/order-detail', extra: order);
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppColors.primary,
                        elevation: 0,
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                        minimumSize: const Size(0, 0),
                      ),
                      child: const Text('Detail', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 11, color: Colors.white)),
                    ),
                  ],
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
