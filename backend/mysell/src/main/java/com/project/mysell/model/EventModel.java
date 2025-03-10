package com.project.mysell.model;

import java.sql.Date;
import java.sql.Time;
import java.util.UUID;

import org.springframework.data.relational.core.mapping.Table;

import com.project.mysell.dto.EventDTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Table("events")
@Data
@AllArgsConstructor
@NoArgsConstructor	
public class EventModel {
	private Long eventsId;
	private String name;
	private Date date;
	private Time time;
	private String color;
	private boolean favorite;
	private UUID userId;
	public EventModel(EventDTO eventDTO) {
		this.name = eventDTO.name();
		this.date = eventDTO.date();
		this.time = eventDTO.time();
		this.color = eventDTO.color();
		this.favorite = eventDTO.favorite();
	}
	
	
	
}
