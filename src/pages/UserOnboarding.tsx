
import React from 'react';

const UserOnboardingPage: React.FC = () => {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">User Onboarding</h1>
      <p className="mb-4">
        Welcome to Bharat CRM! This feature is currently under maintenance.
      </p>
      
      <div className="p-4 bg-muted rounded-lg">
        <h2 className="text-lg font-medium mb-2">Onboarding Status</h2>
        <p>
          The onboarding feature will be available soon. Thank you for your patience.
        </p>
      </div>
    </div>
  );
};

export default UserOnboardingPage;
