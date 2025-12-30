
//Earlier we are using this method to pretect the page, But now we are managing it in app.js 
const Protected = ({ children }) => {

  return(
    <>
    {
      children
    }
    </>
  )
  

}

export default Protected;