import React from 'react';
import { EnhancedServiceHistory } from '@/components/EnhancedServiceHistory';

export default function MaintenanceScreen() {
  return (
    <EnhancedServiceHistory 
      vesselName="M/Y Seahawk"
      onServiceUpdated={(services) => {
        console.log('Service records updated:', services.length);
      }}
    />
  );
}