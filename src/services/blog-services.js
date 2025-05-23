import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const blogApi = createApi({
    reducerPath: 'blogApi',
    tagTypes: ['Posts'],
    baseQuery: fetchBaseQuery({
        baseUrl: 'https://blog-platform.kata.academy/api/',
        prepareHeaders: (headers) => {
            const token = sessionStorage.getItem('token');
            if (token) {
                headers.set('Authorization', `Token ${token}`);
            }
            return headers;
        },
    }),
    endpoints: (build) => ({
        getPosts: build.query({
            query: (offset = 0) => `articles?limit=5&offset=${offset}`,
            providesTags: (result) => {
                return result
                    ? [...result.articles.map(({ slug }) => ({ type: 'Posts', slug })), { type: 'Posts', id: 'LIST' }]
                    : [{ type: 'Posts', id: 'LIST' }]
            },
        }),
        getPost: build.query({
            query: (slug) => `articles/${slug}`,
            providesTags: (slug) => [{ type: 'Posts', slug }],
        }),
        registerUser: build.mutation({
            query: (user) => ({
                url: 'users',
                method: 'POST',
                body: user,
            }),
            invalidatesTags: [{ type: 'Posts', id: 'LIST' }],
        }),
        loginUser: build.mutation({
            query: (user) => ({
                url: 'users/login',
                method: 'POST',
                body: user,
            }),
            invalidatesTags: [{ type: 'Posts', id: 'LIST' }],
        }),
        getUser: build.query({
            query: () => ({
                url: 'user',
                method: 'GET',
            }),
            providesTags: [{ type: 'Posts', id: 'LIST' }],
        }),
        updateUser: build.mutation({
            query: (user) => ({
                url: 'user',
                method: 'PUT',
                body: user,
            }),
            invalidatesTags: [{ type: 'Posts', id: 'LIST' }],
        }),
        createPost: build.mutation({
            query: (post) => ({
                url: 'articles',
                method: 'POST',
                body: post,
            }),
            invalidatesTags: [{ type: 'Posts', id: 'LIST' }],
        }),
        updatePost: build.mutation({
            query: ({ slug, article }) => ({
                url: `articles/${slug}`,
                method: 'PUT',
                body: { article },
            }),
            invalidatesTags: [{ type: 'Posts', id: 'LIST' }],
        }),
        deletePost: build.mutation({
            query: (slug) => ({
                url: `articles/${slug}`,
                method: 'DELETE',
            }),
            invalidatesTags: [{ type: 'Posts', id: 'LIST' }],
        }),
        favoriteArticle: build.mutation({
            query: (slug) => ({
                url: `articles/${slug}/favorite`,
                method: 'POST',
            }),
            invalidatesTags: [{ type: 'Posts', id: 'LIST' }],
        }),
        unfavoriteArticle: build.mutation({
            query: (slug) => ({
                url: `articles/${slug}/favorite`,
                method: 'DELETE',
            }),
            invalidatesTags: [{ type: 'Posts', id: 'LIST' }],
        }),
    })
})

export const { useGetPostsQuery,
    useGetPostQuery,
    useRegisterUserMutation,
    useLoginUserMutation,
    useUpdateUserMutation,
    useGetUserQuery,
    useCreatePostMutation,
    useUpdatePostMutation,
    useDeletePostMutation,
    useFavoriteArticleMutation,
    useUnfavoriteArticleMutation } = blogApi

export default blogApi