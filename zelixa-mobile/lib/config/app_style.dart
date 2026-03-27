import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class AppColors {
  static const Color primary = Color(0xFF6A11CB);
  static const Color secondary = Color(0xFF2575FC);
  static const Color accent = Color(0xFFFF4D4D);
  static const Color background = Color(0xFFF8F9FA);
  static const Color cardBackground = Colors.white;
  static const Color textMain = Color(0xFF1A1A1A);
  static const Color textSecondary = Color(0xFF757575);
  static const Color border = Color(0xFFE0E0E0);

  static const LinearGradient primaryGradient = LinearGradient(
    colors: [primary, secondary],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static const LinearGradient flashSaleGradient = LinearGradient(
    colors: [Color(0xFFFF416C), Color(0xFFFF4B2B)],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );
}

class AppStyle {
  static TextStyle heading = GoogleFonts.outfit(
    fontSize: 24,
    fontWeight: FontWeight.bold,
    color: AppColors.textMain,
  );

  static TextStyle subHeading = GoogleFonts.outfit(
    fontSize: 18,
    fontWeight: FontWeight.w600,
    color: AppColors.textMain,
  );

  static TextStyle bodyText = GoogleFonts.inter(
    fontSize: 14,
    color: AppColors.textSecondary,
  );

  static TextStyle priceText = GoogleFonts.inter(
    fontSize: 16,
    fontWeight: FontWeight.bold,
    color: AppColors.primary,
  );
}
