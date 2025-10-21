function entrar(){


  let email__login = document.querySelector("#email__login")
  let emailLabel = document.querySelector("#emailLabel")
  
  let senha__login = document.querySelector("#senha__login")
  let senhaLabel = document.querySelector("#senhaLabel")
  
  let msgError = document.querySelector("#msgError")
  
  let listaUser = []
  
  

  let userValid = {
      
    email: "",
    senha: "",
    nome: ""
   
  }

  listaUser = JSON.parse(localStorage.getItem("listaUser")) || []
  listaUser.forEach((item) => { 
    if(email__login.value == item.emailUser && senha__login.value == item.senhaUser){


      userValid = {
         email: item.emailUser,
         senha: item.senhaUser,
         nome: item.nomeUser,
       }
      
    }
  })
   
  if(email__login.value == userValid.email && senha__login.value == userValid.senha && email__login.value != "" && senha__login.value != ""){
   
    
    window.location.href = "../paginaPerfil/perfil.html"
    
    
    let mathRandom = Math.random().toString(16).substr(2) 
    let token = mathRandom + mathRandom
    
    localStorage.setItem("token", token)

    localStorage.setItem('userLogado', JSON.stringify(userValid))
    localStorage.setItem('nome', JSON.stringify(nomeUser))
    localStorage.setItem('telefone', JSON.stringify(telefoneUser))

    

  } else {
    msgError.setAttribute('style', 'display: block')
    msgError.innerHTML = "Email ou senha incorretos"
    email__login.classList.add('error__class')
    senha__login.classList.add('error__class')

  }
  
}
