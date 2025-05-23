import { Link } from 'react-router-dom'
import CardClasses from './Card.module.scss'
import { format } from 'date-fns'
import { useState } from 'react'
import { useFavoriteArticleMutation, useUnfavoriteArticleMutation } from '../../services/blog-services'

export default function Card({ title, favoritesCount, tagList, author, createdAt, slug, description, favorited }) {
    const [favorite, setFavorite] = useState(favorited);
    const [count, setCount] = useState(favoritesCount);
    const [favoriteArticle] = useFavoriteArticleMutation();
    const [unfavoriteArticle] = useUnfavoriteArticleMutation();

    const handleLike = async () => {
        if (!favorite) {
            try {
                await favoriteArticle(slug).unwrap();
                setFavorite(true);
                setCount(count + 1);
            } catch (e) {
                console.error('Не удалось оценить пост:', e);
            }
        } else {
            try {
                await unfavoriteArticle(slug).unwrap();
                setFavorite(false);
                setCount(count - 1);
            } catch (e) {
                console.error('Не удалось отменить оценку поста:', e);
            }
        }
    };

    return (
        <div className={CardClasses.card} key={slug}>
            <div className={CardClasses.cardHeader}>
                <div>
                    <div className={CardClasses.titleLike}>
                        <div className={CardClasses.title}>
                            <Link to={`/articles/${slug}`}>{title}</Link>
                        </div>
                        <div className={CardClasses.like} onClick={handleLike} style={{ cursor: 'pointer' }}>
                            {favorite ? (
                                <img src='/img/heart-filled.svg' alt='' />
                            ) : (
                                <img src='/img/heart.svg' alt='' />
                            )}
                            <p>{count}</p>
                        </div>
                    </div>
                    {tagList && tagList.length > 0
                        ? tagList.map((tag, index) => (
                            <div className={CardClasses.tag} key={`tag_${index}`}>{tag}</div>
                        ))
                        : <div className={CardClasses.tag}>SomeTag</div>
                    }
                </div>
                <div className={CardClasses.userInfo}>
                    <div className={CardClasses.info}>
                        <p className={CardClasses.name}>{author?.username}</p>
                        <p className={CardClasses.date}>{format(new Date(createdAt), 'PPP')}</p>
                    </div>
                    <div className={CardClasses.avatar}>
                        <img src={author?.image} alt='Avatar' />
                    </div>
                </div>
            </div>
            <div className={CardClasses.descriptionCard}>
                <p>{description}</p>
            </div>
        </div>
    )
}