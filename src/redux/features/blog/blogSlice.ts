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
  author: { name: string };
  createdAt: string;
}

interface CreatePostData {
  title: string;
  content: string;
  excerpt: string;
  imageUrl: string;
  category: string;
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
      .addCase(getAllPosts.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      })
      .addCase(getPostBySlug.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getPostBySlug.fulfilled, (state, action) => {
        state.isLoading = false;
        state.post = action.payload;
      })
      .addCase(getPostBySlug.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      })
      .addCase(createPost.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.posts.unshift(action.payload);
      })
      .addCase(createPost.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      });
  },
});

export const { reset } = blogSlice.actions;
export default blogSlice.reducer;
