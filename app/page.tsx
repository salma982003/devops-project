"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import AuthButton from "@/components/auth-button";
import { PlusCircle, Moon, Sun, Home as HomeIcon, Mail, Twitter, Linkedin, Facebook, Search, X } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import PostCard from "@/components/post-card";
// 🚀 Amélioration UI - Feature DevOps Demo
interface Post {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  tags: string[];
  slug: string;
  author: {
    name: string | null;
    image: string | null;
  };
  _count: {
    comments: number;
    likes: number;
  };
  image?: string;
}

interface PostCardProps {
  post: Post;
  isAdmin: boolean;
  onDelete: (postId: string) => Promise<void>;
  className?: string;
}

export default function Home() {
  const { data: session } = useSession();
  const isAdmin = (session?.user as any)?.role === "ADMIN";
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [tagQuery, setTagQuery] = useState("");

  const postsPerPage = 6;

  useEffect(() => {
    setMounted(true);
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/posts');
        const data = await response.json();
        setPosts(data);
        setFilteredPosts(data);
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      }
    };
    fetchPosts();
  }, []);

  useEffect(() => {
  let result = [...posts];
  
  
  if (tagQuery.trim() !== "") {
    const tagToSearch = tagQuery.toLowerCase();
    result = result.filter((post: Post) =>
      post.tags.some((tag: string) => tag.toLowerCase().includes(tagToSearch))
    );
  }

  
  if (selectedFilter) {
    result = result.filter((post: Post) => 
      post.tags.includes(selectedFilter) || 
      post.title.includes(selectedFilter) || 
      post.content.includes(selectedFilter)
    );
  }
  
  
  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    result = result.filter((post: Post) => 
      post.title.toLowerCase().includes(query) || 
      post.content.toLowerCase().includes(query) ||
      post.tags.some((tag: string) => tag.toLowerCase().includes(query))
    );
  }
  
  setFilteredPosts(result);
}, [selectedFilter, searchQuery, tagQuery, posts]);


  const handleFilter = (tag: string) => {
    if (selectedFilter === tag) {
      setSelectedFilter(null);
    } else {
      setSelectedFilter(tag);
    }
  };

  const clearFilter = () => {
    setSelectedFilter(null);
    setSearchQuery("");
    setTagQuery("");
  };

  const handleToggleTheme = () => {
    if (!mounted) return;
    setTheme(theme === "light" ? "dark" : "light");
  };

  const handleDelete = async (postId: string) => {
    try {
      await fetch(`/api/posts/${postId}`, {
        method: "DELETE",
      });
      setPosts(posts.filter((post) => post.id !== postId));
      setFilteredPosts(filteredPosts.filter((post) => post.id !== postId));
    } catch (error) {
      console.error("Échec de la suppression :", error);
    }
  };

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  return (
    <div className="min-h-screen flex flex-col text-foreground bg-gradient-to-br from-[#d1fae5] via-white to-[#ecfdf5] dark:from-[#022c22] dark:via-zinc-900 dark:to-black">
      
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
        <div className="absolute top-20 left-10 w-64 h-64 bg-green-100 dark:bg-green-900/20 rounded-full filter blur-3xl opacity-20 animate-float"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-green-200 dark:bg-green-800/20 rounded-full filter blur-3xl opacity-20 animate-float-delay"></div>
      </div>
      
      <header className="sticky top-0 z-50 bg-white dark:bg-zinc-900/90 backdrop-blur-md border-b border-green-200/50 dark:border-green-900/50 shadow-sm transition-colors">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center">
            <button 
              className="md:hidden mr-3 text-green-700 dark:text-green-300"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>
            
            <Link href="/" className="flex items-center gap-2 group">
              <img 
                src="salma.png"
                alt="Xpresinsight Logo" 
                className="h-10 w-10 object-contain transition-all duration-300 group-hover:rotate-12"
              />
              <span className="text-2xl font-bold tracking-tight bg-gradient-to-r from-green-700 to-green-600 dark:from-green-400 dark:to-green-300 bg-clip-text text-transparent group-hover:bg-gradient-to-r group-hover:from-green-600 group-hover:to-green-500 transition-all duration-500">
                Xpresinsight<span className="text-primary">Blog     </span>
              </span>
            </Link>
          </div>

          {mobileMenuOpen && (
            <div className="absolute top-full left-0 w-full bg-white dark:bg-zinc-900 py-4 px-4 shadow-lg md:hidden z-50">
              <nav className="flex flex-col gap-2 text-sm font-medium">
                <Link href="/" className="hover:text-green-600 dark:hover:text-green-400 flex items-center gap-1 transition-all px-3 py-2 rounded-lg hover:bg-green-50/50 dark:hover:bg-green-900/20 group">
                  <HomeIcon className="w-4 h-4" /> 
                  <span>   Home</span>
                </Link>
                <Link href="#categories" className="hover:text-green-600 dark:hover:text-green-400 transition-all px-3 py-2 rounded-lg hover:bg-green-50/50 dark:hover:bg-green-900/20 group">
                  <span>Categories</span>
                </Link>
                <Link href="#about" className="hover:text-green-600 dark:hover:text-green-400 transition-all px-3 py-2 rounded-lg hover:bg-green-50/50 dark:hover:bg-green-900/20 group">
                  <span>About Us</span>
                </Link>
                <Link href="#contact" className="hover:text-green-600 dark:hover:text-green-400 transition-all px-3 py-2 rounded-lg hover:bg-green-50/50 dark:hover:bg-green-900/20 group">
                  <span>Contact</span>
                </Link>
              </nav>
            </div>
          )}

          <nav className="hidden md:flex gap-2 text-sm font-medium items-center">
            <Link href="/" className="hover:text-green-600 dark:hover:text-green-400 flex items-center gap-1 transition-all px-3 py-2 rounded-lg hover:bg-green-50/50 dark:hover:bg-green-900/20 group">
              <HomeIcon className="w-4 h-4 transition-transform group-hover:scale-125" /> 
              <span className="transition-all group-hover:translate-x-0.5">Home</span>
            </Link>
            <Link href="#categories" className="hover:text-green-600 dark:hover:text-green-400 transition-all px-3 py-2 rounded-lg hover:bg-green-50/50 dark:hover:bg-green-900/20 group">
              <span className="transition-all group-hover:translate-x-0.5">Categories</span>
            </Link>
            <Link href="#about" className="hover:text-green-600 dark:hover:text-green-400 transition-all px-3 py-2 rounded-lg hover:bg-green-50/50 dark:hover:bg-green-900/20 group">
              <span className="transition-all group-hover:translate-x-0.5">About Us</span>
            </Link>
            <Link href="#contact" className="hover:text-green-600 dark:hover:text-green-400 transition-all px-3 py-2 rounded-lg hover:bg-green-50/50 dark:hover:bg-green-900/20 group">
              <span className="transition-all group-hover:translate-x-0.5">Contact</span>
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <div className="relative hidden md:block">
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                className="w-40 lg:w-56 px-4 py-2 rounded-full border border-green-200 dark:border-green-800 bg-white dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
              />
              {searchQuery ? (
                <button 
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="h-4 w-4" />
                </button>
              ) : (
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              )}
            </div>

            {!session?.user && (
              <Link href="/login">
                <Button variant="outline" size="sm" className="border-green-600 text-green-700 hover:bg-green-50 dark:hover:bg-green-900/20 hover:shadow-md transition-all hover:-translate-y-0.5">
                  Sign in
                </Button>
              </Link>
            )}

            {isAdmin && (
              <Link href="/admin/create">
                <Button variant="secondary" size="sm" className="flex items-center gap-1 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white hover:shadow-md transition-all hover:-translate-y-0.5 shadow-green-200/50 dark:shadow-green-900/20">
                  <PlusCircle className="w-4 h-4" /> Create
                </Button>
              </Link>
            )}

            {session?.user && <AuthButton />}

            <Button
              variant="ghost"
              size="icon"
              onClick={handleToggleTheme}
              aria-label="Toggle Theme"
              className="text-green-700 dark:text-green-400 hover:bg-green-100/50 dark:hover:bg-green-900/20 hover:shadow-md transition-all hover:-translate-y-0.5"
            >
              {mounted ? (
                theme === "dark" ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-12 space-y-16 relative z-10 overflow-x-hidden">

        {/* Hero Section */}
        <section className="text-center space-y-6 relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-50/50 to-white dark:from-green-900/10 dark:to-zinc-900 p-8 md:p-12 shadow-sm border border-green-200/50 dark:border-green-900/30">
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
            <div className="absolute top-0 right-0 w-32 h-32 bg-green-200/20 dark:bg-green-800/20 rounded-full filter blur-xl"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-green-300/10 dark:bg-green-700/10 rounded-full filter blur-xl"></div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-green-600 to-green-800 dark:from-green-400 dark:to-green-600 bg-clip-text text-transparent animate-fade-in">
            Welcome to Xpresinsight Blog
          </h1>
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto animate-fade-in delay-100">
            Agrifood B2B Content Hub — Explore expert analysis, innovation, and market intelligence across the agrifood business landscape.
          </p>
          
          {/* Barre de recherche mobile */}
          <div className="md:hidden mt-6">
            <div className={`relative transition-all duration-300 ${isSearchFocused ? 'w-full' : 'w-full'}`}>
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                className="w-full px-4 py-2 pl-10 rounded-full border border-green-200 dark:border-green-800 bg-white dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section id="categories" className="space-y-8 animate-fade-in delay-200">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-green-700 dark:text-green-400 inline-block relative pb-2">
              Filter by Category
              <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-0.5 bg-green-500 dark:bg-green-400 rounded-full"></span>
            </h2>
            
          </div>
          
          <div className="flex flex-wrap justify-center gap-3">
            {["AgriTech", "Olive Oil", "Sustainability", "Halal Logistics", "Logistics", "Packaging"].map((tag) => (
              <span
                key={tag}
                onClick={() => handleFilter(tag)}
                className={`px-4 py-2 rounded-full text-sm font-medium cursor-pointer transition-all hover:scale-105 shadow-sm hover:shadow-md backdrop-blur-sm
                  ${selectedFilter === tag 
                    ? 'bg-green-600 text-white dark:bg-green-700' 
                    : 'bg-green-100/70 dark:bg-green-900/30 text-green-800 dark:text-green-200 hover:bg-green-600 hover:text-white dark:hover:bg-green-600'
                  }`}
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="flex justify-center mt-4">
            <input
              type="text"
              placeholder="           Search by tag         "
              value={tagQuery}
              onChange={(e) => setTagQuery(e.target.value)}
             
              className="px-4 py-2   rounded-full border border-green-200 dark:border-green-800 bg-white dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          
          {(selectedFilter || searchQuery) && (
            <div className="text-center">
              <button 
                onClick={clearFilter}
                className="text-sm text-green-700 hover:underline mt-2 transition-all hover:text-green-700 dark:hover:text-green-300 flex items-center justify-center mx-auto"
              >
                Clear filters
                <X className="h-4 w-4 ml-1" />
              </button>
            </div>
          )}
        </section>

        {/* Posts Section */}
        <section className="animate-fade-in delay-300">
          <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
            <div className="text-center md:text-left">
              <h2 className="text-2xl font-semibold text-green-700 dark:text-green-400 inline-block relative pb-2">
                Latest Articles
                <span className="absolute bottom-0 left-1/2 md:left-0 transform md:transform-none -translate-x-1/2 w-16 h-0.5 bg-green-500 dark:bg-green-400 rounded-full"></span>
              </h2>
              <p className="text-muted-foreground mt-2">
                Discover our most recent publications and stay updated with the latest trends
              </p>
            </div>
            
            <div className="text-sm text-muted-foreground">
              {filteredPosts.length} {filteredPosts.length === 1 ? 'article' : 'articles'} found
              {(selectedFilter || searchQuery) && (
                <span className="ml-2 text-green-600 dark:text-green-400">
                  {selectedFilter && `• Filter: ${selectedFilter}`}
                  {searchQuery && `• Search: "${searchQuery}"`}
                </span>
              )}
            </div>
          </div>
          
          {filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {currentPosts.map((post) => (
                <div 
                  key={post.id} 
                  className="transition-all duration-300 hover:-translate-y-2 hover:shadow-lg group"
                >
                  <PostCard 
                    post={post}
                    isAdmin={isAdmin}
                    onDelete={handleDelete} 
                  
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 px-4 border border-green-200 dark:border-green-800 rounded-lg shadow-sm bg-green-50/50 dark:bg-green-900/10">
              <div className="bg-gray-200 dark:bg-gray-700 border-2 border-dashed rounded-xl w-16 h-16 mb-4" />
              <h3 className="text-xl font-semibold text-green-700 dark:text-green-300 mb-2">
                No articles found
              </h3>
              <p className="text-muted-foreground text-center max-w-md">
                {posts.length === 0 
                  ? "There are no articles published yet." 
                  : "No articles match your search criteria. Try different keywords or clear filters."
                }
              </p>
              {(selectedFilter || searchQuery) && (
                <button 
                  onClick={clearFilter}
                  className="mt-4 px-4 py-2 rounded-full bg-green-200 dark:bg-green-900/30 text-green-800 dark:text-green-200 hover:bg-green-200 dark:hover:bg-green-800/50 transition-colors"
                >
                  Clear filters
                </button>
              )}
            </div>
          )}

          {filteredPosts.length > 0 && (
            <div className="flex justify-center items-center gap-2 mt-8 flex-wrap">
              <Button
                variant="outline"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => prev - 1)}
                className="border-green-600/50 text-green-700 hover:bg-green-50/50 dark:hover:bg-green-900/20 transition-all"
              >
                Previous
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  onClick={() => setCurrentPage(page)}
                  className={`${
                    currentPage === page 
                      ? 'bg-green-600 text-white hover:bg-green-700' 
                      : 'border-green-600/50 text-green-700 hover:bg-green-50/50 dark:hover:bg-green-900/20'
                  } transition-all`}
                >
                  {page}
                </Button>
              ))}
              <Button
                variant="outline"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => prev + 1)}
                className="border-green-600/50 text-green-700 hover:bg-green-50/50 dark:hover:bg-green-900/20 transition-all"
              >
                Next
              </Button>
            </div>
          )}
        </section>

        {/* Category Highlights Section */}
        <section className="bg-green-50/30 dark:bg-green-900/10 p-6 rounded-2xl shadow-sm border border-green-200/50 dark:border-green-900/30 animate-fade-in delay-400">
          <h2 className="text-2xl font-bold text-green-700 dark:text-green-400 mb-6 pb-2 border-b border-green-200/50 dark:border-green-800/30">
            Popular Categories
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { 
                title: "AgriTech Innovations", 
                description: "Latest technologies transforming agriculture", 
                count: "0 articles" 
              },
              { 
                title: "Sustainable Practices", 
                description: "Eco-friendly solutions for modern farming", 
                count: "1 articles" 
              },
              { 
                title: "Global Food Logistics", 
                description: "Supply chain insights and innovations", 
                count: "4 articles" 
              }
            ].map((category, index) => (
              <div 
                key={index} 
                className="bg-white dark:bg-zinc-800/80 p-5 rounded-xl shadow-sm border border-green-200/50 dark:border-green-800/50 transition-all hover:shadow-md hover:-translate-y-1"
              >
                <div className="flex items-start mb-4">
                  <div className="bg-green-100 dark:bg-green-900/20 rounded-lg p-3 mr-4">
                    <div className="bg-gray-200 dark:bg-gray-700 border-2 border-dashed rounded-xl w-10 h-10" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-green-700 dark:text-green-300">{category.title}</h3>
                    <p className="text-sm text-muted-foreground">{category.count}</p>
                  </div>
                </div>
                <p className="text-muted-foreground mb-4">{category.description}</p>
                
              </div>
            ))}
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="bg-green-50/50 dark:bg-green-900/10 p-8 md:p-12 rounded-2xl shadow-inner border border-green-200/50 dark:border-green-900/30 text-center space-y-6 animate-fade-in delay-400 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-20 h-20 bg-green-200/20 dark:bg-green-800/20 rounded-full filter blur-lg"></div>
          </div>
          <div className="relative">
            <h2 className="text-2xl font-bold text-green-700 dark:text-green-400 inline-block relative pb-2">
              About the Blog
              <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-0.5 bg-green-500 dark:bg-green-400 rounded-full"></span>
            </h2>
            <p className="text-muted-foreground text-md max-w-2xl mx-auto mt-4">
              Xpresinsight is a B2B content platform focused on agrifood innovation, policy, and business growth.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-white/80 dark:bg-zinc-800/80 p-6 rounded-xl shadow-sm border border-green-200/50 dark:border-green-800/50 flex flex-col items-center justify-center backdrop-blur-sm transition-all hover:shadow-md hover:-translate-y-1">
              <div className="w-16 h-16 bg-green-100/50 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-green-600 dark:text-green-400">10+</span>
              </div>
              <span className="text-sm font-medium text-muted-foreground">Articles</span>
            </div>
            <div className="bg-white/80 dark:bg-zinc-800/80 p-6 rounded-xl shadow-sm border border-green-200/50 dark:border-green-800/50 flex flex-col items-center justify-center backdrop-blur-sm transition-all hover:shadow-md hover:-translate-y-1">
              <div className="w-16 h-16 bg-green-100/50 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-green-600 dark:text-green-400">50+</span>
              </div>
              <span className="text-sm font-medium text-muted-foreground">Authors</span>
            </div>
            <div className="bg-white/80 dark:bg-zinc-800/80 p-6 rounded-xl shadow-sm border border-green-200/50 dark:border-green-800/50 flex flex-col items-center justify-center backdrop-blur-sm transition-all hover:shadow-md hover:-translate-y-1">
              <div className="w-16 h-16 bg-green-100/50 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-green-600 dark:text-green-400">1K+</span>
              </div>
              <span className="text-sm font-medium text-muted-foreground">Readers</span>
            </div>
          </div>
        </section>

        

        {/* Contact Section */}
        <section id="contact" className="text-center space-y-6 animate-fade-in delay-500">
          <div className="relative">
            <h2 className="text-2xl font-bold text-green-700 dark:text-green-400 inline-block relative pb-2">
              Contact Us
              <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-0.5 bg-green-500 dark:bg-green-400 rounded-full"></span>
            </h2>
            <p className="text-muted-foreground mt-4 max-w-lg mx-auto">
              Have questions or want to collaborate? We'd love to hear from you.
            </p>
          </div>
          <div className="flex flex-col items-center justify-center gap-2 mt-4">
            <a 
              href="mailto:contact@xpresinsight.com" 
              className="flex items-center gap-2 text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 transition-colors font-medium group"
            >
              <Mail className="w-5 h-5 transition-transform group-hover:scale-110" />
              <span className="border-b border-transparent group-hover:border-green-600 dark:group-hover:border-green-400 transition-all">
                contact@xpresinsight.com
              </span>
            </a>
          </div>
          <div className="flex justify-center gap-4 mt-8">
            <Button 
              variant="outline" 
              size="sm" 
              className="border-green-600/50 text-green-700 hover:bg-green-50/50 dark:hover:bg-green-900/20 flex items-center gap-2 transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              <Twitter className="w-4 h-4" /> Twitter
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="border-green-600/50 text-green-700 hover:bg-green-50/50 dark:hover:bg-green-900/20 flex items-center gap-2 transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              <Linkedin className="w-4 h-4" /> LinkedIn
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="border-green-600/50 text-green-700 hover:bg-green-50/50 dark:hover:bg-green-900/20 flex items-center gap-2 transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              <Facebook className="w-4 h-4" /> Facebook
            </Button>
          </div>
        </section>
      </main>

      <footer className="border-t border-green-200/50 dark:border-green-900/30 text-sm bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand Section */}
          <div className="text-center md:text-left">
            <Link href="/" className="flex items-center justify-center md:justify-start gap-2 group mb-4">
              <img 
                src="/salma.png"
                alt="Xpresinsight Logo"
                className="h-8 w-8 object-contain transition-transform group-hover:rotate-12"
              />
              <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-green-700 to-green-600 dark:from-green-400 dark:to-green-300 bg-clip-text text-transparent">
                Xpresinsight<span className="text-primary">Blog</span>
              </span>
            </Link>
            <p className="text-muted-foreground text-sm max-w-xs">
              B2B content platform focused on agrifood innovation and business growth.
            </p>
          </div>

          {/* Quick Links */}
          <div className="text-center">
            <h4 className="font-semibold text-green-700 dark:text-green-400 mb-4">Quick Links</h4>
            <div className="flex flex-col gap-2">
              <Link href="/" className="text-muted-foreground hover:text-green-600 dark:hover:text-green-400 transition-colors">
                Home
              </Link>
              <Link href="#categories" className="text-muted-foreground hover:text-green-600 dark:hover:text-green-400 transition-colors">
                Categories
              </Link>
              <Link href="#about" className="text-muted-foreground hover:text-green-600 dark:hover:text-green-400 transition-colors">
                About
              </Link>
            </div>
          </div>

          {/* DevOps Info */}
          <div className="text-center md:text-right">
            <h4 className="font-semibold text-blue-600 dark:text-blue-400 mb-4">DevOps Project</h4>
            <div className="text-xs text-muted-foreground space-y-1">
              <p>✅ CI/CD Pipeline</p>
              <p>🚀 Automated Deployment</p>
              <p>🐳 Docker Containerized</p>
              <p>🧪 Smoke Tests</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-green-200/30 dark:border-green-900/20 text-center">
          <p className="text-xs text-muted-foreground/70">
            © {new Date().getFullYear()} Xpresinsight – All rights reserved. | 
            <span className="text-blue-500 ml-1">DevOps Pipeline Demo</span>
          </p>
        </div>
      </div>
    </footer>

      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(2deg); }
        }
        @keyframes float-delay {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(20px) rotate(-2deg); }
        }
        .animate-float { animation: float 8s ease-in-out infinite; }
        .animate-float-delay { animation: float-delay 10s ease-in-out infinite; }

        .animate-fade-in { animation: fadeIn 0.5s ease-out forwards; opacity: 0; }
        .animate-fade-in.delay-100 { animation-delay: 0.1s; }
        .animate-fade-in.delay-200 { animation-delay: 0.2s; }
        .animate-fade-in.delay-300 { animation-delay: 0.3s; }
        .animate-fade-in.delay-400 { animation-delay: 0.4s; }
        .animate-fade-in.delay-500 { animation-delay: 0.5s; }
        .animate-fade-in.delay-600 { animation-delay: 0.6s; }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}