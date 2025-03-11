package com.project.mysell.dto.event;

import java.time.LocalDate;
import java.time.LocalTime;

public record EventDTO (
		String name,
		LocalDate date,
		LocalTime time,
		String color,
		boolean favorite
		){
	
}
