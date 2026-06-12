import type { Request, Response } from 'express';
import { prisma } from '../../../lib/prisma.js';

export const seedHotspots = async (_req: Request, res: Response) => {
  try {
    const hotspots = [
      // North Delhi - High risk area
      { zone_id: 'zone_north', area: 'North Delhi Central', lat: 28.7100, lng: 77.1150, predicted_calls: 25, risk_score: 8.5, risk_class: 'critical' },
      { zone_id: 'zone_north', area: 'North Delhi Ext', lat: 28.7200, lng: 77.1100, predicted_calls: 18, risk_score: 7.2, risk_class: 'high' },
      
      // East Delhi - Medium-High risk
      { zone_id: 'zone_east', area: 'East Delhi Main', lat: 28.5900, lng: 77.3200, predicted_calls: 16, risk_score: 6.8, risk_class: 'high' },
      { zone_id: 'zone_east', area: 'East Delhi Submarket', lat: 28.5850, lng: 77.3150, predicted_calls: 12, risk_score: 5.5, risk_class: 'medium' },
      
      // South Delhi - Low-Medium risk
      { zone_id: 'zone_south', area: 'South Delhi Kalkaji', lat: 28.5190, lng: 77.2300, predicted_calls: 14, risk_score: 6.0, risk_class: 'medium' },
      { zone_id: 'zone_south', area: 'South Delhi Chattarpur', lat: 28.5100, lng: 77.2250, predicted_calls: 10, risk_score: 4.8, risk_class: 'low' },
      
      // West Delhi - High risk
      { zone_id: 'zone_west', area: 'West Delhi Dwarka', lat: 28.6500, lng: 76.9800, predicted_calls: 22, risk_score: 7.8, risk_class: 'high' },
      { zone_id: 'zone_west', area: 'West Delhi Palam', lat: 28.6400, lng: 76.9900, predicted_calls: 17, risk_score: 6.5, risk_class: 'high' },
      
      // Central Delhi - Critical
      { zone_id: 'zone_central', area: 'Central Delhi Old Delhi', lat: 28.6300, lng: 77.2300, predicted_calls: 32, risk_score: 9.2, risk_class: 'critical' },
      { zone_id: 'zone_central', area: 'Central Delhi New Delhi', lat: 28.6250, lng: 77.2250, predicted_calls: 28, risk_score: 8.8, risk_class: 'critical' },
      
      // Noida - Medium risk
      { zone_id: 'zone_noida', area: 'Noida Sector 1', lat: 28.5355, lng: 77.3910, predicted_calls: 15, risk_score: 6.2, risk_class: 'medium' },
      { zone_id: 'zone_noida', area: 'Noida City Center', lat: 28.5400, lng: 77.3950, predicted_calls: 19, risk_score: 7.0, risk_class: 'high' },
      
      // Gurgaon - Low-Medium risk
      { zone_id: 'zone_gurgaon', area: 'Gurgaon Sector 37', lat: 28.4595, lng: 77.0266, predicted_calls: 11, risk_score: 5.3, risk_class: 'medium' },
      { zone_id: 'zone_gurgaon', area: 'Gurgaon Cyber City', lat: 28.4650, lng: 77.0300, predicted_calls: 13, risk_score: 5.8, risk_class: 'medium' },
      
      // Ghaziabad - High risk
      { zone_id: 'zone_ghaziabad', area: 'Ghaziabad Indirapuram', lat: 28.6692, lng: 77.4538, predicted_calls: 20, risk_score: 7.5, risk_class: 'high' },
      { zone_id: 'zone_ghaziabad', area: 'Ghaziabad City Center', lat: 28.6750, lng: 77.4600, predicted_calls: 16, risk_score: 6.8, risk_class: 'high' },
      
      // Faridabad - Low risk
      { zone_id: 'zone_faridabad', area: 'Faridabad Main', lat: 28.4089, lng: 77.3178, predicted_calls: 9, risk_score: 4.2, risk_class: 'low' },
      { zone_id: 'zone_faridabad', area: 'Faridabad NIT', lat: 28.4150, lng: 77.3250, predicted_calls: 8, risk_score: 4.0, risk_class: 'low' },
    ];

    // Clear existing hotspots
    await prisma.hotspot.deleteMany({});

    // Create new hotspots
    for (const hotspot of hotspots) {
      await prisma.hotspot.create({
        data: {
          zone_id: hotspot.zone_id,
          area: hotspot.area,
          lat: hotspot.lat,
          lng: hotspot.lng,
          predicted_calls: hotspot.predicted_calls,
          risk_score: hotspot.risk_score,
          risk_class: hotspot.risk_class,
          timestamp: new Date(),
        },
      });
    }

    res.status(200).json({ 
      msg: `hotspots seeded - ${hotspots.length} hotspots created`,
      count: hotspots.length
    });
  } catch (err) {
    console.error('Seeding error:', err);
    res.status(500).json({ error: 'Failed to seed hotspots' });
  }
};
