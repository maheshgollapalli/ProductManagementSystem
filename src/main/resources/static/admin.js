// Fetch and display all products
async function showData() {
    try {
        let res = await fetch("http://localhost:8081/products");
        if (!res.ok) throw new Error("Data not found");

        let data = await res.json();
        getData(data);
    } catch (error) {
        console.error(error);
    }
}

showData();

// Render product cards dynamically
function getData(data) {
    let container = document.getElementById("container");
    container.innerHTML = ""; // clear before reloading

    data.forEach(obj => {
        let card = document.createElement("div");
        card.className = "product-card";
        card.innerHTML = `
            <h3>${obj.title}</h3>
            <img src="${obj.image}" class="image" alt="Product Image">
            <p><strong>Price:</strong> ₹${obj.price}</p>
            <p><strong>Description:</strong> ${obj.description}</p>
            <p><strong>Category:</strong> ${obj.category}</p>
            <p><strong>Rating:</strong> ${obj.rate}</p>
            <p><strong>Quantity:</strong> ${obj.count}</p>
            <div style="margin-top:auto; display:flex; justify-content:center;">
                <button id="deletebtn${obj.id}">Delete</button>
                <button id="editbtn${obj.id}">Edit</button>
            </div>
        `;
        container.appendChild(card);

        // Button handlers
        document.getElementById(`deletebtn${obj.id}`).onclick = () => deleteProduct(obj.id);
        document.getElementById(`editbtn${obj.id}`).onclick = () => editProduct(obj.id);
    });
}

// Delete a product
async function deleteProduct(id) {
    try {
        let res = await fetch(`http://localhost:8081/products/${id}`, { method: "DELETE" });
        if (!res.ok) throw new Error("Data not deleted");

        alert("Product deleted successfully");
        showData();
    } catch (error) {
        console.log(error);
    }
}

// Edit product — populate form and scroll up
async function editProduct(id) {
    try {
        let res = await fetch(`http://localhost:8081/products/${id}`);
        if (!res.ok) throw new Error("Data not fetched");

        let item = await res.json();

        document.getElementById("id").value = item.id;
        document.getElementById("name").value = item.title;
        document.getElementById("price").value = item.price;
        document.getElementById("description").value = item.description;
        document.getElementById("category").value = item.category;
        document.getElementById("image").value = item.image;
        document.getElementById("rating").value = item.rate;
        document.getElementById("quantity").value = item.count;

        // Smooth scroll to form
        document.getElementById("product").scrollIntoView({ behavior: "smooth" });
    } catch (error) {
        console.log(error);
    }
}

// Add or update product
async function sendData() {
    let productId = document.getElementById("id").value;
    let name = document.getElementById("name").value.trim();
    let price = document.getElementById("price").value.trim();
    let description = document.getElementById("description").value.trim();
    let category = document.getElementById("category").value.trim();
    let image = document.getElementById("image").value.trim();
    let rating = document.getElementById("rating").value.trim();
    let quantity = document.getElementById("quantity").value.trim();

    let obj = {
        title: name,
        price: price,
        description: description,
        category: category,
        image: image,
        rate: rating,
        count: quantity
    };

    let URL, method;

    if (productId) {
        URL = `http://localhost:8081/products/${productId}`;
        method = "PUT";
        obj.id = Number(productId);
    } else {
        URL = "http://localhost:8081/products";
        method = "POST";
    }

    try {
        let res = await fetch(URL, {
            method: method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(obj)
        });

        if (!res.ok) throw new Error("Failed to save data");

        alert(productId ? "Product updated successfully!" : "Product added successfully!");
        document.getElementById("product").reset();
        showData();
    } catch (error) {
        console.log(error);
    }
}
