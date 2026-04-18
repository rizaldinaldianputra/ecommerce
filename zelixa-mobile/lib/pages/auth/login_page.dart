import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:video_player/video_player.dart';
import '../../components/button_widget.dart';
import '../../services/auth_service.dart';

class LoginPage extends StatefulWidget {
  const LoginPage({super.key});

  @override
  State<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  final AuthService _authService = AuthService();
  bool _isLoading = false;

  VideoPlayerController? _controller;
  @override
  void initState() {
    super.initState();

    _controller = VideoPlayerController.asset('assets/video.mp4')
      ..initialize().then((_) {
        if (!mounted) return;
        setState(() {});
        _controller!
          ..setLooping(true)
          ..setVolume(0)
          ..play();
      });
  }

  @override
  void dispose() {
    _controller?.dispose();
    super.dispose();
  }

  Future<void> _handleKeycloakLogin({String? idpHint}) async {
    setState(() => _isLoading = true);
    try {
      final user = await _authService.loginWithKeycloak(idpHint: idpHint);
      if (user != null) {
        if (mounted) {
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
      body: Stack(
        children: [
          // 🎥 BACKGROUND VIDEO
          if (_controller?.value.isInitialized ?? false)
            SizedBox.expand(
              child: FittedBox(
                fit: BoxFit.cover,
                child: SizedBox(
                  width: _controller!.value.size.width,
                  height: _controller!.value.size.height,
                  child: VideoPlayer(_controller!),
                ),
              ),
            )
          else
            const SizedBox(),
          Container(color: Colors.black.withOpacity(0.4)),

          // 🧾 CONTENT
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 24),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const Spacer(),

                // Logo
                Container(
                  padding: const EdgeInsets.all(20),
                  decoration: BoxDecoration(
                    color: Colors.white.withOpacity(0.9),
                    borderRadius: BorderRadius.circular(30),
                  ),
                  child: const Text(
                    'Z',
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
                  'ZELIXA',
                  style: TextStyle(
                    fontSize: 32,
                    fontWeight: FontWeight.bold,
                    letterSpacing: 2,
                    fontFamily: 'Outfit',
                    color: Colors.white,
                  ),
                ),

                const Text(
                  'Minimalist Elegance',
                  style: TextStyle(
                    color: Colors.white70,
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
                    color: Colors.white,
                    fontFamily: 'Outfit',
                    fontWeight: FontWeight.w500,
                  ),
                ),

                const SizedBox(height: 48),

                CustomButton(
                  text: 'Sign in with Google',
                  onPressed: () => _handleKeycloakLogin(idpHint: 'google'),
                  isLoading: _isLoading,
                  color: Colors.white,
                  textColor: Colors.black87,
                  icon: Image.asset('assets/google.png', height: 20),
                ),

                const SizedBox(height: 16),

                // CustomButton(
                //   text: 'Login with WhatsApp',
                //   onPressed: () => _handleKeycloakLogin(idpHint: 'whatsapp'),
                //   isLoading: _isLoading,
                //   color: const Color(0xFF25D366),
                //   textColor: Colors.white,
                //   icon: const Icon(Icons.phone, color: Colors.white, size: 20),
                // ),
                CustomButton(
                  text: 'Sign up with Email',
                  onPressed: () {
                    context.goNamed('/home');
                  },
                  color: Colors.pink,
                ),

                const SizedBox(height: 32),

                const Text(
                  'By signing in, you agree to our Terms and Conditions',
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    fontSize: 12,
                    color: Colors.white70,
                    fontFamily: 'Outfit',
                  ),
                ),

                const SizedBox(height: 48),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
