
import React from 'react';
import { useState, useMemo, useEffect, useCallback } from 'react';
import { Book, User, Genre, BookStatus, BorrowRequest, Community, CommunityMembership } from './types';
import { BOOKS, USERS, CURRENT_USER_ID, COMMUNITIES, COMMUNITY_MEMBERSHIPS } from './constants';
import { getPersonalizedRecommendations } from './services/geminiService';
import { BookOpenIcon, UsersIcon, UserCircleIcon, MagnifyingGlassIcon, SparklesIcon, PlusIcon, PencilIcon } from './components/icons';
import BookCard from './components/BookCard';
import Modal from './components/Modal';
import RatingStars from './components/RatingStars';
import AddBookModal from './components/AddBookModal';
import EditProfileModal from './components/EditProfileModal';
import CommunityView from './components/CommunityView';

type View = 'discover' | 'mybooks' | 'communities' | 'profile';

// --- View Component Prop Types ---

interface DiscoverViewProps {
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  selectedGenre: Genre | 'all';
  onSelectedGenreChange: (genre: Genre | 'all') => void;
  isLoadingRecs: boolean;
  recommendations: Book[];
  filteredBooks: Book[];
  onSelectBook: (book: Book) => void;
  users: User[];
}

interface MyBooksViewProps {
    incomingRequests: BorrowRequest[];
    books: Book[];
    users: User[];
    onAcceptRequest: (requestId: number) => void;
    onRejectRequest: (requestId: number) => void;
    onAddBookClick: () => void;
    myShelf: Book[];
    myBorrowedBooks: Book[];
    onSelectBook: (book: Book) => void;
    onReturnBook: (bookId: number) => void;
}

interface ProfileViewProps {
    currentUser: User;
    onEditProfileClick: () => void;
}

// --- View Components ---

const DiscoverView: React.FC<DiscoverViewProps> = ({
    searchQuery, onSearchQueryChange, selectedGenre, onSelectedGenreChange,
    isLoadingRecs, recommendations, filteredBooks, onSelectBook, users
}) => {
    const filteredRecommendations = useMemo(() => recommendations.filter(book =>
        !searchQuery || book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase())
    ), [recommendations, searchQuery]);

    return (
    <div>
        <div className="p-4 bg-white shadow-sm">
            <div className="relative mb-4">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input 
                    type="text" 
                    placeholder="Search by title or author..." 
                    value={searchQuery} 
                    onChange={(e) => onSearchQueryChange(e.target.value)} 
                    className="w-full pl-10 pr-4 py-2 border rounded-full focus:ring-2 focus:ring-brand-teal focus:outline-none bg-white text-gray-900 placeholder-gray-500" 
                />
            </div>
            <div className="flex space-x-2 overflow-x-auto pb-2 -mx-4 px-4">
                <button onClick={() => onSelectedGenreChange('all')} className={`px-4 py-1 rounded-full text-sm font-semibold whitespace-nowrap ${selectedGenre === 'all' ? 'bg-brand-teal text-white' : 'bg-gray-200 text-gray-700'}`}>All</button>
                {Object.values(Genre).map(genre => (
                    <button key={genre} onClick={() => onSelectedGenreChange(genre)} className={`px-4 py-1 rounded-full text-sm font-semibold whitespace-nowrap ${selectedGenre === genre ? 'bg-brand-teal text-white' : 'bg-gray-200 text-gray-700'}`}>{genre}</button>
                ))}
            </div>
        </div>
         <div className="p-4">
            <h2 className="text-2xl font-bold text-brand-brown mb-3 flex items-center"><SparklesIcon className="h-6 w-6 mr-2 text-brand-orange" /> For You</h2>
            {isLoadingRecs ? <div className="text-center py-8">Loading recommendations...</div> :
                filteredRecommendations.length > 0 ?
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {filteredRecommendations.map(book => {
                        const lender = users.find(u => u.id === book.ownerId);
                        return <BookCard key={book.id} book={book} onSelect={onSelectBook} lender={lender} />;
                    })}
                </div>
                : <p className="text-gray-600">{searchQuery ? `No recommendations match "${searchQuery}".` : "No recommendations for you right now. Try borrowing some books!"}</p>
            }
        </div>
        <div className="p-4">
            <h2 className="text-2xl font-bold text-brand-brown mb-4">Discover All Books</h2>
             {filteredBooks.length > 0 ? 
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {filteredBooks.map(book => {
                        const lender = users.find(u => u.id === book.ownerId);
                        return <BookCard key={book.id} book={book} onSelect={onSelectBook} lender={lender} />
                    })}
                </div>
             : <p className="text-gray-600">{searchQuery ? `No books found matching "${searchQuery}".` : "No books found in your communities. Try joining a community to see more books!"}</p>}
        </div>
    </div>
    );
};

const MyBooksView: React.FC<MyBooksViewProps> = ({
    incomingRequests, books, users, onAcceptRequest, onRejectRequest, 
    onAddBookClick, myShelf, myBorrowedBooks, onSelectBook, onReturnBook
}) => (
    <div className="p-4 space-y-8">
        {incomingRequests.length > 0 && (
            <div>
                <h2 className="text-2xl font-bold text-brand-brown mb-4">Incoming Requests</h2>
                <ul className="space-y-3">
                    {incomingRequests.map(req => {
                        const book = books.find(b => b.id === req.bookId);
                        const borrower = users.find(u => u.id === req.borrowerId);
                        if (!book || !borrower) return null;
                        return (
                            <li key={req.id} className="bg-white p-3 rounded-lg shadow-sm flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <img src={borrower.profilePicUrl} alt={borrower.name} className="w-10 h-10 rounded-full"/>
                                    <div>
                                        <p className="text-sm">
                                            <span className="font-bold">{borrower.name}</span> requested <span className="font-bold text-brand-teal">{book.title}</span>
                                        </p>
                                    </div>
                                </div>
                                <div className="flex space-x-2">
                                    <button onClick={() => onAcceptRequest(req.id)} className="bg-green-500 text-white px-3 py-1 text-xs font-bold rounded-full">Accept</button>
                                    <button onClick={() => onRejectRequest(req.id)} className="bg-red-500 text-white px-3 py-1 text-xs font-bold rounded-full">Reject</button>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            </div>
        )}
         <div>
            <div className="flex justify-between items-center mb-4">
                 <h2 className="text-2xl font-bold text-brand-brown">My Shelf (Lending)</h2>
                 <button onClick={onAddBookClick} className="flex items-center bg-brand-orange text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-opacity-90 transition-transform hover:scale-105">
                    <PlusIcon className="h-5 w-5 mr-1" /> Add Book
                </button>
            </div>
             {myShelf.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {myShelf.map(book => <BookCard key={book.id} book={book} onSelect={onSelectBook} />)}
                </div>
            ) : <p className="text-gray-600">You haven't added any books to your shelf yet.</p>}
        </div>
        <div>
            <h2 className="text-2xl font-bold text-brand-brown mb-4">My Borrows</h2>
            {myBorrowedBooks.length > 0 ? (
                <ul className="space-y-4">
                    {myBorrowedBooks.map(book => {
                        const owner = users.find(u => u.id === book.ownerId);
                        return (
                            <li key={book.id} className="bg-white p-4 rounded-lg shadow-sm flex items-center justify-between">
                                <div>
                                    <p className="font-bold text-brand-brown">{book.title}</p>
                                    <p className="text-sm text-gray-500">by {book.author}</p>
                                    <p className="text-xs text-gray-400 mt-1">Borrowed from {owner?.name}</p>
                                </div>
                                <button onClick={() => onReturnBook(book.id)} className="bg-brand-orange text-white px-3 py-1 rounded-full text-sm font-semibold">Return</button>
                            </li>
                        );
                    })}
                </ul>
            ) : <p className="text-gray-600">You are not currently borrowing any books.</p>}
        </div>
    </div>
);

const ProfileView: React.FC<ProfileViewProps> = ({ currentUser, onEditProfileClick }) => (
    <div className="p-4 flex flex-col items-center">
        <div className="relative">
            <img src={currentUser.profilePicUrl} alt={currentUser.name} className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg mb-4"/>
            <button 
                onClick={onEditProfileClick} 
                className="absolute bottom-4 -right-1 bg-brand-orange text-white p-2 rounded-full shadow-md hover:bg-opacity-90 transition">
                <PencilIcon className="w-5 h-5" />
            </button>
        </div>
        <h2 className="text-3xl font-bold text-brand-brown">{currentUser.name}</h2>
        <p className="text-gray-500">{currentUser.location}</p>
        <div className="flex items-center my-2">
            <RatingStars rating={currentUser.rating} />
            <span className="ml-2 text-gray-600">({currentUser.reviews} reviews)</span>
        </div>
        <p className="text-center text-gray-700 mt-4 max-w-md">{currentUser.bio}</p>
    </div>
);

const App: React.FC = () => {
    const [view, setView] = useState<View>('discover');
    const [books, setBooks] = useState<Book[]>(BOOKS);
    const [users, setUsers] = useState<User[]>(USERS);
    const [memberships, setMemberships] = useState<CommunityMembership[]>(COMMUNITY_MEMBERSHIPS);
    const [borrowRequests, setBorrowRequests] = useState<BorrowRequest[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedGenre, setSelectedGenre] = useState<Genre | 'all'>('all');
    const [selectedBook, setSelectedBook] = useState<Book | null>(null);
    const [isAddBookModalOpen, setIsAddBookModalOpen] = useState(false);
    const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
    const [recommendations, setRecommendations] = useState<Book[]>([]);
    const [isLoadingRecs, setIsLoadingRecs] = useState(true);

    const currentUser = useMemo(() => users.find(u => u.id === CURRENT_USER_ID)!, [users]);

    const myCommunityIds = useMemo(() => memberships.filter(m => m.userId === currentUser.id).map(m => m.communityId), [memberships, currentUser.id]);
    const myCommunities = useMemo(() => COMMUNITIES.filter(c => myCommunityIds.includes(c.id)), [myCommunityIds]);

    const fetchRecommendations = useCallback(async () => {
        setIsLoadingRecs(true);
        const borrowedBooks = books.filter(b => b.borrowerId === currentUser.id);
        const availableBooks = books.filter(b =>
            b.status === BookStatus.Available &&
            b.ownerId !== currentUser.id &&
            b.communityIds.some(id => myCommunityIds.includes(id)) // Only recommend from my communities
        );
        const recommendedTitles = await getPersonalizedRecommendations(borrowedBooks, availableBooks);
        const recommendedBooks = availableBooks.filter(b => recommendedTitles.includes(b.title));
        setRecommendations(recommendedBooks);
        setIsLoadingRecs(false);
    }, [books, currentUser.id, myCommunityIds]);

    useEffect(() => {
        fetchRecommendations();
    }, [fetchRecommendations]);

    const filteredBooks = useMemo(() => {
        return books.filter(book => {
            const matchesQuery = book.title.toLowerCase().includes(searchQuery.toLowerCase()) || book.author.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesGenre = selectedGenre === 'all' || book.genre === selectedGenre;
            const isMyBook = book.ownerId === currentUser.id;
            const isInMyCommunity = book.communityIds.some(id => myCommunityIds.includes(id));
            
            return !isMyBook && isInMyCommunity && matchesQuery && matchesGenre;
        });
    }, [books, searchQuery, selectedGenre, currentUser.id, myCommunityIds]);

    const myShelf = useMemo(() => books.filter(b => b.ownerId === currentUser.id), [books, currentUser.id]);
    const myBorrowedBooks = useMemo(() => books.filter(b => b.borrowerId === currentUser.id), [books, currentUser.id]);
    const incomingRequests = useMemo(() => borrowRequests.filter(r => r.lenderId === currentUser.id && r.status === 'pending'), [borrowRequests, currentUser.id]);


    const handleStatusToggle = (newStatus: 'Lender' | 'Borrower') => {
        setUsers(prevUsers => prevUsers.map(u => u.id === currentUser.id ? { ...u, primaryStatus: newStatus } : u));
    };
    
    const handleUpdateProfile = (updatedUser: User) => {
      setUsers(prevUsers => prevUsers.map(u => u.id === updatedUser.id ? updatedUser : u));
      setIsEditProfileModalOpen(false);
    };

    const handleBorrowRequest = (book: Book) => {
        const existingRequest = borrowRequests.find(req => req.bookId === book.id && req.borrowerId === currentUser.id);
        if (existingRequest && (existingRequest.status === 'pending' || existingRequest.status === 'accepted')) {
            alert("You have already requested this book.");
            return;
        }

        const newRequest: BorrowRequest = {
            id: Date.now(),
            bookId: book.id,
            borrowerId: currentUser.id,
            lenderId: book.ownerId,
            status: 'pending',
            requestDate: new Date().toISOString(),
        };
        setBorrowRequests(prev => [...prev, newRequest]);
        setSelectedBook(null);
        alert(`Your request for "${book.title}" has been sent!`);
    };

    const handleAcceptRequest = (requestId: number) => {
        const request = borrowRequests.find(r => r.id === requestId);
        if (!request) return;

        setBooks(prevBooks =>
            prevBooks.map(b =>
                b.id === request.bookId
                    ? { ...b, status: BookStatus.Borrowed, borrowerId: request.borrowerId }
                    : b
            )
        );

        setBorrowRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: 'accepted' } : r));

        setBorrowRequests(prev => prev.map(r =>
            (r.bookId === request.bookId && r.id !== requestId && r.status === 'pending')
                ? { ...r, status: 'rejected' }
                : r
        ));
    };

    const handleRejectRequest = (requestId: number) => {
        setBorrowRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: 'rejected' } : r));
    };
    
    const handleReturnBook = (bookId: number) => {
        setBooks(prevBooks => prevBooks.map(b => 
            b.id === bookId ? {...b, status: BookStatus.Available, borrowerId: null} : b
        ));
    };

    const handleAddBook = (newBook: Omit<Book, 'id' | 'ownerId' | 'status' | 'borrowerId'>) => {
        const bookToAdd: Book = {
            ...newBook,
            id: Date.now(),
            ownerId: currentUser.id,
            status: BookStatus.Available,
            borrowerId: null,
        };
        setBooks(prev => [bookToAdd, ...prev]);
        setIsAddBookModalOpen(false);
    };
    
     const handleJoinCommunity = (communityId: number) => {
        const newMembership: CommunityMembership = { userId: currentUser.id, communityId };
        if (!memberships.some(m => m.userId === currentUser.id && m.communityId === communityId)) {
            setMemberships(prev => [...prev, newMembership]);
        }
    };


    const renderContent = () => {
        switch (view) {
            case 'discover': return <DiscoverView 
                                        searchQuery={searchQuery}
                                        onSearchQueryChange={setSearchQuery}
                                        selectedGenre={selectedGenre}
                                        onSelectedGenreChange={setSelectedGenre}
                                        isLoadingRecs={isLoadingRecs}
                                        recommendations={recommendations}
                                        filteredBooks={filteredBooks}
                                        onSelectBook={setSelectedBook}
                                        users={users}
                                    />;
            case 'mybooks': return <MyBooksView 
                                        incomingRequests={incomingRequests}
                                        books={books}
                                        users={users}
                                        onAcceptRequest={handleAcceptRequest}
                                        onRejectRequest={handleRejectRequest}
                                        onAddBookClick={() => setIsAddBookModalOpen(true)}
                                        myShelf={myShelf}
                                        myBorrowedBooks={myBorrowedBooks}
                                        onSelectBook={setSelectedBook}
                                        onReturnBook={handleReturnBook}
                                    />;
            case 'communities': return <CommunityView 
                                        allBooks={books} 
                                        allUsers={users} 
                                        currentUser={currentUser}
                                        memberships={memberships}
                                        onJoinCommunity={handleJoinCommunity}
                                        onSelectBook={setSelectedBook}
                                      />;
            case 'profile': return <ProfileView 
                                        currentUser={currentUser}
                                        onEditProfileClick={() => setIsEditProfileModalOpen(true)}
                                    />;
            default: return <DiscoverView 
                                searchQuery={searchQuery}
                                onSearchQueryChange={setSearchQuery}
                                selectedGenre={selectedGenre}
                                onSelectedGenreChange={setSelectedGenre}
                                isLoadingRecs={isLoadingRecs}
                                recommendations={recommendations}
                                filteredBooks={filteredBooks}
                                onSelectBook={setSelectedBook}
                                users={users}
                            />;
        }
    };
    
    const BookDetailModal: React.FC<{ book: Book; onClose: () => void }> = ({ book, onClose }) => {
        const owner = users.find(u => u.id === book.ownerId);
        const existingRequest = borrowRequests.find(req => req.bookId === book.id && req.borrowerId === currentUser.id);
        const sharedCommunities = COMMUNITIES.filter(c => book.communityIds.includes(c.id)).map(c => c.name).join(', ');

        const getButtonState = () => {
            if (book.ownerId === currentUser.id) return null;
            if (book.borrowerId === currentUser.id) {
                 return <p className="w-full bg-blue-100 text-blue-800 font-bold py-2 px-4 rounded-lg text-center">Borrowed by you</p>;
            }
            if (book.status === BookStatus.Borrowed) {
                return <p className="w-full bg-gray-200 text-gray-600 font-bold py-2 px-4 rounded-lg text-center">Currently Borrowed</p>;
            }
            if (existingRequest) {
                if (existingRequest.status === 'pending') return <p className="w-full bg-yellow-100 text-yellow-800 font-bold py-2 px-4 rounded-lg text-center">Request Sent</p>;
                if (existingRequest.status === 'rejected') return <p className="w-full bg-red-100 text-red-800 font-bold py-2 px-4 rounded-lg text-center">Request Rejected</p>;
            }
            return (
                 <button onClick={() => handleBorrowRequest(book)} className="w-full bg-brand-teal text-white font-bold py-2 px-4 rounded-lg hover:bg-opacity-90 transition-colors">Request to Borrow</button>
            );
        }

        return (
            <Modal isOpen={!!book} onClose={onClose} title={book.title}>
                <div className="space-y-4">
                    <img 
                      src={book.coverImageUrl} 
                      alt={book.title} 
                      className="w-full h-64 object-contain rounded-lg bg-gray-100"
                      onError={(e) => { e.currentTarget.src = 'https://picsum.photos/seed/fallback/300/450'; }}
                    />
                    <p className="text-xl font-semibold text-brand-brown">{book.title}</p>
                    <p className="text-md text-gray-600">by {book.author}</p>
                    <div className="flex justify-between items-center text-sm text-gray-500"><span className="font-bold">Genre:</span> <span>{book.genre}</span></div>
                    <div className="flex justify-between items-center text-sm text-gray-500"><span className="font-bold">Condition:</span> <span>{book.condition}</span></div>
                    <div className="flex justify-between items-start text-sm text-gray-500"><span className="font-bold whitespace-nowrap mr-2">Available in:</span> <span className="text-right">{sharedCommunities}</span></div>
                    <div className="border-t pt-4 mt-4">
                        <p className="font-bold text-brand-brown mb-2">Owner</p>
                        <div className="flex items-center space-x-3">
                            <img src={owner?.profilePicUrl} alt={owner?.name} className="w-12 h-12 rounded-full object-cover" />
                            <div>
                                <p className="font-semibold">{owner?.name}</p>
                                <RatingStars rating={owner?.rating || 0} className="h-4 w-4" />
                            </div>
                        </div>
                    </div>
                    {getButtonState()}
                </div>
            </Modal>
        );
    };

    return (
        <div className="font-sans text-gray-800 bg-cream min-h-screen">
            <header className="bg-white shadow-md sticky top-0 z-20">
                <div className="max-w-4xl mx-auto px-4 py-3">
                    <h1 className="text-2xl font-bold text-brand-brown tracking-wider">The Book Nook</h1>
                </div>
                 <div className="bg-white p-2 border-t w-full">
                    <div className="max-w-sm mx-auto">
                        <label className="sr-only">My Primary Role</label>
                        <div className="flex items-center justify-center bg-gray-200 rounded-full p-1">
                            <button onClick={() => handleStatusToggle('Borrower')} className={`w-1/2 py-1 text-sm font-bold rounded-full transition-colors ${currentUser.primaryStatus === 'Borrower' ? 'bg-brand-teal text-white shadow' : 'text-gray-600'}`}>Borrower</button>
                            <button onClick={() => handleStatusToggle('Lender')} className={`w-1/2 py-1 text-sm font-bold rounded-full transition-colors ${currentUser.primaryStatus === 'Lender' ? 'bg-brand-teal text-white shadow' : 'text-gray-600'}`}>Lender</button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto pb-20">
                {renderContent()}
            </main>
            
            {selectedBook && <BookDetailModal book={selectedBook} onClose={() => setSelectedBook(null)} />}
            {isAddBookModalOpen && <AddBookModal communities={myCommunities} onClose={() => setIsAddBookModalOpen(false)} onAddBook={handleAddBook} />}
            {isEditProfileModalOpen && <EditProfileModal user={currentUser} onClose={() => setIsEditProfileModalOpen(false)} onSave={handleUpdateProfile} />}


            <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
                <div className="max-w-4xl mx-auto flex justify-around">
                    <NavButton icon={<MagnifyingGlassIcon />} label="Discover" active={view === 'discover'} onClick={() => setView('discover')} />
                    <NavButton icon={<BookOpenIcon />} label="My Books" active={view === 'mybooks'} onClick={() => setView('mybooks')} />
                    <NavButton icon={<UsersIcon />} label="Community" active={view === 'communities'} onClick={() => setView('communities')} />
                    <NavButton icon={<UserCircleIcon />} label="Profile" active={view === 'profile'} onClick={() => setView('profile')} />
                </div>
            </nav>
        </div>
    );
};

interface NavButtonProps { icon: React.ReactNode; label: string; active: boolean; onClick: () => void; }
const NavButton: React.FC<NavButtonProps> = ({ icon, label, active, onClick }) => (
    <button onClick={onClick} className={`flex flex-col items-center justify-center w-full py-2 px-1 text-xs transition-colors duration-200 ${active ? 'text-brand-teal' : 'text-gray-500 hover:text-brand-teal'}`}>
        <div className="h-6 w-6 mb-1">{icon}</div>
        {label}
    </button>
);

export default App;
