import CardsList from './CardsList/CardsList.jsx'
import Header from './Header/Header.jsx'
import HeaderAuth from './HeaderAuth/HeaderAuth.jsx'

function MainPage() {
  const isLoggedIn = !!sessionStorage.getItem("token");

  return (
    <>
      {isLoggedIn ? <HeaderAuth /> : <Header />}
      <CardsList />
    </>
  )
}

export default MainPage
