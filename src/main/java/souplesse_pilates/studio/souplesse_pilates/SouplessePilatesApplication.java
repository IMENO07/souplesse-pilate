package souplesse_pilates.studio.souplesse_pilates;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class SouplessePilatesApplication {

	public static void main(String[] args) {
		SpringApplication.run(SouplessePilatesApplication.class, args);
	}

}
