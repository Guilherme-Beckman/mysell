package com.project.mysell.dto.auth.email;

import java.time.Duration;

public record SucessSendEmailDTO(
		String sucessMessage,
		Duration timeValidCode
		) {

}
