'use client';

import React, { useState, useEffect } from 'react';
import { FirebaseApp } from 'firebase/app';
import { Firestore } from 'firebase/firestore';
import { Auth } from 'firebase/auth';
import { initializeFirebase } from './index';
import { FirebaseProvider } from './provider';

export function FirebaseClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // Use state to hold the initialized instances, ensuring they only exist on the client
  const [instances, setInstances] = useState<{
    app: FirebaseApp | null;
    db: Firestore | null;
    auth: Auth | null;
  } | null>(null);

  useEffect(() => {
    // This function calls initializeApp, which must only run in the browser
    const initialized = initializeFirebase();
    setInstances(initialized);
  }, []);

  // During SSR and initial hydration, we render the children within the provider
  // with null values. Once the client-side useEffect runs, the context updates.
  return (
    <FirebaseProvider 
      firebaseApp={instances?.app || null} 
      firestore={instances?.db || null} 
      auth={instances?.auth || null}
    >
      {children}
    </FirebaseProvider>
  );
}
