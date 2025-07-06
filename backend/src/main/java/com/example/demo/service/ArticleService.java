package com.example.demo.service;

import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.model.Article;
import com.example.demo.model.Like;
import com.example.demo.model.User;
import com.example.demo.repository.ArticleRepository;
import com.example.demo.repository.LikeRepository;
import com.example.demo.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ArticleService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ArticleRepository articleRepository;
    @Autowired
    private LikeRepository likeRepository;

    // Updated to support pagination
    public Page<Article> getAllArticles(Pageable pageable) {
        return articleRepository.findAll(pageable);
    }

    public List<Article> getAllArticles() {
        return articleRepository.findAll();
    }

    public Optional<Article> getArticleById(Long id) {
        return articleRepository.findById(id);
    }

    public Optional<Article> getArticleBySlug(String slug) {
        return articleRepository.findBySlug(slug);
    }

    public Page<Article> getArticlesByUserId(Long userId, Pageable pageable) {
        return articleRepository.findByAuthor_Id(userId, pageable);
    }

    // New method to get articles by username with pagination
    public Page<Article> getArticlesByUsername(String username, Pageable pageable) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
        return articleRepository.findByAuthor_Id(user.getId(), pageable);
    }

    // New method to get articles by username without pagination
    public List<Article> getArticlesByUsername(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
        return articleRepository.findByAuthor(user);
    }

    public Article saveArticle(Article article) {
        return articleRepository.save(article);
    }

    public void deleteArticle(Long id) {
        Article article = articleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Article", "id", id));
        articleRepository.delete(article);
    }

    public List<Article> getArticlesByUser(User user) {
        return articleRepository.findByAuthor(user);
    }

    public boolean existsBySlug(String slug) {
        return articleRepository.existsBySlug(slug);
    }

    public Optional<Article> toggleLike(Long articleId, String username) {
        Article article = articleRepository.findById(articleId)
                .orElseThrow(() -> new ResourceNotFoundException("Article not found"));
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Optional<Like> existingLike = likeRepository.findByUserAndArticle(user, article);
        if (existingLike.isPresent()) {
            likeRepository.delete(existingLike.get());
        } else {
            Like like = new Like();
            like.setArticle(article);
            like.setUser(user);
            likeRepository.save(like);
        }

        return Optional.of(article);
    }

    public boolean hasUserLiked(Long articleId, String username) {
        try {
            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new UsernameNotFoundException("User not found"));
            Article article = articleRepository.findById(articleId)
                    .orElseThrow(() -> new EntityNotFoundException("Article not found"));

            // Use the corrected existsByUserAndArticle method
            return likeRepository.existsByUserAndArticle(user, article);
        } catch (Exception e) {
            // If user not found or any error, return false
            return false;
        }
    }

    public long countLikes(Long articleId) {
        Article article = articleRepository.findById(articleId)
                .orElseThrow(() -> new EntityNotFoundException("Article not found"));
        return likeRepository.countByArticle(article);
    }
}