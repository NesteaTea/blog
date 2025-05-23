import CreatePostClasses from './CreatePost.module.scss';
import Header from '../MainPage/Header/Header';
import HeaderAuth from '../MainPage/HeaderAuth/HeaderAuth';
import { useForm } from "react-hook-form";
import { useCreatePostMutation } from '../services/blog-services';
import { useNavigate } from "react-router-dom";
import { useState } from 'react';

export default function CreatePost() {
    const isLoggedIn = !!sessionStorage.getItem("token");
    const [tags, setTags] = useState(['']);
    const [createPost] = useCreatePostMutation();
    const navigate = useNavigate();

    const { register, handleSubmit, formState: { errors } } = useForm();

    const handleTagChange = (index, value) => {
        const newTags = [...tags];
        newTags[index] = value;
        setTags(newTags);
    }

    const handleAddTag = () => {
        setTags([...tags, '']);
    }

    const handleDeleteTag = (index) => {
        setTags(tags.filter((_, i) => i !== index));
    }

    const onSubmit = async (data) => {
        const filteredTags = tags.filter(tag => tag.trim() !== '');
        const post = {
            article: {
                title: data.title,
                description: data.description,
                body: data.text,
                tagList: filteredTags,
            }
        };
        try {
            await createPost(post).unwrap();
            navigate('/articles');
        } catch (error) {
            console.error('Ошибка при создании поста:', error);
        }
    };

    return (
        <>
            {isLoggedIn ? <HeaderAuth /> : <Header />}
            <div className={CreatePostClasses.container}>
                <h1>Create new article</h1>
                <form className={CreatePostClasses.form} onSubmit={handleSubmit(onSubmit)}>
                    <div className={CreatePostClasses.formContainer}>
                        <div className={CreatePostClasses.formWrapper}>
                            <label>Title</label>
                            <input {...register("title", { required: true })} placeholder='Title' />
                            {errors.title && <span>Title обязателен для заполнения</span>}
                        </div>
                        <div className={CreatePostClasses.formWrapper}>
                            <label>Short description</label>
                            <input {...register("description", { required: true })} placeholder='Short description' />
                            {errors.description && <span>Description обязателен для заполнения</span>}
                        </div>
                        <div className={CreatePostClasses.formWrapper}>
                            <label>Text</label>
                            <textarea {...register("text", { required: true })} placeholder='Text' />
                            {errors.text && <span>Text обязателен для заполнения</span>}
                        </div>
                        <div className={CreatePostClasses.tagsWrapper}>
                            <div className={CreatePostClasses.tagsWrapper}>
                                <p>Tags</p>
                                {tags.map((tag, idx) => (
                                    <div className={CreatePostClasses.formFlex} key={idx}>
                                        <input
                                            className={CreatePostClasses.tags}
                                            name={`tags-${idx}`}
                                            placeholder='Tag'
                                            value={tag}
                                            onChange={e => handleTagChange(idx, e.target.value)}
                                            required
                                        />
                                        {tags.length > 1 && (
                                            <button
                                                type="button"
                                                className={CreatePostClasses.delete}
                                                onClick={() => handleDeleteTag(idx)}
                                            >
                                                Delete
                                            </button>
                                        )}
                                        {idx === tags.length - 1 && (
                                            <button
                                                type="button"
                                                className={CreatePostClasses.add}
                                                onClick={handleAddTag}
                                            >
                                                Add tag
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <button className={CreatePostClasses.send} type="submit">Send</button>
                </form>
            </div>
        </>
    )
}