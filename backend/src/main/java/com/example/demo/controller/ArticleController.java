package com.example.demo.controller;

import com.example.demo.model.Article;
import com.example.demo.model.User;
import com.example.demo.payload.request.ArticleRequest;
import com.example.demo.payload.response.ArticleResponse;
import com.example.demo.service.ArticleService;
import com.example.demo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/articles")
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000"},
        allowedHeaders = "*",
        methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS},
        allowCredentials = "true")
public class ArticleController {

    @Autowired
    private ArticleService articleService;

    @Autowired
    private UserService userService;

    @GetMapping
    public ResponseEntity<?> getAllArticles(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Authentication authentication) {

        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Article> articles = articleService.getAllArticles(pageable);

        // Convert to response DTOs with like status
        Page<ArticleResponse> articleResponses = articles.map(article ->
                convertToResponse(article, authentication)
        );

        return ResponseEntity.ok(articleResponses);
    }

    @PostMapping
    public ResponseEntity<?> createArticle(
            @Valid @RequestBody ArticleRequest articleRequest,
            Authentication authentication) {

        if (authentication == null) {
            return ResponseEntity.status(401).body("Authentication required");
        }

        try {
            String username = authentication.getName();
            User author = userService.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // Check if slug already exists
            if (articleService.existsBySlug(articleRequest.getSlug())) {
                return ResponseEntity.badRequest().body("Article with this slug already exists");
            }

            Article article = new Article();
            article.setTitle(articleRequest.getTitle());
            article.setDescription(articleRequest.getDescription());
            article.setContent(articleRequest.getContent());
            article.setSlug(articleRequest.getSlug());
            article.setImageUrl(articleRequest.getImageUrl());
            article.setAuthor(author);
            article.setCreatedAt(LocalDateTime.now());

            Article savedArticle = articleService.saveArticle(article);
            ArticleResponse response = convertToResponse(savedArticle, authentication);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error creating article: " + e.getMessage());
        }
    }

    @GetMapping("/slug/{slug}")
    public ResponseEntity<?> getArticleBySlug(
            @PathVariable String slug,
            Authentication authentication) {

        Optional<Article> article = articleService.getArticleBySlug(slug);
        if (article.isPresent()) {
            ArticleResponse response = convertToResponse(article.get(), authentication);
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getArticleById(
            @PathVariable Long id,
            Authentication authentication) {

        Optional<Article> article = articleService.getArticleById(id);
        if (article.isPresent()) {
            ArticleResponse response = convertToResponse(article.get(), authentication);
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/{articleId}/likes")
    public ResponseEntity<?> toggleLike(
            @PathVariable Long articleId,
            Authentication authentication) {

        if (authentication == null) {
            return ResponseEntity.status(401).body("Authentication required");
        }

        String username = authentication.getName();
        Optional<Article> article = articleService.toggleLike(articleId, username);

        if (article.isPresent()) {
            ArticleResponse response = convertToResponse(article.get(), authentication);
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/user/{username}")
    public ResponseEntity<?> getArticlesByUsername(
            @PathVariable String username,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Authentication authentication) {

        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Article> articles = articleService.getArticlesByUsername(username, pageable);

        Page<ArticleResponse> articleResponses = articles.map(article ->
                convertToResponse(article, authentication)
        );

        return ResponseEntity.ok(articleResponses);
    }

    @GetMapping("/user")
    public ResponseEntity<?> getCurrentUserArticles(Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(401).body("Authentication required");
        }

        String username = authentication.getName();
        List<Article> articles = articleService.getArticlesByUsername(username);

        List<ArticleResponse> articleResponses = articles.stream()
                .map(article -> convertToResponse(article, authentication))
                .collect(Collectors.toList());

        return ResponseEntity.ok(articleResponses);
    }

    // Helper method to convert Article to ArticleResponse with proper hashLiked value
    private ArticleResponse convertToResponse(Article article, Authentication authentication) {
        ArticleResponse response = new ArticleResponse();
        response.setId(article.getId());
        response.setTitle(article.getTitle());
        response.setDescription(article.getDescription());
        response.setSlug(article.getSlug());
        response.setContent(article.getContent());
        response.setImageUrl(article.getImageUrl());
        response.setCreatedAt(article.getCreatedAt());
        response.setAuthorUsername(article.getAuthor().getUsername());
        response.setAuthorId(article.getAuthor().getId());
        response.setLikeCount(articleService.countLikes(article.getId()));

        // Set hashLiked based on current user's like status
        if (authentication != null) {
            String username = authentication.getName();
            response.setHashLiked(articleService.hasUserLiked(article.getId(), username));
        } else {
            response.setHashLiked(false);
        }

        return response;
    }
} 