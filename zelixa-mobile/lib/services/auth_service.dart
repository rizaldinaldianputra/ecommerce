import 'package:flutter_appauth/flutter_appauth.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'common_service.dart';
import '../models/user_model.dart';

class AuthService {
  final FlutterAppAuth _appAuth = const FlutterAppAuth();
  final FlutterSecureStorage _storage = const FlutterSecureStorage();
  final CommonService _commonService = CommonService();

  // Keycloak Configuration
  static const String _clientId =
      'zelixa-mobile'; // Confirm with your Keycloak client
  static const String _redirectUrl = 'com.zelixa.app:/oauth2redirect';
  static const String _issuer =
      'http://localhost:8080/realms/zelixa'; // Update with your Keycloak URL

  Future<UserModel?> loginWithKeycloak() async {
    try {
      final AuthorizationTokenResponse? result = await _appAuth
          .authorizeAndExchangeCode(
            AuthorizationTokenRequest(
              _clientId,
              _redirectUrl,
              issuer: _issuer,
              scopes: ['openid', 'profile', 'email', 'offline_access'],
              promptValues: ['login'],
            ),
          );

      if (result != null && result.accessToken != null) {
        // Log user info from Keycloak or fetch it from your backend's /me endpoint
        // Send accessToken to backend if you need to exchange it or just use it as Bearer token

        // Store the Keycloak access token
        await _storage.write(key: 'auth_token', value: result.accessToken);

        // Fetch user profile from backend to get internal User ID and roles
        final response = await _commonService.get('/auth/me');

        if (response.statusCode == 200) {
          final data = response.data['data'];
          return UserModel.fromJson(data);
        }
      }
      return null;
    } catch (e) {
      print('Keycloak Login error: $e');
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
