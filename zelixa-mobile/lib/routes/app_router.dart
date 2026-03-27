import 'package:go_router/go_router.dart';
import '../pages/home/main_page.dart';
import '../pages/auth/login_page.dart';
import '../pages/checkout/checkout_page.dart';
import '../pages/order/order_detail_page.dart';
import '../pages/search/search_page.dart';
import '../pages/news/news_detail_page.dart';
import '../pages/address/address_list_page.dart';
import '../pages/address/address_form_page.dart';

class AppRouter {
  static final router = GoRouter(
    initialLocation: '/',
    routes: [
      GoRoute(path: '/login', builder: (context, state) => const LoginPage()),
      GoRoute(path: '/', builder: (context, state) => const MainPage()),
      GoRoute(
        path: '/checkout',
        builder: (context, state) {
          final checkoutData = state.extra as Map<String, dynamic>;
          return CheckoutPage(checkoutData: checkoutData);
        },
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
      GoRoute(path: '/address-list', builder: (context, state) => const AddressListPage()),
      GoRoute(
        path: '/address-form',
        builder: (context, state) {
          final addressData = state.extra as Map<String, dynamic>?;
          return AddressFormPage(addressData: addressData);
        },
      ),
    ],
  );
}
