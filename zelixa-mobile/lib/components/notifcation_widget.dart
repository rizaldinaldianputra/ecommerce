import 'package:flutter/material.dart';
import 'package:toastification/toastification.dart';

class AppToast {
  static void success(BuildContext context, String message) {
    toastification.show(
      context: context,
      type: ToastificationType.success,
      style: ToastificationStyle.fillColored,
      title: const Text('Success'),
      description: Text(message),
      alignment: Alignment.topRight,
      autoCloseDuration: const Duration(seconds: 3),
      borderRadius: BorderRadius.circular(12),
      showProgressBar: true,
    );
  }

  static void error(BuildContext context, String message) {
    toastification.show(
      context: context,
      type: ToastificationType.error,
      style: ToastificationStyle.fillColored,
      title: const Text('Error'),
      description: Text(message),
      alignment: Alignment.topRight,
      autoCloseDuration: const Duration(seconds: 4),
      borderRadius: BorderRadius.circular(12),
      showProgressBar: true,
    );
  }
}
