import Header from "../MainPage/Header/Header";
import HeaderAuth from "../MainPage/HeaderAuth/HeaderAuth";
import CurrentPostClasses from './CurrentPost.module.scss'
import { useState } from 'react';
import { useGetPostQuery, useGetUserQuery, useDeletePostMutation } from "../services/blog-services";
import { useParams, useNavigate } from "react-router-dom";
import ReactMarkdown from 'react-markdown'
import { format } from 'date-fns'

export default function CurrentPost() {
    const { slug } = useParams()
    const { data, isLoading, isError } = useGetPostQuery(slug)
    const isLoggedIn = !!sessionStorage.getItem("token")
    const { data: dataUser } = useGetUserQuery(undefined, { skip: !isLoggedIn })
    const [showModal, setShowModal] = useState(false)
    const [deletePost] = useDeletePostMutation()
    const navigate = useNavigate();

    const handleDelete = async () => {
        try {
            await deletePost(articleSlug).unwrap();
            setShowModal(false);
            navigate('/articles');
        } catch (error) {
            console.error('Ошибка при удалении поста:', error);
        }
    };

    if (isLoading) {
        return <div className={CurrentPostClasses.loader}><img src="/img/loader.gif" alt=""></img></div>;
    }

    if (isError || !data?.article) {
        return (
            <div className={CurrentPostClasses.loader}>
                <p className={CurrentPostClasses.empty}>Сервер не отвечает. Попробуйте позже.</p>
            </div>
        );
    }

    const { title, body, description, createdAt, author, favoritesCount, tagList, slug: articleSlug } = data.article;

    const isAuthor = isLoggedIn && dataUser?.user?.username === author?.username;

    return (
        <>
            {isLoggedIn ? <HeaderAuth /> : <Header />}
            <div className={CurrentPostClasses.card} key={articleSlug}>
                <div className={CurrentPostClasses.cardHeader}>
                    <div>
                        <div className={CurrentPostClasses.titleLike}>
                            <div className={CurrentPostClasses.title}>{title}</div>
                            <div className={CurrentPostClasses.like}>
                                <img src='/img/heart.svg' alt='' />
                                <p>{favoritesCount}</p>
                            </div>
                        </div>
                        {tagList && tagList.length > 0
                            ? tagList.map((tag, index) => (
                                <div className={CurrentPostClasses.tag} key={`tag_${index}`}>{tag}</div>
                            ))
                            : <div className={CurrentPostClasses.tag}>SomeTag</div>
                        }
                    </div>
                    <div className={CurrentPostClasses.userInfo}>
                        <div className={CurrentPostClasses.info}>
                            <p className={CurrentPostClasses.name}>{author?.username}</p>
                            <p className={CurrentPostClasses.date}>{format(new Date(createdAt), 'PPP')}</p>
                        </div>
                        <div className={CurrentPostClasses.avatar}>
                            <img src={author?.image} alt='Avatar' />
                        </div>
                    </div>
                    {showModal && (
                        <div className={CurrentPostClasses.modalOverlay}>
                            <div className={CurrentPostClasses.modal}>
                                <p>Вы уверены, что хотите удалить пост?</p>
                                <div className={CurrentPostClasses.modalActions}>
                                    <button onClick={() => setShowModal(false)} className={CurrentPostClasses.cancel}>Нет</button>
                                    <button onClick={handleDelete} className={CurrentPostClasses.confirm}>Да</button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                <div className={CurrentPostClasses.description}>
                    <p>{description}</p>
                    {isAuthor && (
                        <div className={CurrentPostClasses.actions}>
                            <button
                                className={CurrentPostClasses.delete}
                                onClick={() => setShowModal(true)}
                            >
                                Delete
                            </button>
                            <button
                                className={CurrentPostClasses.edit}
                                onClick={() => navigate(`/articles/${articleSlug}/edit`)}
                            >
                                Edit
                            </button>
                        </div>
                    )}
                </div>
                <div className={CurrentPostClasses.bodyCard}>
                    <ReactMarkdown>{body}</ReactMarkdown>
                </div>
            </div>
        </>
    )
}