const BASE_URL = "http://localhost:8081";

function openSignup() {
  createPopup('signup');
}

function openLogin() {
  createPopup('login');
}

function createPopup(type) {
  closePopup();

  let overlay = document.createElement("div");
  overlay.className = "overlay";
  overlay.id = "popupOverlay";

  let box = document.createElement("div");
  box.className = "popup-box";

  if (type === 'signup') {
    box.innerHTML = `
      <h2>Sign Up</h2>
      <input type="text" id="name" placeholder="Full Name"><br>
      <input type="email" id="email" placeholder="Email"><br>
      <input type="password" id="password" placeholder="Password"><br>
      <button onclick="submitSignup()">Register</button><br>
      <button class="close-btn" onclick="closePopup()">Close</button>
      <p class="switch" onclick="switchToLogin()">Already have an account? Login</p>
    `;
  } else {
    box.innerHTML = `
      <h2>Login</h2>
      <input type="email" id="loginEmail" placeholder="Email"><br>
      <input type="password" id="loginPassword" placeholder="Password"><br>
      <button onclick="submitLogin()">Login</button><br>
      <button class="close-btn" onclick="closePopup()">Close</button>
      <p class="switch" onclick="switchToSignup()">Don't have an account? Sign Up</p>
    `;
  }

  overlay.appendChild(box);
  document.body.appendChild(overlay);
}

function switchToLogin() { createPopup('login'); }
function switchToSignup() { createPopup('signup'); }

// ✅ Signup - POST request
async function submitSignup() {
  const userData = {
    name: document.getElementById("name").value.trim(),
    email: document.getElementById("email").value.trim(),
    password: document.getElementById("password").value.trim()
  };

  if (!userData.name || !userData.email || !userData.password) {
    alert("All fields are required!");
    return;
  }

  try {
    let res = await fetch(`${BASE_URL}/registration`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData)
    });

    if (res.ok) {
      alert("Signup successful!");
      closePopup();
    } else {
      alert("Signup failed. Try again.");
    }
  } catch (error) {
    console.error("Error during signup:", error);
    alert("Error connecting to server.");
  }
}

// ✅ Login - GET request with parameters
async function submitLogin() {
  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value.trim();

  if (!email || !password) {
    alert("Please enter email and password.");
    return;
  }

  try {
    // encodeURIComponent() prevents URL errors
    const url = `http://localhost:8081/login?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`;

    const res = await fetch(url);

    if (res.ok) {
      const user = await res.json();

      if (user && user.email) {
        alert("Login successful! Welcome, " + user.name);
        closePopup();
        window.location.href = "user.html";
      } else {
        alert("Invalid email or password.");
      }
    } else {
      alert("Invalid login response from server.");
    }
  } catch (error) {
    console.error("Error during login:", error);
    alert("Error connecting to server.");
  }
}

// Close popup
function closePopup() {
  const overlay = document.getElementById("popupOverlay");
  if (overlay) overlay.remove();
}
