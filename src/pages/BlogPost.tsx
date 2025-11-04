import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { getPostBySlug, reset } from "@/redux/features/blog/blogSlice";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const dispatch = useAppDispatch();
  const { post, isLoading, isError } = useAppSelector((state) => state.blog);

  useEffect(() => {
    if (slug) {
      dispatch(getPostBySlug(slug));
    }
    return () => {
      dispatch(reset());
    };
  }, [dispatch, slug]);

  if (isLoading || !post) {
    return (
      <div className="flex justify-center items-center min-h-[80vh]">
        <Loader2 className="w-10 h-10 animate-spin text-red-600" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white text-gray-900">
        <h1 className="text-4xl font-bold mb-4">Post Not Found</h1>
        <p className="text-gray-600 mb-8">
          The article you are looking for does not exist.
        </p>
        <Link to="/blog">
          <Button className="bg-red-600 text-white hover:bg-red-700">
            Back to Blog
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white text-gray-900 min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <Link to="/blog" className="mb-8 inline-block">
            <Button
              variant="ghost"
              className="text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to all articles
            </Button>
          </Link>

          <header className="mb-8">
            <Badge
              variant="secondary"
              className="mb-4 bg-gray-100 text-gray-800"
            >
              {post.category}
            </Badge>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4 text-gray-900">
              {post.title}
            </h1>
            <div className="flex items-center gap-4 text-gray-600">
              <Avatar>
                <AvatarImage
                  src={`https://avatar.iran.liara.run/public/boy?username=${post.author.name}`}
                />
                <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-gray-800">
                  {post.author.name}
                </p>
                <p>{new Date(post.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </header>

          <img
            src={post.imageUrl}
            alt={post.title}
            className="w-full rounded-lg mb-8 aspect-video object-cover"
          />

          <article
            className="prose prose-lg max-w-none 
                       prose-headings:text-gray-900 prose-p:text-gray-600 
                       prose-a:text-red-600 hover:prose-a:text-red-700 
                       prose-strong:text-gray-900 prose-blockquote:border-red-600
                       prose-li:marker:text-red-600"
          >
            <ReactMarkdown>{post.content}</ReactMarkdown>
          </article>
        </div>
      </div>
    </div>
  );
};

export default BlogPost;
