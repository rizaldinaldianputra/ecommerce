package com.zelixa.zelixa.service;

import com.zelixa.zelixa.entity.NotificationHistory;
import com.zelixa.zelixa.entity.User;
import com.zelixa.zelixa.repository.NotificationHistoryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {

    private final FcmService fcmService;
    private final NotificationHistoryRepository historyRepository;

    /**
     * Notify a specific user and save in history.
     */
    public void notifyUser(User user, String title, String body, String type, Map<String, String> data) {
        if (data == null) data = new HashMap<>();
        
        // Save to history
        NotificationHistory history = NotificationHistory.builder()
                .userId(user.getId())
                .title(title)
                .body(body)
                .type(type)
                .isRead(false)
                .dataPayload(data.toString())
                .build();
        historyRepository.save(history);

        // Send FCM push
        if (user.getFcmToken() != null && !user.getFcmToken().isEmpty()) {
            fcmService.sendPushToToken(user.getFcmToken(), title, body, data);
        } else {
            log.info("User {} has no FCM token, notification saved to history only.", user.getId());
        }
    }

    /**
     * Notify all users via a topic (e.g. "news") and save a global history entry.
     */
    public void notifyTopic(String topic, String title, String body, String type, Map<String, String> data) {
        if (data == null) data = new HashMap<>();

        // Save global history (userId = null)
        NotificationHistory history = NotificationHistory.builder()
                .userId(null) // Global/Topic notification
                .title(title)
                .body(body)
                .type(type)
                .isRead(false)
                .dataPayload(data.toString())
                .build();
        historyRepository.save(history);

        // Send FCM push to topic
        fcmService.sendPushToTopic(topic, title, body, data);
    }
}
