
import React, { useState } from 'react';
import { Book, BookCondition, Genre, Community } from '../types';
import Modal from './Modal';

interface AddBookModalProps {
  onClose: () => void;
  onAddBook: (newBook: Omit<Book, 'id' | 'ownerId' | 'status' | 'borrowerId'>) => void;
  communities: Community[];
}

const AddBookModal: React.FC<AddBookModalProps> = ({ onClose, onAddBook, communities }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [isbn, setIsbn] = useState('');
  const [genre, setGenre] = useState<Genre>(Genre.Fiction);
  const [condition, setCondition] = useState<BookCondition>(BookCondition.Good);
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [selectedCommunityIds, setSelectedCommunityIds] = useState<number[]>([]);
  const [isFetchingDetails, setIsFetchingDetails] = useState(false);

  const getCoverUrlFromIsbn = (isbnValue: string) => {
    if (!isbnValue) return '';
    return `https://covers.openlibrary.org/b/isbn/${isbnValue}-L.jpg`;
  };

  const handleIsbnBlur = async () => {
    if (!isbn || isbn.length < 10) return;
    setIsFetchingDetails(true);
    try {
        const response = await fetch(`https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&jscmd=data&format=json`);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        const bookData = data[`ISBN:${isbn}`];

        if (bookData) {
            setTitle(bookData.title || '');
            setAuthor(bookData.authors ? bookData.authors.map((a: { name: string }) => a.name).join(', ') : '');
            if (bookData.cover && bookData.cover.large) {
                setCoverImageUrl(bookData.cover.large);
            }
        } else {
            alert('Book details not found for this ISBN. Please enter them manually.');
        }
    } catch (error) {
        console.error("Failed to fetch book details:", error);
        alert("Could not fetch book details. Please check the ISBN or enter the details manually.");
    } finally {
        setIsFetchingDetails(false);
    }
  };
  
  const handleCommunityToggle = (communityId: number) => {
    setSelectedCommunityIds(prev => 
        prev.includes(communityId) 
            ? prev.filter(id => id !== communityId) 
            : [...prev, communityId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !author) {
      alert("Title and Author are required.");
      return;
    }
    if (selectedCommunityIds.length === 0) {
      alert("Please select at least one community to share this book in.");
      return;
    }
    onAddBook({
      title,
      author,
      isbn,
      genre,
      condition,
      coverImageUrl: coverImageUrl || getCoverUrlFromIsbn(isbn) || `https://picsum.photos/seed/${encodeURIComponent(title)}/300/450`,
      communityIds: selectedCommunityIds,
    });
  };

  const inputClasses = "mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-brand-teal focus:border-brand-teal sm:text-sm";
  const labelClasses = "block text-sm font-medium text-gray-700";

  return (
    <Modal isOpen={true} onClose={onClose} title="Add a New Book">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="isbn" className={labelClasses}>ISBN</label>
           <div className="relative">
            <input 
              type="text" 
              id="isbn" 
              value={isbn} 
              onChange={(e) => setIsbn(e.target.value)} 
              onBlur={handleIsbnBlur}
              className={inputClasses} 
              placeholder="Enter ISBN to auto-fill details" 
            />
            {isFetchingDetails && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500 animate-pulse">Fetching...</span>}
          </div>
        </div>
        <div>
          <label htmlFor="title" className={labelClasses}>Title</label>
          <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} required className={inputClasses} />
        </div>
        <div>
          <label htmlFor="author" className={labelClasses}>Author</label>
          <input type="text" id="author" value={author} onChange={(e) => setAuthor(e.target.value)} required className={inputClasses} />
        </div>
        <div>
          <label htmlFor="genre" className={labelClasses}>Genre</label>
          <select id="genre" value={genre} onChange={(e) => setGenre(e.target.value as Genre)} className={inputClasses}>
            {Object.values(Genre).map(g => <option key={g} value={g}>{g}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="condition" className={labelClasses}>Condition</label>
          <select id="condition" value={condition} onChange={(e) => setCondition(e.target.value as BookCondition)} className={inputClasses}>
            {Object.values(BookCondition).map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
            <span className={labelClasses}>Share in Communities</span>
            <div className="mt-2 space-y-2 max-h-32 overflow-y-auto border p-2 rounded-md">
                {communities.length > 0 ? communities.map(community => (
                    <label key={community.id} className="flex items-center space-x-3 cursor-pointer">
                        <input 
                            type="checkbox"
                            checked={selectedCommunityIds.includes(community.id)}
                            onChange={() => handleCommunityToggle(community.id)}
                            className="h-4 w-4 rounded border-gray-300 text-brand-teal focus:ring-brand-teal"
                        />
                        <span className="text-sm text-gray-800">{community.name}</span>
                    </label>
                )) : <p className="text-sm text-gray-500">You must join a community before adding a book.</p>}
            </div>
        </div>
        <div>
          <label htmlFor="coverImageUrl" className={labelClasses}>Cover Image URL (Optional)</label>
          <input type="text" id="coverImageUrl" value={coverImageUrl} onChange={(e) => setCoverImageUrl(e.target.value)} placeholder="Overrides auto-fetched image" className={inputClasses} />
        </div>
        <div className="pt-4 flex justify-end">
            <button type="button" onClick={onClose} className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-orange">
                Cancel
            </button>
            <button type="submit" className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-brand-teal hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-teal">
                Add Book
            </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddBookModal;
