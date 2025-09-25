package iuh.fit.se.repositories;

import iuh.fit.se.entities.MessageContent;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MessageContentRepository extends JpaRepository<MessageContent, UUID> {}
