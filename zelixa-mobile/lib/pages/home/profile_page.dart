import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

class ProfilePage extends StatelessWidget {
  const ProfilePage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[100],
      body: SingleChildScrollView(
        child: Column(
          children: [
            // HEADER
            Container(
              padding: const EdgeInsets.only(top: 80, bottom: 40),
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [Color(0xFF6A1B9A), Color(0xFFAB47BC)],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: const BorderRadius.vertical(
                  bottom: Radius.circular(30),
                ),
              ),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const CircleAvatar(
                    radius: 50,
                    backgroundImage: NetworkImage(
                      'https://i.pravatar.cc/150?u=zelixa',
                    ),
                  ),
                  const SizedBox(height: 16),
                  const Text(
                    'Zelixa User',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 22,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 4),
                  const Text(
                    'user@zelixa.com',
                    style: TextStyle(color: Colors.white70, fontSize: 14),
                  ),
                  const SizedBox(height: 24),
                  // Stats
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                    children: [
                      _buildStatItem('Orders', '12'),
                      _buildStatItem('Wishlist', '8'),
                      _buildStatItem('Points', '320'),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),

            // MENU CARDS
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: Column(
                children: [
                  _buildMenuCard(
                    context,
                    Icons.shopping_bag_outlined,
                    'My Orders',
                    onTap: () => context.push('/order'),
                  ),
                  _buildMenuCard(
                    context,
                    Icons.favorite_outline,
                    'Wishlist',
                    badgeCount: 3,
                    onTap: () {},
                  ),
                  _buildMenuCard(
                    context,
                    Icons.location_on_outlined,
                    'Shipping Address',
                    onTap: () => context.push('/address-list'),
                  ),
                  const SizedBox(height: 20),
                  _buildMenuCard(context, Icons.settings_outlined, 'Settings'),
                  _buildMenuCard(context, Icons.help_outline, 'Help Center'),
                  _buildMenuCard(
                    context,
                    Icons.logout,
                    'Logout',
                    isDanger: true,
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildStatItem(String label, String count) {
    return Column(
      children: [
        Text(
          count,
          style: const TextStyle(
            color: Colors.white,
            fontWeight: FontWeight.bold,
            fontSize: 18,
          ),
        ),
        const SizedBox(height: 4),
        Text(
          label,
          style: const TextStyle(color: Colors.white70, fontSize: 12),
        ),
      ],
    );
  }

  Widget _buildMenuCard(
    BuildContext context,
    IconData icon,
    String title, {
    bool isDanger = false,
    int badgeCount = 0,
    VoidCallback? onTap,
  }) {
    return Container(
      margin: const EdgeInsets.symmetric(vertical: 6),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14),
        boxShadow: [
          BoxShadow(
            color: Colors.black12.withOpacity(0.05),
            blurRadius: 8,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: ListTile(
        leading: Stack(
          children: [
            Icon(
              icon,
              color: isDanger ? Colors.red : Colors.deepPurple,
              size: 28,
            ),
            if (badgeCount > 0)
              Positioned(
                right: -4,
                top: -4,
                child: Container(
                  padding: const EdgeInsets.all(4),
                  decoration: const BoxDecoration(
                    color: Colors.red,
                    shape: BoxShape.circle,
                  ),
                  child: Text(
                    '$badgeCount',
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 10,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              ),
          ],
        ),
        title: Text(
          title,
          style: TextStyle(
            fontWeight: FontWeight.w600,
            color: isDanger ? Colors.red : Colors.black87,
          ),
        ),
        trailing: const Icon(Icons.chevron_right, color: Colors.grey),
        onTap: onTap,
      ),
    );
  }
}
