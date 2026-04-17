package org.hackathon21.backend.service;

import org.hackathon21.backend.dto.request.CreateTaskRequest;
import org.hackathon21.backend.dto.request.PatchTaskRequest;
import org.hackathon21.backend.dto.response.TaskResponse;
import org.hackathon21.backend.entity.Task;
import org.hackathon21.backend.entity.Team;
import org.hackathon21.backend.entity.User;
import org.hackathon21.backend.enums.TaskStatus;
import org.hackathon21.backend.repository.TaskRepository;
import org.hackathon21.backend.repository.TeamRepository;
import org.hackathon21.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final TeamRepository teamRepository;

    @Transactional(readOnly = true)
    public List<TaskResponse> listTasks(UUID teamId, UUID userId) {
        assertMemberOfTeam(teamId, userId);
        return taskRepository.findByTeamIdOrderByStatusAscPositionAsc(teamId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public TaskResponse createTask(UUID teamId, UUID userId, CreateTaskRequest request) {
        assertMemberOfTeam(teamId, userId);
        int position = nextPosition(teamId, TaskStatus.pending_approval);
        Task task = Task.builder()
                .teamId(teamId)
                .title(request.getTitle().trim())
                .description(request.getDescription())
                .deadline(request.getDeadline())
                .createdBy(userId)
                .status(TaskStatus.pending_approval)
                .position(position)
                .build();
        task = taskRepository.save(task);
        return toResponse(task);
    }

    @Transactional
    public TaskResponse patchTask(UUID taskId, UUID userId, PatchTaskRequest req) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));
        assertMemberOfTeam(task.getTeamId(), userId);
        Team team = teamRepository.findById(task.getTeamId())
                .orElseThrow(() -> new RuntimeException("Team not found"));

        if (req.getTitle() != null) {
            String t = req.getTitle().trim();
            if (t.isEmpty()) {
                throw new RuntimeException("Title cannot be blank");
            }
            task.setTitle(t);
        }
        if (req.getDescription() != null) {
            task.setDescription(req.getDescription());
        }
        if (Boolean.TRUE.equals(req.getClearDeadline())) {
            task.setDeadline(null);
        } else if (req.getDeadline() != null) {
            task.setDeadline(req.getDeadline());
        }
        if (Boolean.TRUE.equals(req.getClearAssignee())) {
            task.setAssigneeId(null);
        } else if (req.getAssigneeId() != null) {
            assertMemberOfTeam(task.getTeamId(), req.getAssigneeId());
            task.setAssigneeId(req.getAssigneeId());
        }

        boolean statusChanged = req.getStatus() != null && req.getStatus() != task.getStatus();
        if (statusChanged) {
            applyStatusTransition(task, userId, team, req.getStatus());
        } else if (req.getPosition() != null) {
            task.setPosition(req.getPosition());
        }

        task = taskRepository.save(task);
        return toResponse(task);
    }

    @Transactional
    public void deleteTask(UUID taskId, UUID userId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));
        assertMemberOfTeam(task.getTeamId(), userId);
        taskRepository.delete(task);
    }

    private void applyStatusTransition(Task task, UUID userId, Team team, TaskStatus next) {
        TaskStatus cur = task.getStatus();
        if (cur == TaskStatus.pending_approval) {
            if (next == TaskStatus.todo) {
                if (!team.getCaptainId().equals(userId)) {
                    throw new RuntimeException("only captain can approve tasks");
                }
                task.setStatus(TaskStatus.todo);
                task.setPosition(nextPosition(task.getTeamId(), TaskStatus.todo));
                return;
            }
            throw new RuntimeException("forbidden: invalid transition from pending_approval");
        }
        if (next == TaskStatus.pending_approval) {
            throw new RuntimeException("forbidden: cannot return task to pending_approval");
        }
        if (cur != next) {
            task.setStatus(next);
            task.setPosition(nextPosition(task.getTeamId(), next));
        }
    }

    private int nextPosition(UUID teamId, TaskStatus status) {
        Integer max = taskRepository.findMaxPosition(teamId, status);
        return (max == null ? -1 : max) + 1;
    }

    private void assertMemberOfTeam(UUID teamId, UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        if (user.getTeamId() == null || !user.getTeamId().equals(teamId)) {
            throw new RuntimeException("forbidden: not a team member");
        }
    }

    private TaskResponse toResponse(Task task) {
        String assigneeName = null;
        if (task.getAssigneeId() != null) {
            assigneeName = userRepository.findById(task.getAssigneeId())
                    .map(User::getName)
                    .orElse(null);
        }
        return TaskResponse.builder()
                .id(task.getId())
                .teamId(task.getTeamId())
                .title(task.getTitle())
                .description(task.getDescription())
                .assigneeId(task.getAssigneeId())
                .assigneeName(assigneeName)
                .status(task.getStatus())
                .deadline(task.getDeadline())
                .createdBy(task.getCreatedBy())
                .position(task.getPosition())
                .createdAt(task.getCreatedAt())
                .build();
    }
}
