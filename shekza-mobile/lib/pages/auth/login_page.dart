import 'package:flutter/material.dart';
import '../../components/custom_button.dart';
import '../../services/auth_service.dart';

class LoginPage extends StatefulWidget {
  const LoginPage({super.key});

  @override
  State<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  final AuthService _authService = AuthService();
  bool _isLoading = false;

  Future<void> _handleKeycloakLogin() async {
    setState(() => _isLoading = true);
    try {
      final user = await _authService.loginWithKeycloak();
      if (user != null) {
        if (mounted) {
          // Navigate to home page
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text('Welcome, ${user.fullName ?? user.email}')),
          );
        }
      } else {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Login failed. Please try again.')),
          );
        }
      }
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        padding: const EdgeInsets.symmetric(horizontal: 24),
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [
              Colors.pink.shade50,
              Colors.white,
            ],
          ),
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Spacer(),
            // Logo or App Name
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(30),
                boxShadow: [
                  BoxShadow(
                    color: Colors.pink.withOpacity(0.1),
                    blurRadius: 20,
                    spreadRadius: 5,
                  ),
                ],
              ),
              child: const Text(
                'S',
                style: TextStyle(
                  fontSize: 60,
                  fontWeight: FontWeight.bold,
                  color: Colors.pink,
                  fontFamily: 'Outfit',
                ),
              ),
            ),
            const SizedBox(height: 24),
            const Text(
              'SHEKZA',
              style: TextStyle(
                fontSize: 32,
                fontWeight: FontWeight.bold,
                letterSpacing: 2,
                fontFamily: 'Outfit',
              ),
            ),
            const Text(
              'Minimalist Elegance',
              style: TextStyle(
                color: Colors.grey,
                fontSize: 14,
                fontFamily: 'Outfit',
              ),
            ),
            const Spacer(),
            const Text(
              'Empower your style with\ntimeless essentials.',
              textAlign: TextAlign.center,
              style: TextStyle(
                fontSize: 16,
                color: Colors.black87,
                fontFamily: 'Outfit',
                fontWeight: FontWeight.w500,
              ),
            ),
            const SizedBox(height: 48),
            CustomButton(
              text: 'Sign in with Google',
              onPressed: _handleKeycloakLogin,
              isLoading: _isLoading,
              color: Colors.white,
              textColor: Colors.black87,
              icon: Image.network(
                 'https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_Logo.png',
                 height: 20,
              ),
            ),
            const SizedBox(height: 16),
            CustomButton(
              text: 'Sign up with Email',
              onPressed: () {},
              color: Colors.pink,
            ),
            const SizedBox(height: 32),
            const Text(
              'By signing in, you agree to our Terms and Conditions',
              textAlign: TextAlign.center,
              style: TextStyle(
                fontSize: 12,
                color: Colors.grey,
                fontFamily: 'Outfit',
              ),
            ),
            const SizedBox(height: 48),
          ],
        ),
      ),
    );
  }
}
