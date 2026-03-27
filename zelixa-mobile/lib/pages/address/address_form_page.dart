import 'package:flutter/material.dart';
import '../../config/app_style.dart';

class AddressFormPage extends StatefulWidget {
  final Map<String, dynamic>? addressData;

  const AddressFormPage({super.key, this.addressData});

  @override
  State<AddressFormPage> createState() => _AddressFormPageState();
}

class _AddressFormPageState extends State<AddressFormPage> {
  late TextEditingController _labelController;
  late TextEditingController _nameController;
  late TextEditingController _phoneController;
  late TextEditingController _addressController;
  late TextEditingController _cityController;
  late TextEditingController _postalController;
  bool _isDefault = false;

  @override
  void initState() {
    super.initState();
    _labelController = TextEditingController(text: widget.addressData?['label'] ?? '');
    _nameController = TextEditingController(text: widget.addressData?['recipient'] ?? '');
    _phoneController = TextEditingController(text: widget.addressData?['phone'] ?? '');
    _addressController = TextEditingController(text: widget.addressData?['address'] ?? '');
    _cityController = TextEditingController(text: '');
    _postalController = TextEditingController(text: '');
    _isDefault = widget.addressData?['isDefault'] ?? false;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        centerTitle: true,
        title: Text(
          widget.addressData == null ? 'Tambah Alamat' : 'Ubah Alamat',
          style: const TextStyle(color: Colors.black, fontWeight: FontWeight.bold, fontSize: 18),
        ),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.black),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildTextField('Label Alamat', 'Contoh: Rumah, Kantor', _labelController),
            const SizedBox(height: 20),
            _buildTextField('Nama Penerima', 'Masukkan nama penerima', _nameController),
            const SizedBox(height: 20),
            _buildTextField('Nomor Telepon', 'Masukkan nomor telepon', _phoneController, keyboardType: TextInputType.phone),
            const SizedBox(height: 20),
            _buildTextField('Alamat Lengkap', 'Nama jalan, No. Rumah, Unit, dll', _addressController, maxLines: 3),
            const SizedBox(height: 20),
            Row(
              children: [
                Expanded(child: _buildTextField('Kota', 'Masukkan kota', _cityController)),
                const SizedBox(width: 16),
                Expanded(child: _buildTextField('Kode Pos', 'Contoh: 12345', _postalController, keyboardType: TextInputType.number)),
              ],
            ),
            const SizedBox(height: 30),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('Simpan sebagai alamat utama', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                    Text('Alamat ini akan digunakan untuk semua pengiriman', style: TextStyle(color: Colors.grey, fontSize: 12)),
                  ],
                ),
                Switch(
                  value: _isDefault,
                  activeColor: AppColors.primary,
                  onChanged: (val) => setState(() => _isDefault = val),
                ),
              ],
            ),
            const SizedBox(height: 40),
            ElevatedButton(
              onPressed: () => Navigator.pop(context),
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.primary,
                minimumSize: const Size(double.infinity, 54),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              ),
              child: const Text(
                'Simpan Alamat',
                style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildTextField(String label, String hint, TextEditingController controller, {int maxLines = 1, TextInputType? keyboardType}) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: Colors.black87)),
        const SizedBox(height: 8),
        TextField(
          controller: controller,
          maxLines: maxLines,
          keyboardType: keyboardType,
          decoration: InputDecoration(
            hintText: hint,
            hintStyle: TextStyle(color: Colors.grey.shade400, fontSize: 14),
            contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
            enabledBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: BorderSide(color: Colors.grey.shade200),
            ),
            focusedBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: BorderSide(color: AppColors.primary),
            ),
          ),
        ),
      ],
    );
  }
}
