package iuh.fit.se.repositories;

import iuh.fit.se.entities.MessageRoom;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MessageRoomRepository extends JpaRepository<MessageRoom, UUID> {}
