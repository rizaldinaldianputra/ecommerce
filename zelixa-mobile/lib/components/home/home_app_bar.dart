import 'package:flutter/material.dart';

class HomeAppBar extends StatelessWidget implements PreferredSizeWidget {
  const HomeAppBar({super.key});

  @override
  Widget build(BuildContext context) {
    return AppBar(
      backgroundColor: Colors.white,
      elevation: 0,
      title: const Text(
        'ZELIXA',
        style: TextStyle(
          color: Colors.deepPurple,
          fontWeight: FontWeight.bold,
          letterSpacing: 2,
          fontSize: 22,
        ),
      ),
      actions: [
        IconButton(
          icon: const Icon(Icons.notifications_outlined, color: Colors.black87),
          onPressed: () {},
        ),
        IconButton(
          icon: const Icon(Icons.shopping_bag_outlined, color: Colors.black87),
          onPressed: () {},
        ),
        const SizedBox(width: 8),
      ],
    );
  }

  @override
  Size get preferredSize => const Size.fromHeight(kToolbarHeight);
}

class HomeSliverAppBar extends StatelessWidget {
  const HomeSliverAppBar({super.key});

  @override
  Widget build(BuildContext context) {
    return SliverAppBar(
      floating: true,
      backgroundColor: Colors.white,
      elevation: 0,
      centerTitle: false,
      title: Text(
        'ZELIXA',
        style: TextStyle(
          color: Colors.deepPurple.shade700,
          fontWeight: FontWeight.bold,
          letterSpacing: 2,
          fontSize: 22,
        ),
      ),
      actions: [
        IconButton(
          icon: const Icon(Icons.notifications_outlined, color: Colors.black87),
          onPressed: () {},
        ),
        IconButton(
          icon: const Icon(Icons.shopping_bag_outlined, color: Colors.black87),
          onPressed: () {},
        ),
        const SizedBox(width: 8),
      ],
    );
  }
}
