package com.project.mysell.service.product.barcode;

import org.springframework.boot.context.properties.ConfigurationProperties;

import lombok.Data;

@ConfigurationProperties(prefix = "api.product.barcode")
@Data
public class APIProductBarCodeProperties {
	private String url = "";
	private String token = "";
	private String header = "";
}
