
import React from 'react';
import { PhoneCall, Mail, MapPin } from "lucide-react";

const ContactFooter = () => {
  return (
    <footer className="text-center border-t pt-12 pb-8">
      <h3 className="text-2xl font-bold mb-6">MediaBoost</h3>
      <div className="space-y-3 text-gray-600">
        <p className="flex items-center justify-center">
          <MapPin className="h-5 w-5 mr-2" />
          21151 S Western Ave. Torrance, CA 90501
        </p>
        <p className="flex items-center justify-center">
          <Mail className="h-5 w-5 mr-2" />
          info@bookedimpact.com
        </p>
        <p className="flex items-center justify-center">
          <PhoneCall className="h-5 w-5 mr-2" />
          (562) 444-5620
        </p>
      </div>
      <p className="mt-8 text-sm text-gray-500">
        © 2025 MediaBoost. All rights reserved.
      </p>
    </footer>
  );
};

export default ContactFooter;
