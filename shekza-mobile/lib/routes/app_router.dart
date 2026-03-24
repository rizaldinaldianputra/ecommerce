import 'package:go_router/go_router.dart';
import '../pages/auth/login_page.dart';

class AppRouter {
  static final router = GoRouter(
    initialLocation: '/login',
    routes: [
      GoRoute(
        path: '/login',
        builder: (context, state) => const LoginPage(),
      ),
      // Add more routes here, e.g., home, product detail, etc.
    ],
  );
}
