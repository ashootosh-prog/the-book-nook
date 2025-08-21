
import React, { useState, useMemo } from 'react';
import { Book, User, Community, CommunityMembership, BookClub } from '../types';
import { COMMUNITIES, BOOK_CLUBS } from '../constants';
import BookCard from './BookCard';
import RatingStars from './RatingStars';

interface CommunityViewProps {
    allBooks: Book[];
    allUsers: User[];
    currentUser: User;
    memberships: CommunityMembership[];
    onJoinCommunity: (communityId: number) => void;
    onSelectBook: (book: Book) => void;
}

const CommunityView: React.FC<CommunityViewProps> = ({ allBooks, allUsers, currentUser, memberships, onJoinCommunity, onSelectBook }) => {
    const [selectedCommunity, setSelectedCommunity] = useState<Community | null>(null);
    const [bookClubs, setBookClubs] = useState<BookClub[]>(BOOK_CLUBS);

    const myCommunities = useMemo(() => {
        const myCommunityIds = memberships.filter(m => m.userId === currentUser.id).map(m => m.communityId);
        return COMMUNITIES.filter(c => myCommunityIds.includes(c.id));
    }, [memberships, currentUser.id]);

    const otherCommunities = useMemo(() => {
        const myCommunityIds = memberships.filter(m => m.userId === currentUser.id).map(m => m.communityId);
        return COMMUNITIES.filter(c => !myCommunityIds.includes(c.id));
    }, [memberships, currentUser.id]);

    const handleVote = (clubId: number, bookId: number) => {
        setBookClubs(prevClubs => prevClubs.map(club => {
            if (club.id === clubId && club.votes) {
                const newVotes = { ...club.votes };
                const currentVoteCount = newVotes[bookId] || 0;
                newVotes[bookId] = currentVoteCount + 1;
                return { ...club, votes: newVotes };
            }
            return club;
        }));
    };

    if (selectedCommunity) {
        const communityMemberships = memberships.filter(m => m.communityId === selectedCommunity.id);
        const communityMemberIds = communityMemberships.map(m => m.userId);
        const communityMembers = allUsers.filter(u => communityMemberIds.includes(u.id));
        const communityBooks = allBooks.filter(b => b.communityIds.includes(selectedCommunity.id));
        const communityBookClubs = bookClubs.filter(bc => bc.communityId === selectedCommunity.id);

        return (
            <div className="p-4">
                <button onClick={() => setSelectedCommunity(null)} className="mb-4 text-brand-teal font-semibold">&larr; Back to all communities</button>
                <div className="relative h-32 rounded-lg overflow-hidden mb-4">
                    <img src={selectedCommunity.imageUrl} alt={selectedCommunity.name} className="w-full h-full object-cover"/>
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <h2 className="text-3xl font-bold text-white text-center">{selectedCommunity.name}</h2>
                    </div>
                </div>
                <p className="text-gray-600 mb-6">{selectedCommunity.description}</p>
                
                {/* Book Clubs */}
                <div className="mb-8">
                    <h3 className="text-xl font-bold text-brand-brown mb-4">Book Clubs</h3>
                    {communityBookClubs.length > 0 ? (
                        <div className="space-y-4">
                        {communityBookClubs.map(club => {
                            const currentBook = allBooks.find(b => b.id === club.currentBookId);
                            return (
                                <div key={club.id} className="bg-white p-4 rounded-lg shadow-sm">
                                    <h4 className="font-bold text-lg text-brand-teal">{club.name}</h4>
                                    {currentBook && (
                                        <div className="mt-2">
                                            <p className="text-sm font-semibold">Currently Reading:</p>
                                            <p>{currentBook.title} by {currentBook.author}</p>
                                        </div>
                                    )}
                                    <p className="text-sm mt-2">Next Meeting: <span className="font-semibold">{new Date(club.nextMeeting).toLocaleString()}</span></p>

                                    {club.voteOptions && (
                                        <div className="mt-3 border-t pt-3">
                                            <h5 className="text-sm font-semibold mb-2">Vote for the next book:</h5>
                                            <div className="space-y-2">
                                            {club.voteOptions.map(bookId => {
                                                const book = allBooks.find(b => b.id === bookId);
                                                if (!book) return null;
                                                const totalVotes = Object.values(club.votes || {}).reduce((a, b) => a + b, 0);
                                                const voteCount = club.votes?.[bookId] || 0;
                                                const votePercentage = totalVotes > 0 ? (voteCount / totalVotes) * 100 : 0;
                                                
                                                return (
                                                    <div key={bookId}>
                                                        <div className="flex justify-between items-center text-sm mb-1">
                                                            <span>{book.title}</span>
                                                            <span className="text-xs text-gray-500">{voteCount} votes</span>
                                                        </div>
                                                        <div className="relative w-full bg-gray-200 rounded-full h-6">
                                                            <div className="bg-brand-teal h-6 rounded-full text-white text-xs flex items-center justify-center" style={{ width: `${votePercentage}%` }}>
                                                                {votePercentage > 10 && `${Math.round(votePercentage)}%`}
                                                            </div>
                                                            <button onClick={() => handleVote(club.id, book.id)} className="absolute inset-0 w-full h-full flex items-center justify-end pr-2 text-sm font-bold text-white hover:bg-black/10 rounded-full">Vote</button>
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                        </div>
                    ) : <p className="text-gray-500">No book clubs yet. Why not start one?</p>}
                </div>

                {/* Shared Books */}
                <div className="mb-8">
                    <h3 className="text-xl font-bold text-brand-brown mb-4">Books in this Community</h3>
                    {communityBooks.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {communityBooks.map(book => <BookCard key={book.id} book={book} onSelect={onSelectBook} />)}
                        </div>
                    ) : <p className="text-gray-500">No books have been shared in this community yet.</p>}
                </div>

                {/* Members */}
                <div>
                    <h3 className="text-xl font-bold text-brand-brown mb-4">Members ({communityMembers.length})</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {communityMembers.map(member => (
                            <div key={member.id} className="text-center">
                                <img src={member.profilePicUrl} alt={member.name} className="w-16 h-16 rounded-full mx-auto mb-2" />
                                <p className="font-semibold text-sm">{member.name}</p>
                                <RatingStars rating={member.rating} className="h-3 w-3 mx-auto" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 space-y-8">
            <div>
                <h2 className="text-2xl font-bold text-brand-brown mb-4">My Communities</h2>
                {myCommunities.length > 0 ? (
                    <div className="space-y-4">
                        {myCommunities.map(c => <CommunityCard key={c.id} community={c} onSelect={() => setSelectedCommunity(c)} />)}
                    </div>
                ) : <p className="text-gray-600">You haven't joined any communities yet.</p>}
            </div>
            <div>
                <h2 className="text-2xl font-bold text-brand-brown mb-4">Discover Communities</h2>
                <div className="space-y-4">
                    {otherCommunities.map(c => <CommunityCard key={c.id} community={c} onSelect={() => setSelectedCommunity(c)} onJoin={() => onJoinCommunity(c.id)} />)}
                </div>
            </div>
        </div>
    );
};

const CommunityCard: React.FC<{ community: Community, onSelect: () => void, onJoin?: () => void }> = ({ community, onSelect, onJoin }) => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="relative">
            <img src={community.imageUrl} alt={community.name} className="w-full h-24 object-cover" />
            <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        </div>
        <div className="p-4">
            <h3 className="text-lg font-bold text-brand-brown">{community.name}</h3>
            <p className="text-gray-600 text-sm mt-1 mb-3">{community.description}</p>
            <div className="flex justify-between items-center">
                <button onClick={onSelect} className="text-sm font-semibold text-brand-teal">View Details</button>
                {onJoin && (
                    <button onClick={onJoin} className="bg-brand-orange text-white px-3 py-1 rounded-full text-sm font-semibold">Join</button>
                )}
            </div>
        </div>
    </div>
);

export default CommunityView;
