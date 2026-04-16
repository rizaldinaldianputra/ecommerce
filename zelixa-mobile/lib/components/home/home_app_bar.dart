import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../config/app_style.dart';

class HomeAppBar extends StatelessWidget implements PreferredSizeWidget {
  const HomeAppBar({super.key});

  @override
  Widget build(BuildContext context) {
    return AppBar(
      backgroundColor: Colors.white,
      elevation: 0,

      actions: [
        _NotificationButton(),
        IconButton(
          icon: const Icon(
            Icons.favorite_border_rounded,
            color: Colors.black87,
          ),
          tooltip: 'Wishlist',
          onPressed: () => context.push('/wishlist'),
        ),
        const SizedBox(width: 8),
      ],
    );
  }

  @override
  Size get preferredSize => const Size.fromHeight(kToolbarHeight);
}

class _NotificationButton extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    // Unread count mock — ganti dengan riverpod state jika sudah ada provider
    const int unreadCount = 3;
    return Stack(
      clipBehavior: Clip.none,
      children: [
        IconButton(
          icon: const Icon(Icons.notifications_outlined, color: Colors.black87),
          tooltip: 'Notifikasi',
          onPressed: () => context.push('/notifications'),
        ),
        if (unreadCount > 0)
          Positioned(
            top: 8,
            right: 8,
            child: Container(
              width: 16,
              height: 16,
              decoration: const BoxDecoration(
                color: Color(0xFFFF4D4D),
                shape: BoxShape.circle,
              ),
              child: Center(
                child: Text(
                  unreadCount > 9 ? '9+' : '$unreadCount',
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 9,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ),
          ),
      ],
    );
  }
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
      titleSpacing: 0,
      title: Image.asset('assets/logo.png', width: 150),
      actions: [
        _NotificationButton(),
        IconButton(
          icon: const Icon(
            Icons.favorite_border_rounded,
            color: Colors.black87,
          ),
          tooltip: 'Wishlist',
          onPressed: () => context.push('/wishlist'),
        ),
        const SizedBox(width: 8),
      ],
    );
  }
}
