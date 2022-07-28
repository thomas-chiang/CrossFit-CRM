const Functions = {
  handleSignUp,
  handleSignIn
};

export default Functions;

async function handleSignUp(role, name, email, password, gender, appContext, navigate, setDisable, setAlert) {
  setDisable(true);
  try {
    let response = await fetch(process.env.REACT_APP_API_URL + "user/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        role,
        name,
        email,
        password,
        gender
      })
    });
    let data = await response.json();
    if (response.ok) {
      setAlert("Signed up successfully");
      localStorage.setItem("jwtToken", data.access_token);
      appContext.setUpdate(!appContext.update);
      navigate(-1);
    } else {
      setAlert(data.error);
    }
  } catch (e) {
    setAlert(e.message);
  }
  setDisable(false);
}

async function handleSignIn(role, email, password, appContext, navigate, setDisable, setAlert) {
  setDisable(true);
  try {
    let response = await fetch(process.env.REACT_APP_API_URL + "user/signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        role,
        email,
        password
      })
    });
    let data = await response.json();

    if (response.ok) {
      setAlert("Signed in successfully");
      localStorage.setItem("jwtToken", data.access_token);
      appContext.setUpdate(!appContext.update);
      navigate(-1);
    } else {
      setAlert(data.error);
    }
  } catch (e) {
    setAlert(e.message);
  }
  setDisable(false);
}
