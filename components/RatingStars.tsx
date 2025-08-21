
import React from 'react';
import { StarIcon } from './icons';

interface RatingStarsProps {
  rating: number;
  totalStars?: number;
  className?: string;
}

const RatingStars: React.FC<RatingStarsProps> = ({ rating, totalStars = 5, className = 'h-5 w-5' }) => {
  return (
    <div className="flex items-center">
      {[...Array(totalStars)].map((_, index) => {
        const starValue = index + 1;
        return (
          <StarIcon
            key={index}
            className={`${className} ${rating >= starValue ? 'text-yellow-400' : 'text-gray-300'}`}
            filled={rating >= starValue}
          />
        );
      })}
    </div>
  );
};

export default RatingStars;
