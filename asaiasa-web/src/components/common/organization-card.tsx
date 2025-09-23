import React from 'react';
import { Link } from 'react-router';
import { MapPin } from 'lucide-react';
import { Organization } from '@/services/api';

interface OrganizationCardProps {
  organization: Organization;
  className?: string;
}

export const OrganizationCard: React.FC<OrganizationCardProps> = ({ 
  organization, 
  className = "" 
}) => {
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement;
    target.src = '/logo-2.png';
  };

  return (
    <Link to={`/organizations/${organization.id}`}>
      <div className={`bg-white rounded-lg border border-gray-200 hover:shadow-md transition-all duration-200 overflow-hidden h-full cursor-pointer ${className}`}>
        {/* Card Header */}
        <div className="p-4">
          <div className="flex items-center gap-3">
            <div className="relative h-16 w-16 overflow-hidden rounded-md shrink-0 bg-gray-50">
              <img
                src={organization.picUrl || '/logo-2.png'}
                alt={`${organization.name} logo`}
                className="w-full h-full object-cover"
                onError={handleImageError}
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-base line-clamp-1 text-gray-900 mb-1">
                {organization.name}
              </h3>
              {(organization.province || organization.country) && (
                <div className="flex items-center justify-start text-xs text-gray-500 gap-1">
                  <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                  <span className="line-clamp-1">
                    {organization.province && organization.country 
                      ? `${organization.province}, ${organization.country}`
                      : organization.province || organization.country}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Card Content */}
        <div className="px-4 pb-4">
          {organization.headline && (
            <p className="text-sm text-gray-600 mb-3 line-clamp-2 font-normal">
              {organization.headline}
            </p>
          )}

          {/* Industries/Specialty Tags */}
          <div className="flex flex-wrap gap-1.5">
            {organization.specialty && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-50 text-orange-600 border border-orange-200">
                {organization.specialty}
              </span>
            )}
          </div>
        </div>

        {/* Card Footer - Hidden for now but structure maintained */}
        <div className="sr-only"></div>
      </div>
    </Link>
  );
};

export default OrganizationCard;
