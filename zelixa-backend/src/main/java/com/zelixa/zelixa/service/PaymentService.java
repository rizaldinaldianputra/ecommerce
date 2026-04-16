package com.zelixa.zelixa.service;

import com.midtrans.Config;
import com.zelixa.zelixa.entity.Order;
import com.zelixa.zelixa.entity.OrderItem;
import com.zelixa.zelixa.entity.User;
import com.zelixa.zelixa.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONObject;
import com.midtrans.httpclient.error.MidtransError;
import com.midtrans.service.MidtransSnapApi;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentService {

    private final Config midtransConfiguration;
    private final UserRepository userRepository;

    public void createTransaction(Order order) {
        try {
            Map<String, Object> params = new HashMap<>();

            Map<String, String> transactionDetails = new HashMap<>();
            transactionDetails.put("order_id", order.getOrderNumber());
            transactionDetails.put("gross_amount", String.valueOf(order.getTotalAmount().intValue()));
            params.put("transaction_details", transactionDetails);

            List<Map<String, Object>> itemDetailsList = new ArrayList<>();
            if (order.getItems() != null) {
                for (com.zelixa.zelixa.entity.OrderItem item : order.getItems()) {
                    Map<String, Object> itemDetail = new HashMap<>();
                    itemDetail.put("id", String.valueOf(item.getProductId()));
                    itemDetail.put("price", item.getPrice().longValue());
                    itemDetail.put("quantity", item.getQuantity());
                    itemDetail.put("name", item.getProductName() != null ? item.getProductName() : "Product");
                    itemDetailsList.add(itemDetail);
                }
            }
            params.put("item_details", itemDetailsList);

            if (order.getShippingAmount() != null && order.getShippingAmount() > 0) {
                Map<String, Object> shippingDetail = new HashMap<>();
                shippingDetail.put("id", "SHIPPING");
                shippingDetail.put("price", order.getShippingAmount().longValue());
                shippingDetail.put("quantity", 1);
                shippingDetail.put("name", "Shipping Cost ("
                        + (order.getShippingService() != null ? order.getShippingService() : "Regular") + ")");
                itemDetailsList.add(shippingDetail);
            }

            com.zelixa.zelixa.entity.User user = userRepository.findById(order.getUserId()).orElse(null);
            if (user != null) {
                Map<String, String> customerDetails = new HashMap<>();
                customerDetails.put("first_name", user.getFullName() != null ? user.getFullName() : "Customer");
                customerDetails.put("email", user.getEmail());
                params.put("customer_details", customerDetails);
            }

            Map<String, Object> expiry = new HashMap<>();
            expiry.put("start_time", java.time.format.DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss Z")
                    .format(java.time.ZonedDateTime.now().plusMinutes(1)));
            expiry.put("duration", 24);
            expiry.put("unit", "hours");
            params.put("expiry", expiry);

            String frontendUrl = System.getenv("FRONTEND_URL");
            if (frontendUrl == null)
                frontendUrl = "http://localhost:3000";
            if (frontendUrl.endsWith("/"))
                frontendUrl = frontendUrl.substring(0, frontendUrl.length() - 1);

            Map<String, String> callbacks = new HashMap<>();
            callbacks.put("finish", frontendUrl + "/payment/finish");
            callbacks.put("unfinish", frontendUrl + "/payment/unfinish");
            callbacks.put("error", frontendUrl + "/payment/error");
            params.put("callbacks", callbacks);

            log.info("Creating Midtrans transaction for order: {} with params: {}", order.getOrderNumber(), params);
            com.midtrans.service.MidtransSnapApi snapApi = new com.midtrans.ConfigFactory(midtransConfiguration)
                    .getSnapApi();
            JSONObject result = snapApi.createTransaction(params);

            log.info("Midtrans transaction result for order {}: {}", order.getOrderNumber(), result.toString());

            if (result.has("token")) {
                order.setPaymentToken(result.getString("token"));
            }
            if (result.has("redirect_url")) {
                order.setPaymentUrl(result.getString("redirect_url"));
            }

        } catch (MidtransError e) {
            log.error("Failed to generate Midtrans transaction for order {}", order.getOrderNumber(), e);
        } catch (Exception e) {
            log.error("Unexpected error generating Midtrans transaction", e);
        }
    }
}
