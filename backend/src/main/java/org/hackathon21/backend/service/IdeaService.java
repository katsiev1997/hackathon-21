package org.hackathon21.backend.service;

import org.hackathon21.backend.dto.request.CreateIdeaRequest;
import org.hackathon21.backend.dto.request.VoteRequest;
import org.hackathon21.backend.dto.response.IdeaResponse;
import org.hackathon21.backend.dto.response.VoteResponse;
import org.hackathon21.backend.entity.Idea;
import org.hackathon21.backend.entity.User;
import org.hackathon21.backend.entity.Vote;
import org.hackathon21.backend.enums.IdeaStatus;
import org.hackathon21.backend.repository.IdeaRepository;
import org.hackathon21.backend.repository.UserRepository;
import org.hackathon21.backend.repository.VoteRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class IdeaService {
    private final IdeaRepository ideaRepository;
    private final VoteRepository voteRepository;
    private final UserRepository userRepository;

    @Transactional
    public IdeaResponse createIdea(UUID userId, CreateIdeaRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Idea idea = Idea.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .authorId(userId)
                .status(IdeaStatus.draft)
                .build();

        idea = ideaRepository.save(idea);

        return buildIdeaResponse(idea);
    }

    public List<IdeaResponse> getIdeas(IdeaStatus status) {
        List<Idea> ideas = status != null
                ? ideaRepository.findByStatus(status)
                : ideaRepository.findAll();

        return ideas.stream()
                .map(this::buildIdeaResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public VoteResponse vote(UUID userId, UUID ideaId, VoteRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Idea idea = ideaRepository.findById(ideaId)
                .orElseThrow(() -> new RuntimeException("Idea not found"));

        if (idea.getAuthorId().equals(userId)) {
            throw new RuntimeException("Cannot vote for your own idea");
        }

        if (idea.getStatus() != IdeaStatus.voting) {
            throw new RuntimeException("Idea is not in voting status");
        }

        Vote vote = voteRepository.findByIdeaIdAndUserId(ideaId, userId)
                .orElse(Vote.builder()
                        .ideaId(ideaId)
                        .userId(userId)
                        .build());
        vote.setScore(request.getScore());
        voteRepository.save(vote);

        Double avgScore = voteRepository.getAverageScoreByIdeaId(ideaId);
        Long votesCount = voteRepository.countByIdeaId(ideaId);

        return VoteResponse.builder()
                .ideaId(ideaId)
                .avgScore(avgScore)
                .votesCount(votesCount)
                .build();
    }

    /**
     * Переводит идею из черновика в статус голосования. Доступно только автору.
     */
    @Transactional
    public IdeaResponse submitForVoting(UUID userId, UUID ideaId) {
        userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Idea idea = ideaRepository.findById(ideaId)
                .orElseThrow(() -> new RuntimeException("Idea not found"));

        boolean authorMatches = idea.getAuthorId().equals(userId);
        log.warn(
                "[submit-for-voting] ideaId={} status={} authorId={} currentUserId(JWT)={} authorMatches={}",
                ideaId,
                idea.getStatus(),
                idea.getAuthorId(),
                userId,
                authorMatches);

        if (!authorMatches) {
            throw new RuntimeException("forbidden: only author can submit idea for voting");
        }
        if (idea.getStatus() != IdeaStatus.draft) {
            throw new RuntimeException("Idea can only be submitted for voting from draft status");
        }

        idea.setStatus(IdeaStatus.voting);
        ideaRepository.save(idea);

        return buildIdeaResponse(idea);
    }

    private IdeaResponse buildIdeaResponse(Idea idea) {
        Double avgScore = voteRepository.getAverageScoreByIdeaId(idea.getId());
        Long votesCount = voteRepository.countByIdeaId(idea.getId());

        return IdeaResponse.builder()
                .id(idea.getId())
                .title(idea.getTitle())
                .description(idea.getDescription())
                .authorId(idea.getAuthorId())
                .status(idea.getStatus())
                .avgScore(avgScore)
                .votesCount(votesCount)
                .build();
    }
}
