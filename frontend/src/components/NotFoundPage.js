const NotFoundPage = () => {

  return (
    <>
    <div className="error-page">
        <h1>Sorry, the page you are looking for does not exist.</h1>
        <h2>Error 404</h2>
        <div className="error-page-more-info">
          <h3>Don't have an account? Create one <a href="/register">here.</a></h3>
          <h3>If you have an account already, log in <a href="/login">here.</a>  </h3>
        </div>

    </div>
    </>
  )
}

export default NotFoundPage
