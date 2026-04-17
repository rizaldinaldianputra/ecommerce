import 'package:go_router/go_router.dart';
import '../pages/home/main_page.dart';
import '../pages/auth/login_page.dart';
import '../pages/checkout/checkout_page.dart';
import '../pages/order/order_detail_page.dart';
import '../pages/search/search_page.dart';
import '../pages/news/news_detail_page.dart';
import '../pages/address/address_list_page.dart';
import '../pages/address/address_form_page.dart';
import '../pages/home/wishlist_page.dart';
import '../pages/notification/notification_list_page.dart';
import '../pages/auth/whatsapp_login_page.dart';
import '../pages/auth/otp_verification_page.dart';

class AppRouter {
  static final router = GoRouter(
    initialLocation: '/login',
    routes: [
      GoRoute(path: '/login', builder: (context, state) => const LoginPage()),
      GoRoute(
        path: '/auth/whatsapp',
        builder: (context, state) => const WhatsappLoginPage(),
      ),
      GoRoute(
        path: '/auth/otp',
        builder: (context, state) {
          final phone = state.extra as String;
          return OtpVerificationPage(phoneNumber: phone);
        },
      ),
      GoRoute(path: '/', builder: (context, state) => const MainPage()),
      GoRoute(
        path: '/checkout',
        builder: (context, state) => const CheckoutPage(),
      ),
      GoRoute(
        path: '/order-detail',
        builder: (context, state) {
          final orderData = state.extra as Map<String, dynamic>;
          return OrderDetailPage(orderData: orderData);
        },
      ),
      GoRoute(path: '/search', builder: (context, state) => const SearchPage()),
      GoRoute(
        path: '/news-detail',
        builder: (context, state) {
          final newsData = state.extra as Map<String, dynamic>;
          return NewsDetailPage(newsData: newsData);
        },
      ),
      GoRoute(
        path: '/address-list',
        builder: (context, state) => const AddressListPage(),
      ),
      GoRoute(
        path: '/address-form',
        builder: (context, state) {
          final addressData = state.extra as Map<String, dynamic>?;
          return AddressFormPage(addressData: addressData);
        },
      ),
      GoRoute(
        path: '/wishlist',
        builder: (context, state) => const WishlistPage(),
      ),
      GoRoute(
        path: '/notifications',
        builder: (context, state) => const NotificationListPage(),
      ),
    ],
  );
}
