export type Quote = {
  quote: string;
  author: string;
  category: 'Motivational' | 'Emotional' | 'Love' | 'Friendship' | 'Life' | 'Humor' | 'Inspirational' | 'Success';
};

export const quotes: Quote[] = [
  // Motivational
  { quote: "The only way to do great work is to love what you do.", author: "Steve Jobs", category: "Motivational" },
  { quote: "Believe you can and you're halfway there.", author: "Theodore Roosevelt", category: "Motivational" },
  { quote: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt", category: "Motivational" },
  { quote: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill", category: "Motivational" },
  { quote: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius", category: "Motivational" },
  { quote: "The secret of getting ahead is getting started.", author: "Mark Twain", category: "Motivational" },
  { quote: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson", category: "Motivational" },
  { quote: "Your time is limited, don't waste it living someone else's life.", author: "Steve Jobs", category: "Motivational" },
  { quote: "The best way to predict the future is to create it.", author: "Peter Drucker", category: "Motivational" },
  { quote: "You are never too old to set another goal or to dream a new dream.", author: "C.S. Lewis", category: "Motivational" },
  { quote: "Hardships often prepare ordinary people for an extraordinary destiny.", author: "C.S. Lewis", category: "Motivational" },
  { quote: "The only limit to our realization of tomorrow will be our doubts of today.", author: "Franklin D. Roosevelt", category: "Motivational" },

  // Emotional
  { quote: "The best and most beautiful things in the world cannot be seen or even touched - they must be felt with the heart.", author: "Helen Keller", category: "Emotional" },
  { quote: "Tears are words the heart can't express.", author: "Unknown", category: "Emotional" },
  { quote: "To live is the rarest thing in the world. Most people exist, that is all.", author: "Oscar Wilde", category: "Emotional" },
  { quote: "One day you will tell your story of how you overcame what you went through and it will be someone else's survival guide.", author: "Brené Brown", category: "Emotional" },
  { quote: "The emotion that can break your heart is sometimes the very one that heals it.", author: "Nicholas Sparks", category: "Emotional" },
  { quote: "Feelings are not supposed to be logical. Dangerous is the man who has rationalized his emotions.", author: "David Borenstein", category: "Emotional" },
  { quote: "We cannot be more sensitive to pleasure without being more sensitive to pain.", author: "Alan Watts", category: "Emotional" },
  { quote: "Do not apologize for crying. Without this emotion, we are only robots.", author: "Elizabeth Gilbert", category: "Emotional" },
  { quote: "The heart is the only broken instrument that works.", author: "T.E. Kalem", category: "Emotional" },
  { quote: "Sometimes the heart sees what is invisible to the eye.", author: "H. Jackson Brown, Jr.", category: "Emotional" },
  { quote: "Let your tears come. Let them water your soul.", author: "Eileen Mayhew", category: "Emotional" },
  { quote: "Grief is the price we pay for love.", author: "Queen Elizabeth II", category: "Emotional" },
  
  // Love
  { quote: "To love and be loved is to feel the sun from both sides.", author: "David Viscott", category: "Love" },
  { quote: "Love is composed of a single soul inhabiting two bodies.", author: "Aristotle", category: "Love" },
  { quote: "The best thing to hold onto in life is each other.", author: "Audrey Hepburn", category: "Love" },
  { quote: "You know you're in love when you can't fall asleep because reality is finally better than your dreams.", author: "Dr. Seuss", category: "Love" },
  { quote: "Love doesn't make the world go 'round. Love is what makes the ride worthwhile.", author: "Franklin P. Jones", category: "Love" },
  { quote: "I have decided to stick with love. Hate is too great a burden to bear.", author: "Martin Luther King, Jr.", category: "Love" },
  { quote: "The giving of love is an education in itself.", author: "Eleanor Roosevelt", category: "Love" },
  { quote: "We are most alive when we're in love.", author: "John Updike", category: "Love" },
  { quote: "Love is not only something you feel, it is something you do.", author: "David Wilkerson", category: "Love" },
  { quote: "If I know what love is, it is because of you.", author: "Hermann Hesse", category: "Love" },
  { quote: "The greatest happiness of life is the conviction that we are loved; loved for ourselves, or rather, loved in spite of ourselves.", author: "Victor Hugo", category: "Love" },
  { quote: "All you need is love.", author: "The Beatles", category: "Love" },
  
  // Friendship
  { quote: "A friend is one who knows you and loves you just the same.", author: "Elbert Hubbard", category: "Friendship" },
  { quote: "Friendship is the only cement that will ever hold the world together.", author: "Woodrow Wilson", category: "Friendship" },
  { quote: "A real friend is one who walks in when the rest of the world walks out.", author: "Walter Winchell", category: "Friendship" },
  { quote: "True friendship comes when the silence between two people is comfortable.", author: "David Tyson", category: "Friendship" },
  { quote: "There is nothing on this earth more to be prized than true friendship.", author: "Thomas Aquinas", category: "Friendship" },
  { quote: "Friends are the family you choose.", author: "Jess C. Scott", category: "Friendship" },
  { quote: "Anything is possible when you have the right people there to support you.", author: "Misty Copeland", category: "Friendship" },
  { quote: "A friend is someone who gives you total freedom to be yourself.", author: "Jim Morrison", category: "Friendship" },
  { quote: "The most beautiful discovery true friends make is that they can grow separately without growing apart.", author: "Elisabeth Foley", category: "Friendship" },
  { quote: "In the cookie of life, friends are the chocolate chips.", author: "Unknown", category: "Friendship" },
  { quote: "A good friend is like a four-leaf clover; hard to find and lucky to have.", author: "Irish Proverb", category: "Friendship" },
  { quote: "Many people will walk in and out of your life, but only true friends will leave footprints in your heart.", author: "Eleanor Roosevelt", category: "Friendship" },

  // Life
  { quote: "The purpose of our lives is to be happy.", author: "Dalai Lama", category: "Life" },
  { quote: "Life is what happens when you're busy making other plans.", author: "John Lennon", category: "Life" },
  { quote: "Get busy living or get busy dying.", author: "Stephen King", category: "Life" },
  { quote: "You only live once, but if you do it right, once is enough.", author: "Mae West", category: "Life" },
  { quote: "The unexamined life is not worth living.", author: "Socrates", category: "Life" },
  { quote: "In three words I can sum up everything I've learned about life: it goes on.", author: "Robert Frost", category: "Life" },
  { quote: "Life is a journey, not a destination.", author: "Ralph Waldo Emerson", category: "Life" },
  { quote: "Life is either a daring adventure or nothing at all.", author: "Helen Keller", category: "Life" },
  { quote: "The big lesson in life, baby, is never be scared of anyone or anything.", author: "Frank Sinatra", category: "Life" },
  { quote: "To live is to suffer, to survive is to find some meaning in the suffering.", author: "Friedrich Nietzsche", category: "Life" },
  { quote: "Life is not a problem to be solved, but a reality to be experienced.", author: "Soren Kierkegaard", category: "Life" },
  { quote: "The good life is one inspired by love and guided by knowledge.", author: "Bertrand Russell", category: "Life" },

  // Humor
  { quote: "I'm sick of following my dreams, man. I'm just going to ask where they're going and hook up with ’em later.", author: "Mitch Hedberg", category: "Humor" },
  { quote: "The only thing that separates us from the animals is our ability to accessorize.", author: "Olivia, Steel Magnolias", category: "Humor" },
  { quote: "I find television very educating. Every time somebody turns on the set, I go into the other room and read a book.", author: "Groucho Marx", category: "Humor" },
  { quote: "I am a marvelous housekeeper. Every time I leave a man I keep his house.", author: "Zsa Zsa Gabor", category: "Humor" },
  { quote: "If you want to know what God thinks of money, just look at the people he gave it to.", author: "Dorothy Parker", category: "Humor" },
  { quote: "I'm not superstitious, but I am a little stitious.", author: "Michael Scott, The Office", category: "Humor" },
  { quote: "A day without sunshine is like, you know, night.", author: "Steve Martin", category: "Humor" },
  { quote: "Never follow anyone else's path. Unless you're in the woods and you're lost and you see a path. Then by all means follow that path.", author: "Ellen DeGeneres", category: "Humor" },
  { quote: "I always wanted to be somebody, but now I realize I should have been more specific.", author: "Lily Tomlin", category: "Humor" },
  { quote: "Before you criticize someone, you should walk a mile in their shoes. That way when you criticize them, you are a mile away from them and you have their shoes.", author: "Jack Handey", category: "Humor" },
  { quote: "My fake plants died because I did not pretend to water them.", author: "Mitch Hedberg", category: "Humor" },
  { quote: "I'm sorry, if you were right, I'd agree with you.", author: "Robin Williams", category: "Humor" },

  // Inspirational
  { quote: "The best time to plant a tree was 20 years ago. The second best time is now.", author: "Chinese Proverb", category: "Inspirational" },
  { quote: "Your limitation—it's only your imagination.", author: "Unknown", category: "Inspirational" },
  { quote: "Push yourself, because no one else is going to do it for you.", author: "Unknown", category: "Inspirational" },
  { quote: "Great things never come from comfort zones.", author: "Unknown", category: "Inspirational" },
  { quote: "Dream it. Wish it. Do it.", author: "Unknown", category: "Inspirational" },
  { quote: "Success doesn’t just find you. You have to go out and get it.", author: "Unknown", category: "Inspirational" },
  { quote: "The harder you work for something, the greater you’ll feel when you achieve it.", author: "Unknown", category: "Inspirational" },
  { quote: "Dream bigger. Do bigger.", author: "Unknown", category: "Inspirational" },
  { quote: "Don’t stop when you’re tired. Stop when you’re done.", author: "Unknown", category: "Inspirational" },
  { quote: "Wake up with determination. Go to bed with satisfaction.", author: "Unknown", category: "Inspirational" },
  { quote: "Do something today that your future self will thank you for.", author: "Sean Patrick Flanery", category: "Inspirational" },
  { quote: "It’s going to be hard, but hard does not mean impossible.", author: "Unknown", category: "Inspirational" },

  // Success
  { quote: "Success is walking from failure to failure with no loss of enthusiasm.", author: "Winston Churchill", category: "Success" },
  { quote: "The road to success and the road to failure are almost exactly the same.", author: "Colin R. Davis", category: "Success" },
  { quote: "Success usually comes to those who are too busy to be looking for it.", author: "Henry David Thoreau", category: "Success" },
  { quote: "I cannot give you the formula for success, but I can give you the formula for failure--It is: Try to please everybody.", author: "Herbert Bayard Swope", category: "Success" },
  { quote: "The starting point of all achievement is desire.", author: "Napoleon Hill", category: "Success" },
  { quote: "Success is the sum of small efforts, repeated day-in and day-out.", author: "Robert Collier", category: "Success" },
  { quote: "The only place where success comes before work is in the dictionary.", author: "Vidal Sassoon", category: "Success" },
  { quote: "There are no secrets to success. It is the result of preparation, hard work, and learning from failure.", author: "Colin Powell", category: "Success" },
  { quote: "Patience, persistence and perspiration make an unbeatable combination for success.", author: "Napoleon Hill", category: "Success" },
  { quote: "Success is not in what you have, but who you are.", author: "Bo Bennett", category: "Success" },
  { quote: "The path to success is to take massive, determined action.", author: "Tony Robbins", category: "Success" },
  { quote: "Action is the foundational key to all success.", author: "Pablo Picasso", category: "Success" }
];
