package com.shekza.shekza.delegate;

import com.shekza.shekza.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.springframework.stereotype.Component;

@Component("updateOrderStatusDelegate")
@RequiredArgsConstructor
public class UpdateOrderStatusDelegate implements JavaDelegate {

    private final OrderService orderService;

    @Override
    public void execute(DelegateExecution execution) throws Exception {
        Long orderId = (Long) execution.getVariable("orderId");
        String currentActivityId = execution.getCurrentActivityId();
        
        if ("Activity_NotifyDelivering".equals(currentActivityId)) {
            String trackingNumber = (String) execution.getVariable("trackingNumber");
            orderService.updateTrackingNumber(orderId, trackingNumber);
        }
        
        // You can add more logic here based on activity or custom variables
    }
}
