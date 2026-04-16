package com.zelixa.zelixa.controller;

import com.zelixa.zelixa.dto.ApiResponse;
import com.zelixa.zelixa.entity.NotificationHistory;
import com.zelixa.zelixa.repository.NotificationHistoryRepository;
import com.zelixa.zelixa.security.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationHistoryRepository historyRepository;
    private final com.zelixa.zelixa.service.NotificationService notificationService;
    private final com.zelixa.zelixa.repository.UserRepository userRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<List<NotificationHistory>>> getMyNotifications(@AuthenticationPrincipal CustomUserDetails userDetails) {
        List<NotificationHistory> notifications = historyRepository.findByUserIdOrderByCreatedAtDesc(userDetails.getId());
        return ResponseEntity.ok(ApiResponse.success("Notifications fetched", notifications));
    }

    @GetMapping("/unread-count")
    public ResponseEntity<ApiResponse<Long>> getUnreadCount(@AuthenticationPrincipal CustomUserDetails userDetails) {
        Long count = historyRepository.countByUserIdAndIsReadFalse(userDetails.getId());
        return ResponseEntity.ok(ApiResponse.success("Unread count fetched", count));
    }

    @PatchMapping("/{id}/read")
    public ResponseEntity<ApiResponse<Void>> markAsRead(@PathVariable Long id) {
        NotificationHistory history = historyRepository.findById(id).orElseThrow();
        history.setIsRead(true);
        historyRepository.save(history);
        return ResponseEntity.ok(ApiResponse.success("Notification marked as read", null));
    }

    @PatchMapping("/read-all")
    public ResponseEntity<ApiResponse<Void>> markAllAsRead(@AuthenticationPrincipal CustomUserDetails userDetails) {
        List<NotificationHistory> unread = historyRepository.findByUserIdAndIsReadFalse(userDetails.getId());
        unread.forEach(n -> n.setIsRead(true));
        historyRepository.saveAll(unread);
        return ResponseEntity.ok(ApiResponse.success("All notifications marked as read", null));
    }

    @DeleteMapping("/clear")
    public ResponseEntity<ApiResponse<Void>> clearNotifications(@AuthenticationPrincipal CustomUserDetails userDetails) {
        historyRepository.deleteByUserId(userDetails.getId());
        return ResponseEntity.ok(ApiResponse.success("Notification history cleared", null));
    }

    @PostMapping("/push")
    public ResponseEntity<ApiResponse<Void>> sendPushNotification(
            @RequestBody java.util.Map<String, String> payload) {
        String title = payload.get("title");
        String body = payload.get("body");
        String type = payload.get("type");
        String userIdStr = payload.get("userId");
        String topic = payload.get("topic");

        if (userIdStr != null && !userIdStr.isEmpty()) {
            Long userId = Long.parseLong(userIdStr);
            com.zelixa.zelixa.entity.User user = userRepository.findById(userId).orElseThrow();
            notificationService.notifyUser(user, title, body, type, new java.util.HashMap<>());
        } else if (topic != null && !topic.isEmpty()) {
            notificationService.notifyTopic(topic, title, body, type, new java.util.HashMap<>());
        } else {
            // Default to "all" topic if nothing specified
            notificationService.notifyTopic("all", title, body, type, new java.util.HashMap<>());
        }

        return ResponseEntity.ok(ApiResponse.success("Notification pushed", null));
    }
}
