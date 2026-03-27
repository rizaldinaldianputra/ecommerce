import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../config/app_style.dart';

class AddressListPage extends StatelessWidget {
  const AddressListPage({super.key});

  @override
  Widget build(BuildContext context) {
    final List<Map<String, dynamic>> addresses = [
      {
        'id': '1',
        'label': 'Rumah',
        'recipient': 'Zelixa User',
        'phone': '081234567890',
        'address': 'Jl. Merdeka No. 123, Central Jakarta',
        'isDefault': true,
      },
      {
        'id': '2',
        'label': 'Kantor',
        'recipient': 'Zelixa User',
        'phone': '081234567891',
        'address': 'Gedung Wisma Asri, Lt. 5, Office 502, South Jakarta',
        'isDefault': false,
      },
    ];

    return Scaffold(
      backgroundColor: Colors.grey.shade50,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        centerTitle: true,
        title: const Text(
          'Daftar Alamat',
          style: TextStyle(color: Colors.black, fontWeight: FontWeight.bold, fontSize: 18),
        ),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.black),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: addresses.length,
        itemBuilder: (context, index) {
          final address = addresses[index];
          return Container(
            margin: const EdgeInsets.only(bottom: 16),
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(15),
              border: Border.all(
                color: address['isDefault'] ? AppColors.primary : Colors.grey.shade200,
                width: address['isDefault'] ? 2 : 1,
              ),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Row(
                      children: [
                        Text(
                          address['label'],
                          style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
                        ),
                        if (address['isDefault']) ...[
                          const SizedBox(width: 8),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                            decoration: BoxDecoration(
                              color: AppColors.primary.withOpacity(0.1),
                              borderRadius: BorderRadius.circular(4),
                            ),
                            child: Text(
                              'Utama',
                              style: TextStyle(color: AppColors.primary, fontWeight: FontWeight.bold, fontSize: 10),
                            ),
                          ),
                        ],
                      ],
                    ),
                    IconButton(
                      icon: const Icon(Icons.edit_outlined, size: 20, color: Colors.grey),
                      onPressed: () => context.push('/address-form', extra: address),
                    ),
                  ],
                ),
                Text(
                  address['recipient'],
                  style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 15),
                ),
                const SizedBox(height: 4),
                Text(address['phone'], style: const TextStyle(color: Colors.grey, fontSize: 13)),
                const SizedBox(height: 8),
                Text(
                  address['address'],
                  style: const TextStyle(color: Colors.black87, fontSize: 13, height: 1.4),
                ),
              ],
            ),
          );
        },
      ),
      bottomNavigationBar: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Colors.white,
          border: Border(top: BorderSide(color: Colors.grey.shade200)),
        ),
        child: ElevatedButton(
          onPressed: () => context.push('/address-form'),
          style: ElevatedButton.styleFrom(
            backgroundColor: AppColors.primary,
            minimumSize: const Size(double.infinity, 50),
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
          ),
          child: const Text(
            'Tambah Alamat Baru',
            style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
          ),
        ),
      ),
    );
  }
}
