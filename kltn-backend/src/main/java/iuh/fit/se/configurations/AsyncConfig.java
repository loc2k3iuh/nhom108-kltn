package iuh.fit.se.configurations;

import java.util.concurrent.Executor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

@Configuration
@EnableAsync
public class AsyncConfig {

  @Bean(name = "emailTaskExecutor")
  public Executor emailTaskExecutor() {
    ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
    executor.setCorePoolSize(5); // Số thread tối thiểu
    executor.setMaxPoolSize(10); // Số thread tối đa
    executor.setQueueCapacity(100); // Số task tối đa trong queue
    executor.setThreadNamePrefix("EmailAsync-");
    executor.setWaitForTasksToCompleteOnShutdown(true);
    executor.setAwaitTerminationSeconds(60);
    executor.initialize();
    return executor;
  }
}

