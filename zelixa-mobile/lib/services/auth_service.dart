import 'package:flutter_appauth/flutter_appauth.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'common_service.dart';
import '../models/user_model.dart';

class AuthService {
  final FlutterAppAuth _appAuth = const FlutterAppAuth();
  final FlutterSecureStorage _storage = const FlutterSecureStorage();
  final CommonService _commonService = CommonService();

  // ✅ FIXED CONFIG (SAMAKAN SEMUA)
  static const String _clientId = 'mobile-app';
  static const String _redirectUrl = 'com.zelixa.app://oauthredirect';
  final _issuer =
      "https://bacteriostatic-nonobligatorily-taunya.ngrok-free.dev/realms/zelixa";

  /// 🔥 GOOGLE / KEYCLOAK LOGIN
  Future<UserModel?> loginWithKeycloak({String? idpHint}) async {
    try {
      final result = await _appAuth.authorizeAndExchangeCode(
        AuthorizationTokenRequest(
          _clientId,
          _redirectUrl,
          issuer: _issuer,
          scopes: ['openid', 'profile', 'email'],
          allowInsecureConnections: true, // Untuk HTTP local dev
          additionalParameters: idpHint != null
              ? {'kc_idp_hint': idpHint}
              : null,
        ),
      );

      if (result != null && result.accessToken != null) {
        final token = result.accessToken!;

        // 🔐 simpan token
        await _storage.write(key: 'auth_token', value: token);

        // 🔥 ambil user dari backend (token otomatis di-inject oleh interceptor)
        final response = await _commonService.get('/auth/me');

        if (response.statusCode == 200) {
          final data =
              response.data['data']; // Ambil field 'data' dari ApiResponse
          return UserModel.fromJson(data);
        }
      }
      return null;
    } catch (e) {
      print('Keycloak Login error: $e');
      return null;
    }
  }

  // ==========================
  // ✅ OTP WHATSAPP (TIDAK DIUBAH)
  // ==========================

  Future<bool> requestOtp(String phoneNumber) async {
    try {
      final response = await _commonService.post(
        '/auth/otp/request',
        data: {'phoneNumber': phoneNumber},
      );
      return response.statusCode == 200;
    } catch (e) {
      print('Request OTP error: $e');
      return false;
    }
  }

  Future<UserModel?> verifyOtp(String phoneNumber, String code) async {
    try {
      final response = await _commonService.post(
        '/auth/otp/login',
        data: {'phoneNumber': phoneNumber, 'code': code},
      );

      if (response.statusCode == 200 && response.data['token'] != null) {
        final token = response.data['token'];

        await _storage.write(key: 'auth_token', value: token);

        final userResponse = await _commonService.get('/auth/me');
        if (userResponse.statusCode == 200) {
          final data = userResponse.data;
          return UserModel.fromJson(data);
        }
      }
      return null;
    } catch (e) {
      print('Verify OTP error: $e');
      return null;
    }
  }

  Future<void> logout() async {
    await _storage.delete(key: 'auth_token');
  }

  Future<bool> isLoggedIn() async {
    final token = await _storage.read(key: 'auth_token');
    return token != null;
  }
}
