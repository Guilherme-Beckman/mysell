package com.project.mysell.dto;

import java.sql.Date;
import java.sql.Time;
import java.util.UUID;

public record EventUpdateDTO (
		String name,
		Date date,
		Time time,
		String color,
		boolean favorite
		){
	
}
