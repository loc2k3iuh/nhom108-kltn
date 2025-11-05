package iuh.fit.se;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class KltnBackendApplication {

  public static void main(String[] args) {
    SpringApplication.run(KltnBackendApplication.class, args);
  }
}
