import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { createPost, reset } from "@/redux/features/blog/blogSlice";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";

const CreatePost = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [category, setCategory] = useState("");

  const { isLoading } = useAppSelector((state) => state.blog);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content || !excerpt || !imageUrl || !category) {
      toast.error("Please fill all fields.");
      return;
    }
    const postData = { title, content, excerpt, imageUrl, category };

    dispatch(createPost(postData))
      .unwrap()
      .then((result) => {
        toast.success("Blog post created successfully!");
        navigate(`/blog/${result.slug}`);
      })
      .catch((err) => {
        toast.error(`Failed to create post: ${err}`);
      })
      .finally(() => {
        dispatch(reset());
      });
  };

  return (
    <div className="container mx-auto max-w-4xl py-8">
      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Create New Blog Post</CardTitle>
            <CardDescription>
              Fill in the details below to publish a new article.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Enter post title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="excerpt">Excerpt (Short Summary)</Label>
              <Input
                id="excerpt"
                placeholder="A short, catchy summary"
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                maxLength={200}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="content">Content (Markdown supported)</Label>
              <Textarea
                id="content"
                placeholder="Write your blog content here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={15}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="imageUrl">Image URL</Label>
                <Input
                  id="imageUrl"
                  placeholder="https://images.unsplash.com/..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  placeholder="e.g., Market Trends"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Publish Post
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
};

export default CreatePost;
