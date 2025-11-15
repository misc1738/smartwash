import React from "react";

const posts = [
  {
    title: "5 Essential Car Care Tips for a Lasting Shine",
    excerpt: "Discover how to keep your vehicle looking pristine with these expert tips from our detailing professionals.",
    image: "/images/blog1.jpg",
    date: "2024-06-01",
    author: "SmartWash Team"
  },
  {
    title: "Why Ceramic Coating is Worth the Investment",
    excerpt: "Learn about the benefits of ceramic coating and how it protects your car's paint for years.",
    image: "/images/blog2.jpg",
    date: "2024-05-20",
    author: "SmartWash Team"
  },
  {
    title: "Interior Detailing: More Than Just Clean Seats",
    excerpt: "Explore the importance of deep interior cleaning and sanitization for your health and comfort.",
    image: "/images/blog3.jpg",
    date: "2024-05-10",
    author: "SmartWash Team"
  }
];

const Blog = () => (
  <section className="py-20 bg-gradient-to-b from-muted to-background">
    <div className="container mx-auto px-4">
      <h2 className="text-4xl md:text-5xl font-bold text-center mb-12">Car Care Tips & Articles</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {posts.map((post, idx) => (
          <div key={idx} className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <img src={post.image} alt={post.title} className="w-full h-48 object-cover" />
            <div className="p-6">
              <h3 className="text-2xl font-bold text-primary mb-2">{post.title}</h3>
              <p className="text-gray-700 mb-4">{post.excerpt}</p>
              <div className="text-sm text-gray-400">{post.date} • {post.author}</div>
              <button className="mt-4 py-2 px-6 bg-primary hover:bg-primary-light text-white font-semibold rounded-lg transition-all duration-300">Read More</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Blog;