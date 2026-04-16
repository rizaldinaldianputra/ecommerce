import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../components/button_widget.dart';
import '../../services/auth_service.dart';

class WhatsappLoginPage extends StatefulWidget {
  const WhatsappLoginPage({super.key});

  @override
  State<WhatsappLoginPage> createState() => _WhatsappLoginPageState();
}

class _WhatsappLoginPageState extends State<WhatsappLoginPage> {
  final TextEditingController _phoneController = TextEditingController();
  final AuthService _authService = AuthService();
  bool _isLoading = false;
  String? _errorText;

  @override
  void dispose() {
    _phoneController.dispose();
    super.dispose();
  }

  Future<void> _handleSendOtp() async {
    final phone = _phoneController.text.trim();
    if (phone.isEmpty) {
      setState(() => _errorText = 'Please enter your phone number');
      return;
    }

    setState(() {
      _isLoading = true;
      _errorText = null;
    });

    try {
      final success = await _authService.requestOtp(phone);
      if (success) {
        if (mounted) {
          context.push('/auth/otp', extra: phone);
        }
      } else {
        setState(() => _errorText = 'Failed to send OTP. Please try again.');
      }
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new, color: Colors.black),
          onPressed: () => context.pop(),
        ),
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 32.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const SizedBox(height: 20),
              Hero(
                tag: 'logo',
                child: Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: Colors.pink.withOpacity(0.1),
                    shape: BoxShape.circle,
                  ),
                  child: const Text(
                    'Z',
                    style: TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.w900,
                      color: Colors.pink,
                      fontFamily: 'Outfit',
                    ),
                  ),
                ),
              ),
              const SizedBox(height: 32),
              const Text(
                'WhatsApp\nAuthentication',
                style: TextStyle(
                  fontSize: 36,
                  height: 1.1,
                  fontWeight: FontWeight.w900,
                  fontFamily: 'Outfit',
                  color: Colors.black,
                ),
              ),
              const SizedBox(height: 16),
              Text(
                'Enter your WhatsApp number. We\'ll send a secure 6-digit code via WAHA Bot.',
                style: TextStyle(
                  fontSize: 16,
                  color: Colors.grey[600],
                  height: 1.5,
                  fontFamily: 'Outfit',
                ),
              ),
              const SizedBox(height: 48),
              
              // Premium Input Field
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'PHONE NUMBER',
                    style: TextStyle(
                      fontSize: 10,
                      letterSpacing: 2,
                      fontWeight: FontWeight.w800,
                      color: Colors.grey,
                    ),
                  ),
                  const SizedBox(height: 12),
                  Container(
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(20),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withOpacity(0.04),
                          blurRadius: 20,
                          offset: const Offset(0, 10),
                        )
                      ],
                      border: Border.all(
                        color: _errorText != null ? Colors.red.withOpacity(0.5) : Colors.grey[200]!,
                        width: 1.5,
                      ),
                    ),
                    padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 4),
                    child: Row(
                      children: [
                        const Text(
                          '🇮🇩 +62',
                          style: TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                            fontFamily: 'Outfit',
                          ),
                        ),
                        const SizedBox(width: 16),
                        Expanded(
                          child: TextField(
                            controller: _phoneController,
                            keyboardType: TextInputType.phone,
                            style: const TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.bold,
                              fontFamily: 'Outfit',
                              letterSpacing: 1,
                            ),
                            decoration: const InputDecoration(
                              hintText: '812 3456 7890',
                              border: InputBorder.none,
                              hintStyle: TextStyle(color: Colors.grey, fontWeight: FontWeight.normal),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
              
              if (_errorText != null) ...[
                const SizedBox(height: 12),
                Row(
                  children: [
                    const Icon(Icons.error_outline, size: 16, color: Colors.red),
                    const SizedBox(width: 8),
                    Text(
                      _errorText!,
                      style: const TextStyle(color: Colors.red, fontSize: 13, fontWeight: FontWeight.w600),
                    ),
                  ],
                ),
              ],
              const Spacer(),
              CustomButton(
                text: 'Continue',
                onPressed: _handleSendOtp,
                isLoading: _isLoading,
                color: const Color(0xFF25D366),
                textColor: Colors.white,
                icon: const Icon(Icons.arrow_forward_rounded, color: Colors.white),
              ),
              const SizedBox(height: 40),
            ],
          ),
        ),
      ),
    );
  }
}
