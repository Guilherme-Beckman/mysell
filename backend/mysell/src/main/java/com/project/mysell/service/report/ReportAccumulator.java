package com.project.mysell.service.report;

import com.project.mysell.dto.report.SaleInformation;

public class ReportAccumulator {
	    private Double profit = 0.0;
	    private Double grossRevenue = 0.0;
	    private Long saleCount = 0L;

	    public ReportAccumulator accumulate(SaleInformation saleData) {
	        this.profit += saleData.profit();
	        this.grossRevenue += saleData.grossRevenue();
	        this.saleCount += saleData.saleCount();
	        return this;
	    }

	    public Double getProfit() {
	        return profit;
	    }

	    public Double getGrossRevenue() {
	        return grossRevenue;
	    }

	    public Long getSaleCount() {
	        return saleCount;
	    }
	}