async function addToCart(packageName, price, imageUrl) {
    const user = firebase.auth().currentUser;

    if (!user) {
        window.location = "login.html";
        return;
    }

    await db.collection("users")
        .doc(user.uid)
        .collection("cart")
        .add({
            packageName,
            price,
            imageUrl,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });

    alert("Added to cart!");
    loadCart();
}

async function removeFromCart(docId) {
    const user = firebase.auth().currentUser;

    if (!user) {
        window.location = "login.html";
        return;
    }

    await db.collection("users")
        .doc(user.uid)
        .collection("cart")
        .doc(docId)
        .delete();

    loadCart();
}

async function loadCart() {

    const user = firebase.auth().currentUser;

    if (!user) {
        window.location = "login.html";
        return;
    }

    const cartContainer = document.getElementById("cartItems");
    const totalElement = document.getElementById("cartTotal");

    const snapshot = await db.collection("users")
        .doc(user.uid)
        .collection("cart")
        .get();

    cartContainer.innerHTML = "";
    let total = 0;

    if (snapshot.empty) {
        totalElement.innerText = "Total: Rs 0";
        return;
    }

    snapshot.forEach(doc => {

        const data = doc.data();
        total += Number(data.price) || 0;

        cartContainer.innerHTML += `
            <div class="cart-item">
                <h3>${data.packageName}</h3>
                <p>Rs ${data.price}</p>
                <button onclick="removeFromCart('${doc.id}')">Remove</button>
            </div>
        `;
    });

    totalElement.innerText = "Total: Rs " + total;
}

async function checkout() {
    const user = firebase.auth().currentUser;

    if (!user) {
        window.location = "login.html";
        return;
    }

    const snapshot = await db.collection("users")
        .doc(user.uid)
        .collection("cart")
        .get();

    if (snapshot.empty) {
        alert("Your cart is empty.");
        return;
    }

    const batch = db.batch();
    snapshot.forEach((doc) => {
        batch.delete(doc.ref);
    });
    await batch.commit();

    alert("Checkout successful. Thank you for your purchase.");
    loadCart();
}

window.addToCart = addToCart;
window.removeFromCart = removeFromCart;

document.getElementById("checkoutBtn")?.addEventListener("click", checkout);

firebase.auth().onAuthStateChanged((user) => {
    if (!user) {
        window.location = "login.html";
        return;
    }
    loadCart();
});
