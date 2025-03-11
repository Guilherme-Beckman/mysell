package com.project.mysell.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project.mysell.service.ReportService;
@RestController
@RequestMapping("/report")
public class ReportController {
	private ReportService reportService;
}
