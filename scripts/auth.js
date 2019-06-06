    
/// lyt efter auth ændringer
auth.onAuthStateChanged(user => {
    if (user) {
      db.collection('ovelser').onSnapshot(snapshot => {
        setupGuides(snapshot.docs);
        setupUI(user);
        window.location = 'index.html#two';
      }, err => console.log(err.message));
    } else {
      setupUI();
      setupGuides([]);
    }
  });
  
  // opret ny øvelse
  const createForm = document.querySelector('#create-form');
  createForm.addEventListener('submit', (e) => {
    e.preventDefault();
    db.collection('ovelser').add({
      title: createForm.title.value,
      content: createForm.content.value
    }).then(() => {
      // luk modal
      const modal = document.querySelector('#modal-create');
      M.Modal.getInstance(modal).close();
      createForm.reset();
    }).catch(err => {
      console.log(err.message);
    });
  });
  
  // opret bruger
  const signupForm = document.querySelector('#signup-form');
  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // få user info
    const email = signupForm['signup-email'].value;
    const password = signupForm['signup-password'].value;
  
    // opret bruger og få firebase data
    auth.createUserWithEmailAndPassword(email, password).then(cred => {
      return db.collection('users').doc(cred.user.uid).set({
        bio: signupForm['signup-bio'].value
      });
    }).then(() => {
      // luk opret modal
      const modal = document.querySelector('#modal-signup');
      M.Modal.getInstance(modal).close();
      signupForm.reset();
    });
  });
  
  // log ud
  const logout = document.querySelector('#logout');
  logout.addEventListener('click', (e) => {
    e.preventDefault();
    auth.signOut();
  });
  
  // log ind
  const loginForm = document.querySelector('#login-form');
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // få user info
    const email = loginForm['login-email'].value;
    const password = loginForm['login-password'].value;
  
    // log bruger ind
    auth.signInWithEmailAndPassword(email, password).then((cred) => {
      // luk opret modal & reset form
      const modal = document.querySelector('#modal-login');
      M.Modal.getInstance(modal).close();
      loginForm.reset();
    });
  
  });