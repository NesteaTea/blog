import EditPostClasses from './EditPost.module.scss';
import Header from '../MainPage/Header/Header';
import HeaderAuth from '../MainPage/HeaderAuth/HeaderAuth';
import { useForm } from "react-hook-form";
import { useGetPostQuery, useUpdatePostMutation } from '../services/blog-services';
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from 'react';

export default function CurrentPost() {
    const isLoggedIn = !!sessionStorage.getItem("token");
    const { slug } = useParams();
    const { data, isLoading } = useGetPostQuery(slug);
    const [updatePost] = useUpdatePostMutation();
    const navigate = useNavigate();

    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const [tags, setTags] = useState(['']);

    useEffect(() => {
        if (data?.article) {
            reset({
                title: data.article.title,
                description: data.article.description,
                text: data.article.body,
            });
            setTags(data.article.tagList.length ? data.article.tagList : ['']);
        }
    }, [data, reset]);

    const handleTagChange = (index, value) => {
        const newTags = [...tags];
        newTags[index] = value;
        setTags(newTags);
    };

    const handleAddTag = () => setTags([...tags, '']);
    const handleDeleteTag = (index) => setTags(tags.filter((_, i) => i !== index));

    const onSubmit = async (formData) => {
        const filteredTags = tags.filter(tag => tag.trim() !== '');
        const post = {
            article: {
                title: formData.title,
                description: formData.description,
                body: formData.text,
                tagList: filteredTags,
            }
        };
        try {
            await updatePost({ slug, ...post }).unwrap();
            navigate(`/articles/${slug}`);
        } catch (error) {
            console.error('Ошибка при обновлении поста:', error);
        }
    };

    if (isLoading) return <div>Загрузка...</div>;

    return (
        <>
            {isLoggedIn ? <HeaderAuth /> : <Header />}
            <div className={EditPostClasses.container}>
                <h1>Edit article</h1>
                <form className={EditPostClasses.form} onSubmit={handleSubmit(onSubmit)}>
                    <div className={EditPostClasses.formContainer}>
                        <div className={EditPostClasses.formWrapper}>
                            <label>Title</label>
                            <input {...register("title", { required: true })} placeholder='Title' />
                            {errors.title && <span>Title обязателен для заполнения</span>}
                        </div>
                        <div className={EditPostClasses.formWrapper}>
                            <label>Short description</label>
                            <input {...register("description", { required: true })} placeholder='Short description' />
                            {errors.description && <span>Description обязателен для заполнения</span>}
                        </div>
                        <div className={EditPostClasses.formWrapper}>
                            <label>Text</label>
                            <textarea {...register("text", { required: true })} placeholder='Text' />
                            {errors.text && <span>Text обязателен для заполнения</span>}
                        </div>
                        <div className={EditPostClasses.tagsWrapper}>
                            {tags.map((tag, idx) => (
                                <div className={EditPostClasses.formFlex} key={idx}>
                                    <input
                                        className={EditPostClasses.tags}
                                        name={`tags-${idx}`}
                                        placeholder='Tag'
                                        value={tag}
                                        onChange={e => handleTagChange(idx, e.target.value)}
                                        required
                                    />
                                    {tags.length > 1 && (
                                        <button
                                            type="button"
                                            className={EditPostClasses.delete}
                                            onClick={() => handleDeleteTag(idx)}
                                        >
                                            Delete
                                        </button>
                                    )}
                                    {idx === tags.length - 1 && (
                                        <button
                                            type="button"
                                            className={EditPostClasses.add}
                                            onClick={handleAddTag}
                                        >
                                            Add tag
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                    <button className={EditPostClasses.send} type="submit">Save</button>
                </form>
            </div>
        </>
    )
}