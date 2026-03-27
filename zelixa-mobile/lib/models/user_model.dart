class UserModel {
  final int id;
  final String email;
  final String? fullName;
  final String? profilePicture;
  final List<String>? roles;

  UserModel({
    required this.id,
    required this.email,
    this.fullName,
    this.profilePicture,
    this.roles,
  });

  factory UserModel.fromJson(Map<String, dynamic> json) {
    return UserModel(
      id: json['id'] ?? 0,
      email: json['email'] ?? '',
      fullName: json['fullName'] as String?,
      profilePicture: json['profilePicture'] as String?,
      roles: (json['roles'] as List?)?.map((e) => e.toString()).toList(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'email': email,
      if (fullName != null) 'fullName': fullName,
      if (profilePicture != null) 'profilePicture': profilePicture,
      if (roles != null) 'roles': roles,
    };
  }
}
