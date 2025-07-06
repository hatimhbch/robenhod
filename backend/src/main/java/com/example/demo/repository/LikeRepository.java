package com.example.demo.repository;

import com.example.demo.model.Article;
import com.example.demo.model.Like;
import com.example.demo.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

public interface LikeRepository extends JpaRepository<Like, Long> {

    Optional<Like> findByUserAndArticle(User user, Article article);

    long countByArticle(Article article);

    // Fixed: This should return boolean, not Optional<Like>
    boolean existsByUserAndArticle(User user, Article article);

    // Fixed: Delete method should be transactional and return void or int
    @Modifying
    @Transactional
    @Query("DELETE FROM Like l WHERE l.user = :user AND l.article = :article")
    void deleteByUserAndArticle(@Param("user") User user, @Param("article") Article article);

}