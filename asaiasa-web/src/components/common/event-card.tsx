import React from 'react';
import { Link } from 'react-router';
import { Button } from '@/components/base/buttons/button';
import { Event } from '@/services/api';

interface EventCardProps {
  event: Event;
  showOrganization?: boolean;
  className?: string;
}

export const EventCard: React.FC<EventCardProps> = ({ 
  event, 
  showOrganization = true, 
  className = "" 
}) => {
  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow ${className}`}>
      {/* Event Image */}
      {event.picUrl && (
        <img 
          src={event.picUrl} 
          alt={event.name} 
          className="w-full h-48 object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
          }}
        />
      )}
      
      <div className="p-6">
        {/* Organization Info */}
        {showOrganization && event.organization && (
          <div className="flex items-center gap-2 mb-3">
            {event.organization.picUrl && (
              <img 
                src={event.organization.picUrl}
                alt={event.organization.name}
                className="w-6 h-6 rounded-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
            )}
            <span className="text-sm text-gray-600">{event.organization.name}</span>
          </div>
        )}

        {/* Event Title */}
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">{event.name}</h3>
        
        {/* Event Details */}
        <div className="text-sm text-gray-500 space-y-1 mb-4">
          <p>📅 {new Date(event.startDate).toLocaleDateString()}</p>
          <p>📍 {event.locationName}</p>
          {event.locationType === 'online' && <p>🌐 Online Event</p>}
          {event.categories && event.categories.length > 0 && (
            <p>🏷️ {event.categories.map(cat => cat.label).join(', ')}</p>
          )}
          <p>💰 {(event.price === 'free' || event.priceType === 'free') ? 'Free' : 'Paid'}</p>
        </div>

        {/* Action Button */}
        <Link to={`/events/${event.id}`}>
          <Button variant="outline" size="sm" className="w-full">
            Learn More
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default EventCard;
