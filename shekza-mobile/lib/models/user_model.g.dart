// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'user_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

UserModel _$UserModelFromJson(Map<String, dynamic> json) => UserModel(
  id: (json['id'] as num).toInt(),
  email: json['email'] as String,
  fullName: json['fullName'] as String?,
  profilePicture: json['profilePicture'] as String?,
  roles: (json['roles'] as List<dynamic>?)?.map((e) => e as String).toList(),
);

Map<String, dynamic> _$UserModelToJson(UserModel instance) => <String, dynamic>{
  'id': instance.id,
  'email': instance.email,
  'fullName': instance.fullName,
  'profilePicture': instance.profilePicture,
  'roles': instance.roles,
};
