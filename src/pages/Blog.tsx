import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { getAllPosts, reset } from "@/redux/features/blog/blogSlice";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Blog = () => {
  const dispatch = useAppDispatch();
  const { posts, isLoading } = useAppSelector((state) => state.blog);

  useEffect(() => {
    dispatch(getAllPosts());
    return () => {
      dispatch(reset());
    };
  }, [dispatch]);

  const featuredPost = posts[0];
  const otherPosts = posts.slice(1);

  if (isLoading && posts.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-red-600" />
      </div>
    );
  }

  return (
    <div className="bg-white text-gray-900 min-h-screen">
      <section className="py-20 text-center bg-gray-50">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4">
            Real Estate <span className="text-red-600">Insights</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Stay updated with the latest market trends, investment tips, and
            news from the world of real estate.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-20">
        {featuredPost && (
          <section className="mb-16 animate-fade-in-up">
            <Card className="grid lg:grid-cols-2 overflow-hidden border border-gray-200 shadow-sm hover:shadow-xl transition-shadow duration-300">
              <div className="relative">
                <img
                  src={featuredPost.imageUrl}
                  alt={featuredPost.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-8 flex flex-col justify-center">
                <Badge
                  variant="secondary"
                  className="w-fit mb-4 bg-gray-100 text-gray-800"
                >
                  {featuredPost.category}
                </Badge>
                <h2 className="text-3xl font-bold mb-4 text-gray-900">
                  {featuredPost.title}
                </h2>
                <p className="text-gray-600 mb-6">{featuredPost.excerpt}</p>
                <div className="flex items-center gap-4 mb-6">
                  <Avatar>
                    <AvatarImage
                      src={`https://avatar.iran.liara.run/public/boy?username=${featuredPost.author.name}`}
                    />
                    <AvatarFallback>
                      {featuredPost.author.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-gray-800">
                      {featuredPost.author.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(featuredPost.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <Link to={`/blog/${featuredPost.slug}`}>
                  <Button className="w-fit bg-red-600 text-white hover:bg-red-700">
                    Read More <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </Card>
          </section>
        )}

        {otherPosts.length > 0 && (
          <section>
            <h3 className="text-3xl font-bold mb-8 text-center text-gray-900">
              More Articles
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {otherPosts.map((post, index) => (
                <Card
                  key={post._id}
                  className="overflow-hidden bg-white border border-gray-200 hover:shadow-lg transition-shadow duration-300 flex flex-col animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <Link to={`/blog/${post.slug}`} className="block">
                    <img
                      src={post.imageUrl}
                      alt={post.title}
                      className="w-full h-48 object-cover"
                    />
                  </Link>
                  <CardContent className="p-6 flex flex-col flex-grow">
                    <Badge
                      variant="secondary"
                      className="w-fit mb-4 bg-gray-100 text-gray-800"
                    >
                      {post.category}
                    </Badge>
                    <h4 className="text-xl font-bold mb-3 flex-grow">
                      <Link
                        to={`/blog/${post.slug}`}
                        className="text-gray-900 hover:text-red-600 transition-colors"
                      >
                        {post.title}
                      </Link>
                    </h4>
                    <p className="text-gray-600 text-sm mb-4">{post.excerpt}</p>
                    <div className="flex items-center gap-3 mt-auto pt-4 border-t border-gray-200">
                      <Avatar className="w-8 h-8">
                        <AvatarImage
                          src={`https://avatar.iran.liara.run/public/boy?username=${post.author.name}`}
                        />
                        <AvatarFallback>
                          {post.author.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-semibold text-gray-800">
                          {post.author.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(post.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default Blog;
