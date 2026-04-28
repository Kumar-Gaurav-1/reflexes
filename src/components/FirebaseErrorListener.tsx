'use client';

import { useEffect } from 'react';
import { errorEmitter } from '@/firebase/error-emitter';
import { useToast } from '@/hooks/use-toast';

export function FirebaseErrorListener() {
  const { toast } = useToast();

  useEffect(() => {
    const handlePermissionError = (error: any) => {
      // In a real pro-grade app, we surface this to the dev overlay
      // but here we use a clean toast for production-ready feel
      toast({
        variant: "destructive",
        title: "Session Synchronicity Alert",
        description: "Your training data couldn't be synced. Please check your network and try again.",
      });
      
      // Log for developer context in development mode
      if (process.env.NODE_ENV === 'development') {
        console.error(error.message);
      }
    };

    errorEmitter.on('permission-error', handlePermissionError);
    return () => {
      errorEmitter.off('permission-error', handlePermissionError);
    };
  }, [toast]);

  return null;
}
