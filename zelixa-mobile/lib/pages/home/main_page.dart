import 'package:flutter/material.dart';
import 'package:convex_bottom_bar/convex_bottom_bar.dart';
import '../../config/app_style.dart';
import 'home_page.dart';
import 'news_page.dart';
import 'profile_page.dart';
import '../cart/cart_page.dart';
import '../order/order_list_page.dart';

class MainPage extends StatefulWidget {
  const MainPage({super.key});

  @override
  State<MainPage> createState() => _MainPageState();
}

class _MainPageState extends State<MainPage> {
  int currentIndex = 0;

  final List<Widget> pages = [
    const HomePage(),
    const NewsPage(), // Diubah kembali dari TrendingPage
    const CartPage(), // Cart di tengah
    const OrderListPage(),
    const ProfilePage(),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: IndexedStack(index: currentIndex, children: pages),
      bottomNavigationBar: ConvexAppBar(
        style: TabStyle.fixedCircle,
        backgroundColor: Colors.white,
        color: Colors.grey,
        activeColor: AppColors.primary,
        shadowColor: Colors.transparent,
        initialActiveIndex: currentIndex,
        onTap: (index) {
          setState(() {
            currentIndex = index;
          });
        },
        items: const [
          TabItem(icon: Icons.home_rounded, title: 'Beranda'),
          TabItem(icon: Icons.newspaper_rounded, title: 'News'),
          TabItem(icon: Icons.shopping_bag, title: 'Keranjang'),
          TabItem(icon: Icons.receipt_long, title: 'Pesanan'),
          TabItem(icon: Icons.person_rounded, title: 'Profil'),
        ],
      ),
    );
  }
}
