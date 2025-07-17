package com.project.mysell.model;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

import com.project.mysell.dto.event.EventDTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Table("events")
@Data
@AllArgsConstructor
@NoArgsConstructor	
public class EventModel {
	@Id
	private Long eventsId;
	private String name;
	private LocalDate date;
	private LocalTime time;
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
