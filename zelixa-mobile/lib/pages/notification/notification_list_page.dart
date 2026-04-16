import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../config/app_style.dart';

class NotificationListPage extends StatefulWidget {
  const NotificationListPage({super.key});

  @override
  State<NotificationListPage> createState() => _NotificationListPageState();
}

class _NotificationListPageState extends State<NotificationListPage>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;

  final List<Map<String, dynamic>> _allNotifications = [
    {
      'id': '1',
      'type': 'order',
      'title': 'Pesanan Dikirim!',
      'message': 'Pesanan #ORD-2026001 Anda sedang dalam perjalanan oleh JNE Express.',
      'time': '5 menit yang lalu',
      'isRead': false,
      'icon': Icons.local_shipping_rounded,
      'iconColor': Color(0xFF2575FC),
      'iconBg': Color(0xFFEFF4FF),
    },
    {
      'id': '2',
      'type': 'promo',
      'title': '🔥 Flash Sale Dimulai!',
      'message': 'Diskon hingga 70% untuk koleksi terbaru Zelixa. Jangan sampai kehabisan!',
      'time': '30 menit yang lalu',
      'isRead': false,
      'icon': Icons.local_offer_rounded,
      'iconColor': Color(0xFFFF4D4D),
      'iconBg': Color(0xFFFFF0F0),
    },
    {
      'id': '3',
      'type': 'wishlist',
      'title': 'Stok Hampir Habis',
      'message': 'Premium Casual Hoodie di wishlist-mu hampir habis. Segera checkout sebelum kehabisan!',
      'time': '2 jam yang lalu',
      'isRead': false,
      'icon': Icons.favorite_rounded,
      'iconColor': Color(0xFFFF4D4D),
      'iconBg': Color(0xFFFFF0F0),
    },
    {
      'id': '4',
      'type': 'order',
      'title': 'Pesanan Dikonfirmasi',
      'message': 'Pesanan #ORD-2026002 Anda telah dikonfirmasi dan sedang diproses.',
      'time': '1 hari yang lalu',
      'isRead': true,
      'icon': Icons.check_circle_rounded,
      'iconColor': Color(0xFF2ECC71),
      'iconBg': Color(0xFFF0FFF4),
    },
    {
      'id': '5',
      'type': 'promo',
      'title': 'Voucher Spesial Untukmu',
      'message': 'Gunakan kode ZELIXA30 dan dapatkan diskon Rp 30.000 untuk pembelian berikutnya.',
      'time': '2 hari yang lalu',
      'isRead': true,
      'icon': Icons.card_giftcard_rounded,
      'iconColor': Color(0xFF6A11CB),
      'iconBg': Color(0xFFF5F0FF),
    },
    {
      'id': '6',
      'type': 'system',
      'title': 'Update Aplikasi Tersedia',
      'message': 'Versi terbaru Zelixa sudah tersedia! Update sekarang untuk menikmati fitur-fitur baru.',
      'time': '3 hari yang lalu',
      'isRead': true,
      'icon': Icons.system_update_rounded,
      'iconColor': Color(0xFF757575),
      'iconBg': Color(0xFFF5F5F5),
    },
    {
      'id': '7',
      'type': 'order',
      'title': 'Pesanan Selesai',
      'message': 'Pesanan #ORD-2025099 telah diterima. Berikan ulasan untuk produk yang kamu beli!',
      'time': '5 hari yang lalu',
      'isRead': true,
      'icon': Icons.star_rounded,
      'iconColor': Color(0xFFF39C12),
      'iconBg': Color(0xFFFFF8E1),
    },
    {
      'id': '8',
      'type': 'promo',
      'title': 'Member Exclusive: Double Points',
      'message': 'Dapatkan 2x poin reward untuk setiap pembelian hari ini! Berlaku sampai tengah malam.',
      'time': '1 minggu yang lalu',
      'isRead': true,
      'icon': Icons.workspace_premium_rounded,
      'iconColor': Color(0xFFF1C40F),
      'iconBg': Color(0xFFFFF9E6),
    },
  ];

  int get _unreadCount => _allNotifications.where((n) => !(n['isRead'] as bool)).length;

  List<Map<String, dynamic>> get _orderNotifs =>
      _allNotifications.where((n) => n['type'] == 'order').toList();

  List<Map<String, dynamic>> get _promoNotifs =>
      _allNotifications.where((n) => n['type'] == 'promo').toList();

  List<Map<String, dynamic>> get _otherNotifs =>
      _allNotifications.where((n) => !['order', 'promo'].contains(n['type'])).toList();

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 4, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  void _markAllRead() {
    setState(() {
      for (final n in _allNotifications) {
        n['isRead'] = true;
      }
    });
  }

  void _markAsRead(String id) {
    setState(() {
      final notif = _allNotifications.firstWhere((n) => n['id'] == id);
      notif['isRead'] = true;
    });
  }

  void _deleteNotification(String id) {
    setState(() {
      _allNotifications.removeWhere((n) => n['id'] == id);
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8F8F8),
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded, color: Colors.black87, size: 20),
          onPressed: () => context.pop(),
        ),
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Notifikasi',
              style: AppStyle.heading.copyWith(fontSize: 20, color: AppColors.primary),
            ),
            if (_unreadCount > 0)
              Text(
                '$_unreadCount belum dibaca',
                style: AppStyle.bodyText.copyWith(fontSize: 12),
              ),
          ],
        ),
        actions: [
          if (_unreadCount > 0)
            TextButton(
              onPressed: _markAllRead,
              child: Text(
                'Baca Semua',
                style: TextStyle(color: AppColors.primary, fontSize: 13, fontWeight: FontWeight.w600),
              ),
            ),
          const SizedBox(width: 8),
        ],
        bottom: TabBar(
          controller: _tabController,
          labelColor: AppColors.primary,
          unselectedLabelColor: Colors.grey,
          indicatorColor: AppColors.primary,
          indicatorSize: TabBarIndicatorSize.label,
          labelStyle: const TextStyle(fontWeight: FontWeight.w600, fontSize: 13),
          tabs: const [
            Tab(text: 'Semua'),
            Tab(text: 'Pesanan'),
            Tab(text: 'Promo'),
            Tab(text: 'Lainnya'),
          ],
        ),
      ),
      body: TabBarView(
        controller: _tabController,
        children: [
          _buildNotifList(_allNotifications),
          _buildNotifList(_orderNotifs),
          _buildNotifList(_promoNotifs),
          _buildNotifList(_otherNotifs),
        ],
      ),
    );
  }

  Widget _buildNotifList(List<Map<String, dynamic>> notifications) {
    if (notifications.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              width: 100,
              height: 100,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                gradient: LinearGradient(
                  colors: [AppColors.primary.withOpacity(0.08), AppColors.secondary.withOpacity(0.12)],
                ),
              ),
              child: Icon(Icons.notifications_off_outlined, size: 46, color: AppColors.primary.withOpacity(0.4)),
            ),
            const SizedBox(height: 20),
            Text('Tidak ada notifikasi', style: AppStyle.subHeading.copyWith(fontSize: 16)),
            const SizedBox(height: 6),
            Text('Semua notifikasi akan muncul di sini', style: AppStyle.bodyText.copyWith(fontSize: 13)),
          ],
        ),
      );
    }

    return ListView.separated(
      padding: const EdgeInsets.symmetric(vertical: 12),
      itemCount: notifications.length,
      separatorBuilder: (_, __) => const Divider(height: 1, indent: 72, endIndent: 16),
      itemBuilder: (context, index) {
        final notif = notifications[index];
        return _buildNotifCard(notif);
      },
    );
  }

  Widget _buildNotifCard(Map<String, dynamic> notif) {
    final isRead = notif['isRead'] as bool;

    return Dismissible(
      key: Key(notif['id']),
      direction: DismissDirection.endToStart,
      background: Container(
        alignment: Alignment.centerRight,
        padding: const EdgeInsets.only(right: 20),
        color: AppColors.accent.withOpacity(0.9),
        child: const Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.delete_rounded, color: Colors.white, size: 24),
            SizedBox(height: 4),
            Text('Hapus', style: TextStyle(color: Colors.white, fontSize: 11)),
          ],
        ),
      ),
      onDismissed: (_) => _deleteNotification(notif['id']),
      child: InkWell(
        onTap: () => _markAsRead(notif['id']),
        child: Container(
          color: isRead ? Colors.transparent : AppColors.primary.withOpacity(0.03),
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Icon Container
              Container(
                width: 46,
                height: 46,
                decoration: BoxDecoration(
                  color: notif['iconBg'] as Color,
                  borderRadius: BorderRadius.circular(13),
                ),
                child: Icon(notif['icon'] as IconData, color: notif['iconColor'] as Color, size: 22),
              ),
              const SizedBox(width: 14),

              // Content
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Expanded(
                          child: Text(
                            notif['title'],
                            style: TextStyle(
                              fontWeight: isRead ? FontWeight.w500 : FontWeight.bold,
                              fontSize: 14,
                              color: isRead ? AppColors.textMain : AppColors.textMain,
                            ),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                        if (!isRead)
                          Container(
                            width: 8,
                            height: 8,
                            decoration: const BoxDecoration(
                              color: Color(0xFF6A11CB),
                              shape: BoxShape.circle,
                            ),
                          ),
                      ],
                    ),
                    const SizedBox(height: 4),
                    Text(
                      notif['message'],
                      style: AppStyle.bodyText.copyWith(fontSize: 13, height: 1.4),
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                    ),
                    const SizedBox(height: 6),
                    Text(
                      notif['time'],
                      style: AppStyle.bodyText.copyWith(fontSize: 11, color: Colors.grey.shade400),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
