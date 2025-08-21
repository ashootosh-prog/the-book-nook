
export enum Genre {
  Fiction = "Fiction",
  Fantasy = "Fantasy",
  NonFiction = "Non-Fiction",
  SciFi = "Science Fiction",
  Mystery = "Mystery",
  Biography = "Biography",
  History = "History",
  Children = "Children's",
}

export enum BookCondition {
  New = "New",
  LikeNew = "Like New",
  Good = "Good",
  Fair = "Fair",
}

export enum BookStatus {
  Available = "Available",
  Borrowed = "Borrowed",
}

export interface User {
  id: number;
  name: string;
  bio: string;
  location: string;
  profilePicUrl: string;
  rating: number;
  reviews: number;
  primaryStatus: 'Lender' | 'Borrower';
}

export interface Book {
  id: number;
  title: string;
  author: string;
  genre: Genre;
  isbn: string;
  condition: BookCondition;
  ownerId: number;
  coverImageUrl: string;
  status: BookStatus;
  borrowerId?: number | null;
  communityIds: number[]; // A book can be shared in one or more communities
}

export interface BorrowRequest {
  id: number;
  bookId: number;
  borrowerId: number;
  lenderId: number;
  status: 'pending' | 'accepted' | 'rejected' | 'returned';
  requestDate: string;
  returnDate?: string;
}

export interface Community {
  id: number;
  name: string;
  description: string;
  adminId: number;
  imageUrl: string;
}

export interface CommunityMembership {
  userId: number;
  communityId: number;
}

export interface BookClub {
  id: number;
  communityId: number;
  name: string;
  currentBookId: number;
  nextMeeting: string;
  voteOptions?: number[]; 
  votes?: { [bookId: number]: number };
}
