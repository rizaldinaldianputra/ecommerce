package com.zelixa.zelixa.controller;

import com.zelixa.zelixa.entity.User;
import com.zelixa.zelixa.repository.UserRepository;
import com.zelixa.zelixa.service.OrderWorkflowService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/workflow/orders")
@RequiredArgsConstructor
public class OrderWorkflowController {

    private final OrderWorkflowService workflowService;
    private final UserRepository userRepository;

    @GetMapping("/tasks/admin")
    public ResponseEntity<List<Map<String, Object>>> getAdminTasks(Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.ok(new ArrayList<>());
        }
        User user = userRepository.findByEmail(authentication.getName()).orElse(null);
        List<String> groups = new ArrayList<>();
        if (user != null && user.getTaskGroup() != null) {
            groups.add(user.getTaskGroup());
        }
        // Also include generic ADMIN group for now if they have ROLE_ADMIN
        groups.add("ADMIN");

        return ResponseEntity.ok(workflowService.getTasksByGroups(groups));
    }

    @GetMapping("/tasks/user")
    public ResponseEntity<List<Map<String, Object>>> getUserTasks(Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.ok(new ArrayList<>());
        }
        return ResponseEntity.ok(workflowService.getUserTasks(authentication.getName()));
    }

    @PostMapping("/tasks/{taskId}/complete")
    public ResponseEntity<Void> completeTask(
            @PathVariable String taskId,
            @RequestBody Map<String, Object> variables) {
        workflowService.completeTask(taskId, variables);
        return ResponseEntity.ok().build();
    }
}
