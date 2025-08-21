
import { User, Book, Genre, BookCondition, BookStatus, Community, CommunityMembership, BookClub } from './types';

export const CURRENT_USER_ID = 1;

export const USERS: User[] = [
  {
    id: 1,
    name: "Alex Doe",
    bio: "Avid reader of sci-fi and fantasy. Always looking for the next great adventure.",
    location: "San Francisco, CA",
    profilePicUrl: "https://picsum.photos/seed/alex/200",
    rating: 4.8,
    reviews: 15,
    primaryStatus: 'Borrower',
  },
  {
    id: 2,
    name: "Brenda Smith",
    bio: "Collector of classic literature and historical biographies. Happy to share my library.",
    location: "New York, NY",
    profilePicUrl: "https://picsum.photos/seed/brenda/200",
    rating: 4.9,
    reviews: 22,
    primaryStatus: 'Lender',
  },
  {
    id: 3,
    name: "Chris Green",
    bio: "Loves discussing books with others. Let's start a book club!",
    location: "Chicago, IL",
    profilePicUrl: "https://picsum.photos/seed/chris/200",
    rating: 4.5,
    reviews: 8,
    primaryStatus: 'Borrower',
  },
   {
    id: 4,
    name: "Diana Prince",
    bio: "Parent and reader, looking for children's books and mystery novels.",
    location: "San Francisco, CA",
    profilePicUrl: "https://picsum.photos/seed/diana/200",
    rating: 4.7,
    reviews: 11,
    primaryStatus: 'Borrower',
  },
];

export const BOOKS: Book[] = [
  {
    id: 1,
    title: "Dune",
    author: "Frank Herbert",
    genre: Genre.SciFi,
    isbn: "9780441013593",
    condition: BookCondition.Good,
    ownerId: 2,
    coverImageUrl: "https://covers.openlibrary.org/b/isbn/9780441013593-L.jpg",
    status: BookStatus.Available,
    communityIds: [2],
  },
  {
    id: 2,
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    genre: Genre.Fantasy,
    isbn: "9780618260300",
    condition: BookCondition.LikeNew,
    ownerId: 2,
    coverImageUrl: "https://covers.openlibrary.org/b/isbn/9780618260300-L.jpg",
    status: BookStatus.Available,
    communityIds: [2],
  },
  {
    id: 3,
    title: "Sapiens: A Brief History of Humankind",
    author: "Yuval Noah Harari",
    genre: Genre.History,
    isbn: "9780062316097",
    condition: BookCondition.New,
    ownerId: 3,
    coverImageUrl: "https://covers.openlibrary.org/b/isbn/9780062316097-L.jpg",
    status: BookStatus.Available,
    communityIds: [2],
  },
  {
    id: 4,
    title: "Project Hail Mary",
    author: "Andy Weir",
    genre: Genre.SciFi,
    isbn: "9780593135204",
    condition: BookCondition.LikeNew,
    ownerId: 1,
    coverImageUrl: "https://covers.openlibrary.org/b/isbn/9780593135204-L.jpg",
    status: BookStatus.Borrowed,
    borrowerId: 3,
    communityIds: [1],
  },
  {
    id: 5,
    title: "The Silent Patient",
    author: "Alex Michaelides",
    genre: Genre.Mystery,
    isbn: "9781250301697",
    condition: BookCondition.Good,
    ownerId: 3,
    coverImageUrl: "https://covers.openlibrary.org/b/isbn/9781250301697-L.jpg",
    status: BookStatus.Available,
    communityIds: [2],
  },
  {
    id: 6,
    title: "Educated: A Memoir",
    author: "Tara Westover",
    genre: Genre.Biography,
    isbn: "9780399590504",
    condition: BookCondition.Fair,
    ownerId: 2,
    coverImageUrl: "https://covers.openlibrary.org/b/isbn/9780399590504-L.jpg",
    status: BookStatus.Available,
    communityIds: [2],
  },
  {
    id: 7,
    title: "The Name of the Wind",
    author: "Patrick Rothfuss",
    genre: Genre.Fantasy,
    isbn: "9780756404741",
    condition: BookCondition.Good,
    ownerId: 1,
    coverImageUrl: "https://covers.openlibrary.org/b/isbn/9780756404741-L.jpg",
    status: BookStatus.Borrowed,
    borrowerId: 2,
    communityIds: [1, 2],
  },
  {
    id: 8,
    title: "Where the Crawdads Sing",
    author: "Delia Owens",
    genre: Genre.Fiction,
    isbn: "9780735219090",
    condition: BookCondition.LikeNew,
    ownerId: 3,
    coverImageUrl: "https://covers.openlibrary.org/b/isbn/9780735219090-L.jpg",
    status: BookStatus.Available,
    communityIds: [2],
  },
  {
    id: 9,
    title: "The Very Hungry Caterpillar",
    author: "Eric Carle",
    genre: Genre.Children,
    isbn: "9780399226908",
    condition: BookCondition.Good,
    ownerId: 4,
    coverImageUrl: "https://covers.openlibrary.org/b/isbn/9780399226908-L.jpg",
    status: BookStatus.Available,
    communityIds: [3],
  },
    {
    id: 10,
    title: "Foundation",
    author: "Isaac Asimov",
    genre: Genre.SciFi,
    isbn: "9780553803716",
    condition: BookCondition.Good,
    ownerId: 2,
    coverImageUrl: "https://covers.openlibrary.org/b/isbn/9780553803716-L.jpg",
    status: BookStatus.Available,
    communityIds: [2],
  },
  {
    id: 11,
    title: "A Game of Thrones",
    author: "George R. R. Martin",
    genre: Genre.Fantasy,
    isbn: "9780553593716",
    condition: BookCondition.LikeNew,
    ownerId: 3,
    coverImageUrl: "https://covers.openlibrary.org/b/isbn/9780553593716-L.jpg",
    status: BookStatus.Available,
    communityIds: [2],
  },
  {
    id: 12,
    title: "Steve Jobs",
    author: "Walter Isaacson",
    genre: Genre.Biography,
    isbn: "9781451648539",
    condition: BookCondition.New,
    ownerId: 1,
    coverImageUrl: "https://covers.openlibrary.org/b/isbn/9781451648539-L.jpg",
    status: BookStatus.Available,
    communityIds: [2],
  }
];

export const COMMUNITIES: Community[] = [
    {
        id: 1,
        name: "SF Sci-Fi Readers",
        description: "A group for science fiction lovers in the San Francisco area to share books and thoughts.",
        adminId: 1,
        imageUrl: "https://picsum.photos/seed/sf-scifi/600/200"
    },
    {
        id: 2,
        name: "Downtown Office Readers",
        description: "For professionals working downtown who want to exchange books during their lunch breaks.",
        adminId: 2,
        imageUrl: "https://picsum.photos/seed/downtown-readers/600/200"
    },
    {
        id: 3,
        name: "Parents & Kids Corner",
        description: "A community for parents to find and share age-appropriate books for their children.",
        adminId: 4,
        imageUrl: "https://picsum.photos/seed/kids-corner/600/200"
    }
];

export const COMMUNITY_MEMBERSHIPS: CommunityMembership[] = [
    { userId: 1, communityId: 1 },
    { userId: 1, communityId: 2 },
    { userId: 2, communityId: 2 },
    { userId: 3, communityId: 2 },
    { userId: 4, communityId: 1 },
    { userId: 4, communityId: 3 },
];

export const BOOK_CLUBS: BookClub[] = [
    {
        id: 1,
        communityId: 1,
        name: "The Galactic Council",
        currentBookId: 1, // Dune - Note: This book is owned by a member of community 2, but could be "lent" to the club.
        nextMeeting: "2025-09-15T18:00:00Z",
        voteOptions: [4, 10], // Project Hail Mary, Foundation
        votes: { 4: 1, 10: 1 }
    },
    {
        id: 2,
        communityId: 2,
        name: "The Biography Buffs",
        currentBookId: 12, // Steve Jobs
        nextMeeting: "2025-09-20T12:30:00Z",
    },
     {
        id: 3,
        communityId: 1,
        name: "Fantasy Friends",
        currentBookId: 2, // The Hobbit
        nextMeeting: "2025-09-22T19:00:00Z",
        voteOptions: [7, 11], // The Name of the Wind, A Game of Thrones
        votes: { 7: 0, 11: 2 }
    },
];
