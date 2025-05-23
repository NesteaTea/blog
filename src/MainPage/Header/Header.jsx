import HeaderClasses from './Header.module.scss'
import { Link } from 'react-router-dom'

export default function Header() {

    return (
        <div className={HeaderClasses.header}>
            <div className={HeaderClasses.headerWrapper}>
                <div className={HeaderClasses.title}>
                    <Link to='/'>Realworld Blog</Link>
                </div>
                <div className={HeaderClasses.authButtonWrapper}>
                    <Link to='/sign-in' className={HeaderClasses.loginButton}>Sign In</Link>
                    <Link to='/sign-up' className={HeaderClasses.regButton}>Sign Up</Link>
                </div>
            </div>
        </div>
    )
}