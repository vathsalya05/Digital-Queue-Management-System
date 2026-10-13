
package com.campusqueue.backend.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.campusqueue.backend.entity.QueueToken;
import com.campusqueue.backend.repository.QueueTokenRepository;

@RestController
@RequestMapping("/api/queue")
@CrossOrigin(origins = {"http://localhost:5173", "http://127.0.0.1:5173"})
public class QueueTokenController {

    private final QueueTokenRepository repository;

    public QueueTokenController(QueueTokenRepository repository) {
        this.repository = repository;
    }

    @PostMapping("/book")
    public QueueToken bookToken(@RequestBody QueueToken token) {
        token.setStatus("WAITING");
        token.setTokenNumber("Q-" + System.currentTimeMillis() % 100000);
        return repository.save(token);
    }

    @GetMapping
    public List<QueueToken> getAllTokens() {
        return repository.findAll();
    }

    @GetMapping("/{id}")
    public QueueToken getToken(@PathVariable Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Queue token not found"));
    }
}
