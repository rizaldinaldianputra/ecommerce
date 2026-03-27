import 'package:flutter/material.dart';
import '../../config/app_style.dart';
import 'package:go_router/go_router.dart';

class CartPage extends StatefulWidget {
  const CartPage({super.key});

  @override
  State<CartPage> createState() => _CartPageState();
}

class _CartPageState extends State<CartPage> {
  // Mock data untuk keranjang
  final List<Map<String, dynamic>> cartItems = [
    {
      'id': '1',
      'title': 'Premium Casual Hoodie',
      'brand': 'ZELIXA WEAR',
      'price': 250000.0,
      'image': 'https://picsum.photos/200/200?random=1',
      'quantity': 1,
      'size': 'L',
      'color': 'Black',
    },
    {
      'id': '2',
      'title': 'Slim Fit Denim Jacket',
      'brand': 'ZELIXA DENIM',
      'price': 450000.0,
      'image': 'https://picsum.photos/200/200?random=2',
      'quantity': 1,
      'size': 'M',
      'color': 'Blue',
    },
  ];

  double get subtotal => cartItems.fold(0, (sum, item) => sum + (item['price'] * item['quantity']));

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey.shade50,
      appBar: AppBar(
        title: const Text('Keranjang', style: TextStyle(color: Colors.black, fontWeight: FontWeight.bold, fontSize: 18)),
        backgroundColor: Colors.white,
        elevation: 0,
        centerTitle: true,
      ),
      body: cartItems.isEmpty 
        ? _buildEmptyCart()
        : Column(
            children: [
              Expanded(
                child: ListView.builder(
                  padding: const EdgeInsets.all(16),
                  itemCount: cartItems.length,
                  itemBuilder: (context, index) {
                    final item = cartItems[index];
                    return _buildCartItem(item, index);
                  },
                ),
              ),
              _buildCartFooter(),
            ],
          ),
    );
  }

  Widget _buildCartItem(Map<String, dynamic> item, int index) {
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(15),
        boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.03), blurRadius: 10, offset: const Offset(0, 4))],
      ),
      child: Row(
        children: [
          // Checkbox (Mock)
          Checkbox(value: true, onChanged: (val) {}, activeColor: AppColors.primary),
          
          // Image
          ClipRRect(
            borderRadius: BorderRadius.circular(10),
            child: Image.network(item['image'], width: 70, height: 70, fit: BoxFit.cover),
          ),
          const SizedBox(width: 12),
          
          // Details
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(item['title'], style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14), maxLines: 1, overflow: TextOverflow.ellipsis),
                const SizedBox(height: 4),
                Text('${item['brand']} | ${item['size']}, ${item['color']}', style: const TextStyle(color: Colors.grey, fontSize: 11)),
                const SizedBox(height: 8),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text('Rp ${item['price'].toInt()}', style: TextStyle(color: AppColors.primary, fontWeight: FontWeight.bold)),
                    
                    // Quantity control
                    Container(
                      decoration: BoxDecoration(
                        color: Colors.grey.shade100,
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Row(
                        children: [
                          _buildQtyBtn(Icons.remove, () {
                            if (item['quantity'] > 1) setState(() => item['quantity']--);
                          }),
                          Padding(
                            padding: const EdgeInsets.symmetric(horizontal: 8),
                            child: Text('${item['quantity']}', style: const TextStyle(fontWeight: FontWeight.bold)),
                          ),
                          _buildQtyBtn(Icons.add, () {
                            setState(() => item['quantity']++);
                          }),
                        ],
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
  }

  Widget _buildQtyBtn(IconData icon, VoidCallback onTap) {
    return InkWell(
      onTap: onTap,
      child: Padding(
        padding: const EdgeInsets.all(4),
        child: Icon(icon, size: 16, color: Colors.blueGrey),
      ),
    );
  }

  Widget _buildCartFooter() {
    return Container(
      padding: const EdgeInsets.fromLTRB(20, 16, 20, 34),
      decoration: BoxDecoration(
        color: Colors.white,
        boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 10, offset: const Offset(0, -5))],
      ),
      child: Row(
        children: [
          const Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('Total Harga', style: TextStyle(fontSize: 12, color: Colors.grey)),
              const SizedBox(height: 4),
              Text('Rp 700.000', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            ],
          ),
          const Spacer(),
          SizedBox(
            width: 160,
            child: ElevatedButton(
              onPressed: () {
                // Navigate to Checkout with first item as mock
                context.push('/checkout', extra: {
                  'title': cartItems[0]['title'],
                  'price': cartItems[0]['price'],
                  'image': cartItems[0]['image'],
                  'quantity': cartItems[0]['quantity'],
                  'size': cartItems[0]['size'],
                  'color': cartItems[0]['color'],
                  'brand': cartItems[0]['brand'],
                });
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.primary,
                padding: const EdgeInsets.symmetric(vertical: 14),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              ),
              child: const Text('Checkout', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildEmptyCart() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(Icons.shopping_cart_outlined, size: 100, color: Colors.grey.shade300),
          const SizedBox(height: 16),
          const Text('Wah, keranjangmu masih kosong!', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
          const SizedBox(height: 8),
          const Text('Yuk, mulai belanja dan pilih produk impianmu!', style: TextStyle(color: Colors.grey)),
        ],
      ),
    );
  }
}
