import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  getAdminAllPosts,
  deletePost,
  reset,
  Post,
} from "@/redux/features/blog/blogSlice";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, PlusCircle, Loader2 } from "lucide-react";
import EditPostModal from "@/pages/admin/EditPostModal"; // Naya component import karein

const ManageBlogs = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { posts, isLoading, isError, message } = useAppSelector(
    (state) => state.blog
  );

  // Modal ke liye state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  useEffect(() => {
    dispatch(getAdminAllPosts());
    return () => {
      dispatch(reset());
    };
  }, [dispatch]);

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
  }, [isError, message]);

  const handleDelete = (id: string) => {
    if (
      window.confirm("Are you sure you want to delete this post permanently?")
    ) {
      dispatch(deletePost(id))
        .unwrap()
        .then(() => toast.success("Post deleted successfully."))
        .catch((err) => toast.error(`Failed to delete post: ${err}`));
    }
  };

  // Edit button par click handle karne ke liye function
  const handleEditClick = (post: Post) => {
    setSelectedPost(post);
    setIsModalOpen(true);
  };

  const getStatusBadge = (status: string) => {
    return status === "Published"
      ? "border-green-500/50 bg-green-500/10 text-green-700"
      : "border-yellow-500/50 bg-yellow-500/10 text-yellow-700";
  };

  if (isLoading && posts.length === 0) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Manage Blog Posts</h1>
          <p className="text-muted-foreground">
            Here you can edit, delete, and manage all articles.
          </p>
        </div>
        <Button onClick={() => navigate("/admin/create-post")}>
          <PlusCircle className="w-4 h-4 mr-2" />
          Create New Post
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Posts</CardTitle>
          <CardDescription>
            A list of all blog posts in your database.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden md:table-cell">
                  Created At
                </TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {posts.length > 0 ? (
                posts.map((post) => (
                  <TableRow key={post._id}>
                    <TableCell className="font-medium">{post.title}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{post.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusBadge(post.status)}>
                        {post.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem
                            onClick={() => navigate(`/blog/${post.slug}`)}
                          >
                            View Post
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleEditClick(post)}
                          >
                            Edit Post
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600 focus:text-red-600 focus:bg-red-50"
                            onSelect={() => handleDelete(post._id)}
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    No posts found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Modal ko render karein */}
      <EditPostModal
        post={selectedPost}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default ManageBlogs;
