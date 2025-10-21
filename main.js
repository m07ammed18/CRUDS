let title = document.getElementById("title");
let price = document.getElementById("price");
let taxes = document.getElementById("taxes");
let ads = document.getElementById("ads");
let discount = document.getElementById("discount");
let category = document.getElementById("category");
let count = document.getElementById("count");
let total = document.getElementById("total");
let submitBtn = document.getElementById("submit");
let mode = "create";
let tmp;

let dataStock = JSON.parse(localStorage.product || "[]");

// Get total
function getTotal() {
  if (price.value !== "") {
    let result = +price.value + +taxes.value + +ads.value - +discount.value;
    total.innerHTML = result;
    total.style.backgroundColor = "#28a745";
  } else {
    total.innerHTML = "";
    total.style.backgroundColor = "#dc3545";
  }
}

// C => Create new product
submitBtn.onclick = () => {
  let newProduct = {
    title: title.value.trim().toLowerCase(),
    category: category.value.trim().toLowerCase(),
    price: +price.value || 0,
    taxes: +taxes.value || 0,
    ads: +ads.value || 0,
    discount: +discount.value || 0,
    total: +total.innerHTML,
    count: +count.value || 1,
  };

  if (
    title.value != "" &&
    price.value != "" &&
    category.value != "" &&
    newProduct.count < 100
  ) {
    if (mode === "create") {
      // Create many data in one time
      if (newProduct.count > 1) {
        for (let i = 0; i < newProduct.count; i++) {
          dataStock.push(newProduct);
        }
      } else {
        dataStock.push(newProduct);
      }
    } else {
      dataStock[tmp] = newProduct;
      mode = "create";
      submitBtn.innerHTML = "Create";
      count.style.display = "block";
    }
    clearInputs();
  }

  // Save to localstorage
  localStorage.setItem("product", JSON.stringify(dataStock));
  showData();
};

// Clear inputs
function clearInputs() {
  title.value = "";
  price.value = "";
  taxes.value = "";
  ads.value = "";
  discount.value = "";
  category.value = "";
  count.value = "";
  total.innerHTML = "";
  total.style.backgroundColor = "#dc3545";
}

// Render one row
function renderRow(product, i) {
  return `
    <tr>
      <td>${i + 1}</td>
      <td>${product.title}</td>
      <td>${product.category}</td>
      <td>${product.price}</td>
      <td>${product.taxes}</td>
      <td>${product.ads}</td>
      <td>${product.discount}</td>
      <td>${product.total}</td>
      <td><button onclick="update(${i})" class="btn btn--success">Update</button></td>
      <td><button onclick="deleteProduct(${i})" class="btn btn--danger">Delete</button></td>
    </tr>
    `;
}

// R => Read prudacts
function showData() {
  const tbody = document.getElementById("tbody");
  tbody.innerHTML = dataStock.map(renderRow).join("");

  const deleteAll = document.getElementById("delete-all");
  if (dataStock.length > 0) {
    deleteAll.innerHTML = `<button onclick="deleteAllData()" class="btn btn--danger">Delete All (${dataStock.length})</button>`;
  } else {
    deleteAll.innerHTML = "";
  }
}
showData();

// U => Update data
function update(index) {
  let product = dataStock[index];
  title.value = product.title;
  price.value = product.price;
  taxes.value = product.taxes;
  ads.value = product.ads;
  discount.value = product.discount;
  category.value = product.category;
  getTotal();
  count.style.display = "none";
  submitBtn.innerHTML = "Update";
  mode = "update";
  tmp = index;
  scroll({
    top: 0,
    behavior: "smooth",
  });
}

// D => Delet one product
function deleteProduct(index) {
  dataStock.splice(index, 1);
  localStorage.setItem("product", JSON.stringify(dataStock));
  showData();
}

// Delete all Products
function deleteAllData() {
  if (confirm("Are you sure you want to delete all products?")) {
    localStorage.removeItem("product")
    dataStock = [];
    showData();
  }
}

// S => Search
let searchMode = "title";

function getSearchMode(id) {
  let searchInput = document.getElementById("search");
  searchMode = id === "search-title" ? "title" : "category";
  searchInput.placeholder = "Search by " + searchMode;
  searchInput.focus();
  searchInput.value = "";
  showData();
}

function search(value) {
  value = value.toLowerCase().trim();
  const filtered = dataStock.filter((p) => p[searchMode].includes(value));
  const tbody = document.getElementById("tbody");
  if (filtered.length > 0) {
    tbody.innerHTML = filtered.map(renderRow).join("");
  } else {
    tbody.innerHTML = `<tr><td colspan="10" style="text-align: center; font-size: 16px">No results found</td></tr>`;
  }
}
