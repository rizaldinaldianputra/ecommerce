class NewsModel {
  final int id;
  final String title;
  final String slug;
  final String content;
  final String? author;
  final String? imageUrl;
  final String status;
  final String? createdAt;

  NewsModel({
    required this.id,
    required this.title,
    required this.slug,
    required this.content,
    this.author,
    this.imageUrl,
    required this.status,
    this.createdAt,
  });

  factory NewsModel.fromJson(Map<String, dynamic> json) {
    return NewsModel(
      id: json['id'] ?? 0,
      title: json['title'] ?? '',
      slug: json['slug'] ?? '',
      content: json['content'] ?? '',
      author: json['author'] ?? 'Zelixa Editor',
      imageUrl: json['imageUrl'] ?? 'https://picsum.photos/600/300',
      status: json['status'] ?? 'DRAFT',
      createdAt: json['createdAt'],
    );
  }
}
