package com.zelixa.zelixa.config;

import com.midtrans.Config;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class MidtransConfig {

    @Value("${app.midtrans.server-key}")
    private String serverKey;

    @Value("${app.midtrans.client-key}")
    private String clientKey;

    @Value("${app.midtrans.is-production:false}")
    private boolean isProduction;

    @Bean
    public Config midtransConfiguration() {
        return Config.builder()
                .setIsProduction(isProduction)
                .setServerKey(serverKey)
                .setClientKey(clientKey)
                .build();
    }
}
