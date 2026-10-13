
package com.campusqueue.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.campusqueue.backend.entity.QueueToken;

public interface QueueTokenRepository extends JpaRepository<QueueToken, Long> {
}
