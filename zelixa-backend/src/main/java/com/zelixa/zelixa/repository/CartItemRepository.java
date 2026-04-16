package com.zelixa.zelixa.repository;

import com.zelixa.zelixa.entity.CartItem;
import com.zelixa.zelixa.entity.ProductVariant;
import com.zelixa.zelixa.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    List<CartItem> findByUser(User user);

    Optional<CartItem> findByUserAndProductVariant(User user, ProductVariant productVariant);

    void deleteByUser(User user);
}
