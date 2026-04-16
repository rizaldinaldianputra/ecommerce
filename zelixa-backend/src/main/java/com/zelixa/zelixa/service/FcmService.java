package com.zelixa.zelixa.service;

import com.google.firebase.messaging.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@Slf4j
public class FcmService {

    public void sendPushToToken(String token, String title, String body, Map<String, String> data) {
        if (token == null || token.isEmpty()) {
            log.warn("FCM token is empty, skipping push notification: {}", title);
            return;
        }

        try {
            Message message = Message.builder()
                    .setToken(token)
                    .setNotification(Notification.builder()
                            .setTitle(title)
                            .setBody(body)
                            .build())
                    .putAllData(data)
                    .build();

            FirebaseMessaging.getInstance().send(message);
            log.info("Push notification sent to token: {}", title);
        } catch (FirebaseMessagingException e) {
            log.error("Failed to send FCM push to token: {}", title, e);
        }
    }

    public void sendPushToTopic(String topic, String title, String body, Map<String, String> data) {
        try {
            Message message = Message.builder()
                    .setTopic(topic)
                    .setNotification(Notification.builder()
                            .setTitle(title)
                            .setBody(body)
                            .build())
                    .putAllData(data)
                    .build();

            FirebaseMessaging.getInstance().send(message);
            log.info("Push notification sent to topic {}: {}", topic, title);
        } catch (FirebaseMessagingException e) {
            log.error("Failed to send FCM push to topic {}: {}", topic, title, e);
        }
    }
}
