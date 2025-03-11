package com.project.mysell.dto;

import java.sql.Date;
import java.sql.Time;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

public record EventUpdateDTO (
		String name,
		LocalDate date,
		LocalTime time,
		String color,
		boolean favorite
		){
	
}
