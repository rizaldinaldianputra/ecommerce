import 'package:flutter/material.dart';
import '../../config/app_style.dart';
import '../../components/card_widget.dart';

class SearchPage extends StatefulWidget {
  const SearchPage({super.key});

  @override
  State<SearchPage> createState() => _SearchPageState();
}

class _SearchPageState extends State<SearchPage> {
  final TextEditingController _searchController = TextEditingController();
  List<String> searchHistory = [
    'Hoodie',
    'Denim Jacket',
    'Zelixa Wear',
    'Casual',
  ];
  bool isSearching = false;

  // Mock results
  final List<Map<String, dynamic>> allProducts = [
    {
      'title': 'Premium Casual Hoodie',
      'brand': 'Zelixa',
      'price': 250000.0,
      'image': 'https://picsum.photos/300?random=1',
    },
    {
      'title': 'Slim Fit Denim',
      'brand': 'Zelixa',
      'price': 450000.0,
      'image': 'https://picsum.photos/300?random=2',
    },
    {
      'title': 'Basic White T-Shirt',
      'brand': 'Zelixa',
      'price': 150000.0,
      'image': 'https://picsum.photos/300?random=3',
    },
  ];

  List<Map<String, dynamic>> searchResults = [];

  void _onSearch(String query) {
    if (query.isEmpty) {
      setState(() {
        isSearching = false;
        searchResults = [];
      });
      return;
    }

    setState(() {
      isSearching = true;
      searchResults = allProducts
          .where((p) => p['title'].toLowerCase().contains(query.toLowerCase()))
          .toList();
    });

    if (!searchHistory.contains(query)) {
      setState(() {
        searchHistory.insert(0, query);
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey.shade50,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.black),
          onPressed: () => Navigator.pop(context),
        ),
        title: Container(
          height: 45,
          padding: const EdgeInsets.symmetric(horizontal: 12),
          decoration: BoxDecoration(
            color: Colors.grey.shade100,
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: Colors.grey.shade200),
          ),
          child: TextField(
            controller: _searchController,
            onChanged: _onSearch,
            autofocus: true,
            decoration: const InputDecoration(
              hintText: 'Cari produk impianmu...',
              hintStyle: TextStyle(color: Colors.grey, fontSize: 14),
              border: InputBorder.none,
              icon: Icon(Icons.search, color: Colors.grey, size: 20),
            ),
          ),
        ),
      ),
      body: isSearching ? _buildResults() : _buildHistory(),
    );
  }

  Widget _buildHistory() {
    return Padding(
      padding: const EdgeInsets.all(20.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                'Pencarian Terakhir',
                style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
              ),
              GestureDetector(
                onTap: () => setState(() => searchHistory.clear()),
                child: const Text(
                  'Hapus',
                  style: TextStyle(color: Colors.red, fontSize: 12),
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          Wrap(
            spacing: 12,
            runSpacing: 12,
            children: searchHistory
                .map((query) => _buildHistoryChip(query))
                .toList(),
          ),
          const SizedBox(height: 32),
          const Text(
            'Kategori Populer',
            style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
          ),
          const SizedBox(height: 16),
          _buildPopularCategory('Fashion Pria'),
          _buildPopularCategory('Aksesoris Wanita'),
          _buildPopularCategory('Sepatu Olahraga'),
        ],
      ),
    );
  }

  Widget _buildHistoryChip(String label) {
    return GestureDetector(
      onTap: () {
        _searchController.text = label;
        _onSearch(label);
      },
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: Colors.grey.shade200),
        ),
        child: Text(
          label,
          style: const TextStyle(fontSize: 13, color: Colors.black87),
        ),
      ),
    );
  }

  Widget _buildPopularCategory(String name) {
    return ListTile(
      contentPadding: EdgeInsets.zero,
      title: Text(name, style: const TextStyle(fontSize: 14)),
      trailing: const Icon(Icons.chevron_right, size: 20, color: Colors.grey),
      onTap: () => _onSearch(name),
    );
  }

  Widget _buildResults() {
    if (searchResults.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.search_off, size: 80, color: Colors.grey.shade300),
            const SizedBox(height: 16),
            const Text(
              'Produk tidak ditemukan',
              style: TextStyle(fontWeight: FontWeight.bold, color: Colors.grey),
            ),
          ],
        ),
      );
    }

    return GridView.builder(
      padding: const EdgeInsets.all(16),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 2,
        mainAxisSpacing: 16,
        crossAxisSpacing: 16,
        childAspectRatio: 0.6,
      ),
      itemCount: searchResults.length,
      itemBuilder: (context, index) {
        final product = searchResults[index];
        return ProductCard(
          image: product['image'],
          title: product['title'],
          brand: product['brand'],
          price: product['price'],
          rating: 4.8,
        );
      },
    );
  }
}
