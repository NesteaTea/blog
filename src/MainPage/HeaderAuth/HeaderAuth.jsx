import HeaderAuthClasses from './HeaderAuth.module.scss';
import { Link, useNavigate } from 'react-router-dom';
import { useGetUserQuery } from '../../services/blog-services';

export default function HeaderAuth() {
    const navigate = useNavigate()
    const { data, isLoading } = useGetUserQuery()
    const username = data?.user?.username || 'User'
    const image = data?.user?.image || 'img/avatar.png'

    if (isLoading) {
        return (
            <div className={HeaderAuthClasses.header}>
                <div className={HeaderAuthClasses.headerWrapper}>
                    <div className={HeaderAuthClasses.title}>
                        <Link to='/'>Realworld Blog</Link>
                    </div>
                    <div className={HeaderAuthClasses.infoWrapper}>
                        <div className={HeaderAuthClasses.loader}>
                            <img src="./img/loader.gif" alt=""></img>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={HeaderAuthClasses.header}>
            <div className={HeaderAuthClasses.headerWrapper}>
                <div className={HeaderAuthClasses.title}>
                    <Link to='/'>Realworld Blog</Link>
                </div>
                <div className={HeaderAuthClasses.infoWrapper}>
                    <Link to='/new-article' className={HeaderAuthClasses.createArticle}>Create article</Link>
                    <Link to={'/edit-profile'} className={HeaderAuthClasses.userInfo}>
                        <p className={HeaderAuthClasses.name}>{username}</p>
                        <img className={HeaderAuthClasses.avatar} src={`/${image}`} alt="Avatar" />
                    </Link>
                    <button onClick={() => { sessionStorage.removeItem("token"); navigate('/sign-in') }} className={HeaderAuthClasses.logOut}>Log out</button>
                </div>
            </div>
        </div>
    )
}