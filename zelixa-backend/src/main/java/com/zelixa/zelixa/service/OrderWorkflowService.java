package com.zelixa.zelixa.service;

import com.zelixa.zelixa.entity.Order;
import lombok.RequiredArgsConstructor;
import org.camunda.bpm.engine.RuntimeService;
import org.camunda.bpm.engine.TaskService;
import org.camunda.bpm.engine.task.Task;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderWorkflowService {

    private final RuntimeService runtimeService;
    private final TaskService taskService;

    public void startOrderProcess(Order order, String customerUsername) {
        Map<String, Object> variables = new HashMap<>();
        variables.put("orderId", order.getId());
        variables.put("orderNumber", order.getOrderNumber());
        variables.put("customerUsername", customerUsername);

        runtimeService.startProcessInstanceByKey("order-process", String.valueOf(order.getId()), variables);
    }

    public List<Map<String, Object>> getAdminTasks() {
        return taskService.createTaskQuery()
                .taskCandidateGroup("ADMIN")
                .list()
                .stream()
                .map(this::mapTaskToMap)
                .collect(Collectors.toList());
    }

    public List<Map<String, Object>> getTasksByGroups(List<String> groups) {
        if (groups == null || groups.isEmpty())
            return List.of();
        return taskService.createTaskQuery()
                .taskCandidateGroupIn(groups)
                .list()
                .stream()
                .map(this::mapTaskToMap)
                .collect(Collectors.toList());
    }

    public List<Map<String, Object>> getUserTasks(String username) {
        return taskService.createTaskQuery()
                .taskAssignee(username)
                .list()
                .stream()
                .map(this::mapTaskToMap)
                .collect(Collectors.toList());
    }

    public void completeTask(String taskId, Map<String, Object> variables) {
        taskService.complete(taskId, variables);
    }

    private Map<String, Object> mapTaskToMap(Task task) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", task.getId());
        map.put("name", task.getName());
        map.put("processInstanceId", task.getProcessInstanceId());
        map.put("createTime", task.getCreateTime());
        map.put("variables", taskService.getVariables(task.getId()));
        return map;
    }
}
