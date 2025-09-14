import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

const ServiceStatus = () => {
  const [serviceStatus, setServiceStatus] = useState<'checking' | 'available' | 'unavailable'>('checking');

  useEffect(() => {
    checkServiceStatus();
  }, []);

  const checkServiceStatus = async () => {
    setServiceStatus('checking');
    
    try {
      const apiUrl = process.env.NODE_ENV === 'production' 
        ? '/api/gemini'
        : 'http://localhost:3000/api/gemini';

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          prompt: 'Test connection' 
        }),
      });

      // Even if the request fails due to invalid prompt, if we get a response
      // it means the service is available
      setServiceStatus('available');
    } catch (error) {
      console.error('Service status check failed:', error);
      setServiceStatus('unavailable');
    }
  };

  const getStatusDisplay = () => {
    switch (serviceStatus) {
      case 'checking':
        return (
          <Badge variant="secondary" className="flex items-center gap-2">
            <Loader2 className="h-3 w-3 animate-spin" />
            Checking Service
          </Badge>
        );
      case 'available':
        return (
          <Badge variant="default" className="flex items-center gap-2 bg-green-500 hover:bg-green-600">
            <CheckCircle className="h-3 w-3" />
            Service Available
          </Badge>
        );
      case 'unavailable':
        return (
          <Badge variant="destructive" className="flex items-center gap-2">
            <XCircle className="h-3 w-3" />
            Service Unavailable
          </Badge>
        );
    }
  };

  return (
    <div className="flex items-center gap-3">
      {getStatusDisplay()}
      <Button 
        variant="outline" 
        size="sm"
        onClick={checkServiceStatus}
        disabled={serviceStatus === 'checking'}
        className="text-xs"
      >
        Refresh Status
      </Button>
    </div>
  );
};

export default ServiceStatus;
