import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../../api/axios";

export interface Post {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  imageUrl: string;
  category: string;
  content: string;
  author: { name: string; _id: string };
  status: string;
  createdAt: string;
}

interface CreatePostData {
  title: string;
  content: string;
  excerpt: string;
  imageUrl: string;
  category: string;
}

interface UpdatePostData extends Partial<CreatePostData> {
  status?: string;
}

interface BlogState {
  posts: Post[];
  post: Post | null;
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
  message: string;
}

const initialState: BlogState = {
  posts: [],
  post: null,
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: "",
};

export const getAllPosts = createAsyncThunk(
  "blog/getAll",
  async (_, thunkAPI) => {
    try {
      const response = await API.get("/blogs");
      return response.data.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch posts"
      );
    }
  }
);

export const getAdminAllPosts = createAsyncThunk(
  "blog/getAdminAll",
  async (_, thunkAPI) => {
    try {
      const response = await API.get("/blogs/admin/all");
      return response.data.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch all posts"
      );
    }
  }
);

export const getPostBySlug = createAsyncThunk(
  "blog/getBySlug",
  async (slug: string, thunkAPI) => {
    try {
      const response = await API.get(`/blogs/${slug}`);
      return response.data.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Post not found"
      );
    }
  }
);

export const createPost = createAsyncThunk(
  "blog/create",
  async (postData: CreatePostData, thunkAPI) => {
    try {
      const response = await API.post("/blogs", postData);
      return response.data.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to create post"
      );
    }
  }
);

export const updatePost = createAsyncThunk(
  "blog/update",
  async (
    { id, postData }: { id: string; postData: UpdatePostData },
    thunkAPI
  ) => {
    try {
      const response = await API.put(`/blogs/${id}`, postData);
      return response.data.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to update post"
      );
    }
  }
);

export const deletePost = createAsyncThunk(
  "blog/delete",
  async (id: string, thunkAPI) => {
    try {
      await API.delete(`/blogs/${id}`);
      return id;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to delete post"
      );
    }
  }
);

export const blogSlice = createSlice({
  name: "blog",
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = "";
      state.post = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllPosts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllPosts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.posts = action.payload;
      })
      .addCase(getAdminAllPosts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAdminAllPosts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.posts = action.payload;
      })
      .addCase(getPostBySlug.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getPostBySlug.fulfilled, (state, action) => {
        state.isLoading = false;
        state.post = action.payload;
      })
      .addCase(createPost.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.posts.unshift(action.payload);
      })
      .addCase(updatePost.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.posts = state.posts.map((p) =>
          p._id === action.payload._id ? action.payload : p
        );
      })
      .addCase(deletePost.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.posts = state.posts.filter((p) => p._id !== action.payload);
      })
      .addMatcher(
        (action) => action.type.endsWith("/rejected"),
        (state, action) => {
          state.isLoading = false;
          state.isError = true;
          state.message = action.payload as string;
        }
      );
  },
});

export const { reset } = blogSlice.actions;
export default blogSlice.reducer;
