import React from 'react';
import { Book, BookStatus, User } from '../types';
import RatingStars from './RatingStars';

interface BookCardProps {
  book: Book;
  onSelect: (book: Book) => void;
  lender?: User;
}

const BookCard: React.FC<BookCardProps> = ({ book, onSelect, lender }) => {
  return (
    <div 
        onClick={() => onSelect(book)}
        className="bg-white rounded-lg shadow-md overflow-hidden transform hover:-translate-y-1 transition-transform duration-300 cursor-pointer flex flex-col group"
    >
      <div className="relative">
        <img src={book.coverImageUrl} alt={book.title} className="w-full h-64 object-cover" />
        {book.status === BookStatus.Borrowed && (
            <div className="absolute top-2 right-2 bg-gray-700 text-white text-xs font-bold px-2 py-1 rounded">BORROWED</div>
        )}
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-bold text-brand-brown group-hover:text-brand-teal transition-colors">{book.title}</h3>
        <p className="text-gray-600 text-sm mb-2">{book.author}</p>
        {lender && (
            <div className="flex items-center space-x-2 text-xs text-gray-500 my-1">
                <img src={lender.profilePicUrl} alt={lender.name} className="w-5 h-5 rounded-full object-cover" />
                <span className="truncate">{lender.name}</span>
                <RatingStars rating={lender.rating} className="h-3 w-3" />
            </div>
        )}
        <div className="mt-auto pt-2">
            <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-brand-teal bg-brand-teal/20">
                {book.genre}
            </span>
        </div>
      </div>
    </div>
  );
};

export default BookCard;